export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'ACCESS_DENIED'
  | 'SCREENING_CREATED'
  | 'SCREENING_VIEWED'
  | 'SCREENING_VALIDATED'
  | 'FOLLOWUP_CREATED'
  | 'FOLLOWUP_UPDATED'
  | 'QR_ACCESSED'
  | 'QR_REVOKED'
  | 'QR_REACTIVATED'
  | 'PATIENT_VIEWED'
  | 'EDUCATION_VIEWED'
  | 'RULE_UPDATED'
  | 'USER_CREATED';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorRole: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  /** Defaults to SUCCESS when omitted, for backward compatibility with earlier entries. */
  result?: 'SUCCESS' | 'DENIED';
  metadata?: Record<string, string | number | boolean>;
}
