import clsx from 'clsx';
import type { Trimester } from '../../types/maternal';

export function PregnancyProgress({ weeks, trimester }: { weeks: number; trimester: Trimester }) {
  const percent = Math.min(100, (weeks / 40) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-[var(--color-ink)]/60">
        <span>Usia kehamilan: {weeks} minggu</span>
        <span>Trimester {trimester}</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--color-canvas-sunk)]">
        <div
          className="h-full rounded-full bg-[var(--color-teal)] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-1.5 grid grid-cols-3 text-[11px] text-[var(--color-ink)]/40">
        {[1, 2, 3].map((t) => (
          <span
            key={t}
            className={clsx('text-center', t === trimester && 'font-semibold text-[var(--color-deep)]')}
          >
            Trimester {t}
          </span>
        ))}
      </div>
    </div>
  );
}
