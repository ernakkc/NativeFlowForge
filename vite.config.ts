import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './apps/desktop/renderer',
  resolve: {
    alias: {
      '@nff/shared': path.resolve(__dirname, './packages/shared'),
      '@nff/engine': path.resolve(__dirname, './packages/engine'),
      '@nff/nodes': path.resolve(__dirname, './packages/nodes'),
      '@nff/db': path.resolve(__dirname, './packages/db')
    }
  }
})
