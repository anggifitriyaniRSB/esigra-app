import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/user';
import { LoadingState } from '../ui/States';
import { UnauthorizedState } from '../ui/States';

export function ProtectedRoute({ allow, children }: { allow: UserRole[]; children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingState />;
  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) return <UnauthorizedState />;
  return <>{children}</>;
}
