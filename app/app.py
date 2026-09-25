import sys
import os
import joblib
import pandas as pd
import numpy as np
import streamlit as st
import matplotlib.pyplot as plt
import seaborn as sns

# Add root directory to sys.path to enable importing src modules
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from src.data_preprocessing import validate_financial_inputs, NUMERICAL_COLS, CATEGORICAL_COLS
from src.feature_engineering import add_financial_features, ENGINEERED_FEATURE_NAMES
from src.scenario_simulator import calculate_retirement_metrics, simulate_scenarios
from src.monte_carlo import run_monte_carlo_simulation
from src.goal_drift import detect_goal_drift
from src.integrity import generate_record_hash, verify_record_integrity
from src.recommendations import generate_personalized_recommendation
from src.explainability import get_feature_importances
from src.ai_optimizer import calculate_ai_asset_allocation, generate_ai_financial_diagnostics, simulate_market_shock

st.set_page_config(
    page_title="AI Autonomous Financial Freedom Suite",
    layout="wide"
)

# Inject Custom High-End Professional CSS Animations & Glassmorphism Theme
st.markdown("""
<style>
/* Modern Animation Keyframes */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes pulseBorder {
    0% { border-color: rgba(99, 102, 241, 0.2); }
    50% { border-color: rgba(99, 102, 241, 0.6); }
    100% { border-color: rgba(99, 102, 241, 0.2); }
}

/* Page Smooth Container Animation */
.main .block-container {
    animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    max-width: 1250px;
    padding-top: 1.5rem;
}

/* Metric Cards Decoration */
div[data-testid="stMetric"] {
    background: rgba(30, 41, 59, 0.65) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 12px !important;
    padding: 1.1rem !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

div[data-testid="stMetric"]:hover {
    transform: translateY(-4px) !important;
    border-color: rgba(99, 102, 241, 0.5) !important;
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.2) !important;
}

[data-testid="stMetricValue"] {
    font-size: 1.8rem !important;
    font-weight: 700 !important;
    color: #818cf8 !important;
}

/* Custom Glassmorphism Cards */
.glass-card {
    background: rgba(30, 41, 59, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    animation: fadeIn 0.5s ease-in-out;
}

.glass-card:hover {
    border-color: rgba(99, 102, 241, 0.4);
    transform: translateY(-2px);
}

/* Styled Primary Buttons */
.stButton > button {
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%) !important;
    color: white !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 0.6rem 1.6rem !important;
    font-weight: 600 !important;
    letter-spacing: 0.5px !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3) !important;
}

.stButton > button:hover {
    transform: translateY(-2px) scale(1.01) !important;
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.5) !important;
}

/* Gradient Dividers */
hr {
    border: 0 !important;
    height: 1px !important;
    background: linear-gradient(to right, transparent, rgba(99, 102, 241, 0.5), transparent) !important;
    margin: 1.8rem 0 !important;
}

/* Professional Badge Chips */
.badge-pro {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    display: inline-block;
    margin-bottom: 0.5rem;
}

.badge-ai {
    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    display: inline-block;
    margin-bottom: 0.5rem;
}
</style>
""", unsafe_allow_html=True)

# Load trained models
@st.cache_resource
def load_trained_models():
    model_dir = os.path.join(root_dir, 'models')
    ret_path = os.path.join(model_dir, 'retirement_model.joblib')
    risk_path = os.path.join(model_dir, 'risk_model.joblib')
    prep_path = os.path.join(model_dir, 'preprocessing_pipeline.joblib')
    
    ret_model = joblib.load(ret_path) if os.path.exists(ret_path) else None
    risk_model = joblib.load(risk_path) if os.path.exists(risk_path) else None
    prep_pipeline = joblib.load(prep_path) if os.path.exists(prep_path) else None
    
    return ret_model, risk_model, prep_pipeline

ret_model, risk_model, prep_pipeline = load_trained_models()

# Dashboard Title Banner
st.title("Autonomous AI Financial Freedom & Wealth Suite")
st.markdown('<span class="badge-pro">PROTOTYPE PLATFORM</span> <span class="badge-ai">GRADIENT BOOSTING ML ENGINE</span>', unsafe_allow_html=True)
st.caption("Personalized Machine Learning, Stochastic Stress-Testing & Cryptographic Integrity Engine")
st.markdown("---")

