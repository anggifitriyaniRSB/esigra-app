/**
 * Research/pilot evaluation fields (CONCEPTUAL — not wired into the running
 * application or any form in this prototype).
 *
 * IMPORTANT GOVERNANCE NOTE: the presence of a `consentStatus` field below
 * does not mean e-SIGRA implements legally valid research consent. A
 * checkbox is not informed consent. Any real pilot evaluation involving
 * these fields requires an institutional review process (ethics committee /
 * IRB or local equivalent) to design and approve the actual consent
 * instrument, data handling, and participant protections before any of
 * this is collected from a real person.
 */
export type ConsentStatus = 'NOT_REQUESTED' | 'PENDING_REVIEW' | 'GRANTED' | 'WITHDRAWN';

export interface ResearchParticipantRecord {
  studyParticipantId: string;
  siteId: string;
  consentStatus: ConsentStatus;
  enrollmentDate: string | null;
  baselineData: Record<string, unknown> | null;
  screeningEventIds: string[];
  followUpEventIds: string[];
}

export interface EvaluationMetricDefinition {
  id: string;
  layer: 'INPUT' | 'PROCESS' | 'OUTCOME';
  label: string;
  description: string;
  /** Whether this can currently be computed from prototype data, or is only a planned indicator. */
  computable: boolean;
}

export const EVALUATION_FRAMEWORK: EvaluationMetricDefinition[] = [
  { id: 'input_users_onboarded', layer: 'INPUT', label: 'Pengguna terdaftar', description: 'Jumlah ibu hamil dan Nakes yang terdaftar di sistem.', computable: true },
  { id: 'input_nakes_trained', layer: 'INPUT', label: 'Nakes terlatih', description: 'Jumlah Nakes yang telah menyelesaikan pelatihan penggunaan sistem.', computable: false },
  { id: 'input_sites_activated', layer: 'INPUT', label: 'Situs aktif', description: 'Jumlah situs pilot yang telah diaktifkan.', computable: false },
  { id: 'process_screening_completion', layer: 'PROCESS', label: 'Tingkat penyelesaian skrining', description: 'Proporsi skrining yang dimulai dan diselesaikan hingga hasil muncul.', computable: true },
  { id: 'process_validation_time', layer: 'PROCESS', label: 'Waktu validasi rata-rata', description: 'Rata-rata waktu dari skrining dikirim hingga divalidasi Nakes.', computable: true },
  { id: 'process_followup_initiation', layer: 'PROCESS', label: 'Inisiasi tindak lanjut', description: 'Proporsi kasus tervalidasi yang mendapat tindak lanjut.', computable: true },
  { id: 'process_education_engagement', layer: 'PROCESS', label: 'Keterlibatan edukasi', description: 'Jumlah materi edukasi yang diakses per ibu hamil.', computable: true },
  { id: 'outcome_high_priority_followup', layer: 'OUTCOME', label: 'Tindak lanjut kasus prioritas tinggi', description: 'Proporsi kasus TINGGI yang menerima tindak lanjut.', computable: true },
  { id: 'outcome_followup_completion', layer: 'OUTCOME', label: 'Penyelesaian tindak lanjut', description: 'Proporsi tindak lanjut yang diselesaikan.', computable: true },
  { id: 'outcome_missed_followup_reduction', layer: 'OUTCOME', label: 'Penurunan tindak lanjut terlewat', description: 'Perubahan proporsi kasus tanpa tindak lanjut dari waktu ke waktu.', computable: false },
  { id: 'outcome_user_adoption', layer: 'OUTCOME', label: 'Adopsi pengguna', description: 'Proporsi pengguna terdaftar yang aktif menggunakan sistem.', computable: false },
  { id: 'outcome_continuity_of_care', layer: 'OUTCOME', label: 'Indikator kesinambungan perawatan', description: 'Proporsi ibu dengan rangkaian deteksi–validasi–tindak lanjut lengkap.', computable: true },
];
