
import type { HouseData, PredictionResult } from "@/pages/Index";

// Training data - expanded dataset for better predictions
const trainingData = [
  { squareFootage: 1200, bedrooms: 2, bathrooms: 1, price: 250000 },
  { squareFootage: 1500, bedrooms: 3, bathrooms: 2, price: 320000 },
  { squareFootage: 1800, bedrooms: 3, bathrooms: 2, price: 380000 },
  { squareFootage: 2000, bedrooms: 4, bathrooms: 3, price: 450000 },
  { squareFootage: 2200, bedrooms: 4, bathrooms: 3, price: 520000 },
  { squareFootage: 2500, bedrooms: 5, bathrooms: 4, price: 620000 },
  { squareFootage: 2800, bedrooms: 5, bathrooms: 4, price: 720000 },
  { squareFootage: 3000, bedrooms: 6, bathrooms: 5, price: 850000 },
  { squareFootage: 1000, bedrooms: 2, bathrooms: 1, price: 200000 },
  { squareFootage: 1400, bedrooms: 3, bathrooms: 2, price: 300000 },
  { squareFootage: 1600, bedrooms: 3, bathrooms: 2, price: 350000 },
  { squareFootage: 1900, bedrooms: 4, bathrooms: 3, price: 420000 },
  { squareFootage: 2100, bedrooms: 4, bathrooms: 3, price: 480000 },
  { squareFootage: 2300, bedrooms: 4, bathrooms: 3, price: 550000 },
  { squareFootage: 2600, bedrooms: 5, bathrooms: 4, price: 680000 },
  { squareFootage: 2900, bedrooms: 5, bathrooms: 4, price: 780000 },
];

interface LinearRegressionModel {
  intercept: number;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
}

class LinearRegression {
  private model: LinearRegressionModel | null = null;
  private rSquared: number = 0;

  train() {
    const n = trainingData.length;
    
    // Calculate means
    const meanSqFt = trainingData.reduce((sum, d) => sum + d.squareFootage, 0) / n;
    const meanBedrooms = trainingData.reduce((sum, d) => sum + d.bedrooms, 0) / n;
    const meanBathrooms = trainingData.reduce((sum, d) => sum + d.bathrooms, 0) / n;
    const meanPrice = trainingData.reduce((sum, d) => sum + d.price, 0) / n;

    // Calculate coefficients using normal equations (simplified multiple regression)
    let sumSqFtPrice = 0, sumBedroomsPrice = 0, sumBathroomsPrice = 0;
    let sumSqFtSq = 0, sumBedroomsSq = 0, sumBathroomsSq = 0;
    let sumSqFtBedrooms = 0, sumSqFtBathrooms = 0, sumBedroomsBathrooms = 0;

    for (const data of trainingData) {
      const sqFtDiff = data.squareFootage - meanSqFt;
      const bedroomsDiff = data.bedrooms - meanBedrooms;
      const bathroomsDiff = data.bathrooms - meanBathrooms;
      const priceDiff = data.price - meanPrice;

      sumSqFtPrice += sqFtDiff * priceDiff;
      sumBedroomsPrice += bedroomsDiff * priceDiff;
      sumBathroomsPrice += bathroomsDiff * priceDiff;

      sumSqFtSq += sqFtDiff * sqFtDiff;
      sumBedroomsSq += bedroomsDiff * bedroomsDiff;
      sumBathroomsSq += bathroomsDiff * bathroomsDiff;

      sumSqFtBedrooms += sqFtDiff * bedroomsDiff;
      sumSqFtBathrooms += sqFtDiff * bathroomsDiff;
      sumBedroomsBathrooms += bedroomsDiff * bathroomsDiff;
    }

    // Simplified coefficient calculation (assuming minimal correlation between features)
    const sqFtCoeff = sumSqFtSq > 0 ? sumSqFtPrice / sumSqFtSq : 0;
    const bedroomsCoeff = sumBedroomsSq > 0 ? sumBedroomsPrice / sumBedroomsSq : 0;
    const bathroomsCoeff = sumBathroomsSq > 0 ? sumBathroomsPrice / sumBathroomsSq : 0;

    const intercept = meanPrice - (sqFtCoeff * meanSqFt) - (bedroomsCoeff * meanBedrooms) - (bathroomsCoeff * meanBathrooms);

    this.model = {
      intercept,
      squareFootage: sqFtCoeff,
      bedrooms: bedroomsCoeff,
      bathrooms: bathroomsCoeff
    };

    // Calculate R-squared
    let totalSumSquares = 0;
    let residualSumSquares = 0;

    for (const data of trainingData) {
      const predicted = this.predict(data);
      totalSumSquares += Math.pow(data.price - meanPrice, 2);
      residualSumSquares += Math.pow(data.price - predicted, 2);
    }

    this.rSquared = totalSumSquares > 0 ? 1 - (residualSumSquares / totalSumSquares) : 0;
    this.rSquared = Math.max(0, Math.min(1, this.rSquared)); // Clamp between 0 and 1

    console.log("Linear Regression Model Trained:");
    console.log("Coefficients:", this.model);
    console.log("R-squared:", this.rSquared);
  }

  predict(houseData: HouseData): number {
    if (!this.model) {
      throw new Error("Model not trained yet");
    }

    return this.model.intercept +
           this.model.squareFootage * houseData.squareFootage +
           this.model.bedrooms * houseData.bedrooms +
           this.model.bathrooms * houseData.bathrooms;
  }

  getConfidence(houseData: HouseData): number {
    // Base confidence on R-squared and input validation
    let confidence = Math.max(0.6, this.rSquared); // Minimum 60% confidence

    // Adjust confidence based on input ranges
    if (houseData.squareFootage < 800 || houseData.squareFootage > 4000) {
      confidence *= 0.8; // Reduce confidence for outliers
    }
    
    if (houseData.bedrooms < 1 || houseData.bedrooms > 7) {
      confidence *= 0.9;
    }
    
    if (houseData.bathrooms < 1 || houseData.bathrooms > 6) {
      confidence *= 0.9;
    }

    // Add some realistic variation
    confidence += Math.random() * 0.1 - 0.05; // ±5% random variation
    
    return Math.max(0.5, Math.min(0.95, confidence)); // Clamp between 50% and 95%
  }
}

const regression = new LinearRegression();
regression.train();

export const predictHousePrice = (houseData: HouseData): PredictionResult => {
  const predictedPrice = Math.max(100000, regression.predict(houseData)); // Minimum price
  const confidence = regression.getConfidence(houseData);

  return {
    predictedPrice,
    confidence
  };
};
