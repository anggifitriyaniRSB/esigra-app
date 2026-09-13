import type { AuditLogEntry } from '../types/audit';

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: 'audit_01',
    timestamp: '2026-09-10T07:41:00.000Z',
    actorId: 'user_ibu_02',
    actorRole: 'IBU_HAMIL',
    action: 'SCREENING_CREATED',
    resourceType: 'Screening',
    resourceId: 'scr_02',
    metadata: { riskLevel: 'TINGGI' },
  },
  {
    id: 'audit_02',
    timestamp: '2026-09-08T16:00:00.000Z',
    actorId: 'user_nakes_01',
    actorRole: 'NAKES',
    action: 'SCREENING_VALIDATED',
    resourceType: 'Screening',
    resourceId: 'scr_06',
  },
  {
    id: 'audit_03',
    timestamp: '2026-09-01T08:00:00.000Z',
    actorId: 'user_admin_01',
    actorRole: 'ADMIN',
    action: 'RULE_UPDATED',
    resourceType: 'SCREENING_CONFIG',
    resourceId: 'v1.0',
    metadata: { note: 'Versi awal aturan skrining diterapkan' },
  },
];
