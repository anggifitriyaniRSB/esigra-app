import type { Screening } from '../../types/screening';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Card } from '../ui/Card';
import { formatDateTimeID } from '../../utils/date';
import { SCREENING_CONFIG } from '../../domain/screeningRules';

export function ScreeningCard({ screening }: { screening: Screening }) {
  const symptomLabels = screening.symptomCodes
    .map((code) => SCREENING_CONFIG.symptoms.find((s) => s.code === code)?.label)
    .filter(Boolean);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[var(--color-ink)]/50">{formatDateTimeID(screening.createdAt)}</p>
          <p className="mt-1 text-sm text-[var(--color-ink)]/80">{symptomLabels.join(', ') || '-'}</p>
        </div>
        <RiskBadge level={screening.riskLevel} size="sm" />
      </div>
      <div className="mt-3">
        <StatusBadge status={screening.lifecycleStatus} />
      </div>
    </Card>
  );
}
