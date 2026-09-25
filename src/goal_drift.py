import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

def detect_goal_drift(original_target_corpus, current_projected_corpus, threshold_pct=15.0):
    """
    Module 12: Goal Drift Detection
    Compares original target trajectory vs current projected trajectory.
    Returns status, drift percentage, and alert message.
    """
    if original_target_corpus <= 0:
        return {'drift_detected': False, 'drift_percentage': 0.0, 'status': 'Invalid Target'}
        
    diff = original_target_corpus - current_projected_corpus
    drift_pct = (diff / original_target_corpus) * 100.0
    
    if drift_pct > threshold_pct:
        status = "CRITICAL_DRIFT"
        message = f"Warning: Your projected corpus is lagging {drift_pct:.1f}% below your retirement goal target (Threshold: {threshold_pct}%)."
        alert = True
    elif drift_pct > 5.0:
        status = "MODERATE_DRIFT"
        message = f"Notice: Projected corpus is {drift_pct:.1f}% below target. Minor contribution adjustment recommended."
        alert = True
    else:
        status = "ON_TRACK"
        message = f"Great news! Your retirement trajectory is on track (Deviation: {drift_pct:.1f}%)."
        alert = False
        
    return {
        'drift_detected': alert,
        'status': status,
        'drift_percentage': round(float(drift_pct), 1),
        'threshold_percentage': threshold_pct,
        'message': message
    }

def fit_financial_anomaly_detector(df):
    """
    Module 13: Financial Anomaly Detection using Isolation Forest.
    Identifies unusual expense spikes or savings drop anomalies.
    """
    features = ['monthly_income', 'monthly_expenses', 'current_savings', 'existing_investments']
    X = df[features].copy()
    
    iso = IsolationForest(contamination=0.03, random_state=42)
    iso.fit(X)
    return iso

def detect_financial_anomaly(iso_model, user_input_dict):
    """
    Predicts if user financial metrics exhibit an anomalous pattern.
    """
    features = ['monthly_income', 'monthly_expenses', 'current_savings', 'existing_investments']
    X_single = pd.DataFrame([{f: user_input_dict[f] for f in features}])
    
    pred = iso_model.predict(X_single)[0]
    score = iso_model.decision_function(X_single)[0]
    
    is_anomaly = (pred == -1)
    return {
        'is_anomaly': bool(is_anomaly),
        'anomaly_score': round(float(score), 4),
        'explanation': "Unusual income-to-expense ratio or savings pattern detected." if is_anomaly else "Normal financial pattern."
    }
