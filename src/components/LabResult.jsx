import { useState, useEffect, useRef } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

import APIService from "../services/apiService"; 
import { getLabStatusColor, getCategoryIcon, formatDate } from "../utils/helpers";
import { FileText, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

const LabResults = ({ useDummyData = false, onResultsChange }) => {
  const [labResults, setLabResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const apiService = useRef(new APIService());

  const dummyData = [
    { id: 1, name: "Hemoglobin", value: 13.5, unit: "g/dL", reference_range: "12-16", status: "normal", category: "blood", date: new Date() },
    { id: 2, name: "WBC", value: 11.2, unit: "x10^3/uL", reference_range: "4-10", status: "high", category: "blood", date: new Date() },
    { id: 3, name: "Cholesterol", value: 250, unit: "mg/dL", reference_range: "<200", status: "critical", category: "lipid", date: new Date() },
    { id: 4, name: "Blood Sugar", value: 70, unit: "mg/dL", reference_range: "80-120", status: "low", category: "metabolic", date: new Date() },
  ];

  useEffect(() => {
    if (useDummyData) setLabResults(dummyData);
    else loadLabResultsFromAPI();
  }, [useDummyData]);

  useEffect(() => {
    if (onResultsChange) onResultsChange(labResults);
  }, [labResults, onResultsChange]);

  const loadLabResultsFromAPI = async () => {
    setIsLoading(true);
    try {
      const sessionId = localStorage.getItem("session_id");
      if (!sessionId) {
        setLabResults(dummyData);
        return;
      }
      const results = await apiService.current.getLabResults(sessionId);
      if (results?.lab_results) setLabResults(results.lab_results);
      else setLabResults(dummyData);
    } catch (error) {
      setLabResults(dummyData);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "normal": return <CheckCircle className="h-4 w-4" />;
      case "high": return <TrendingUp className="h-4 w-4" />;
      case "low": return <TrendingDown className="h-4 w-4" />;
      case "critical": return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const groupResultsByCategory = (results) =>
    results.reduce((groups, result) => {
      const category = result.category;
      if (!groups[category]) groups[category] = [];
      groups[category].push(result);
      return groups;
    }, {});

  const getCriticalResults = () =>
    labResults.filter((r) => ["critical", "high", "low"].includes(r.status));

  const groupedResults = groupResultsByCategory(labResults);
  const criticalResults = getCriticalResults();

  return (
    <Card className="medical-card p-6 h-fit sticky top-8 bg-gray-50 shadow-lg rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-full flex items-center justify-center shadow-md">
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">Lab Results</h3>
          <div className="text-sm text-gray-500">Your latest medical test results</div>
        </div>
      </div>

      {/* Critical Results Alert */}
      {criticalResults.length > 0 && (
        <Card className="p-4 mb-4 border border-red-200 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h4 className="font-semibold text-red-600">Attention Required</h4>
          </div>
          <p className="text-sm text-red-500 mb-2">
            {criticalResults.length} result(s) need attention
          </p>
          <div className="flex flex-wrap gap-1">
            {criticalResults.slice(0, 3).map((result) => (
              <Badge key={result.id} variant="destructive" className="text-xs">
                {result.name}
              </Badge>
            ))}
            {criticalResults.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{criticalResults.length - 3} more
              </Badge>
            )}
          </div>
        </Card>
      )}

      {/* Results by Category */}
      <div className="max-h-96 overflow-y-auto space-y-4">
        {Object.keys(groupedResults).length > 0 ? (
          Object.entries(groupedResults).map(([category, results]) => (
            <Card key={category} className="p-4 bg-white rounded-xl shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-lg">{getCategoryIcon(category)}</span>
                {category.charAt(0).toUpperCase() + category.slice(1)} Tests
                <Badge variant="outline" className="ml-auto">{results.length}</Badge>
              </h4>

              <div className="space-y-2">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-700">{result.name}</h5>
                      <Badge className={getLabStatusColor(result.status)}>
                        <span className="mr-1">{getStatusIcon(result.status)}</span>
                        {result.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Value:</span>
                        <span className="font-mono ml-2 text-gray-700">{result.value} {result.unit}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Reference:</span>
                        <span className="font-mono ml-2 text-gray-700">{result.reference_range}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-400">
                      Tested: {formatDate(result.date)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-400 italic p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">No lab results available</p>
          </div>
        )}
      </div>

  
    </Card>
  );
};

export default LabResults;
