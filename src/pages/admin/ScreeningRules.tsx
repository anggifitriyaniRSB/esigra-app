import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { SCREENING_CONFIG } from '../../domain/screeningRules';
import { auditService } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Pill } from '../../components/ui/Pill';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatDateTimeID } from '../../utils/date';

export function ScreeningRulesPage() {
  const { user } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [, setTick] = useState(0);

  const ruleHistory = auditService
    .list()
    .filter((a) => a.action === 'RULE_UPDATED')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleLogReview = () => {
    if (!user) return;
    auditService.log({
      actorId: user.id,
      actorRole: user.role,
      action: 'RULE_UPDATED',
      resourceType: 'SCREENING_CONFIG',
      resourceId: SCREENING_CONFIG.version,
      metadata: { note: 'Aturan skrining ditinjau ulang tanpa perubahan nilai' },
    });
    setConfirmOpen(false);
    setTick((t) => t + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Aturan Skrining</h1>
        <p className="text-sm text-[var(--color-ink)]/60">
          Konfigurasi skor gejala, ambang batas risiko, dan kombinasi indikasi.
        </p>
      </div>

      <Card className="flex items-start gap-2.5 border-[var(--color-red)]/30 bg-[var(--color-red-bg)] p-4 text-sm text-[var(--color-red)]">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-semibold">{SCREENING_CONFIG.clinicalValidationStatus}</p>
          <p className="mt-1 text-[var(--color-ink)]/70">
            Parameter skor, ambang batas, dan kombinasi indikasi di bawah ini diambil langsung dari
            konsep awal e-SIGRA ({SCREENING_CONFIG.sourceVersion}). Belum ada validasi klinis independen
            atau tinjauan oleh klinisi berwenang. Status persetujuan saat ini:{' '}
            <span className="font-semibold">{SCREENING_CONFIG.approvalStatus}</span>.
          </p>
        </div>
      </Card>

      <Card className="flex items-start gap-2.5 border-[var(--color-amber)]/30 bg-[var(--color-amber-bg)] p-4 text-sm text-[var(--color-amber)]">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Perubahan aturan klinis memengaruhi hasil skrining seluruh pengguna dan harus melalui proses tata
          kelola klinis serta selalu tercatat pada audit log. Prototipe ini menampilkan konfigurasi dalam mode
          baca-saja.
        </p>
      </Card>

      <Card className="p-5">
        <p className="mb-3 font-medium text-[var(--color-ink)]">Peta Jalan Tata Kelola Klinis</p>
        <div className="flex flex-wrap items-center gap-2">
          {SCREENING_CONFIG.governanceRoadmap.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  i === 0
                    ? 'bg-[var(--color-sage)] text-[var(--color-deep-dark)]'
                    : 'bg-[var(--color-canvas-sunk)] text-[var(--color-ink)]/50'
                }`}
              >
                {step}
              </span>
              {i < SCREENING_CONFIG.governanceRoadmap.length - 1 && (
                <span className="text-[var(--color-ink)]/30">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-[var(--color-ink)]/50">
          Prototipe ini berada pada tahap paling awal (sebelum Clinical Validation). Tidak ada tahap di atas
          yang sudah diselesaikan.
        </p>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <p className="font-medium text-[var(--color-ink)]">
            Versi Aturan: <span className="font-semibold">{SCREENING_CONFIG.version}</span>
          </p>
          <Button size="sm" variant="secondary" onClick={() => setConfirmOpen(true)}>
            Catat Peninjauan
          </Button>
        </div>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">
          Berlaku sejak {formatDateTimeID(SCREENING_CONFIG.effectiveDate)} · Jendela validasi{' '}
          {SCREENING_CONFIG.validationWindowHours} jam
        </p>
      </Card>

      <Card className="p-5">
        <p className="mb-3 font-medium text-[var(--color-ink)]">Ambang Batas Risiko</p>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-xl bg-[var(--color-red-bg)] p-3 text-[var(--color-red)]">
            TINGGI
            <p className="mt-1 font-semibold">Skor ≥ {SCREENING_CONFIG.thresholds.TINGGI}</p>
          </div>
          <div className="rounded-xl bg-[var(--color-amber-bg)] p-3 text-[var(--color-amber)]">
            SEDANG
            <p className="mt-1 font-semibold">Skor ≥ {SCREENING_CONFIG.thresholds.SEDANG}</p>
          </div>
          <div className="rounded-xl bg-[var(--color-sage)] p-3 text-[var(--color-deep-dark)]">
            RENDAH
            <p className="mt-1 font-semibold">Skor &lt; {SCREENING_CONFIG.thresholds.SEDANG}</p>
          </div>
        </div>
      </Card>

      <Card className="border-[var(--color-red)]/20 p-5">
        <p className="mb-1 font-medium text-[var(--color-ink)]">
          Override Indikator Kritis <span className="text-xs font-normal text-[var(--color-red)]">— Requires clinical governance</span>
        </p>
        <p className="mb-3 text-sm text-[var(--color-ink)]/60">
          Gejala berikut memaksa hasil minimal SEDANG walau dilaporkan sendirian, agar tidak diredam oleh
          skor total (mencegah kesan aman yang keliru).
        </p>
        <div className="flex flex-wrap gap-2">
          {SCREENING_CONFIG.criticalIndicators.map((code) => {
            const def = SCREENING_CONFIG.symptoms.find((s) => s.code === code);
            return (
              <span key={code} className="rounded-full bg-[var(--color-red-bg)] px-3 py-1.5 text-xs font-medium text-[var(--color-red)]">
                {def?.label ?? code}
              </span>
            );
          })}
        </div>
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-[var(--color-sage-line)] text-left text-xs uppercase tracking-wide text-[var(--color-ink)]/50">
              <th className="px-4 py-3 font-medium">Gejala</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Skor</th>
            </tr>
          </thead>
          <tbody>
            {SCREENING_CONFIG.symptoms.map((s) => (
              <tr key={s.code} className="border-b border-[var(--color-sage-line)] last:border-0">
                <td className="px-4 py-3 text-[var(--color-ink)]">{s.label}</td>
                <td className="px-4 py-3 text-[var(--color-ink)]/60">{s.category}</td>
                <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{s.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-5">
        <p className="mb-3 font-medium text-[var(--color-ink)]">Kombinasi Indikasi</p>
        <ul className="space-y-3 text-sm text-[var(--color-ink)]/70">
          {SCREENING_CONFIG.combinations.map((c) => (
            <li key={c.id} className="rounded-xl bg-[var(--color-canvas-sunk)] px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-[var(--color-ink)]">{c.label}</span>
                {c.severity && <Pill tone={c.severity === 'TINGGI' ? 'red' : 'amber'}>{c.severity}</Pill>}
              </div>
              <p className="mt-1 text-xs text-[var(--color-ink)]/60">{c.symptomCodes.join(' + ')}</p>
              {c.recommendation && <p className="mt-1.5 text-xs text-[var(--color-ink)]/70">{c.recommendation}</p>}
              <p className="mt-1.5 text-[10px] uppercase tracking-wide text-[var(--color-ink)]/40">
                {c.clinicalValidationStatus} · {c.sourceVersion}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <p className="mb-3 font-medium text-[var(--color-ink)]">Riwayat Peninjauan</p>
        {ruleHistory.length === 0 ? (
          <p className="text-sm text-[var(--color-ink)]/50">Belum ada riwayat peninjauan tercatat.</p>
        ) : (
          <ul className="space-y-2 text-sm text-[var(--color-ink)]/70">
            {ruleHistory.map((h) => (
              <li key={h.id} className="rounded-xl border border-[var(--color-sage-line)] px-4 py-2.5">
                <p className="text-xs text-[var(--color-ink)]/50">{formatDateTimeID(h.timestamp)}</p>
                <p>{(h.metadata?.note as string) ?? 'Pembaruan aturan skrining'}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Catat peninjauan aturan skrining?"
        description="Tindakan ini akan tercatat pada audit log sebagai bukti tata kelola klinis."
        confirmLabel="Ya, Catat"
        onConfirm={handleLogReview}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
