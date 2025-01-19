import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.userscript.js'),
      name: 'userscript',
      fileName: 'userscript',
      formats: ["es"],
      // formats: ["iife"]
    }
  },
  plugins: [
    {
      name: 'append-tampermonkey-header',
      generateBundle(_, bundle) {
        for (const key in bundle) {
          bundle[key].code = `// ==UserScript==
// @name         Xert - Zwift Curvilinear Intervals fixed
// @namespace    http://tampermonkey.net/
// @version      2025-01-18
// @description  Fix exported curvilinear intervals from Xert workouts to Zwift ZWO format
// @author       Feavy
// @match        https://www.xertonline.com/workout/*/view
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xertonline.com
// @grant        none
// ==/UserScript==

` + bundle[key].code
        }
      }
    }
  ]
})