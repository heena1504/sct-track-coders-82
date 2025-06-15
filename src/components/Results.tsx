
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Target, AlertCircle } from "lucide-react";
import type { PredictionResult } from "@/pages/Index";

interface ResultsProps {
  result: PredictionResult | null;
  isLoading: boolean;
}

const Results = ({ result, isLoading }: ResultsProps) => {
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
          <p className="text-gray-500">
            Enter house details and click "Predict Price" to see results
          </p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
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
          {formatPrice(result.predictedPrice)}
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
              {formatPrice(result.predictedPrice * 0.9)} - {formatPrice(result.predictedPrice * 1.1)}
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

      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-gray-800 mb-2">Model Information</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Algorithm: Linear Regression</li>
            <li>• Features: Square footage, bedrooms, bathrooms</li>
            <li>• Training data: Historical house sales</li>
            <li>• Prediction method: Multiple linear regression</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
