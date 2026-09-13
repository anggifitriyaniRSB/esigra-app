import { LocalStorageRepository } from '../../services/repository';
import type { User } from '../../types/user';
import { mockUsers } from '../../data/mockUsers';
import { maternalService } from '../../services/maternalService';
import { Card } from '../../components/ui/Card';

const repo = new LocalStorageRepository<User>('users');
repo.seedIfEmpty(mockUsers);

export function AdminNakesPage() {
  const nakes = repo.getAll().filter((u) => u.role === 'NAKES');
  const mothers = maternalService.listAll();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Tenaga Kesehatan</h1>
        <p className="text-sm text-[var(--color-ink)]/60">{nakes.length} tenaga kesehatan aktif</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {nakes.map((n) => {
          const assigned = mothers.filter((m) => m.assignedHealthcareWorkerId === n.id).length;
          return (
            <Card key={n.id} className="p-5">
              <p className="font-medium text-[var(--color-ink)]">{n.name}</p>
              <p className="text-sm text-[var(--color-ink)]/60">{n.email}</p>
              <p className="text-sm text-[var(--color-ink)]/60">{n.phone}</p>
              <p className="mt-3 text-xs font-medium text-[var(--color-teal)]">{assigned} ibu ditugaskan</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
