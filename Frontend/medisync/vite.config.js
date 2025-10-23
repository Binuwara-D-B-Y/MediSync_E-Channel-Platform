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
    envDir: '.', // Look for .env files in project root
    assetsDir: 'assets', // Ensure assets are output to /assets
    rollupOptions: {
      // Ensure images are included
      input: {
        main: './index.html'
      }
    }
  }
});