import React, { useState } from 'react';
import ModelSelect from './ModelSelect';
import MarkdownOutput from './MarkdownOutput';
import ErrorAlert from './ErrorAlert';
import { generateTextApi, type GenerateResponse } from '../api';

export default function TextPanel() {
  const [prompt, setPrompt] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [model, setModel] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setErrorMsg('');
    try {
      const data = await generateTextApi({ prompt, systemInstruction: systemInstruction || undefined, model: model || undefined });
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">Prompt</label>
          <textarea className="textarea min-h-[160px]" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask anything…" />
        </div>

        <div>
          <label className="label">System Instruction (optional)</label>
          <textarea className="textarea" value={systemInstruction} onChange={(e) => setSystemInstruction(e.target.value)} placeholder="Guide the model’s behavior" />
        </div>

        <ModelSelect value={model} onChange={setModel} />

        <div className="flex gap-3">
          <button className="btn btn-primary" disabled={loading || !prompt} type="submit">
            {loading ? 'Generating…' : 'Generate'}
          </button>
          <button className="btn btn-ghost" type="button" onClick={onClear}>Clear</button>
        </div>
      </form>

      <div className="panel">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium text-gray-800">Output</div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn-icon" onClick={copyOutput} title="Copy">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M16 1a2 2 0 0 1 2 2v10h-2V3H8V1h8Zm3 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2h2v2h14V7h-2V5ZM3 3h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 2v12h10V5H3Z"/></svg>
            </button>
          </div>
        </div>
        {errorMsg ? (
          <ErrorAlert message={errorMsg} />
        ) : result ? (
          result.error ? (
            <ErrorAlert message={result.error} />
          ) : (
            <MarkdownOutput content={result.text} />
          )
        ) : (
          <div className="output text-gray-500">
            Your response will appear here. Enter a prompt and click Generate.
          </div>
        )}
      </div>
    </div>
  );
}