# Sidebar navigation
st.sidebar.title("Navigation Dashboard")
page = st.sidebar.radio(
    "Select Feature View:",
    [
        "Financial Profile",
        "Retirement Prediction",
        "Risk Profiling",
        "Retirement Readiness",
        "AI Asset Allocation Optimizer",
        "AI Health Diagnostics",
        "AI Market Shock Stress-Test",
        "AI Explanation (XAI)",
        "What-If Scenario Simulator",
        "Monte Carlo Simulation",
        "Cryptographic Integrity"
    ]
)

# Initialize Session State
if 'user_profile' not in st.session_state:
    st.session_state['user_profile'] = {
        'age': 32,
        'gender': 'Male',
        'marital_status': 'Married',
        'dependents': 1,
        'monthly_income': 120000.0,
        'monthly_expenses': 65000.0,
        'current_savings': 500000.0,
        'existing_investments': 1200000.0,
        'retirement_age': 60,
        'desired_monthly_retirement_income': 80000.0,
        'risk_tolerance': 'Medium',
        'expected_inflation_rate': 0.06,
        'expected_roi': 0.10
    }

# -------------------------------------------------------------
# PAGE 1: Financial Profile
# -------------------------------------------------------------
if page == "Financial Profile":
    st.header("User Financial Profile & Ingestion")
    st.write("Enter your financial profile parameters below. Inputs are validated dynamically.")
    
    col1, col2 = st.columns(2)
    with col1:
        age = st.number_input("Current Age", min_value=18, max_value=75, value=st.session_state['user_profile']['age'])
        gender = st.selectbox("Gender", ["Male", "Female"], index=0 if st.session_state['user_profile']['gender']=='Male' else 1)
        marital_status = st.selectbox("Marital Status", ["Single", "Married"], index=1 if st.session_state['user_profile']['marital_status']=='Married' else 0)
        dependents = st.number_input("Number of Dependents", min_value=0, max_value=10, value=st.session_state['user_profile']['dependents'])
        monthly_income = st.number_input("Monthly Income (INR)", min_value=10000.0, max_value=2000000.0, value=float(st.session_state['user_profile']['monthly_income']), step=5000.0)
        monthly_expenses = st.number_input("Monthly Expenses (INR)", min_value=5000.0, max_value=1500000.0, value=float(st.session_state['user_profile']['monthly_expenses']), step=2000.0)

    with col2:
        current_savings = st.number_input("Current Liquid Savings (INR)", min_value=0.0, max_value=50000000.0, value=float(st.session_state['user_profile']['current_savings']), step=10000.0)
        existing_investments = st.number_input("Existing Investments (INR)", min_value=0.0, max_value=100000000.0, value=float(st.session_state['user_profile']['existing_investments']), step=25000.0)
        retirement_age = st.number_input("Target Retirement Age", min_value=40, max_value=80, value=st.session_state['user_profile']['retirement_age'])
        desired_ret_inc = st.number_input("Desired Monthly Post-Retirement Income (INR)", min_value=10000.0, max_value=1000000.0, value=float(st.session_state['user_profile']['desired_monthly_retirement_income']), step=5000.0)
        risk_tolerance = st.selectbox("Self-Reported Risk Tolerance", ["Low", "Medium", "High"], index=1)
        expected_inflation = st.slider("Expected Annual Inflation Rate (%)", min_value=3.0, max_value=10.0, value=float(st.session_state['user_profile']['expected_inflation_rate']*100.0)) / 100.0
        expected_roi = st.slider("Expected Annual ROI (%)", min_value=5.0, max_value=18.0, value=float(st.session_state['user_profile']['expected_roi']*100.0)) / 100.0

    if st.button("Save & Validate Profile"):
        profile_dict = {
            'age': age, 'gender': gender, 'marital_status': marital_status, 'dependents': dependents,
            'monthly_income': monthly_income, 'monthly_expenses': monthly_expenses,
            'current_savings': current_savings, 'existing_investments': existing_investments,
            'retirement_age': retirement_age, 'desired_monthly_retirement_income': desired_ret_inc,
            'risk_tolerance': risk_tolerance, 'expected_inflation_rate': expected_inflation, 'expected_roi': expected_roi
        }
        is_valid, errors = validate_financial_inputs(profile_dict)
        if is_valid:
            st.session_state['user_profile'] = profile_dict
            st.success("Profile updated and validated successfully.")
        else:
            for err in errors:
                st.error(f"Input Error: {err}")

