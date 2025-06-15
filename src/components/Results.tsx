
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Target, AlertCircle, MessageCircle, X } from "lucide-react";
import type { PredictionResult } from "@/pages/Index";

interface ResultsProps {
  result: PredictionResult | null;
  isLoading: boolean;
}

const Results = ({ result, isLoading }: ResultsProps) => {
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");

  const handleAssistantSubmit = () => {
    // Simple AI assistant responses based on common queries
    const responses = {
      "accuracy": "The model accuracy is based on the R-squared value. Higher values (closer to 1) indicate better predictions. Our model analyzes square footage, bedrooms, and bathrooms to estimate prices.",
      "features": "The model considers three main features: Square footage (most important factor), Number of bedrooms, and Number of bathrooms. Larger homes with more rooms typically have higher prices.",
      "range": "The estimated range shows a ±10% variation from the predicted price. This accounts for market fluctuations and individual property characteristics.",
      "improve": "To get better predictions, ensure you enter accurate measurements. The model works best for typical residential properties between 500-10,000 sq ft.",
      "market": "Prices are estimates based on general market trends. Actual prices may vary based on location, condition, amenities, and current market conditions."
    };

    const message = assistantMessage.toLowerCase();
    let response = "I can help you understand house price predictions! Ask me about accuracy, features, price ranges, or how to improve predictions.";

    for (const [key, value] of Object.entries(responses)) {
      if (message.includes(key)) {
        response = value;
        break;
      }
    }

    setAssistantResponse(response);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing house data...</p>
          <p className="text-sm text-gray-500 mt-2">Running linear regression model</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No Prediction Yet
          </h3>
          <p className="text-gray-500 mb-4">
            Enter house details and click "Predict Price" to see results
          </p>
          <Button 
            onClick={() => setShowAssistant(true)}
            variant="outline"
            className="mt-2"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Need Help?
          </Button>
        </div>
      </div>
    );
  }

  const formatPriceInRupees = (price: number) => {
    // Convert USD to INR (approximate rate: 1 USD = 83 INR)
    const priceInRupees = price * 83;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceInRupees);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800 border-green-200";
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return "High Confidence";
    if (confidence >= 0.6) return "Medium Confidence";
    return "Low Confidence";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-4">
          <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">Predicted Price</h3>
        </div>
        
        <div className="text-4xl font-bold text-indigo-600 mb-2">
          {formatPriceInRupees(result.predictedPrice)}
        </div>
        
        <Badge className={`${getConfidenceColor(result.confidence)} px-3 py-1`}>
          <Target className="w-3 h-3 mr-1" />
          {getConfidenceText(result.confidence)} ({(result.confidence * 100).toFixed(1)}%)
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4 text-center">
            <div className="text-green-600 font-semibold mb-1">Estimated Range</div>
            <div className="text-sm text-green-700">
              {formatPriceInRupees(result.predictedPrice * 0.9)} - {formatPriceInRupees(result.predictedPrice * 1.1)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-4 text-center">
            <div className="text-blue-600 font-semibold mb-1">Model Accuracy</div>
            <div className="text-sm text-blue-700 flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {(result.confidence * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={() => setShowAssistant(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Ask AI Assistant
        </Button>
      </div>

      {showAssistant && (
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-purple-800 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                AI Assistant
              </h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAssistant(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Ask about accuracy, features, price ranges, or improvements..."
                  value={assistantMessage}
                  onChange={(e) => setAssistantMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAssistantSubmit()}
                />
              </div>
              
              <Button 
                onClick={handleAssistantSubmit}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={!assistantMessage.trim()}
              >
                Ask Assistant
              </Button>
              
              {assistantResponse && (
                <div className="bg-white p-3 rounded-md border border-purple-200">
                  <p className="text-sm text-gray-700">{assistantResponse}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-gray-800 mb-2">Model Information</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Algorithm: Linear Regression</li>
            <li>• Features: Square footage, bedrooms, bathrooms</li>
            <li>• Currency: Indian Rupees (INR)</li>
            <li>• Conversion Rate: ~83 INR per USD</li>
            <li>• Prediction method: Multiple linear regression</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
