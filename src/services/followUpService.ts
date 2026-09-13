import { LocalStorageRepository } from './repository';
import type { FollowUp } from '../types/notification';
import type { UserRole } from '../types/user';
import { mockFollowUps } from '../data/mockFollowUps';
import { generateId } from '../utils/security';
import { nowIso } from '../utils/date';
import { auditService } from './auditService';
import { screeningService } from './screeningService';
import { maternalService } from './maternalService';
import { can, isAssignedOrAdmin } from './authorization';

const repo = new LocalStorageRepository<FollowUp>('followups');
repo.seedIfEmpty(mockFollowUps);

export const followUpService = {
  listByMother(motherId: string): FollowUp[] {
    return repo
      .getAll()
      .filter((f) => f.motherId === motherId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  listActive(): FollowUp[] {
    return repo.getAll().filter((f) => f.status === 'AKTIF');
  },

  listAll(): FollowUp[] {
    return repo.getAll();
  },

  /**
   * Creates a follow-up. Requires `createFollowUp` and, for Nakes, that
   * they are the assigned healthcare worker for this mother.
   */
  create(params: {
    screeningId: string;
    motherId: string;
    healthcareWorkerId: string;
    healthcareWorkerRole: UserRole;
    action: string;
    notes: string;
    referral: boolean;
    referralFacility?: string;
  }): FollowUp | undefined {
    const mother = maternalService.getById(params.motherId);
    const allowed =
      can(params.healthcareWorkerRole, 'createFollowUp') &&
      isAssignedOrAdmin(params.healthcareWorkerRole, params.healthcareWorkerId, mother?.assignedHealthcareWorkerId ?? null);

    if (!allowed) {
      auditService.log({
        actorId: params.healthcareWorkerId,
        actorRole: params.healthcareWorkerRole,
        action: 'FOLLOWUP_CREATED',
        resourceType: 'FollowUp',
        resourceId: params.screeningId,
        result: 'DENIED',
      });
      return undefined;
    }

    const followUp: FollowUp = {
      id: generateId('fu'),
      screeningId: params.screeningId,
      motherId: params.motherId,
      healthcareWorkerId: params.healthcareWorkerId,
      action: params.action,
      notes: params.notes,
      referral: params.referral,
      referralFacility: params.referralFacility,
      status: 'AKTIF',
      createdAt: nowIso(),
      completedAt: null,
    };
    repo.create(followUp);
    screeningService.setFollowUpStatus(params.screeningId, 'AKTIF', 'FOLLOW_UP_REQUIRED');
    auditService.log({
      actorId: params.healthcareWorkerId,
      actorRole: params.healthcareWorkerRole,
      action: 'FOLLOWUP_CREATED',
      resourceType: 'FollowUp',
      resourceId: followUp.id,
      result: 'SUCCESS',
    });
    return followUp;
  },

  /**
   * Completes an active follow-up. Requires `updateFollowUp`. Completing an
   * already-completed follow-up is a no-op (idempotent), and there is no
   * path in this codebase that transitions COMPLETED back to an earlier
   * state — that would require an explicit administrative action which is
   * not implemented in this prototype.
   */
  complete(id: string, actorId: string, actorRole: UserRole): FollowUp | undefined {
    if (!can(actorRole, 'updateFollowUp')) {
      auditService.log({
        actorId,
        actorRole,
        action: 'FOLLOWUP_UPDATED',
        resourceType: 'FollowUp',
        resourceId: id,
        result: 'DENIED',
      });
      return undefined;
    }

    const existing = repo.getById(id);
    if (!existing) return undefined;
    if (existing.status === 'SELESAI') {
      // Invalid transition (COMPLETED -> COMPLETED): no-op, not an error.
      return existing;
    }

    const updated = repo.update(id, { status: 'SELESAI', completedAt: nowIso() });
    if (updated) {
      screeningService.setFollowUpStatus(updated.screeningId, 'SELESAI', 'FOLLOW_UP_COMPLETED');
      auditService.log({
        actorId,
        actorRole,
        action: 'FOLLOWUP_UPDATED',
        resourceType: 'FollowUp',
        resourceId: id,
        result: 'SUCCESS',
        metadata: { status: 'SELESAI' },
      });
    }
    return updated;
  },
};
