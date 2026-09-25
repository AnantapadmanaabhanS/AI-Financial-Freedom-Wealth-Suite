import os
import json
import numpy as np
import pandas as pd
from sklearn.metrics import (
    mean_absolute_error, mean_squared_error, r2_score,
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix
)

def evaluate_regression_model(model_name, y_true, y_pred):
    """
    Computes regression evaluation metrics: MAE, RMSE, R2.
    """
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    
    return {
        'model_name': model_name,
        'MAE': float(mae),
        'RMSE': float(rmse),
        'R2': float(r2)
    }

def evaluate_classification_model(model_name, y_true, y_pred):
    """
    Computes classification metrics: Accuracy, Precision, Recall, F1.
    """
    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred, average='weighted', zero_division=0)
    rec = recall_score(y_true, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_true, y_pred, average='weighted', zero_division=0)
    cm = confusion_matrix(y_true, y_pred).tolist()
    
    return {
        'model_name': model_name,
        'Accuracy': float(acc),
        'Precision': float(prec),
        'Recall': float(rec),
        'F1_Score': float(f1),
        'Confusion_Matrix': cm
    }

def save_metrics(metrics_dict, file_path):
    """
    Saves metrics into a structured JSON file.
    """
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(metrics_dict, f, indent=4)
    print(f"Metrics saved to {file_path}")
