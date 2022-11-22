import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
   {
      name: "home",
      component: () => import('../views/main/Home.vue'),
      path: "/"
   },

   {
      name: "quiz",
      component: () => import('../views/quiz/Quiz.vue'),
      path: "/quiz"
   },


   {
      name: "auth",
      component: () => import('../views/auth/Auth.vue'),
      path: "/auth"
   }
]

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes,
   scrollBehavior(to, from, savedPosition) {
      return { top: 0 }
   }
})

export default router