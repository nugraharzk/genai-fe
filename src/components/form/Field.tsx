import { cloneElement, isValidElement, useId } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { cn } from '../utils';

export type FieldProps = {
  label: string;
  description?: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactElement | ((controlId: string) => ReactNode);
};

export function Field({
  label,
  description,
  hint,
  optional,
  error,
  className,
  children,
}: FieldProps) {
  const reactId = useId();
  const providedChild = typeof children === 'function' ? children(reactId) : children;
  const controlId =
    (isValidElement(providedChild) && ((providedChild.props.id as string | undefined) ?? reactId)) || reactId;

  let control: ReactNode = providedChild;
  if (isValidElement(providedChild)) {
    control = cloneElement(providedChild, {
      id: controlId,
      'aria-describedby': description
        ? `${controlId}-description`
        : providedChild.props['aria-describedby'],
      'aria-invalid': error ? true : providedChild.props['aria-invalid'],
    });
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={controlId} className="text-sm font-medium text-slate-800">
          {label}
          {optional ? <span className="ml-1 text-xs font-normal text-slate-400">Optional</span> : null}
        </label>
        {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </div>
      {control}
      {description ? (
        <p id={`${controlId}-description`} className="text-xs text-slate-500">
          {description}
        </p>
      ) : null}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
