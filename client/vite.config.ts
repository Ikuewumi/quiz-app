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
         workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg}'] },
         injectManifest: { maximumFileSizeToCacheInBytes: 50000000000 },
         includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
         manifest: {
            name: 'Quiz App',
            short_name: 'QuizApp',
            description: 'A Simple App to help test youor skils with quizzes',
            theme_color: '#ffffff',
            icons: [
               {
                  src: 'pwa-192x192.png',
                  sizes: '192x192',
                  type: 'image/png'
               },
               {
                  src: 'pwa-512x512.png',
                  sizes: '512x512',
                  type: 'image/png'
               }
            ]
         }
      })
   ],
   resolve: {
      alias: {
         '@': fileURLToPath(new URL('./src', import.meta.url))
      },
   },
})
