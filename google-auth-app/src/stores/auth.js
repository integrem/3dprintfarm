import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  const isProvider = computed(() => user.value?.userType === 'provider')
  const isClient = computed(() => user.value?.userType === 'client')

  function setUser(userData) {
    user.value = userData
  }

  function clearUser() {
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    isProvider,
    isClient,
    setUser,
    clearUser
  }
})