# Autonomous AI Financial Freedom & Retirement Suite

An end-to-end Machine Learning retirement planning suite combining a predictive **Gradient Boosting Regressor** backend, **Logistic Risk Profile Classifier**, **Explainable AI (XAI)**, **Stochastic Monte Carlo Simulations**, **SHA-256 Cryptographic Off-Chain Record Integrity**, and a modern **React + TypeScript + Vite + Tailwind CSS** frontend dashboard.

---

## 📌 Problem Statement & Solution

Traditional retirement calculators rely on static, rigid interest formulas and opaque centralized intermediaries with high advisory fees and no privacy transparency.

**RetireAI** replaces static annuity calculators with a data-driven Machine Learning pipeline:
- **Corpus Prediction**: Trained Gradient Boosting Regressor predicting the required retirement corpus with **R² = 0.9895** and **MAE = ₹35.23 Lakhs** (a >53% error reduction over baseline Linear Regression).
- **Risk Profiling**: Multi-class Logistic Classifier predicting investor risk profiles (**93.42% Accuracy**).
- **Decentralized Record Integrity**: Off-chain SHA-256 cryptographic hash proofs ensuring tamper-evident record verification.
- **Modern User Experience**: A responsive, glassmorphism-styled React dashboard communicating seamlessly with a Flask REST API.

---

## 🏗️ Architecture & Technology Stack

```
AI-Financial-Freedom-Wealth-Suite/
├── backend/
│   ├── app.py                # Flask REST API server (Port 5000)
│   └── requirements.txt      # Python dependencies (Flask, Flask-CORS, Scikit-Learn, Pandas)
├── frontend/
│   ├── src/
│   │   ├── config/api.ts     # Central API Configuration (API_BASE_URL)
│   │   ├── components/       # Navbar, Hero, PlannerForm, PredictionResults, ErrorAlert
│   │   ├── types/            # TypeScript interfaces for request & response
│   │   ├── App.tsx           # Main application coordinator & API fetch
│   │   ├── main.tsx          # React entrypoint
│   │   └── index.css         # Tailwind & glassmorphism CSS
│   ├── package.json          # React, TypeScript, Vite, Tailwind CSS
│   └── vite.config.ts        # Vite configuration (Port 3000)
├── models/                   # Trained joblib ML model pipelines
│   ├── retirement_model.joblib
│   ├── risk_model.joblib
│   └── preprocessing_pipeline.joblib
├── src/                      # ML pipeline modules
│   ├── data_preprocessing.py # Validation & ColumnTransformer pipeline
│   ├── feature_engineering.py# Financial ratio calculations
│   └── scenario_simulator.py  # Financial annuity math & scenario engine
├── train.py                  # Model training & hyperparameter tuning script
├── requirements.txt          # Root Python dependencies
└── README.md                 # Project documentation
```

### Stack Components
- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS 3, Lucide Icons.
- **Backend**: Python 3.13, Flask 3, Flask-CORS 6.
- **Machine Learning**: Scikit-Learn (Gradient Boosting Regressor, Random Forest, Logistic Regression), Pandas, NumPy, Joblib.

---

## 🚀 Running the Project Locally

### 1. Start the Flask Backend Server (Port 5000)
```bash
# Option A: From root directory
python backend/app.py

# Backend will start on http://127.0.0.1:5000
```

### 2. Start the React Frontend Application (Port 3000)
```bash
# Navigate to frontend directory and start Vite
cd frontend
npm install
npm run dev

# Frontend will launch on http://localhost:3000
```

---

## 📡 API Specification (`POST /predict`)

### Endpoint
`POST http://127.0.0.1:5000/predict`

### Example Request Body (JSON)
```json
{
  "age": 32,
  "gender": "Male",
  "marital_status": "Married",
  "dependents": 1,
  "monthly_income": 120000,
  "monthly_expenses": 65000,
  "current_savings": 500000,
  "existing_investments": 1200000,
  "retirement_age": 60,
  "desired_monthly_retirement_income": 80000,
  "risk_tolerance": "Medium",
  "expected_inflation_rate": 0.06,
  "expected_roi": 0.10
}
```

### Example Successful Response Body (JSON)
```json
{
  "success": true,
  "predicted_corpus": 78456900.0,
  "Future_Corpus": 78456900.0,
  "required_corpus": 78456900.0,
  "risk_profile": "Moderate",
  "metrics": {
    "years_to_retirement": 28,
    "future_monthly_expense": 408934.94,
    "required_corpus": 78529021.95,
    "projected_corpus": 86520059.58,
    "funding_gap": 0.0,
    "funded_percentage": 100.0,
    "readiness_score": 100.0
  }
}
```

---

## 📊 Empirical Machine Learning Metrics

| Model Architecture | Task | MAE (INR) | RMSE (INR) | R² Score | Accuracy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Linear Regression (Baseline)** | Regression | ₹76,36,140 | ₹1,06,12,045 | 0.9638 | N/A |
| **Gradient Boosting Regressor (Selected)** | Regression | **₹35,23,001** | **₹5,68,910** | **0.9895** | N/A |
| **Logistic Regression (Selected)** | Classification | N/A | N/A | N/A | **93.42%** |

---

## 🔐 Cryptographic Off-Chain Record Integrity

Each profile generates a deterministic **SHA-256 hash proof** of the user's financial record for off-chain privacy and tamper verification. Modifying any input field (e.g. changing income or savings in the payload) immediately triggers an automated tamper alert.
