import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@ds/core/style.css': path.resolve(__dirname, '../design_system/dist/index.css'),
      '@ds/core': path.resolve(__dirname, '../design_system/dist/index.js'),
    },
  },
})
