import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue'
import CityView from '@/views/CityView.vue'
import CompareView from '@/views/CompareView.vue'
import NotFoundView from '@/views/NotFoundView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    { path:'/home', name: "Home", component: HomeView },
    { path:'/city/:city', name: "City", component: CityView, props: true },
    { path: '/compare/:city1/:city2', name: "Compare", component: CompareView, props: true },
    { path: '/:notFound(.*)', name: "NotFound", component: NotFoundView }
  ],
})

export default router