# -------------------------------------------------------------
# PAGE 2: Retirement Prediction
# -------------------------------------------------------------
elif page == "Retirement Prediction":
    st.header("Retirement Corpus Prediction & Funding Gap Analysis")
    user_p = st.session_state['user_profile']
    
    metrics = calculate_retirement_metrics(
        age=user_p['age'], retirement_age=user_p['retirement_age'],
        monthly_income=user_p['monthly_income'], monthly_expenses=user_p['monthly_expenses'],
        current_savings=user_p['current_savings'], existing_investments=user_p['existing_investments'],
        desired_monthly_ret_inc=user_p['desired_monthly_retirement_income'],
        expected_inflation=user_p['expected_inflation_rate'], expected_roi=user_p['expected_roi']
    )
    
    df_single = pd.DataFrame([user_p])
    df_feat = add_financial_features(df_single)
    feature_cols = NUMERICAL_COLS + CATEGORICAL_COLS + ENGINEERED_FEATURE_NAMES
    X_single = df_feat[feature_cols]
    
    if ret_model is not None:
        ml_predicted_corpus = ret_model.predict(X_single)[0]
    else:
        ml_predicted_corpus = metrics['required_corpus']
        
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Required Corpus (ML / PV)", f"₹{ml_predicted_corpus/1e7:.2f} Cr")
    c2.metric("Projected Corpus at Ret.", f"₹{metrics['projected_corpus']/1e7:.2f} Cr")
    c3.metric("Funding Shortfall Gap", f"₹{metrics['funding_gap']/1e7:.2f} Cr")
    c4.metric("Funded Goal Target", f"{metrics['funded_percentage']}%")
    
    st.markdown("---")
    st.subheader("Funding Gap Visual Analysis")
    fig, ax = plt.subplots(figsize=(8, 4))
    bars = ax.bar(['Required Corpus', 'Projected Corpus', 'Funding Gap'], 
                  [ml_predicted_corpus/1e7, metrics['projected_corpus']/1e7, metrics['funding_gap']/1e7],
                  color=['#4f46e5', '#10b981', '#ef4444'])
    ax.set_ylabel('Amount (Crores INR)')
    for bar in bars:
        yval = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2, yval + 0.01, f'₹{yval:.2f} Cr', ha='center', va='bottom')
    st.pyplot(fig)

# -------------------------------------------------------------
# PAGE 3: Risk Profiling
# -------------------------------------------------------------
elif page == "Risk Profiling":
    st.header("Risk Profile Classification")
    user_p = st.session_state['user_profile']
    
    df_single = pd.DataFrame([user_p])
    df_feat = add_financial_features(df_single)
    feature_cols = NUMERICAL_COLS + CATEGORICAL_COLS + ENGINEERED_FEATURE_NAMES
    X_single = df_feat[feature_cols]
    
    if risk_model is not None:
        pred_risk = risk_model.predict(X_single)[0]
        probs = risk_model.predict_proba(X_single)[0]
        classes = risk_model.classes_
    else:
        pred_risk = user_p['risk_tolerance']
        probs = [0.2, 0.6, 0.2]
        classes = ['Conservative', 'Moderate', 'Aggressive']
        
    st.info(f"### ML Model Predicted Risk Category: **{pred_risk}**")
    st.write(f"Self-Reported Risk Tolerance: **{user_p['risk_tolerance']}**")
    
    st.subheader("Classification Probability Distribution")
    fig, ax = plt.subplots(figsize=(6, 3.5))
    sns.barplot(x=list(classes), y=probs, ax=ax, palette='Blues_d')
    ax.set_ylabel("Probability")
    st.pyplot(fig)

