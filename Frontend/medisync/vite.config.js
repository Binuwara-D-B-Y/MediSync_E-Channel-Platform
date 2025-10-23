import { defineConfig } from 'vite'
// import { defineConfig } from 'vitest/config';

import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
<<<<<<< HEAD
      '/api': 'http://localhost:5094'
=======
      '/api': 'http://localhost:5000'
>>>>>>> wishlist
    }
  }
})
