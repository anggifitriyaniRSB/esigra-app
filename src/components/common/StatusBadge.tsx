import { Pill } from '../ui/Pill';
import { Clock, CheckCheck, Activity, Send, FolderCheck } from 'lucide-react';
import type { ScreeningLifecycleStatus } from '../../types/screening';

const STATUS_UI: Record<ScreeningLifecycleStatus, { label: string; tone: 'sage' | 'amber' | 'red' | 'blue' | 'neutral'; icon: typeof Clock }> = {
  SUBMITTED: { label: 'Terkirim', tone: 'blue', icon: Send },
  PENDING_VALIDATION: { label: 'Menunggu Validasi', tone: 'amber', icon: Clock },
  VALIDATED: { label: 'Divalidasi', tone: 'sage', icon: CheckCheck },
  FOLLOW_UP_REQUIRED: { label: 'Perlu Tindak Lanjut', tone: 'amber', icon: Activity },
  FOLLOW_UP_COMPLETED: { label: 'Tindak Lanjut Selesai', tone: 'sage', icon: FolderCheck },
  ESCALATED: { label: 'Dieskalasi', tone: 'red', icon: Activity },
  REFERRED: { label: 'Dirujuk', tone: 'red', icon: Send },
  RESOLVED: { label: 'Terselesaikan', tone: 'sage', icon: CheckCheck },
};

export function StatusBadge({ status }: { status: ScreeningLifecycleStatus }) {
  const ui = STATUS_UI[status];
  const Icon = ui.icon;
  return (
    <Pill tone={ui.tone} icon={<Icon className="h-3.5 w-3.5" />}>
      {ui.label}
    </Pill>
  );
}
