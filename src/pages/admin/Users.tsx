import { LocalStorageRepository } from '../../services/repository';
import type { User } from '../../types/user';
import { mockUsers } from '../../data/mockUsers';
import { Card } from '../../components/ui/Card';
import { Pill } from '../../components/ui/Pill';
import { formatDateID } from '../../utils/date';

const repo = new LocalStorageRepository<User>('users');
repo.seedIfEmpty(mockUsers);

const ROLE_LABEL: Record<User['role'], string> = {
  IBU_HAMIL: 'Ibu Hamil',
  NAKES: 'Nakes',
  ADMIN: 'Admin',
};

export function AdminUsersPage() {
  const users = repo.getAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Pengguna</h1>
        <p className="text-sm text-[var(--color-ink)]/60">{users.length} akun terdaftar pada sistem</p>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-[var(--color-sage-line)] text-left text-xs uppercase tracking-wide text-[var(--color-ink)]/50">
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Peran</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Terdaftar</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[var(--color-sage-line)] last:border-0">
                <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{u.name}</td>
                <td className="px-4 py-3 text-[var(--color-ink)]/70">{u.email}</td>
                <td className="px-4 py-3">
                  <Pill tone="blue">{ROLE_LABEL[u.role]}</Pill>
                </td>
                <td className="px-4 py-3">
                  <Pill tone={u.status === 'ACTIVE' ? 'sage' : 'red'}>{u.status}</Pill>
                </td>
                <td className="px-4 py-3 text-[var(--color-ink)]/60">{formatDateID(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
