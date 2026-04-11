import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    // 🚀 THE BIG FIX: Use 'node' environment. 
    // This stops Vitest from trying to load your Tailwind CSS!
    environment: 'node', 
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
