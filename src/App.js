"use client"

import { useState } from "react"
import Header from "./components/Header"
import Chat from "./components/Chat"
import SymptomsForm from "./components/SymptomsForm"
import AIAnalysisPanel from "./components/AIAnalysisPanel"
import LabResults from "./components/LabResult"
import { EmergencyModal } from "./components/Modal"
import LoadingOverlay from "./components/LoadingOverlay"
import Notification from "./components/Notification"
import APIService from "./services/apiService"
import './App.css'

function App() {
  const [currentTab, setCurrentTab] = useState("chat")
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    type: "info",
  })
  const [aiStatus, setAiStatus] = useState({
    status: "idle",
    text: "Ready for symptom analysis...",
  })
  const [analysisResult, setAnalysisResult] = useState(null)

  const apiService = new APIService()

  const showNotification = (message, type = "info") => {
    setNotification({
      isVisible: true,
      message,
      type,
    })
  }

  const hideNotification = () => {
    setNotification((prev) => ({
      ...prev,
      isVisible: false,
    }))
  }

  const handleSymptomAnalysis = async (note, formData) => {
    setIsLoading(true)
    setAiStatus({
      status: "analyzing",
      text: "Analyzing symptoms with medical database...",
    })

    try {
      const result = await apiService.analyzeSymptoms(note)
      setAnalysisResult(result)
      setAiStatus({
        status: "complete",
        text: "Analysis complete - Medical database consulted",
      })

      // Switch to chat tab and add messages
      setCurrentTab("chat")
      showNotification("Comprehensive symptom analysis completed!", "success")
    } catch (error) {
      setAiStatus({
        status: "error",
        text: "Unable to connect to medical database",
      })
      console.error("Analysis error:", error)
      showNotification(
        "Unable to connect to medical database. Please check your connection and try again.",
        "error"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header currentTab={currentTab} onTabChange={setCurrentTab} />

      <main className="py-8 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto px-5">
          {/* Chat Tab */}
          <div className={`${currentTab === "chat" ? "block animate-fade-in" : "hidden"}`}>
            <Chat
              onShowEmergency={() => setIsEmergencyModalOpen(true)}
              onShowNotification={showNotification}
            />
          </div>

          {/* Symptoms Tab */}
          <div className={`${currentTab === "symptoms" ? "block animate-fade-in" : "hidden"}`}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 max-w-7xl mx-auto">
              <SymptomsForm
                onAnalyze={handleSymptomAnalysis}
                onShowNotification={showNotification}
              />
              <AIAnalysisPanel
                status={aiStatus.status}
                statusText={aiStatus.text}
                analysisResult={analysisResult}
              />
            </div>
          </div>

          {/* ✅ Lab Results Tab */}
          <div className={`${currentTab === "lab" ? "block animate-fade-in" : "hidden"}`}>
            <LabResults onShowNotification={showNotification} />
          </div>
        </div>
      </main>

      {/* Modals and Overlays */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      <LoadingOverlay isVisible={isLoading} />

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  )
}

export default App
