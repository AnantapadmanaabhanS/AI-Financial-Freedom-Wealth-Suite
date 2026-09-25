import pandas as pd
import numpy as np

ENGINEERED_FEATURE_NAMES = [
    'savings_rate', 'expense_ratio', 'investment_ratio', 
    'years_to_retirement', 'monthly_surplus', 'current_corpus', 
    'emergency_fund_ratio', 'inflation_adjusted_expense', 
    'retirement_duration', 'contribution_capacity'
]

def add_financial_features(df):
    """
    Module 3: Financial Feature Engineering
    Creates domain-specific features derived from raw inputs.
    """
    df_feat = df.copy()
    
    income = np.maximum(df_feat['monthly_income'], 1.0)
    expenses = df_feat['monthly_expenses']
    savings = df_feat['current_savings']
    investments = df_feat['existing_investments']
    age = df_feat['age']
    ret_age = df_feat['retirement_age']
    desired_ret_inc = df_feat['desired_monthly_retirement_income']
    inflation = df_feat['expected_inflation_rate']
    
    # 1. Savings rate
    df_feat['monthly_surplus'] = np.maximum(0, income - expenses)
    df_feat['savings_rate'] = df_feat['monthly_surplus'] / income
    
    # 2. Expense ratio
    df_feat['expense_ratio'] = expenses / income
    
    # 3. Current total corpus
    df_feat['current_corpus'] = savings + investments
    
    # 4. Investment ratio
    df_feat['investment_ratio'] = investments / (df_feat['current_corpus'] + 1e-5)
    
    # 5. Years to retirement
    df_feat['years_to_retirement'] = np.maximum(1, ret_age - age)
    
    # 6. Emergency fund ratio (months of expenses covered by liquid savings)
    df_feat['emergency_fund_ratio'] = savings / (expenses * 6 + 1e-5)
    
    # 7. Inflation-adjusted retirement expense
    df_feat['inflation_adjusted_expense'] = desired_ret_inc * ((1 + inflation) ** df_feat['years_to_retirement'])
    
    # 8. Retirement duration (assuming life expectancy of 85)
    df_feat['retirement_duration'] = np.maximum(10, 85 - ret_age)
    
    # 9. Contribution capacity (portion of monthly surplus available for retirement investments)
    df_feat['contribution_capacity'] = df_feat['monthly_surplus'] * 0.70
    
    return df_feat
