import { Info, ShieldCheck } from 'lucide-react';

export function PrototypeNotice() {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-[var(--color-sage)]/60 px-4 py-3 text-xs text-[var(--color-deep-dark)]">
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        e-SIGRA adalah alat bantu skrining dan pemantauan awal. Hasil skrining bukan diagnosis
        medis dan tidak menggantikan pemeriksaan tenaga kesehatan.
      </p>
    </div>
  );
}

export function ClinicalGovernanceNotice() {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-[var(--color-blue-bg)] px-4 py-3 text-xs text-[var(--color-blue)]">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
      <p>Keputusan klinis tetap berada pada tenaga kesehatan yang berwenang.</p>
    </div>
  );
}
