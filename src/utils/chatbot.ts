export type ChatRole = 'user' | 'assistant' | 'error';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  rawJson?: unknown;
  autoShowJson?: boolean;
  timestamp: string;
  failedMessage?: string;
}

export interface WebhookRequestPayload {
  message: string;
  chatInput: string;
  sessionId: string;
  timestamp: string;
  source: string;
}

export interface ParsedWebhookReply {
  text: string;
  rawJson: unknown;
  hasTextField: boolean;
}

export const DEFAULT_CHATBOT_WEBHOOK_URL =
  'https://ikems.app.n8n.cloud/webhook/chatbot';

export const MAX_CHAT_MESSAGE_LENGTH = 1000;

export function validateChatInput(rawInput: string): string | null {
  const trimmed = rawInput.trim();
  if (!trimmed || trimmed.length > MAX_CHAT_MESSAGE_LENGTH) {
    return null;
  }
  return trimmed;
}

export function buildWebhookPayload(
  message: string,
  sessionId: string,
  now: Date = new Date(),
): WebhookRequestPayload {
  const cleanMessage = validateChatInput(message);
  if (!cleanMessage) {
    throw new Error('Pesan tidak boleh kosong atau melebihi 1000 karakter.');
  }

  return {
    message: cleanMessage,
    chatInput: cleanMessage,
    sessionId: sessionId.trim() || 'guest-session',
    timestamp: now.toISOString(),
    source: 'by-sawadhee-web',
  };
}

function findNestedText(obj: Record<string, unknown>): string | null {
  const priorityKeys = [
    'reply',
    'output',
    'response',
    'text',
    'message',
    'answer',
    'content',
  ];

  for (const key of priorityKeys) {
    const val = obj[key];
    if (typeof val === 'string' && val.trim().length > 0) {
      return val.trim();
    }
  }

  if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
    const nested = findNestedText(obj.data as Record<string, unknown>);
    if (nested) {
      return nested;
    }
  }

  return null;
}

export function extractWebhookReply(payload: unknown): ParsedWebhookReply {
  let normalized: unknown = payload;

  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed) {
      return {
        text: 'Webhook mengembalikan respons kosong.',
        rawJson: { reply: '' },
        hasTextField: false,
      };
    }
    try {
      normalized = JSON.parse(trimmed);
    } catch {
      return {
        text: trimmed,
        rawJson: { reply: trimmed },
        hasTextField: true,
      };
    }
  }

  if (Array.isArray(normalized)) {
    if (normalized.length === 0) {
      return {
        text: 'Respons array kosong diterima dari webhook.',
        rawJson: normalized,
        hasTextField: false,
      };
    }
    const texts = normalized
      .map((item) => {
        if (typeof item === 'string' && item.trim()) {
          return item.trim();
        }
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          return findNestedText(item as Record<string, unknown>);
        }
        return null;
      })
      .filter((t): t is string => Boolean(t));

    if (texts.length > 0) {
      return {
        text: texts.join('\n\n'),
        rawJson: normalized,
        hasTextField: true,
      };
    }

    return {
      text: 'Respons JSON diterima dari webhook:',
      rawJson: normalized,
      hasTextField: false,
    };
  }

  if (normalized && typeof normalized === 'object') {
    const found = findNestedText(normalized as Record<string, unknown>);
    if (found) {
      return {
        text: found,
        rawJson: normalized,
        hasTextField: true,
      };
    }
    return {
      text: 'Respons JSON diterima dari webhook:',
      rawJson: normalized,
      hasTextField: false,
    };
  }

  return {
    text: String(normalized),
    rawJson: { value: normalized },
    hasTextField: true,
  };
}

