import { Users, ShieldCheck, FileClock, Stethoscope } from 'lucide-react';
import { maternalService } from '../../services/maternalService';
import { screeningService } from '../../services/screeningService';
import { auditService } from '../../services/auditService';
import { KpiCard } from '../../components/dashboard/KpiCard';
import { Card } from '../../components/ui/Card';
import { SCREENING_CONFIG } from '../../domain/screeningRules';

export function AdminDashboardPage() {
  const mothers = maternalService.listAll();
  const screenings = screeningService.listAll();
  const auditEntries = auditService.list();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Dashboard Admin</h1>
        <p className="text-sm text-[var(--color-ink)]/60">Ringkasan pengelolaan sistem e-SIGRA</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Ibu Terdaftar" value={mothers.length} icon={<Users className="h-4 w-4" />} />
        <KpiCard label="Total Skrining" value={screenings.length} icon={<Stethoscope className="h-4 w-4" />} />
        <KpiCard label="Entri Audit Log" value={auditEntries.length} icon={<FileClock className="h-4 w-4" />} />
        <KpiCard label="Versi Aturan Skrining" value={SCREENING_CONFIG.version} icon={<ShieldCheck className="h-4 w-4" />} />
      </div>

      <Card className="p-5">
        <p className="font-medium text-[var(--color-ink)]">Aturan Skrining Aktif</p>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">
          Versi {SCREENING_CONFIG.version} · Berlaku sejak{' '}
          {new Date(SCREENING_CONFIG.effectiveDate).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <p className="mt-2 text-sm text-[var(--color-ink)]/60">
          Jendela validasi: {SCREENING_CONFIG.validationWindowHours} jam
        </p>
      </Card>
    </div>
  );
}
