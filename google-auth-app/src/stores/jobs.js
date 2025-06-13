import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useJobsStore = defineStore('jobs', () => {
  const jobs = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function createJob(jobData) {
    loading.value = true
    error.value = null
    
    try {
      const newJob = await api.createJob(jobData)
      jobs.value.push(newJob)
      return newJob
    } catch (err) {
      error.value = err.message
      console.error('Failed to create job:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Add this new function for file uploads
  async function createJobWithFile(formData, onProgress = null) {
    loading.value = true
    error.value = null
    
    try {
      const newJob = await api.createJobWithFile(formData, onProgress)
      jobs.value.push(newJob)
      return newJob
    } catch (err) {
      error.value = err.message
      console.error('Failed to create job with file:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchJobs(filters = {}) {
    loading.value = true
    error.value = null
    
    try {
      const data = await api.getJobs(filters)
      jobs.value = data
    } catch (err) {
      // If the endpoint doesn't exist yet, just return empty array
      if (err.message.includes('Not Found')) {
        console.warn('Jobs endpoint not found, returning empty array')
        jobs.value = []
      } else {
        error.value = err.message
        console.error('Failed to fetch jobs:', err)
      }
    } finally {
      loading.value = false
    }
  }

  async function assignJobToPrinter(jobId, printerId) {
    loading.value = true
    error.value = null
    
    try {
      const result = await api.assignJob(jobId, printerId)
      // Update the job in the local state if needed
      const jobIndex = jobs.value.findIndex(job => job._id === jobId || job.id === jobId)
      if (jobIndex !== -1) {
        jobs.value[jobIndex] = { ...jobs.value[jobIndex], ...result }
      }
      return result
    } catch (err) {
      error.value = err.message
      console.error('Failed to assign job:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    jobs,
    loading,
    error,
    createJob,
    createJobWithFile,  // Make sure this is exported
    fetchJobs,
    assignJobToPrinter
  }
})