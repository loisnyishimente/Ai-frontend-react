"use client"

const Header = ({ currentTab, onTabChange }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 shadow-lg shadow-blue-600/30">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center text-2xl font-bold">
            <span>MEDISOFT AI</span>
          </div>

          <nav className="flex gap-4 flex-wrap">
            <button
              className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 text-sm font-medium ${
                currentTab === "chat"
                  ? "bg-white/30 shadow-lg shadow-blue-600/30"
                  : "bg-white/10 hover:bg-white/20 hover:-translate-y-0.5"
              }`}
              onClick={() => onTabChange("chat")}
            >
              <i className="fas fa-comments"></i>
              Chat
            </button>
            <button
              className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 text-sm font-medium ${
                currentTab === "symptoms"
                  ? "bg-white/30 shadow-lg shadow-blue-600/30"
                  : "bg-white/10 hover:bg-white/20 hover:-translate-y-0.5"
              }`}
              onClick={() => onTabChange("symptoms")}
            >
              <i className="fas fa-clipboard-list"></i>
              Symptoms
            </button>
          </nav>

          <div className="flex items-center gap-4 bg-white/10 rounded-full px-4 py-2 text-sm">
            <i className="fas fa-stethoscope"></i>
            <span>AI Medical Assistant</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
