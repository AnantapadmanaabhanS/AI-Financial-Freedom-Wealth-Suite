# Autonomous AI Financial Freedom & Retirement Suite

An end-to-end Machine Learning retirement planning suite combining a predictive **Gradient Boosting Regressor** backend, **Logistic Risk Profile Classifier**, **Explainable AI (XAI)**, **Stochastic Monte Carlo Simulations**, **SHA-256 Cryptographic Off-Chain Record Integrity**, and a modern **React + TypeScript + Vite + Tailwind CSS + Recharts** feature dashboard.

---

## 📌 Problem Statement & Solution

Traditional retirement calculators rely on static, rigid interest formulas and opaque centralized intermediaries with high advisory fees and no privacy transparency.

**RetireAI** replaces static annuity calculators with a data-driven Machine Learning pipeline:
- **Corpus Prediction**: Trained Gradient Boosting Regressor predicting the required retirement corpus with **R² = 0.9895** and **MAE = ₹35.23 Lakhs** (a >53% error reduction over baseline Linear Regression).
- **Risk Profiling**: Multi-class Logistic Classifier predicting investor risk profiles (**93.42% Accuracy**).
- **Decentralized Record Integrity**: Off-chain SHA-256 cryptographic hash proofs ensuring tamper-evident record verification.
- **Modern User Experience**: A responsive, glassmorphism SaaS React dashboard with a persistent navigation sidebar, rendering interactive charts and exposing all 12 feature modules.

---

## 🎛️ Complete 12-Feature Dashboard Architecture

| View ID | Navigation Label | Integration Status | Technology / Model | Description |
| :--- | :--- | :--- | :--- | :--- |
| `overview` | **Overview Dashboard** | `✓ Active System` | Command Center API | Summarizes predicted corpus, readiness score, risk category, and key metrics. |
| `profile` | **Financial Profile** | `✓ Input Schema` | TypeScript React State | Shared form across Personal, Cashflow, Retirement, and Investment parameters. |
| `prediction` | **Retirement Prediction** | `✓ Active ML` | Gradient Boosting Regressor | Real ML corpus prediction, goal gap analysis, and interactive bar charts. |
| `risk` | **Risk Profiling** | `✓ Active ML` | Logistic Regression Classifier | Multi-class risk profile probability distribution (Low, Medium, High). |
| `readiness` | **Retirement Readiness** | `◐ Analytical Engine` | Readiness Metric Engine | Readiness score (0-100), circular gauge, and strategic action recommendations. |
| `allocation` | **AI Asset Allocation** | `◐ Analytical Engine` | Asset Allocation Optimizer | Donut pie chart for Equity/Debt/Gold/Cash and monthly SIP routing breakdown. |
| `health-diagnostics` | **AI Health Diagnostics** | `◐ Analytical Engine` | Cashflow Diagnostic Engine | Financial friction insights and 90-day strategic micro-goals roadmap. |
| `stress-test` | **Market Stress-Test** | `◐ Analytical Engine` | Macro Stress Simulator | Bear Market crash (-30%) & Hyperinflation (+3%) macroeconomic shock cards. |
| `xai` | **AI Explanation (XAI)** | `✓ Active ML` | Explainable AI Engine | Gini feature importance weight distribution horizontal bar chart. |
| `what-if` | **What-If Simulator** | `◐ Analytical Engine` | Scenario Timeline Engine | Retirement age comparison matrix for Ages 55, 60, and 65. |
| `monte-carlo` | **Monte Carlo Simulation** | `◐ Analytical Engine` | Stochastic 2K Engine | 2,000-run stochastic return simulation, confidence bounds, and frequency histogram. |
| `integrity` | **Cryptographic Integrity** | `✓ Active Crypto` | SHA-256 Verification | Deterministic SHA-256 record hash proof and interactive tamper verification sandbox. |

---

## 🏗️ Architecture & Technology Stack

```
AI-Financial-Freedom-Wealth-Suite/
├── backend/
│   ├── app.py                # Flask REST API server (Port 5000, 13 REST Endpoints)
│   └── requirements.txt      # Python dependencies (Flask, Flask-CORS, Scikit-Learn, Pandas)
├── frontend/
│   ├── src/
│   │   ├── config/api.ts     # Central API Configuration (API_BASE_URL)
│   │   ├── components/       # Sidebar, Navbar, PlannerForm, ErrorAlert
│   │   ├── pages/            # 12 Feature Page View Components
│   │   ├── types/            # TypeScript interfaces for API schemas & responses
│   │   ├── App.tsx           # Main Dashboard Coordinator & Shared Profile State
│   │   ├── main.tsx          # React entrypoint
│   │   └── index.css         # Tailwind, Recharts & glassmorphism CSS
│   ├── package.json          # React 19, TypeScript, Vite 6, Tailwind CSS 3, Recharts, Lucide Icons
│   └── vite.config.ts        # Vite configuration (Port 3000)
├── models/                   # Trained joblib ML model pipelines
│   ├── retirement_model.joblib
│   ├── risk_model.joblib
│   └── preprocessing_pipeline.joblib
├── train.py                  # Model training & hyperparameter tuning script
└── README.md                 # Project documentation
```

### Stack Components
- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS 3, Recharts, Lucide Icons.
- **Backend**: Python 3.13, Flask 3, Flask-CORS 6.
- **Machine Learning**: Scikit-Learn (Gradient Boosting Regressor, Random Forest, Logistic Regression), Pandas, NumPy, Joblib.

---

## 🚀 Running the Project Locally

### 1. Start the Flask Backend Server (Port 5000)
```bash
python backend/app.py
# Backend will start on http://127.0.0.1:5000
```

### 2. Start the React Frontend Application (Port 3000)
```bash
cd frontend
npm install
npm run dev
# Frontend will launch on http://localhost:3000
```

---

## 📡 REST API Specification

- `GET /health` - API and ML model loading status.
- `POST /predict` - Gradient Boosting ML retirement corpus prediction.
- `POST /risk` - Logistic Classifier multi-class risk probabilities.
- `POST /readiness` - Analytical readiness index & action recommendations.
- `POST /allocation` - Asset allocation percentages & monthly SIP breakdown.
- `POST /health-diagnostics` - Cashflow friction diagnostics & 90-day micro-goals.
- `POST /stress-test` - Bear market crash & hyperinflation shock metrics.
- `GET /explain` - Top 10 ML Gini feature importance weights.
- `POST /what-if` - Retirement age 55, 60, 65 scenario matrix.
- `POST /monte-carlo` - 2,000-run stochastic simulation results.
- `POST /integrity` & `POST /verify-integrity` - SHA-256 record hash proof & tamper verification.
- `POST /overview` - Command Center aggregated dashboard summary.

---

## 📊 Empirical Machine Learning Metrics

| Model Architecture | Task | MAE (INR) | RMSE (INR) | R² Score | Accuracy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Linear Regression (Baseline)** | Regression | ₹76,36,140 | ₹1,06,12,045 | 0.9638 | N/A |
| **Gradient Boosting Regressor (Selected)** | Regression | **₹35,23,001** | **₹5,68,910** | **0.9895** | N/A |
| **Logistic Regression (Selected)** | Classification | N/A | N/A | N/A | **93.42%** |

---

## 🔐 Cryptographic Off-Chain Record Integrity

Each profile generates a deterministic **SHA-256 hash proof** of the user's financial record for off-chain privacy and tamper verification. Modifying any input field (e.g. changing income or savings in the payload) in the interactive sandbox immediately triggers an automated hash mismatch alert.
