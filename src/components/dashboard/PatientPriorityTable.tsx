import { Link } from 'react-router-dom';
import type { Screening } from '../../types/screening';
import type { PregnantWoman } from '../../types/maternal';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateTimeID } from '../../utils/date';
import { maternalService } from '../../services/maternalService';
import { SCREENING_CONFIG } from '../../domain/screeningRules';
import { EmptyState } from '../ui/States';
import { ListChecks } from 'lucide-react';

export function PatientPriorityTable({ screenings }: { screenings: Screening[] }) {
  if (screenings.length === 0) {
    return <EmptyState icon={<ListChecks className="h-7 w-7" />} title="Tidak ada prioritas saat ini." />;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--color-sage-line)] bg-white/70">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-[var(--color-sage-line)] text-left text-xs uppercase tracking-wide text-[var(--color-ink)]/50">
            <th className="px-4 py-3 font-medium">Nama</th>
            <th className="px-4 py-3 font-medium">Usia Kehamilan</th>
            <th className="px-4 py-3 font-medium">Risiko</th>
            <th className="px-4 py-3 font-medium">Gejala Utama</th>
            <th className="px-4 py-3 font-medium">Waktu Deteksi</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {screenings.map((s) => {
            const mother = maternalService.getById(s.motherId) as PregnantWoman;
            const gestational = mother ? maternalService.gestationalInfo(mother) : null;
            const mainSymptom = SCREENING_CONFIG.symptoms.find((sym) => sym.code === s.symptomCodes[0]);
            return (
              <tr key={s.id} className="border-b border-[var(--color-sage-line)] last:border-0">
                <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{mother?.name ?? '-'}</td>
                <td className="px-4 py-3 text-[var(--color-ink)]/70">
                  {gestational ? `${gestational.weeks} minggu` : '-'}
                </td>
                <td className="px-4 py-3">
                  <RiskBadge level={s.riskLevel} size="sm" />
                </td>
                <td className="px-4 py-3 text-[var(--color-ink)]/70">{mainSymptom?.label ?? '-'}</td>
                <td className="px-4 py-3 text-[var(--color-ink)]/60">{formatDateTimeID(s.createdAt)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={s.lifecycleStatus} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/nakes/ibu/${s.motherId}`}
                    className="rounded-lg bg-[var(--color-sage)] px-3 py-1.5 text-xs font-medium text-[var(--color-deep-dark)] hover:bg-[var(--color-sage-line)]"
                  >
                    Lihat
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
