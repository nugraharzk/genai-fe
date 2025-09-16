import React, { useRef, useState } from 'react';
import ModelSelect from './ModelSelect';
import type { GenerateResponse } from '../api';
import MarkdownOutput from './MarkdownOutput';
import ErrorAlert from './ErrorAlert';

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

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult(null);
    setErrorMsg('');
    try {
      const data = await submit({ file, prompt: prompt || undefined, systemInstruction: systemInstruction || undefined, model: model || undefined });
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

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  const isImage = mode === 'image' && file && file.type.startsWith('image/');
  const isAudio = mode === 'audio' && file && file.type.startsWith('audio/');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label capitalize">{mode} file</label>
          <div
            className={`dropzone ${dragActive ? 'dropzone-active' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
          >
            <div className="text-sm">Drag & drop or click to select</div>
            <div className="text-xs text-gray-500">Accept: {accept}</div>
          </div>
          <input ref={inputRef} className="hidden" type="file" accept={accept} onChange={onPick} />
          {helper && <p className="mt-2 text-xs text-gray-500">{helper}</p>}
          {file && (
            <div className="thumb p-3 flex items-center gap-3 bg-white">
              <div className="text-sm font-medium text-gray-700 truncate">{file.name}</div>
              <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
            </div>
          )}
          {isImage && (
            <img className="thumb max-h-56" src={URL.createObjectURL(file!)} alt="preview" />
          )}
          {isAudio && (
            <audio className="thumb w-full" controls src={URL.createObjectURL(file!)} />
          )}
        </div>

        <div>
          <label className="label">Prompt (optional)</label>
          <textarea className="textarea" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Optional context or question" />
        </div>

        <div>
          <label className="label">System Instruction (optional)</label>
          <textarea className="textarea" value={systemInstruction} onChange={(e) => setSystemInstruction(e.target.value)} placeholder="Guide the model’s behavior" />
        </div>

        <ModelSelect value={model} onChange={setModel} />

        <div className="flex gap-3">
          <button className="btn btn-primary" disabled={loading || !file} type="submit">
            {loading ? 'Uploading…' : 'Generate'}
          </button>
          <button className="btn btn-ghost" type="button" onClick={onClear}>Clear</button>
        </div>
      </form>

      <div className="panel">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium text-gray-800">Output</div>
          <button type="button" className="btn-icon" onClick={copyOutput} title="Copy">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M16 1a2 2 0 0 1 2 2v10h-2V3H8V1h8Zm3 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2h2v2h14V7h-2V5ZM3 3h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 2v12h10V5H3Z"/></svg>
          </button>
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
            Your response will appear here after upload and generate.
          </div>
        )}
      </div>
    </div>
  );
}
