"use client"

import { useState } from "react"
import { commonSymptoms } from "../utils/helpers"

const SymptomsForm = ({ onAnalyze, onShowNotification }) => {
  const [formData, setFormData] = useState({
    primarySymptom: "",
    symptomDescription: "",
    severity: 5,
    duration: "",
    additionalSymptoms: [],
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (symptom, checked) => {
    setFormData((prev) => ({
      ...prev,
      additionalSymptoms: checked
        ? [...prev.additionalSymptoms, symptom]
        : prev.additionalSymptoms.filter((s) => s !== symptom),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.primarySymptom || !formData.symptomDescription) {
      onShowNotification("Please fill in the required fields.", "error")
      return
    }

    // Create comprehensive note from form data
    let note = `Patient presents with primary symptom: ${formData.primarySymptom}.`

    if (formData.symptomDescription) {
      note += ` Detailed description: ${formData.symptomDescription}`
    }

    note += ` Severity level: ${formData.severity}/10 on pain scale.`

    if (formData.duration) {
      const durationText = {
        "less-than-hour": "less than 1 hour",
        "few-hours": "a few hours",
        "1-day": "1 day",
        "2-3-days": "2-3 days",
        "1-week": "about a week",
        "2-weeks": "2 weeks",
        "1-month": "about a month",
        longer: "longer than a month",
      }
      note += ` Duration of symptoms: ${durationText[formData.duration]}.`
    }

    if (formData.additionalSymptoms.length > 0) {
      note += ` Additional associated symptoms include: ${formData.additionalSymptoms.join(", ")}.`
    }

    note += ` Please provide comprehensive medical analysis including possible diagnoses, recommended examinations, and medical explanations based on the symptom profile.`

    onAnalyze(note, formData)
  }

  const clearForm = () => {
    if (window.confirm("Are you sure you want to clear all form data?")) {
      setFormData({
        primarySymptom: "",
        symptomDescription: "",
        severity: 5,
        duration: "",
        additionalSymptoms: [],
      })
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-600/10">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
        <i className="fas fa-clipboard-list text-blue-600"></i>
        Comprehensive Symptom Assessment
      </h2>
      <p className="text-slate-600 mb-8">
        Provide detailed information about your symptoms for accurate AI-powered medical analysis and recommendations
        from our database.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Primary Symptom Section */}
        <div className="pb-8 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">Primary Symptom</h3>

          <div className="space-y-6">
            <div>
              <label htmlFor="primarySymptom" className="block mb-2 font-medium text-gray-700">
                What is your main symptom? *
              </label>
              <input
                type="text"
                id="primarySymptom"
                name="primarySymptom"
                value={formData.primarySymptom}
                onChange={handleInputChange}
                placeholder="e.g., Severe headache, High fever, Chest pain, Memory loss..."
                className="w-full p-3 border-2 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 rounded-xl text-base transition-all duration-300 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="symptomDescription" className="block mb-2 font-medium text-gray-700">
                Detailed Description *
              </label>
              <textarea
                id="symptomDescription"
                name="symptomDescription"
                value={formData.symptomDescription}
                onChange={handleInputChange}
                rows="4"
                placeholder="Please describe your symptoms in detail: When did they start? What triggers them? How do they feel? Any patterns you've noticed? The more detail you provide, the more accurate the analysis will be."
                className="w-full p-3 border-2 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 rounded-xl text-base transition-all duration-300 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Symptom Characteristics */}
        <div className="pb-8 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">Symptom Characteristics</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Pain/Severity Level: <span className="font-bold text-blue-600">{formData.severity}</span>/10
              </label>
              <input
                type="range"
                name="severity"
                min="1"
                max="10"
                value={formData.severity}
                onChange={handleInputChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between mt-2 text-sm text-slate-600">
                <span>Mild (1)</span>
                <span>Moderate (5)</span>
                <span>Severe (10)</span>
              </div>
            </div>

            <div>
              <label htmlFor="duration" className="block mb-2 font-medium text-gray-700">
                How long have you had these symptoms?
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 rounded-xl text-base transition-all duration-300 focus:outline-none"
              >
                <option value="">Select duration</option>
                <option value="less-than-hour">Less than 1 hour</option>
                <option value="few-hours">A few hours</option>
                <option value="1-day">1 day</option>
                <option value="2-3-days">2-3 days</option>
                <option value="1-week">About a week</option>
                <option value="2-weeks">2 weeks</option>
                <option value="1-month">About a month</option>
                <option value="longer">Longer than a month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Symptoms */}
        <div className="pb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Additional Symptoms</h3>
          <p className="text-slate-600 mb-4">
            Select any additional symptoms you're experiencing to help improve diagnosis accuracy:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commonSymptoms.map((symptom) => (
              <div
                key={symptom}
                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                onClick={() => handleCheckboxChange(symptom, !formData.additionalSymptoms.includes(symptom))}
              >
                <input
                  type="checkbox"
                  checked={formData.additionalSymptoms.includes(symptom)}
                  onChange={(e) => handleCheckboxChange(symptom, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700 cursor-pointer">{symptom}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 justify-end pt-8 border-t border-slate-200">
          <button
            type="button"
            onClick={clearForm}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          >
            <i className="fas fa-trash"></i>
            Clear Form
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/40 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          >
            <i className="fas fa-search"></i>
            Get AI Analysis
          </button>
        </div>
      </form>
    </div>
  )
}

export default SymptomsForm
