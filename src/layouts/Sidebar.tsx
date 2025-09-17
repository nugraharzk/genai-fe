import { Bars3Icon } from '@heroicons/react/24/outline';
import type { NavItem, TabKey } from '../types/navigation';
import { Button, Card, cn, IconButton } from '../components';

export type SidebarProps = {
  items: NavItem[];
  activeKey: TabKey;
  expanded: boolean;
  onToggleCollapse: () => void;
  onSelect: (key: TabKey) => void;
  onHoverChange: (hover: boolean) => void;
  apiBase: string;
};

export function Sidebar({
  items,
  activeKey,
  expanded,
  onToggleCollapse,
  onSelect,
  onHoverChange,
  apiBase,
}: SidebarProps) {
  const sidebarWidth = expanded ? 'w-64' : 'w-16';

  return (
    <aside
      className={cn(
        'group fixed left-0 top-0 hidden h-screen shrink-0 flex-col overflow-hidden pt-20 transition-all duration-200 ease-in-out sm:pt-[76px] lg:flex',
        'z-30',
        sidebarWidth,
      )}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <Card padding="none" className="flex h-full flex-1 flex-col overflow-hidden bg-white/95 shadow-sm !rounded-none">
        <div className="flex items-center justify-between border-b border-slate-200/70 px-3 py-3">
          <div className={cn('text-sm font-semibold text-slate-800', !expanded && 'sr-only')}>Workflows</div>
          <IconButton
            tone="neutral"
            size={expanded ? 'md' : 'sm'}
            aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            onClick={onToggleCollapse}
          >
            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
          </IconButton>
        </div>
        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 py-3">
          {items.map((item) => {
            const isActive = activeKey === item.key;
            const Icon = item.icon;
            return (
              <Button
                key={item.key}
                variant="ghost"
                className={cn(
                  'w-full rounded-2xl text-left transition-all duration-200',
                  expanded
                    ? 'min-h-[56px] px-4 py-3 justify-start gap-3'
                    : 'h-12 px-2.5 py-2 justify-center gap-0',
                  isActive && expanded
                    ? '!bg-brand-600 !text-white shadow-lg shadow-brand-900/25 hover:!bg-brand-500'
                    : 'hover:bg-slate-100 text-slate-600',
                  !expanded && 'text-slate-500',
                )}
                title={item.label}
                onClick={() => onSelect(item.key)}
              >
                <span
                  className={cn(
                    'flex flex-none items-center justify-center rounded-2xl transition-all duration-200',
                    expanded ? 'h-9 w-9 rounded-xl' : 'h-11 w-11',
                    isActive
                      ? expanded
                        ? 'bg-white/15 text-white'
                        : 'bg-brand-600 text-white'
                      : 'bg-transparent text-slate-500',
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span
                  className={cn(
                    'flex min-w-0 flex-col text-xs transition-all duration-200 ease-in-out',
                    expanded
                      ? 'max-w-[200px] opacity-100'
                      : 'pointer-events-none max-w-[0] overflow-hidden opacity-0',
                  )}
                >
                  <span className="text-sm font-semibold leading-5 text-inherit">{item.label}</span>
                    <span className={cn(
                      "text-[11px] leading-4 line-clamp-2",
                      isActive ? "text-white" : "text-slate-500"
                    )}>
                    {item.description}
                    </span>
                </span>
              </Button>
            );
          })}
        </nav>
        <div
          className={cn(
            'border-t border-slate-200/70 bg-slate-50/80 text-xs text-slate-600 transition-all duration-200',
            expanded ? 'px-4 py-4' : 'px-2 py-3',
          )}
        >
          {expanded ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Backend API</p>
              <p className="truncate text-sm font-medium text-slate-700">{apiBase}</p>
              <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                Connected
              </span>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="h-9 w-9 rounded-full border border-emerald-200 bg-emerald-50 text-xs font-semibold uppercase tracking-wide text-emerald-600 grid place-items-center">
                API
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">OK</span>
            </div>
          )}
        </div>
      </Card>
    </aside>
  );
}
