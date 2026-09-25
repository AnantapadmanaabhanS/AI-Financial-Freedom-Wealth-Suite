import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from src.generate_dataset import generate_retirement_dataset
from src.data_preprocessing import clean_dataset, build_preprocessor_pipeline, NUMERICAL_COLS, CATEGORICAL_COLS
from src.feature_engineering import add_financial_features, ENGINEERED_FEATURE_NAMES
from src.train_retirement import train_retirement_models
from src.train_risk import train_risk_models
from src.evaluate import save_metrics
from src.explainability import get_feature_importances
from src.scenario_simulator import calculate_retirement_metrics, simulate_scenarios
from src.monte_carlo import run_monte_carlo_simulation

# Configure plot styling
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams.update({'font.size': 11, 'figure.dpi': 300, 'savefig.dpi': 300})

def generate_all_visualizations(df, reg_results, risk_results, best_reg_pipe, reg_data, best_risk_pipe, risk_data, fig_dir):
    os.makedirs(fig_dir, exist_ok=True)
    
    # 1. Dataset Distributions
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    sns.histplot(df['age'], kde=True, ax=axes[0, 0], color='skyblue')
    axes[0, 0].set_title('Age Distribution')
    
    sns.histplot(df['monthly_income'], kde=True, ax=axes[0, 1], color='lightgreen')
    axes[0, 1].set_title('Monthly Income (INR) Distribution')
    
    sns.histplot(df['current_savings'], kde=True, ax=axes[1, 0], color='salmon')
    axes[1, 0].set_title('Current Savings (INR) Distribution')
    
    sns.countplot(data=df, x='risk_tolerance', ax=axes[1, 1], palette='crest')
    axes[1, 1].set_title('Risk Tolerance Count')
    plt.tight_layout()
    plt.savefig(os.path.join(fig_dir, 'fig1_dataset_distributions.png'))
    plt.close()
    
    # 2. Correlation Heatmap
    num_cols = ['age', 'monthly_income', 'monthly_expenses', 'current_savings', 'existing_investments', 'required_corpus']
    plt.figure(figsize=(10, 8))
    sns.heatmap(df[num_cols].corr(), annot=True, cmap='coolwarm', fmt=".2f", linewidths=0.5)
    plt.title('Feature Correlation Heatmap')
    plt.tight_layout()
    plt.savefig(os.path.join(fig_dir, 'fig2_correlation_heatmap.png'))
    plt.close()
    
    # 3. Target Distribution (Required Corpus)
    plt.figure(figsize=(9, 5))
    sns.histplot(df['required_corpus'] / 1e7, kde=True, color='purple')
    plt.title('Target Distribution: Required Retirement Corpus (Crores INR)')
    plt.xlabel('Required Corpus (in Crores INR)')
    plt.ylabel('Frequency')
    plt.tight_layout()
    plt.savefig(os.path.join(fig_dir, 'fig3_target_distribution.png'))
    plt.close()
    
    # 4. System Architecture Diagram Generator
    fig, ax = plt.subplots(figsize=(12, 6))
    ax.axis('off')
    box_props = dict(boxstyle='round,pad=0.5', facecolor='whitesmoke', edgecolor='navy', linewidth=2)
    arrow_props = dict(arrowstyle='->', lw=2, color='navy')
    
    ax.text(0.08, 0.5, "Input Profile\n(Age, Income, Savings,\nRisk, Goals)", bbox=box_props, ha='center', va='center')
    ax.annotate('', xy=(0.23, 0.5), xytext=(0.17, 0.5), arrowprops=arrow_props)
    
    ax.text(0.33, 0.5, "Preprocessing &\nFeature Engineering\n(ColumnTransformer,\nPipeline)", bbox=box_props, ha='center', va='center')
    ax.annotate('', xy=(0.48, 0.5), xytext=(0.42, 0.5), arrowprops=arrow_props)
    
    ax.text(0.58, 0.5, "ML Engines\n(Retirement Regressor,\nRisk Classifier,\nIsolation Forest)", bbox=box_props, ha='center', va='center')
    ax.annotate('', xy=(0.73, 0.5), xytext=(0.67, 0.5), arrowprops=arrow_props)
    
    ax.text(0.88, 0.5, "Output Dashboard\n(Corpus, Gap, Score,\nScenarios, SHA256)", bbox=box_props, ha='center', va='center')
    plt.title("System Architecture Pipeline (Figure 4.1)", fontsize=14, fontweight='bold')
    plt.savefig(os.path.join(fig_dir, 'fig4_system_architecture.png'))
    plt.close()
    
    # 5. Baseline vs Improved Model Comparison Bar Chart
    models_reg = [m for m in reg_results.keys()]
    r2_scores = [reg_results[m]['R2'] for m in models_reg]
    
    plt.figure(figsize=(9, 5))
    bars = plt.barh(models_reg, r2_scores, color=['gray', 'cornflowerblue', 'royalblue', 'mediumblue', 'darkblue'])
    plt.xlabel('R² Score on Test Set')
    plt.title('Regression Models R² Score Comparison (Figure 6.1)')
    plt.xlim(0, 1.05)
    for bar in bars:
        width = bar.get_width()
        plt.text(width + 0.01, bar.get_y() + bar.get_height()/2, f'{width:.4f}', ha='left', va='center')
    plt.tight_layout()
    plt.savefig(os.path.join(fig_dir, 'fig5_baseline_vs_improved_model.png'))
    plt.close()
    
    # 6. Prediction vs Actual Scatter Plot
    X_test_reg, y_test_reg, y_pred_reg = reg_data
    plt.figure(figsize=(8, 6))
    plt.scatter(y_test_reg / 1e7, y_pred_reg / 1e7, alpha=0.5, color='teal')
    max_val = max(y_test_reg.max(), y_pred_reg.max()) / 1e7
    plt.plot([0, max_val], [0, max_val], 'r--', lw=2, label='Perfect Prediction Line')
    plt.xlabel('Actual Required Corpus (Crores INR)')
    plt.ylabel('Predicted Required Corpus (Crores INR)')
    plt.title('Prediction vs Actual Required Corpus (Figure 6.2)')
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(fig_dir, 'fig6_prediction_vs_actual.png'))
    plt.close()
    
    # 7. Residual Plot
    residuals = y_test_reg - y_pred_reg
    plt.figure(figsize=(8, 5))
    plt.scatter(y_pred_reg / 1e7, residuals / 1e6, alpha=0.5, color='crimson')
    plt.axhline(0, color='black', linestyle='--', lw=1.5)
    plt.xlabel('Predicted Corpus (Crores INR)')
    plt.ylabel('Residuals (Lakhs INR)')
    plt.title('Model Residual Plot')
    plt.tight_layout()
    plt.savefig(os.path.join(fig_dir, 'fig7_residual_plot.png'))
    plt.close()
    
    # 8. Feature Importance Plot
    num_cols_all = NUMERICAL_COLS + ENGINEERED_FEATURE_NAMES
    cat_cols_all = CATEGORICAL_COLS
    all_feature_names = num_cols_all + cat_cols_all
    df_imp = get_feature_importances(best_reg_pipe, all_feature_names)
    
    if not df_imp.empty:
        plt.figure(figsize=(10, 6))
        top_imp = df_imp.head(10)
        sns.barplot(data=top_imp, x='Importance', y='Feature', palette='viridis')
        plt.title('Top 10 Feature Importances - Retirement Model (Figure 6.3)')
        plt.tight_layout()
        plt.savefig(os.path.join(fig_dir, 'fig8_feature_importance.png'))
        plt.close()
        
    # 9. Confusion Matrix for Risk Profile Classifier
    X_test_risk, y_test_risk, y_pred_risk = risk_data
    cm = risk_results['Random Forest Classifier']['Confusion_Matrix'] if 'Random Forest Classifier' in risk_results else risk_results[list(risk_results.keys())[0]]['Confusion_Matrix']
    labels = sorted(list(set(y_test_risk)))
    
    plt.figure(figsize=(7, 5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels)
    plt.title('Risk Classifier Confusion Matrix (Figure 6.4)')
    plt.xlabel('Predicted Risk Profile')
    plt.ylabel('Actual Risk Profile')
    plt.tight_layout()
    plt.savefig(os.path.join(fig_dir, 'fig9_confusion_matrix.png'))
    plt.close()
    
    # 10. Sample Funding Gap Visualization
    sample_user = df.iloc[0].to_dict()
    metrics = calculate_retirement_metrics(
        age=sample_user['age'],
        retirement_age=sample_user['retirement_age'],
        monthly_income=sample_user['monthly_income'],
        monthly_expenses=sample_user['monthly_expenses'],
        current_savings=sample_user['current_savings'],
        existing_investments=sample_user['existing_investments'],
        desired_monthly_ret_inc=sample_user['desired_monthly_retirement_income'],
        expected_inflation=sample_user['expected_inflation_rate'],
        expected_roi=sample_user['expected_roi']
    )
    
    plt.figure(figsize=(7, 5))
    categories = ['Required Corpus', 'Projected Corpus', 'Funding Gap']
    values = [metrics['required_corpus']/1e7, metrics['projected_corpus']/1e7, metrics['funding_gap']/1e7]
    bars = plt.bar(categories, values, color=['#1f77b4', '#2ca02c', '#d62728'])
    plt.ylabel('Amount (Crores INR)')
    plt.title('Sample User Funding Gap Analysis (Figure 6.5)')
    for bar in bars:
        yval = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2, yval + 0.02, f'₹{yval:.2f} Cr', ha='center', va='bottom')
    plt.tight_layout()
    plt.savefig(os.path.join(fig_dir, 'fig10_funding_gap_visualization.png'))
    plt.close()
    
    # 11. What-If Scenario Comparison Bar Chart
    df_scenarios = simulate_scenarios(sample_user)
    plt.figure(figsize=(9, 5))
    x = np.arange(len(df_scenarios))
    width = 0.35
    plt.bar(x - width/2, df_scenarios['Required Corpus (INR)'] / 1e7, width, label='Required Corpus', color='steelblue')
    plt.bar(x + width/2, df_scenarios['Projected Corpus (INR)'] / 1e7, width, label='Projected Corpus', color='mediumseagreen')
    plt.xlabel('Scenario Timeline')
    plt.ylabel('Corpus (Crores INR)')
    plt.title('Scenario Analysis Across Retirement Ages')
    plt.xticks(x, df_scenarios['Scenario'])
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(fig_dir, 'fig11_scenario_comparison.png'))
    plt.close()
    
    # 12. Monte Carlo Distribution
    sample_user['required_corpus'] = metrics['required_corpus']
    mc_results, mc_summary = run_monte_carlo_simulation(sample_user, num_simulations=2000)
    plt.figure(figsize=(9, 5))
    sns.histplot(mc_results / 1e7, kde=True, color='darkorange', bins=40)
    plt.axvline(metrics['required_corpus'] / 1e7, color='red', linestyle='--', lw=2, label=f"Required Target: ₹{metrics['required_corpus']/1e7:.2f} Cr")
    plt.axvline(mc_summary['median_projected_corpus'] / 1e7, color='green', linestyle='-', lw=2, label=f"Median Projected: ₹{mc_summary['median_projected_corpus']/1e7:.2f} Cr")
    plt.title(f"Monte Carlo Retirement Corpus Distribution (Figure 6.6)\nSuccess Probability: {mc_summary['probability_of_success']}%")
    plt.xlabel('Projected Corpus at Retirement (Crores INR)')
    plt.ylabel('Simulation Frequency')
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(fig_dir, 'fig12_monte_carlo_distribution.png'))
    plt.close()
    
    print(f"Generated all 12 figures successfully in {fig_dir}")

