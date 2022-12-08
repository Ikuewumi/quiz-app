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
      path: "/quiz/:id",
      props: true
   },


   {
      name: "auth",
      component: () => import('../views/auth/Auth.vue'),
      path: "/auth"
   },

   {
      name: "admin",
      path: "/admin",
      component: () => import('../views/admin/Admin.vue')
   },

   {
      name: "create",
      path: "/admin/create",
      component: () => import('../views/admin/CreateQuiz.vue')
   },


   {
      name: "update",
      path: "/admin/update/:id",
      component: () => import('../views/admin/CreateQuiz.vue')
   },

   {
      name: "draft",
      path: "/admin/drafts/:id",
      component: () => import('../views/admin/Draft.vue')
   },

   {
      name: "dev",
      path: "/dev",
      component: () => import('../views/dev/Playground.vue')
   },

   {
      name: "user",
      path: "/user",
      component: () => import('../views/user/User.vue')
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