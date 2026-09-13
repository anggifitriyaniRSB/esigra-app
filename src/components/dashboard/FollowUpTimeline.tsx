import type { FollowUp } from '../../types/notification';
import { formatDateTimeID } from '../../utils/date';
import { FollowUpStatusBadge, followUpSemanticStatus } from '../common/FollowUpStatusBadge';
import { EmptyState } from '../ui/States';
import { ClipboardList } from 'lucide-react';
import clsx from 'clsx';

const DOT_TONE: Record<string, string> = {
  COMPLETED: 'bg-[var(--color-teal)]',
  ESCALATED: 'bg-[var(--color-red)]',
  IN_PROGRESS: 'bg-[var(--color-blue)]',
  REQUIRED: 'bg-[var(--color-amber)]',
};

export function FollowUpTimeline({ followUps }: { followUps: FollowUp[] }) {
  if (followUps.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList className="h-7 w-7" />}
        title="Tidak ada tindak lanjut aktif."
        description="Tindak lanjut yang dibuat tenaga kesehatan akan muncul di sini."
      />
    );
  }

  const sorted = [...followUps].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <ol className="relative space-y-5 border-l-2 border-[var(--color-sage-line)] pl-5">
      {sorted.map((f) => {
        const status = followUpSemanticStatus(f);
        return (
          <li key={f.id} className="relative">
            <span
              className={clsx(
                'absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-[var(--color-canvas)]',
                DOT_TONE[status]
              )}
            />
            <div className="rounded-xl border border-[var(--color-sage-line)] bg-white/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-[var(--color-ink)]/50">{formatDateTimeID(f.createdAt)}</p>
                <FollowUpStatusBadge followUp={f} />
              </div>
              <p className="mt-1.5 font-medium text-[var(--color-ink)]">{f.action}</p>
              <p className="mt-0.5 text-sm text-[var(--color-ink)]/70">{f.notes}</p>
              {f.referral && (
                <p className="mt-1.5 text-xs text-[var(--color-blue)]">Dirujuk ke: {f.referralFacility}</p>
              )}
              {f.completedAt && (
                <p className="mt-1.5 text-xs text-[var(--color-ink)]/40">
                  Selesai: {formatDateTimeID(f.completedAt)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
