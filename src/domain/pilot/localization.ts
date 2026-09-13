/**
 * Localization architecture.
 *
 * This is deliberately a thin abstraction, not a full translation system:
 * the point of this file is to demonstrate the SHAPE that lets e-SIGRA
 * expand to a new language/region via configuration, not to ship finished
 * translations. Only `id-ID` content has been written and reviewed as part
 * of this codebase. `vi-VN` and `en-US` entries exist to prove the
 * architecture works, but are explicitly marked DRAFT / NOT_REVIEWED —
 * clinical content must never be presented to a real user in a language
 * whose `reviewStatus` is not REVIEWED.
 */
export type LanguageCode = 'id-ID' | 'vi-VN' | 'en-US';

export type ContentReviewStatus =
  | 'REVIEWED' // signed off by a qualified reviewer for this language/region
  | 'DRAFT' // machine or provisional translation, not reviewed
  | 'NOT_LOCALIZED'; // no translation attempted yet

export interface LocaleMeta {
  code: LanguageCode;
  label: string;
  region: string;
  reviewStatus: ContentReviewStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  note: string;
}

export const LOCALES: Record<LanguageCode, LocaleMeta> = {
  'id-ID': {
    code: 'id-ID',
    label: 'Bahasa Indonesia',
    region: 'Indonesia',
    reviewStatus: 'REVIEWED',
    reviewedBy: 'e-SIGRA product team (prototype authorship)',
    reviewedAt: '2026-09-10',
    note: 'Primary language of this prototype. All clinical microcopy originates here.',
  },
  'vi-VN': {
    code: 'vi-VN',
    label: 'Tiếng Việt',
    region: 'Vietnam',
    reviewStatus: 'NOT_LOCALIZED',
    reviewedBy: null,
    reviewedAt: null,
    note:
      'No Vietnamese translation exists yet. A future Vietnam pilot requires a Vietnam-based clinical ' +
      'and linguistic reviewer to produce and approve this content before any patient-facing use — ' +
      'this is explicitly NOT done by automatic/machine translation.',
  },
  'en-US': {
    code: 'en-US',
    label: 'English',
    region: 'International / Stakeholder',
    reviewStatus: 'DRAFT',
    reviewedBy: null,
    reviewedAt: null,
    note: 'Used only for stakeholder/grant-reviewer materials in this demo, never for patient-facing screens.',
  },
};

/**
 * A minimal set of UI strings translated per locale, to prove the
 * abstraction — NOT a claim that the full application is localized.
 * Only used by the /demo layer for stakeholder illustration.
 */
export const DEMO_LOCALE_STRINGS: Record<LanguageCode, Record<string, string>> = {
  'id-ID': {
    start_screening: 'Mulai Deteksi Dini',
    risk_high: 'Prioritas Evaluasi',
    risk_medium: 'Perlu Perhatian',
    risk_low: 'Risiko Rendah',
  },
  'vi-VN': {
    start_screening: 'Bắt đầu sàng lọc sớm (bản nháp — chưa được xem xét)',
    risk_high: 'Ưu tiên đánh giá (bản nháp)',
    risk_medium: 'Cần chú ý (bản nháp)',
    risk_low: 'Nguy cơ thấp (bản nháp)',
  },
  'en-US': {
    start_screening: 'Start Early Detection',
    risk_high: 'Priority Evaluation',
    risk_medium: 'Needs Attention',
    risk_low: 'Low Risk',
  },
};

export function getLocaleMeta(code: LanguageCode): LocaleMeta {
  return LOCALES[code];
}
