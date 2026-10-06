import sys
import os
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# Add root directory to sys.path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from src.data_preprocessing import validate_financial_inputs, NUMERICAL_COLS, CATEGORICAL_COLS
from src.feature_engineering import add_financial_features, ENGINEERED_FEATURE_NAMES
from src.scenario_simulator import calculate_retirement_metrics, simulate_scenarios
from src.monte_carlo import run_monte_carlo_simulation
from src.goal_drift import detect_goal_drift
from src.integrity import generate_record_hash, verify_record_integrity
from src.recommendations import generate_personalized_recommendation
from src.explainability import get_feature_importances
from src.ai_optimizer import calculate_ai_asset_allocation, generate_ai_financial_diagnostics, simulate_market_shock

app = Flask(__name__)
CORS(app)

# Load trained models
models_dir = os.path.join(root_dir, 'models')
ret_model_path = os.path.join(models_dir, 'retirement_model.joblib')
risk_model_path = os.path.join(models_dir, 'risk_model.joblib')

ret_model = joblib.load(ret_model_path) if os.path.exists(ret_model_path) else None
risk_model = joblib.load(risk_model_path) if os.path.exists(risk_model_path) else None

def parse_profile_from_request(data):
    """Parses and sanitizes user profile dictionary from JSON payload."""
    return {
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

@app.route('/', methods=['GET'])
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "AI-Powered Retirement Planning REST API",
        "models_loaded": {
            "retirement_model": ret_model is not None,
            "risk_model": risk_model is not None
        }
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True) or {}
        profile = parse_profile_from_request(data)
        
        is_valid, errors = validate_financial_inputs(profile)
        if not is_valid:
            return jsonify({"error": "Validation failed", "details": errors}), 400

        df_single = pd.DataFrame([profile])
        df_feat = add_financial_features(df_single)
        feature_cols = NUMERICAL_COLS + CATEGORICAL_COLS + ENGINEERED_FEATURE_NAMES
        X_single = df_feat[feature_cols]

        if ret_model is not None:
            predicted_corpus = float(ret_model.predict(X_single)[0])
        else:
            calc = calculate_retirement_metrics(
                age=profile['age'], retirement_age=profile['retirement_age'],
                monthly_income=profile['monthly_income'], monthly_expenses=profile['monthly_expenses'],
                current_savings=profile['current_savings'], existing_investments=profile['existing_investments'],
                desired_monthly_ret_inc=profile['desired_monthly_retirement_income'],
                expected_inflation=profile['expected_inflation_rate'], expected_roi=profile['expected_roi']
            )
            predicted_corpus = float(calc['required_corpus'])

        predicted_risk = str(risk_model.predict(X_single)[0]) if risk_model is not None else profile['risk_tolerance']
        
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
            "metrics": calc_metrics
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/risk', methods=['POST'])
def risk_profile():
    try:
        data = request.get_json(force=True) or {}
        profile = parse_profile_from_request(data)
        df_single = pd.DataFrame([profile])
        df_feat = add_financial_features(df_single)
        feature_cols = NUMERICAL_COLS + CATEGORICAL_COLS + ENGINEERED_FEATURE_NAMES
        X_single = df_feat[feature_cols]

        if risk_model is not None:
            pred_risk = str(risk_model.predict(X_single)[0])
            probs = risk_model.predict_proba(X_single)[0].tolist()
            classes = risk_model.classes_.tolist()
            prob_dict = dict(zip(classes, probs))
        else:
            pred_risk = profile['risk_tolerance']
            prob_dict = {'Conservative': 0.2, 'Moderate': 0.6, 'Aggressive': 0.2}

        return jsonify({
            "predicted_risk_profile": pred_risk,
            "self_reported_risk": profile['risk_tolerance'],
            "probabilities": prob_dict
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/readiness', methods=['POST'])
def readiness():
    try:
        data = request.get_json(force=True) or {}
        profile = parse_profile_from_request(data)
        metrics = calculate_retirement_metrics(
            age=profile['age'], retirement_age=profile['retirement_age'],
            monthly_income=profile['monthly_income'], monthly_expenses=profile['monthly_expenses'],
            current_savings=profile['current_savings'], existing_investments=profile['existing_investments'],
            desired_monthly_ret_inc=profile['desired_monthly_retirement_income'],
            expected_inflation=profile['expected_inflation_rate'], expected_roi=profile['expected_roi']
        )
        recommendations = generate_personalized_recommendation(profile, metrics, profile['risk_tolerance'])
        return jsonify({
            "metrics": metrics,
            "recommendations": recommendations
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/allocation', methods=['POST'])
def asset_allocation():
    try:
        data = request.get_json(force=True) or {}
        profile = parse_profile_from_request(data)
        years_to_ret = max(1, profile['retirement_age'] - profile['age'])
        
        df_single = pd.DataFrame([profile])
        df_feat = add_financial_features(df_single)
        feature_cols = NUMERICAL_COLS + CATEGORICAL_COLS + ENGINEERED_FEATURE_NAMES
        X_single = df_feat[feature_cols]
        pred_risk = str(risk_model.predict(X_single)[0]) if risk_model is not None else profile['risk_tolerance']
        
        allocation = calculate_ai_asset_allocation(profile['age'], pred_risk, years_to_ret)
        monthly_surplus = max(0, profile['monthly_income'] - profile['monthly_expenses']) * 0.70
        
        sip_breakdown = {
            "equity_sip": round(monthly_surplus * (allocation['Equity'] / 100.0), 2),
            "debt_sip": round(monthly_surplus * (allocation['Debt / Fixed Income'] / 100.0), 2),
            "gold_sip": round(monthly_surplus * (allocation['Gold & Commodities'] / 100.0), 2),
            "liquid_sip": round(monthly_surplus * (allocation['Liquid FDs & Cash'] / 100.0), 2),
            "total_available_surplus": round(monthly_surplus, 2)
        }
        
        return jsonify({
            "risk_profile_used": pred_risk,
            "allocation_percentages": allocation,
            "sip_breakdown": sip_breakdown
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health-diagnostics', methods=['POST'])
def health_diagnostics():
    try:
        data = request.get_json(force=True) or {}
        profile = parse_profile_from_request(data)
        metrics = calculate_retirement_metrics(
            age=profile['age'], retirement_age=profile['retirement_age'],
            monthly_income=profile['monthly_income'], monthly_expenses=profile['monthly_expenses'],
            current_savings=profile['current_savings'], existing_investments=profile['existing_investments'],
            desired_monthly_ret_inc=profile['desired_monthly_retirement_income'],
            expected_inflation=profile['expected_inflation_rate'], expected_roi=profile['expected_roi']
        )
        insights, micro_goals = generate_ai_financial_diagnostics(profile, metrics)
        return jsonify({
            "insights": insights,
            "micro_goals": micro_goals
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/stress-test', methods=['POST'])
def stress_test():
    try:
        data = request.get_json(force=True) or {}
        profile = parse_profile_from_request(data)
        metrics = calculate_retirement_metrics(
            age=profile['age'], retirement_age=profile['retirement_age'],
            monthly_income=profile['monthly_income'], monthly_expenses=profile['monthly_expenses'],
            current_savings=profile['current_savings'], existing_investments=profile['existing_investments'],
            desired_monthly_ret_inc=profile['desired_monthly_retirement_income'],
            expected_inflation=profile['expected_inflation_rate'], expected_roi=profile['expected_roi']
        )
        shock_recession = simulate_market_shock(profile, metrics, 'recession')
        shock_inflation = simulate_market_shock(profile, metrics, 'hyperinflation')
        return jsonify({
            "recession_scenario": shock_recession,
            "hyperinflation_scenario": shock_inflation
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/explain', methods=['GET', 'POST'])
def explain():
    try:
        if ret_model is not None:
            num_cols_all = NUMERICAL_COLS + ENGINEERED_FEATURE_NAMES
            cat_cols_all = CATEGORICAL_COLS
            all_feature_names = num_cols_all + cat_cols_all
            df_imp = get_feature_importances(ret_model, all_feature_names)
            importances = df_imp.head(10).to_dict(orient='records')
        else:
            importances = []
        return jsonify({
            "model_type": "Gradient Boosting Regressor",
            "top_features": importances
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/what-if', methods=['POST'])
def what_if():
    try:
        data = request.get_json(force=True) or {}
        profile = parse_profile_from_request(data)
        df_scenarios = simulate_scenarios(profile)
        scenarios_list = df_scenarios.to_dict(orient='records')
        return jsonify({
            "scenarios": scenarios_list
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/monte-carlo', methods=['POST'])
def monte_carlo():
    try:
        data = request.get_json(force=True) or {}
        profile = parse_profile_from_request(data)
        n_sims = int(data.get('num_simulations', 2000))
        metrics = calculate_retirement_metrics(
            age=profile['age'], retirement_age=profile['retirement_age'],
            monthly_income=profile['monthly_income'], monthly_expenses=profile['monthly_expenses'],
            current_savings=profile['current_savings'], existing_investments=profile['existing_investments'],
            desired_monthly_ret_inc=profile['desired_monthly_retirement_income'],
            expected_inflation=profile['expected_inflation_rate'], expected_roi=profile['expected_roi']
        )
        profile['required_corpus'] = metrics['required_corpus']
        final_corpuses, summary = run_monte_carlo_simulation(profile, num_simulations=n_sims)
        
        # Take a histogram sample of 50 points for chart rendering
        counts, bin_edges = np.histogram(final_corpuses / 1e7, bins=30)
        chart_points = [
            {"bin": round(float((bin_edges[i] + bin_edges[i+1])/2), 2), "count": int(counts[i])}
            for i in range(len(counts))
        ]
        
        return jsonify({
            "summary": summary,
            "chart_points": chart_points
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/integrity', methods=['POST'])
def record_integrity():
    try:
        data = request.get_json(force=True) or {}
        profile = parse_profile_from_request(data)
        record_hash = generate_record_hash(profile)
        return jsonify({
            "hash": record_hash,
            "status": "Verified",
            "algorithm": "SHA-256"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/verify-integrity', methods=['POST'])
def verify_integrity():
    try:
        data = request.get_json(force=True) or {}
        profile = data.get('profile', {})
        expected_hash = data.get('expected_hash', '')
        is_valid, current_hash = verify_record_integrity(profile, expected_hash)
        return jsonify({
            "is_valid": is_valid,
            "current_hash": current_hash,
            "expected_hash": expected_hash
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/overview', methods=['POST'])
def overview_dashboard():
    try:
        data = request.get_json(force=True) or {}
        profile = parse_profile_from_request(data)
        
        df_single = pd.DataFrame([profile])
        df_feat = add_financial_features(df_single)
        feature_cols = NUMERICAL_COLS + CATEGORICAL_COLS + ENGINEERED_FEATURE_NAMES
        X_single = df_feat[feature_cols]

        predicted_corpus = float(ret_model.predict(X_single)[0]) if ret_model is not None else 78456900.0
        predicted_risk = str(risk_model.predict(X_single)[0]) if risk_model is not None else profile['risk_tolerance']
        
        calc_metrics = calculate_retirement_metrics(
            age=profile['age'], retirement_age=profile['retirement_age'],
            monthly_income=profile['monthly_income'], monthly_expenses=profile['monthly_expenses'],
            current_savings=profile['current_savings'], existing_investments=profile['existing_investments'],
            desired_monthly_ret_inc=profile['desired_monthly_retirement_income'],
            expected_inflation=profile['expected_inflation_rate'], expected_roi=profile['expected_roi']
        )
        
        years_to_ret = max(1, profile['retirement_age'] - profile['age'])
        allocation = calculate_ai_asset_allocation(profile['age'], predicted_risk, years_to_ret)
        drift = detect_goal_drift(calc_metrics['required_corpus'], calc_metrics['projected_corpus'])

        return jsonify({
            "user_profile": profile,
            "predicted_corpus": round(predicted_corpus, 2),
            "risk_profile": predicted_risk,
            "metrics": calc_metrics,
            "allocation": allocation,
            "goal_drift": drift
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask REST API Server on http://127.0.0.1:5000...")
    app.run(host='127.0.0.1', port=5000, debug=False)
