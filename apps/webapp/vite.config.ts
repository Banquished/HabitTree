import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const monorepoRoot = path.resolve(__dirname, '../..')

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      allow: [monorepoRoot],
    },
  },
  optimizeDeps: {
    entries: ['src/main.tsx'],
    include: ['react', 'react-dom', 'react-router', 'recharts', 'zustand', '@tanstack/react-query'],
  },
})
