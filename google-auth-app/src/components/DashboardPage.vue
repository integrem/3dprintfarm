<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-semibold">3D Print Service Provider</h1>
            </div>
            <!-- Navigation Tabs -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link 
                to="/service-provider" 
                class="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </router-link>
              <router-link 
                to="/service-provider/jobs" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Print Jobs
              </router-link>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">{{ user?.email }}</span>
            <button
              @click="handleLogout"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- User Welcome Section -->
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <img 
                v-if="user?.imageUrl"
                :src="user.imageUrl" 
                :alt="user.fullName"
                class="h-16 w-16 rounded-full mr-4"
              >
              <div>
                <h2 class="text-2xl font-bold text-gray-900">
                  Welcome back, {{ user?.name }}!
                </h2>
                <p class="text-gray-600">{{ user?.email }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats Section -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <dt class="text-sm font-medium text-gray-500 truncate">
                Total Printers
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ printers.length }}
              </dd>
            </div>
          </div>
          
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <dt class="text-sm font-medium text-gray-500 truncate">
                Total Jobs
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ jobStats.totalJobs }}
              </dd>
            </div>
          </div>
          
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <dt class="text-sm font-medium text-gray-500 truncate">
                Active Jobs
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-indigo-600">
                {{ activeJobsCount }}
              </dd>
            </div>
          </div>
          
          <div 
            @click="$router.push('/service-provider/jobs')"
            class="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div class="p-5">
              <dt class="text-sm font-medium text-gray-500 truncate">
                View All Jobs
              </dt>
              <dd class="mt-1 text-lg font-semibold text-indigo-600 flex items-center">
                Go to Jobs 
                <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </dd>
            </div>
          </div>
        </div>

        <!-- Recent Jobs Preview (Optional) -->
        <div v-if="recentJobs.length > 0" class="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">Recent Jobs</h3>
              <router-link 
                to="/service-provider/jobs"
                class="text-sm text-indigo-600 hover:text-indigo-500"
              >
                View all →
              </router-link>
            </div>
            <div class="space-y-3">
              <div 
                v-for="job in recentJobs.slice(0, 3)" 
                :key="job._id"
                class="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ job.fileName }}</p>
                  <p class="text-sm text-gray-500">{{ job.clientName }}</p>
                </div>
                <span :class="getStatusClass(job.status)">
                  {{ job.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Printers Section -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-medium text-gray-900">Your 3D Printers</h3>
              <div class="flex space-x-2">
                <button 
                  @click="showAddPrinterModal = true"
                  class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Printer
                </button>
                <button 
                  @click="refreshPrinters"
                  :disabled="printersLoading"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': printersLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {{ printersLoading ? 'Loading...' : 'Refresh' }}
                </button>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="printersLoading && !printers.length" class="text-center py-12">
              <svg class="animate-spin h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="mt-2 text-gray-500">Loading your printers...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="printersError" class="rounded-md bg-red-50 p-4">
              <p class="text-sm text-red-800">{{ printersError }}</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="!printers.length" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No printers</h3>
              <p class="mt-1 text-sm text-gray-500">Get started by adding a new 3D printer.</p>
              <div class="mt-6">
                <button
                  @click="showAddPrinterModal = true"
                  type="button"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Printer
                </button>
              </div>
            </div>

            <!-- Printers Grid -->
            <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <PrinterCard 
                v-for="printer in printers" 
                :key="printer._id || printer.id" 
                :printer="printer"
                @delete="handleDeletePrinter"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Printer Modal -->
    <AddPrinterForm 
      :is-open="showAddPrinterModal"
      @close="showAddPrinterModal = false"
      @success="handleAddPrinterSuccess"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmDialog
      :is-open="showDeleteConfirm"
      title="Delete Printer"
      :message="`Are you sure you want to delete '${printerToDelete?.model}'? This action cannot be undone.`"
      confirm-text="Delete"
      :loading="deleteLoading"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePrintersStore } from '@/stores/printers'
import { useGoogleAuth } from '@/composables/useGoogleAuth'
import axios from 'axios'
import PrinterCard from '@/components/PrinterCard.vue'
import AddPrinterForm from '@/components/AddPrinterForm.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const router = useRouter()
const authStore = useAuthStore()
const printersStore = usePrintersStore()
const { signOut } = useGoogleAuth()

const user = computed(() => authStore.user)
const printers = computed(() => printersStore.printers)
const printersLoading = computed(() => printersStore.loading)
const printersError = computed(() => printersStore.error)

const showAddPrinterModal = ref(false)
const showDeleteConfirm = ref(false)
const printerToDelete = ref(null)
const deleteLoading = ref(false)

// Job statistics
const jobStats = ref({ totalJobs: 0, statusBreakdown: [] })
const recentJobs = ref([])
const activeJobsCount = computed(() => {
  const activeStatuses = ['assigned', 'printing']
  return jobStats.value.statusBreakdown
    .filter(stat => activeStatuses.includes(stat._id))
    .reduce((sum, stat) => sum + stat.count, 0)
})

// Fetch job statistics
const fetchJobStats = async () => {
    console.log('Token:', authStore.token); // Debug token
  try {
    const response = await axios.get('http://localhost:3000/api/jobs/provider-stats', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    jobStats.value = response.data
  } catch (error) {
    console.error('Error fetching job stats:', error)
  }
}

// Fetch recent jobs
const fetchRecentJobs = async () => {
    console.log('Token:', authStore.token); // Debug token
  try {
    const response = await axios.get('http://localhost:3000/api/jobs/provider-jobs', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    recentJobs.value = response.data
  } catch (error) {
    console.error('Error fetching recent jobs:', error)
  }
}

// Get status styling
const getStatusClass = (status) => {
  const classes = {
    assigned: 'px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800',
    printing: 'px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800',
    completed: 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800',
    failed: 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800',
    cancelled: 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'
  }
  return classes[status] || classes.assigned
}

const handleLogout = () => {
  signOut()
}

const refreshPrinters = async () => {
  if (user.value?.email) {
    await printersStore.fetchUserPrinters(user.value.email)
  }
}

const handleAddPrinterSuccess = () => {
  // Refresh the printers list after successful addition
  refreshPrinters()
}

const handleDeletePrinter = (printer) => {
  console.log('handleDeletePrinter called with:', printer)
  printerToDelete.value = printer
  showDeleteConfirm.value = true
  console.log('showDeleteConfirm:', showDeleteConfirm.value)
  console.log('printerToDelete:', printerToDelete.value)
}

const confirmDelete = async () => {
  if (!printerToDelete.value) return
  
  deleteLoading.value = true
  try {
    await printersStore.deletePrinter(printerToDelete.value._id || printerToDelete.value.id)
    showDeleteConfirm.value = false
    printerToDelete.value = null
  } catch (error) {
    console.error('Failed to delete printer:', error)
    // You might want to show an error toast here
  } finally {
    deleteLoading.value = false
  }
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  printerToDelete.value = null
}

onMounted(() => {
  refreshPrinters()
  fetchJobStats()
  fetchRecentJobs()
})
</script>