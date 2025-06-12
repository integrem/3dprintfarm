import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const usePrintersStore = defineStore('printers', () => {
  const printers = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchPrinters(filters = {}) {
    loading.value = true
    error.value = null
    
    try {
      const data = await api.getAvailablePrinters(filters)
      printers.value = data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch printers:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchUserPrinters(userEmail) {
    loading.value = true
    error.value = null
    
    try {
      const data = await api.getAvailablePrinters()
      printers.value = data.filter(printer => printer.owner === userEmail)
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch printers:', err)
    } finally {
      loading.value = false
    }
  }

  async function addPrinter(printerData) {
    loading.value = true
    error.value = null
    
    try {
      const newPrinter = await api.registerPrinter(printerData)
      printers.value.push(newPrinter)
      return newPrinter
    } catch (err) {
      error.value = err.message
      console.error('Failed to register printer:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // ADD THIS FUNCTION
  async function deletePrinter(printerId) {
    loading.value = true
    error.value = null
    
    try {
      await api.deletePrinter(printerId)
      // Remove the printer from the local state
      printers.value = printers.value.filter(printer => 
        (printer._id || printer.id) !== printerId
      )
    } catch (err) {
      error.value = err.message
      console.error('Failed to delete printer:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // MAKE SURE deletePrinter IS IN THE RETURN STATEMENT
  return {
    printers,
    loading,
    error,
    fetchPrinters,
    fetchUserPrinters,
    addPrinter,
    deletePrinter  // <-- ADD THIS LINE
  }
})