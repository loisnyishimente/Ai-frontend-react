class APIService {
    constructor() {
      this.baseUrl = "http://104.251.216.164/api/"
    }
  
    async analyzeSymptoms(note) {
      try {
        const response = await fetch(`${this.baseUrl}/analyze/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ note }),
        })
  
        if (!response.ok) {
          throw new Error(`API Error ${response.status}: ${response.statusText}`)
        }
  
        const result = await response.json()
        return result
      } catch (error) {
        console.error("API Error:", error)
        throw error
      }
    }
  }
  
  export default APIService
  