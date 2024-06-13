import { createRouter, createWebHistory } from 'vue-router';

function lazyLoad(view: string): () => Promise<string> {
  return () => import(`@/views/${view}.vue`);
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: lazyLoad('HomeView')
  },
  {
    path: '/view/:id',
    name: 'view',
    component: lazyLoad('DetailView')
  },
  {
    path: '/search/:query',
    name: 'search',
    component: lazyLoad('SearchView')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
