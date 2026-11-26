import { FormEvent, useEffect, useId, useRef, useState } from 'react';
import {
  AlertCircle,
  BotMessageSquare,
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';
import {
  buildWebhookPayload,
  ChatMessage,
  DEFAULT_CHATBOT_WEBHOOK_URL,
  extractWebhookReply,
  formatChatTime,
  MAX_CHAT_MESSAGE_LENGTH,
  validateChatInput,
} from '../utils/chatbot';

interface ChatbotProps {
  webhookUrl?: string;
  embedded?: boolean;
}

const QUICK_PROMPTS = [
  'Jadwal Batch #14 kapan?',
  'Matcha tin ready stock?',
  'Cek ongkir & metode COD',
];

function createInitialMessages(): ChatMessage[] {
  return [
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: 'Halo! Ada yang bisa dibantu soal produk viral, jadwal Batch #14 Jastip, atau estimasi ongkir By Sawadhee?',
      timestamp: formatChatTime(),
    },
  ];
}

export function Chatbot({
  webhookUrl = DEFAULT_CHATBOT_WEBHOOK_URL,
  embedded = false,
}: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    createInitialMessages(),
  );
  const [isSending, setIsSending] = useState(false);
  const [expandedJsonIds, setExpandedJsonIds] = useState<
    Record<string, boolean>
  >({});

  const sessionIdRef = useRef(
    `sawadhee-${Math.random().toString(36).slice(2, 10)}`,
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelId = useId();
  const inputId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending, isOpen, expandedJsonIds]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 60);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleJsonView = (messageId: string, defaultVisible: boolean) => {
    setExpandedJsonIds((prev) => ({
      ...prev,
      [messageId]:
        prev[messageId] !== undefined ? !prev[messageId] : !defaultVisible,
    }));
  };

  const sendMessageToWebhook = async (rawText: string, appendUserBubble = true) => {
    const cleanText = validateChatInput(rawText);
    if (!cleanText || isSending) {
      return;
    }

    if (appendUserBubble) {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role: 'user',
        text: cleanText,
        timestamp: formatChatTime(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
    }

    setIsSending(true);

    try {
      const payload = buildWebhookPayload(cleanText, sessionIdRef.current);
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const rawTextBody = await response.text();
      let parsedBody: unknown = {};
      if (rawTextBody) {
        try {
          parsedBody = JSON.parse(rawTextBody);
        } catch {
          parsedBody = { reply: rawTextBody };
        }
      }

      if (!response.ok) {
        const errExtract = extractWebhookReply(parsedBody);
        const errorText =
          typeof (parsedBody as { error?: unknown })?.error === 'string'
            ? (parsedBody as { error: string }).error
            : errExtract.hasTextField
              ? errExtract.text
              : `Permintaan webhook gagal (status ${response.status}).`;

        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'error',
            text: errorText,
            rawJson: parsedBody,
            timestamp: formatChatTime(),
            failedMessage: cleanText,
          },
        ]);
        return;
      }

      const extracted = extractWebhookReply(parsedBody);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          role: 'assistant',
          text: extracted.text,
          rawJson: extracted.rawJson,
          autoShowJson: !extracted.hasTextField,
          timestamp: formatChatTime(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'error',
          text: 'Tidak dapat terhubung ke webhook. Periksa koneksi internet atau coba beberapa saat lagi.',
          timestamp: formatChatTime(),
          failedMessage: cleanText,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessageToWebhook(inputValue, true);
  };

  const handleResetChat = () => {
    setMessages(createInitialMessages());
    setExpandedJsonIds({});
    setInputValue('');
    inputRef.current?.focus();
  };

  const hasUserMessages = messages.some((m) => m.role === 'user');

  return (
    <div
      className={
        embedded
          ? 'relative'
          : 'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40'
      }
    >
      {/* Conversation Panel */}
      {isOpen && (
        <section
          id={panelId}
          role="dialog"
          aria-label="Asisten Chat By Sawadhee"
          className="fixed bottom-18 right-4 sm:bottom-20 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[min(74vh,560px)] bg-white/95 backdrop-blur-md border border-teal-900/15 shadow-2xl shadow-teal-950/15 rounded-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-teal-700 to-teal-600 text-white flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <BotMessageSquare className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold leading-tight truncate">
                  Asisten By Sawadhee
                </h2>
                <p className="text-xs text-teal-100 truncate">
                  Tanya stok, batch PO &amp; info produk
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {hasUserMessages && (
                <button
                  type="button"
                  onClick={handleResetChat}
                  aria-label="Reset percakapan"
                  title="Mulai percakapan baru"
                  className="p-2 rounded-lg text-teal-100 hover:text-white hover:bg-white/15 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup asisten chat"
                className="p-2 rounded-lg text-teal-100 hover:text-white hover:bg-white/15 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Conversation Bubble Feed */}
          <div
            role="log"
            aria-live="polite"
            aria-label="Riwayat percakapan"
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-gradient-to-b from-teal-50/35 via-white/70 to-amber-50/30"
          >
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isError = msg.role === 'error';
              const showJson =
                expandedJsonIds[msg.id] !== undefined
                  ? expandedJsonIds[msg.id]
                  : Boolean(msg.autoShowJson);

              return (
                <div
                  key={msg.id}
                  data-testid={`chat-bubble-${msg.role}`}
                  className={`flex flex-col ${
                    isUser ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-teal-600 text-white rounded-br-sm shadow-xs shadow-teal-900/15'
                        : isError
                          ? 'bg-amber-50 border border-amber-200 text-amber-950 rounded-bl-sm'
                          : 'bg-white border border-teal-900/10 text-slate-800 rounded-bl-sm shadow-xs shadow-teal-950/5'
                    }`}
                  >
                    {isError && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 mb-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>Kendala Koneksi Webhook</span>
                      </div>
                    )}

                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                    {msg.rawJson !== undefined && (
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() =>
                            toggleJsonView(msg.id, Boolean(msg.autoShowJson))
                          }
                          aria-expanded={showJson}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 rounded"
                        >
                          <span>
                            {showJson ? 'Sembunyikan JSON' : 'Lihat JSON'}
                          </span>
                          {showJson ? (
                            <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                        </button>

                        {showJson && (
                          <pre
                            data-testid="chat-json-payload"
                            className="mt-1.5 p-2.5 rounded-lg bg-slate-900 text-teal-100 text-[11px] font-mono whitespace-pre-wrap break-words overflow-x-auto leading-relaxed max-h-48"
                          >
                            {JSON.stringify(msg.rawJson, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}

                    {isError && msg.failedMessage && (
                      <button
                        type="button"
                        onClick={() =>
                          void sendMessageToWebhook(msg.failedMessage!, false)
                        }
                        disabled={isSending}
                        className="mt-2 inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors whitespace-nowrap"
                      >
                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Coba Lagi</span>
                      </button>
                    )}
                  </div>

                  {msg.timestamp && (
                    <span className="mt-1 px-1 text-[11px] text-slate-400 tabular-nums">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Quick Suggestion Buttons Before First User Message */}
            {!hasUserMessages && !isSending && (
              <div className="pt-1 flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessageToWebhook(prompt, true)}
                    className="h-8 px-3 rounded-lg bg-white hover:bg-teal-50 border border-teal-900/15 text-xs font-medium text-teal-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Loading Bubble */}
            {isSending && (
              <div className="flex flex-col items-start">
                <div className="bg-white border border-teal-900/10 text-slate-600 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-xs font-medium inline-flex items-center gap-2 shadow-xs shadow-teal-950/5">
                  <Loader2
                    className="w-3.5 h-3.5 text-teal-600 animate-spin shrink-0"
                    aria-hidden="true"
                  />
                  <span>Menghubungi asisten...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Text Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-teal-900/10 bg-white flex items-center gap-2 shrink-0"
          >
            <label htmlFor={inputId} className="sr-only">
              Tulis pesan untuk asisten chat
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              maxLength={MAX_CHAT_MESSAGE_LENGTH}
              placeholder="Tulis pertanyaan Anda..."
              disabled={isSending}
              className="flex-1 min-w-0 h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 disabled:opacity-60"
            />
            <button
              type="submit"
              aria-label="Kirim pesan"
              disabled={isSending || !validateChatInput(inputValue)}
              className="h-10 px-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Kirim</span>
            </button>
          </form>
        </section>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        aria-label={
          isOpen
            ? 'Tutup Asisten Chat By Sawadhee'
            : 'Buka Asisten Chat By Sawadhee'
        }
        className="h-11 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 inline-flex items-center gap-2 text-sm font-semibold transition-transform duration-150 hover:-translate-y-0.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        {isOpen ? (
          <>
            <X className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Tutup Chat</span>
          </>
        ) : (
          <>
            <BotMessageSquare className="w-5 h-5 shrink-0 text-teal-300" aria-hidden="true" />
            <span>Asisten Chat</span>
          </>
        )}
      </button>
    </div>
  );
}
