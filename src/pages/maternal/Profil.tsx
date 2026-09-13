import { useAuth } from '../../context/AuthContext';
import { maternalService } from '../../services/maternalService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { gravidaParaLabel, calculateAge } from '../../utils/pregnancy';
import { formatDateID } from '../../utils/date';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProfilPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  const mother = maternalService.getByUserId(user.id);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="mx-auto max-w-md space-y-5">
      <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Profil</h1>

      <Card className="p-5">
        <p className="font-display text-lg font-semibold text-[var(--color-ink)]">{user.name}</p>
        <p className="text-sm text-[var(--color-ink)]/60">{user.email}</p>
        <p className="text-sm text-[var(--color-ink)]/60">{user.phone}</p>
      </Card>

      {mother && (
        <Card className="divide-y divide-[var(--color-sage-line)] p-0">
          <ProfileRow label="Tanggal lahir" value={`${formatDateID(mother.dateOfBirth)} (${calculateAge(mother.dateOfBirth)} tahun)`} />
          <ProfileRow label="Status kehamilan" value={gravidaParaLabel(mother.gravida, mother.para)} />
          <ProfileRow label="HPHT" value={formatDateID(mother.hpht)} />
          <ProfileRow label="Alamat" value={mother.address} />
          <ProfileRow label="Kontak darurat" value={`${mother.emergencyContactName} · ${mother.emergencyContactPhone}`} />
        </Card>
      )}

      <Button variant="outline" fullWidth icon={<LogOut className="h-4 w-4" />} onClick={handleLogout}>
        Keluar
      </Button>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-3.5">
      <p className="text-xs text-[var(--color-ink)]/50">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
