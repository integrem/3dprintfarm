<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to Print Farm
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sign in to access your account
        </p>
      </div>
      
      <!-- Tab Selection -->
      <div class="mt-8">
        <div class="flex rounded-lg shadow-sm">
          <button
            @click="userType = 'provider'"
            :class="[
              'flex-1 py-3 px-4 text-sm font-medium rounded-l-lg border',
              userType === 'provider'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            ]"
          >
            <svg class="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Service Provider
          </button>
          <button
            @click="userType = 'client'"
            :class="[
              'flex-1 py-3 px-4 text-sm font-medium rounded-r-lg border',
              userType === 'client'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            ]"
          >
            <svg class="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Client
          </button>
        </div>
      </div>

      <!-- Login Content -->
      <div class="mt-8 space-y-6">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900">
            {{ userType === 'provider' ? 'Service Provider Login' : 'Client Login' }}
          </h3>
          <p class="mt-2 text-sm text-gray-600">
            {{ userType === 'provider' 
              ? 'Sign in to manage your 3D printers and print jobs' 
              : 'Sign in to submit print jobs and track orders' 
            }}
          </p>
        </div>

        <!-- Google Sign In Button will be rendered here -->
        <div id="googleSignInButton" class="flex justify-center"></div>
        
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500">
          {{ userType === 'provider' 
            ? 'As a service provider, you can register printers and manage print jobs' 
            : 'As a client, you can submit 3D models and track your print orders' 
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useGoogleAuth } from '@/composables/useGoogleAuth'

const { initializeGoogleSignIn, error } = useGoogleAuth()
const userType = ref('provider') // Default to provider

// Re-initialize Google Sign In when user type changes
watch(userType, () => {
  // Small delay to ensure DOM is updated
  setTimeout(() => {
    initializeGoogleSignIn('googleSignInButton', userType.value)
  }, 100)
})

onMounted(() => {
  // Initialize Google Sign In after component mounts
  setTimeout(() => {
    initializeGoogleSignIn('googleSignInButton', userType.value)
  }, 100)
})
</script>