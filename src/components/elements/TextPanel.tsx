import { useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import ModelSelect from './ModelSelect';
import MarkdownOutput from './MarkdownOutput';
import ErrorAlert from './ErrorAlert';
import { generateTextApi, type GenerateResponse } from '../../api';
import { Button, Card, Field, IconButton, Textarea } from '..';

export default function TextPanel() {
  const [prompt, setPrompt] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [model, setModel] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setErrorMsg('');
    try {
      const data = await generateTextApi({
        prompt,
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
    setPrompt('');
    setSystemInstruction('');
    setModel('');
    setResult(null);
    setErrorMsg('');
  }

  function handleShortcutSubmit(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <Card className="h-fit">
        <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-slate-900">Prompt setup</h2>
            <p className="text-sm text-slate-500">
              Provide instructions and optional system guidance to compose a text response.
            </p>
          </div>

          <Field label="Prompt" error={!prompt && loading ? 'Prompt is required' : undefined}>
            {(id: string) => (
              <Textarea
                id={id}
                minLength={1}
                rows={7}
                placeholder="Ask anything…"
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
                rows={4}
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
            <Button type="submit" isLoading={loading} disabled={!prompt}>
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
            <p className="text-xs text-slate-500">Responses stream from the Gemini API.</p>
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
              Your response will appear here. Enter a prompt and click Generate.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
