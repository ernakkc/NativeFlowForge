import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  root: path.resolve(__dirname, 'apps/desktop/renderer'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  plugins: [
    react(),
    electron([
      {
        // Main Process giriş noktası
        entry: path.resolve(__dirname, 'apps/desktop/electron/main.ts'),
      },
      {
        // Preload Script giriş noktası
        entry: path.resolve(__dirname, 'apps/desktop/electron/preload.ts'),
        onstart(options) {
          // Preload script değiştiğinde sayfayı yeniden yükle
          options.reload();
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      '@nff/shared': path.resolve(__dirname, './packages/shared'),
      '@nff/engine': path.resolve(__dirname, './packages/engine'),
      '@nff/nodes': path.resolve(__dirname, './packages/nodes'),
      '@nff/db': path.resolve(__dirname, './packages/db'),
    },
  },
});
