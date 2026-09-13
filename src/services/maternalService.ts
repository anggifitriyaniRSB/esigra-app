import { LocalStorageRepository } from './repository';
import type { PregnantWoman } from '../types/maternal';
import { mockMothers } from '../data/mockMothers';
import { generateId, generateOpaqueToken } from '../utils/security';
import { nowIso } from '../utils/date';
import { calculateGestationalAge } from '../utils/pregnancy';
import { auditService } from './auditService';
import { can } from './authorization';
import type { UserRole } from '../types/user';

const repo = new LocalStorageRepository<PregnantWoman>('mothers');
repo.seedIfEmpty(mockMothers);

export const maternalService = {
  listAll(): PregnantWoman[] {
    return repo.getAll();
  },

  getById(id: string): PregnantWoman | undefined {
    return repo.getById(id);
  },

  getByUserId(userId: string): PregnantWoman | undefined {
    return repo.getAll().find((m) => m.userId === userId);
  },

  /** Only resolves ACTIVE tokens. A revoked or unknown token yields no record. */
  getByQrToken(token: string): PregnantWoman | undefined {
    return repo
      .getAll()
      .find((m) => m.qrToken.toLowerCase() === token.toLowerCase() && m.qrStatus === 'ACTIVE');
  },

  gestationalInfo(mother: PregnantWoman) {
    return calculateGestationalAge(mother.hpht);
  },

  /**
   * Revokes a mother's QR token (e.g. lost KIA book / suspected compromise).
   * Requires the `revokeQR` permission — enforced here, not just hidden in
   * the UI, so calling this directly with the wrong role is also rejected.
   */
  revokeQr(motherId: string, actorId: string, actorRole: UserRole): PregnantWoman | undefined {
    if (!can(actorRole, 'revokeQR')) {
      auditService.log({
        actorId,
        actorRole,
        action: 'QR_REVOKED',
        resourceType: 'PregnantWoman',
        resourceId: motherId,
        result: 'DENIED',
      });
      return undefined;
    }
    const updated = repo.update(motherId, { qrStatus: 'REVOKED' });
    if (updated) {
      auditService.log({
        actorId,
        actorRole,
        action: 'QR_REVOKED',
        resourceType: 'PregnantWoman',
        resourceId: motherId,
        result: 'SUCCESS',
      });
    }
    return updated;
  },

  /** Issues a fresh opaque token and reactivates QR access. */
  reissueQr(motherId: string, actorId: string, actorRole: UserRole): PregnantWoman | undefined {
    if (!can(actorRole, 'revokeQR')) return undefined;
    const updated = repo.update(motherId, { qrToken: generateOpaqueToken(), qrStatus: 'ACTIVE' });
    if (updated) {
      auditService.log({
        actorId,
        actorRole,
        action: 'QR_REACTIVATED',
        resourceType: 'PregnantWoman',
        resourceId: motherId,
        result: 'SUCCESS',
      });
    }
    return updated;
  },

  createProfile(input: {
    userId: string;
    name: string;
    dateOfBirth: string;
    phone: string;
    address: string;
    hpht: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    assignedHealthcareWorkerId?: string | null;
  }): PregnantWoman {
    const mother: PregnantWoman = {
      id: generateId('mother'),
      userId: input.userId,
      name: input.name,
      dateOfBirth: input.dateOfBirth,
      phone: input.phone,
      address: input.address,
      hpht: input.hpht,
      gravida: 1,
      para: 0,
      emergencyContactName: input.emergencyContactName,
      emergencyContactPhone: input.emergencyContactPhone,
      assignedHealthcareWorkerId: input.assignedHealthcareWorkerId ?? 'user_nakes_01',
      qrToken: generateOpaqueToken(),
      qrStatus: 'ACTIVE',
      createdAt: nowIso(),
    };
    repo.create(mother);
    return mother;
  },
};
