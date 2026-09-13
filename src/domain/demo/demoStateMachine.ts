export type DemoState =
  | 'DEMO_INITIAL'
  | 'SCREENING_COMPLETED'
  | 'HIGH_PRIORITY_DETECTED'
  | 'NAKES_NOTIFIED'
  | 'VALIDATION_PENDING'
  | 'VALIDATED'
  | 'FOLLOW_UP_ACTIVE'
  | 'FOLLOW_UP_COMPLETED';

const ORDER: DemoState[] = [
  'DEMO_INITIAL',
  'SCREENING_COMPLETED',
  'HIGH_PRIORITY_DETECTED',
  'NAKES_NOTIFIED',
  'VALIDATION_PENDING',
  'VALIDATED',
  'FOLLOW_UP_ACTIVE',
  'FOLLOW_UP_COMPLETED',
];

/** Deterministic "what comes next" — the demo must behave identically every run, never randomly. */
export function nextDemoState(current: DemoState): DemoState {
  const idx = ORDER.indexOf(current);
  if (idx === -1 || idx === ORDER.length - 1) return current;
  return ORDER[idx + 1];
}

export function demoStateIndex(state: DemoState): number {
  return ORDER.indexOf(state);
}

export interface GuidedStep {
  step: number;
  state: DemoState;
  title: string;
  whatHappened: string;
  whyItMatters: string;
  whatHappensNext: string;
}

/**
 * The 7 guided-demo steps (spec section 4), each mapped to the state it
 * produces. Step 1 has no "prior state" — it's the action that produces
 * SCREENING_COMPLETED.
 */
export const GUIDED_STEPS: GuidedStep[] = [
  {
    step: 1,
    state: 'SCREENING_COMPLETED',
    title: 'Ibu melakukan deteksi dini',
    whatHappened:
      'Ibu (dalam demo ini, Siti Rahmawati) mengisi form deteksi dini dengan kombinasi gejala utama dan penyerta.',
    whyItMatters:
      'e-SIGRA tidak hanya membaca satu gejala — sistem mengolah kombinasi gejala untuk membantu menentukan prioritas evaluasi, bukan sekadar daftar centang.',
    whatHappensNext: 'Sistem menghitung indikasi risiko berdasarkan parameter skrining yang dikonfigurasi.',
  },
  {
    step: 2,
    state: 'HIGH_PRIORITY_DETECTED',
    title: 'e-SIGRA mengidentifikasi indikasi risiko',
    whatHappened: 'Kombinasi gejala yang dilaporkan menghasilkan indikasi risiko TINGGI (Prioritas Evaluasi).',
    whyItMatters:
      'Temuan ini adalah indikasi skrining, bukan diagnosis pasti — kombinasi gejala membantu menyoroti kasus yang perlu diprioritaskan tenaga kesehatan.',
    whatHappensNext: 'Notifikasi diteruskan (disimulasikan) ke tenaga kesehatan yang menangani Ibu.',
  },
  {
    step: 3,
    state: 'NAKES_NOTIFIED',
    title: 'Ibu mendapatkan edukasi',
    whatHappened:
      'Ibu diarahkan ke materi edukasi yang relevan dengan tanda yang dilaporkan, sekaligus notifikasi (simulasi) dibuat untuk Nakes.',
    whyItMatters: 'Edukasi kontekstual membantu Ibu memahami langkah yang perlu diambil sambil menunggu tindak lanjut.',
    whatHappensNext: 'Nakes melihat kasus ini di Prioritas Tindak Lanjut pada dashboard.',
  },
  {
    step: 4,
    state: 'VALIDATION_PENDING',
    title: 'Nakes menerima prioritas tindak lanjut',
    whatHappened: 'Kasus muncul di antrean prioritas Nakes, menunggu validasi.',
    whyItMatters: 'Command center Nakes menjawab pertanyaan "siapa yang membutuhkan perhatian saya sekarang?" secara langsung.',
    whatHappensNext: 'Nakes meninjau temuan skrining dan melakukan validasi klinis.',
  },
  {
    step: 5,
    state: 'VALIDATED',
    title: 'Nakes melakukan validasi',
    whatHappened: 'Nakes meninjau temuan dan menandai skrining sebagai tervalidasi.',
    whyItMatters: 'Validasi memastikan keputusan klinis tetap berada pada tenaga kesehatan berwenang — sistem tidak mengambil keputusan klinis secara otonom.',
    whatHappensNext: 'Nakes menetapkan tindak lanjut yang sesuai.',
  },
  {
    step: 6,
    state: 'FOLLOW_UP_ACTIVE',
    title: 'Tindak lanjut tercatat',
    whatHappened: 'Nakes mencatat tindakan tindak lanjut (misalnya rujukan) untuk kasus ini.',
    whyItMatters: 'Tindak lanjut yang tercatat menjaga kesinambungan penanganan, bukan berhenti di satu hasil skrining.',
    whatHappensNext: 'Kasus dipantau hingga tindak lanjut selesai.',
  },
  {
    step: 7,
    state: 'FOLLOW_UP_COMPLETED',
    title: 'Kasus masuk monitoring',
    whatHappened: 'Tindak lanjut ditandai selesai dan kasus tercatat dalam riwayat pemantauan berkelanjutan.',
    whyItMatters: 'Ini menutup lingkar (closed loop): deteksi tidak berhenti di hasil skrining, tetapi berlanjut hingga penanganan tercatat.',
    whatHappensNext: 'Siklus dapat dimulai kembali pada skrining berikutnya — pemantauan bersifat berkelanjutan.',
  },
];

export function getGuidedStepForState(state: DemoState): GuidedStep | undefined {
  return GUIDED_STEPS.find((s) => s.state === state);
}
