import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../utils';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 5, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        'w-full rounded-xl border border-slate-300/70 bg-white px-3.5 py-2.5 text-sm text-slate-900 leading-6 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
        'resize-none',
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = 'Textarea';
