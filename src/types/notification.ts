export type NotificationType =
  | 'HIGH_RISK_ALERT'
  | 'VALIDATION_REMINDER'
  | 'FOLLOW_UP_REMINDER'
  | 'EDUCATION'
  | 'SYSTEM';

export interface AppNotification {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  linkTo?: string;
}

export interface FollowUp {
  id: string;
  screeningId: string;
  motherId: string;
  healthcareWorkerId: string;
  action: string;
  notes: string;
  referral: boolean;
  referralFacility?: string;
  status: 'AKTIF' | 'SELESAI';
  createdAt: string;
  completedAt: string | null;
}
