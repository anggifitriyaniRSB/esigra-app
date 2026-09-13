import { Card } from '../../components/ui/Card';

const INNOVATIONS = [
  { n: '01', title: 'Deteksi Dini Berbasis Kombinasi Gejala', body: 'e-SIGRA mengintegrasikan gejala utama dan penyerta ke dalam satu algoritma skor, bukan sekadar daftar centang gejala tunggal.' },
  { n: '02', title: 'Catatan Kesehatan Gigi Maternal Digital', body: 'e-SIGRA mengintegrasikan pemantauan kesehatan gigi ke dalam rekam maternal digital yang sama.' },
  { n: '03', title: 'Identitas Risiko Maternal Berbasis QR', body: 'e-SIGRA mengintegrasikan token QR opaque yang menghubungkan Buku KIA fisik dengan ringkasan maternal digital, tanpa menyimpan data pribadi di dalam kode.' },
  { n: '04', title: 'Stiker Tanda Bahaya Digital', body: 'e-SIGRA mengintegrasikan representasi digital dari konsep stiker tanda bahaya fisik, menjembatani dunia kertas dan digital.' },
  { n: '05', title: 'Dashboard Pemantauan Tenaga Kesehatan', body: 'e-SIGRA mengintegrasikan antrean prioritas berbasis risiko ke dalam satu command center bagi Nakes.' },
  { n: '06', title: 'Tindak Lanjut Lingkar Tertutup', body: 'e-SIGRA mengintegrasikan alur validasi dan tindak lanjut sehingga setiap deteksi tercatat hingga penanganan selesai, bukan berhenti di hasil skrining.' },
  { n: '07', title: 'Digital Education Disc', body: 'e-SIGRA mengintegrasikan edukasi interaktif berbasis topik dan gejala ke dalam satu pengalaman yang mudah diakses ibu hamil.' },
];

export function DemoInnovationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Cerita Inovasi</h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--color-ink)]/60">
          e-SIGRA mengintegrasikan sejumlah pendekatan yang masing-masing sudah dikenal dalam kesehatan
          digital, ke dalam satu alur kerja maternal yang koheren — bukan mengklaim menjadi satu-satunya
          sistem yang melakukan hal ini.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {INNOVATIONS.map((item) => (
          <Card key={item.n} className="p-5">
            <p className="font-display text-2xl font-semibold text-[var(--color-sage-line)]">{item.n}</p>
            <p className="mt-1 font-medium text-[var(--color-ink)]">{item.title}</p>
            <p className="mt-1 text-sm text-[var(--color-ink)]/60">{item.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
