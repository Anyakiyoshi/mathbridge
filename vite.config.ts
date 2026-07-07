import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages: set base to '/<repo-name>/'
  // For local / custom domain: set base to '/'
  base: process.env.BASE_URL || '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
