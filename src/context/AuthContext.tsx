import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types/user';
import { authService } from '../services/authService';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (emailOrPhone: string, password: string) => User | null;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [loading] = useState(false);

  const refresh = () => {
    setUser(authService.getCurrentUser());
  };

  const login = (emailOrPhone: string, password: string) => {
    const loggedIn = authService.login(emailOrPhone, password);
    if (loggedIn) setUser(loggedIn);
    return loggedIn;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
