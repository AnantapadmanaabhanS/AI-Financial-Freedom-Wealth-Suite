import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.pipeline import Pipeline

from src.data_preprocessing import build_preprocessor_pipeline, NUMERICAL_COLS, CATEGORICAL_COLS
from src.feature_engineering import add_financial_features, ENGINEERED_FEATURE_NAMES
from src.evaluate import evaluate_classification_model

def train_risk_models(df, output_dir=r"d:\Java Project\models"):
    os.makedirs(output_dir, exist_ok=True)
    
    df_feat = add_financial_features(df)
    
    feature_cols = NUMERICAL_COLS + CATEGORICAL_COLS + ENGINEERED_FEATURE_NAMES
    X = df_feat[feature_cols]
    y = df_feat['risk_profile']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)
    
    num_cols_all = NUMERICAL_COLS + ENGINEERED_FEATURE_NAMES
    cat_cols_all = CATEGORICAL_COLS
    
    preprocessor = build_preprocessor_pipeline(num_cols=num_cols_all, cat_cols=cat_cols_all)
    
    models = {
        'Logistic Regression (Baseline)': LogisticRegression(max_iter=1000, random_state=42),
        'Random Forest Classifier': RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42),
        'Gradient Boosting Classifier': GradientBoostingClassifier(n_estimators=100, random_state=42)
    }
    
    results = {}
    fitted_pipelines = {}
    best_f1 = 0.0
    best_pipe = None
    best_model_name = ""
    
    for name, model in models.items():
        pipe = Pipeline([
            ('preprocessor', preprocessor),
            ('classifier', model)
        ])
        
        pipe.fit(X_train, y_train)
        cv_scores = cross_val_score(pipe, X_train, y_train, cv=5, scoring='f1_weighted')
        
        y_pred = pipe.predict(X_test)
        
        eval_metrics = evaluate_classification_model(name, y_test, y_pred)
        eval_metrics['CV_F1_Mean'] = float(np.mean(cv_scores))
        eval_metrics['CV_F1_Std'] = float(np.std(cv_scores))
        
        results[name] = eval_metrics
        fitted_pipelines[name] = pipe
        print(f"Risk Model: {name} | Test Accuracy: {eval_metrics['Accuracy']:.4f} | Test F1: {eval_metrics['F1_Score']:.4f}")
        
        if eval_metrics['F1_Score'] > best_f1:
            best_f1 = eval_metrics['F1_Score']
            best_pipe = pipe
            best_model_name = name
            
    final_model_path = os.path.join(output_dir, 'risk_model.joblib')
    joblib.dump(best_pipe, final_model_path)
    print(f"Saved best risk profile classifier ({best_model_name}) to {final_model_path}")
    
    return results, best_pipe, (X_test, y_test, best_pipe.predict(X_test))
