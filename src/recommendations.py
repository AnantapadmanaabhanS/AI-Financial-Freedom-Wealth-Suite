def generate_personalized_recommendation(user_profile, metrics_dict, risk_profile):
    """
    Module 9: Personalized Recommendation Engine
    Generates actionable financial guidance based on funding gap, readiness score, and risk profile.
    """
    gap = metrics_dict['funding_gap']
    funded_pct = metrics_dict['funded_percentage']
    score = metrics_dict['readiness_score']
    age = user_profile['age']
    ret_age = user_profile['retirement_age']
    income = user_profile['monthly_income']
    expenses = user_profile['monthly_expenses']
    surplus = max(0, income - expenses)
    
    recommendations = []
    
    # Funding gap advice
    if gap > 0:
        years = max(1, ret_age - age)
        # Required extra monthly investment approx needed
        extra_monthly_needed = gap / (12 * years * 1.5)
        recommendations.append(
            f"• **Bridge Funding Gap**: Your current projected corpus has a shortfall of ₹{gap:,.2f} ({100 - funded_pct:.1f}% gap). "
            f"Consider increasing your monthly retirement savings by approximately ₹{extra_monthly_needed:,.2f}."
        )
    else:
        recommendations.append(
            f"• **Corpus Target Achieved**: Excellent! Your projected corpus covers 100% of your estimated retirement goal requirement."
        )
        
    # Risk Profile Alignment advice
    if risk_profile == 'Conservative':
        recommendations.append(
            "• **Asset Allocation**: As a Conservative investor, prioritize high-quality Fixed Deposits, Public Provident Fund (PPF), and Debt Mutual Funds with ~20-30% allocation to Index Funds for inflation hedging."
        )
    elif risk_profile == 'Moderate':
        recommendations.append(
            "• **Asset Allocation**: As a Moderate investor, maintain a balanced 50:50 allocation between Equity Mutual Funds (Large & Flexi cap) and Debt instruments/NPS."
        )
    else: # Aggressive
        recommendations.append(
            "• **Asset Allocation**: As an Aggressive investor with a long time horizon, target 70-80% Equity allocation (Mid-cap, Multi-cap, Global Equity) to maximize long-term compounding growth."
        )
        
    # Emergency Fund advice
    savings = user_profile['current_savings']
    six_mo_exp = expenses * 6
    if savings < six_mo_exp:
        shortfall_emerg = six_mo_exp - savings
        recommendations.append(
            f"• **Emergency Liquid Cushion**: Liquid savings cover less than 6 months of expenses. Build an additional emergency fund of ₹{shortfall_emerg:,.2f} in a liquid savings/FD account before expanding risky investments."
        )
    else:
        recommendations.append(
            "• **Emergency Cushion**: Emergency fund requirement (6 months of expenses) is adequately fulfilled."
        )
        
    # Retirement Age adjustment advice
    if score < 60 and ret_age < 65:
        recommendations.append(
            f"• **Timeline Flexibility**: Extending your target retirement age from {ret_age} to {min(65, ret_age + 3)} will give your investments more time to compound and substantially increase your readiness score."
        )
        
    return recommendations
