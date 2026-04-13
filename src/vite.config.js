import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { base44 } from '@base44/vite-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    base44(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react-router-dom', '@tanstack/react-query'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@base44/sdk'],
    exclude: [],
    force: true,
  },
  ssr: {
    noExternal: ['react', 'react-dom'],
  },
})