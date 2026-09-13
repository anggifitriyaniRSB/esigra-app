import { useState } from 'react';
import { Link } from 'react-router-dom';
import { followUpService } from '../../services/followUpService';
import { maternalService } from '../../services/maternalService';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/States';
import { FollowUpStatusBadge } from '../../components/common/FollowUpStatusBadge';
import { formatDateTimeID } from '../../utils/date';
import { ClipboardList } from 'lucide-react';

export function TindakLanjutPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'AKTIF' | 'SELESAI'>('AKTIF');
  const [, setTick] = useState(0);

  const all = followUpService.listAll();
  const filtered = all
    .filter((f) => f.status === tab)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleComplete = (id: string) => {
    if (!user) return;
    followUpService.complete(id, user.id, user.role);
    setTick((t) => t + 1);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Tindak Lanjut</h1>
        <p className="text-sm text-[var(--color-ink)]/60">
          Pantau tindak lanjut yang sedang berjalan, dirujuk, atau telah selesai.
        </p>
      </div>

      <div className="flex gap-2">
        {(['AKTIF', 'SELESAI'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              tab === t
                ? 'bg-[var(--color-deep)] text-white'
                : 'bg-white text-[var(--color-ink)]/60 border border-[var(--color-sage-line)]'
            }`}
          >
            {t === 'AKTIF' ? 'Aktif' : 'Selesai'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="h-7 w-7" />}
          title={tab === 'AKTIF' ? 'Tidak ada tindak lanjut aktif.' : 'Belum ada tindak lanjut yang selesai.'}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((f) => {
            const mother = maternalService.getById(f.motherId);
            return (
              <Card key={f.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/nakes/ibu/${f.motherId}`} className="font-medium text-[var(--color-ink)] hover:underline">
                      {mother?.name ?? '-'}
                    </Link>
                    <p className="mt-1 text-sm text-[var(--color-ink)]/70">{f.action}</p>
                    <p className="mt-0.5 text-sm text-[var(--color-ink)]/60">{f.notes}</p>
                    {f.referral && (
                      <p className="mt-1 text-xs text-[var(--color-blue)]">Dirujuk ke: {f.referralFacility}</p>
                    )}
                    <p className="mt-1.5 text-xs text-[var(--color-ink)]/40">{formatDateTimeID(f.createdAt)}</p>
                  </div>
                  <FollowUpStatusBadge followUp={f} />
                </div>
                {f.status === 'AKTIF' && (
                  <Button size="sm" variant="outline" className="mt-3" onClick={() => handleComplete(f.id)}>
                    Tandai Selesai
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
