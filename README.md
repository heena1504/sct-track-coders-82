
# House Price Prediction - Machine Learning Internship

## Project Overview

This is a machine learning web application that predicts house prices using linear regression. The model analyzes square footage, number of bedrooms, and bathrooms to estimate property values in Indian Rupees.

**Developer**: Heena  
**Project ID**: sct_trackcode_1  
**Task**: ML Internship - House Price Prediction using Linear Regression

## Features

- Interactive house specification form
- Linear regression price prediction model
- Results displayed in Indian Rupees (INR)
- AI assistant for help and explanations
- Responsive design with modern UI
- Real-time prediction confidence scoring

## How to Run

Follow these steps to run the application locally:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd house-price-prediction

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

## Technologies Used

This project is built with:

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with Shadcn-ui components
- **Machine Learning**: Custom Linear Regression implementation
- **Build Tool**: Vite
- **Icons**: Lucide React

## Machine Learning Model

The application implements a custom linear regression model that:
- Uses multiple linear regression with 3 features
- Calculates R-squared for model accuracy
- Provides confidence scoring for predictions
- Converts USD predictions to Indian Rupees

## Model Features

1. **Square Footage** - Primary factor affecting price
2. **Number of Bedrooms** - Secondary factor
3. **Number of Bathrooms** - Additional factor

The model is trained on sample housing data and provides predictions with confidence intervals.

## Project Structure

```
src/
├── components/           # React components
│   ├── PredictionForm.tsx   # Input form for house details
│   └── Results.tsx          # Prediction results display
├── pages/               # Application pages
│   └── Index.tsx           # Main application page
├── utils/               # Utility functions
│   └── linearRegression.ts  # ML model implementation
└── main.tsx            # Application entry point
```

## Deployment

The application can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

---

**Note**: This project was developed by Heena as part of a machine learning internship to demonstrate linear regression implementation for house price prediction.
**Project Tracking**: sct_trackcode_1
