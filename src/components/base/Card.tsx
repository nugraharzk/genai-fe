import type { HTMLAttributes } from 'react';
import { cn } from '../utils';
import { radii, shadows } from '../tokens';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: 'sm' | 'md' | 'lg' | 'none';
};

const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-4 md:p-5',
  md: 'p-6 md:p-7',
  lg: 'p-8 md:p-9',
};

export function Card({ className, padding = 'md', children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative border border-slate-200/70 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85',
        'shadow-sm',
        paddingClasses[padding],
        className,
      )}
      style={{ borderRadius: radii.lg, boxShadow: shadows.soft }}
      {...props}
    >
      {children}
    </div>
  );
}
