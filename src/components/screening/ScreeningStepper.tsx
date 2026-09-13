import clsx from 'clsx';

const STEP_LABELS = ['Informasi', 'Gejala Utama', 'Gejala Penyerta', 'Data Vital', 'Konfirmasi & Hasil'];

export function ScreeningStepper({ current }: { current: number }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-deep)]">
          {String(current + 1).padStart(2, '0')} — {STEP_LABELS[current]}
        </p>
        <p className="text-xs text-[var(--color-ink)]/50">
          Langkah {current + 1} dari {STEP_LABELS.length}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        {STEP_LABELS.map((label, i) => (
          <div
            key={label}
            className={clsx(
              'h-1.5 flex-1 rounded-full',
              i <= current ? 'bg-[var(--color-deep)]' : 'bg-[var(--color-canvas-sunk)]'
            )}
          />
        ))}
      </div>
    </div>
  );
}
