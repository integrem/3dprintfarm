<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative">
    <!-- Delete button -->
    <div class="absolute top-4 right-4">
      <button
        @click="$emit('delete', printer)"
        class="text-gray-400 hover:text-red-600 transition-colors"
        title="Delete printer"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
    
    <div class="flex justify-between items-start mb-4">
      <h3 class="text-lg font-semibold text-gray-900 pr-8">{{ printer.model }}</h3>
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
        <span>{{ printer.location?.city }}, {{ printer.location?.suburb }}</span>
      </div>
      
      <div class="flex items-center text-sm text-gray-600">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Last seen: {{ formatDate(printer.lastSeen) }}</span>
      </div>
      
      <div class="flex items-center text-sm text-gray-600">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        <span>IP: {{ printer.ip }}</span>
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

defineEmits(['delete'])

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