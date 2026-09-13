import type { ReactNode } from 'react';
import clsx from 'clsx';

interface PillProps {
  children: ReactNode;
  tone?: 'sage' | 'amber' | 'red' | 'blue' | 'neutral';
  icon?: ReactNode;
  className?: string;
}

const toneClasses: Record<string, string> = {
  sage: 'bg-[var(--color-sage)] text-[var(--color-deep-dark)]',
  amber: 'bg-[var(--color-amber-bg)] text-[var(--color-amber)]',
  red: 'bg-[var(--color-red-bg)] text-[var(--color-red)]',
  blue: 'bg-[var(--color-blue-bg)] text-[var(--color-blue)]',
  neutral: 'bg-[var(--color-canvas-sunk)] text-[var(--color-ink)]',
};

export function Pill({ children, tone = 'neutral', icon, className }: PillProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        toneClasses[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
