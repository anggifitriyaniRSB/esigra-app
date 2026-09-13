import { useState } from 'react';
import { Check } from 'lucide-react';

const SCALE = ['Sangat mudah', 'Mudah', 'Cukup', 'Sulit', 'Sangat sulit'];

export function FeedbackWidget({ prompt = 'Bagaimana pengalaman Anda?' }: { prompt?: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[var(--color-sage-line)] bg-white/70 px-4 py-3 text-sm text-[var(--color-deep-dark)]">
        <Check className="h-4 w-4" /> Terima kasih atas masukan Anda.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--color-sage-line)] bg-white/70 p-4">
      <p className="text-sm font-medium text-[var(--color-ink)]">{prompt}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {SCALE.map((opt) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
              selected === opt
                ? 'border-[var(--color-deep)] bg-[var(--color-sage)] text-[var(--color-deep-dark)]'
                : 'border-[var(--color-sage-line)] text-[var(--color-ink)]/60'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Komentar (opsional)"
        rows={2}
        className="mt-2 w-full rounded-lg border border-[var(--color-sage-line)] px-3 py-2 text-xs outline-none focus:border-[var(--color-deep)]"
      />
      <button
        onClick={() => setSubmitted(true)}
        disabled={!selected}
        className="mt-2 rounded-lg bg-[var(--color-deep)] px-4 py-1.5 text-xs font-medium text-white disabled:opacity-40"
      >
        Kirim Masukan
      </button>
      <p className="mt-1.5 text-[10px] text-[var(--color-ink)]/40">
        Ini adalah pengumpulan umpan balik, bukan bukti kegunaan (usability).
      </p>
    </div>
  );
}
