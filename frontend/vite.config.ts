import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Log environment information
console.log('=== Vite Configuration ===')
console.log('Mode:', process.env.NODE_ENV)
console.log('Command:', process.env.npm_lifecycle_script)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL?.replace('/api', '') || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})