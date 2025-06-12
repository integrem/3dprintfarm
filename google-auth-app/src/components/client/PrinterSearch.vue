<template>
  <div class="space-y-6">
    <!-- Search and Filter Bar -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- City Search -->
        <div>
          <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            id="city"
            v-model="filters.city"
            type="text"
            placeholder="e.g., Cape Town"
            @input="debouncedSearch"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          >
        </div>

        <!-- Model Search -->
        <div>
          <label for="model" class="block text-sm font-medium text-gray-700 mb-1">
            Printer Model
          </label>
          <input
            id="model"
            v-model="filters.model"
            type="text"
            placeholder="e.g., Bambu X1C"
            @input="debouncedSearch"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          >
        </div>

        <!-- Capability Filter -->
        <div>
          <label for="capability" class="block text-sm font-medium text-gray-700 mb-1">
            Capability
          </label>
          <select
            id="capability"
            v-model="filters.capability"
            @change="searchPrinters"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          >
            <option value="">All Capabilities</option>
            <option value="PLA">PLA</option>
            <option value="PETG">PETG</option>
            <option value="ABS">ABS</option>
            <option value="TPU">TPU</option>
            <option value="multi-color">Multi-color</option>
            <option value="large-format">Large Format</option>
          </select>
        </div>

        <!-- Search Button -->
        <div class="flex items-end">
          <button
            @click="searchPrinters"
            :disabled="loading"
            class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <svg v-if="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <svg v-else class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Searching...' : 'Search' }}
          </button>
        </div>
      </div>

      <!-- Active Filters -->
      <div v-if="hasActiveFilters" class="mt-4 flex items-center space-x-2">
        <span class="text-sm text-gray-500">Active filters:</span>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(value, key) in activeFilters"
            :key="key"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
          >
            {{ key }}: {{ value }}
            <button
              @click="removeFilter(key)"
              class="ml-1 inline-flex items-center justify-center w-4 h-4 text-indigo-400 hover:text-indigo-600"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </span>
        </div>
        <button
          @click="clearFilters"
          class="text-sm text-indigo-600 hover:text-indigo-500"
        >
          Clear all
        </button>
      </div>
    </div>

    <!-- Results Count -->
    <div v-if="searched" class="text-sm text-gray-600">
      Found {{ printers.length }} {{ printers.length === 1 ? 'printer' : 'printers' }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <svg class="animate-spin h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-2 text-gray-500">Searching for printers...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-md bg-red-50 p-4">
      <p class="text-sm text-red-800">{{ error }}</p>
    </div>

    <!-- No Results -->
    <div v-else-if="searched && !printers.length" class="text-center py-12 bg-white rounded-lg shadow">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No printers found</h3>
      <p class="mt-1 text-sm text-gray-500">Try adjusting your search filters</p>
    </div>

    <!-- Results Grid -->
    <div v-else-if="printers.length" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ClientPrinterCard 
        v-for="printer in printers" 
        :key="printer._id || printer.id" 
        :printer="printer"
        @select="selectPrinter"
      />
    </div>

    <!-- Initial State -->
    <div v-else class="text-center py-12 bg-white rounded-lg shadow">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Search for 3D Printers</h3>
      <p class="mt-1 text-sm text-gray-500">Use the filters above to find available printers</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePrintersStore } from '@/stores/printers'
import ClientPrinterCard from './ClientPrinterCard.vue'

const emit = defineEmits(['select-printer'])

const printersStore = usePrintersStore()
const printers = computed(() => printersStore.printers)
const loading = computed(() => printersStore.loading)
const error = computed(() => printersStore.error)

const searched = ref(false)
const filters = ref({
  city: '',
  model: '',
  capability: ''
})

const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value => value !== '')
})

const activeFilters = computed(() => {
  const active = {}
  Object.entries(filters.value).forEach(([key, value]) => {
    if (value) active[key] = value
  })
  return active
})

// Debounce function for search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    searchPrinters()
  }, 500)
}

const searchPrinters = async () => {
  searched.value = true
  
  // Build query object with only non-empty values
  const query = {}
  if (filters.value.city) query.city = filters.value.city
  if (filters.value.model) query.model = filters.value.model
  if (filters.value.capability) query.capability = filters.value.capability
  
  await printersStore.fetchPrinters(query)
}

const removeFilter = (key) => {
  filters.value[key] = ''
  searchPrinters()
}

const clearFilters = () => {
  filters.value = {
    city: '',
    model: '',
    capability: ''
  }
  searchPrinters()
}

const selectPrinter = (printer) => {
  emit('select-printer', printer)
}
</script>