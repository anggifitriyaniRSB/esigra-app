export type Trimester = 1 | 2 | 3;

export type QrStatus = 'ACTIVE' | 'REVOKED';

export interface PregnantWoman {
  id: string;
  userId: string;
  name: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  hpht: string; // Hari Pertama Haid Terakhir (ISO date)
  gravida: number; // G
  para: number; // P
  emergencyContactName: string;
  emergencyContactPhone: string;
  assignedHealthcareWorkerId: string | null;
  qrToken: string;
  qrStatus: QrStatus;
  createdAt: string;
}

export interface GestationalInfo {
  weeks: number;
  days: number;
  trimester: Trimester;
  estimatedDueDate: string;
}
