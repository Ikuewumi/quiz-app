import './scss/app.scss'
import { createApp } from 'vue'
import router from './router/index'
import App from './App.vue'
import { createPinia } from 'pinia'
const p = createPinia()



createApp(App)
   .use(p)
   .use(router)
   .mount('#app')
