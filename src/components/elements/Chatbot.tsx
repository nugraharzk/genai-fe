import { FormEvent, useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { Button, IconButton } from '../base';
import { cn } from '../utils';
import { chatWithGeminiApi } from '../../api';
import MarkdownOutput from './MarkdownOutput';

type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  status?: 'error';
};

const createMessage = (
  text: string,
  sender: ChatMessage['sender'],
  status?: ChatMessage['status'],
): ChatMessage => ({
  id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
  text,
  sender,
  status,
});

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      messagesEndRef.current?.scrollIntoView({
        behavior: isOpen ? 'smooth' : 'auto',
        block: 'end',
      });
      return;
    }
    if (isOpen) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    } else {
      container.scrollTop = container.scrollHeight;
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useLayoutEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, scrollToBottom]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return;

    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }

    const userMessage = createMessage(trimmed, 'user');
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputValue('');
    setIsSending(true);
    inputRef.current?.focus();

    try {
      const response = await chatWithGeminiApi({
        prompt: trimmed,
        history: nextMessages.map((message) => ({
          role: message.sender === 'user' ? 'user' : 'assistant',
          content: message.text,
        })),
      });

      const reply = response.text?.trim();
      const botText = reply?.length
        ? reply
        : 'Gemini did not return a response. Please try asking again.';
      setMessages((prev) => [...prev, createMessage(botText, 'bot')]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Gemini chat is unavailable right now. Please try again later.';
      setMessages((prev) => [...prev, createMessage(message, 'bot', 'error')]);
    } finally {
      setIsSending(false);
    }
  };

  const chatPanel = (
    <>
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-brand-600 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 text-sm font-semibold">
            G
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Gemini Chat</p>
            <p className="text-xs text-white/80">Ask anything and explore ideas.</p>
          </div>
        </div>
        <IconButton
          aria-label="Close Gemini chat"
          tone="neutral"
          size="sm"
          className="text-white hover:bg-white/10 focus-visible:ring-white/70 focus-visible:ring-offset-brand-600"
          onClick={closeChat}
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="18" x2="6" y1="6" y2="18" />
            <line x1="6" x2="18" y1="6" y2="18" />
          </svg>
        </IconButton>
      </header>

      <div className="flex flex-1 min-h-0 flex-col">
        <div
          ref={messagesContainerRef}
          className="flex-1 min-h-0 space-y-3 overflow-y-auto px-4 py-4"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.length === 0 ? (
            <p className="w-fit max-w-[80%] rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Say hello to start a conversation with Gemini.
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'w-fit max-w-[80%] break-words rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm',
                  message.status === 'error'
                    ? 'mr-auto border border-rose-200 bg-rose-50 text-rose-700'
                    : message.sender === 'user'
                      ? 'ml-auto bg-brand-600 text-white'
                      : 'mr-auto bg-slate-100 text-slate-900',
                )}
              >
                {message.status === 'error' || message.sender !== 'bot' ? (
                  message.text
                ) : (
                  <MarkdownOutput content={message.text} />
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Message Gemini..."
            className="flex-1 rounded-2xl border border-transparent bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            aria-label="Message Gemini"
            disabled={isSending}
          />
          <Button
            type="submit"
            size="sm"
            isLoading={isSending}
            disabled={isSending || inputValue.trim().length === 0}
          >
            Send
          </Button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[10005] flex flex-col bg-slate-900/30 px-4 py-6 backdrop-blur-sm sm:hidden">
          <section
            id="gemini-chat-window-mobile"
            className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            {chatPanel}
          </section>
        </div>
      )}

      <aside className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-[10000] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
        <section
          id="gemini-chat-window"
          className={cn(
            'hidden origin-bottom-right overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 transition-all duration-200 ease-out sm:flex sm:h-[30rem] sm:w-[22rem] sm:flex-col',
            isOpen
              ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
              : 'pointer-events-none translate-y-4 scale-95 opacity-0',
          )}
          role="dialog"
          aria-hidden={!isOpen}
        >
          {chatPanel}
        </section>

        <Button
          type="button"
          onClick={toggleChat}
          variant="primary"
          size="lg"
          className={cn(
            'h-14 w-14 rounded-full p-0 shadow-xl shadow-brand-900/20 transition-transform duration-200 ease-out sm:h-14 sm:w-14',
            isOpen ? 'translate-y-1 ring-4 ring-brand-200 ring-offset-2 ring-offset-white' : 'translate-y-0',
          )}
          aria-controls="gemini-chat-window gemini-chat-window-mobile"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Minimise Gemini chat' : 'Open Gemini chat'}
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M21 15a2 2 0 0 1-2 2H9l-4 4v-4H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </Button>
      </aside>
    </>
  );
}
