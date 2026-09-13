export type EducationCategory =
  | 'TANDA_BAHAYA'
  | 'NUTRISI'
  | 'PERSIAPAN_PERSALINAN'
  | 'KESEHATAN_GIGI'
  | 'KAPAN_KE_FASKES'
  | 'TRIMESTER';

export type WarningLevel = 'INFO' | 'PERHATIAN' | 'PENTING';

export interface EducationContent {
  id: string;
  title: string;
  description: string;
  content: string[];
  trimester: (1 | 2 | 3)[] | 'SEMUA';
  category: EducationCategory;
  warningLevel: WarningLevel;
  source: string;
  updatedAt: string;
  relatedSymptomCodes?: string[];
}
