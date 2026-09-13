/**
 * Fixed fictional demo patient used ONLY by the /demo guided-tour layer.
 * This is intentionally separate from src/data/mockMothers.ts (the regular
 * app's seed data) so the grant-demo experience can never be confused with,
 * or accidentally mutate, the regular application's data set.
 *
 * DEMO DATA — BUKAN DATA PASIEN NYATA.
 */
export const DEMO_PATIENT = {
  id: 'demo_patient_001',
  name: 'Siti Rahmawati',
  age: 27,
  gestationalWeeks: 28,
  trimester: 2 as const,
  location: 'Lokasi Demo',
  gravidaPara: 'G2P1',
  qrToken: 'ESG-DEMO0001',
};

export const DEMO_SYMPTOMS = {
  // Chosen to score TINGGI (score 23 >= threshold 20) and trigger the
  // "Preeklamsia Berat / Suspect" combination rule, so the guided demo can
  // honestly show a high-priority indication end to end.
  utama: ['bengkak_wajah_tangan', 'sakit_kepala_berat', 'penglihatan_kabur'] as string[],
  penyerta: [] as string[],
};

export const DEMO_NAKES = {
  id: 'demo_nakes_001',
  name: 'Bidan Demo',
};
