import { useMemo, useState } from 'react';
import TextPanel from './components/TextPanel';
import FilePanel from './components/FilePanel';
import { generateFromAudioApi, generateFromDocumentApi, generateFromImageApi } from './api';

type TabKey = 'text' | 'image' | 'document' | 'audio';

export default function App() {
  const [tab, setTab] = useState<TabKey>('text');

  const title = useMemo(() => {
    switch (tab) {
      case 'text':
        return 'Text Generation';
      case 'image':
        return 'Image + Prompt';
      case 'document':
        return 'Document + Prompt';
      case 'audio':
        return 'Audio + Prompt';
    }
  }, [tab]);

  return (
    <div>
      <header className="bg-gradient-to-r from-brand-600 to-indigo-600">
        <div className="mx-auto container-max px-4 py-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white/20 grid place-items-center font-bold">G</div>
            <div>
              <div className="font-semibold">GenAI Interface by @nugraharzk</div>
              <div className="text-xs text-white/80">NestJS + Gemini backend</div>
            </div>
          </div>
          <a className="btn bg-white/10 hover:bg-white/20 text-white" href="#" onClick={(e) => e.preventDefault()}>Docs</a>
        </div>
      </header>

      <main className="mx-auto container-max px-4 py-6">
        <div className="mb-4 flex gap-2">
          <button className={`tab ${tab === 'text' ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab('text')}>Text</button>
          <button className={`tab ${tab === 'image' ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab('image')}>Image</button>
          <button className={`tab ${tab === 'document' ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab('document')}>Document</button>
          <button className={`tab ${tab === 'audio' ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab('audio')}>Audio</button>
        </div>

        <div className="panel glass ring-1 ring-black/5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <div className="text-xs text-gray-500">API: {(window as any).__APP_CONFIG__?.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}</div>
          </div>

          {tab === 'text' && <TextPanel />}
          {tab === 'image' && (
            <FilePanel mode="image" accept="image/*" helper="Max 15MB" submit={generateFromImageApi} />
          )}
          {tab === 'document' && (
            <FilePanel mode="document" accept=".pdf,.doc,.docx,.txt,.md,.rtf,.html,.htm,.ppt,.pptx,.xls,.xlsx,application/*,text/*" helper="Max 20MB" submit={generateFromDocumentApi} />
          )}
          {tab === 'audio' && (
            <FilePanel mode="audio" accept="audio/*" helper="Max 25MB" submit={generateFromAudioApi} />
          )}
        </div>
      </main>

      <footer className="mx-auto container-max px-4 py-8 text-center text-xs text-gray-500">
        Built with React, Vite, Tailwind.
      </footer>
    </div>
  );
}
