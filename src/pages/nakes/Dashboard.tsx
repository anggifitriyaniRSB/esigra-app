import { Link } from 'react-router-dom';
import { Users, AlertTriangle, AlertCircle, Clock, Activity } from 'lucide-react';
import { screeningService } from '../../services/screeningService';
import { maternalService } from '../../services/maternalService';
import { followUpService } from '../../services/followUpService';
import { KpiCard } from '../../components/dashboard/KpiCard';
import { PatientPriorityTable } from '../../components/dashboard/PatientPriorityTable';
import { ClinicalGovernanceNotice } from '../../components/common/Notices';
import { sortByPriority } from '../../domain/maternalRisk';

export function NakesDashboardPage() {
  const mothers = maternalService.listAll();
  const screenings = screeningService.listAll();
  const pending = screeningService.listPendingValidation();
  const activeFollowUps = followUpService.listActive();

  const riskTinggi = screenings.filter((s) => s.riskLevel === 'TINGGI').length;
  const riskSedang = screenings.filter((s) => s.riskLevel === 'SEDANG').length;

  const todayPriority = sortByPriority(screenings).slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Dashboard e-SIGRA</h1>
        <p className="text-sm text-[var(--color-ink)]/60">Pemantauan Deteksi Dini Maternal</p>
      </div>

      <ClinicalGovernanceNotice />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Total Ibu Dipantau" value={mothers.length} icon={<Users className="h-4 w-4" />} />
        <KpiCard label="Risiko Tinggi" value={riskTinggi} tone="red" icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Risiko Sedang" value={riskSedang} tone="amber" icon={<AlertCircle className="h-4 w-4" />} />
        <KpiCard label="Menunggu Validasi" value={pending.length} tone="amber" icon={<Clock className="h-4 w-4" />} />
        <KpiCard label="Tindak Lanjut Aktif" value={activeFollowUps.length} tone="sage" icon={<Activity className="h-4 w-4" />} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="font-display text-lg font-semibold text-[var(--color-ink)]">Prioritas Hari Ini</p>
          <Link to="/nakes/prioritas" className="text-sm font-medium text-[var(--color-deep)] hover:underline">
            Lihat semua
          </Link>
        </div>
        <PatientPriorityTable screenings={todayPriority} />
      </div>
    </div>
  );
}
