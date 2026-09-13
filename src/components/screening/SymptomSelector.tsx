import clsx from 'clsx';
import { Check, AlertTriangle } from 'lucide-react';
import type { SymptomDefinition } from '../../types/screening';
import { isSeriousSymptom } from '../../domain/screeningRules';

export function SymptomSelector({
  symptoms,
  selected,
  onToggle,
}: {
  symptoms: SymptomDefinition[];
  selected: string[];
  onToggle: (code: string) => void;
}) {
  const hasSeriousSelection = selected.some((code) => isSeriousSymptom(code));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {symptoms.map((symptom) => {
          const isChecked = selected.includes(symptom.code);
          return (
            <button
              key={symptom.code}
              type="button"
              role="checkbox"
              aria-checked={isChecked}
              onClick={() => onToggle(symptom.code)}
              className={clsx(
                'flex min-h-[44px] items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors',
                isChecked
                  ? 'border-[var(--color-deep)] bg-[var(--color-sage)] text-[var(--color-deep-dark)]'
                  : 'border-[var(--color-sage-line)] bg-white text-[var(--color-ink)]/80 hover:border-[var(--color-teal)]'
              )}
            >
              <span>{symptom.label}</span>
              <span
                className={clsx(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                  isChecked ? 'border-[var(--color-deep)] bg-[var(--color-deep)]' : 'border-[var(--color-sage-line)]'
                )}
              >
                {isChecked && <Check className="h-3.5 w-3.5 text-white" />}
              </span>
            </button>
          );
        })}
      </div>

      {hasSeriousSelection && (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-xl border border-[var(--color-amber)]/30 bg-[var(--color-amber-bg)] px-4 py-3.5 text-sm text-[var(--color-amber)]"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Gejala ini dapat memerlukan perhatian tenaga kesehatan. Jika kondisi terasa berat, memburuk,
            atau disertai tanda bahaya lainnya, segera cari pertolongan medis.
          </p>
        </div>
      )}
    </div>
  );
}
