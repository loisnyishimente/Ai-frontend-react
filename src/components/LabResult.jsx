import { useState, useEffect, useRef } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import APIService from "../services/apiService";
import { getCategoryIcon } from "../utils/helpers";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Send,
  MessageCircle,
  Activity,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const LabResults = ({ onResultsChange }) => {
  const apiService = useRef(new APIService());
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  useEffect(() => {
    if (onResultsChange) onResultsChange(labResults);
  }, [labResults, onResultsChange]);

  const groupResultsByCategory = (results) =>
    results.reduce((groups, result) => {
      const category = result.category || "other";
      if (!groups[category]) groups[category] = [];
      groups[category].push(result);
      return groups;
    }, {});

  const getCriticalResults = () =>
    labResults.filter((r) => ["critical", "high", "low"].includes(r.status));

  const getStatusIcon = (status) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "high":
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case "low":
        return <TrendingDown className="h-4 w-4 text-blue-500" />;
      case "critical":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "normal":
        return "default";
      case "high":
        return "secondary";
      case "low":
        return "outline";
      case "critical":
        return "destructive";
      default:
        return "outline";
    }
  };

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setIsLoading(true);
    try {
      const response = await apiService.current.sendChatMessage(userMessage);

      setChatHistory((prev) => [
        ...prev,
        { message: userMessage, reply: response.reply },
      ]);

      if (response.lab_results) {
        setLabResults(response.lab_results);
      }

      setUserMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedResults = groupResultsByCategory(labResults);
  const criticalResults = getCriticalResults();

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-sm">
        <div className="flex items-center gap-4">
        
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Lab Results</h2>
            <p className="text-gray-600 mt-1">
              {labResults.length > 0
                ? `${labResults.length} results available`
                : "Ask me about your lab results"}
            </p>
          </div>
          {labResults.length > 0 && (
            <div className="text-right">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Last updated
              </div>
              <div className="text-sm font-medium text-gray-700">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Critical Results Alert */}
      {criticalResults.length > 0 && (
        <Card className="p-5 border-l-4 border-l-red-500 bg-red-50/50 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-800 mb-1">
                Attention Required
              </h4>
              <p className="text-red-700 text-sm mb-3">
                {criticalResults.length} result
                {criticalResults.length > 1 ? "s" : ""} need immediate attention
              </p>
              <div className="flex flex-wrap gap-2">
                {criticalResults.slice(0, 4).map((result) => (
                  <Badge
                    key={result.id}
                    variant="destructive"
                    className="text-xs font-medium"
                  >
                    {result.name}
                  </Badge>
                ))}
                {criticalResults.length > 4 && (
                  <Badge
                    variant="outline"
                    className="text-xs text-red-600 border-red-200"
                  >
                    +{criticalResults.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Lab Results Display */}
      {Object.keys(groupedResults).length > 0 && (
        <Card className="p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Results by Category
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllResults(!showAllResults)}
              className="text-xs"
            >
              {showAllResults ? "Show Less" : "Show All"}
            </Button>
          </div>

          <div className="space-y-4">
            {Object.entries(groupedResults).map(([category, results]) => (
              <div key={category} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      {getCategoryIcon
                        ? getCategoryIcon(category)
                        : <FileText className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900 capitalize">
                        {category}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {results.length} test{results.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  {expandedCategories.has(category) ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {expandedCategories.has(category) && (
                  <div className="p-4 space-y-3 bg-white">
                    {results
                      .slice(0, showAllResults ? results.length : 3)
                      .map((result) => (
                        <div
                          key={result.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getStatusIcon(result.status)}
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {result.name}
                              </h5>
                              <p className="text-sm text-gray-500">
                                {result.value} {result.unit}
                                {result.reference_range && (
                                  <span className="ml-2 text-xs">
                                    (Normal: {result.reference_range})
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={getStatusBadgeVariant(result.status)}
                            className="capitalize"
                          >
                            {result.status}
                          </Badge>
                        </div>
                      ))}
                    {!showAllResults && results.length > 3 && (
                      <button
                        onClick={() => setShowAllResults(true)}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-2"
                      >
                        Show {results.length - 3} more results
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Ask About Your Results
          </h3>
        </div>

        {/* Chat History */}
        {chatHistory.length > 0 && (
          <div className="mb-4 space-y-3 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-lg">
            {chatHistory.map((chat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg rounded-br-sm max-w-xs">
                    <p className="text-sm">{chat.message}</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white border px-4 py-2 rounded-lg rounded-bl-sm max-w-xs shadow-sm">
                    <p className="text-sm text-gray-700">{chat.reply}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Ask about your lab results..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !userMessage.trim()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LabResults;
