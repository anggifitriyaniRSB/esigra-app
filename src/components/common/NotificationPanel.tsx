import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bell } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import type { AppNotification } from '../../types/notification';
import { timeAgoID } from '../../utils/date';
import { EmptyState } from '../ui/States';

export function NotificationPanel({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [items] = useState<AppNotification[]>(() => notificationService.listForUser(userId));
  const navigate = useNavigate();

  const handleClick = (n: AppNotification) => {
    notificationService.markRead(n.id);
    onClose();
    if (n.linkTo) navigate(n.linkTo);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/20" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-sm flex-col bg-[var(--color-canvas)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-sage-line)] px-5 py-4">
          <p className="font-display text-lg font-semibold">Notifikasi</p>
          <button onClick={onClose} aria-label="Tutup" className="rounded-full p-1.5 hover:bg-[var(--color-sage)]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <EmptyState icon={<Bell className="h-7 w-7" />} title="Belum ada notifikasi." />
          ) : (
            <ul className="space-y-2">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => handleClick(n)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      n.read
                        ? 'border-[var(--color-sage-line)] bg-white/60'
                        : 'border-[var(--color-deep)]/30 bg-[var(--color-sage)]'
                    }`}
                  >
                    <p className="font-medium text-[var(--color-ink)]">{n.title}</p>
                    <p className="mt-0.5 text-[var(--color-ink)]/70">{n.message}</p>
                    <p className="mt-1 text-xs text-[var(--color-ink)]/40">{timeAgoID(n.createdAt)}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
