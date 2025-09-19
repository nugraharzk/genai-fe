import { lazy, Suspense, useMemo, useState, type LazyExoticComponent } from 'react';
import { Card, cn } from './components';
import Chatbot from './components/elements/Chatbot';
import { Footer, Header, MainOutlet, Sidebar, MobileBottomNav } from './layouts';
import type { NavItem, TabKey } from './types/navigation';
import {
  CursorArrowRaysIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

const navItems: NavItem[] = [
  {
    key: 'text',
    label: 'Text',
    description: 'Craft structured prompts and pure text requests',
    icon: CursorArrowRaysIcon,
  },
  {
    key: 'image',
    label: 'Image',
    description: 'Combine visuals with a prompt for multimodal output',
    icon: PhotoIcon,
  },
  {
    key: 'document',
    label: 'Document',
    description: 'Summarise or analyse PDFs, slides and rich docs',
    icon: DocumentTextIcon,
  },
  {
    key: 'audio',
    label: 'Audio',
    description: 'Transcribe or reason over voice recordings',
    icon: MusicalNoteIcon,
  },
];

const pageComponents: Record<TabKey, LazyExoticComponent<() => JSX.Element>> = {
  text: lazy(() => import('./pages/TextPage')),
  image: lazy(() => import('./pages/ImagePage')),
  document: lazy(() => import('./pages/DocumentPage')),
  audio: lazy(() => import('./pages/AudioPage')),
};

export default function App() {
  const [tab, setTab] = useState<TabKey>('text');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const apiBase =
    (window as any).__APP_CONFIG__?.API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:5000';

  const PageComponent = pageComponents[tab];
  const expandedForDisplay = useMemo(() => !isCollapsed || isHovering, [isCollapsed, isHovering]);
  const expandedPinned = useMemo(() => !isCollapsed, [isCollapsed]);
  const sidebarOffsetClass = expandedPinned ? 'lg:ml-64' : 'lg:ml-[4rem]';
  const headerPaddingClass = expandedPinned ? 'lg:pl-64' : 'lg:pl-[4rem]';
  const activeItem = navItems.find((item) => item.key === tab) ?? navItems[0];

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <Header offsetClass={headerPaddingClass} onDocsClick={() => undefined} />

      <Sidebar
        items={navItems}
        activeKey={tab}
        expanded={expandedForDisplay}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        onSelect={setTab}
        onHoverChange={setIsHovering}
        apiBase={apiBase}
      />

      <main className={cn('flex flex-1 flex-col pt-24 transition-all duration-200 sm:pt-28', sidebarOffsetClass)}>
        <div className="flex w-full flex-1 flex-col px-4 pb-32 sm:px-6 lg:px-8 lg:pb-24">
          <MainOutlet
            items={navItems}
            activeKey={tab}
            activeItem={activeItem}
            onSelect={setTab}
          >
            <Suspense
              fallback={
                <Card className="flex min-h-[360px] items-center justify-center text-sm text-slate-500">
                  Loading workflow…
                </Card>
              }
            >
              <PageComponent />
            </Suspense>
          </MainOutlet>
        </div>
      </main>

      <MobileBottomNav items={navItems} activeKey={tab} onSelect={setTab} />

      <div className={cn('transition-all duration-200', sidebarOffsetClass)}>
        <Footer />
      </div>
      <Chatbot />
    </div>
  );
}
