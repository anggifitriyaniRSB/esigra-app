import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ShieldCheck, QrCode, Activity, HeartHandshake, Stethoscope, BookOpen, ClipboardCheck, ClipboardList, LineChart } from 'lucide-react';

const JOURNEY = [
  { icon: Stethoscope, label: 'Deteksi', description: 'Skrining bertahap oleh ibu / keluarga' },
  { icon: BookOpen, label: 'Edukasi', description: 'Materi sesuai trimester & gejala' },
  { icon: ClipboardCheck, label: 'Validasi', description: 'Ditinjau tenaga kesehatan' },
  { icon: ClipboardList, label: 'Tindak Lanjut', description: 'Rujukan / arahan bila diperlukan' },
  { icon: LineChart, label: 'Monitoring', description: 'Pemantauan berkelanjutan' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <p className="font-display text-xl font-semibold text-[var(--color-deep-dark)]">e-SIGRA</p>
        <div className="flex gap-2">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-[var(--color-deep-dark)] hover:bg-[var(--color-sage)]"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-[var(--color-deep)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-deep-dark)]"
          >
            Daftar
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-sm font-medium text-[var(--color-teal)]">
            Digital Maternal Early Detection, Education &amp; Risk Monitoring System
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-[var(--color-ink)] md:text-5xl">
            Deteksi Lebih Dini.
            <br />
            Dampingi Setiap Perjalanan Kehamilan.
          </h1>
          <p className="mt-4 max-w-md text-[var(--color-ink)]/70">
            e-SIGRA membantu ibu dan tenaga kesehatan melakukan deteksi dini, memahami tanda risiko,
            memperoleh edukasi, dan menjaga kesinambungan tindak lanjut.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-[var(--color-deep)] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[var(--color-deep-dark)]"
            >
              Mulai Deteksi Dini
            </Link>
            <a
              href="#tentang"
              className="rounded-xl border border-[var(--color-deep)] px-6 py-3.5 text-sm font-semibold text-[var(--color-deep)] hover:bg-[var(--color-sage)]"
            >
              Pelajari e-SIGRA
            </a>
          </div>
          <Link
            to="/demo"
            className="mt-3 inline-block text-xs font-medium text-[var(--color-ink)]/50 hover:text-[var(--color-deep)]"
          >
            Peninjau/mitra hibah? Lihat Demo Terpandu →
          </Link>
        </div>

        <div className="relative mx-auto flex h-80 w-full max-w-sm items-center justify-center">
          <div className="absolute h-64 w-64 rounded-full bg-[var(--color-sage)]" />
          <div className="relative flex h-48 w-40 flex-col items-center justify-center gap-3 rounded-3xl bg-white shadow-lg">
            <HeartHandshake className="h-10 w-10 text-[var(--color-deep)]" />
            <div className="h-2 w-20 rounded-full bg-[var(--color-sage)]" />
            <div className="h-2 w-14 rounded-full bg-[var(--color-sage)]" />
            <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-sage-line)]">
              <QrCode className="h-5 w-5 text-[var(--color-deep)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Continuity-of-care journey as a real visual system, not a generic icon row */}
      <section className="border-t border-[var(--color-sage-line)] bg-white/60">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
            Kesinambungan Perawatan
          </h2>
          <p className="mt-1 max-w-lg text-sm text-[var(--color-ink)]/60">
            Setiap deteksi selalu berlanjut ke edukasi, validasi klinis, dan tindak lanjut &mdash; bukan
            berhenti di satu hasil skrining.
          </p>

          <div className="relative mt-10 grid grid-cols-1 gap-6 sm:grid-cols-5">
            <div
              aria-hidden
              className="absolute left-0 right-0 top-7 hidden h-0.5 bg-[var(--color-sage-line)] sm:block"
            />
            {JOURNEY.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--color-deep)] bg-[var(--color-canvas)] text-[var(--color-deep)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-deep-dark)]">
                    {String(i + 1).padStart(2, '0')} &mdash; {step.label}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-ink)]/60">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="tentang" className="border-t border-[var(--color-sage-line)] bg-white/50">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
            Satu ekosistem, tiga peran
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Activity className="h-5 w-5" />}
              title="Deteksi Dini Terpandu"
              description="Skrining bertahap yang membantu mengenali tanda yang membutuhkan perhatian lebih lanjut &mdash; bukan diagnosis pasti."
            />
            <FeatureCard
              icon={<QrCode className="h-5 w-5" />}
              title="Kartu QR Keselamatan"
              description="Ringkasan maternal terhubung stiker fisik pada Buku KIA, tanpa menyimpan data pribadi di kode QR."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Validasi Tenaga Kesehatan"
              description="Setiap hasil skrining ditinjau oleh tenaga kesehatan sebelum tindak lanjut ditentukan."
            />
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 py-8 text-xs text-[var(--color-ink)]/50">
        e-SIGRA — Pelengkap Visual dan Skrining Terintegrasi Maternal. Prototype security architecture.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-sage-line)] bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-sage)] text-[var(--color-deep)]">
        {icon}
      </div>
      <p className="mt-3 font-medium text-[var(--color-ink)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--color-ink)]/60">{description}</p>
    </div>
  );
}
