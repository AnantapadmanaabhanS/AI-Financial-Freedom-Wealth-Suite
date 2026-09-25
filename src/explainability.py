import numpy as np
import pandas as pd
from sklearn.inspection import permutation_importance

def get_feature_importances(pipeline, feature_names):
    """
    Extracts feature importances from a trained pipeline (Tree-based model).
    """
    model = pipeline.named_steps['regressor'] if 'regressor' in pipeline.named_steps else pipeline.named_steps['classifier']
    preprocessor = pipeline.named_steps['preprocessor']
    
    # Extract transformed feature names
    cat_encoder = preprocessor.named_transformers_['cat'].named_steps['onehot']
    cat_feature_names = cat_encoder.get_feature_names_out().tolist()
    
    num_cols = preprocessor.transformers_[0][2]
    all_transformed_names = list(num_cols) + cat_feature_names
    
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        df_imp = pd.DataFrame({
            'Feature': all_transformed_names,
            'Importance': importances
        }).sort_values(by='Importance', ascending=False)
        return df_imp
    else:
        return pd.DataFrame()

def calculate_permutation_importance(pipeline, X_test, y_test):
    """
    Calculates permutation importance for model explainability.
    """
    result = permutation_importance(pipeline, X_test, y_test, n_repeats=5, random_state=42, n_jobs=-1)
    
    df_perm = pd.DataFrame({
        'Feature': X_test.columns,
        'Importance_Mean': result.importances_mean,
        'Importance_Std': result.importances_std
    }).sort_values(by='Importance_Mean', ascending=False)
    
    return df_perm
