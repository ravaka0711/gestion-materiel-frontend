import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // ou 5173
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // ← CHANGE ICI !
        changeOrigin: true,
        secure: false,
      },
    },
  },
})