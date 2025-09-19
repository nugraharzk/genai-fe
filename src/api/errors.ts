function formatServerMessage(msg?: string) {
  if (!msg) return undefined;
  if (msg.includes('GEMINI_API_KEY') || msg.includes('GOOGLE_API_KEY')) {
    return 'Server is missing its Gemini API key. Please configure it on the backend.';
  }
  return msg;
}

export function humanizeHttpError(status: number, rawMessage?: string) {
  const msg = formatServerMessage(rawMessage);
  switch (status) {
    case 400:
      return (
        msg || 'We could not process your request. Please check your input and try again.'
      );
    case 401:
    case 403:
      return (
        msg || 'You are not authorized to perform this action. Please check your credentials.'
      );
    case 413:
      return 'File is too large. Please upload a smaller file or compress it.';
    case 415:
      return 'Unsupported file type. Please upload a supported format.';
    case 429:
      return 'You are sending requests too quickly. Please slow down and try again.';
    default:
      if (status >= 500) {
        return msg || 'The server had an issue. Please try again shortly.';
      }
      return msg || 'Something went wrong. Please try again.';
  }
}

export async function parseError(res: Response): Promise<string> {
  let bodyText = '';
  try {
    const data = await res
      .clone()
      .json()
      .catch(async () => ({ text: await res.clone().text().catch(() => '') }));
    const raw = (data && (data.error || data.message || data.text)) || '';
    bodyText = typeof raw === 'string' ? raw : JSON.stringify(raw);
  } catch {
    // ignore
  }
  return humanizeHttpError(res.status, bodyText);
}


