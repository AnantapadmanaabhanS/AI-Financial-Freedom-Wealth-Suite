import os
import numpy as np
import pandas as pd

def generate_retirement_dataset(num_samples=2500, seed=42):
    np.random.seed(seed)
    
    age = np.random.randint(22, 60, size=num_samples)
    gender = np.random.choice(['Male', 'Female'], size=num_samples)
    marital_status = np.random.choice(['Single', 'Married'], size=num_samples, p=[0.35, 0.65])
    dependents = np.where(marital_status == 'Single', 
                           np.random.choice([0, 1], size=num_samples, p=[0.85, 0.15]),
                           np.random.randint(0, 4, size=num_samples))
    
    # Income & Expense in INR
    monthly_income = np.random.lognormal(mean=11.2, sigma=0.6, size=num_samples).round(-2)
    monthly_income = np.clip(monthly_income, 25000, 500000)
    
    # Expense is typically 40% - 75% of income
    expense_ratio_raw = np.random.uniform(0.40, 0.75, size=num_samples)
    monthly_expenses = (monthly_income * expense_ratio_raw).round(-2)
    
    # Current savings & investments depend on age and income
    work_experience_years = np.maximum(1, age - 22)
    current_savings = (monthly_income * np.random.uniform(2, 18, size=num_samples) * (work_experience_years ** 0.5)).round(-2)
    current_savings = np.clip(current_savings, 50000, 25000000)
    
    existing_investments = (monthly_income * np.random.uniform(3, 25, size=num_samples) * (work_experience_years ** 0.6)).round(-2)
    existing_investments = np.clip(existing_investments, 20000, 35000000)
    
    retirement_age = np.random.choice([55, 58, 60, 62, 65], size=num_samples, p=[0.1, 0.3, 0.4, 0.1, 0.1])
    
    # Desired monthly income in retirement (typically 60% - 90% of current income)
    desired_monthly_retirement_income = (monthly_income * np.random.uniform(0.60, 0.90, size=num_samples)).round(-2)
    
    risk_tolerance = np.random.choice(['Low', 'Medium', 'High'], size=num_samples, p=[0.3, 0.45, 0.25])
    expected_inflation_rate = np.random.uniform(0.05, 0.075, size=num_samples) # 5.0% - 7.5%
    
    # Expected ROI based on risk tolerance
    expected_roi_base = np.where(risk_tolerance == 'Low', 0.07, 
                        np.where(risk_tolerance == 'Medium', 0.095, 0.12))
    expected_roi = expected_roi_base + np.random.normal(0, 0.005, size=num_samples)
    expected_roi = np.clip(expected_roi, 0.05, 0.15)
    
    # Financial target calculation (Required Corpus)
    years_to_ret = np.maximum(1, retirement_age - age)
    ret_duration = 85 - retirement_age # Assume living until 85
    
    future_monthly_exp = desired_monthly_retirement_income * ((1 + expected_inflation_rate) ** years_to_ret)
    future_annual_exp = future_monthly_exp * 12
    
    real_roi = (1 + expected_roi) / (1 + expected_inflation_rate) - 1
    real_roi = np.maximum(real_roi, 0.005)
    
    # Present value of annuity formula for corpus required at retirement
    required_corpus = future_annual_exp * (1 - (1 + real_roi) ** (-ret_duration)) / real_roi
    
    # Add noise to target (simulating real-world nuances like healthcare buffers, emergency funds, tax)
    required_corpus *= np.random.normal(1.0, 0.03, size=num_samples)
    required_corpus = np.round(required_corpus, -3)
    
    # Risk Profile Label assignment for classification model
    # Derived from age, horizon, risk_tolerance score
    score = (60 - age) * 0.4 + np.where(risk_tolerance == 'High', 30, np.where(risk_tolerance == 'Medium', 15, 0)) + (existing_investments / (monthly_income * 12 + 1e-5)) * 2
    risk_profile = np.where(score > 35, 'Aggressive', np.where(score > 20, 'Moderate', 'Conservative'))

    df = pd.DataFrame({
        'age': age,
        'gender': gender,
        'marital_status': marital_status,
        'dependents': dependents,
        'monthly_income': monthly_income,
        'monthly_expenses': monthly_expenses,
        'current_savings': current_savings,
        'existing_investments': existing_investments,
        'retirement_age': retirement_age,
        'desired_monthly_retirement_income': desired_monthly_retirement_income,
        'risk_tolerance': risk_tolerance,
        'expected_inflation_rate': np.round(expected_inflation_rate, 4),
        'expected_roi': np.round(expected_roi, 4),
        'required_corpus': required_corpus,
        'risk_profile': risk_profile
    })
    
    return df

if __name__ == '__main__':
    raw_dir = r"d:\Java Project\data\raw"
    os.makedirs(raw_dir, exist_ok=True)
    out_path = os.path.join(raw_dir, "retirement_financial_data.csv")
    df = generate_retirement_dataset(num_samples=2500, seed=42)
    df.to_csv(out_path, index=False)
    print(f"Generated dataset with shape {df.shape} saved to {out_path}")
