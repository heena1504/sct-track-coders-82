
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Bed, Bath, Square } from "lucide-react";
import type { HouseData } from "@/pages/Index";

interface PredictionFormProps {
  onPredict: (data: HouseData) => void;
  isLoading: boolean;
}

const PredictionForm = ({ onPredict, isLoading }: PredictionFormProps) => {
  const [squareFootage, setSquareFootage] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [bathrooms, setBathrooms] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!squareFootage || !bedrooms || !bathrooms) {
      alert("Please fill in all fields");
      return;
    }

    const data: HouseData = {
      squareFootage: parseFloat(squareFootage),
      bedrooms: parseInt(bedrooms),
      bathrooms: parseFloat(bathrooms)
    };

    onPredict(data);
  };

  const handleReset = () => {
    setSquareFootage("");
    setBedrooms("");
    setBathrooms("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="squareFootage" className="flex items-center gap-2">
            <Square className="w-4 h-4" />
            Square Footage
          </Label>
          <Input
            id="squareFootage"
            type="number"
            placeholder="e.g., 2000"
            value={squareFootage}
            onChange={(e) => setSquareFootage(e.target.value)}
            min="500"
            max="10000"
            step="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedrooms" className="flex items-center gap-2">
            <Bed className="w-4 h-4" />
            Number of Bedrooms
          </Label>
          <Input
            id="bedrooms"
            type="number"
            placeholder="e.g., 3"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            min="1"
            max="10"
            step="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bathrooms" className="flex items-center gap-2">
            <Bath className="w-4 h-4" />
            Number of Bathrooms
          </Label>
          <Input
            id="bathrooms"
            type="number"
            placeholder="e.g., 2.5"
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            min="1"
            max="10"
            step="0.5"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          type="submit" 
          className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Predicting...
            </>
          ) : (
            <>
              <Home className="w-4 h-4 mr-2" />
              Predict Price
            </>
          )}
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleReset}
          disabled={isLoading}
        >
          Reset
        </Button>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Our model uses linear regression to analyze the relationship between house features and market prices. Results are based on historical data patterns.
          </p>
        </CardContent>
      </Card>
    </form>
  );
};

export default PredictionForm;
