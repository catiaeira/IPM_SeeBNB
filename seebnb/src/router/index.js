import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue'
import CityView from '@/views/CityView.vue'
import CompareView from '@/views/CompareView.vue'
import NotFoundView from '@/views/NotFoundView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    { path:'/home', component: HomeView },
    { path:'/city', component: CityView },
    { path: '/compare', component: CompareView },
    { path: '/:notFound(.*)', component: NotFoundView }
  ],
})

export default router
