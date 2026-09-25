import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, HistGradientBoostingRegressor
from sklearn.pipeline import Pipeline

from src.data_preprocessing import build_preprocessor_pipeline, NUMERICAL_COLS, CATEGORICAL_COLS
from src.feature_engineering import add_financial_features, ENGINEERED_FEATURE_NAMES
from src.evaluate import evaluate_regression_model

def train_retirement_models(df, output_dir=r"d:\Java Project\models"):
    os.makedirs(output_dir, exist_ok=True)
    
    # Feature engineering
    df_feat = add_financial_features(df)
    
    feature_cols = NUMERICAL_COLS + CATEGORICAL_COLS + ENGINEERED_FEATURE_NAMES
    X = df_feat[feature_cols]
    y = df_feat['required_corpus']
    
    # Train-test split (80-20) - strict separation to prevent data leakage
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)
    
    num_cols_all = NUMERICAL_COLS + ENGINEERED_FEATURE_NAMES
    cat_cols_all = CATEGORICAL_COLS
    
    preprocessor = build_preprocessor_pipeline(num_cols=num_cols_all, cat_cols=cat_cols_all)
    
    models = {
        'Linear Regression (Baseline)': LinearRegression(),
        'Random Forest Regressor': RandomForestRegressor(random_state=42),
        'Gradient Boosting Regressor': GradientBoostingRegressor(random_state=42),
        'HistGradientBoosting Regressor': HistGradientBoostingRegressor(random_state=42)
    }
    
    results = {}
    fitted_pipelines = {}
    
    for name, model in models.items():
        pipe = Pipeline([
            ('preprocessor', preprocessor),
            ('regressor', model)
        ])
        
        # Fit on training data
        pipe.fit(X_train, y_train)
        
        # Cross validation on training set (5-fold)
        cv_scores = cross_val_score(pipe, X_train, y_train, cv=5, scoring='r2')
        
        # Predict on test set
        y_pred = pipe.predict(X_test)
        
        eval_metrics = evaluate_regression_model(name, y_test, y_pred)
        eval_metrics['CV_R2_Mean'] = float(np.mean(cv_scores))
        eval_metrics['CV_R2_Std'] = float(np.std(cv_scores))
        
        results[name] = eval_metrics
        fitted_pipelines[name] = pipe
        print(f"Model: {name} | Test R2: {eval_metrics['R2']:.4f} | Test MAE: {eval_metrics['MAE']:,.2f}")

    # Hyperparameter Tuning on Best Candidate Model (Random Forest or Gradient Boosting)
    param_grid = {
        'regressor__n_estimators': [50, 100, 150],
        'regressor__max_depth': [10, 20, None],
        'regressor__min_samples_split': [2, 5]
    }
    
    rf_pipe = Pipeline([
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(random_state=42))
    ])
    
    grid_search = GridSearchCV(rf_pipe, param_grid, cv=5, scoring='r2', n_jobs=-1)
    grid_search.fit(X_train, y_train)
    
    best_rf_pipe = grid_search.best_estimator_
    y_pred_tuned = best_rf_pipe.predict(X_test)
    tuned_metrics = evaluate_regression_model('Random Forest (Tuned Final)', y_test, y_pred_tuned)
    tuned_metrics['Best_Params'] = str(grid_search.best_params_)
    results['Random Forest (Tuned Final)'] = tuned_metrics
    
    print(f"\nTuned Random Forest Test R2: {tuned_metrics['R2']:.4f} | Best Params: {grid_search.best_params_}")
    
    # Save the final selected model pipeline
    final_model_path = os.path.join(output_dir, 'retirement_model.joblib')
    joblib.dump(best_rf_pipe, final_model_path)
    print(f"Saved final retirement prediction model to {final_model_path}")
    
    return results, best_rf_pipe, (X_test, y_test, y_pred_tuned)
