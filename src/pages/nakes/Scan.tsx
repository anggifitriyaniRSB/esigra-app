import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScanLine, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { qrService, type MaternalSummary } from '../../services/qrService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RiskBadge } from '../../components/common/RiskBadge';

export function ScanPage() {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [result, setResult] = useState<MaternalSummary | null | undefined>(undefined);

  const handleResolve = () => {
    if (!user || !code) return;
    const summary = qrService.resolveToken(code.trim(), user.id, user.role);
    setResult(summary);
  };

  return (
    <div className="mx-auto max-w-sm space-y-5">
      <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Scan QR</h1>

      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[var(--color-sage)] text-[var(--color-deep)]">
          <ScanLine className="h-10 w-10" />
        </div>
        <p className="text-sm text-[var(--color-ink)]/60">
          Kamera pemindai tidak tersedia pada prototipe ini. Masukkan kode secara manual.
        </p>
      </Card>

      <Card className="space-y-3 p-5">
        <label className="block text-sm font-medium text-[var(--color-ink)]">Masukkan kode secara manual</label>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ESG-XXXXXXXX"
            className="flex-1 rounded-xl border border-[var(--color-sage-line)] px-4 py-2.5 text-sm font-mono outline-none focus:border-[var(--color-deep)]"
          />
          <Button icon={<Search className="h-4 w-4" />} onClick={handleResolve}>
            Cari
          </Button>
        </div>
      </Card>

      {result === null && (
        <Card className="flex flex-col items-center gap-2 border-[var(--color-red)]/20 bg-[var(--color-red-bg)] p-6 text-center">
          <p className="font-medium text-[var(--color-red)]">QR tidak dapat divalidasi.</p>
          <p className="text-xs text-[var(--color-ink)]/60">
            Kode tidak dikenali, sudah dicabut, atau Anda tidak memiliki akses untuk memindainya.
          </p>
        </Card>
      )}

      {result && (
        <Card className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-semibold text-[var(--color-ink)]">{result.name}</p>
            {result.currentRisk && <RiskBadge level={result.currentRisk} size="sm" />}
          </div>
          <p className="text-sm text-[var(--color-ink)]/70">
            {result.gestationalWeeks} minggu · Trimester {result.trimester}
          </p>
          <p className="text-sm text-[var(--color-ink)]/70">Kontak: {result.maskedPhone}</p>
          {result.activeFollowUp && (
            <p className="text-xs font-medium text-[var(--color-amber)]">Memiliki tindak lanjut aktif</p>
          )}
          <Link to={`/nakes/ibu/${result.motherId}`}>
            <Button fullWidth variant="secondary">
              Lihat Detail Lengkap
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
