const LoadingOverlay = ({ isVisible }) => {
    if (!isVisible) return null
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-3xl text-center shadow-2xl">
          <i className="fas fa-spinner fa-spin text-5xl text-blue-600 mb-4"></i>
          <p className="text-slate-600">Analyzing symptoms with AI...</p>
        </div>
      </div>
    )
  }
  
  export default LoadingOverlay
  