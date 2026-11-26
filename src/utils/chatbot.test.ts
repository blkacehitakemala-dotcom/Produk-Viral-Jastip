import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPreviewWebhookReply,
  buildWebhookPayload,
  DEFAULT_CHATBOT_WEBHOOK_URL,
  extractWebhookReply,
  processChatbotRequest,
  validateChatInput,
  validateWebhookTargetUrl,
} from './chatbot';

test('DEFAULT_CHATBOT_WEBHOOK_URL points to the configured n8n webhook', () => {
  assert.equal(
    DEFAULT_CHATBOT_WEBHOOK_URL,
    'https://ikems.app.n8n.cloud/webhook/chatbot',
  );
});

test('validateChatInput trims valid input and rejects empty or oversized input', () => {
  assert.equal(validateChatInput('   '), null);
  assert.equal(validateChatInput(''), null);
  assert.equal(validateChatInput('  Halo admin!  '), 'Halo admin!');
  assert.equal(validateChatInput('a'.repeat(1001)), null);
});

test('buildWebhookPayload constructs n8n-compatible JSON body', () => {
  const fixedDate = new Date('2026-11-25T10:00:00.000Z');
  const payload = buildWebhookPayload(' Cek stok matcha ', 'sess-123', fixedDate);

  assert.deepEqual(payload, {
    message: 'Cek stok matcha',
    chatInput: 'Cek stok matcha',
    sessionId: 'sess-123',
    timestamp: '2026-11-25T10:00:00.000Z',
    source: 'by-sawadhee-web',
  });

  assert.throws(() => buildWebhookPayload('   ', 'sess-123', fixedDate));
});

test('extractWebhookReply parses common n8n object, array, nested, and raw JSON payloads', () => {
  const objReply = extractWebhookReply({ output: 'Stok tersedia 5 pcs.' });
  assert.equal(objReply.text, 'Stok tersedia 5 pcs.');
  assert.equal(objReply.hasTextField, true);

  const arrayReply = extractWebhookReply([{ reply: 'Batch #14 dibuka!' }]);
  assert.equal(arrayReply.text, 'Batch #14 dibuka!');
  assert.equal(arrayReply.hasTextField, true);

  const nestedReply = extractWebhookReply({
    status: 'ok',
    data: { message: 'Pesanan dicatat.' },
  });
  assert.equal(nestedReply.text, 'Pesanan dicatat.');
  assert.equal(nestedReply.hasTextField, true);

  const rawOnlyReply = extractWebhookReply({ orderCode: 'SWD-99', available: true });
  assert.equal(rawOnlyReply.hasTextField, false);
  assert.deepEqual(rawOnlyReply.rawJson, { orderCode: 'SWD-99', available: true });

  const jsonStringReply = extractWebhookReply('{"text":"Dari string JSON"}');
  assert.equal(jsonStringReply.text, 'Dari string JSON');
  assert.equal(jsonStringReply.hasTextField, true);
});

test('validateWebhookTargetUrl accepts http/https and blocks unsafe schemes or metadata hosts', () => {
  assert.ok(validateWebhookTargetUrl('https://n8n.example.com/webhook/sawadhee'));
  assert.ok(validateWebhookTargetUrl('http://localhost:5678/webhook-test/chat'));
  assert.equal(validateWebhookTargetUrl('javascript:alert(1)'), null);
  assert.equal(validateWebhookTargetUrl('http://169.254.169.254/latest/meta-data'), null);
  assert.equal(validateWebhookTargetUrl('not-a-url'), null);
});

test('buildPreviewWebhookReply produces structured JSON response when webhook env is unset', () => {
  const result = buildPreviewWebhookReply('Kapan jadwal batch PO?');
  assert.equal(result.configured, false);
  assert.equal(result.source, 'preview-fallback');
  assert.match(result.reply, /Batch #14/);
  assert.equal(result.echoMessage, 'Kapan jadwal batch PO?');
});

test('processChatbotRequest handles validation, unset webhook preview, and invalid URL safely', async () => {
  const emptyRes = await processChatbotRequest({ message: '   ' }, '');
  assert.equal(emptyRes.status, 400);

  const previewRes = await processChatbotRequest({ message: 'Cek batch PO' }, '');
  assert.equal(previewRes.status, 200);
  assert.equal((previewRes.body as { source?: string }).source, 'preview-fallback');

  const invalidUrlRes = await processChatbotRequest(
    { message: 'Halo' },
    'http://169.254.169.254/latest/meta-data',
  );
  assert.equal(invalidUrlRes.status, 500);
});

