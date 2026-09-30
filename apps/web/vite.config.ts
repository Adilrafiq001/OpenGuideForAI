import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  server: {
    port: 5173,
    strictPort: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react-router-dom',
      '@phosphor-icons/react',
      'zustand',
      'clsx',
      'tailwind-merge',
      'framer-motion',
      'lucide-react'
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/@phosphor-icons/react')) {
            return 'vendor-phosphor';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/three')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules/@codemirror') || id.includes('node_modules/codemirror')) {
            return 'vendor-codemirror';
          }
        }
      }
    },
    chunkSizeWarningLimit: 800
  }
})
