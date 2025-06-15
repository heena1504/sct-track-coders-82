
import type { HouseData, PredictionResult } from "@/pages/Index";

// Sample training data (in a real application, this would come from a database)
const trainingData = [
  { squareFootage: 1500, bedrooms: 3, bathrooms: 2, price: 300000 },
  { squareFootage: 2000, bedrooms: 4, bathrooms: 2.5, price: 400000 },
  { squareFootage: 1200, bedrooms: 2, bathrooms: 1, price: 250000 },
  { squareFootage: 2500, bedrooms: 4, bathrooms: 3, price: 550000 },
  { squareFootage: 1800, bedrooms: 3, bathrooms: 2, price: 350000 },
  { squareFootage: 3000, bedrooms: 5, bathrooms: 3.5, price: 650000 },
  { squareFootage: 1000, bedrooms: 2, bathrooms: 1, price: 200000 },
  { squareFootage: 2200, bedrooms: 4, bathrooms: 2.5, price: 480000 },
  { squareFootage: 1600, bedrooms: 3, bathrooms: 2, price: 320000 },
  { squareFootage: 2800, bedrooms: 4, bathrooms: 3, price: 600000 },
];

interface LinearRegressionModel {
  coefficients: {
    intercept: number;
    squareFootage: number;
    bedrooms: number;
    bathrooms: number;
  };
  rSquared: number;
}

// Calculate means for each feature
const calculateMeans = (data: typeof trainingData) => {
  const n = data.length;
  return {
    squareFootage: data.reduce((sum, d) => sum + d.squareFootage, 0) / n,
    bedrooms: data.reduce((sum, d) => sum + d.bedrooms, 0) / n,
    bathrooms: data.reduce((sum, d) => sum + d.bathrooms, 0) / n,
    price: data.reduce((sum, d) => sum + d.price, 0) / n,
  };
};

// Simple multiple linear regression implementation
const trainLinearRegression = (): LinearRegressionModel => {
  const means = calculateMeans(trainingData);
  const n = trainingData.length;

  // Calculate sums of squares and cross products
  let ssxx1 = 0, ssxx2 = 0, ssxx3 = 0; // sum of squares for each feature
  let ssxy1 = 0, ssxy2 = 0, ssxy3 = 0; // sum of cross products with target
  let ssyy = 0; // sum of squares for target

  trainingData.forEach(d => {
    const x1 = d.squareFootage - means.squareFootage;
    const x2 = d.bedrooms - means.bedrooms;
    const x3 = d.bathrooms - means.bathrooms;
    const y = d.price - means.price;

    ssxx1 += x1 * x1;
    ssxx2 += x2 * x2;
    ssxx3 += x3 * x3;
    ssxy1 += x1 * y;
    ssxy2 += x2 * y;
    ssxy3 += x3 * y;
    ssyy += y * y;
  });

  // Simplified coefficient calculation (assuming features are relatively independent)
  const b1 = ssxy1 / ssxx1; // coefficient for square footage
  const b2 = ssxy2 / ssxx2; // coefficient for bedrooms
  const b3 = ssxy3 / ssxx3; // coefficient for bathrooms
  const b0 = means.price - (b1 * means.squareFootage + b2 * means.bedrooms + b3 * means.bathrooms);

  // Calculate R-squared
  let ssres = 0; // sum of squared residuals
  trainingData.forEach(d => {
    const predicted = b0 + b1 * d.squareFootage + b2 * d.bedrooms + b3 * d.bathrooms;
    const residual = d.price - predicted;
    ssres += residual * residual;
  });

  const rSquared = 1 - (ssres / ssyy);

  return {
    coefficients: {
      intercept: b0,
      squareFootage: b1,
      bedrooms: b2,
      bathrooms: b3,
    },
    rSquared: Math.max(0, Math.min(1, rSquared)), // Clamp between 0 and 1
  };
};

// Train the model once
const model = trainLinearRegression();

console.log("Linear Regression Model Trained:");
console.log("Coefficients:", model.coefficients);
console.log("R-squared:", model.rSquared.toFixed(4));

export const predictHousePrice = (houseData: HouseData): PredictionResult => {
  const { squareFootage, bedrooms, bathrooms } = houseData;
  const { coefficients, rSquared } = model;

  // Make prediction using the linear regression formula
  const predictedPrice = 
    coefficients.intercept +
    coefficients.squareFootage * squareFootage +
    coefficients.bedrooms * bedrooms +
    coefficients.bathrooms * bathrooms;

  // Ensure price is positive and reasonable
  const finalPrice = Math.max(50000, predictedPrice);

  // Confidence based on R-squared and input reasonableness
  let confidence = rSquared;
  
  // Adjust confidence based on input ranges (penalize extreme values)
  if (squareFootage < 800 || squareFootage > 5000) confidence *= 0.8;
  if (bedrooms < 1 || bedrooms > 8) confidence *= 0.8;
  if (bathrooms < 1 || bathrooms > 6) confidence *= 0.8;

  return {
    predictedPrice: Math.round(finalPrice),
    confidence: Math.max(0.3, Math.min(0.95, confidence)), // Clamp between 0.3 and 0.95
  };
};

// Export training data for potential use in visualization
export const getTrainingData = () => trainingData;

// Export model details for debugging
export const getModelDetails = () => model;
