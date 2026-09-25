import numpy as np
import pandas as pd

def calculate_ai_asset_allocation(age, risk_profile, years_to_retirement):
    """
    AI-driven dynamic asset allocation optimizer.
    Calculates equity, debt, gold, and liquid FD split based on age rule, risk profile, and time horizon.
    """
    base_equity = max(20, 110 - age)
    
    if risk_profile == 'Aggressive':
        equity = min(85, base_equity + 15)
        debt = max(10, 100 - equity - 10)
        gold = 5
        liquid = 5
    elif risk_profile == 'Moderate':
        equity = min(70, base_equity)
        debt = max(20, 100 - equity - 10)
        gold = 5
        liquid = 5
    else: # Conservative
        equity = max(15, base_equity - 20)
        debt = max(45, 100 - equity - 15)
        gold = 10
        liquid = 5
        
    # De-risk as retirement approaches (within 5 years)
    if years_to_retirement <= 5:
        shift = (6 - years_to_retirement) * 5
        equity = max(15, equity - shift)
        debt = debt + shift
        
    total = equity + debt + gold + liquid
    return {
        'Equity': round(equity * 100 / total, 1),
        'Debt / Fixed Income': round(debt * 100 / total, 1),
        'Gold & Commodities': round(gold * 100 / total, 1),
        'Liquid FDs & Cash': round(liquid * 100 / total, 1)
    }

def generate_ai_financial_diagnostics(user_profile, metrics_dict):
    """
    AI Financial Health Advisor generating dynamic natural language insights and micro-goals.
    """
    savings_rate = (user_profile['monthly_income'] - user_profile['monthly_expenses']) / (user_profile['monthly_income'] + 1e-5)
    emerg_months = user_profile['current_savings'] / (user_profile['monthly_expenses'] * 6 + 1e-5)
    funded_pct = metrics_dict['funded_percentage']
    
    insights = []
    micro_goals = []
    
    # Savings rate analysis
    if savings_rate >= 0.40:
        insights.append("**Elite Savings Rate**: You save over 40% of your income. Compounding velocity is in the top 10th percentile.")
    elif savings_rate >= 0.25:
        insights.append("**Healthy Savings Rate**: Saving 25-40% is optimal for steady wealth accumulation.")
    else:
        insights.append("**Sub-Optimal Cashflow**: Saving under 25% of income significantly extends the time needed to reach financial freedom.")
        micro_goals.append("Cut discretionary lifestyle expenses by 10% to push savings rate above 30%.")
        
    # Emergency Cushion
    if emerg_months >= 1.0:
        insights.append("**Emergency Cushion Verified**: Your liquid reserves comfortably cover 6+ months of living costs.")
    else:
        insights.append("**Liquidity Risk Warning**: Liquid savings cover less than 6 months of expenses, leaving you vulnerable to unexpected shocks.")
        micro_goals.append("Direct next 3 months of surplus savings into a high-yield liquid FD buffer.")
        
    # Goal Coverage
    if funded_pct >= 100:
        insights.append("**Target Achieved**: Your projected wealth trajectory fully covers your target retirement lifestyle.")
    elif funded_pct >= 75:
        insights.append("**On Track with Minor Shortfall**: You are 75%+ funded. Minor SIP adjustments will close the remaining gap.")
        micro_goals.append("Increase annual SIP contribution by 10% step-up each year to close the shortfall.")
    else:
        insights.append("**Critical Funding Deficit**: Current trajectory covers less than 75% of your target retirement corpus.")
        micro_goals.append("Consider postponing target retirement age by 3 years or adjusting target retirement income expectations.")
        
    return insights, micro_goals

def simulate_market_shock(user_profile, metrics_dict, shock_type='recession'):
    """
    Simulates macroeconomic market shocks (Recession crash vs Hyperinflation spike).
    """
    shocked_p = user_profile.copy()
    
    if shock_type == 'recession':
        shocked_p['existing_investments'] *= 0.75
        shocked_p['expected_roi'] = max(0.04, shocked_p['expected_roi'] - 0.03)
        desc = "25% Market Crash in Year 1 & Reduced ROI (-3%)"
    else: # hyperinflation
        shocked_p['expected_inflation_rate'] = 0.09
        desc = "Hyperinflation Spike to 9.0% Annual Inflation"
        
    years_to_ret = max(1, shocked_p['retirement_age'] - shocked_p['age'])
    ret_duration = max(10, 85 - shocked_p['retirement_age'])
    
    monthly_savings = max(0, shocked_p['monthly_income'] - shocked_p['monthly_expenses']) * 0.70
    current_corpus = shocked_p['current_savings'] + shocked_p['existing_investments']
    
    future_monthly_exp = shocked_p['desired_monthly_retirement_income'] * ((1 + shocked_p['expected_inflation_rate']) ** years_to_ret)
    future_annual_exp = future_monthly_exp * 12
    real_roi = max(0.005, (1 + shocked_p['expected_roi']) / (1 + shocked_p['expected_inflation_rate']) - 1)
    
    shocked_req_corpus = future_annual_exp * (1 - (1 + real_roi) ** (-ret_duration)) / real_roi
    
    r = shocked_p['expected_roi']
    n = years_to_ret
    fv_current = current_corpus * ((1 + r) ** n)
    fv_savings = (monthly_savings * 12) * (((1 + r) ** n - 1) / (r + 1e-6))
    shocked_proj_corpus = fv_current + fv_savings
    
    return {
        'description': desc,
        'original_req': metrics_dict['required_corpus'],
        'shocked_req': round(shocked_req_corpus, 2),
        'original_proj': metrics_dict['projected_corpus'],
        'shocked_proj': round(shocked_proj_corpus, 2),
        'gap_increase': round(max(0, (shocked_req_corpus - shocked_proj_corpus) - metrics_dict['funding_gap']), 2)
    }
