import numpy as np
import pandas as pd

def calculate_retirement_metrics(age, retirement_age, monthly_income, monthly_expenses,
                                 current_savings, existing_investments,
                                 desired_monthly_ret_inc, expected_inflation, expected_roi,
                                 monthly_savings_input=None):
    """
    Module 5, 7, 8: Computes future expense, projected corpus, funding gap, and readiness score.
    """
    years_to_ret = max(1, retirement_age - age)
    ret_duration = max(10, 85 - retirement_age)
    
    if monthly_savings_input is None:
        monthly_savings = max(0, monthly_income - monthly_expenses) * 0.70
    else:
        monthly_savings = monthly_savings_input
        
    current_corpus = current_savings + existing_investments
    
    # Inflation-adjusted monthly expense during retirement
    future_monthly_exp = desired_monthly_ret_inc * ((1 + expected_inflation) ** years_to_ret)
    future_annual_exp = future_monthly_exp * 12
    
    real_roi = max(0.005, (1 + expected_roi) / (1 + expected_inflation) - 1)
    
    # Required Corpus calculation (PV of retirement annuity)
    required_corpus = future_annual_exp * (1 - (1 + real_roi) ** (-ret_duration)) / real_roi
    
    # Projected Corpus calculation (FV of current corpus + FV of monthly savings)
    r = expected_roi
    n = years_to_ret
    fv_current = current_corpus * ((1 + r) ** n)
    fv_savings = (monthly_savings * 12) * (((1 + r) ** n - 1) / (r + 1e-6))
    projected_corpus = fv_current + fv_savings
    
    funding_gap = max(0.0, required_corpus - projected_corpus)
    funded_percentage = min(100.0, (projected_corpus / (required_corpus + 1e-5)) * 100.0)
    
    # Analytical Readiness Score Formula (0 to 100)
    # Weights: 50% Corpus Coverage + 25% Savings Rate benchmark (30%) + 25% Emergency Fund (6 months)
    savings_rate = (monthly_income - monthly_expenses) / (monthly_income + 1e-5)
    emerg_fund_months = current_savings / (monthly_expenses * 6 + 1e-5)
    
    score_coverage = min(1.0, projected_corpus / (required_corpus + 1e-5)) * 50.0
    score_savings = min(1.0, max(0.0, savings_rate) / 0.30) * 25.0
    score_emerg = min(1.0, max(0.0, emerg_fund_months)) * 25.0
    
    readiness_score = round(score_coverage + score_savings + score_emerg, 1)
    
    return {
        'years_to_retirement': years_to_ret,
        'future_monthly_expense': round(future_monthly_exp, 2),
        'required_corpus': round(required_corpus, 2),
        'projected_corpus': round(projected_corpus, 2),
        'funding_gap': round(funding_gap, 2),
        'funded_percentage': round(funded_percentage, 1),
        'readiness_score': readiness_score
    }

def simulate_scenarios(user_profile):
    """
    Module 10: What-If Scenario Simulator comparing alternative retirement ages & savings plans.
    """
    base_age = user_profile['age']
    ret_ages = [max(base_age + 2, 55), 60, 65]
    scenarios = []
    
    for r_age in sorted(list(set(ret_ages))):
        metrics = calculate_retirement_metrics(
            age=user_profile['age'],
            retirement_age=r_age,
            monthly_income=user_profile['monthly_income'],
            monthly_expenses=user_profile['monthly_expenses'],
            current_savings=user_profile['current_savings'],
            existing_investments=user_profile['existing_investments'],
            desired_monthly_ret_inc=user_profile['desired_monthly_retirement_income'],
            expected_inflation=user_profile['expected_inflation_rate'],
            expected_roi=user_profile['expected_roi']
        )
        scenarios.append({
            'Scenario': f"Retire at Age {r_age}",
            'Retirement Age': r_age,
            'Required Corpus (INR)': metrics['required_corpus'],
            'Projected Corpus (INR)': metrics['projected_corpus'],
            'Funding Gap (INR)': metrics['funding_gap'],
            'Funded %': f"{metrics['funded_percentage']}%",
            'Readiness Score': metrics['readiness_score']
        })
        
    return pd.DataFrame(scenarios)
