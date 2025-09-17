import type { HTMLAttributes } from 'react';
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '../utils';

type AlertTone = 'info' | 'warning' | 'error' | 'success';

const toneStyles: Record<AlertTone, { container: string; badge: string; iconColor: string }> = {
  info: {
    container: 'bg-sky-50 text-sky-900 border border-sky-200/70',
    badge: 'bg-sky-100 text-sky-800',
    iconColor: 'text-sky-500',
  },
  warning: {
    container: 'bg-amber-50 text-amber-900 border border-amber-200/70',
    badge: 'bg-amber-100 text-amber-800',
    iconColor: 'text-amber-500',
  },
  error: {
    container: 'bg-rose-50 text-rose-900 border border-rose-200/70',
    badge: 'bg-rose-100 text-rose-800',
    iconColor: 'text-rose-500',
  },
  success: {
    container: 'bg-emerald-50 text-emerald-900 border border-emerald-200/70',
    badge: 'bg-emerald-100 text-emerald-800',
    iconColor: 'text-emerald-500',
  },
};

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  tone?: AlertTone;
  title?: string;
};

export function Alert({ tone = 'info', title, className, children, ...props }: AlertProps) {
  const palette = toneStyles[tone];

  return (
    <div
      className={cn(
        'flex gap-3 rounded-2xl px-4 py-3 text-sm shadow-sm',
        palette.container,
        className,
      )}
      {...props}
    >
      <div className={cn('h-6 w-6 flex-none rounded-full bg-white/60 grid place-items-center', palette.iconColor)}>
        {tone === 'warning' || tone === 'error' ? (
          <ExclamationTriangleIcon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <InformationCircleIcon className="h-5 w-5" aria-hidden="true" />
        )}
      </div>
      <div className="space-y-1">
        {title ? <div className="font-semibold">{title}</div> : null}
        <div className="text-sm/6">{children}</div>
      </div>
    </div>
  );
}
