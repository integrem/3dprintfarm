import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginPage from '@/components/LoginPage.vue'
import DashboardPage from '@/components/DashboardPage.vue'
import ClientDashboard from '@/components/ClientDashboard.vue'
import ServiceProviderJobs from '../views/ServiceProviderJobs.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage,
      meta: { requiresGuest: true }
    },
    {
      path: '/provider-dashboard',
      name: 'provider-dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true, requiresProvider: true }
    },
    {
      path: '/client-dashboard',
      name: 'client-dashboard',
      component: ClientDashboard,
      meta: { requiresAuth: true, requiresClient: true }
    },
    {
      path: '/dashboard',
      redirect: to => {
        const authStore = useAuthStore()
        if (authStore.isProvider) return '/provider-dashboard'
        if (authStore.isClient) return '/client-dashboard'
        return '/'
      }
    },
    {
    path: '/service-provider/jobs',
    name: 'ServiceProviderJobs',
    component: ServiceProviderJobs,
    meta: { requiresAuth: true, role: 'service-provider' }
  },
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    if (authStore.isProvider) {
      next('/provider-dashboard')
    } else if (authStore.isClient) {
      next('/client-dashboard')
    } else {
      next('/dashboard')
    }
  } else if (to.meta.requiresProvider && !authStore.isProvider) {
    next('/')
  } else if (to.meta.requiresClient && !authStore.isClient) {
    next('/')
  } else {
    next()
  }
})

export default router