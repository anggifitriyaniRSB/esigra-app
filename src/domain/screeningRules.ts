import type { RiskLevel, SymptomDefinition, SuspectMatch } from '../types/screening';

/**
 * SCREENING_CONFIG is the single source of truth for the e-SIGRA prototype
 * screening algorithm. It is intentionally kept out of UI components so a
 * future clinical-governance layer (see /admin/screening-rules) can update
 * thresholds and weights without touching presentation code.
 *
 * CLINICAL GOVERNANCE STATUS
 * ---------------------------------------------------------------------
 * clinicalValidationStatus: "PROTOTYPE — NOT CLINICALLY VALIDATED"
 *
 * The symptom weights, thresholds, and combination rules below are taken
 * directly from the original e-SIGRA concept brief. They have NOT been
 * independently validated against clinical evidence or reviewed by a
 * credentialed obstetric clinician. They must not be presented to any
 * real patient as a validated clinical instrument. See the roadmap at the
 * bottom of this file for the governance steps required before any of
 * this can be used outside a demo/prototype context.
 *
 * Versioning: every change to this object should bump `version` and be
 * recorded in the audit log by the service layer that applies the change
 * (see auditService + the RULE_UPDATED action).
 */
export const SCREENING_CONFIG = {
  version: 'v1.0',
  sourceVersion: 'e-SIGRA concept brief v1',
  effectiveDate: '2026-09-10',
  clinicalValidationStatus: 'PROTOTYPE — NOT CLINICALLY VALIDATED' as const,
  approvalStatus: 'DRAFT' as const,
  validationWindowHours: 48,
  /** Alias kept for external/spec naming ("VALIDATION_TARGET_HOURS"). */
  get validationTargetHours() {
    return this.validationWindowHours;
  },
  /**
   * Whether the raw numeric score is surfaced on patient-facing screens.
   * Kept false by default: mothers see risk level and plain-language
   * interpretation, while Nakes/Admin can see the underlying score for
   * clinical review. A future clinical-governance workflow can toggle this.
   */
  showScoreToPatient: false,
  thresholds: {
    TINGGI: 20, // score >= 20
    SEDANG: 15, // score >= 15
    // score < 15 -> RENDAH (subject to critical-indicator override, see below)
  },
  symptoms: [
    { code: 'perdarahan_vagina', label: 'Perdarahan dari jalan lahir', category: 'UTAMA', score: 10, active: true },
    { code: 'sakit_kepala_berat', label: 'Sakit kepala berat', category: 'UTAMA', score: 8, active: true },
    { code: 'penglihatan_kabur', label: 'Penglihatan kabur', category: 'UTAMA', score: 8, active: true },
    { code: 'bengkak_wajah_tangan', label: 'Bengkak wajah / tangan', category: 'UTAMA', score: 7, active: true },
    { code: 'nyeri_uluhati', label: 'Nyeri ulu hati', category: 'UTAMA', score: 9, active: true },
    { code: 'muntah_berlebihan', label: 'Muntah berlebihan', category: 'UTAMA', score: 6, active: true },
    { code: 'demam_tinggi', label: 'Demam tinggi', category: 'UTAMA', score: 7, active: true },
    { code: 'gerakan_janin_berkurang', label: 'Gerakan janin berkurang', category: 'UTAMA', score: 10, active: true },
    { code: 'tekanan_darah_140_90', label: 'Tekanan darah tinggi (≥140/90)', category: 'UTAMA', score: 6, active: true },
    { code: 'protein_urine_positif', label: 'Protein urine positif', category: 'UTAMA', score: 8, active: true },
    { code: 'pusing_berat', label: 'Pusing berat', category: 'PENYERTA', score: 5, active: true },
    { code: 'sesak_napas', label: 'Sesak napas', category: 'PENYERTA', score: 7, active: true },
    { code: 'jantung_berdebar', label: 'Jantung berdebar', category: 'PENYERTA', score: 5, active: true },
    { code: 'kontraksi_teratur', label: 'Kontraksi teratur', category: 'PENYERTA', score: 9, active: true },
    { code: 'ketuban_pecah', label: 'Cairan ketuban keluar', category: 'PENYERTA', score: 10, active: true },
    { code: 'nyeri_perut', label: 'Nyeri perut hebat', category: 'PENYERTA', score: 6, active: true },
    { code: 'nyeri_pinggang', label: 'Nyeri pinggang disertai demam', category: 'PENYERTA', score: 4, active: true },
  ] as SymptomDefinition[],
  /**
   * CRITICAL INDICATOR OVERRIDE — "Requires clinical governance."
   *
   * A pure additive score can under-represent a single, individually
   * dangerous sign (e.g. bleeding reported alone scores 10, which sits
   * below the SEDANG threshold of 15 and would otherwise be classified
   * RENDAH). To avoid false reassurance, any symptom listed here forces a
   * screening result of at least SEDANG regardless of total score, even
   * when reported in isolation.
   *
   * This list is a prototype safety net, not a clinically validated rule
   * set. Any change to it should go through the same governance review as
   * SCREENING_CONFIG itself.
   */
  criticalIndicators: [
    'perdarahan_vagina',
    'penglihatan_kabur',
    'sakit_kepala_berat',
    'nyeri_uluhati',
    'gerakan_janin_berkurang',
    'ketuban_pecah',
    'protein_urine_positif',
  ] as string[],
  /**
   * Combination engine: when ALL symptomCodes in an entry are present in a
   * screening, the associated indication is attached to the result as a
   * SCREENING INDICATION — never a confirmed diagnosis. Each rule carries
   * governance metadata so it can be traced, reviewed, and versioned.
   */
  combinations: [
    {
      id: 'combo_preeklamsia_1',
      label: 'Preeklamsia Berat / Suspect',
      symptomCodes: ['bengkak_wajah_tangan', 'sakit_kepala_berat'],
      severity: 'TINGGI',
      message: 'Kombinasi bengkak wajah/tangan dan sakit kepala berat terdeteksi.',
      recommendation: 'Perlu evaluasi tenaga kesehatan untuk kemungkinan preeklamsia berat.',
      clinicalValidationStatus: 'PROTOTYPE — NOT CLINICALLY VALIDATED',
      sourceVersion: 'e-SIGRA concept brief v1',
    },
    {
      id: 'combo_preeklamsia_2',
      label: 'Preeklamsia Berat / Suspect',
      symptomCodes: ['bengkak_wajah_tangan', 'penglihatan_kabur'],
      severity: 'TINGGI',
      message: 'Kombinasi bengkak wajah/tangan dan penglihatan kabur terdeteksi.',
      recommendation: 'Perlu evaluasi tenaga kesehatan untuk kemungkinan preeklamsia berat.',
      clinicalValidationStatus: 'PROTOTYPE — NOT CLINICALLY VALIDATED',
      sourceVersion: 'e-SIGRA concept brief v1',
    },
    {
      id: 'combo_hellp',
      label: 'HELLP Syndrome / Suspect',
      symptomCodes: ['nyeri_uluhati', 'muntah_berlebihan'],
      severity: 'TINGGI',
      message: 'Kombinasi nyeri ulu hati dan muntah berlebihan terdeteksi.',
      recommendation: 'Perlu evaluasi tenaga kesehatan untuk kemungkinan HELLP syndrome.',
      clinicalValidationStatus: 'PROTOTYPE — NOT CLINICALLY VALIDATED',
      sourceVersion: 'e-SIGRA concept brief v1',
    },
    {
      id: 'combo_solusio_plasenta',
      label: 'Solusio Plasenta / Suspect',
      symptomCodes: ['perdarahan_vagina', 'nyeri_perut'],
      severity: 'TINGGI',
      message: 'Kombinasi perdarahan vagina dan nyeri perut hebat terdeteksi.',
      recommendation: 'Perlu evaluasi tenaga kesehatan segera untuk kemungkinan solusio plasenta.',
      clinicalValidationStatus: 'PROTOTYPE — NOT CLINICALLY VALIDATED',
      sourceVersion: 'e-SIGRA concept brief v1',
    },
    {
      id: 'combo_persalinan_prematur',
      label: 'Persalinan Prematur / Suspect',
      symptomCodes: ['perdarahan_vagina', 'kontraksi_teratur'],
      severity: 'TINGGI',
      message: 'Kombinasi perdarahan vagina dan kontraksi teratur terdeteksi.',
      recommendation: 'Perlu evaluasi tenaga kesehatan untuk kemungkinan persalinan prematur.',
      clinicalValidationStatus: 'PROTOTYPE — NOT CLINICALLY VALIDATED',
      sourceVersion: 'e-SIGRA concept brief v1',
    },
    {
      id: 'combo_infeksi_ginjal',
      label: 'Infeksi Ginjal / Suspect',
      symptomCodes: ['demam_tinggi', 'nyeri_pinggang'],
      severity: 'SEDANG',
      message: 'Kombinasi demam tinggi dan nyeri pinggang terdeteksi.',
      recommendation: 'Perlu evaluasi tenaga kesehatan untuk kemungkinan infeksi ginjal.',
      clinicalValidationStatus: 'PROTOTYPE — NOT CLINICALLY VALIDATED',
      sourceVersion: 'e-SIGRA concept brief v1',
    },
    {
      id: 'combo_evaluasi_janin',
      label: 'Perlu evaluasi kondisi janin / maternal',
      symptomCodes: ['gerakan_janin_berkurang', 'pusing_berat'],
      severity: 'TINGGI',
      message: 'Kombinasi gerakan janin berkurang dan pusing berat terdeteksi.',
      recommendation: 'Perlu evaluasi tenaga kesehatan untuk memastikan kondisi janin dan maternal.',
      clinicalValidationStatus: 'PROTOTYPE — NOT CLINICALLY VALIDATED',
      sourceVersion: 'e-SIGRA concept brief v1',
    },
  ] as SuspectMatch[],
  /**
   * Governance roadmap this prototype is expected to go through before any
   * of the above may inform real clinical decisions. Purely descriptive —
   * rendered on /admin/screening-rules — not an implemented workflow.
   */
  governanceRoadmap: [
    'Clinical Validation',
    'Pilot Testing',
    'Safety Review',
    'Regulatory Review',
    'Production Approval',
  ] as string[],
};

