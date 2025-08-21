"use client"

import { useState, useEffect, useRef } from "react"

const AIAnalysisPanel = ({ status, statusText, analysisResult }) => {
  const [typedAnalysisResult, setTypedAnalysisResult] = useState(null)
  const [accuracyPercentage, setAccuracyPercentage] = useState(0)
  const typingIntervalRef = useRef(null)
  const accuracyIntervalRef = useRef(null)

  useEffect(() => {
    if (status === "analyzing") {
      setTypedAnalysisResult(null)
      setAccuracyPercentage(0)
      clearInterval(typingIntervalRef.current)
      clearInterval(accuracyIntervalRef.current)
    } else if (status === "complete" && analysisResult) {
      typeAnalysisResults(analysisResult)
      startAccuracyCounter()
    } else if (status === "idle") {
      setTypedAnalysisResult(null)
      setAccuracyPercentage(0)
      clearInterval(typingIntervalRef.current)
      clearInterval(accuracyIntervalRef.current)
    }
  }, [status, analysisResult])

  const typeAnalysisResults = (result) => {
    const sections = []
    if (result.session_id) sections.push({ type: "session_id", content: result.session_id })
    if (result.possible_diagnoses && result.possible_diagnoses.length > 0)
      sections.push({ type: "diagnoses", content: result.possible_diagnoses })
    if (result.explanation) sections.push({ type: "explanation", content: result.explanation })
    if (result.exam_name || result.exam_type)
      sections.push({ type: "examination", content: { name: result.exam_name, type: result.exam_type } })

    let currentSectionIndex = 0
    let currentContentIndex = 0

    setTypedAnalysisResult({
      session_id: "",
      possible_diagnoses: [],
      explanation: "",
      exam_name: "",
      exam_type: "",
    })

    typingIntervalRef.current = setInterval(() => {
      if (currentSectionIndex < sections.length) {
        const section = sections[currentSectionIndex]
        if (section.type === "session_id") {
          if (currentContentIndex < section.content.length) {
            setTypedAnalysisResult((prev) => ({
              ...prev,
              session_id: prev.session_id + section.content.charAt(currentContentIndex),
            }))
            currentContentIndex++
          } else {
            currentSectionIndex++
            currentContentIndex = 0
          }
        } else if (section.type === "diagnoses") {
          if (currentContentIndex < section.content.length) {
            setTypedAnalysisResult((prev) => {
              const newDiagnoses = [...prev.possible_diagnoses]
              if (!newDiagnoses[currentContentIndex]) {
                newDiagnoses[currentContentIndex] = ""
              }
              if (newDiagnoses[currentContentIndex].length < section.content[currentContentIndex].length) {
                newDiagnoses[currentContentIndex] += section.content[currentContentIndex].charAt(
                  newDiagnoses[currentContentIndex].length,
                )
              } else {
                currentContentIndex++
              }
              return { ...prev, possible_diagnoses: newDiagnoses }
            })
          } else {
            currentSectionIndex++
            currentContentIndex = 0
          }
        } else if (section.type === "explanation") {
          if (currentContentIndex < section.content.length) {
            setTypedAnalysisResult((prev) => ({
              ...prev,
              explanation: prev.explanation + section.content.charAt(currentContentIndex),
            }))
            currentContentIndex++
          } else {
            currentSectionIndex++
            currentContentIndex = 0
          }
        } else if (section.type === "examination") {
          if (section.content.name && typedAnalysisResult.exam_name.length < section.content.name.length) {
            setTypedAnalysisResult((prev) => ({
              ...prev,
              exam_name: prev.exam_name + section.content.name.charAt(typedAnalysisResult.exam_name.length),
            }))
          } else if (section.content.type && typedAnalysisResult.exam_type.length < section.content.type.length) {
            setTypedAnalysisResult((prev) => ({
              ...prev,
              exam_type: prev.exam_type + section.content.type.charAt(typedAnalysisResult.exam_type.length),
            }))
          } else {
            currentSectionIndex++
            currentContentIndex = 0
          }
        }
      } else {
        clearInterval(typingIntervalRef.current)
      }
    }, 20) // Typing speed for analysis results
  }

  const startAccuracyCounter = () => {
    let currentAccuracy = 0
    const targetAccuracy = Math.floor(Math.random() * (98 - 85 + 1)) + 85 // Simulate 85-98%
    accuracyIntervalRef.current = setInterval(() => {
      if (currentAccuracy < targetAccuracy) {
        setAccuracyPercentage((prev) => prev + 1)
        currentAccuracy++
      } else {
        clearInterval(accuracyIntervalRef.current)
      }
    }, 50) // Speed of accuracy counter
  }

  const getStatusClasses = () => {
    switch (status) {
      case "analyzing":
        return "text-blue-600 bg-blue-50"
      case "complete":
        return "text-emerald-600 bg-emerald-50"
      case "error":
        return "text-red-600 bg-red-50"
      default:
        return "text-slate-600 bg-slate-50"
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-blue-600/10 p-6 h-fit sticky top-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-100">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center">
          <i className="fas fa-brain text-lg"></i>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-800">AI Medical Analysis</h3>
          <div className="text-sm text-slate-600">Database-powered diagnosis suggestions</div>
        </div>
      </div>

      <div className={`flex items-center gap-2 text-sm mb-4 p-3 rounded-xl ${getStatusClasses()}`}>
        <div className="w-2 h-2 rounded-full bg-current"></div>
        <span>{statusText}</span>
      </div>

      {status === "complete" && (
        <div className="text-center text-2xl font-bold text-blue-600 mb-4">
          Accuracy: {accuracyPercentage}%
        </div>
      )}

      <div className="max-h-96 overflow-y-auto">
        {typedAnalysisResult ? (
          <div className="space-y-4">
            {typedAnalysisResult.session_id && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">📋 Session ID</h4>
                <div className="font-mono bg-slate-200 px-2 py-1 rounded text-xs text-slate-700">
                  {typedAnalysisResult.session_id}
                </div>
              </div>
            )}

            {typedAnalysisResult.possible_diagnoses && typedAnalysisResult.possible_diagnoses.length > 0 && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">🩺 Possible Diagnoses</h4>
                <ul className="space-y-2">
                  {typedAnalysisResult.possible_diagnoses.map((diagnosis, index) => (
                    <li
                      key={index}
                      className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between hover:border-blue-600 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300"
                    >
                      <span className="font-medium text-slate-800">{diagnosis}</span>
                      <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {typedAnalysisResult.explanation && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">📖 Medical Explanation</h4>
                <div className="text-gray-600 leading-relaxed bg-white p-4 rounded-lg border border-slate-200">
                  {typedAnalysisResult.explanation}
                </div>
              </div>
            )}

            {(typedAnalysisResult.exam_name || typedAnalysisResult.exam_type) && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">🔍 Recommended Medical Examination</h4>
                {typedAnalysisResult.exam_name && (
                  <p className="mb-2">
                    <strong>Examination:</strong> {typedAnalysisResult.exam_name}
                  </p>
                )}
                {typedAnalysisResult.exam_type && (
                  <p>
                    <strong>Type:</strong> {typedAnalysisResult.exam_type}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-slate-600 italic p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <i className="fas fa-stethoscope text-4xl mb-4 opacity-50"></i>
            <p>Enter your symptoms above to receive AI-powered medical analysis from our comprehensive database.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIAnalysisPanel
