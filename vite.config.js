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
      },
      // Proxy LiteLLM gateway (when running on :4000)
      '/v1': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
