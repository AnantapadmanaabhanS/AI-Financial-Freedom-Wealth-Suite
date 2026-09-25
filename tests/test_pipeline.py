import sys
import os
import unittest
import pandas as pd
import numpy as np

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from src.data_preprocessing import validate_financial_inputs, clean_dataset
from src.feature_engineering import add_financial_features
from src.scenario_simulator import calculate_retirement_metrics, simulate_scenarios
from src.goal_drift import detect_goal_drift
from src.integrity import generate_record_hash, verify_record_integrity
from src.recommendations import generate_personalized_recommendation

class TestRetirementPlanningPipeline(unittest.TestCase):
    
    def setUp(self):
        self.valid_profile = {
            'age': 35,
            'gender': 'Male',
            'marital_status': 'Married',
            'dependents': 2,
            'monthly_income': 150000.0,
            'monthly_expenses': 80000.0,
            'current_savings': 600000.0,
            'existing_investments': 1500000.0,
            'retirement_age': 60,
            'desired_monthly_retirement_income': 100000.0,
            'risk_tolerance': 'Medium',
            'expected_inflation_rate': 0.06,
            'expected_roi': 0.10
        }
        
    def test_input_validation_valid(self):
        is_valid, errors = validate_financial_inputs(self.valid_profile)
        self.assertTrue(is_valid)
        self.assertEqual(len(errors), 0)
        
    def test_input_validation_invalid(self):
        invalid_prof = self.valid_profile.copy()
        invalid_prof['age'] = 15 # Invalid age
        invalid_prof['retirement_age'] = 30 # Retirement age < current age
        invalid_prof['monthly_income'] = -5000 # Negative income
        
        is_valid, errors = validate_financial_inputs(invalid_prof)
        self.assertFalse(is_valid)
        self.assertGreaterEqual(len(errors), 2)
        
    def test_feature_engineering(self):
        df_single = pd.DataFrame([self.valid_profile])
        df_feat = add_financial_features(df_single)
        
        self.assertIn('savings_rate', df_feat.columns)
        self.assertIn('expense_ratio', df_feat.columns)
        self.assertIn('years_to_retirement', df_feat.columns)
        self.assertEqual(df_feat['years_to_retirement'].iloc[0], 25)
        self.assertAlmostEqual(df_feat['savings_rate'].iloc[0], 70000.0 / 150000.0, places=4)
        
    def test_retirement_metrics_calculation(self):
        metrics = calculate_retirement_metrics(
            age=self.valid_profile['age'],
            retirement_age=self.valid_profile['retirement_age'],
            monthly_income=self.valid_profile['monthly_income'],
            monthly_expenses=self.valid_profile['monthly_expenses'],
            current_savings=self.valid_profile['current_savings'],
            existing_investments=self.valid_profile['existing_investments'],
            desired_monthly_ret_inc=self.valid_profile['desired_monthly_retirement_income'],
            expected_inflation=self.valid_profile['expected_inflation_rate'],
            expected_roi=self.valid_profile['expected_roi']
        )
        
        self.assertGreater(metrics['required_corpus'], 0)
        self.assertGreater(metrics['projected_corpus'], 0)
        self.assertGreaterEqual(metrics['readiness_score'], 0)
        self.assertLessEqual(metrics['readiness_score'], 100)
        
    def test_scenario_simulator(self):
        df_scenarios = simulate_scenarios(self.valid_profile)
        self.assertEqual(len(df_scenarios), 3) # Ages 55, 60, 65
        self.assertIn('Required Corpus (INR)', df_scenarios.columns)
        
    def test_goal_drift_detection(self):
        res_ontrack = detect_goal_drift(original_target_corpus=10000000, current_projected_corpus=9800000, threshold_pct=15.0)
        self.assertFalse(res_ontrack['drift_detected'])
        
        res_drift = detect_goal_drift(original_target_corpus=10000000, current_projected_corpus=7000000, threshold_pct=15.0)
        self.assertTrue(res_drift['drift_detected'])
        self.assertEqual(res_drift['status'], 'CRITICAL_DRIFT')
        
    def test_cryptographic_integrity(self):
        hash_val = generate_record_hash(self.valid_profile)
        is_valid, current_hash = verify_record_integrity(self.valid_profile, hash_val)
        self.assertTrue(is_valid)
        self.assertEqual(hash_val, current_hash)
        
        # Tamper test
        tampered_prof = self.valid_profile.copy()
        tampered_prof['monthly_income'] = 999999.0
        is_valid_tamper, _ = verify_record_integrity(tampered_prof, hash_val)
        self.assertFalse(is_valid_tamper)
        
    def test_recommendations_generation(self):
        metrics = calculate_retirement_metrics(
            age=self.valid_profile['age'],
            retirement_age=self.valid_profile['retirement_age'],
            monthly_income=self.valid_profile['monthly_income'],
            monthly_expenses=self.valid_profile['monthly_expenses'],
            current_savings=self.valid_profile['current_savings'],
            existing_investments=self.valid_profile['existing_investments'],
            desired_monthly_ret_inc=self.valid_profile['desired_monthly_retirement_income'],
            expected_inflation=self.valid_profile['expected_inflation_rate'],
            expected_roi=self.valid_profile['expected_roi']
        )
        recs = generate_personalized_recommendation(self.valid_profile, metrics, 'Medium')
        self.assertGreater(len(recs), 0)

if __name__ == '__main__':
    unittest.main()
