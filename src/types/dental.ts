export type DentalStatus = 'SEHAT' | 'KARIES_RINGAN' | 'KARIES_BERAT' | 'GINGIVITIS';

export type DentalSeverity = 'RINGAN' | 'SEDANG' | 'BERAT' | null;

export interface DentalProblems {
  karies: DentalSeverity;
  gingivitis: DentalSeverity;
  gigiBerlubang: boolean;
  gigiGoyang: boolean;
  abses: boolean;
}

export interface DentalRecord {
  id: string;
  motherId: string;
  problems: DentalProblems;
  score: number;
  status: DentalStatus;
  recommendation: string;
  createdAt: string;
}
