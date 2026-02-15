// vite.config.js - Optimized for production

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'terser',
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Code splitting strategy
        manualChunks: {
          vendor: ['react', 'react-dom'],
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
