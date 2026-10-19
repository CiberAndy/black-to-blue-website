import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

const fromRoot = (path) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  // GitHub Pages serves this project from /black-to-blue-website/.
  base: '/black-to-blue-website/',
  build: {
    rollupOptions: {
      input: {
        main: fromRoot('./index.html'),
        videos: fromRoot('./videos.html'),
        impressum: fromRoot('./impressum.html'),
        datenschutz: fromRoot('./datenschutz.html'),
      },
    },
  },
})
