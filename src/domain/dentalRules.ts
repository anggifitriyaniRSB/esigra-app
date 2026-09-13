import type { DentalProblems, DentalStatus } from '../types/dental';

export const DENTAL_SCORING_CONFIG = {
  karies: { RINGAN: 2, SEDANG: 4, BERAT: 6 },
  gingivitis: { RINGAN: 3, SEDANG: 5, BERAT: 7 },
  gigiBerlubang: 4,
  gigiGoyang: 5,
  abses: 8,
};

export function calculateDentalScore(problems: DentalProblems): number {
  let score = 0;
  if (problems.karies) score += DENTAL_SCORING_CONFIG.karies[problems.karies];
  if (problems.gingivitis) score += DENTAL_SCORING_CONFIG.gingivitis[problems.gingivitis];
  if (problems.gigiBerlubang) score += DENTAL_SCORING_CONFIG.gigiBerlubang;
  if (problems.gigiGoyang) score += DENTAL_SCORING_CONFIG.gigiGoyang;
  if (problems.abses) score += DENTAL_SCORING_CONFIG.abses;
  return score;
}

export function classifyDentalStatus(problems: DentalProblems): DentalStatus {
  if (problems.gingivitis) return 'GINGIVITIS';
  if (problems.karies === 'BERAT') return 'KARIES_BERAT';
  if (problems.karies === 'SEDANG' || problems.karies === 'RINGAN') return 'KARIES_RINGAN';
  if (problems.gigiBerlubang || problems.gigiGoyang || problems.abses) return 'KARIES_RINGAN';
  return 'SEHAT';
}

export function recommendDentalAction(status: DentalStatus, problems: DentalProblems): string {
  if (problems.abses) {
    return 'Segera konsultasi ke dokter gigi. Abses memerlukan penanganan lebih lanjut.';
  }
  switch (status) {
    case 'SEHAT':
      return 'Pertahankan kebersihan gigi dan mulut dengan sikat gigi 2x sehari.';
    case 'KARIES_RINGAN':
      return 'Disarankan pemeriksaan ke dokter gigi pada kunjungan berikutnya.';
    case 'KARIES_BERAT':
      return 'Disarankan konsultasi dokter gigi dalam waktu dekat.';
    case 'GINGIVITIS':
      return 'Perhatikan kebersihan gusi dan konsultasikan ke dokter gigi.';
    default:
      return 'Konsultasikan dengan dokter gigi untuk evaluasi lebih lanjut.';
  }
}
