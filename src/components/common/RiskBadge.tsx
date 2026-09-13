import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { RiskLevel } from '../../types/screening';
import { RISK_UI } from '../../utils/risk';
import clsx from 'clsx';

const ICONS: Record<RiskLevel, typeof AlertTriangle> = {
  RENDAH: CheckCircle2,
  SEDANG: AlertCircle,
  TINGGI: AlertTriangle,
};

export function RiskBadge({ level, size = 'md' }: { level: RiskLevel; size?: 'sm' | 'md' | 'lg' }) {
  const ui = RISK_UI[level];
  const Icon = ICONS[level];
  const sizeClasses = size === 'lg' ? 'px-4 py-2 text-sm gap-2' : size === 'sm' ? 'px-2.5 py-1 text-xs gap-1' : 'px-3 py-1.5 text-xs gap-1.5';
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-semibold border',
        ui.bg,
        ui.textColor,
        ui.border,
        sizeClasses
      )}
    >
      <Icon className={size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
      {ui.label}
    </span>
  );
}
