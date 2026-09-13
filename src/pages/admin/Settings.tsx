import { Card } from '../../components/ui/Card';
import { SCREENING_CONFIG } from '../../domain/screeningRules';
import { ShieldCheck } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Pengaturan</h1>
        <p className="text-sm text-[var(--color-ink)]/60">Konfigurasi umum sistem e-SIGRA</p>
      </div>

      <Card className="flex items-start gap-2.5 p-4 text-sm text-[var(--color-ink)]/70">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-teal)]" />
        <p>
          Prototipe ini menggunakan arsitektur keamanan prototipe (autentikasi mock, penyimpanan lokal
          perangkat). Sistem ini belum tersertifikasi HIPAA, ISO, maupun disetujui Kementerian Kesehatan.
        </p>
      </Card>

      <Card className="divide-y divide-[var(--color-sage-line)] p-0">
        <SettingRow label="Jendela Validasi Skrining" value={`${SCREENING_CONFIG.validationWindowHours} jam`} />
        <SettingRow label="Versi Aturan Skrining Aktif" value={SCREENING_CONFIG.version} />
        <SettingRow label="Mode Autentikasi" value="Mock (Prototipe / Pengembangan)" />
        <SettingRow label="Penyimpanan Data" value="LocalStorage perangkat (prototipe)" />
      </Card>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <p className="text-sm text-[var(--color-ink)]/70">{label}</p>
      <p className="text-sm font-medium text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
