import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  base: '/uniconAppForChatGpt/',
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 1000
    }
  },
  optimizeDeps: {
    exclude: []
  }
})
