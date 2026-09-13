import { describe, it, expect, beforeEach, vi } from 'vitest';

async function freshServices() {
  localStorage.clear();
  vi.resetModules();
  const authService = (await import('../services/authService')).authService;
  const maternalService = (await import('../services/maternalService')).maternalService;
  const screeningService = (await import('../services/screeningService')).screeningService;
  const followUpService = (await import('../services/followUpService')).followUpService;
  const qrService = (await import('../services/qrService')).qrService;
  return { authService, maternalService, screeningService, followUpService, qrService };
}

describe('Clinical UX safety cases (spec section 34)', () => {
  beforeEach(() => localStorage.clear());

  it('CASE A — low risk: minimal symptoms classify as RENDAH, no diagnosis text produced', async () => {
    const { screeningService, maternalService, authService } = await freshServices();
    const ibu = authService.login('demo.ibu@esigra.test', 'Demo123!');
    const mother = maternalService.getByUserId(ibu!.id)!;

    const screening = screeningService.submitScreening({
      motherId: mother.id,
      symptomCodes: ['jantung_berdebar'],
      vitals: {},
      actorId: ibu!.id,
      actorRole: ibu!.role,
    });
    expect(screening.riskLevel).toBe('RENDAH');
    expect(screening.suspectConditions).toHaveLength(0);
  });

  it('CASE B — medium risk: prototype medium-risk combination classifies as SEDANG', async () => {
    const { screeningService, maternalService, authService } = await freshServices();
    const ibu = authService.login('demo.ibu@esigra.test', 'Demo123!');
    const mother = maternalService.getByUserId(ibu!.id)!;

    const screening = screeningService.submitScreening({
      motherId: mother.id,
      symptomCodes: ['tekanan_darah_140_90', 'sesak_napas', 'jantung_berdebar'],
      vitals: {},
      actorId: ibu!.id,
      actorRole: ibu!.role,
    });
    expect(screening.riskLevel).toBe('SEDANG');
  });

  it('CASE C — high risk: high-scoring combination classifies as TINGGI', async () => {
    const { screeningService, maternalService, authService } = await freshServices();
    const ibu = authService.login('demo.ibu@esigra.test', 'Demo123!');
    const mother = maternalService.getByUserId(ibu!.id)!;

    const screening = screeningService.submitScreening({
      motherId: mother.id,
      symptomCodes: ['sakit_kepala_berat', 'penglihatan_kabur', 'bengkak_wajah_tangan'],
      vitals: {},
      actorId: ibu!.id,
      actorRole: ibu!.role,
    });
    expect(screening.riskLevel).toBe('TINGGI');
  });

  it('CASE D — suspect combination: recognized combination attaches a screening indication, not a diagnosis label', async () => {
    const { screeningService, maternalService, authService } = await freshServices();
    const ibu = authService.login('demo.ibu@esigra.test', 'Demo123!');
    const mother = maternalService.getByUserId(ibu!.id)!;

    const screening = screeningService.submitScreening({
      motherId: mother.id,
      symptomCodes: ['nyeri_uluhati', 'muntah_berlebihan'],
      vitals: {},
      actorId: ibu!.id,
      actorRole: ibu!.role,
    });
    expect(screening.suspectConditions.some((s) => s.label.includes('Suspect'))).toBe(true);
    // Never a bare/definitive diagnosis label such as "HELLP Syndrome" alone
    expect(screening.suspectConditions.every((s) => /suspect/i.test(s.label))).toBe(true);
  });

  it('CASE E — false reassurance: a single high-concern symptom must not be diluted to RENDAH by additive scoring', async () => {
    const { screeningService, maternalService, authService } = await freshServices();
    const ibu = authService.login('demo.ibu@esigra.test', 'Demo123!');
    const mother = maternalService.getByUserId(ibu!.id)!;

    // perdarahan_vagina alone scores 10, which is BELOW the SEDANG threshold
    // of 15. Without the critical-indicator override this would incorrectly
    // read as RENDAH ("low risk / safe"), which is exactly the false
    // reassurance failure mode this test guards against.
    const screening = screeningService.submitScreening({
      motherId: mother.id,
      symptomCodes: ['perdarahan_vagina'],
      vitals: {},
      actorId: ibu!.id,
      actorRole: ibu!.role,
    });
    expect(screening.score).toBeLessThan(15);
    expect(screening.riskLevel).not.toBe('RENDAH');
  });

  it('CASE F — unauthorized access: Mother A cannot open Mother B\'s screening result via getByIdForActor', async () => {
    const { screeningService, maternalService } = await freshServices();
    const mothers = maternalService.listAll();
    const motherA = mothers[0];
    const motherB = mothers[1];

    const screeningB = screeningService.submitScreening({
      motherId: motherB.id,
      symptomCodes: ['pusing_berat'],
      vitals: {},
      actorId: motherB.userId,
      actorRole: 'IBU_HAMIL',
    });

    const asMotherA = screeningService.getByIdForActor(screeningB.id, {
      id: motherA.userId,
      role: 'IBU_HAMIL',
      motherId: motherA.id,
    });
    expect(asMotherA).toBeUndefined();

    // Confirm it does exist and IS visible to its rightful owner
    const asMotherB = screeningService.getByIdForActor(screeningB.id, {
      id: motherB.userId,
      role: 'IBU_HAMIL',
      motherId: motherB.id,
    });
    expect(asMotherB?.id).toBe(screeningB.id);
  });

  it('CASE F2 — a Nakes not assigned to a mother cannot be authorized over her record', async () => {
    const { maternalService } = await freshServices();
    const { isAssignedOrAdmin } = await import('../services/authorization');
    const mother = maternalService.listAll()[0];

    expect(isAssignedOrAdmin('NAKES', 'some_other_nakes_id', mother.assignedHealthcareWorkerId)).toBe(false);
    expect(isAssignedOrAdmin('NAKES', mother.assignedHealthcareWorkerId!, mother.assignedHealthcareWorkerId)).toBe(true);
    expect(isAssignedOrAdmin('ADMIN', 'any_admin_id', mother.assignedHealthcareWorkerId)).toBe(true);
  });

  it('CASE G — QR invalid: an unrecognized token resolves to null with no PHI disclosed', async () => {
    const { qrService } = await freshServices();
    const summary = qrService.resolveToken('ESG-DOESNOTEXIST', 'user_nakes_01', 'NAKES');
    expect(summary).toBeNull();
  });

  it('CASE H — QR revoked: a revoked token resolves to null, identical to an invalid token', async () => {
    const { qrService, maternalService } = await freshServices();
    const mother = maternalService.listAll()[0];
    const token = mother.qrToken;

    // Sanity check: resolves fine before revocation
    expect(qrService.resolveToken(token, 'user_nakes_01', 'NAKES')).not.toBeNull();

    maternalService.revokeQr(mother.id, 'user_nakes_01', 'NAKES');
    const afterRevoke = qrService.resolveToken(token, 'user_nakes_01', 'NAKES');
    expect(afterRevoke).toBeNull();
  });

  it('CASE G2 — QR scan is denied for a role without scanQR permission (e.g. a mother)', async () => {
    const { qrService, maternalService } = await freshServices();
    const mother = maternalService.listAll()[0];
    const result = qrService.resolveToken(mother.qrToken, mother.userId, 'IBU_HAMIL');
    expect(result).toBeNull();
  });

  it('CASE I — duplicate submission: rapid identical resubmission returns the same record, not a second one', async () => {
    const { screeningService, maternalService, authService } = await freshServices();
    const ibu = authService.login('demo.ibu@esigra.test', 'Demo123!');
    const mother = maternalService.getByUserId(ibu!.id)!;

    const before = screeningService.listByMother(mother.id).length;
    const first = screeningService.submitScreening({
      motherId: mother.id,
      symptomCodes: ['pusing_berat'],
      vitals: {},
      actorId: ibu!.id,
      actorRole: ibu!.role,
    });
    const second = screeningService.submitScreening({
      motherId: mother.id,
      symptomCodes: ['pusing_berat'],
      vitals: {},
      actorId: ibu!.id,
      actorRole: ibu!.role,
    });
    const after = screeningService.listByMother(mother.id).length;

    expect(second.id).toBe(first.id);
    expect(after).toBe(before + 1);
  });

  it('CASE J — invalid follow-up transition: completing an already-completed follow-up is a no-op', async () => {
    const { followUpService, screeningService, maternalService, authService } = await freshServices();
    const ibu = authService.login('demo.ibu@esigra.test', 'Demo123!');
    const nakes = authService.login('demo.nakes@esigra.test', 'Demo123!');
    const mother = maternalService.getByUserId(ibu!.id)!;

    const screening = screeningService.submitScreening({
      motherId: mother.id,
      symptomCodes: ['sakit_kepala_berat', 'penglihatan_kabur', 'bengkak_wajah_tangan'],
      vitals: {},
      actorId: ibu!.id,
      actorRole: ibu!.role,
    });
    screeningService.validate(screening.id, nakes!.id, nakes!.role);
    const followUp = followUpService.create({
      screeningId: screening.id,
      motherId: mother.id,
      healthcareWorkerId: nakes!.id,
      healthcareWorkerRole: nakes!.role,
      action: 'Evaluasi lanjutan',
      notes: 'Catatan',
      referral: false,
    })!;

    const firstComplete = followUpService.complete(followUp.id, nakes!.id, nakes!.role);
    expect(firstComplete?.status).toBe('SELESAI');
    const completedAtFirst = firstComplete?.completedAt;

    // Attempt to "complete" it again — must not change completedAt or throw
    const secondComplete = followUpService.complete(followUp.id, nakes!.id, nakes!.role);
    expect(secondComplete?.status).toBe('SELESAI');
    expect(secondComplete?.completedAt).toBe(completedAtFirst);
  });

  it('validate() is denied for a role without validateScreening permission', async () => {
    const { screeningService, maternalService, authService } = await freshServices();
    const ibu = authService.login('demo.ibu@esigra.test', 'Demo123!');
    const mother = maternalService.getByUserId(ibu!.id)!;
    const screening = screeningService.submitScreening({
      motherId: mother.id,
      symptomCodes: ['pusing_berat'],
      vitals: {},
      actorId: ibu!.id,
      actorRole: ibu!.role,
    });

    // A mother cannot validate her own screening.
    const result = screeningService.validate(screening.id, ibu!.id, 'IBU_HAMIL');
    expect(result).toBeUndefined();
    const stillPending = screeningService.getById(screening.id);
    expect(stillPending?.validationStatus).toBe('BELUM_DIVALIDASI');
  });
});
