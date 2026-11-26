import dotenv from 'dotenv';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_CHATBOT_WEBHOOK_URL,
  processChatbotRequest,
} from './src/utils/chatbot.ts';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

export async function createApp() {
  const app = express();
  app.use(express.json({ limit: '32kb' }));

  app.post('/api/chatbot', async (req, res) => {
    const result = await processChatbotRequest(
      req.body,
      process.env.N8N_WEBHOOK_URL || DEFAULT_CHATBOT_WEBHOOK_URL,
    );
    res.status(result.status).json(result.body);
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));
      });
    }
  }

  return app;
}

if (!process.env.VERCEL) {
  createApp().then((app) => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  });
}
