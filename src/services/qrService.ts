import { maternalService } from './maternalService';
import { screeningService } from './screeningService';
import { followUpService } from './followUpService';
import { auditService } from './auditService';
import { can } from './authorization';
import { currentRiskFromHistory } from '../domain/maternalRisk';
import { maskPhone } from '../utils/risk';
import type { UserRole } from '../types/user';

export interface MaternalSummary {
  motherId: string;
  name: string;
  gestationalWeeks: number;
  trimester: number;
  currentRisk: 'RENDAH' | 'SEDANG' | 'TINGGI' | null;
  lastScreeningAt: string | null;
  activeFollowUp: boolean;
  maskedPhone: string;
}

/**
 * Resolves an opaque QR token to the minimum-necessary maternal summary.
 *
 * Security notes (prototype):
 * - The token itself carries no PHI; it is only a lookup key.
 * - Only ACTIVE tokens resolve — revoked or unrecognized tokens both return
 *   `null`, with identical caller-facing behavior, so a revoked token does
 *   not leak "this token used to be valid" information.
 * - Requires the `scanQR` permission, checked here at the service boundary
 *   (not only by hiding the Scan QR button in the Nakes UI).
 * - In this prototype, "authorization" is simulated by trusting the
 *   actorId/actorRole passed in by the caller. A real deployment must
 *   verify these against a genuine server-side session before resolving
 *   any token, over HTTPS, with rate limiting and audit logging.
 */
export const qrService = {
  resolveToken(token: string, actorId: string, actorRole: UserRole): MaternalSummary | null {
    if (!can(actorRole, 'scanQR')) {
      auditService.log({
        actorId,
        actorRole,
        action: 'QR_ACCESSED',
        resourceType: 'QrToken',
        resourceId: token,
        result: 'DENIED',
      });
      return null;
    }

    const mother = maternalService.getByQrToken(token);
    if (!mother) {
      auditService.log({
        actorId,
        actorRole,
        action: 'QR_ACCESSED',
        resourceType: 'QrToken',
        resourceId: token,
        result: 'DENIED',
        metadata: { reason: 'invalid_or_revoked' },
      });
      return null;
    }

    const screenings = screeningService.listByMother(mother.id);
    const gestational = maternalService.gestationalInfo(mother);
    const risk = currentRiskFromHistory(screenings);
    const activeFollowUps = followUpService.listByMother(mother.id).filter((f) => f.status === 'AKTIF');

    auditService.log({
      actorId,
      actorRole,
      action: 'QR_ACCESSED',
      resourceType: 'PregnantWoman',
      resourceId: mother.id,
      result: 'SUCCESS',
    });

    return {
      motherId: mother.id,
      name: mother.name,
      gestationalWeeks: gestational.weeks,
      trimester: gestational.trimester,
      currentRisk: risk,
      lastScreeningAt: screenings[0]?.createdAt ?? null,
      activeFollowUp: activeFollowUps.length > 0,
      maskedPhone: maskPhone(mother.phone),
    };
  },
};
