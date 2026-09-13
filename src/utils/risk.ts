import type { RiskLevel } from '../types/screening';

export const RISK_UI: Record<
  RiskLevel,
  { label: string; short: string; textColor: string; bg: string; border: string; dot: string }
> = {
  RENDAH: {
    label: 'Risiko Rendah',
    short: 'RENDAH',
    textColor: 'text-[var(--color-deep-dark)]',
    bg: 'bg-[var(--color-sage)]',
    border: 'border-[var(--color-sage-line)]',
    dot: 'bg-[var(--color-teal)]',
  },
  SEDANG: {
    label: 'Perlu Perhatian',
    short: 'SEDANG',
    textColor: 'text-[var(--color-amber)]',
    bg: 'bg-[var(--color-amber-bg)]',
    border: 'border-[var(--color-amber)]/30',
    dot: 'bg-[var(--color-amber)]',
  },
  TINGGI: {
    label: 'Prioritas Evaluasi',
    short: 'TINGGI',
    textColor: 'text-[var(--color-red)]',
    bg: 'bg-[var(--color-red-bg)]',
    border: 'border-[var(--color-red)]/30',
    dot: 'bg-[var(--color-red)]',
  },
};

export function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  return `${phone.slice(0, 4)}****${phone.slice(-3)}`;
}

export function maskAddress(address: string): string {
  const parts = address.split(',');
  return parts[0] + (parts.length > 1 ? ', ***' : '');
}
