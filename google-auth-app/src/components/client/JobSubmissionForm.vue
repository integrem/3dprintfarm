<template>
  <ModalDialog :is-open="isOpen" @close="handleClose">
    <div class="sm:flex sm:items-start">
      <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 mb-4">
          Submit Print Job
        </h3>
        
        <!-- Selected Printer Info -->
        <div v-if="printer" class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 class="text-sm font-medium text-gray-700">Selected Printer</h4>
          <p class="text-sm text-gray-900 mt-1">{{ printer.model }}</p>
          <p class="text-xs text-gray-600">{{ printer.location?.city }}</p>
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- File Upload -->
          <div>
            <label for="file" class="block text-sm font-medium text-gray-700">
              3D Model File
            </label>
            <div class="mt-1">
              <div 
                @drop="handleDrop"
                @dragover.prevent
                @dragenter.prevent
                @dragleave.prevent
                class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors"
              >
                <div class="space-y-1 text-center">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label
                      for="file-upload"
                      class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        class="sr-only"
                        accept=".stl,.3mf"
                        @change="handleFileSelect"
                      >
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">STL or 3MF files only</p>
                </div>
              </div>
              
              <!-- File Preview -->
              <div v-if="selectedFile" class="mt-4 bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removeFile"
                    class="text-red-500 hover:text-red-700"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Material Selection -->
          <div>
            <label for="material" class="block text-sm font-medium text-gray-700">
              Material
            </label>
            <select
              id="material"
              v-model="formData.material"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="">Select material</option>
              <option v-for="material in availableMaterials" :key="material" :value="material">
                {{ material }}
              </option>
            </select>
          </div>

          <!-- Color Input -->
          <div>
            <label for="color" class="block text-sm font-medium text-gray-700">
              Color
            </label>
            <input
              id="color"
              v-model="formData.color"
              type="text"
              required
              placeholder="e.g., Black, Red, Blue"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
          </div>

          <!-- Additional Notes -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              v-model="formData.notes"
              rows="3"
              placeholder="Any special instructions..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            ></textarea>
          </div>

          <!-- Estimated Details -->
          <div class="border-t pt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Job Details</h4>
            <dl class="text-sm space-y-1">
              <div class="flex justify-between">
                <dt class="text-gray-600">Printer:</dt>
                <dd class="text-gray-900">{{ printer?.model || 'Not selected' }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Location:</dt>
                <dd class="text-gray-900">{{ printer?.location?.city || 'N/A' }}</dd>
              </div>
              <div v-if="selectedFile" class="flex justify-between">
                <dt class="text-gray-600">File:</dt>
                <dd class="text-gray-900">{{ selectedFile.name }}</dd>
              </div>
            </dl>
          </div>

          <!-- Success message -->
          <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
            <p class="text-sm text-green-800">{{ successMessage }}</p>
          </div>

          <!-- Error message -->
          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>

          <!-- Upload Progress -->
          <div v-if="loading" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span>{{ uploadProgress === 100 ? 'Processing...' : 'Uploading...' }}</span>
              <span>{{ uploadProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                :style="`width: ${uploadProgress}%`"
              ></div>
            </div>
            <p v-if="uploadProgress === 100" class="text-xs text-gray-500 text-center">
              Creating job and assigning to printer...
            </p>
          </div>

          <!-- Form actions -->
          <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
            >
              {{ loading ? 'Submitting...' : 'Submit Job' }}
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
import { useJobsStore } from '@/stores/jobs'
import ModalDialog from '@/components/common/ModalDialog.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  printer: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()
const jobsStore = useJobsStore()

const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const selectedFile = ref(null)
const uploadProgress = ref(0)

const formData = ref({
  material: '',
  color: '',
  notes: ''
})

// Get available materials from printer capabilities
const availableMaterials = computed(() => {
  if (!props.printer?.capabilities) return ['PLA', 'PETG', 'ABS', 'TPU']
  
  const materials = props.printer.capabilities.filter(cap => 
    ['PLA', 'PETG', 'ABS', 'TPU', 'Nylon'].includes(cap)
  )
  
  return materials.length > 0 ? materials : ['PLA', 'PETG', 'ABS', 'TPU']
})

const isFormValid = computed(() => {
  return selectedFile.value && 
         formData.value.material && 
         formData.value.color &&
         props.printer
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const validateFile = (file) => {
  const validExtensions = ['.stl', '.3mf']
  const fileExtension = file.name.toLowerCase().substr(file.name.lastIndexOf('.'))
  
  if (!validExtensions.includes(fileExtension)) {
    error.value = 'Please upload an STL or 3MF file'
    return false
  }
  
  // Check file size (max 100MB)
  const maxSize = 100 * 1024 * 1024
  if (file.size > maxSize) {
    error.value = 'File size must be less than 100MB'
    return false
  }
  
  return true
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && validateFile(file)) {
    selectedFile.value = file
    error.value = ''
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file && validateFile(file)) {
    selectedFile.value = file
    error.value = ''
  }
}

const removeFile = () => {
  selectedFile.value = null
  const fileInput = document.getElementById('file-upload')
  if (fileInput) fileInput.value = ''
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  loading.value = true
  error.value = ''
  successMessage.value = ''
  uploadProgress.value = 0

  try {
    // Create FormData for file upload
    const formDataToSend = new FormData()
    formDataToSend.append('file', selectedFile.value)
    formDataToSend.append('clientName', authStore.user.email)
    formDataToSend.append('material', formData.value.material)
    formDataToSend.append('color', formData.value.color)
    if (formData.value.notes) {
      formDataToSend.append('notes', formData.value.notes)
    }

    // Create the job with file upload
    const newJob = await jobsStore.createJobWithFile(formDataToSend, (progress) => {
      uploadProgress.value = progress
    })

    // Set progress to 100 to show processing
    uploadProgress.value = 100

    // If job creation is successful and we have a printer, assign it
    if (newJob._id && props.printer._id) {
      await jobsStore.assignJobToPrinter(newJob._id, props.printer._id)
    }

    // Set loading to false before closing
    loading.value = false
    
    // Emit success and close immediately
    emit('success', newJob)
    handleClose()
    
  } catch (err) {
    error.value = err.message || 'Failed to submit job. Please try again.'
    uploadProgress.value = 0
    loading.value = false
  }
}

const handleClose = () => {
  if (!loading.value) {
    formData.value = {
      material: '',
      color: '',
      notes: ''
    }
    selectedFile.value = null
    error.value = ''
    successMessage.value = ''
    uploadProgress.value = 0
    emit('close')
  }
}
</script>