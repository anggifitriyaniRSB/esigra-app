import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RotateCcw, Presentation, X } from 'lucide-react';
import { demoService } from '../../services/demoService';

const DEMO_NAV = [
  { label: 'Beranda Demo', path: '/demo' },
  { label: 'Demo Terpandu', path: '/demo/guided' },
  { label: 'Inovasi', path: '/demo/innovation' },
  { label: 'Dampak & Pilot', path: '/demo/impact' },
  { label: 'Kesiapan Pilot', path: '/demo/pilot-readiness' },
  { label: 'Sebelum vs Sesudah', path: '/demo/before-after' },
  { label: 'Ringkasan Pemangku Kepentingan', path: '/demo/stakeholder' },
];

export function DemoLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [presentationMode, setPresentationMode] = useState(false);

  const handleReset = () => {
    demoService.reset();
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      <div className="bg-[var(--color-ink)] px-4 py-2 text-center text-xs font-medium text-white">
        DEMO ENVIRONMENT — data dan skenario di halaman ini bersifat fiktif, bukan data pasien nyata.
      </div>

      {!presentationMode && (
        <header className="border-b border-[var(--color-sage-line)] bg-white/70">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
            <Link to="/demo" className="font-display text-lg font-semibold text-[var(--color-deep-dark)]">
              e-SIGRA <span className="text-xs font-normal text-[var(--color-ink)]/50">· Demo</span>
            </Link>
            <nav className="flex flex-wrap gap-1">
              {DEMO_NAV.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--color-ink)]/70 hover:bg-[var(--color-sage)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex gap-2">
              <button
                onClick={() => setPresentationMode(true)}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--color-sage-line)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)]/70 hover:bg-[var(--color-sage)]"
              >
                <Presentation className="h-3.5 w-3.5" /> Mode Presentasi
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--color-sage-line)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)]/70 hover:bg-[var(--color-sage)]"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset Demo
              </button>
              <Link
                to="/login"
                className="rounded-lg bg-[var(--color-deep)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--color-deep-dark)]"
              >
                Buka Aplikasi
              </Link>
            </div>
          </div>
        </header>
      )}

      {presentationMode && (
        <button
          onClick={() => setPresentationMode(false)}
          className="fixed right-4 top-12 z-50 flex items-center gap-1.5 rounded-full bg-[var(--color-ink)]/80 px-4 py-2 text-xs font-medium text-white shadow-lg"
        >
          <X className="h-3.5 w-3.5" /> Keluar Mode Presentasi
        </button>
      )}

      <main className={presentationMode ? 'mx-auto max-w-5xl px-6 py-14' : 'mx-auto max-w-5xl px-5 py-8'}>
        {children}
      </main>
    </div>
  );
}
