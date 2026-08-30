import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
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
  },
});
