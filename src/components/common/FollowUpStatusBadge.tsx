import { Pill } from '../ui/Pill';
import { Activity, AlertTriangle, CheckCheck } from 'lucide-react';
import type { FollowUp } from '../../types/notification';

export type FollowUpSemanticStatus = 'REQUIRED' | 'IN_PROGRESS' | 'ESCALATED' | 'COMPLETED';

const FOLLOW_UP_STATUS_UI: Record<
  FollowUpSemanticStatus,
  { label: string; tone: 'sage' | 'amber' | 'red' | 'blue' | 'neutral'; icon: typeof Activity }
> = {
  REQUIRED: { label: 'Perlu Tindak Lanjut', tone: 'amber', icon: Activity },
  IN_PROGRESS: { label: 'Sedang Berjalan', tone: 'blue', icon: Activity },
  ESCALATED: { label: 'Dirujuk / Dieskalasi', tone: 'red', icon: AlertTriangle },
  COMPLETED: { label: 'Selesai', tone: 'sage', icon: CheckCheck },
};

/** Derives the display status for a follow-up record from its stored fields. */
export function followUpSemanticStatus(followUp: FollowUp): FollowUpSemanticStatus {
  if (followUp.status === 'SELESAI') return 'COMPLETED';
  if (followUp.referral) return 'ESCALATED';
  return 'IN_PROGRESS';
}

export function FollowUpStatusBadge({ followUp }: { followUp: FollowUp }) {
  const status = followUpSemanticStatus(followUp);
  const ui = FOLLOW_UP_STATUS_UI[status];
  const Icon = ui.icon;
  return (
    <Pill tone={ui.tone} icon={<Icon className="h-3.5 w-3.5" />}>
      {ui.label}
    </Pill>
  );
}
