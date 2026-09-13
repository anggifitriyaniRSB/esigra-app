import { BookOpen, QrCode, Activity, CheckCircle2, ClipboardList } from 'lucide-react';

const STEPS = [
  { icon: BookOpen, label: 'Buku KIA', sub: 'Stiker fisik 5×5 cm' },
  { icon: QrCode, label: 'QR', sub: 'Token opaque, tanpa PHI' },
  { icon: Activity, label: 'e-SIGRA', sub: 'Ringkasan maternal minimal' },
  { icon: CheckCircle2, label: 'Validasi', sub: 'Oleh tenaga kesehatan' },
  { icon: ClipboardList, label: 'Tindak Lanjut', sub: 'Tercatat & dipantau' },
];

export function StickerBridgeDiagram() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        return (
          <div key={step.label} className="flex items-center gap-2">
            <div className="flex w-24 flex-col items-center gap-1.5 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-sage)] text-[var(--color-deep)]">
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-xs font-semibold text-[var(--color-ink)]">{step.label}</p>
              <p className="text-[10px] text-[var(--color-ink)]/50">{step.sub}</p>
            </div>
            {i < STEPS.length - 1 && <span className="text-[var(--color-ink)]/30">→</span>}
          </div>
        );
      })}
    </div>
  );
}
