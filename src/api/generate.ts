import { API_BASE, NETWORK_ERROR_MESSAGE } from "./config";
import { parseError } from "./errors";
import type { GenerateResponse } from "./types";

type GenerateTextRequest = {
  prompt: string;
  model?: string;
  systemInstruction?: string;
  provider?: string;
};

type UploadWithPromptParams = {
  file: File;
  prompt?: string;
  model?: string;
  systemInstruction?: string;
  provider?: string;
};

export async function generateTextApi(
  input: GenerateTextRequest,
): Promise<GenerateResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/generate-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return (await res.json()) as GenerateResponse;
}

async function uploadWithPrompt(
  path: string,
  fileField: string,
  params: UploadWithPromptParams,
): Promise<GenerateResponse> {
  const fd = new FormData();
  fd.append(fileField, params.file);
  if (params.prompt) fd.append("prompt", params.prompt);
  if (params.model) fd.append("model", params.model);
  if (params.systemInstruction)
    fd.append("systemInstruction", params.systemInstruction);
  if (params.provider) fd.append("provider", params.provider);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      body: fd,
    });
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return (await res.json()) as GenerateResponse;
}

export function generateFromImageApi(params: UploadWithPromptParams) {
  return uploadWithPrompt("/generate-from-image", "image", params);
}

export function generateFromDocumentApi(params: UploadWithPromptParams) {
  return uploadWithPrompt("/generate-from-document", "document", params);
}

export function generateFromAudioApi(params: UploadWithPromptParams) {
  return uploadWithPrompt("/generate-from-audio", "audio", params);
}
