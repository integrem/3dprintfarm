<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold">Client Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">{{ user?.email }}</span>
            <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              Client
            </span>
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
      <div class="px-4 py-6 sm:px-0">
        <!-- User Welcome Section -->
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
                  Welcome, {{ user?.name }}!
                </h2>
                <p class="text-gray-600">{{ user?.email }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="mb-6">
          <nav class="flex space-x-4">
            <button
              @click="activeTab = 'search'"
              :class="[
                'px-3 py-2 font-medium text-sm rounded-md',
                activeTab === 'search'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              Search Printers
            </button>
            <button
              @click="activeTab = 'jobs'"
              :class="[
                'px-3 py-2 font-medium text-sm rounded-md',
                activeTab === 'jobs'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              My Print Jobs
            </button>
          </nav>
        </div>

        <!-- Content Area -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <!-- Search Printers Tab -->
            <div v-if="activeTab === 'search'">
              <h3 class="text-lg font-medium text-gray-900 mb-6">Find Available 3D Printers</h3>
              <PrinterSearch @select-printer="handleSelectPrinter" />
            </div>

            <!-- My Print Jobs Tab -->
            <div v-else-if="activeTab === 'jobs'">
              <h3 class="text-lg font-medium text-gray-900 mb-6">My Print Jobs</h3>
              
              <!-- Loading State -->
              <div v-if="jobsLoading" class="text-center py-12">
                <svg class="animate-spin h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="mt-2 text-gray-500">Loading your print jobs...</p>
              </div>

              <!-- Error State -->
              <div v-else-if="jobsError" class="rounded-md bg-red-50 p-4">
                <p class="text-sm text-red-800">{{ jobsError }}</p>
              </div>

              <!-- Empty State -->
              <div v-else-if="!userJobs.length" class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No print jobs yet</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Search for printers and submit your first print job.
                </p>
              </div>

              <!-- Jobs List -->
              <div v-else class="space-y-4">
                <div v-for="job in userJobs" :key="job._id" class="border rounded-lg p-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-medium text-gray-900">{{ job.fileUrl.split('/').pop() }}</h4>
                      <p class="text-sm text-gray-600 mt-1">
                        Material: {{ job.material }} | Color: {{ job.color }}
                      </p>
                      <p v-if="job.notes" class="text-sm text-gray-500 mt-1">{{ job.notes }}</p>
                    </div>
                    <span 
                      :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      ]"
                    >
                      {{ job.status || 'pending' }}
                    </span>
                  </div>
                  <div class="mt-2 text-xs text-gray-500">
                    Submitted: {{ new Date(job.createdAt).toLocaleString() }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Job Submission Form Modal -->
    <JobSubmissionForm
      :is-open="showJobSubmission"
      :printer="selectedPrinter"
      @close="handleCloseJobForm"
      @success="handleJobSubmissionSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useGoogleAuth } from '@/composables/useGoogleAuth'
import { useJobsStore } from '@/stores/jobs'
import PrinterSearch from '@/components/client/PrinterSearch.vue'
import JobSubmissionForm from '@/components/client/JobSubmissionForm.vue'

const authStore = useAuthStore()
const jobsStore = useJobsStore()
const { signOut } = useGoogleAuth()

const user = computed(() => authStore.user)
const userJobs = computed(() => jobsStore.jobs)
const jobsLoading = computed(() => jobsStore.loading)
const jobsError = computed(() => jobsStore.error)

const activeTab = ref('search')
const showJobSubmission = ref(false)
const selectedPrinter = ref(null)

const handleLogout = () => {
  signOut()
}

const handleSelectPrinter = (printer) => {
  selectedPrinter.value = printer
  showJobSubmission.value = true
}

const handleCloseJobForm = () => {
  showJobSubmission.value = false
  selectedPrinter.value = null
}

const handleJobSubmissionSuccess = (job) => {
  // Switch to jobs tab to show the new job
  activeTab.value = 'jobs'
  // Refresh jobs list
  fetchUserJobs()
}

const fetchUserJobs = async () => {
  if (user.value?.email) {
    // Fetch jobs for the current user
    await jobsStore.fetchJobs({ clientName: user.value.email })
  }
}

// Fetch jobs when switching to jobs tab
watch(activeTab, (newTab) => {
  if (newTab === 'jobs' && user.value) {
    fetchUserJobs()
  }
})

// Also fetch jobs on mount if jobs tab is active
onMounted(() => {
  if (activeTab.value === 'jobs' && user.value) {
    fetchUserJobs()
  }
})
</script>