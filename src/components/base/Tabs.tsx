import { Tab } from '@headlessui/react';
import type { ComponentProps } from 'react';
import { cn } from '../utils';

export const TabGroup = Tab.Group;
export const TabPanels = Tab.Panels;
export const TabPanel = Tab.Panel;

export function TabList({ className, ...props }: ComponentProps<typeof Tab.List>) {
  return (
    <Tab.List
      className={cn(
        'inline-flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 p-1.5 shadow-inner shadow-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/70',
        className,
      )}
      {...props}
    />
  );
}

export function TabTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof Tab>) {
  return (
    <Tab
      className={({ selected }: { selected: boolean }) =>
        cn(
          'group relative inline-flex min-w-[96px] cursor-pointer flex-col rounded-xl px-4 py-2 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
          selected
            ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/25'
            : 'text-slate-600 hover:bg-slate-100',
          typeof className === 'function' ? className({ selected } as never) : className,
        )
      }
      {...props}
    >
      {children}
    </Tab>
  );
}
