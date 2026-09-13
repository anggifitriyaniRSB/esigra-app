import type { RiskLevel, Screening } from '../types/screening';

export type Urgency = 'ROUTINE' | 'SOON' | 'IMMEDIATE';

export interface RecommendationConfig {
  id: string;
  riskLevel: RiskLevel;
  headline: string;
  interpretation: string;
  whatToDo: string[];
  whoToContact: string;
  urgency: Urgency;
  nextActionLabel: string;
  /** Governance status of this recommendation text itself, distinct from the screening algorithm's. */
  clinicalReviewStatus: 'PROTOTYPE — NOT CLINICALLY VALIDATED';
}

/**
 * RECOMMENDATION_CONFIG — separated from screeningRules.ts (scoring) and
 * from any UI component (rendering). This is deliberate: the screening
 * engine decides a risk level; this module decides what to *say* about
 * that risk level; the UI only renders what this module returns. None of
 * these three concerns should be able to silently drift into another.
 *
 * Section 7 safety rule: a RENDAH result must never be worded as a
 * guarantee of health. "No indication found" is not the same claim as
 * "you are safe", and the copy below is written to preserve that
 * distinction even when simplified for a general audience.
 */
export const RECOMMENDATION_CONFIG: Record<RiskLevel, RecommendationConfig> = {
  RENDAH: {
    id: 'reco_rendah_v1',
    riskLevel: 'RENDAH',
    headline: 'Risiko Rendah',
    interpretation:
      'Tidak ditemukan indikasi risiko berdasarkan parameter skrining yang diisi. Ini bukan jaminan bahwa kehamilan bebas risiko — tetap perlu pemeriksaan kehamilan sesuai jadwal dan mencari pertolongan jika muncul tanda bahaya baru.',
    whatToDo: [
      'Lanjutkan pemeriksaan kehamilan sesuai jadwal yang berlaku.',
      'Pelajari materi edukasi sesuai trimester Ibu saat ini.',
      'Lakukan skrining ulang bila muncul gejala baru.',
    ],
    whoToContact: 'Bidan / tenaga kesehatan pada kunjungan kontrol berikutnya.',
    urgency: 'ROUTINE',
    nextActionLabel: 'Deteksi Dini Baru',
    clinicalReviewStatus: 'PROTOTYPE — NOT CLINICALLY VALIDATED',
  },
  SEDANG: {
    id: 'reco_sedang_v1',
    riskLevel: 'SEDANG',
    headline: 'Perlu Perhatian',
    interpretation:
      'Beberapa tanda yang Ibu laporkan perlu ditinjau oleh tenaga kesehatan untuk memastikan tidak ada kondisi yang perlu ditangani lebih lanjut. Ini adalah indikasi awal dari skrining, bukan diagnosis.',
    whatToDo: [
      'Hubungi tenaga kesehatan yang menangani Ibu untuk konsultasi lebih lanjut.',
      'Catat perkembangan gejala hingga tindak lanjut diberikan.',
      'Jika kondisi memburuk, segera cari pertolongan medis.',
    ],
    whoToContact: 'Bidan atau tenaga kesehatan yang menangani Ibu, sesegera mungkin.',
    urgency: 'SOON',
    nextActionLabel: 'Hubungi Tenaga Kesehatan',
    clinicalReviewStatus: 'PROTOTYPE — NOT CLINICALLY VALIDATED',
  },
  TINGGI: {
    id: 'reco_tinggi_v1',
    riskLevel: 'TINGGI',
    headline: 'PRIORITAS EVALUASI',
    interpretation:
      'Hasil skrining menunjukkan adanya tanda yang memerlukan evaluasi tenaga kesehatan. Ini adalah indikasi awal, bukan diagnosis pasti — keputusan klinis tetap berada pada tenaga kesehatan yang berwenang.',
    whatToDo: [
      'Ikuti arahan tenaga kesehatan begitu tersedia.',
      'Jika kondisi memburuk atau terdapat tanda bahaya lain, segera cari pertolongan medis.',
      'Pastikan nomor kontak Ibu dan pendamping tetap aktif.',
    ],
    whoToContact:
      'Tenaga kesehatan yang menangani Ibu, atau fasilitas kesehatan / layanan kegawatdaruratan terdekat.',
    urgency: 'IMMEDIATE',
    nextActionLabel: 'Hubungi Tenaga Kesehatan',
    clinicalReviewStatus: 'PROTOTYPE — NOT CLINICALLY VALIDATED',
  },
};

export function resolveRecommendation(riskLevel: RiskLevel): RecommendationConfig {
  return RECOMMENDATION_CONFIG[riskLevel];
}

export type ValidationStatusLabel =
  | 'Menunggu validasi tenaga kesehatan'
  | 'Sudah divalidasi — tindak lanjut sedang berjalan'
  | 'Sudah divalidasi — tindak lanjut selesai'
  | 'Sudah divalidasi — tindak lanjut diperlukan'
  | 'Sudah divalidasi tenaga kesehatan';

/** Derives what-happens-next status purely from stored screening state — no clinical judgment here. */
export function describeValidationStatus(screening: Screening): ValidationStatusLabel {
  if (screening.validationStatus === 'BELUM_DIVALIDASI') {
    return 'Menunggu validasi tenaga kesehatan';
  }
  if (screening.followUpStatus === 'AKTIF') {
    return 'Sudah divalidasi — tindak lanjut sedang berjalan';
  }
  if (screening.followUpStatus === 'SELESAI') {
    return 'Sudah divalidasi — tindak lanjut selesai';
  }
  if (screening.followUpStatus === 'DIPERLUKAN') {
    return 'Sudah divalidasi — tindak lanjut diperlukan';
  }
  return 'Sudah divalidasi tenaga kesehatan';
}
