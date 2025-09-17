import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../utils';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: 'neutral' | 'brand';
  size?: 'sm' | 'md';
};

const toneClasses: Record<NonNullable<IconButtonProps['tone']>, string> = {
  neutral: 'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-300',
  brand: 'text-brand-600 hover:bg-brand-50 focus-visible:ring-brand-300',
};

const sizeClasses: Record<NonNullable<IconButtonProps['size']>, string> = {
  sm: 'h-9 w-9 rounded-lg',
  md: 'h-10 w-10 rounded-xl',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, tone = 'neutral', size = 'sm', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-grid place-items-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);

IconButton.displayName = 'IconButton';
