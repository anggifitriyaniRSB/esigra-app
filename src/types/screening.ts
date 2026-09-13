export type RiskLevel = 'RENDAH' | 'SEDANG' | 'TINGGI';

export type ValidationStatus = 'BELUM_DIVALIDASI' | 'DIVALIDASI';

export type FollowUpStatus =
  | 'TIDAK_DIPERLUKAN'
  | 'DIPERLUKAN'
  | 'AKTIF'
  | 'SELESAI';

export type ScreeningLifecycleStatus =
  | 'SUBMITTED'
  | 'PENDING_VALIDATION'
  | 'VALIDATED'
  | 'FOLLOW_UP_REQUIRED'
  | 'FOLLOW_UP_COMPLETED'
  | 'ESCALATED'
  | 'REFERRED'
  | 'RESOLVED';

export interface SymptomDefinition {
  code: string;
  label: string;
  category: 'UTAMA' | 'PENYERTA';
  score: number;
  active: boolean;
}

export interface VitalSigns {
  tekananDarahSistolik?: number;
  tekananDarahDiastolik?: number;
  suhu?: number;
  denyutNadi?: number;
  usiaKehamilanMinggu?: number;
  gerakanJaninNormal?: boolean;
}

export interface SuspectMatch {
  id?: string;
  label: string;
  symptomCodes: string[];
  severity?: RiskLevel;
  message?: string;
  recommendation?: string;
  clinicalValidationStatus?: string;
  sourceVersion?: string;
}

export interface Screening {
  id: string;
  motherId: string;
  symptomCodes: string[];
  vitals: VitalSigns;
  score: number;
  riskLevel: RiskLevel;
  suspectConditions: SuspectMatch[];
  createdAt: string;
  lifecycleStatus: ScreeningLifecycleStatus;
  validationStatus: ValidationStatus;
  validatedBy: string | null;
  validatedAt: string | null;
  followUpStatus: FollowUpStatus;
}
