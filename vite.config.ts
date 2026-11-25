import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Built into docs/ so GitHub Pages can serve it from main/docs.
export default defineConfig({
  base: '/pulse/',
  plugins: [react(), tailwindcss()],
  build: { outDir: 'docs', emptyOutDir: false, chunkSizeWarningLimit: 900 },
})
