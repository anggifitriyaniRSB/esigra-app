import { LocalStorageRepository } from './repository';
import type { AuditLogEntry, AuditAction } from '../types/audit';
import { mockAuditLog } from '../data/mockAudit';
import { generateId } from '../utils/security';
import { nowIso } from '../utils/date';

const repo = new LocalStorageRepository<AuditLogEntry>('audit_log');
repo.seedIfEmpty(mockAuditLog);

export const auditService = {
  log(params: {
    actorId: string;
    actorRole: string;
    action: AuditAction;
    resourceType: string;
    resourceId: string;
    result?: 'SUCCESS' | 'DENIED';
    metadata?: Record<string, string | number | boolean>;
  }): void {
    repo.create({
      id: generateId('audit'),
      timestamp: nowIso(),
      ...params,
    });
  },

  list(): AuditLogEntry[] {
    return [...repo.getAll()].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },
};
