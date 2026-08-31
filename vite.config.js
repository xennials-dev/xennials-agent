import { resolve } from 'path';
import { defineConfig } from 'vite';

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
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Proxy Ollama directly (always available at :11434)
      '/ollama': {
        target: 'http://localhost:11434',
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
      // Proxy LiteLLM gateway (when running on :4000)
      '/v1': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            if (!res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: { message: 'LiteLLM gateway offline — falling back to Ollama' } }));
            }
          });
        },
      },
      // Proxy DeepTutor / Hermes Backend (/api/skills, /api/models, /api/tools)
      '/api': {
        target: process.env.HERMES_DASHBOARD_URL || 'http://127.0.0.1:9119',
        changeOrigin: true,
        ws: true,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            if (!res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: { message: 'Hermes backend offline. Start with `hermes dashboard` on port 9119.' } }));
            }
          });
        },
      },
      '/dashboard-plugins': {
        target: process.env.HERMES_DASHBOARD_URL || 'http://127.0.0.1:9119',
        changeOrigin: true,
      },
    },
  },
});
