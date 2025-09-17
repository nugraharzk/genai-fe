export function Footer() {
  return (
    <footer className="hidden border-t border-slate-200/70 bg-white/95 px-8 py-6 text-xs text-slate-500 shadow-sm lg:block">
      <div className="text-center">
        Built with React, Vite, Tailwind and Headless UI. © {new Date().getFullYear()} @nugraharzk.
      </div>
    </footer>
  );
}
