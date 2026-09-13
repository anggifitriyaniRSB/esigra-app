import { describe, it, expect, beforeEach, vi } from 'vitest';

// Each service module seeds its localStorage collection on import (once,
// at module load). We reset both localStorage and Vitest's module registry
// before each test so every test gets a freshly-seeded, isolated dataset.
async function freshServices() {
  localStorage.clear();
  vi.resetModules();
  const authService = (await import('../services/authService')).authService;
  const maternalService = (await import('../services/maternalService')).maternalService;
  const screeningService = (await import('../services/screeningService')).screeningService;
  const followUpService = (await import('../services/followUpService')).followUpService;
  const notificationService = (await import('../services/notificationService')).notificationService;
  return { authService, maternalService, screeningService, followUpService, notificationService };
}

describe('end-to-end screening + validation + follow-up lifecycle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('runs the full demo flow: login -> screen -> alert -> validate -> follow-up -> complete', async () => {
    const { authService, maternalService, screeningService, followUpService, notificationService } =
      await freshServices();

    // 1. Login as pregnant woman (demo account)
    const ibu = authService.login('demo.ibu@esigra.test', 'Demo123!');
    expect(ibu).not.toBeNull();
    expect(ibu?.role).toBe('IBU_HAMIL');

    const mother = maternalService.getByUserId(ibu!.id);
    expect(mother).toBeDefined();

    // 2-7. Submit a high-risk screening (headache + blurred vision + swelling)
    const screening = screeningService.submitScreening({
      motherId: mother!.id,
      symptomCodes: ['sakit_kepala_berat', 'penglihatan_kabur', 'bengkak_wajah_tangan'],
      vitals: {},
      actorId: ibu!.id,
      actorRole: ibu!.role,
    });
    expect(screening.riskLevel).toBe('TINGGI');
    expect(screening.validationStatus).toBe('BELUM_DIVALIDASI');
    expect(screening.suspectConditions.length).toBeGreaterThan(0);

    // 8. High risk creates a notification for the assigned Nakes
    const nakesNotifs = notificationService.listForUser(mother!.assignedHealthcareWorkerId!);
    expect(nakesNotifs.some((n) => n.type === 'HIGH_RISK_ALERT')).toBe(true);

    // 9-10. Login as Nakes, dashboard shows the new priority patient
    const nakes = authService.login('demo.nakes@esigra.test', 'Demo123!');
    expect(nakes?.role).toBe('NAKES');
    const pending = screeningService.listPendingValidation();
    expect(pending.some((s) => s.id === screening.id)).toBe(true);

    // 11-13. Open patient, review, validate
    const validated = screeningService.validate(screening.id, nakes!.id, nakes!.role);
    expect(validated?.validationStatus).toBe('DIVALIDASI');
    expect(validated?.lifecycleStatus).toBe('VALIDATED');

    // Validated screening leaves the pending queue (Scenario E)
    const pendingAfter = screeningService.listPendingValidation();
    expect(pendingAfter.some((s) => s.id === screening.id)).toBe(false);

    // 14-15. Create follow-up, status becomes FOLLOW_UP_REQUIRED / AKTIF
    const followUp = followUpService.create({
      screeningId: screening.id,
      motherId: mother!.id,
      healthcareWorkerId: nakes!.id,
      healthcareWorkerRole: nakes!.role,
      action: 'Rujukan evaluasi lanjutan',
      notes: 'Dirujuk untuk pemeriksaan tekanan darah lanjutan.',
      referral: true,
      referralFacility: 'RSUD Kota Bandung',
    });
    expect(followUp).toBeDefined();
    const afterFollowUp = screeningService.getById(screening.id);
    expect(afterFollowUp?.followUpStatus).toBe('AKTIF');
    expect(afterFollowUp?.lifecycleStatus).toBe('FOLLOW_UP_REQUIRED');

    // 16. Mother sees follow-up status
    const motherFollowUps = followUpService.listByMother(mother!.id);
    expect(motherFollowUps.some((f) => f.id === followUp!.id)).toBe(true);

    // Scenario G: follow-up completed
    followUpService.complete(followUp!.id, nakes!.id, nakes!.role);
    const afterComplete = screeningService.getById(screening.id);
    expect(afterComplete?.followUpStatus).toBe('SELESA' + 'I');
    expect(afterComplete?.lifecycleStatus).toBe('FOLLOW_UP_COMPLETED');
  });

  it('does not raise a high-risk alert for a low-risk screening (Scenario A)', async () => {
    const { authService, maternalService, screeningService, notificationService } = await freshServices();
    const ibu = authService.login('demo.ibu@esigra.test', 'Demo123!');
    const mother = maternalService.getByUserId(ibu!.id);

    const before = notificationService.listForUser(mother!.assignedHealthcareWorkerId!).length;
    const screening = screeningService.submitScreening({
      motherId: mother!.id,
      symptomCodes: [],
      vitals: {},
      actorId: ibu!.id,
      actorRole: ibu!.role,
    });
    const after = notificationService.listForUser(mother!.assignedHealthcareWorkerId!).length;

    expect(screening.riskLevel).toBe('RENDAH');
    expect(after).toBe(before);
  });

  it('rejects login with an incorrect password', async () => {
    const { authService } = await freshServices();
    const result = authService.login('demo.ibu@esigra.test', 'wrong-password');
    expect(result).toBeNull();
  });

  it('resolves a QR token to a minimum-necessary summary without exposing raw PHI', async () => {
    const { maternalService } = await freshServices();
    const { qrService } = await import('../services/qrService');
    const mothers = maternalService.listAll();
    const target = mothers[0];

    const summary = qrService.resolveToken(target.qrToken, 'user_nakes_01', 'NAKES');
    expect(summary).not.toBeNull();
    expect(summary?.name).toBe(target.name);
    // Masked phone must not equal the raw phone number
    expect(summary?.maskedPhone).not.toBe(target.phone);
  });
});
