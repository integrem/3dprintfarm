<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold">Service Provider Dashboard</h1>
          </div>
          <div class="flex items-center">
            <button
              @click="handleLogout"
              class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              Welcome, {{ user?.name }} {{ user?.surname }}!
            </h2>
            
            <div class="mt-6 border-t border-gray-200 pt-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ user?.fullName }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ user?.email }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Email Verified</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <span v-if="user?.emailVerified" class="text-green-600">✓ Verified</span>
                    <span v-else class="text-red-600">✗ Not Verified</span>
                  </dd>
                </div>
              </dl>
            </div>
            
            <div v-if="user?.imageUrl" class="mt-6">
              <img 
                :src="user.imageUrl" 
                :alt="user.fullName"
                class="h-20 w-20 rounded-full"
              >
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useGoogleAuth } from '@/composables/useGoogleAuth'

const authStore = useAuthStore()
const { signOut } = useGoogleAuth()
const user = computed(() => authStore.user)

const handleLogout = () => {
  signOut()
}
</script>