import { Link } from 'react-router-dom';
import { ArrowRight, Users, Workflow, ShieldCheck } from 'lucide-react';
import { ClosedLoopDiagram } from '../../components/demo/ClosedLoopDiagram';
import { Card } from '../../components/ui/Card';

export function DemoHome() {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-teal)]">
          Demo Hibah / Peninjauan Pemangku Kepentingan
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-[var(--color-ink)]">
          e-SIGRA: Deteksi Dini, Validasi Klinis, dan Tindak Lanjut Maternal yang Berkesinambungan
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-ink)]/70">
          Sebuah alur kerja kesehatan digital — bukan sekadar formulir skrining — yang menghubungkan ibu
          hamil, tenaga kesehatan, dan proses tindak lanjut dalam satu lingkar tertutup (closed loop).
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/demo/guided"
            className="flex items-center gap-2 rounded-xl bg-[var(--color-deep)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-deep-dark)]"
          >
            Mulai Demo Terpandu <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/demo/stakeholder"
            className="rounded-xl border border-[var(--color-deep)] px-6 py-3 text-sm font-semibold text-[var(--color-deep)] hover:bg-[var(--color-sage)]"
          >
            Ringkasan Pemangku Kepentingan
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <Users className="h-5 w-5 text-[var(--color-deep)]" />
          <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">Siapa yang menggunakan?</p>
          <p className="mt-1 text-xs text-[var(--color-ink)]/60">
            Ibu hamil/keluarga, tenaga kesehatan (Nakes), dan admin sistem — tiga peran, satu ekosistem.
          </p>
        </Card>
        <Card className="p-5">
          <Workflow className="h-5 w-5 text-[var(--color-deep)]" />
          <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">Bagaimana cara kerjanya?</p>
          <p className="mt-1 text-xs text-[var(--color-ink)]/60">
            Kombinasi gejala diproses menjadi indikasi risiko, ditinjau Nakes, lalu ditindaklanjuti dan
            dipantau berkelanjutan.
          </p>
        </Card>
        <Card className="p-5">
          <ShieldCheck className="h-5 w-5 text-[var(--color-deep)]" />
          <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">Kenapa berbeda?</p>
          <p className="mt-1 text-xs text-[var(--color-ink)]/60">
            Bukan sekadar sistem informasi kesehatan konvensional — e-SIGRA menutup lingkar dari deteksi
            hingga tindak lanjut, dengan validasi klinis tetap di tangan tenaga kesehatan.
          </p>
        </Card>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-sage-line)] bg-white/60 p-8">
        <p className="text-center font-display text-lg font-semibold text-[var(--color-ink)]">
          Closed-Loop Maternal Risk Monitoring
        </p>
        <ClosedLoopDiagram />
      </div>

      <p className="text-center text-xs text-[var(--color-ink)]/40">
        Seluruh data pada halaman demo ini fiktif — DEMO DATA, BUKAN DATA PASIEN NYATA.
      </p>
    </div>
  );
}
