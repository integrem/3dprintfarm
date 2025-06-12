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
              <div class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No print jobs yet</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Search for printers and submit your first print job.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Selected Printer Modal -->
    <ModalDialog :is-open="showPrinterDetails" @close="showPrinterDetails = false">
      <div class="sm:flex sm:items-start">
        <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
          <h3 class="text-lg font-semibold leading-6 text-gray-900 mb-4">
            Printer Details
          </h3>
          
          <div v-if="selectedPrinter" class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-900">{{ selectedPrinter.model }}</h4>
              <p class="text-sm text-gray-600">Owner: {{ selectedPrinter.owner }}</p>
            </div>

            <div class="border-t pt-4">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Location</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ selectedPrinter.location?.city }}{{ selectedPrinter.location?.suburb ? `, ${selectedPrinter.location.suburb}` : '' }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Status</dt>
                  <dd class="mt-1 text-sm">
                    <span 
                      :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        selectedPrinter.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      ]"
                    >
                      {{ selectedPrinter.status }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div v-if="selectedPrinter.capabilities?.length" class="border-t pt-4">
              <h5 class="text-sm font-medium text-gray-700 mb-2">Capabilities</h5>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="capability in selectedPrinter.capabilities" 
                  :key="capability"
                  class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                >
                  {{ capability }}
                </span>
              </div>
            </div>

            <div class="mt-6 text-center text-sm text-gray-500">
              Print job submission coming soon!
            </div>
          </div>

          <div class="mt-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="showPrinterDetails = false"
              class="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useGoogleAuth } from '@/composables/useGoogleAuth'
import PrinterSearch from '@/components/client/PrinterSearch.vue'
import ModalDialog from '@/components/common/ModalDialog.vue'

const authStore = useAuthStore()
const { signOut } = useGoogleAuth()
const user = computed(() => authStore.user)

const activeTab = ref('search')
const showPrinterDetails = ref(false)
const selectedPrinter = ref(null)

const handleLogout = () => {
  signOut()
}

const handleSelectPrinter = (printer) => {
  selectedPrinter.value = printer
  showPrinterDetails.value = true
}
</script>