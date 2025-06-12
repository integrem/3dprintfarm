<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Service Provider Login
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sign in with your Google account to continue
        </p>
      </div>
      
      <div class="mt-8 space-y-6">
        <!-- Google Sign In Button will be rendered here -->
        <div id="googleSignInButton" class="flex justify-center"></div>
        
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useGoogleAuth } from '@/composables/useGoogleAuth'

const { initializeGoogleSignIn, error } = useGoogleAuth()

onMounted(() => {
  // Initialize Google Sign In after component mounts
  setTimeout(() => {
    initializeGoogleSignIn('googleSignInButton')
  }, 100)
})
</script>