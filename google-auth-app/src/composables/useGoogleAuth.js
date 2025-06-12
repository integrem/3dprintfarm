import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export const useGoogleAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  const isLoading = ref(false)
  const error = ref('')

  const initializeGoogleSignIn = (buttonId, userType = 'provider') => {
    if (!window.google) {
      error.value = 'Google Identity Services not loaded'
      return
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response) => handleCredentialResponse(response, userType)
    })

    window.google.accounts.id.renderButton(
      document.getElementById(buttonId),
      { 
        theme: 'outline', 
        size: 'large',
        width: '100%',
        text: 'signin_with',
        logo_alignment: 'left'
      }
    )
  }

  const handleCredentialResponse = async (response, userType) => {
    isLoading.value = true
    error.value = ''

    try {
      // Decode the JWT token to get user info
      const base64Url = response.credential.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )

      const payload = JSON.parse(jsonPayload)
      
      const userData = {
        id: payload.sub,
        email: payload.email,
        name: payload.given_name || '',
        surname: payload.family_name || '',
        fullName: payload.name,
        imageUrl: payload.picture,
        emailVerified: payload.email_verified,
        userType: userType // Add user type to user data
      }

      authStore.setUser(userData)
      
      // Route based on user type
      if (userType === 'provider') {
        router.push('/provider-dashboard')
      } else {
        router.push('/client-dashboard')
      }
    } catch (err) {
      console.error('Failed to decode credential:', err)
      error.value = 'Authentication failed. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  const signOut = () => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect()
    }
    authStore.clearUser()
    router.push('/')
  }

  return {
    initializeGoogleSignIn,
    signOut,
    isLoading,
    error
  }
}