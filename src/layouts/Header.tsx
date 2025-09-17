import { Button, cn } from '../components';

type HeaderProps = {
  onDocsClick?: () => void;
  offsetClass?: string;
  docsUrl?: string;
};

const DEFAULT_DOCS_URL = 'https://ai.google.dev/gemini-api/docs';

export function Header({ onDocsClick, offsetClass, docsUrl = DEFAULT_DOCS_URL }: HeaderProps) {
  function handleDocsClick() {
    onDocsClick?.();
    window.open(docsUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div
        className={cn(
          'flex w-full items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8 transition-all duration-200',
          offsetClass,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-500 text-lg font-semibold text-white shadow-xl shadow-brand-900/25">
            G
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-slate-900 md:text-xl">
              Maju Bareng AI Projects by @nugraharzk
            </h1>
            <p className="text-xs text-slate-500">
              Frontend by React + Headless UI • Backend NestJS Gemini proxy
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDocsClick}
          className="grid h-10 w-10 place-items-center rounded-2xl bg-white/80 backdrop-blur md:w-auto md:grid-flow-col md:auto-cols-max md:gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M14 3h7v7" />
            <path d="M10 14 21 3" />
            <path d="M5 5h4" />
            <path d="M5 9h4" />
            <path d="M5 13h4" />
            <path d="M5 17h9" />
          </svg>
          <span className="hidden md:inline">View docs</span>
        </Button>
      </div>
    </header>
  );
}
