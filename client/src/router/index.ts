import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
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