import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  PhotoIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import ModelSelect from './ModelSelect';
import MarkdownOutput from './MarkdownOutput';
import ErrorAlert from './ErrorAlert';
import { Button, Card, IconButton } from '../base';
import { Field, Textarea } from '../form';
import { cn } from '../utils';
import type { GenerateResponse } from '../../api';

type Props = {
  mode: 'image' | 'document' | 'audio';
  submit: (params: { file: File; prompt?: string; model?: string; systemInstruction?: string }) => Promise<GenerateResponse>;
  accept: string;
  helper?: string;
};

export default function FilePanel({ mode, submit, accept, helper }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [model, setModel] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function onPick(event: ChangeEvent<HTMLInputElement>) {
    const f = event.target.files?.[0];
    if (f) setFile(f);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult(null);
    setErrorMsg('');
    try {
      const data = await submit({
        file,
        prompt: prompt || undefined,
        systemInstruction: systemInstruction || undefined,
        model: model || undefined,
      });
      if (data?.error) {
        setErrorMsg(data.error);
        setResult(null);
      } else {
        setResult(data);
        setErrorMsg('');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  function copyOutput() {
    if (result?.text) void navigator.clipboard.writeText(result.text);
  }

  function onClear() {
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
    setPrompt('');
    setSystemInstruction('');
    setModel('');
    setResult(null);
    setErrorMsg('');
    setDragActive(false);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const f = event.dataTransfer.files?.[0];
    if (f) setFile(f);
  }

  function onDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  }

  function onDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  }

  function handleShortcutSubmit(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  const isImage = mode === 'image' && file && file.type.startsWith('image/');
  const isAudio = mode === 'audio' && file && file.type.startsWith('audio/');

  const modeMeta = {
    image: {
      icon: <PhotoIcon className="h-8 w-8 text-brand-600" aria-hidden="true" />,
      title: 'Upload image',
      subtitle: 'PNG, JPG, HEIC up to 15MB',
    },
    document: {
      icon: <DocumentTextIcon className="h-8 w-8 text-brand-600" aria-hidden="true" />,
      title: 'Upload document',
      subtitle: 'PDF, DOCX, TXT and more up to 20MB',
    },
    audio: {
      icon: <MusicalNoteIcon className="h-8 w-8 text-brand-600" aria-hidden="true" />,
      title: 'Upload audio',
      subtitle: 'MP3, WAV, MPEG up to 25MB',
    },
  } as const;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <Card className="h-fit">
        <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-slate-900">Upload &amp; prompt</h2>
            <p className="text-sm text-slate-500">
              Combine a {mode} file with optional prompt and system instruction.
            </p>
          </div>

          <div>
            <div
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-8 text-center transition',
                dragActive ? 'border-brand-500 bg-brand-50/70' : 'hover:border-brand-400',
              )}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
            >
              {modeMeta[mode].icon}
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-800">{modeMeta[mode].title}</p>
                <p className="text-xs text-slate-500">{modeMeta[mode].subtitle}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-500">
                <span>Drag &amp; drop</span>
                <span className="text-slate-300">•</span>
                <span>or choose file</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                  event.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                <ArrowUpTrayIcon className="h-4 w-4" aria-hidden="true" />
                Browse files
              </Button>
            </div>
            <input ref={inputRef} className="hidden" type="file" accept={accept} onChange={onPick} />
            {helper ? <p className="mt-2 text-xs text-slate-500">{helper}</p> : null}
            {file ? (
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-800">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button type="button" size="sm" variant="ghost" onClick={onClear}>
                  Remove
                </Button>
              </div>
            ) : null}
            {isImage ? (
              <img
                className="mt-3 max-h-64 w-full rounded-2xl border border-slate-200 object-contain"
                src={URL.createObjectURL(file!)}
                alt="preview"
              />
            ) : null}
            {isAudio ? (
              <audio className="mt-3 w-full" controls src={URL.createObjectURL(file!)} />
            ) : null}
          </div>

          <Field label="Prompt" optional>
            {(id: string) => (
              <Textarea
                id={id}
                rows={4}
                placeholder="Optional context or question"
                value={prompt}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setPrompt(event.target.value)}
                onKeyDown={handleShortcutSubmit}
              />
            )}
          </Field>

          <Field label="System Instruction" optional>
            {(id: string) => (
              <Textarea
                id={id}
                rows={3}
                placeholder="Guide the model’s behavior"
                value={systemInstruction}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setSystemInstruction(event.target.value)}
                onKeyDown={handleShortcutSubmit}
              />
            )}
          </Field>

          <ModelSelect value={model} onChange={setModel} />

          <div className="flex flex-wrap gap-3">
            <Button type="submit" isLoading={loading} disabled={!file}>
              Generate
            </Button>
            <Button type="button" variant="ghost" onClick={onClear}>
              Clear
            </Button>
          </div>
        </form>
      </Card>

      <Card className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Output</h2>
            <p className="text-xs text-slate-500">Generated response appears here after processing.</p>
          </div>
          <IconButton
            type="button"
            tone="brand"
            aria-label="Copy response"
            onClick={copyOutput}
            disabled={!result?.text}
          >
            <ClipboardDocumentIcon className="h-5 w-5" aria-hidden="true" />
          </IconButton>
        </div>
        <div className="min-h-[220px] rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 text-sm text-slate-700">
          {errorMsg ? (
            <ErrorAlert message={errorMsg} />
          ) : result ? (
            result.error ? (
              <ErrorAlert message={result.error} />
            ) : (
              <MarkdownOutput content={result.text} />
            )
          ) : (
            <div className="text-slate-500">
              Your response will appear here after upload and generate.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