export function getActiveSymptoms(): SymptomDefinition[] {
  return SCREENING_CONFIG.symptoms.filter((s) => s.active);
}

/**
 * A symptom is flagged for an inline contextual warning during screening
 * when its individual weight is high enough that, on its own, it meaningfully
 * moves the result toward SEDANG/TINGGI. This never diagnoses — it only tells
 * the person the sign is worth paying attention to while they continue.
 */
const CONTEXTUAL_WARNING_THRESHOLD = 8;

export function isSeriousSymptom(code: string): boolean {
  const def = SCREENING_CONFIG.symptoms.find((s) => s.code === code);
  return !!def && def.score >= CONTEXTUAL_WARNING_THRESHOLD;
}

export function isCriticalIndicator(code: string): boolean {
  return SCREENING_CONFIG.criticalIndicators.includes(code);
}

export function calculateScore(symptomCodes: string[]): number {
  const active = getActiveSymptoms();
  return symptomCodes.reduce((total, code) => {
    const def = active.find((s) => s.code === code);
    return total + (def ? def.score : 0);
  }, 0);
}

/** Pure score-threshold classification, with no critical-indicator override applied. */
export function classifyRiskByScore(score: number): RiskLevel {
  if (score >= SCREENING_CONFIG.thresholds.TINGGI) return 'TINGGI';
  if (score >= SCREENING_CONFIG.thresholds.SEDANG) return 'SEDANG';
  return 'RENDAH';
}

const RISK_RANK: Record<RiskLevel, number> = { RENDAH: 0, SEDANG: 1, TINGGI: 2 };

/**
 * Full risk classification: score-threshold classification, then raised to
 * at least SEDANG if any critical indicator is present, to guard against
 * false reassurance from a single dangerous sign being diluted by additive
 * scoring. See `criticalIndicators` above for rationale and governance note.
 */
export function classifyRisk(score: number, symptomCodes: string[] = []): RiskLevel {
  const byScore = classifyRiskByScore(score);
  const hasCritical = symptomCodes.some((code) => isCriticalIndicator(code));
  if (hasCritical && RISK_RANK[byScore] < RISK_RANK.SEDANG) {
    return 'SEDANG';
  }
  return byScore;
}

export function detectSuspectConditions(symptomCodes: string[]): SuspectMatch[] {
  const set = new Set(symptomCodes);
  return SCREENING_CONFIG.combinations.filter((combo) =>
    combo.symptomCodes.every((code) => set.has(code))
  );
}
