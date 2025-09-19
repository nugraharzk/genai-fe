export type GenerateResponse = {
  model?: string;
  text?: string;
  error?: string;
};

export type ChatHistoryItem = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};
