import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from 'vue-router'

const checkAuth = (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      next()
    } else {
      next('/auth')
    }
  })
}

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/AuthView.vue'),
  },
]

const router = createRouter({
  linkActiveClass: 'text-blue-700',
  history: createWebHistory(),
  routes,
})

export default router
