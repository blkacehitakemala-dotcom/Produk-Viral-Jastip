import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  DEFAULT_CHATBOT_WEBHOOK_URL,
  processChatbotRequest,
} from '../src/utils/chatbot.js';

const MAX_BODY_BYTES = 32 * 1024;

interface VercelCompatibleRequest extends IncomingMessage {
  body?: unknown;
}

async function readJsonBody(req: VercelCompatibleRequest): Promise<unknown> {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  }

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;

    req.on('data', (chunk: Buffer) => {
      totalBytes += chunk.length;
      if (totalBytes > MAX_BODY_BYTES) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      const raw = Buffer.concat(chunks).toString('utf8');
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });

    req.on('error', () => resolve({}));
  });
}

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export default async function handler(
  req: VercelCompatibleRequest,
  res: ServerResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { error: 'Method not allowed. Gunakan POST.' });
    return;
  }

  let body: unknown;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 413, { error: 'Ukuran payload melebihi batas 32KB.' });
    return;
  }

  const result = await processChatbotRequest(
    body,
    process.env.N8N_WEBHOOK_URL || DEFAULT_CHATBOT_WEBHOOK_URL,
  );
  sendJson(res, result.status, result.body);
}
