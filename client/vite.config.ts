import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from "vite-plugin-pwa"
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [
      vue({
         reactivityTransform: true,
         template: { compilerOptions: { isCustomElement: (tag) => tag.includes('-') } }
      }),

      VitePWA({
         registerType: 'autoUpdate',
         minify: true,
         devOptions: { enabled: true },
         workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg}'] },
         injectManifest: { maximumFileSizeToCacheInBytes: 50000000000 }
      })
   ],
   resolve: {
      alias: {
         '@': fileURLToPath(new URL('./src', import.meta.url))
      },
   },
})
