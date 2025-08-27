"use client"

import { useState, useEffect, useRef } from "react"
import APIService from "../services/apiService"
import { formatTime, formatApiResponse } from "../utils/helpers"

const Chat = ({ onShowEmergency, onShowNotification }) => {
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [currentAssistantMessageContent, setCurrentAssistantMessageContent] = useState("")
  const messagesEndRef = useRef(null)
  const apiService = useRef(new APIService())
  const typingIntervalRef = useRef(null)

  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      role: "assistant",
      content:
        "Hello! I'm your AI medical assistant powered by a comprehensive medical database. I can analyze your symptoms and provide evidence-based medical insights. Please describe your symptoms in detail for the most accurate analysis. How can I help you today?",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, currentAssistantMessageContent])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const typeMessage = (fullContent) => {
    let i = 0
    setCurrentAssistantMessageContent("")
    setIsThinking(false)
    setIsTyping(true)

    typingIntervalRef.current = setInterval(() => {
      if (i < fullContent.length) {
        setCurrentAssistantMessageContent((prev) => prev + fullContent.charAt(i))
        i++
      } else {
        clearInterval(typingIntervalRef.current)
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: fullContent,
            timestamp: new Date(),
          },
        ])
        setCurrentAssistantMessageContent("")
      }
    }, 30)
  }

  const sendMessage = async () => {
    const message = messageInput.trim()
    if (!message || isTyping || isThinking) return

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessageInput("")
    setIsThinking(true)
    setCurrentAssistantMessageContent("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      const result = await apiService.current.analyzeSymptoms(message)
      const fullAssistantContent = formatApiResponse(result)
      typeMessage(fullAssistantContent)
      onShowNotification("Analysis completed successfully!", "success")
    } catch (error) {
      clearInterval(typingIntervalRef.current)
      setIsThinking(false)
      setIsTyping(false)
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: `I apologize, but I'm currently unable to connect to the medical database. Please check your internet connection and try again. Error: ${error.message}\n\nFor immediate medical concerns, please contact your healthcare provider or emergency services.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      onShowNotification("Unable to connect to medical database. Please try again.", "error")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleQuickAction = (message, isEmergency = false) => {
    if (isEmergency) {
      onShowEmergency()
    } else {
      setMessageInput(message)
      setTimeout(() => sendMessage(), 100)
    }
  }

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      clearInterval(typingIntervalRef.current)
      setIsTyping(false)
      setIsThinking(false)
      setCurrentAssistantMessageContent("")
      const welcomeMessage = {
        id: Date.now(),
        role: "assistant",
        content:
          "Hello! I'm your AI medical assistant powered by a comprehensive medical database. I can analyze your symptoms and provide evidence-based medical insights. Please describe your symptoms in detail for the most accurate analysis. How can I help you today?",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }

  const exportChat = () => {
    const chatData = {
      timestamp: new Date().toISOString(),
      messages: messages,
      export_type: "medical_consultation",
    }

    const dataStr = JSON.stringify(chatData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(dataBlob)
    link.download = `medical-consultation-${new Date().toISOString().split("T")[0]}.json`
    link.click()
  }

  const startVoiceInput = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setMessageInput(transcript)
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        onShowNotification("Voice input failed. Please try again or type your message.", "error")
      }

      recognition.start()
    } else {
      onShowNotification("Voice input is not supported in your browser.", "error")
    }
  }

  const attachFile = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*,.pdf,.doc,.docx,.txt"

    input.onchange = (event) => {
      const file = event.target.files[0]
      if (file) {
        const userMessage = {
          id: Date.now(),
          role: "user",
          content: `📎 Medical file attached: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
          timestamp: new Date(),
        }

        const assistantMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "I can see you've attached a medical file. While I can't directly analyze files yet, please describe the contents or any relevant information from the file, and I'll provide medical analysis based on that information using our medical database.",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage, assistantMessage])
      }
    }

    input.click()
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-blue-600/10 overflow-hidden h-[80vh] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Dr. AI Assistant</h3>
            <div className="text-sm opacity-80 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              Ready to help
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearChat}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            title="Clear Chat"
          >
            <i className="fas fa-trash"></i>
          </button>
          <button
            onClick={exportChat}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            title="Export Chat"
          >
            <i className="fas fa-download"></i>
          </button>
        </div>
      </div>

      {/* Chat body */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex mb-6 animate-slide-in ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === "user"
                  ? "ml-4 bg-slate-200 text-slate-600"
                  : "mr-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white"
              }`}
            >
              <i className={`fas fa-${message.role === "assistant" ? "robot" : "user"}`}></i>
            </div>
            <div className={`flex-1 max-w-[70%] ${message.role === "user" ? "text-right" : ""}`}>
              <div
                className={`p-4 rounded-2xl shadow-sm border mb-2 whitespace-pre-wrap ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-transparent"
                    : "bg-white text-gray-800 border-slate-200"
                }`}
              >
                {message.content}
              </div>
              <div className="text-xs text-slate-500 opacity-70">{formatTime(message.timestamp)}</div>
            </div>
          </div>
        ))}

        {/* Thinking */}
        {isThinking && (
          <div className="flex mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <i className="fas fa-brain animate-pulse"></i>
            </div>
            <div className="flex-1 max-w-[70%]">
              <div className="p-4 rounded-2xl shadow-sm border bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  </div>
                  <span className="text-sm text-blue-700 font-medium">Analyzing your symptoms...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Typing */}
        {isTyping && (
          <div className="flex mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <i className="fas fa-robot"></i>
            </div>
            <div className="flex-1 max-w-[70%]">
              <div className="p-4 rounded-2xl shadow-sm border bg-white text-gray-800 border-slate-200">
                <div className="whitespace-pre-wrap">
                  {currentAssistantMessageContent}
                  <span className="inline-block w-2 h-5 bg-blue-600 ml-1 animate-pulse"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer */}
      <div className="p-6 bg-white border-t border-slate-200">
        {/* Quick actions */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => handleQuickAction("I have a severe headache with nausea and sensitivity to light")}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-600 flex items-center gap-2"
          >
            <i className="fas fa-head-side-cough text-blue-600"></i>
            Headache
          </button>
          <button
            onClick={() =>
              handleQuickAction("I'm experiencing extreme fatigue, memory problems, and difficulty concentrating")
            }
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-600 flex items-center gap-2"
          >
            <i className="fas fa-bed text-blue-600"></i>
            Fatigue & Memory
          </button>
          <button
            onClick={() => handleQuickAction("I have a high fever with chills, body aches, and weakness")}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-600 flex items-center gap-2"
          >
            <i className="fas fa-thermometer-half text-blue-600"></i>
            Fever
          </button>
          <button
            onClick={() => handleQuickAction("I have chest pain, shortness of breath, and dizziness")}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-600 flex items-center gap-2"
          >
            <i className="fas fa-heart text-blue-600"></i>
            Chest Pain
          </button>
          <button
            className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-600 rounded-full text-sm transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 text-red-600"
            onClick={() => handleQuickAction("", true)}
          >
            <i className="fas fa-exclamation-triangle text-red-600"></i>
            Emergency
          </button>
        </div>

        {/* Input area */}
        <div className="flex gap-4 items-end mb-4">
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your symptoms in detail for accurate analysis..."
            className="flex-1 border-2 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 rounded-2xl p-4 resize-none font-inherit text-base transition-all duration-300 max-h-32 min-h-[50px] focus:outline-none"
            rows="1"
          />
          <button
            onClick={sendMessage}
            disabled={!messageInput.trim() || isTyping || isThinking}
            className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-110 hover:shadow-lg hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-white rounded-full flex items-center justify-center transition-all duration-300"
          >
            <i className={`fas fa-${isThinking ? "brain" : isTyping ? "hourglass-half" : "paper-plane"}`}></i>
          </button>
        </div>

        {/* Extra controls */}
        <div className="flex gap-4">
          <button
            onClick={startVoiceInput}
            className="px-4 py-2 border border-slate-200 hover:border-blue-600 hover:text-blue-600 rounded-xl text-sm transition-all duration-300 flex items-center gap-2 text-slate-600"
          >
            <i className="fas fa-microphone"></i>
            Voice Input
          </button>
          <button
            onClick={attachFile}
            className="px-4 py-2 border border-slate-200 hover:border-blue-600 hover:text-blue-600 rounded-xl text-sm transition-all duration-300 flex items-center gap-2 text-slate-600"
          >
            <i className="fas fa-paperclip"></i>
            Attach File
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
