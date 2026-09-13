import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DEMO_ACCOUNTS } from '../../data/mockUsers';
import { AlertCircle } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const user = login(emailOrPhone, password);
    if (!user) {
      setError('Email/nomor HP atau kata sandi salah.');
      return;
    }
    if (user.role === 'IBU_HAMIL') navigate('/ibu');
    else if (user.role === 'NAKES') navigate('/nakes');
    else navigate('/admin');
  };

  const fillDemo = (email: string) => {
    setEmailOrPhone(email);
    setPassword('Demo123!');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-canvas)] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="font-display text-2xl font-semibold text-[var(--color-deep-dark)]">e-SIGRA</p>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">Masuk ke akun Anda</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">Email / No. HP</label>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-sage-line)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-deep)]"
                placeholder="nama@email.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">Kata Sandi</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-sage-line)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-deep)]"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-[var(--color-red-bg)] px-3 py-2.5 text-sm text-[var(--color-red)]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" fullWidth>
              Masuk
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-[var(--color-ink)]/60">
            Belum punya akun?{' '}
            <Link to="/register" className="font-medium text-[var(--color-deep)]">
              Daftar sebagai Ibu Hamil
            </Link>
          </p>
        </Card>

        <div className="mt-5 rounded-xl border border-dashed border-[var(--color-sage-line)] p-4">
          <p className="text-xs font-semibold text-[var(--color-ink)]/60">DEMO ACCOUNT — DEVELOPMENT ONLY</p>
          <div className="mt-2 space-y-1.5">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                onClick={() => fillDemo(acc.email)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs hover:bg-[var(--color-sage)]"
              >
                <span className="font-medium text-[var(--color-ink)]/80">{acc.role}</span>
                <span className="text-[var(--color-ink)]/50">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
