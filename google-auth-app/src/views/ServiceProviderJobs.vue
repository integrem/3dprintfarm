<!-- frontend/src/views/ServiceProviderJobs.vue -->
<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">My Print Jobs</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm">Total Jobs</h3>
        <p class="text-2xl font-bold">{{ stats.totalJobs }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm">Assigned</h3>
        <p class="text-2xl font-bold text-blue-600">
          {{ getStatusCount('assigned') }}
        </p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm">Printing</h3>
        <p class="text-2xl font-bold text-yellow-600">
          {{ getStatusCount('printing') }}
        </p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm">Completed</h3>
        <p class="text-2xl font-bold text-green-600">
          {{ getStatusCount('completed') }}
        </p>
      </div>
    </div>

    <!-- Jobs Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Job ID
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              File
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Printer
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Material/Color
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="job in jobs" :key="job._id">
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              {{ job._id.substring(0, 8) }}...
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              {{ job.clientName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              {{ job.fileName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              {{ job.printer?.name || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              {{ job.material }} / {{ job.color }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(job.status)">
                {{ job.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button
                @click="updateJobStatus(job)"
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                Update Status
              </button>
              <a
                :href="`http://localhost:3000${job.fileUrl}`"
                target="_blank"
                class="text-blue-600 hover:text-blue-900"
              >
                Download
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Status Update Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-semibold mb-4">Update Job Status</h3>
        <select
          v-model="selectedStatus"
          class="w-full p-2 border rounded mb-4"
        >
          <option value="assigned">Assigned</option>
          <option value="printing">Printing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div class="flex justify-end space-x-2">
          <button
            @click="showStatusModal = false"
            class="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            @click="confirmStatusUpdate"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const jobs = ref([]);
const stats = ref({ totalJobs: 0, statusBreakdown: [] });
const showStatusModal = ref(false);
const selectedJob = ref(null);
const selectedStatus = ref('');

const fetchJobs = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/jobs/provider-jobs', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    jobs.value = response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }
};

const fetchStats = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/jobs/provider-stats', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    stats.value = response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};

const getStatusCount = (status) => {
  const stat = stats.value.statusBreakdown.find(s => s._id === status);
  return stat ? stat.count : 0;
};

const getStatusClass = (status) => {
  const classes = {
    assigned: 'px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800',
    printing: 'px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800',
    completed: 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800',
    failed: 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800',
    cancelled: 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'
  };
  return classes[status] || classes.assigned;
};

const updateJobStatus = (job) => {
  selectedJob.value = job;
  selectedStatus.value = job.status;
  showStatusModal.value = true;
};

const confirmStatusUpdate = async () => {
  try {
    await axios.patch(
      `http://localhost:3000/api/jobs/${selectedJob.value._id}/status`,
      { status: selectedStatus.value },
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    );
    showStatusModal.value = false;
    fetchJobs();
    fetchStats();
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

onMounted(() => {
  fetchJobs();
  fetchStats();
});
</script>