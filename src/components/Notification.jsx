"use client"

import { useEffect } from "react"

const Notification = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case "success":
        return "check-circle"
      case "error":
        return "exclamation-circle"
      default:
        return "info-circle"
    }
  }

  const getColors = () => {
    switch (type) {
      case "success":
        return "border-l-emerald-500 bg-emerald-50 text-emerald-800"
      case "error":
        return "border-l-red-500 bg-red-50 text-red-800"
      default:
        return "border-l-blue-500 bg-blue-50 text-blue-800"
    }
  }

  return (
    <div
      className={`fixed top-5 right-5 z-50 min-w-80 bg-white rounded-xl shadow-lg border-l-4 p-4 flex items-center gap-3 animate-slide-in-right ${getColors()}`}
    >
      <div className="flex items-center gap-2 flex-1">
        <i className={`fas fa-${getIcon()}`}></i>
        <span className="font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
        <i className="fas fa-times"></i>
      </button>
    </div>
  )
}

export default Notification
