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
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
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
}

export default new ApiService()