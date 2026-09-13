import type { UserRole } from '../types/user';

/**
 * Explicit permission matrix for e-SIGRA's three roles. This is the
 * authoritative reference for "who can do what" — UI hides buttons for
 * convenience, but every sensitive service method in this codebase also
 * calls `can()` or one of the `assert*` helpers below so that hiding a
 * button is never the only thing standing between a role and an action.
 *
 * PROTOTYPE NOTE: because there is no real backend in this prototype, these
 * checks run in the browser and can theoretically be bypassed by a user
 * editing their own client-side state. In production this exact matrix
 * should be re-implemented (or mirrored) server-side, where it cannot be
 * bypassed by the caller.
 */
export type Permission =
  // Ibu Hamil
  | 'viewOwnProfile'
  | 'createOwnScreening'
  | 'viewOwnScreening'
  | 'viewOwnEducation'
  | 'viewOwnDentalRecord'
  | 'viewOwnQR'
  // Nakes
  | 'viewAssignedPatients'
  | 'viewScreening'
  | 'validateScreening'
  | 'createFollowUp'
  | 'updateFollowUp'
  | 'scanQR'
  | 'revokeQR'
  | 'viewEducation'
  | 'viewReports'
  // Admin
  | 'manageUsers'
  | 'manageNakes'
  | 'manageEducation'
  | 'manageScreeningConfig'
  | 'viewAuditLog'
  | 'manageSystemSettings';

const PERMISSIONS: Record<UserRole, Permission[]> = {
  IBU_HAMIL: [
    'viewOwnProfile',
    'createOwnScreening',
    'viewOwnScreening',
    'viewOwnEducation',
    'viewOwnDentalRecord',
    'viewOwnQR',
  ],
  NAKES: [
    'viewAssignedPatients',
    'viewScreening',
    'validateScreening',
    'createFollowUp',
    'updateFollowUp',
    'scanQR',
    'revokeQR',
    'viewEducation',
    'viewReports',
  ],
  ADMIN: [
    'manageUsers',
    'manageNakes',
    'manageEducation',
    'manageScreeningConfig',
    'viewAuditLog',
    'manageSystemSettings',
    // Admin can additionally act as a clinical-governance superuser over
    // Nakes-level actions (e.g. reviewing/overriding a stuck validation).
    'viewAssignedPatients',
    'viewScreening',
    'validateScreening',
    'createFollowUp',
    'updateFollowUp',
    'scanQR',
    'revokeQR',
    'viewReports',
  ],
};

export function can(role: UserRole, permission: Permission): boolean {
  return PERMISSIONS[role]?.includes(permission) ?? false;
}

/** A mother may only ever view/act on her own records. */
export function ownsResource(actorId: string, resourceOwnerId: string): boolean {
  return actorId === resourceOwnerId;
}

/**
 * A Nakes may act on a patient's record only if they are the assigned
 * healthcare worker for that patient, unless they are an Admin acting as
 * clinical-governance superuser.
 */
export function isAssignedOrAdmin(
  role: UserRole,
  actorId: string,
  assignedHealthcareWorkerId: string | null
): boolean {
  if (role === 'ADMIN') return true;
  if (role !== 'NAKES') return false;
  return assignedHealthcareWorkerId === actorId;
}

export interface AuthorizationResult {
  allowed: boolean;
  reason?: string;
}

export function authorize(allowed: boolean, reason = 'Akses ditolak.'): AuthorizationResult {
  return allowed ? { allowed: true } : { allowed: false, reason };
}
