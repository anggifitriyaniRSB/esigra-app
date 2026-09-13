import { useState } from 'react';
import { screeningService } from '../../services/screeningService';
import { PatientPriorityTable } from '../../components/dashboard/PatientPriorityTable';
import type { RiskLevel } from '../../types/screening';
import clsx from 'clsx';

const FILTERS: { value: RiskLevel | 'SEMUA'; label: string }[] = [
  { value: 'SEMUA', label: 'Semua' },
  { value: 'TINGGI', label: 'Tinggi' },
  { value: 'SEDANG', label: 'Sedang' },
  { value: 'RENDAH', label: 'Rendah' },
];

export function NakesDeteksiPage() {
  const [filter, setFilter] = useState<RiskLevel | 'SEMUA'>('SEMUA');

  const screenings = [...screeningService.listAll()]
    .filter((s) => filter === 'SEMUA' || s.riskLevel === filter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Deteksi Dini</h1>
        <p className="text-sm text-[var(--color-ink)]/60">
          Log kronologis seluruh skrining yang masuk ke sistem, terbaru di atas.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={clsx(
              'rounded-xl px-4 py-2 text-sm font-medium',
              filter === f.value
                ? 'bg-[var(--color-deep)] text-white'
                : 'border border-[var(--color-sage-line)] bg-white text-[var(--color-ink)]/60'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <PatientPriorityTable screenings={screenings} />
    </div>
  );
}
