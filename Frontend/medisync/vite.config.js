import { defineConfig } from 'vite'
// import { defineConfig } from 'vitest/config';

import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API requests to backend running on port 5001
    proxy: {
      '/api': 'http://localhost:5001'
    }
  }
})
