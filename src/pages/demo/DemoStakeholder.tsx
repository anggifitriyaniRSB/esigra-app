import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { ClosedLoopDiagram } from '../../components/demo/ClosedLoopDiagram';

const QA = [
  {
    q: 'Apa masalahnya?',
    a: 'Tanda bahaya kehamilan dapat terlewat, informasi tersebar di berbagai tempat, dan tindak lanjut berpotensi tertunda karena proses yang manual dan terfragmentasi.',
  },
  {
    q: 'Apa solusinya?',
    a: 'e-SIGRA adalah alur kerja deteksi dini, edukasi, validasi klinis, dan tindak lanjut maternal yang saling terhubung dalam satu sistem digital.',
  },
  {
    q: 'Siapa yang diuntungkan?',
    a: 'Ibu hamil mendapat deteksi dini dan edukasi kontekstual; tenaga kesehatan mendapat antrean prioritas dan alat validasi; fasilitas kesehatan mendapat jejak audit dan data operasional.',
  },
  {
    q: 'Bagaimana cara kerjanya?',
    a: 'Kombinasi gejala diproses menjadi indikasi risiko (bukan diagnosis), diteruskan sebagai prioritas ke Nakes, divalidasi, ditindaklanjuti, dan dipantau berkelanjutan.',
  },
  {
    q: 'Apa yang inovatif?',
    a: 'Kombinasi gejala terstruktur, jembatan stiker fisik–QR digital, command center Nakes, dan alur tindak lanjut lingkar tertutup — terintegrasi dalam satu produk.',
  },
  {
    q: 'Bagaimana ini akan diukur?',
    a: 'Melalui kerangka input–proses–hasil yang disiapkan sejak awal, dievaluasi dengan desain penelitian yang sesuai pada tahap pilot — bukan klaim dampak yang belum diuji.',
  },
  {
    q: 'Bagaimana ini bisa diskalakan?',
    a: 'Melalui konfigurasi (PILOT_CONFIG), bukan basis kode terpisah per lokasi — situs baru seperti Malang, Medan, atau Vietnam ditambahkan sebagai konfigurasi, bukan proyek baru.',
  },
];

export function DemoStakeholderPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Ringkasan Pemangku Kepentingan</h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--color-ink)]/60">
          Disusun untuk yayasan, donor, institusi kesehatan, pemerintah, mitra klinis, dan tim riset yang
          mengevaluasi e-SIGRA untuk tahap hibah/pilot.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {QA.map((item) => (
          <Card key={item.q} className="p-5">
            <p className="font-medium text-[var(--color-deep)]">{item.q}</p>
            <p className="mt-1.5 text-sm text-[var(--color-ink)]/70">{item.a}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-sage-line)] bg-white/60 p-8">
        <ClosedLoopDiagram />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/demo/pilot-readiness" className="rounded-xl border border-[var(--color-deep)] px-5 py-2.5 text-sm font-medium text-[var(--color-deep)]">
          Lihat Peta Jalan Pilot
        </Link>
        <Link to="/demo/impact" className="rounded-xl border border-[var(--color-deep)] px-5 py-2.5 text-sm font-medium text-[var(--color-deep)]">
          Lihat Kerangka Dampak
        </Link>
        <Link to="/demo/guided" className="rounded-xl bg-[var(--color-deep)] px-5 py-2.5 text-sm font-medium text-white">
          Coba Demo Terpandu
        </Link>
      </div>
    </div>
  );
}
