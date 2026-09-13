import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { LogOut, Bell } from 'lucide-react';
import type { NavItem } from './navConfig';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { notificationService } from '../../services/notificationService';
import { NotificationPanel } from './NotificationPanel';

export function AppShell({
  nav,
  bottomNav,
  brandSubtitle,
  children,
}: {
  nav: NavItem[];
  bottomNav?: NavItem[];
  brandSubtitle: string;
  children: ReactNode;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  const unread = user ? notificationService.unreadCount(user.id) : 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-[var(--color-sage-line)] bg-white/70 px-4 py-6 md:flex">
        <div className="px-2">
          <p className="font-display text-xl font-semibold text-[var(--color-deep-dark)]">e-SIGRA</p>
          <p className="text-xs text-[var(--color-ink)]/50">{brandSubtitle}</p>
        </div>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {nav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path.split('/').length <= 2}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--color-deep)] text-white'
                    : 'text-[var(--color-ink)]/70 hover:bg-[var(--color-sage)]'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-[var(--color-sage-line)] pt-4">
          <p className="px-2 text-sm font-medium text-[var(--color-ink)]">{user?.name}</p>
          <p className="px-2 text-xs text-[var(--color-ink)]/50">{user?.role}</p>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--color-ink)]/70 hover:bg-[var(--color-canvas-sunk)]"
          >
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-sage-line)] bg-[var(--color-canvas)]/90 px-4 py-3 backdrop-blur md:hidden">
        <div>
          <p className="font-display text-lg font-semibold text-[var(--color-deep-dark)]">e-SIGRA</p>
        </div>
        <button
          onClick={() => setNotifOpen(true)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--color-sage)]"
          aria-label="Notifikasi"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-red)]" />
          )}
        </button>
      </header>

      <div className="md:pl-64">
        {/* Desktop top bar with notifications */}
        <div className="hidden items-center justify-end border-b border-[var(--color-sage-line)] bg-white/50 px-6 py-3 md:flex">
          <button
            onClick={() => setNotifOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--color-sage)]"
            aria-label="Notifikasi"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-red)]" />
            )}
          </button>
        </div>

        <main className={clsx('mx-auto max-w-6xl px-4 py-6', bottomNav && 'pb-24 md:pb-6')}>{children}</main>
      </div>

      {/* Mobile bottom nav */}
      {bottomNav && (
        <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[var(--color-sage-line)] bg-white/95 backdrop-blur md:hidden">
          {bottomNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path.split('/').length <= 2}
              className={({ isActive }) =>
                clsx(
                  'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium',
                  isActive ? 'text-[var(--color-deep)]' : 'text-[var(--color-ink)]/50'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}

      {notifOpen && user && <NotificationPanel userId={user.id} onClose={() => setNotifOpen(false)} />}
    </div>
  );
}
