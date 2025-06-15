
import { useState } from "react";
import PredictionForm from "@/components/PredictionForm";
import Results from "@/components/Results";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface HouseData {
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
}

export interface PredictionResult {
  predictedPrice: number;
  confidence: number;
}

const Index = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrediction = async (houseData: HouseData) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Import and use linear regression
    const { predictHousePrice } = await import("@/utils/linearRegression");
    const result = predictHousePrice(houseData);
    
    setPredictionResult(result);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            SkillCraft Technology
          </h1>
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
            TASK 01 - House Price Prediction
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Implement a linear regression model to predict the prices of houses based on their square footage and the number of bedrooms and bathrooms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏠 House Details
              </CardTitle>
              <CardDescription>
                Enter the house specifications to predict its price
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PredictionForm 
                onPredict={handlePrediction} 
                isLoading={isLoading} 
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Prediction Results
              </CardTitle>
              <CardDescription>
                Linear regression model predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Results 
                result={predictionResult} 
                isLoading={isLoading} 
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Machine Learning Internship Task • SkillCraft Technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