# -------------------------------------------------------------
# PAGE 4: Retirement Readiness
# -------------------------------------------------------------
elif page == "Retirement Readiness":
    st.header("Retirement Readiness Score & Recommendations")
    user_p = st.session_state['user_profile']
    metrics = calculate_retirement_metrics(
        age=user_p['age'], retirement_age=user_p['retirement_age'],
        monthly_income=user_p['monthly_income'], monthly_expenses=user_p['monthly_expenses'],
        current_savings=user_p['current_savings'], existing_investments=user_p['existing_investments'],
        desired_monthly_ret_inc=user_p['desired_monthly_retirement_income'],
        expected_inflation=user_p['expected_inflation_rate'], expected_roi=user_p['expected_roi']
    )
    
    score = metrics['readiness_score']
    st.metric("Retirement Readiness Score (out of 100)", f"{score} / 100")
    st.progress(int(min(100, score)))
    
    st.subheader("Personalized Financial Advice")
    recs = generate_personalized_recommendation(user_p, metrics, user_p['risk_tolerance'])
    for r in recs:
        r_clean = r.replace("• ", "- ").replace("**", "**")
        st.markdown(r_clean)

# -------------------------------------------------------------
# PAGE 5: AI Asset Allocation Optimizer
# -------------------------------------------------------------
elif page == "AI Asset Allocation Optimizer":
    st.header("AI Asset Allocation & Portfolio Rebalancer")
    st.write("Dynamic asset allocation engine optimized based on user age, ML risk profile, and investment horizon.")
    
    user_p = st.session_state['user_profile']
    df_single = pd.DataFrame([user_p])
    df_feat = add_financial_features(df_single)
    feature_cols = NUMERICAL_COLS + CATEGORICAL_COLS + ENGINEERED_FEATURE_NAMES
    X_single = df_feat[feature_cols]
    pred_risk = risk_model.predict(X_single)[0] if risk_model is not None else user_p['risk_tolerance']
    
    years_to_ret = max(1, user_p['retirement_age'] - user_p['age'])
    alloc = calculate_ai_asset_allocation(user_p['age'], pred_risk, years_to_ret)
    
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Equity Allocation", f"{alloc['Equity']}%")
    c2.metric("Debt / Fixed Income", f"{alloc['Debt / Fixed Income']}%")
    c3.metric("Gold & Commodities", f"{alloc['Gold & Commodities']}%")
    c4.metric("Liquid FDs & Cash", f"{alloc['Liquid FDs & Cash']}%")
    
    st.subheader("Optimal Asset Allocation Split")
    fig, ax = plt.subplots(figsize=(6, 6))
    colors = ['#4f46e5', '#3b82f6', '#f59e0b', '#10b981']
    ax.pie(alloc.values(), labels=alloc.keys(), autopct='%1.1f%%', startangle=140, colors=colors, wedgeprops=dict(width=0.4, edgecolor='w'))
    ax.set_title(f"Recommended Portfolio Split for {pred_risk} Investor (Age {user_p['age']})")
    st.pyplot(fig)
    
    monthly_surplus = max(0, user_p['monthly_income'] - user_p['monthly_expenses']) * 0.70
    st.subheader("Recommended Monthly SIP Contribution Split")
    st.markdown(f"**Total Available Monthly Investment Surplus**: ₹{monthly_surplus:,.2f}")
    st.write(f"- **Equity Funds (Index / FlexiCap)**: ₹{monthly_surplus * (alloc['Equity']/100):,.2f} / month")
    st.write(f"- **Debt Funds / PPF / NPS**: ₹{monthly_surplus * (alloc['Debt / Fixed Income']/100):,.2f} / month")
    st.write(f"- **Sovereign Gold Bond / Gold ETF**: ₹{monthly_surplus * (alloc['Gold & Commodities']/100):,.2f} / month")
    st.write(f"- **Liquid Emergency Buffer**: ₹{monthly_surplus * (alloc['Liquid FDs & Cash']/100):,.2f} / month")

