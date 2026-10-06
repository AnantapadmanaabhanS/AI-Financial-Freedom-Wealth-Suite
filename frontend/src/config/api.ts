export const API_BASE_URL = "http://127.0.0.1:5000";

export const ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  PREDICT: `${API_BASE_URL}/predict`,
  RISK: `${API_BASE_URL}/risk`,
  READINESS: `${API_BASE_URL}/readiness`,
  ALLOCATION: `${API_BASE_URL}/allocation`,
  HEALTH_DIAGNOSTICS: `${API_BASE_URL}/health-diagnostics`,
  STRESS_TEST: `${API_BASE_URL}/stress-test`,
  EXPLAIN: `${API_BASE_URL}/explain`,
  WHAT_IF: `${API_BASE_URL}/what-if`,
  MONTE_CARLO: `${API_BASE_URL}/monte-carlo`,
  INTEGRITY: `${API_BASE_URL}/integrity`,
  VERIFY_INTEGRITY: `${API_BASE_URL}/verify-integrity`,
  OVERVIEW: `${API_BASE_URL}/overview`,
};
