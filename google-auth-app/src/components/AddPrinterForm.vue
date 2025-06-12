<template>
  <ModalDialog :is-open="isOpen" @close="handleClose">
    <div class="sm:flex sm:items-start">
      <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 mb-4">
          Add New 3D Printer
        </h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Model -->
          <div>
            <label for="model" class="block text-sm font-medium text-gray-700">
              Printer Model
            </label>
            <input
              id="model"
              v-model="formData.model"
              type="text"
              required
              placeholder="e.g., Bambu X1C"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
          </div>

          <!-- IP Address -->
          <div>
            <label for="ip" class="block text-sm font-medium text-gray-700">
              IP Address
            </label>
            <input
              id="ip"
              v-model="formData.ip"
              type="text"
              required
              pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
              placeholder="192.168.1.100"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
            <p class="mt-1 text-xs text-gray-500">Enter the printer's local IP address</p>
          </div>

          <!-- Location -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                id="city"
                v-model="formData.location.city"
                type="text"
                required
                placeholder="Cape Town"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              >
            </div>
            <div>
              <label for="suburb" class="block text-sm font-medium text-gray-700">
                Suburb
              </label>
              <input
                id="suburb"
                v-model="formData.location.suburb"
                type="text"
                placeholder="Sea Point"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              >
            </div>
          </div>

          <!-- Capabilities -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Capabilities
            </label>
            <div class="space-y-2">
              <div class="flex flex-wrap gap-2">
                <label
                  v-for="capability in commonCapabilities"
                  :key="capability"
                  class="inline-flex items-center"
                >
                  <input
                    type="checkbox"
                    :value="capability"
                    v-model="formData.capabilities"
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">{{ capability }}</span>
                </label>
              </div>
              
              <!-- Custom capability input -->
              <div class="flex gap-2 mt-2">
                <input
                  v-model="customCapability"
                  type="text"
                  placeholder="Add custom capability"
                  @keydown.enter.prevent="addCustomCapability"
                  class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                >
                <button
                  type="button"
                  @click="addCustomCapability"
                  :disabled="!customCapability.trim()"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
              
              <!-- Selected capabilities -->
              <div v-if="formData.capabilities.length" class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="(cap, index) in formData.capabilities"
                  :key="index"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {{ cap }}
                  <button
                    type="button"
                    @click="removeCapability(index)"
                    class="ml-1 inline-flex items-center justify-center w-4 h-4 text-indigo-400 hover:text-indigo-600"
                  >
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </span>
              </div>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>

          <!-- Form actions -->
          <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
            >
              {{ loading ? 'Adding...' : 'Add Printer' }}
            </button>
            <button
              type="button"
              @click="handleClose"
              :disabled="loading"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePrintersStore } from '@/stores/printers'
import ModalDialog from '@/components/common/ModalDialog.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()
const printersStore = usePrintersStore()

const loading = ref(false)
const error = ref('')
const customCapability = ref('')

const commonCapabilities = [
  'PLA',
  'PETG',
  'ABS',
  'TPU',
  'Nylon',
  'multi-color',
  'auto-leveling',
  'enclosed',
  'large-format'
]

const formData = ref({
  model: '',
  ip: '',
  location: {
    city: '',
    suburb: ''
  },
  capabilities: []
})

const isFormValid = computed(() => {
  return formData.value.model.trim() && 
         formData.value.ip.trim() && 
         formData.value.location.city.trim()
})

const addCustomCapability = () => {
  const capability = customCapability.value.trim()
  if (capability && !formData.value.capabilities.includes(capability)) {
    formData.value.capabilities.push(capability)
    customCapability.value = ''
  }
}

const removeCapability = (index) => {
  formData.value.capabilities.splice(index, 1)
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  loading.value = true
  error.value = ''

  try {
    const printerData = {
      owner: authStore.user.email,
      model: formData.value.model,
      ip: formData.value.ip,
      capabilities: formData.value.capabilities,
      location: {
        city: formData.value.location.city,
        suburb: formData.value.location.suburb
      }
    }

    await printersStore.addPrinter(printerData)
    emit('success')
    handleClose()
  } catch (err) {
    error.value = err.message || 'Failed to add printer. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  if (!loading.value) {
    // Reset form
    formData.value = {
      model: '',
      ip: '',
      location: {
        city: '',
        suburb: ''
      },
      capabilities: []
    }
    customCapability.value = ''
    error.value = ''
    emit('close')
  }
}
</script>