import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { maternalService } from '../../services/maternalService';
import { screeningService } from '../../services/screeningService';
import { ScreeningCard } from '../../components/screening/ScreeningCard';
import { EmptyState } from '../../components/ui/States';
import { Button } from '../../components/ui/Button';
import { History, Stethoscope } from 'lucide-react';

export function RiwayatPage() {
  const { user } = useAuth();
  if (!user) return null;
  const mother = maternalService.getByUserId(user.id);
  if (!mother) return null;

  const screenings = screeningService.listByMother(mother.id);

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Hasil &amp; Riwayat</h1>
      {screenings.length === 0 ? (
        <EmptyState
          icon={<History className="h-7 w-7" />}
          title="Belum ada riwayat deteksi dini."
          description="Riwayat deteksi dini Ibu akan muncul di sini."
          action={
            <Link to="/ibu/deteksi-dini">
              <Button size="sm" icon={<Stethoscope className="h-4 w-4" />}>
                Mulai Deteksi Dini
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {screenings.map((s) => (
            <ScreeningCard key={s.id} screening={s} />
          ))}
        </div>
      )}
    </div>
  );
}
