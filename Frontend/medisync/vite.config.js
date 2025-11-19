import { defineConfig } from 'vite'
// import { defineConfig } from 'vitest/config';

import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE || 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
})
