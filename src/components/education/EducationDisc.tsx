import { useState } from 'react';
import type { EducationCategory } from '../../types/education';
import { AlertTriangle, Apple, Baby, Smile, MapPinned, CalendarRange } from 'lucide-react';
import clsx from 'clsx';

const TOPICS: { category: EducationCategory; label: string; icon: typeof AlertTriangle; angle: number }[] = [
  { category: 'TANDA_BAHAYA', label: 'Tanda Bahaya', icon: AlertTriangle, angle: 0 },
  { category: 'NUTRISI', label: 'Nutrisi', icon: Apple, angle: 60 },
  { category: 'TRIMESTER', label: 'Trimester', icon: CalendarRange, angle: 120 },
  { category: 'PERSIAPAN_PERSALINAN', label: 'Persiapan Persalinan', icon: Baby, angle: 180 },
  { category: 'KESEHATAN_GIGI', label: 'Kesehatan Gigi', icon: Smile, angle: 240 },
  { category: 'KAPAN_KE_FASKES', label: 'Kapan ke Faskes', icon: MapPinned, angle: 300 },
];

const RADIUS = 118;

export function EducationDisc({ onSelect }: { onSelect: (category: EducationCategory) => void }) {
  const [hovered, setHovered] = useState<EducationCategory | null>(null);

  return (
    <div className="relative mx-auto flex h-[340px] w-[340px] items-center justify-center">
      <div className="absolute h-[220px] w-[220px] rounded-full border border-[var(--color-sage-line)]" />
      <div className="absolute flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[var(--color-deep)] text-white shadow-lg">
        <span className="font-display text-lg font-semibold">e-SIGRA</span>
        <span className="text-[10px] opacity-80">Edukasi</span>
      </div>
      {TOPICS.map(({ category, label, icon: Icon, angle }) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.round(Math.sin(rad) * RADIUS);
        const y = Math.round(-Math.cos(rad) * RADIUS);
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            onMouseEnter={() => setHovered(category)}
            onMouseLeave={() => setHovered(null)}
            style={{ transform: `translate(${x}px, ${y}px)` }}
            className={clsx(
              'absolute flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-full border text-center text-[11px] font-medium shadow-sm transition-transform',
              hovered === category
                ? 'scale-110 border-[var(--color-deep)] bg-[var(--color-sage)] text-[var(--color-deep-dark)]'
                : 'border-[var(--color-sage-line)] bg-white text-[var(--color-ink)]/80'
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="px-1 leading-tight">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
