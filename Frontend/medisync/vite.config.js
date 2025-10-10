// import { defineConfig } from 'vite'
// // import { defineConfig } from 'vitest/config';

// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': 'http://localhost:5000'
//     }
//   }
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000' // For local dev only
    }
  },
  build: {
    // Ensure environment variables are included in production
    envDir: '.', // Look for .env files in project root
  }
});