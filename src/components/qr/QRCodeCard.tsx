import type { RiskLevel } from '../../types/screening';
import { Card } from '../ui/Card';
import { formatDateTimeID } from '../../utils/date';
import { ScanLine, Ban } from 'lucide-react';

const STICKER_UI: Record<RiskLevel, { label: string; bg: string; text: string }> = {
  RENDAH: { label: 'Pemantauan Rutin', bg: 'bg-[var(--color-teal)]', text: 'text-white' },
  SEDANG: { label: 'Perlu Perhatian', bg: 'bg-[var(--color-amber)]', text: 'text-white' },
  TINGGI: { label: 'Prioritas Evaluasi', bg: 'bg-[var(--color-red)]', text: 'text-white' },
};

/** Deterministic pseudo-QR visual pattern derived from the opaque token. Decorative only. */
function PseudoQrPattern({ token, dimmed }: { token: string; dimmed?: boolean }) {
  const size = 9;
  let seed = 0;
  for (let i = 0; i < token.length; i++) seed = (seed * 31 + token.charCodeAt(i)) % 100000;

  const cells: boolean[] = [];
  for (let i = 0; i < size * size; i++) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    cells.push(seed % 2 === 0);
  }

  return (
    <div
      className={`grid gap-[3px] rounded-lg bg-white p-3 ${dimmed ? 'opacity-30 grayscale' : ''}`}
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, width: 176, height: 176 }}
    >
      {cells.map((filled, i) => (
        <div key={i} className={filled ? 'bg-[var(--color-ink)]' : 'bg-transparent'} />
      ))}
    </div>
  );
}

/**
 * Digital rendition of the physical 5×5 cm danger-sign sticker: opaque token
 * only, resolved server-side (see qrService). No name, diagnosis, or medical
 * history is ever encoded directly into the code.
 */
export function QRCodeCard({
  token,
  riskLevel,
  lastScreeningAt,
  revoked = false,
}: {
  token: string;
  riskLevel: RiskLevel | null;
  lastScreeningAt: string | null;
  revoked?: boolean;
}) {
  const sticker = riskLevel ? STICKER_UI[riskLevel] : null;

  return (
    <Card className={`overflow-hidden ${revoked ? 'border-[var(--color-red)]/30' : ''}`}>
      <div className={`px-5 py-4 text-white ${revoked ? 'bg-[var(--color-ink)]/40' : 'bg-[var(--color-deep)]'}`}>
        <p className="text-xs opacity-80">e-SIGRA Maternal Safety Card</p>
        <p className="font-display text-lg font-semibold">Kartu Keselamatan Maternal</p>
      </div>

      {/* Printable sticker area — visually sized/bordered like the physical 5×5 cm version */}
      <div className="relative flex flex-col items-center gap-1 border-b border-dashed border-[var(--color-sage-line)] p-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ink)]/40">
          e-SIGRA · Tempel pada Buku KIA
        </p>
        <PseudoQrPattern token={token} dimmed={revoked} />
        {revoked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center gap-1.5 rounded-full bg-[var(--color-ink)]/80 px-4 py-1.5 text-xs font-semibold text-white">
              <Ban className="h-3.5 w-3.5" /> QR Dicabut
            </span>
          </div>
        )}
        <p className="mt-2 font-mono text-sm tracking-wider text-[var(--color-ink)]/70">{token}</p>
        {sticker && !revoked && (
          <span className={`mt-1 rounded-full px-4 py-1.5 text-xs font-semibold ${sticker.bg} ${sticker.text}`}>
            {sticker.label}
          </span>
        )}
        {!revoked && (
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[var(--color-deep)]">
            <ScanLine className="h-3.5 w-3.5" /> Scan untuk validasi
          </p>
        )}
      </div>

      <div className="p-5 text-center">
        <p className="text-xs text-[var(--color-ink)]/50">
          {lastScreeningAt ? `Skrining terakhir: ${formatDateTimeID(lastScreeningAt)}` : 'Belum ada skrining'}
        </p>
      </div>
    </Card>
  );
}
