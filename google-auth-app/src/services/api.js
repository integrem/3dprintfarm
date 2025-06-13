const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    const response = await fetch(url, config)
    
    // Handle empty responses for successful operations
    if (response.ok && response.status === 204) {
      return {} // Return empty object for no content responses
    }
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    // Check if response has content
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }
    
    return response.text()
  }

  // Printer endpoints
  async getAvailablePrinters(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    const endpoint = `/printers/available${queryParams ? `?${queryParams}` : ''}`
    return this.request(endpoint)
  }

  async registerPrinter(printerData) {
    return this.request('/printers/register', {
      method: 'POST',
      body: JSON.stringify(printerData)
    })
  }

  async deletePrinter(printerId) {
    return this.request(`/printers/${printerId}`, {
      method: 'DELETE'
    })
  }

  // Job endpoints
  async createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    })
  }

  async getJobs(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    const endpoint = `/jobs${queryParams ? `?${queryParams}` : ''}`
    return this.request(endpoint)
  }

  async assignJob(jobId, printerId) {
    return this.request(`/jobs/${jobId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ printerId })
    })
  }

  async createJobWithFile(formData, onProgress = null) {
  const url = `${API_BASE_URL}/jobs`
  
  // If progress tracking is needed, use XMLHttpRequest
  if (onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100)
          onProgress(percentComplete)
        }
      })
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch (e) {
            reject(new Error('Invalid response from server'))
          }
        } else {
          reject(new Error(`API Error: ${xhr.statusText}`))
        }
      })
      
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during file upload'))
      })
      
      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'))
      })
      
      xhr.open('POST', url)
      xhr.send(formData)
    })
  }
  
  // Fallback to fetch without progress
  const response = await fetch(url, {
    method: 'POST',
    body: formData
  })
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }
  
  return response.json()
}
}

export default new ApiService()