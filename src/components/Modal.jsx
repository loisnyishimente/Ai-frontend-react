"use client"

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">{children}</div>
    </div>
  )
}

export const EmergencyModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-red-600 text-white p-6 rounded-t-3xl">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <i className="fas fa-exclamation-triangle"></i>
          Emergency Information
        </h2>
      </div>
      <div className="p-6">
        <p className="font-bold mb-4">If this is a life-threatening emergency, call 911 immediately!</p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <div className="space-y-2">
            <div className="text-lg">
              <strong>Emergency Services:</strong> 911
            </div>
            <div className="text-lg">
              <strong>Poison Control:</strong> 1-800-222-1222
            </div>
            <div className="text-lg">
              <strong>Crisis Text Line:</strong> Text HOME to 741741
            </div>
            <div className="text-lg">
              <strong>National Suicide Prevention:</strong> 988
            </div>
          </div>
        </div>
        <p className="text-gray-600">
          For non-emergency urgent care, consider visiting your nearest urgent care center or contacting your primary
          care physician.
        </p>
      </div>
      <div className="p-6 flex gap-4 justify-end border-t border-slate-200">
        <button
          onClick={onClose}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
        >
          <i className="fas fa-times"></i>
          Close
        </button>
        <button
          onClick={() => window.open("tel:911")}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/40 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
        >
          <i className="fas fa-phone"></i>
          Call 911
        </button>
      </div>
    </Modal>
  )
}

export default Modal
