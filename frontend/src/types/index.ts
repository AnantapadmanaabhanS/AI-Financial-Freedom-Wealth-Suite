export interface FinancialProfile {
  age: number;
  gender: 'Male' | 'Female';
  marital_status: 'Single' | 'Married';
  dependents: number;
  monthly_income: number;
  monthly_expenses: number;
  current_savings: number;
  existing_investments: number;
  retirement_age: number;
  desired_monthly_retirement_income: number;
  risk_tolerance: 'Low' | 'Medium' | 'High';
  expected_inflation_rate: number;
  expected_roi: number;
}

export interface PredictionMetrics {
  years_to_retirement: number;
  future_monthly_expense: number;
  required_corpus: number;
  projected_corpus: number;
  funding_gap: number;
  funded_percentage: number;
  readiness_score: number;
}

export interface PredictionResponse {
  success: boolean;
  predicted_corpus: number;
  Future_Corpus: number;
  required_corpus: number;
  risk_profile: string;
  metrics: PredictionMetrics;
  error?: string;
  details?: string[];
}
