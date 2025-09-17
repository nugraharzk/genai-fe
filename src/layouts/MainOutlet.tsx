import { ReactNode } from 'react';
import type { NavItem, TabKey } from '../types/navigation';

export type MainOutletProps = {
  items: NavItem[];
  activeKey: TabKey;
  activeItem: NavItem;
  onSelect: (key: TabKey) => void;
  children: ReactNode;
};

export function MainOutlet({
  items,
  activeKey,
  activeItem,
  onSelect,
  children,
}: MainOutletProps) {
  return (
    <section className="flex w-full flex-1 flex-col gap-6 sm:gap-8">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{activeItem.label}</h1>
        <p className="text-sm text-slate-500">{activeItem.description}</p>
      </header>

      {children}
    </section>
  );
}
