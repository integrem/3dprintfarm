<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900">{{ printer.model }}</h3>
        <p class="text-sm text-gray-600 mt-1">Owner: {{ printer.owner }}</p>
      </div>
      <span 
        :class="statusClasses"
        class="px-2 py-1 text-xs font-medium rounded-full"
      >
        {{ printer.status }}
      </span>
    </div>
    
    <div class="space-y-2">
      <div class="flex items-center text-sm text-gray-600">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{{ printer.location?.city }}{{ printer.location?.suburb ? `, ${printer.location.suburb}` : '' }}</span>
      </div>
      
      <div class="flex items-center text-sm text-gray-600">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Last seen: {{ formatDate(printer.lastSeen) }}</span>
      </div>
    </div>
    
    <div v-if="printer.capabilities?.length" class="mt-4">
      <h4 class="text-sm font-medium text-gray-700 mb-2">Capabilities:</h4>
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="capability in printer.capabilities" 
          :key="capability"
          class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
        >
          {{ capability }}
        </span>
      </div>
    </div>

    <div class="mt-6">
      <button
        @click="$emit('select', printer)"
        :disabled="printer.status !== 'online'"
        class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {{ printer.status === 'online' ? 'Select Printer' : 'Unavailable' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  printer: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])

const statusClasses = computed(() => {
  const statusMap = {
    'online': 'bg-green-100 text-green-800',
    'offline': 'bg-red-100 text-red-800',
    'busy': 'bg-yellow-100 text-yellow-800',
    'maintenance': 'bg-gray-100 text-gray-800'
  }
  return statusMap[props.printer.status] || 'bg-gray-100 text-gray-800'
})

const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} mins ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
  return date.toLocaleDateString()
}
</script>