import { API_BASE_URL, ENDPOINTS } from '../config/api';
import {
  FinancialProfile,
  PredictionResponse,
  RiskResponse,
  ReadinessResponse,
  AssetAllocationResponse,
  DiagnosticsResponse,
  StressTestResponse,
  ExplainResponse,
  WhatIfResponse,
  MonteCarloResponse,
  IntegrityResponse,
  OverviewResponse,
} from '../types';

export const apiService = {
  async getHealth(): Promise<{ status: string; service: string; models_loaded: Record<string, boolean> }> {
    const res = await fetch(ENDPOINTS.HEALTH);
    return res.json();
  },

  async predictCorpus(profile: FinancialProfile): Promise<PredictionResponse> {
    const res = await fetch(ENDPOINTS.PREDICT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return res.json();
  },

  async getRiskProfile(profile: FinancialProfile): Promise<RiskResponse> {
    const res = await fetch(ENDPOINTS.RISK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return res.json();
  },

  async getReadinessIndex(profile: FinancialProfile): Promise<ReadinessResponse> {
    const res = await fetch(ENDPOINTS.READINESS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return res.json();
  },

  async getAssetAllocation(profile: FinancialProfile): Promise<AssetAllocationResponse> {
    const res = await fetch(ENDPOINTS.ALLOCATION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return res.json();
  },

  async getHealthDiagnostics(profile: FinancialProfile): Promise<DiagnosticsResponse> {
    const res = await fetch(ENDPOINTS.HEALTH_DIAGNOSTICS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return res.json();
  },

  async getStressTest(profile: FinancialProfile): Promise<StressTestResponse> {
    const res = await fetch(ENDPOINTS.STRESS_TEST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return res.json();
  },

  async getExplanation(): Promise<ExplainResponse> {
    const res = await fetch(ENDPOINTS.EXPLAIN);
    return res.json();
  },

  async getWhatIfScenarios(profile: FinancialProfile): Promise<WhatIfResponse> {
    const res = await fetch(ENDPOINTS.WHAT_IF, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return res.json();
  },

  async getMonteCarlo(profile: FinancialProfile): Promise<MonteCarloResponse> {
    const res = await fetch(ENDPOINTS.MONTE_CARLO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return res.json();
  },

  async getIntegrityHash(profile: FinancialProfile): Promise<IntegrityResponse> {
    const res = await fetch(ENDPOINTS.INTEGRITY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return res.json();
  },

  async verifyIntegrity(payload: FinancialProfile, hash: string): Promise<{ valid: boolean; current_hash: string; expected_hash: string }> {
    const res = await fetch(ENDPOINTS.VERIFY_INTEGRITY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload, hash }),
    });
    return res.json();
  },

  async getOverview(profile: FinancialProfile): Promise<OverviewResponse> {
    const res = await fetch(ENDPOINTS.OVERVIEW, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return res.json();
  },
};
