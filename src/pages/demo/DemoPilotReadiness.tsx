import { PILOT_READINESS_ROADMAP, PILOT_CONFIGS } from '../../domain/pilot/pilotConfig';
import { LOCALES } from '../../domain/pilot/localization';
import { Card } from '../../components/ui/Card';
import { Pill } from '../../components/ui/Pill';

export function DemoPilotReadinessPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Kesiapan Pilot</h1>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">
          Peta jalan dan konfigurasi berikut bersifat perencanaan untuk keperluan demo/hibah — belum ada
          situs aktif atau komitmen yang ditandatangani.
        </p>
      </div>

      <div className="space-y-3">
        {PILOT_READINESS_ROADMAP.map((phase) => (
          <Card key={phase.phase} className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="blue">{phase.phase}</Pill>
              <p className="font-medium text-[var(--color-ink)]">{phase.title}</p>
            </div>
            <p className="mt-2 text-sm text-[var(--color-ink)]/70">{phase.objective}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">Aktivitas</p>
                <ul className="mt-1 list-disc pl-4 text-xs text-[var(--color-ink)]/60">
                  {phase.activities.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">Output</p>
                <p className="mt-1 text-xs text-[var(--color-ink)]/60">{phase.output}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">Indikator Keberhasilan</p>
                <p className="mt-1 text-xs text-[var(--color-ink)]/60">{phase.successIndicator}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <p className="mb-3 font-display text-lg font-semibold text-[var(--color-ink)]">Konfigurasi Multi-Lokasi</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {PILOT_CONFIGS.map((p) => (
            <Card key={p.pilotId} className="p-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-[var(--color-ink)]/50">{p.pilotId}</p>
                <Pill tone="neutral">{p.status}</Pill>
              </div>
              <p className="mt-2 font-medium text-[var(--color-ink)]">{p.siteName}</p>
              <p className="text-xs text-[var(--color-ink)]/60">{p.location}</p>
              <div className="mt-3 space-y-1 text-xs text-[var(--color-ink)]/60">
                <p>Bahasa: {p.language}</p>
                <p>Peran Nakes: {p.healthWorkerRoles.join(', ')}</p>
                <p>Rujukan: {p.referralWorkflow}</p>
                <p>Target validasi: {p.validationTargetHours} jam</p>
              </div>
              <p className="mt-3 text-[10px] text-[var(--color-ink)]/40">{p.note}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 font-display text-lg font-semibold text-[var(--color-ink)]">Arsitektur Lokalisasi</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {Object.values(LOCALES).map((locale) => (
            <Card key={locale.code} className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-[var(--color-ink)]">{locale.label}</p>
                <Pill tone={locale.reviewStatus === 'REVIEWED' ? 'sage' : locale.reviewStatus === 'DRAFT' ? 'amber' : 'red'}>
                  {locale.reviewStatus}
                </Pill>
              </div>
              <p className="mt-1 text-xs text-[var(--color-ink)]/60">{locale.region}</p>
              <p className="mt-2 text-[10px] text-[var(--color-ink)]/40">{locale.note}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
