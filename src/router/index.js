import { createRouter, createWebHistory } from 'vue-router'
import JejuSpot from '@/views/JejuSpots.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'JejuSpots',
      component: JejuSpot
    }
  ]
})

export default router
