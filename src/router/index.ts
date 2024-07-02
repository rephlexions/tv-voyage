import path from 'path';
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
    path: '/view/:type/:id',
    name: 'view',
    component: lazyLoad('DetailView')
  },
  {
    path: '/search/:query',
    name: 'search',
    component: lazyLoad('SearchView')
  },
  {
    path: '/person/:id',
    name: 'person',
    component: lazyLoad('PersonView')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (from.name) {
    to.meta.fromWithinApp = true;
  } else {
    to.meta.fromWithinApp = false;
  }
  next();
});

export default router;
