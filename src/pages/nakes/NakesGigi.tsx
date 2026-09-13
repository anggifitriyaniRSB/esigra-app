import { Link } from 'react-router-dom';
import { mockDentalRecords } from '../../data/mockDental';
import { maternalService } from '../../services/maternalService';
import { DentalHealthCard } from '../../components/dental/DentalHealthCard';
import { EmptyState } from '../../components/ui/States';
import { Smile } from 'lucide-react';

export function NakesGigiPage() {
  const records = [...mockDentalRecords].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Kesehatan Gigi</h1>
      {records.length === 0 ? (
        <EmptyState icon={<Smile className="h-7 w-7" />} title="Belum ada catatan kesehatan gigi." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {records.map((r) => {
            const mother = maternalService.getById(r.motherId);
            return (
              <div key={r.id}>
                <Link
                  to={`/nakes/ibu/${r.motherId}`}
                  className="mb-1.5 block text-sm font-medium text-[var(--color-deep)] hover:underline"
                >
                  {mother?.name ?? '-'}
                </Link>
                <DentalHealthCard record={r} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
