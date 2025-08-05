const AIAnalysisPanel = ({ status, statusText, analysisResult }) => {
    const renderAnalysisResults = () => {
      if (!analysisResult) {
        return (
          <div className="text-center text-slate-600 italic p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <i className="fas fa-stethoscope text-4xl mb-4 opacity-50"></i>
            <p>Enter your symptoms above to receive AI-powered medical analysis from our comprehensive database.</p>
          </div>
        )
      }
  
      return (
        <div className="space-y-4">
          {analysisResult.session_id && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">📋 Session ID</h4>
              <div className="font-mono bg-slate-200 px-2 py-1 rounded text-xs text-slate-700">
                {analysisResult.session_id}
              </div>
            </div>
          )}
  
          {analysisResult.possible_diagnoses && analysisResult.possible_diagnoses.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">🩺 Possible Diagnoses</h4>
              <ul className="space-y-2">
                {analysisResult.possible_diagnoses.map((diagnosis, index) => (
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
  
          {analysisResult.explanation && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">📖 Medical Explanation</h4>
              <div className="text-gray-600 leading-relaxed bg-white p-4 rounded-lg border border-slate-200">
                {analysisResult.explanation}
              </div>
            </div>
          )}
  
          {(analysisResult.exam_name || analysisResult.exam_type) && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">🔍 Recommended Medical Examination</h4>
              {analysisResult.exam_name && (
                <p className="mb-2">
                  <strong>Examination:</strong> {analysisResult.exam_name}
                </p>
              )}
              {analysisResult.exam_type && (
                <p>
                  <strong>Type:</strong> {analysisResult.exam_type}
                </p>
              )}
            </div>
          )}
        </div>
      )
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
  
        <div className="max-h-96 overflow-y-auto">{renderAnalysisResults()}</div>
      </div>
    )
  }
  
  export default AIAnalysisPanel
  