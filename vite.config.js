import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib.js'),
      name: 'downloadFixedZWO',
      // the proper extensions will be added
      fileName: 'downloadFixedZWO',
      formats: ["iife"]
    },
  },
})