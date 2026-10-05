import sys
import os
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# Add parent directory to sys.path so we can import src modules
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from src.data_preprocessing import validate_financial_inputs, NUMERICAL_COLS, CATEGORICAL_COLS
from src.feature_engineering import add_financial_features, ENGINEERED_FEATURE_NAMES
from src.scenario_simulator import calculate_retirement_metrics

app = Flask(__name__)
CORS(app)

# Load trained models
models_dir = os.path.join(root_dir, 'models')
ret_model_path = os.path.join(models_dir, 'retirement_model.joblib')
risk_model_path = os.path.join(models_dir, 'risk_model.joblib')

if os.path.exists(ret_model_path):
    ret_model = joblib.load(ret_model_path)
    print(f"Loaded retirement model from {ret_model_path}")
else:
    ret_model = None
    print(f"Warning: Retirement model not found at {ret_model_path}")

if os.path.exists(risk_model_path):
    risk_model = joblib.load(risk_model_path)
    print(f"Loaded risk model from {risk_model_path}")
else:
    risk_model = None
    print(f"Warning: Risk model not found at {risk_model_path}")

@app.route('/', methods=['GET'])
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "AI-Powered Retirement Planning API",
        "models_loaded": {
            "retirement_model": ret_model is not None,
            "risk_model": risk_model is not None
        }
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "No JSON payload provided"}), 400

        # Cast numerical inputs properly
        profile = {
            'age': int(data.get('age', 32)),
            'gender': str(data.get('gender', 'Male')),
            'marital_status': str(data.get('marital_status', 'Married')),
            'dependents': int(data.get('dependents', 1)),
            'monthly_income': float(data.get('monthly_income', 120000.0)),
            'monthly_expenses': float(data.get('monthly_expenses', 65000.0)),
            'current_savings': float(data.get('current_savings', 500000.0)),
            'existing_investments': float(data.get('existing_investments', 1200000.0)),
            'retirement_age': int(data.get('retirement_age', 60)),
            'desired_monthly_retirement_income': float(data.get('desired_monthly_retirement_income', 80000.0)),
            'risk_tolerance': str(data.get('risk_tolerance', 'Medium')),
            'expected_inflation_rate': float(data.get('expected_inflation_rate', 0.06)),
            'expected_roi': float(data.get('expected_roi', 0.10))
        }

        # Validate inputs
        is_valid, errors = validate_financial_inputs(profile)
        if not is_valid:
            return jsonify({"error": "Validation failed", "details": errors}), 400

        # Perform feature engineering
        df_single = pd.DataFrame([profile])
        df_feat = add_financial_features(df_single)
        
        feature_cols = NUMERICAL_COLS + CATEGORICAL_COLS + ENGINEERED_FEATURE_NAMES
        X_single = df_feat[feature_cols]

        # ML Prediction using existing trained models
        if ret_model is not None:
            predicted_corpus = float(ret_model.predict(X_single)[0])
        else:
            calc_metrics = calculate_retirement_metrics(
                age=profile['age'], retirement_age=profile['retirement_age'],
                monthly_income=profile['monthly_income'], monthly_expenses=profile['monthly_expenses'],
                current_savings=profile['current_savings'], existing_investments=profile['existing_investments'],
                desired_monthly_ret_inc=profile['desired_monthly_retirement_income'],
                expected_inflation=profile['expected_inflation_rate'], expected_roi=profile['expected_roi']
            )
            predicted_corpus = float(calc_metrics['required_corpus'])

        if risk_model is not None:
            predicted_risk = str(risk_model.predict(X_single)[0])
        else:
            predicted_risk = profile['risk_tolerance']

        calc_metrics = calculate_retirement_metrics(
            age=profile['age'], retirement_age=profile['retirement_age'],
            monthly_income=profile['monthly_income'], monthly_expenses=profile['monthly_expenses'],
            current_savings=profile['current_savings'], existing_investments=profile['existing_investments'],
            desired_monthly_ret_inc=profile['desired_monthly_retirement_income'],
            expected_inflation=profile['expected_inflation_rate'], expected_roi=profile['expected_roi']
        )

        return jsonify({
            "success": True,
            "predicted_corpus": round(predicted_corpus, 2),
            "Future_Corpus": round(predicted_corpus, 2),
            "required_corpus": round(predicted_corpus, 2),
            "risk_profile": predicted_risk,
            "metrics": {
                "years_to_retirement": calc_metrics['years_to_retirement'],
                "future_monthly_expense": calc_metrics['future_monthly_expense'],
                "required_corpus": calc_metrics['required_corpus'],
                "projected_corpus": calc_metrics['projected_corpus'],
                "funding_gap": calc_metrics['funding_gap'],
                "funded_percentage": calc_metrics['funded_percentage'],
                "readiness_score": calc_metrics['readiness_score']
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask Backend API on http://127.0.0.1:5000...")
    app.run(host='127.0.0.1', port=5000, debug=False)