export function validateWebhookTargetUrl(rawUrl: string): URL | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }

    const host = parsed.hostname.toLowerCase();
    if (
      host === '169.254.169.254' ||
      host === 'metadata.google.internal' ||
      host.startsWith('169.254.')
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function formatChatTime(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function buildPreviewWebhookReply(message: string): {
  reply: string;
  configured: boolean;
  source: string;
  echoMessage: string;
  batch: string;
  receivedAt: string;
} {
  const q = message.toLowerCase();
  let reply =
    'Terima kasih sudah menghubungi By Sawadhee! Saat ini endpoint berjalan dalam mode pratinjau karena N8N_WEBHOOK_URL belum disetel. Tambahkan N8N_WEBHOOK_URL di Secrets untuk meneruskan chat langsung ke workflow n8n Anda.';

  if (q.includes('batch') || q.includes('jadwal') || q.includes('po')) {
    reply =
      'Batch #14 Open PO aktif pada 25 – 30 Nov 2026, belanja & restock 1 – 3 Des 2026, dan estimasi pengiriman mulai 5 Des 2026. (Mode pratinjau — sambungkan N8N_WEBHOOK_URL untuk balasan otomatis workflow n8n).';
  } else if (
    q.includes('matcha') ||
    q.includes('serum') ||
    q.includes('cushion') ||
    q.includes('ready') ||
    q.includes('stok')
  ) {
    reply =
      'Produk bertanda Ready Stock siap kirim H+1, sedangkan item Open PO mengikuti jadwal Batch #14. Anda bisa langsung klik "+ Keranjang" pada katalog atau hubungkan N8N_WEBHOOK_URL untuk cek stok real-time dari workflow n8n.';
  } else if (q.includes('ongkir') || q.includes('cod') || q.includes('bayar')) {
    reply =
      'Kami mendukung pembayaran Transfer Bank, E-Wallet (QRIS/GoPay/OVO), dan COD untuk item Ready Stock. Estimasi ongkir mulai Rp 14.000/kg untuk Pulau Jawa. (Mode pratinjau n8n webhook).';
  }

  return {
    reply,
    configured: false,
    source: 'preview-fallback',
    echoMessage: message.trim(),
    batch: 'Batch #14',
    receivedAt: new Date().toISOString(),
  };
}

export interface ChatbotApiResult {
  status: number;
  body: unknown;
}

export async function processChatbotRequest(
  rawBody: unknown,
  rawWebhookUrl: string = '',
): Promise<ChatbotApiResult> {
  const bodyObj =
    rawBody && typeof rawBody === 'object' && !Array.isArray(rawBody)
      ? (rawBody as Record<string, unknown>)
      : {};

  const rawMessage =
    typeof bodyObj.message === 'string'
      ? bodyObj.message
      : typeof bodyObj.chatInput === 'string'
        ? bodyObj.chatInput
        : '';

  const cleanMessage = validateChatInput(rawMessage);
  if (!cleanMessage) {
    return {
      status: 400,
      body: {
        error: 'Pesan tidak boleh kosong dan maksimal 1000 karakter.',
      },
    };
  }

  const sessionId =
    typeof bodyObj.sessionId === 'string' && bodyObj.sessionId.trim()
      ? bodyObj.sessionId.trim().slice(0, 80)
      : 'guest-session';

  if (!rawWebhookUrl.trim()) {
    return {
      status: 200,
      body: buildPreviewWebhookReply(cleanMessage),
    };
  }

  const targetUrl = validateWebhookTargetUrl(rawWebhookUrl);
  if (!targetUrl) {
    return {
      status: 500,
      body: {
        error: 'Konfigurasi N8N_WEBHOOK_URL tidak valid.',
      },
    };
  }

  try {
    const outboundPayload = buildWebhookPayload(cleanMessage, sessionId);
    const upstreamResponse = await fetch(targetUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(outboundPayload),
      signal: AbortSignal.timeout(15000),
    });

    const responseText = await upstreamResponse.text();
    let parsedBody: unknown;
    try {
      parsedBody = responseText ? JSON.parse(responseText) : {};
    } catch {
      parsedBody = { reply: responseText };
    }

    if (!upstreamResponse.ok) {
      return {
        status: 502,
        body: {
          error: `Webhook n8n merespons status ${upstreamResponse.status}.`,
          details: parsedBody,
        },
      };
    }

    return {
      status: 200,
      body: parsedBody,
    };
  } catch {
    return {
      status: 502,
      body: {
        error: 'Gagal terhubung ke webhook n8n. Pastikan workflow aktif.',
      },
    };
  }
}

