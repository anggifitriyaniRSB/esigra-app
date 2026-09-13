import { auditService } from '../../services/auditService';
import { Card } from '../../components/ui/Card';
import { Pill } from '../../components/ui/Pill';
import { formatDateTimeID } from '../../utils/date';
import { EmptyState } from '../../components/ui/States';
import { FileClock } from 'lucide-react';

export function AuditLogPage() {
  const entries = auditService.list();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Audit Log</h1>
        <p className="text-sm text-[var(--color-ink)]/60">{entries.length} aktivitas tercatat</p>
      </div>

      {entries.length === 0 ? (
        <EmptyState icon={<FileClock className="h-7 w-7" />} title="Belum ada aktivitas tercatat." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-sage-line)] text-left text-xs uppercase tracking-wide text-[var(--color-ink)]/50">
                <th className="px-4 py-3 font-medium">Waktu</th>
                <th className="px-4 py-3 font-medium">Aktor</th>
                <th className="px-4 py-3 font-medium">Peran</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
                <th className="px-4 py-3 font-medium">Sumber Daya</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-[var(--color-sage-line)] last:border-0">
                  <td className="px-4 py-3 text-[var(--color-ink)]/60">{formatDateTimeID(e.timestamp)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-ink)]/70">{e.actorId}</td>
                  <td className="px-4 py-3">
                    <Pill tone="blue">{e.actorRole}</Pill>
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{e.action}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]/60">
                    {e.resourceType} · {e.resourceId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