# -------------------------------------------------------------
# PAGE 6: AI Health Diagnostics
# -------------------------------------------------------------
elif page == "AI Health Diagnostics":
    st.header("AI Financial Health Diagnostics & Micro-Goals")
    st.write("Real-time cashflow analysis, financial friction diagnostics, and tailored monthly micro-goals.")
    
    user_p = st.session_state['user_profile']
    metrics = calculate_retirement_metrics(
        age=user_p['age'], retirement_age=user_p['retirement_age'],
        monthly_income=user_p['monthly_income'], monthly_expenses=user_p['monthly_expenses'],
        current_savings=user_p['current_savings'], existing_investments=user_p['existing_investments'],
        desired_monthly_ret_inc=user_p['desired_monthly_retirement_income'],
        expected_inflation=user_p['expected_inflation_rate'], expected_roi=user_p['expected_roi']
    )
    
    insights, micro_goals = generate_ai_financial_diagnostics(user_p, metrics)
    
    st.subheader("AI Diagnostic Observations")
    for ins in insights:
        st.markdown(ins)
        
    st.markdown("---")
    st.subheader("High-Priority Action Plan for Next 90 Days")
    if micro_goals:
        for idx, g in enumerate(micro_goals, 1):
            st.write(f"**Action Step #{idx}**: {g}")
    else:
        st.success("All health metrics optimal. Maintain current automated SIP schedule.")

# -------------------------------------------------------------
# PAGE 7: AI Market Shock Stress-Test
# -------------------------------------------------------------
elif page == "AI Market Shock Stress-Test":
    st.header("AI Macroeconomic Inflation & Market Shock Stress-Test")
    st.write("Simulates market crashes and hyperinflation spikes to evaluate portfolio resilience under economic stress.")
    
    user_p = st.session_state['user_profile']
    metrics = calculate_retirement_metrics(
        age=user_p['age'], retirement_age=user_p['retirement_age'],
        monthly_income=user_p['monthly_income'], monthly_expenses=user_p['monthly_expenses'],
        current_savings=user_p['current_savings'], existing_investments=user_p['existing_investments'],
        desired_monthly_ret_inc=user_p['desired_monthly_retirement_income'],
        expected_inflation=user_p['expected_inflation_rate'], expected_roi=user_p['expected_roi']
    )
    
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Scenario 1: Market Crash & Bear Market")
        shock_rec = simulate_market_shock(user_p, metrics, 'recession')
        st.write(f"**Trigger**: {shock_rec['description']}")
        st.metric("Shocked Required Corpus", f"₹{shock_rec['shocked_req']/1e7:.2f} Cr")
        st.metric("Shocked Projected Corpus", f"₹{shock_rec['shocked_proj']/1e7:.2f} Cr")
        st.error(f"Shortfall Gap Increases by: ₹{shock_rec['gap_increase']/1e5:.2f} Lakhs")

    with col2:
        st.subheader("Scenario 2: Hyperinflation Spike (9.0%)")
        shock_inf = simulate_market_shock(user_p, metrics, 'hyperinflation')
        st.write(f"**Trigger**: {shock_inf['description']}")
        st.metric("Shocked Required Corpus", f"₹{shock_inf['shocked_req']/1e7:.2f} Cr", delta=f"+₹{(shock_inf['shocked_req'] - metrics['required_corpus'])/1e5:.2f} Lakhs", delta_color="inverse")
        st.metric("Shocked Projected Corpus", f"₹{shock_inf['shocked_proj']/1e7:.2f} Cr")
        st.error(f"Required Target Increases by: ₹{(shock_inf['shocked_req'] - metrics['required_corpus'])/1e5:.2f} Lakhs")

# -------------------------------------------------------------
# PAGE 8: AI Explanation (XAI)
# -------------------------------------------------------------
elif page == "AI Explanation (XAI)":
    st.header("Explainable AI (XAI) Feature Importance")
    st.write("Understand which financial parameters drive the machine learning predictions.")
    
    num_cols_all = NUMERICAL_COLS + ENGINEERED_FEATURE_NAMES
    cat_cols_all = CATEGORICAL_COLS
    all_feature_names = num_cols_all + cat_cols_all
    
    if ret_model is not None:
        df_imp = get_feature_importances(ret_model, all_feature_names)
        if not df_imp.empty:
            fig, ax = plt.subplots(figsize=(9, 5))
            sns.barplot(data=df_imp.head(10), x='Importance', y='Feature', ax=ax, palette='viridis')
            ax.set_title("Top 10 Feature Importances (Random Forest Model)")
            st.pyplot(fig)
        else:
            st.info("Feature importance not directly available for this model type.")
    else:
        st.warning("Trained model not loaded.")

