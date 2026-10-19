import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

const fromRoot = (path) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: fromRoot('./index.html'),
        videos: fromRoot('./videos.html'),
        impressum: fromRoot('./impressum.html'),
      },
    },
  },
})
