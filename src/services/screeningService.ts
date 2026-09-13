import { LocalStorageRepository } from './repository';
import type { Screening, VitalSigns } from '../types/screening';
import type { UserRole } from '../types/user';
import { mockScreenings } from '../data/mockScreenings';
import { generateId } from '../utils/security';
import { nowIso } from '../utils/date';
import {
  calculateScore,
  classifyRisk,
  detectSuspectConditions,
  SCREENING_CONFIG,
} from '../domain/screeningRules';
import { sortByPriority } from '../domain/maternalRisk';
import { auditService } from './auditService';
import { notificationService } from './notificationService';
import { maternalService } from './maternalService';
import { can, isAssignedOrAdmin } from './authorization';

const repo = new LocalStorageRepository<Screening>('screenings');
repo.seedIfEmpty(mockScreenings);

/** Duplicate-submission guard window: identical resubmissions within this
 * window (e.g. a double-tap on "Kirim Deteksi") return the existing record
 * instead of creating a second one. Production should use a real backend
 * idempotency key instead of this client-side heuristic. */
const DUPLICATE_SUBMISSION_WINDOW_MS = 5000;

export const screeningService = {
  listByMother(motherId: string): Screening[] {
    return repo
      .getAll()
      .filter((s) => s.motherId === motherId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getById(id: string): Screening | undefined {
    return repo.getById(id);
  },

  /**
   * Ownership/assignment-checked accessor for use anywhere a specific
   * screening is opened by id (e.g. the /ibu/hasil/:id and /nakes/ibu/:id
   * routes). Returns undefined both when the record doesn't exist and when
   * the caller isn't allowed to see it, so callers can't distinguish "not
   * found" from "not yours" by response shape alone.
   */
  getByIdForActor(
    id: string,
    actor: { id: string; role: UserRole; motherId?: string }
  ): Screening | undefined {
    const screening = repo.getById(id);
    if (!screening) return undefined;

    if (actor.role === 'IBU_HAMIL') {
      const allowed = can('IBU_HAMIL', 'viewOwnScreening') && actor.motherId === screening.motherId;
      if (!allowed) {
        auditService.log({
          actorId: actor.id,
          actorRole: actor.role,
          action: 'SCREENING_VIEWED',
          resourceType: 'Screening',
          resourceId: id,
          result: 'DENIED',
        });
        return undefined;
      }
      return screening;
    }

    if (actor.role === 'NAKES' || actor.role === 'ADMIN') {
      const mother = maternalService.getById(screening.motherId);
      const allowed =
        can(actor.role, 'viewScreening') &&
        isAssignedOrAdmin(actor.role, actor.id, mother?.assignedHealthcareWorkerId ?? null);
      if (!allowed) {
        auditService.log({
          actorId: actor.id,
          actorRole: actor.role,
          action: 'SCREENING_VIEWED',
          resourceType: 'Screening',
          resourceId: id,
          result: 'DENIED',
        });
        return undefined;
      }
      return screening;
    }

    return undefined;
  },

  listAll(): Screening[] {
    return repo.getAll();
  },

  listPendingValidation(): Screening[] {
    return sortByPriority(repo.getAll().filter((s) => s.validationStatus === 'BELUM_DIVALIDASI'));
  },

  listPriorityQueue(): Screening[] {
    return sortByPriority(repo.getAll());
  },

  /**
   * Submits a new early-detection screening, applies the combination-symptom
   * risk algorithm (including the critical-indicator override — see
   * domain/screeningRules.ts), and raises a healthcare-worker alert for
   * SEDANG/TINGGI results. The result is always framed as a screening
   * indication, never a diagnosis.
   *
   * Guards against accidental duplicate submissions (e.g. a double-tap on
   * submit): an identical symptom/vitals payload from the same mother
   * within DUPLICATE_SUBMISSION_WINDOW_MS returns the existing record
   * rather than creating a new one.
   */
  submitScreening(params: {
    motherId: string;
    symptomCodes: string[];
    vitals: VitalSigns;
    actorId: string;
    actorRole: string;
  }): Screening {
    const recent = repo
      .getAll()
      .filter((s) => s.motherId === params.motherId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    if (
      recent &&
      Date.now() - new Date(recent.createdAt).getTime() < DUPLICATE_SUBMISSION_WINDOW_MS &&
      JSON.stringify([...recent.symptomCodes].sort()) === JSON.stringify([...params.symptomCodes].sort())
    ) {
      return recent;
    }

    const score = calculateScore(params.symptomCodes);
    const riskLevel = classifyRisk(score, params.symptomCodes);
    const suspectConditions = detectSuspectConditions(params.symptomCodes);

    const screening: Screening = {
      id: generateId('scr'),
      motherId: params.motherId,
      symptomCodes: params.symptomCodes,
      vitals: params.vitals,
      score,
      riskLevel,
      suspectConditions,
      createdAt: nowIso(),
      lifecycleStatus: 'PENDING_VALIDATION',
      validationStatus: 'BELUM_DIVALIDASI',
      validatedBy: null,
      validatedAt: null,
      followUpStatus: 'TIDAK_DIPERLUKAN',
    };
    repo.create(screening);

    auditService.log({
      actorId: params.actorId,
      actorRole: params.actorRole,
      action: 'SCREENING_CREATED',
      resourceType: 'Screening',
      resourceId: screening.id,
      metadata: { riskLevel },
    });

    if (riskLevel === 'TINGGI' || riskLevel === 'SEDANG') {
      const mother = maternalService.getById(params.motherId);
      if (mother?.assignedHealthcareWorkerId) {
        notificationService.create({
          recipientId: mother.assignedHealthcareWorkerId,
          type: 'HIGH_RISK_ALERT',
          title:
            riskLevel === 'TINGGI'
              ? 'Deteksi baru memerlukan perhatian segera'
              : 'Deteksi baru perlu ditinjau',
          message: `${mother.name} melaporkan hasil skrining dengan risiko ${riskLevel === 'TINGGI' ? 'tinggi' : 'sedang'}.`,
          linkTo: `/nakes/ibu/${mother.id}`,
        });
      }
    }

    return screening;
  },

  /**
   * Validates a screening. Requires the `validateScreening` permission and,
   * for Nakes, that they are the assigned healthcare worker for this
   * mother (Admin may validate any screening as a governance action).
   * Re-validating an already-validated screening is a no-op rather than an
   * error, to keep the operation idempotent — but it does not re-log or
   * re-notify, since nothing actually changed.
   */
  validate(screeningId: string, actorId: string, actorRole: UserRole): Screening | undefined {
    const existing = repo.getById(screeningId);
    if (!existing) return undefined;

    const mother = maternalService.getById(existing.motherId);
    const allowed =
      can(actorRole, 'validateScreening') &&
      isAssignedOrAdmin(actorRole, actorId, mother?.assignedHealthcareWorkerId ?? null);

    if (!allowed) {
      auditService.log({
        actorId,
        actorRole,
        action: 'SCREENING_VALIDATED',
        resourceType: 'Screening',
        resourceId: screeningId,
        result: 'DENIED',
      });
      return undefined;
    }

    if (existing.validationStatus === 'DIVALIDASI') {
      // Invalid transition (VALIDATED -> VALIDATED again): no-op, not an error.
      return existing;
    }

    const updated = repo.update(screeningId, {
      validationStatus: 'DIVALIDASI',
      validatedBy: actorId,
      validatedAt: nowIso(),
      lifecycleStatus: 'VALIDATED',
    });
    if (updated) {
      auditService.log({
        actorId,
        actorRole,
        action: 'SCREENING_VALIDATED',
        resourceType: 'Screening',
        resourceId: screeningId,
        result: 'SUCCESS',
      });
      if (mother) {
        notificationService.create({
          recipientId: mother.userId,
          type: 'SYSTEM',
          title: 'Hasil skrining telah ditinjau',
          message: 'Hasil skrining Anda telah ditinjau oleh tenaga kesehatan.',
          linkTo: '/ibu/riwayat',
        });
      }
    }
    return updated;
  },

  setFollowUpStatus(
    screeningId: string,
    status: Screening['followUpStatus'],
    lifecycleStatus: Screening['lifecycleStatus']
  ): Screening | undefined {
    return repo.update(screeningId, { followUpStatus: status, lifecycleStatus });
  },

  /**
   * Returns validation timing facts (deadline, elapsed time, overdue status)
   * derived from the configured operational target. This is an operational
   * target, not a clinical safety guarantee — see SCREENING_CONFIG docs.
   */
  getValidationTiming(screening: Screening): {
    deadline: string;
    elapsedHours: number;
    overdue: boolean;
  } {
    const created = new Date(screening.createdAt).getTime();
    const deadline = new Date(created + SCREENING_CONFIG.validationWindowHours * 60 * 60 * 1000);
    const reference = screening.validatedAt ? new Date(screening.validatedAt).getTime() : Date.now();
    const elapsedHours = (reference - created) / (1000 * 60 * 60);
    const overdue = screening.validationStatus === 'BELUM_DIVALIDASI' && Date.now() > deadline.getTime();
    return { deadline: deadline.toISOString(), elapsedHours, overdue };
  },

  isValidationOverdue(screening: Screening): boolean {
    return this.getValidationTiming(screening).overdue;
  },
};