# -------------------------------------------------------------
# PAGE 9: What-If Scenario Simulator
# -------------------------------------------------------------
elif page == "What-If Scenario Simulator":
    st.header("What-If Scenario Simulator")
    user_p = st.session_state['user_profile']
    
    df_scenarios = simulate_scenarios(user_p)
    st.table(df_scenarios)
    
    fig, ax = plt.subplots(figsize=(8, 4))
    x = np.arange(len(df_scenarios))
    width = 0.35
    ax.bar(x - width/2, df_scenarios['Required Corpus (INR)'] / 1e7, width, label='Required Corpus', color='#4f46e5')
    ax.bar(x + width/2, df_scenarios['Projected Corpus (INR)'] / 1e7, width, label='Projected Corpus', color='#10b981')
    ax.set_xticks(x)
    ax.set_xticklabels(df_scenarios['Scenario'])
    ax.set_ylabel('Corpus (Crores INR)')
    ax.legend()
    st.pyplot(fig)

# -------------------------------------------------------------
# PAGE 10: Monte Carlo Simulation
# -------------------------------------------------------------
elif page == "Monte Carlo Simulation":
    st.header("Monte Carlo Portfolio Simulation")
    user_p = st.session_state['user_profile']
    metrics = calculate_retirement_metrics(
        age=user_p['age'], retirement_age=user_p['retirement_age'],
        monthly_income=user_p['monthly_income'], monthly_expenses=user_p['monthly_expenses'],
        current_savings=user_p['current_savings'], existing_investments=user_p['existing_investments'],
        desired_monthly_ret_inc=user_p['desired_monthly_retirement_income'],
        expected_inflation=user_p['expected_inflation_rate'], expected_roi=user_p['expected_roi']
    )
    user_p['required_corpus'] = metrics['required_corpus']
    
    n_sims = st.slider("Number of Simulations", 500, 5000, 2000, step=500)
    if st.button("Run Monte Carlo Simulation"):
        mc_results, mc_summary = run_monte_carlo_simulation(user_p, num_simulations=n_sims)
        
        c1, c2, c3 = st.columns(3)
        c1.metric("Median Projected Corpus", f"₹{mc_summary['median_projected_corpus']/1e7:.2f} Cr")
        c2.metric("P10 Pessimistic Corpus", f"₹{mc_summary['percentile_10']/1e7:.2f} Cr")
        c3.metric("Goal Success Probability", f"{mc_summary['probability_of_success']}%")
        
        fig, ax = plt.subplots(figsize=(8, 4))
        sns.histplot(mc_results / 1e7, kde=True, ax=ax, color='#f59e0b', bins=40)
        ax.axvline(metrics['required_corpus'] / 1e7, color='#ef4444', linestyle='--', label=f"Required: ₹{metrics['required_corpus']/1e7:.2f} Cr")
        ax.axvline(mc_summary['median_projected_corpus'] / 1e7, color='#10b981', linestyle='-', label=f"Median: ₹{mc_summary['median_projected_corpus']/1e7:.2f} Cr")
        ax.legend()
        st.pyplot(fig)

# -------------------------------------------------------------
# PAGE 11: Cryptographic Integrity
# -------------------------------------------------------------
elif page == "Cryptographic Integrity":
    st.header("Off-Chain Proof & Cryptographic Integrity Layer")
    st.write("Demonstrates tamper-proof cryptographic hashing of user financial records for off-chain privacy and on-chain verification.")
    
    user_p = st.session_state['user_profile']
    hash_val = generate_record_hash(user_p)
    
    st.subheader("SHA-256 Record Hash Proof")
    st.code(hash_val, language='text')
    
    st.subheader("Integrity Verification Test")
    user_json_str = st.text_area("Financial Record JSON Payload (Editable for Tamper Test)", value=pd.Series(user_p).to_json(indent=2))
    
    if st.button("Verify Hash Integrity"):
        try:
            parsed = pd.read_json(user_json_str, typ='series').to_dict()
            is_valid, current_hash = verify_record_integrity(parsed, hash_val)
            if is_valid:
                st.success("INTEGRITY VERIFIED: Record is authentic and untampered.")
            else:
                st.error("TAMPER DETECTED: The record content has been altered.")
                st.write(f"Current Calculated Hash: `{current_hash}`")
        except Exception as e:
            st.error(f"Invalid JSON Payload: {e}")