def main():
    print("=== STARTING END-TO-END MODEL TRAINING & EVALUATION ===")
    
    os.makedirs(r"d:\Java Project\models", exist_ok=True)
    os.makedirs(r"d:\Java Project\results\metrics", exist_ok=True)
    os.makedirs(r"d:\Java Project\results\tables", exist_ok=True)
    os.makedirs(r"d:\Java Project\results\figures", exist_ok=True)
    
    raw_data_path = r"d:\Java Project\data\raw\retirement_financial_data.csv"
    if not os.path.exists(raw_data_path):
        df_raw = generate_retirement_dataset(num_samples=2500, seed=42)
        os.makedirs(os.path.dirname(raw_data_path), exist_ok=True)
        df_raw.to_csv(raw_data_path, index=False)
    else:
        df_raw = pd.read_csv(raw_data_path)
        
    df = clean_dataset(df_raw)
    print(f"Loaded and cleaned dataset: {df.shape[0]} rows, {df.shape[1]} columns")
    
    # Save preprocessing pipeline
    preprocessor = build_preprocessor_pipeline(
        num_cols=NUMERICAL_COLS + ENGINEERED_FEATURE_NAMES,
        cat_cols=CATEGORICAL_COLS
    )
    df_feat = add_financial_features(df)
    feature_cols = NUMERICAL_COLS + CATEGORICAL_COLS + ENGINEERED_FEATURE_NAMES
    X = df_feat[feature_cols]
    preprocessor.fit(X)
    joblib.dump(preprocessor, r"d:\Java Project\models\preprocessing_pipeline.joblib")
    
    # Train Retirement Regression Models
    print("\n--- Training Retirement Corpus Regression Models ---")
    reg_results, best_reg_pipe, reg_data = train_retirement_models(df)
    
    # Train Risk Classification Models
    print("\n--- Training Risk Profiling Classification Models ---")
    risk_results, best_risk_pipe, risk_data = train_risk_models(df)
    
    # Combine & Save Metrics
    all_metrics = {
        'Dataset': {
            'samples': df.shape[0],
            'features': df.shape[1],
            'target_regression': 'required_corpus',
            'target_classification': 'risk_profile'
        },
        'Regression_Models': reg_results,
        'Classification_Models': risk_results
    }
    
    metrics_json_path = r"d:\Java Project\results\metrics\model_results.json"
    save_metrics(all_metrics, metrics_json_path)
    
    # Save metrics as CSV tables
    reg_df = pd.DataFrame(reg_results).T[['MAE', 'RMSE', 'R2', 'CV_R2_Mean']]
    reg_df.to_csv(r"d:\Java Project\results\tables\table_6_1_model_evaluation_results.csv")
    
    # Generate Visualizations
    fig_dir = r"d:\Java Project\results\figures"
    generate_all_visualizations(df, reg_results, risk_results, best_reg_pipe, reg_data, best_risk_pipe, risk_data, fig_dir)
    
    print("\n=== TRAINING & EVALUATION COMPLETED SUCCESSFULLY ===")

if __name__ == '__main__':
    main()
