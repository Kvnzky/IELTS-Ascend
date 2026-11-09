import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: false
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react', 'canvas-confetti'],
          curriculumData: ['./src/data/curriculumData.ts', './src/data/vocabularyData.ts'],
          examData: [
            './src/data/readingData.ts',
            './src/data/listeningData.ts',
            './src/data/writingData.ts',
            './src/data/speakingData.ts',
          ],
        },
      },
    },
  },
})
