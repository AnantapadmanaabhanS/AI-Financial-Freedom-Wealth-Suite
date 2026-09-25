import numpy as np
import pandas as pd

def run_monte_carlo_simulation(user_profile, num_simulations=2000, seed=42):
    """
    Module 14: Monte Carlo Retirement Corpus Simulation
    Simulates portfolio market returns under stochastic annual volatility.
    """
    np.random.seed(seed)
    
    age = user_profile['age']
    ret_age = user_profile['retirement_age']
    years_to_ret = max(1, ret_age - age)
    
    current_corpus = user_profile['current_savings'] + user_profile['existing_investments']
    monthly_savings = max(0, user_profile['monthly_income'] - user_profile['monthly_expenses']) * 0.70
    annual_contribution = monthly_savings * 12
    
    mean_roi = user_profile['expected_roi']
    # Assume 12% annual return volatility (standard deviation)
    std_roi = 0.12 
    
    final_corpuses = []
    
    for _ in range(num_simulations):
        # Generate random annual returns for each year up to retirement
        annual_returns = np.random.normal(mean_roi, std_roi, years_to_ret)
        corpus = current_corpus
        
        for r in annual_returns:
            corpus = corpus * (1 + r) + annual_contribution
            
        final_corpuses.append(max(0, corpus))
        
    final_corpuses = np.array(final_corpuses)
    
    percentile_10 = np.percentile(final_corpuses, 10)
    median_50 = np.median(final_corpuses)
    percentile_90 = np.percentile(final_corpuses, 90)
    
    # Calculate probability of achieving target corpus
    req_corpus = user_profile.get('required_corpus', 0.0)
    if req_corpus > 0:
        prob_success = np.mean(final_corpuses >= req_corpus) * 100.0
    else:
        prob_success = 0.0
        
    summary = {
        'num_simulations': num_simulations,
        'median_projected_corpus': round(float(median_50), 2),
        'percentile_10': round(float(percentile_10), 2),
        'percentile_90': round(float(percentile_90), 2),
        'probability_of_success': round(float(prob_success), 1)
    }
    
    return final_corpuses, summary
