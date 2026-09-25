import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

NUMERICAL_COLS = [
    'age', 'dependents', 'monthly_income', 'monthly_expenses', 
    'current_savings', 'existing_investments', 'retirement_age', 
    'desired_monthly_retirement_income', 'expected_inflation_rate', 'expected_roi'
]

CATEGORICAL_COLS = ['gender', 'marital_status', 'risk_tolerance']

def validate_financial_inputs(input_dict):
    """
    Module 1: Ingestion & Input validation logic for user profile.
    """
    errors = []
    
    age = input_dict.get('age')
    if age is None or age < 18 or age > 75:
        errors.append("Age must be between 18 and 75.")
        
    ret_age = input_dict.get('retirement_age')
    if ret_age is None or ret_age <= age or ret_age > 80:
        errors.append(f"Retirement age must be greater than current age ({age}) and at most 80.")
        
    income = input_dict.get('monthly_income')
    if income is None or income <= 0:
        errors.append("Monthly income must be greater than 0.")
        
    expenses = input_dict.get('monthly_expenses')
    if expenses is None or expenses < 0 or expenses > income * 1.5:
        errors.append("Monthly expenses must be non-negative and reasonable relative to income.")
        
    savings = input_dict.get('current_savings')
    if savings is None or savings < 0:
        errors.append("Current savings cannot be negative.")
        
    investments = input_dict.get('existing_investments')
    if investments is None or investments < 0:
        errors.append("Existing investments cannot be negative.")
        
    risk = input_dict.get('risk_tolerance')
    if risk not in ['Low', 'Medium', 'High']:
        errors.append("Risk tolerance must be 'Low', 'Medium', or 'High'.")
        
    return len(errors) == 0, errors

def build_preprocessor_pipeline(num_cols=None, cat_cols=None):
    """
    Module 2: Data Preprocessing Pipeline with ColumnTransformer preventing leakage.
    """
    if num_cols is None:
        num_cols = NUMERICAL_COLS
    if cat_cols is None:
        cat_cols = CATEGORICAL_COLS
        
    num_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    cat_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', num_pipeline, num_cols),
            ('cat', cat_pipeline, cat_cols)
        ]
    )
    
    return preprocessor

def clean_dataset(df):
    """
    Cleans raw dataset, removes exact duplicates and unreasonable outliers.
    """
    df_clean = df.copy()
    df_clean = df_clean.drop_duplicates()
    
    # Filter out impossible negative numbers if any
    df_clean = df_clean[df_clean['monthly_income'] > 0]
    df_clean = df_clean[df_clean['monthly_expenses'] >= 0]
    df_clean = df_clean[df_clean['retirement_age'] > df_clean['age']]
    
    return df_clean
