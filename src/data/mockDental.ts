import type { DentalRecord } from '../types/dental';

export const mockDentalRecords: DentalRecord[] = [
  {
    id: 'dental_01',
    motherId: 'mother_01',
    problems: { karies: 'RINGAN', gingivitis: null, gigiBerlubang: false, gigiGoyang: false, abses: false },
    score: 2,
    status: 'KARIES_RINGAN',
    recommendation: 'Disarankan pemeriksaan ke dokter gigi pada kunjungan berikutnya.',
    createdAt: '2026-08-20T09:00:00.000Z',
  },
  {
    id: 'dental_02',
    motherId: 'mother_02',
    problems: { karies: null, gingivitis: 'SEDANG', gigiBerlubang: false, gigiGoyang: false, abses: false },
    score: 5,
    status: 'GINGIVITIS',
    recommendation: 'Perhatikan kebersihan gusi dan konsultasikan ke dokter gigi.',
    createdAt: '2026-08-18T09:00:00.000Z',
  },
];
