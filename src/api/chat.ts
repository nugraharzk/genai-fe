import { API_BASE, NETWORK_ERROR_MESSAGE } from "./config";
import { parseError } from "./errors";
import type { ChatHistoryItem, GenerateResponse } from "./types";

type ChatRequest = {
  prompt: string;

  history?: ChatHistoryItem[];

  model?: string;

  systemInstruction?: string;

  provider?: string;
};

export async function chatWithGeminiApi(
  input: ChatRequest,
): Promise<GenerateResponse> {
  const payload: Record<string, unknown> = {
    prompt: input.prompt,
  };

  if (input.history?.length) {
    payload.messages = input.history;
  }
  if (input.model) payload.model = input.model;
  if (input.systemInstruction)
    payload.systemInstruction = input.systemInstruction;
  if (input.provider) payload.provider = input.provider;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return (await res.json()) as GenerateResponse;
}
