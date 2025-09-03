"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import APIService from "../services/apiService"

import {
 
  Send,
  MessageCircle,

  Search,
} from "lucide-react"

const LabResults = ({ onResultsChange }) => {
  const apiService = useRef(new APIService())
  const [userMessage, setUserMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([])
  const [labResults, setLabResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [typingReply, setTypingReply] = useState("")

  useEffect(() => {
    if (onResultsChange) onResultsChange(labResults)
  }, [labResults, onResultsChange])

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return

    setIsLoading(true)
    const messageToSend = userMessage
    setChatHistory((prev) => [...prev, { message: messageToSend, reply: "" }])
    setUserMessage("")

    try {
      const response = await apiService.current.sendChatMessage(messageToSend)

      if (response.lab_results) {
        setLabResults(response.lab_results)
      }

      // Typing effect
      let i = 0
      const text = response.reply || "No response"
      setTypingReply("")
      const interval = setInterval(() => {
        setTypingReply((prev) => prev + text.charAt(i))
        i++
        if (i >= text.length) {
          clearInterval(interval)
          setChatHistory((prev) => {
            const updated = [...prev]
            updated[updated.length - 1].reply = text
            return updated
          })
          setTypingReply("")
        }
      }, 40) // speed (ms per character)
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="p-6 shadow-lg bg-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Lab Results</h2>
              <p className="text-slate-600">Ask questions about your lab results</p>
            </div>
          </div>

          {chatHistory.length > 0 && (
            <div className="mb-6 space-y-4 max-h-80 overflow-y-auto p-4 bg-slate-50 rounded-xl">
              {chatHistory.map((chat, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-md max-w-md shadow-sm">
                      <p className="text-sm">{chat.message}</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-md max-w-md shadow-sm">
                      <p className="text-sm text-slate-700">
                        {index === chatHistory.length - 1 && typingReply
                          ? typingReply
                          : chat.reply}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ask about your lab results, "
                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-slate-900 placeholder-slate-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage()
                }}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !userMessage.trim()}
              className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 rounded-xl shadow-sm"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LabResults
