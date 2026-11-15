import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const projectRoot = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: projectRoot,
  plugins: [react()],
  server: {
    port: 9000,
    open: true,
    strictPort: true
  },
  build: {
    outDir: resolve(projectRoot, '../../dist'),
    emptyOutDir: true
  }
})
