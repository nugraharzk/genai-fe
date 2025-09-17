import type { NavItem, TabKey } from '../types/navigation';
import { cn } from '../components';

export type MobileBottomNavProps = {
  items: NavItem[];
  activeKey: TabKey;
  onSelect: (key: TabKey) => void;
};

export function MobileBottomNav({ items, activeKey, onSelect }: MobileBottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white/95 px-2 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.05)] lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeKey === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            className={cn(
              'relative flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-200',
              isActive ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30' : 'text-slate-500 hover:bg-slate-100',
            )}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
