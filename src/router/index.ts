import { createRouter, createWebHistory } from 'vue-router';

function lazyLoad(view: string): () => Promise<any> {
  return () => import(`@/views/${view}.vue`);
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: lazyLoad('HomeView')
    },
    {
      path: '/show/:id',
      name: 'show',
      component: lazyLoad('DetailView')
    },
    {
      path: '/search/:query',
      name: 'search',
      component: lazyLoad('SearchView')
    }
  ]
});

export default router;
