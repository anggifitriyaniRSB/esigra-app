/**
 * PILOT_CONFIG — the mechanism that lets e-SIGRA deploy to multiple
 * locations from ONE codebase via configuration, instead of forking a
 * separate build per site. This is the concrete answer to "how could this
 * scale across regions": a new site is a new PilotConfig entry, not a new
 * repository.
 *
 * These three entries are fictional planning configuration for demo/grant
 * purposes only — they do not represent signed agreements, live sites, or
 * real enrollment.
 */
export type PilotStatus = 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export interface PilotConfig {
  pilotId: string;
  siteName: string;
  location: string;
  country: string;
  language: string;
  healthWorkerRoles: string[];
  screeningConfigVersion: string;
  educationContentVersion: string;
  referralWorkflow: string;
  validationTargetHours: number;
  enabledModules: string[];
  startDate: string | null;
  endDate: string | null;
  status: PilotStatus;
  /** Explicit, so nobody mistakes planning configuration for a live commitment. */
  note: string;
}

const CORE_MODULES = [
  'Deteksi Dini',
  'Edukasi',
  'QR Maternal Safety Card',
  'Nakes Dashboard',
  'Tindak Lanjut',
  'Kesehatan Gigi',
];

export const PILOT_MALANG: PilotConfig = {
  pilotId: 'PILOT_MALANG',
  siteName: 'Puskesmas Demo — Malang',
  location: 'Malang, Jawa Timur',
  country: 'Indonesia',
  language: 'id-ID',
  healthWorkerRoles: ['Bidan', 'Kader Kesehatan'],
  screeningConfigVersion: 'v1.0',
  educationContentVersion: 'v1.0',
  referralWorkflow: 'Puskesmas → RSUD Kabupaten/Kota',
  validationTargetHours: 48,
  enabledModules: CORE_MODULES,
  startDate: null,
  endDate: null,
  status: 'PLANNING',
  note: 'Konfigurasi perencanaan untuk keperluan demo/hibah — belum ada situs aktif.',
};

export const PILOT_MEDAN: PilotConfig = {
  pilotId: 'PILOT_MEDAN',
  siteName: 'Puskesmas Demo — Medan',
  location: 'Medan, Sumatera Utara',
  country: 'Indonesia',
  language: 'id-ID',
  healthWorkerRoles: ['Bidan', 'Kader Kesehatan'],
  screeningConfigVersion: 'v1.0',
  educationContentVersion: 'v1.0',
  referralWorkflow: 'Puskesmas → RSUD Kabupaten/Kota',
  validationTargetHours: 48,
  enabledModules: CORE_MODULES,
  startDate: null,
  endDate: null,
  status: 'PLANNING',
  note: 'Konfigurasi perencanaan untuk keperluan demo/hibah — belum ada situs aktif.',
};

export const PILOT_VIETNAM: PilotConfig = {
  pilotId: 'PILOT_VIETNAM',
  siteName: 'Demo Commune Health Station — Vietnam',
  location: 'Demo Province, Vietnam',
  country: 'Vietnam',
  language: 'vi-VN',
  healthWorkerRoles: ['Commune Health Worker', 'Village Health Volunteer'],
  screeningConfigVersion: 'v1.0-draft',
  educationContentVersion: 'NOT_LOCALIZED',
  referralWorkflow: 'Commune Health Station → District Hospital (draft — requires local clinical review)',
  validationTargetHours: 48,
  enabledModules: CORE_MODULES,
  startDate: null,
  endDate: null,
  status: 'PLANNING',
  note:
    'Illustrative configuration only. Clinical rules, referral pathway, and education content have not ' +
    'been reviewed by a Vietnam-based clinical partner and must not be deployed as-is.',
};

export const PILOT_CONFIGS: PilotConfig[] = [PILOT_MALANG, PILOT_MEDAN, PILOT_VIETNAM];

export const PILOT_READINESS_ROADMAP = [
  {
    phase: 'PHASE 1',
    title: 'Prototype',
    objective: 'Membangun dan menguji fungsionalitas inti secara internal.',
    activities: ['Pengembangan alur skrining, validasi, dan tindak lanjut', 'Pengujian unit dan integrasi'],
    output: 'Prototipe fungsional yang dapat didemonstrasikan (status saat ini).',
    successIndicator: 'Alur demo end-to-end berjalan tanpa error pada setiap pengujian.',
  },
  {
    phase: 'PHASE 2',
    title: 'Clinical & User Validation',
    objective: 'Meninjau kembali parameter klinis dan kegunaan bersama pihak berwenang.',
    activities: [
      'Tinjauan klinisi/bidan berwenang atas skor, ambang batas, dan kombinasi indikasi',
      'Uji kegunaan bersama calon pengguna (ibu hamil dan Nakes)',
    ],
    output: 'Aturan skrining tervalidasi klinis dan catatan revisi UX.',
    successIndicator: 'Tidak ada temuan kritis dari tinjauan klinis; kegunaan dinilai memadai oleh pengguna uji.',
  },
  {
    phase: 'PHASE 3',
    title: 'Pilot Preparation',
    objective: 'Menyiapkan situs, pelatihan, dan tata kelola sebelum implementasi.',
    activities: [
      'Pelatihan Nakes/kader',
      'Penyusunan alur rujukan lokal',
      'Persetujuan etik/kelembagaan bila diperlukan',
    ],
    output: 'Situs siap, tim terlatih, dokumen tata kelola lengkap.',
    successIndicator: 'Seluruh Nakes situs pilot menyelesaikan pelatihan; persetujuan kelembagaan diperoleh.',
  },
  {
    phase: 'PHASE 4',
    title: 'Pilot Implementation',
    objective: 'Menjalankan e-SIGRA pada situs terbatas dengan pengawasan aktif.',
    activities: ['Onboarding ibu hamil dan Nakes', 'Pemantauan operasional harian', 'Dukungan teknis langsung'],
    output: 'Data penggunaan dan hasil operasional dari situs pilot.',
    successIndicator: 'Sistem digunakan secara konsisten sesuai alur yang dirancang di situs pilot.',
  },
  {
    phase: 'PHASE 5',
    title: 'Evaluation',
    objective: 'Mengevaluasi proses dan hasil terhadap indikator yang ditetapkan.',
    activities: ['Analisis metrik input/proses/hasil', 'Wawancara/umpan balik pengguna', 'Tinjauan keselamatan klinis'],
    output: 'Laporan evaluasi pilot dengan rekomendasi.',
    successIndicator: 'Evaluasi selesai dengan desain yang sesuai; rekomendasi terdokumentasi.',
  },
  {
    phase: 'PHASE 6',
    title: 'Scale',
    objective: 'Memperluas ke situs/wilayah tambahan berdasarkan hasil evaluasi.',
    activities: [
      'Konfigurasi situs baru (bukan basis kode baru)',
      'Adaptasi lokalisasi dan alur rujukan',
      'Replikasi pelatihan',
    ],
    output: 'Situs tambahan aktif menggunakan konfigurasi PILOT_CONFIG yang sama.',
    successIndicator: 'Situs baru aktif tanpa perubahan pada basis kode inti.',
  },
];
