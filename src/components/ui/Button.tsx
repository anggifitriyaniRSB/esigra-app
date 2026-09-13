import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-[var(--color-deep)] text-white hover:bg-[var(--color-deep-dark)]',
  secondary: 'bg-[var(--color-sage)] text-[var(--color-deep-dark)] hover:bg-[var(--color-sage-line)]',
  outline: 'border border-[var(--color-deep)] text-[var(--color-deep)] hover:bg-[var(--color-sage)]',
  ghost: 'text-[var(--color-deep-dark)] hover:bg-[var(--color-canvas-sunk)]',
  danger: 'bg-[var(--color-red)] text-white hover:opacity-90',
};

const sizeClasses: Record<string, string> = {
  sm: 'text-sm px-3 py-2 min-h-[38px]',
  md: 'text-sm px-4 py-2.5 min-h-[44px]',
  lg: 'text-base px-6 py-3.5 min-h-[48px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
