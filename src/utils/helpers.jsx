
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Merge Tailwind + conditional classes
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatTime = (date) => {

    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
  
  export const formatApiResponse = (result) => {
    let response = `Medical Analysis Complete\n\n`
  
  
  
    if (result.possible_diagnoses && result.possible_diagnoses.length > 0) {
      response += `Possible Diagnoses:\n`
      result.possible_diagnoses.forEach((diagnosis, index) => {
        response += `${index + 1}. ${diagnosis}\n`
      })
      response += `\n`
    }
  
    if (result.explanation) {
      response += `📖 Medical Explanation:\n${result.explanation}\n\n`
    }
  
    if (result.exam_name) {
      response += `🔍  Recommended Examination: ${result.exam_name}\n`
    }
  
    if (result.exam_type) {
      response += `📊 Examination Type: ${result.exam_type}\n\n`
    }
  
    response += `⚠️ Important Medical Disclaimer:\nThis AI analysis is based on medical databases and provides general information only. It cannot replace professional medical advice, diagnosis, or treatment. If your symptoms are severe, persistent, or concerning, please consult with a qualified healthcare professional immediately. In case of emergency, call 911.`
  
    return response
  }
  
  export const commonSymptoms = [
    "Headache",
    "Migraine",
    "Fever",
    "Chills",
    "Cough",
    "Sore throat",
    "Runny nose",
    "Congestion",
    "Fatigue",
    "Weakness",
    "Nausea",
    "Vomiting",
    "Diarrhea",
    "Constipation",
    "Abdominal pain",
    "Chest pain",
    "Shortness of breath",
    "Dizziness",
    "Lightheadedness",
    "Joint pain",
    "Muscle aches",
    "Back pain",
    "Neck pain",
    "Swelling",
    "Numbness",
    "Tingling",
    "Skin rash",
    "Itching",
    "Loss of appetite",
    "Weight loss",
    "Weight gain",
    "Insomnia",
    "Excessive sleepiness",
    "Memory problems",
    "Confusion",
    "Anxiety",
    "Depression",
    "Mood changes",
    "Vision problems",
    "Hearing problems",
    "Tinnitus",
    "Hair loss",
    "Excessive thirst",
    "Frequent urination",
    "Irregular heartbeat",
    "High blood pressure",
    "Low blood pressure",
    "Sweating",
    "Hot flashes",
    "Cold intolerance",
  ]
  
  export function getCategoryIcon(category) {
    const icons = {
      hematology: "🧬",
      biochemistry: "🧪",
      microbiology: "🦠",
      immunology: "🛡️",
      default: "📄",
    };
    return icons[category?.toLowerCase()] || icons.default;
  }
  
  export function getLabStatusColor(status) {
    const colors = {
      pending: "yellow",
      completed: "green",
      abnormal: "red",
      processing: "blue",
    };
    return colors[status?.toLowerCase()] || "gray";
  }
  
  export function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  
  const formatSymptomsForAI = (rawSymptoms) => {
    if (!rawSymptoms) return ""
    // Split by comma or semicolon
    const symptomsArray = rawSymptoms
      .split(/[,;]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  
    if (symptomsArray.length === 0) return ""
  
    // Join into a readable sentence
    return `Patient reports the following symptoms: ${symptomsArray.join(
      ", "
    )}. Please analyze and provide a medical explanation.`
  }
  