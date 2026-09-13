import type { ReactNode } from 'react';
import { Card } from '../ui/Card';
import clsx from 'clsx';

export function KpiCard({
  label,
  value,
  icon,
  tone = 'neutral',
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: 'neutral' | 'red' | 'amber' | 'sage';
}) {
  const toneText: Record<string, string> = {
    neutral: 'text-[var(--color-ink)]',
    red: 'text-[var(--color-red)]',
    amber: 'text-[var(--color-amber)]',
    sage: 'text-[var(--color-teal)]',
  };
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[var(--color-ink)]/60">{label}</p>
        {icon && <span className="text-[var(--color-ink)]/40">{icon}</span>}
      </div>
      <p className={clsx('mt-2 font-display text-3xl font-semibold', toneText[tone])}>{value}</p>
    </Card>
  );
}
