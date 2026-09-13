import type { ReactNode } from 'react';
import { Loader2, Inbox, AlertTriangle, WifiOff, ShieldOff, SearchX } from 'lucide-react';

export function LoadingState({ label = 'Memuat data...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-[var(--color-ink)]/60">
      <Loader2 className="h-6 w-6 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({
  title = 'Data belum tersedia.',
  description,
  action,
  icon,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--color-sage-line)] px-6 py-14 text-center">
      <div className="text-[var(--color-teal)]">{icon ?? <Inbox className="h-7 w-7" />}</div>
      <p className="font-medium text-[var(--color-ink)]">{title}</p>
      {description && <p className="max-w-xs text-sm text-[var(--color-ink)]/60">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  title = 'Terjadi kendala saat memuat data.',
  description = 'Silakan coba lagi.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--color-red)]/20 bg-[var(--color-red-bg)] px-6 py-14 text-center">
      <AlertTriangle className="h-7 w-7 text-[var(--color-red)]" />
      <p className="font-medium text-[var(--color-red)]">{title}</p>
      <p className="max-w-xs text-sm text-[var(--color-ink)]/70">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-xl bg-[var(--color-red)] px-4 py-2 text-sm font-medium text-white"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}

export function OfflineState() {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-[var(--color-canvas-sunk)] px-4 py-3 text-sm text-[var(--color-ink)]/70">
      <WifiOff className="h-4 w-4" />
      Tersimpan di perangkat &mdash; menunggu koneksi.
    </div>
  );
}

export function UnauthorizedState() {
  return (
    <EmptyState
      icon={<ShieldOff className="h-7 w-7" />}
      title="Anda tidak memiliki akses ke halaman ini."
      description="Hubungi admin sistem apabila menurut Anda ini keliru."
    />
  );
}

export function NotFoundState() {
  return (
    <EmptyState
      icon={<SearchX className="h-7 w-7" />}
      title="Data tidak ditemukan."
      description="Periksa kembali tautan atau kode yang digunakan."
    />
  );
}
