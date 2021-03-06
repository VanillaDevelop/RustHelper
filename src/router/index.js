import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/overview',
    name: 'Overview',
    component: () => import('../views/Overview.vue')
  },
  {
    path: '/furnaces',
    name: 'Furnace Tracker',
    component: () => import('../views/FurnaceTracker.vue')
  },
  {
    path: '/buildcost',
    name: 'Build Cost Calculator',
    component: () => import('../views/BuildCostCalculator.vue')
  },
  {
    path: '/map',
    name: 'Server Map',
    component: () => import('../views/MapView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
