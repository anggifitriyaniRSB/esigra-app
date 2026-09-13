import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { maternalService } from '../../services/maternalService';
import { screeningService } from '../../services/screeningService';
import { RiskResultCard } from '../../components/screening/RiskResultCard';
import { NotFoundState, UnauthorizedState } from '../../components/ui/States';

export function HasilPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  if (!id) return <Navigate to="/ibu" replace />;
  if (!user) return null;

  const mother = maternalService.getByUserId(user.id);
  if (!mother) return <NotFoundState />;

  // Ownership-checked accessor: a mother can only ever open her own
  // screening result, even if she edits the :id in the URL directly.
  const screening = screeningService.getByIdForActor(id, {
    id: user.id,
    role: user.role,
    motherId: mother.id,
  });

  const existsButNotHers = !screening && !!screeningService.getById(id);
  if (existsButNotHers) return <UnauthorizedState />;
  if (!screening) return <NotFoundState />;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Hasil Skrining</h1>
      <RiskResultCard screening={screening} />
    </div>
  );
}
