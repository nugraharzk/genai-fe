const runtimeBase = (globalThis as any)?.__APP_CONFIG__?.API_BASE_URL as string | undefined;
export const API_BASE = runtimeBase || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const NETWORK_ERROR_MESSAGE =
  'Unable to reach the server. Please check your connection and that the API is running.';
