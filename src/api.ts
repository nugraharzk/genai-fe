export type GenerateResponse = {
  model?: string;
  text?: string;
  error?: string;
};

// Prefer runtime-injected config.js, then Vite build-time env, then default
const runtimeBase = (globalThis as any)?.__APP_CONFIG__?.API_BASE_URL as
  | string
  | undefined;
const API_BASE = runtimeBase || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function formatServerMessage(msg?: string) {
  if (!msg) return undefined;
  // Common backend messages to friendlier text
  if (msg.includes('GEMINI_API_KEY') || msg.includes('GOOGLE_API_KEY')) {
    return 'Server is missing its Gemini API key. Please configure it on the backend.';
  }
  return msg;
}

function humanizeHttpError(status: number, rawMessage?: string) {
  const msg = formatServerMessage(rawMessage);
  switch (status) {
    case 400:
      return msg || 'We could not process your request. Please check your input and try again.';
    case 401:
    case 403:
      return msg || 'You are not authorized to perform this action. Please check your credentials.';
    case 413:
      return 'File is too large. Please upload a smaller file or compress it.';
    case 415:
      return 'Unsupported file type. Please upload a supported format.';
    case 429:
      return 'You are sending requests too quickly. Please slow down and try again.';
    default:
      if (status >= 500) return msg || 'The server had an issue. Please try again shortly.';
      return msg || 'Something went wrong. Please try again.';
  }
}

async function parseError(res: Response): Promise<string> {
  let bodyText = '';
  try {
    const data = await res.clone().json().catch(async () => ({ text: await res.clone().text().catch(() => '') }));
    const raw = (data && (data.error || data.message || data.text)) || '';
    bodyText = typeof raw === 'string' ? raw : JSON.stringify(raw);
  } catch {
    // ignore
  }
  return humanizeHttpError(res.status, bodyText);
}

export async function generateTextApi(input: {
  prompt: string;
  model?: string;
  systemInstruction?: string;
}): Promise<GenerateResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/generate-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error('Unable to reach the server. Please check your connection and that the API is running.');
  }
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return (await res.json()) as GenerateResponse;
}

async function uploadWithPrompt(
  path: string,
  fileField: string,
  params: { file: File; prompt?: string; model?: string; systemInstruction?: string }
): Promise<GenerateResponse> {
  const fd = new FormData();
  fd.append(fileField, params.file);
  if (params.prompt) fd.append('prompt', params.prompt);
  if (params.model) fd.append('model', params.model);
  if (params.systemInstruction) fd.append('systemInstruction', params.systemInstruction);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      body: fd,
    });
  } catch {
    throw new Error('Unable to reach the server. Please check your connection and that the API is running.');
  }
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return (await res.json()) as GenerateResponse;
}

export function generateFromImageApi(input: {
  file: File;
  prompt?: string;
  model?: string;
  systemInstruction?: string;
}) {
  return uploadWithPrompt('/generate-from-image', 'image', input);
}

export function generateFromDocumentApi(input: {
  file: File;
  prompt?: string;
  model?: string;
  systemInstruction?: string;
}) {
  return uploadWithPrompt('/generate-from-document', 'document', input);
}

export function generateFromAudioApi(input: {
  file: File;
  prompt?: string;
  model?: string;
  systemInstruction?: string;
}) {
  return uploadWithPrompt('/generate-from-audio', 'audio', input);
}
