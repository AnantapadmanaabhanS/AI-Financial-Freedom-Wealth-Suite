import React, { useState, useEffect } from 'react';
import { FinancialProfile, ReadinessResponse } from '../types';
import { ENDPOINTS } from '../config/api';
import { Activity, RefreshCw, AlertCircle, Cpu, CheckCircle2, TrendingUp, Sparkles, ShieldAlert } from 'lucide-react';

interface RetirementReadinessPageProps {
  userProfile: FinancialProfile;
}

export const RetirementReadinessPage: React.FC<RetirementReadinessPageProps> = ({ userProfile }) => {
  const [data, setData] = useState<ReadinessResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReadiness = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ENDPOINTS.READINESS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });

      const result: ReadinessResponse = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        setError('Failed to calculate retirement readiness score.');
      }
    } catch (err) {
      setError('Backend API unavailable. Ensure Flask API is running on http://127.0.0.1:5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadiness();
  }, [userProfile]);

  const score = data?.metrics?.readiness_score || 85.0;
  const fundedPct = data?.metrics?.funded_percentage || 85.0;

  const getStatusBadge = (s: number) => {
    if (s >= 80) return { label: 'Optimal Readiness', color: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60' };
    if (s >= 60) return { label: 'Moderate Coverage', color: 'text-amber-400 bg-amber-950/80 border-amber-800/60' };
    return { label: 'Action Required', color: 'text-rose-400 bg-rose-950/80 border-rose-800/60' };
  };

  const status = getStatusBadge(score);

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 rounded-full uppercase">
              ◐ Analytical Engine
            </span>
            <span className="text-xs text-slate-400 font-medium">Readiness Metric Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Retirement Readiness Index
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Calculates your target corpus sufficiency, cashflow resilience, and years-to-goal compounding index.
          </p>
        </div>

        <button
          onClick={fetchReadiness}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Recalculate Index</span>
        </button>
      </div>

      {loading ? (
        <div className="glass-card p-12 rounded-2xl text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-emerald-500/10 text-emerald-400 animate-pulse">
            <Cpu className="h-8 w-8 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-white">Computing Readiness Index...</h3>
          <p className="text-xs text-slate-400">Synthesizing funding coverage and cashflow longevity.</p>
        </div>
      ) : error ? (
        <div className="glass-card p-6 rounded-2xl border-rose-500/40 bg-rose-950/20 text-rose-300 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            <span>Calculation Failed</span>
          </div>
          <p className="text-xs text-rose-200">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Readiness Score Big Banner */}
          <div className="glass-card p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${status.color}`}>
                {status.label}
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-white gradient-text">
                {score.toFixed(1)} <span className="text-2xl text-slate-400">/ 100</span>
              </h1>
              <p className="text-xs text-slate-400">
                Your portfolio is projected to fund {fundedPct.toFixed(1)}% of your inflation-adjusted retirement pension goal.
              </p>
            </div>

            {/* Circular Gauge Representation */}
            <div className="relative h-32 w-32 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="54" stroke="#1e293b" strokeWidth="12" fill="transparent" />
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e'}
                  strokeWidth="12"
                  strokeDasharray={339}
                  strokeDashoffset={339 - (339 * Math.min(score, 100)) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-xl font-bold text-white">{Math.round(score)}%</span>
            </div>
          </div>

          {/* Key Strategic Recommendations */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>AI Actionable Recommendations</span>
            </h3>

            <div className="space-y-3 text-xs">
              {data?.recommendations && data.recommendations.length > 0 ? (
                data.recommendations.map((rec, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-slate-200 font-medium">{rec}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400">
                  Maintain current monthly investment pacing to meet your target corpus.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
