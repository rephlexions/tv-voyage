import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/show/:id',
      name: 'show',
      component: () => import('../views/DetailView.vue')
    },
    {
      path: '/search/:query',
      name: 'search',
      component: () => import('../views/SearchView.vue')
    }
  ]
})

export default router
