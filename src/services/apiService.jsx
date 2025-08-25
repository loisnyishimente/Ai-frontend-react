class APIService {
  constructor() {
    this.baseUrl = "http://104.251.216.164/api"
  }


  async analyzeSymptoms(note) {
    try {
      const response = await fetch(`${this.baseUrl}/analyze`, {
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


      if (result.session_id) {
        localStorage.setItem("session_id", result.session_id)
      }

      return result
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  async sendChatMessage(message) {
    try {
     
      const sessionId = localStorage.getItem("session_id")
      if (!sessionId) {
        throw new Error("No session_id found in localStorage. Run analyzeSymptoms first.")
      }

      const response = await fetch(`${this.baseUrl}/api/chat/${sessionId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error(`Chat API Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Chat API Error:", error)
      throw error
    }
  }
}

export default APIService
