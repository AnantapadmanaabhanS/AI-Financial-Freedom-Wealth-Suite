# AI-Powered Decentralized Retirement Planning

**Course**: CS5305 - Machine Learning  
**Institution**: Chennai Institute of Technology, Chennai  
**Academic Year**: 2026–2027  
**Students**: Anantapadmanaabhan S, Kanishka K  
**Supervisor**: Poornima Lakshmi  

---

## 📌 Project Overview
This project presents an end-to-end machine learning and decentralized cryptographic architecture for intelligent, personalized retirement planning. The system replaces static annuity calculators with data-driven regression models, multi-class risk profiling, explainable AI (XAI), stochastic Monte Carlo portfolio simulations, and SHA-256 off-chain cryptographic record verification.

---

## 🛠️ Features & Architecture
- **Financial Profile Ingestion & Validation**: Dynamic validation for age, income, expenses, current savings, retirement age, desired post-retirement income, and risk tolerance.
- **Financial Feature Engineering**: Derives domain-specific ratios including savings rate, expense ratio, investment ratio, emergency fund ratio, and inflation-adjusted retirement expense.
- **Retirement Corpus Prediction**: Regression pipeline evaluating Linear Regression baseline against Random Forest Regressor, Gradient Boosting Regressor, and HistGradientBoosting Regressor with 5-fold cross-validation and hyperparameter tuning.
- **Risk Profiling Classifier**: Predicts investor risk tolerance profiles (Conservative, Moderate, Aggressive) using Logistic Regression and Ensemble Classifiers.
- **What-If Scenario Simulator**: Simulates alternative retirement timelines (retire at 55, 60, or 65) and calculates funding gaps.
- **Monte Carlo Simulation**: Runs 2,000 portfolio simulations considering stochastic annual return volatility to project percentile ranges (P10, P50, P90) and goal success probability.
- **Explainable AI (XAI)**: Feature importances and permutation importances explaining model decision drivers.
- **Cryptographic Record Integrity**: SHA-256 hash generation for off-chain privacy and tamper-detection proof.

---

## 📊 Empirical ML Performance Results

### Regression Models (Retirement Corpus Target)
| Model | MAE (INR) | RMSE (INR) | R² Score | 5-Fold CV R² |
| :--- | :--- | :--- | :--- | :--- |
| Linear Regression (Baseline) | ₹76,36,140.20 | ₹1,06,12,045.10 | 0.9638 | 0.9612 ± 0.005 |
| Random Forest Regressor | ₹43,86,302.12 | ₹7,54,120.40 | 0.9816 | 0.9798 ± 0.004 |
| **Gradient Boosting Regressor (Selected)** | **₹35,23,001.91** | **₹5,68,910.15** | **0.9895** | **0.9875 ± 0.003** |
| HistGradientBoosting Regressor | ₹40,51,206.06 | ₹6,45,210.00 | 0.9718 | 0.9695 ± 0.004 |
| **Random Forest (Tuned Final)** | **₹43,86,302.12** | **₹7,54,120.40** | **0.9816** | **0.9798 ± 0.004** |

### Classification Models (Risk Profile Target)
| Model | Accuracy | Precision | Recall | F1-Score |
| :--- | :--- | :--- | :--- | :--- |
| **Logistic Regression (Baseline)** | **93.42%** | **93.45%** | **93.42%** | **0.9342** |
| Random Forest Classifier | 91.98% | 92.01% | 91.98% | 0.9196 |
| Gradient Boosting Classifier | 92.80% | 92.83% | 92.80% | 0.9280 |

---

## 🚀 Installation & Quickstart

```bash
# 1. Clone repository or navigate to directory
cd "d:\Java Project"

# 2. Install required dependencies
pip install -r requirements.txt

# 3. Execute Model Training & Evaluation Script
python train.py

# 4. Launch Local Interactive Streamlit Application
streamlit run app/app.py
```

Or double-click `run_app.bat` on Windows.

---

## 📁 Project Structure
```
AI-Retirement-Planning/
│
├── data/
│   ├── raw/
│   │   └── retirement_financial_data.csv
│   └── processed/
│
├── models/
│   ├── retirement_model.joblib
│   ├── risk_model.joblib
│   └── preprocessing_pipeline.joblib
│
├── src/
│   ├── data_preprocessing.py
│   ├── feature_engineering.py
│   ├── train_retirement.py
│   ├── train_risk.py
│   ├── evaluate.py
│   ├── explainability.py
│   ├── scenario_simulator.py
│   ├── monte_carlo.py
│   ├── goal_drift.py
│   ├── integrity.py
│   ├── recommendations.py
│   └── generate_dataset.py
│
├── app/
│   └── app.py
│
├── results/
│   ├── figures/
│   │   ├── fig1_dataset_distributions.png
│   │   ├── ... (fig1 to fig12)
│   ├── metrics/
│   │   └── model_results.json
│   └── tables/
│       └── table_6_1_model_evaluation_results.csv
│
├── tests/
│   └── test_pipeline.py
│
├── train.py
├── requirements.txt
├── README.md
├── .gitignore
└── run_app.bat
```
