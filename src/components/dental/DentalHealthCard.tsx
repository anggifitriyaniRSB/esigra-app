import type { DentalRecord } from '../../types/dental';
import { Card } from '../ui/Card';
import { Pill } from '../ui/Pill';
import { formatDateID } from '../../utils/date';

const STATUS_LABEL: Record<DentalRecord['status'], string> = {
  SEHAT: 'Sehat',
  KARIES_RINGAN: 'Karies Ringan',
  KARIES_BERAT: 'Karies Berat',
  GINGIVITIS: 'Gingivitis',
};

const STATUS_TONE: Record<DentalRecord['status'], 'sage' | 'amber' | 'red'> = {
  SEHAT: 'sage',
  KARIES_RINGAN: 'amber',
  KARIES_BERAT: 'red',
  GINGIVITIS: 'amber',
};

export function DentalHealthCard({ record }: { record: DentalRecord }) {
  const problems: string[] = [];
  if (record.problems.karies) problems.push(`Karies (${record.problems.karies.toLowerCase()})`);
  if (record.problems.gingivitis) problems.push(`Gingivitis (${record.problems.gingivitis.toLowerCase()})`);
  if (record.problems.gigiBerlubang) problems.push('Gigi berlubang');
  if (record.problems.gigiGoyang) problems.push('Gigi goyang');
  if (record.problems.abses) problems.push('Abses');

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <Pill tone={STATUS_TONE[record.status]}>{STATUS_LABEL[record.status]}</Pill>
        <span className="text-xs text-[var(--color-ink)]/50">{formatDateID(record.createdAt)}</span>
      </div>
      <p className="mt-3 text-sm font-medium text-[var(--color-ink)]">Masalah ditemukan</p>
      <p className="text-sm text-[var(--color-ink)]/70">{problems.length > 0 ? problems.join(', ') : 'Tidak ada'}</p>
      <p className="mt-3 text-sm font-medium text-[var(--color-ink)]">Tindak lanjut</p>
      <p className="text-sm text-[var(--color-ink)]/70">{record.recommendation}</p>
    </Card>
  );
}
