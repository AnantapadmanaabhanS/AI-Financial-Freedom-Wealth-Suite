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
  predicted_corpus?: number;
  Future_Corpus?: number;
  required_corpus?: number;
  risk_profile?: string;
  metrics?: PredictionMetrics;
  error?: string;
  details?: string[];
}

export interface RiskResponse {
  predicted_risk_profile: string;
  self_reported_risk: string;
  probabilities: Record<string, number>;
}

export interface ReadinessResponse {
  metrics: PredictionMetrics;
  recommendations: string[];
}

export interface AssetAllocationResponse {
  risk_profile_used: string;
  allocation_percentages: {
    Equity: number;
    'Debt / Fixed Income': number;
    'Gold & Commodities': number;
    'Liquid FDs & Cash': number;
  };
  sip_breakdown: {
    equity_sip: number;
    debt_sip: number;
    gold_sip: number;
    liquid_sip: number;
    total_available_surplus: number;
  };
}

export interface DiagnosticsResponse {
  insights: string[];
  micro_goals: string[];
}

export interface StressTestScenario {
  description: string;
  original_req: number;
  shocked_req: number;
  original_proj: number;
  shocked_proj: number;
  gap_increase: number;
}

export interface StressTestResponse {
  recession_scenario: StressTestScenario;
  hyperinflation_scenario: StressTestScenario;
}

export interface FeatureImportanceItem {
  Feature: string;
  Importance: number;
}

export interface ExplainResponse {
  model_type: string;
  top_features: FeatureImportanceItem[];
}

export interface ScenarioItem {
  Scenario: string;
  'Retirement Age': number;
  'Required Corpus (INR)': number;
  'Projected Corpus (INR)': number;
  'Funding Gap (INR)': number;
  'Funded %': string;
  'Readiness Score': number;
}

export interface WhatIfResponse {
  scenarios: ScenarioItem[];
}

export interface MonteCarloSummary {
  num_simulations: number;
  median_projected_corpus: number;
  percentile_10: number;
  percentile_90: number;
  probability_of_success: number;
}

export interface MonteCarloChartPoint {
  bin: number;
  count: number;
}

export interface MonteCarloResponse {
  summary: MonteCarloSummary;
  chart_points: MonteCarloChartPoint[];
}

export interface IntegrityResponse {
  hash: string;
  status: string;
  algorithm: string;
}

export interface GoalDrift {
  drift_detected: boolean;
  status: string;
  drift_percentage: number;
  threshold_percentage: number;
  message: string;
}

export interface OverviewResponse {
  user_profile: FinancialProfile;
  predicted_corpus: number;
  risk_profile: string;
  metrics: PredictionMetrics;
  allocation: Record<string, number>;
  goal_drift: GoalDrift;
}

export type FeatureViewId =
  | 'overview'
  | 'profile'
  | 'prediction'
  | 'risk'
  | 'readiness'
  | 'allocation'
  | 'health-diagnostics'
  | 'stress-test'
  | 'xai'
  | 'what-if'
  | 'monte-carlo'
  | 'integrity';
