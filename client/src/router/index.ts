import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useToast } from '../composables'
import { getToken } from '../composables/env'
import { useUser } from '../pinia/user'

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
      path: '/:catchAll(.*)',
      component: () => import('../views/dev/Playground.vue')
   },

   {
      name: "quizzes",
      path: "/quizzes",
      component: () => import('../views/main/Quizzes.vue')
   },

   {
      name: "user",
      path: "/user/:id",
      component: () => import('../views/user/User.vue')
   },

   {
      name: "you",
      path: "/you",
      component: () => import('../views/user/You.vue')
   }
]

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes,
   scrollBehavior(to, from, savedPosition) {
      return { top: 0 }
   }
})

//TODO remove create route when done fixing it
const normieRoutes = ['home', 'auth', 'dev', 'quizzes']


router.beforeEach(async (to, from) => {
   if (normieRoutes.includes(to.name! as string)) {
      return true
   } else {
      const token = await getToken()
      if (!token) throw Error('')
      return true
   }
})

router.onError((error) => {
   useToast().el.show(`oops! you don't have permissions for this page, login or signup to become a user`, true)
   router.push('/auth')
})


export default router