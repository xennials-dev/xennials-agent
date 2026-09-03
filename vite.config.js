import { resolve } from 'path';
import { defineConfig } from 'vite';
import http from 'http';

// Auto-detect whether Hermes is on 8080 or 9119
const HERMES_BACKEND = process.env.HERMES_DASHBOARD_URL || 'http://127.0.0.1:8080';
let cachedToken = '0Dfq8VKNzYOZ-sVJy4i9ZrtRUSQrBvEslu173F8pT28';

function getHermesToken() {
  return new Promise((resolve) => {
    const urls = [HERMES_BACKEND, 'http://127.0.0.1:8080', 'http://127.0.0.1:9119'];
    let count = 0;
    urls.forEach((targetUrl) => {
      http.get(targetUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          const match = data.match(/window\.__HERMES_SESSION_TOKEN__\s*=\s*"([^"]+)"/);
          if (match && match[1]) {
            cachedToken = match[1];
          }
          count++;
          if (count === urls.length) resolve(cachedToken);
        });
      }).on('error', () => {
        count++;
        if (count === urls.length) resolve(cachedToken);
      });
    });
  });
}

// Initial token resolution
getHermesToken();

export default defineConfig({
  root: __dirname,
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        deeptutor: resolve(__dirname, 'deeptutor.html'),
        playground: resolve(__dirname, 'playground.html'),
        blog: resolve(__dirname, 'blog.html'),
        skills: resolve(__dirname, 'skills.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Proxy Ollama directly (always available at :11434)
      '/ollama': {
        target: 'http://127.0.0.1:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ollama/, ''),
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            if (!res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: { message: 'Ollama is offline or unreachable' } }));
            }
          });
        },
      },
      // Proxy OpenAI-compatible gateway (Ollama on :11434/v1 or LiteLLM on :4000)
      '/v1': {
        target: 'http://127.0.0.1:11434/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v1/, ''),
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            if (!res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: { message: 'AI Gateway offline — falling back' } }));
            }
          });
        },
      },
      // Proxy DeepTutor / Hermes Backend (/api/skills, /api/models, /api/tools)
      '/api': {
        target: HERMES_BACKEND,
        changeOrigin: true,
        ws: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            if (cachedToken && !proxyReq.getHeader('X-Hermes-Session-Token')) {
              proxyReq.setHeader('X-Hermes-Session-Token', cachedToken);
            }
          });
          proxy.on('error', (err, req, res) => {
            if (!res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: { message: 'Hermes backend offline on port 8080/9119.' } }));
            }
          });
        },
      },
      '/dashboard-plugins': {
        target: HERMES_BACKEND,
        changeOrigin: true,
      },
    },
  },
});

