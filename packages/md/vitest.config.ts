import { defineConfig } from "vitest/config"

export default defineConfig({
   test: {
      "ui": true,
      "watch": true,
      testTimeout: 20000,
      "env": {
         "NODE_ENV": "development",
         "SAMPLE_MD": `# a heading one\n## heading two\nnew paragraph`,
         "SAMPLE_HTML": `
         <h3>Mangyeko Sharingan</h3>
         <p>new world of an old man</p>
         `
      },
      "include": ["src/*", "src/*/**"]
   }
})