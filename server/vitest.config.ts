import { defineConfig } from 'vitest/config'

export default defineConfig({
   test: {
      "ui": true,
      "watch": true,
      "env": {
         NODE_ENV: "development",
         ACCESS: "3ace093cd9368b8a9ff415acd03e05cae1378683690c4fd350dbdd7a1cc25fa30f66e2668a23f564c617622f0d17739198a9c5d102637e8af0d2babf7a06f325",
         REFRESH: "c88d11e2768682439b99752c287f0ecb78df7be2f53626ab4c94426aa1abc62da8506b714fd9b5483d49aec815d1d4b14100b457de69d33ca1f6706453b457f5",
         DB_URI: "mongodb://127.0.0.1:27017/quiz-app"
      },
      testTimeout: 20000
   }
})