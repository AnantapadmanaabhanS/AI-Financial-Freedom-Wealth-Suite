import React, { useState, useEffect } from 'react';
import { FinancialProfile, DiagnosticsResponse } from '../types';
import { ENDPOINTS } from '../config/api';
import { Activity, RefreshCw, AlertCircle, Cpu, CheckCircle2, ShieldAlert, Sparkles, Target } from 'lucide-react';

interface HealthDiagnosticsPageProps {
  userProfile: FinancialProfile;
}

export const HealthDiagnosticsPage: React.FC<HealthDiagnosticsPageProps> = ({ userProfile }) => {
  const [data, setData] = useState<DiagnosticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagnostics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ENDPOINTS.HEALTH_DIAGNOSTICS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });

      const result: DiagnosticsResponse = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        setError('Failed to evaluate financial health diagnostics.');
      }
    } catch (err) {
      setError('Backend API unavailable. Ensure Flask API is running on http://127.0.0.1:5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, [userProfile]);

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-400 bg-amber-950/80 border border-amber-800/60 rounded-full uppercase">
              ◐ Analytical Engine
            </span>
            <span className="text-xs text-slate-400 font-medium">Diagnostic Cashflow Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Health Diagnostics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Scans cashflow drag, expense velocity, and emergency reserve buffers to provide 90-day actionable micro-goals.
          </p>
        </div>

        <button
          onClick={fetchDiagnostics}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-scan Cashflow</span>
        </button>
      </div>

      {loading ? (
        <div className="glass-card p-12 rounded-2xl text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-amber-500/10 text-amber-400 animate-pulse">
            <Cpu className="h-8 w-8 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-white">Running Health Diagnostics...</h3>
          <p className="text-xs text-slate-400">Analyzing income-to-expense burn ratios and liquidity buffers.</p>
        </div>
      ) : error ? (
        <div className="glass-card p-6 rounded-2xl border-rose-500/40 bg-rose-950/20 text-rose-300 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            <span>Diagnostics Failed</span>
          </div>
          <p className="text-xs text-rose-200">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Insights Section */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-400" />
              <span>Cashflow Health & Friction Insights</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {data?.insights && data.insights.length > 0 ? (
                data.insights.map((insight, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                    <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-slate-300 font-medium">{insight}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400">
                  No critical cashflow friction detected. Maintain current expense control.
                </div>
              )}
            </div>
          </div>

          {/* 90-Day Micro-Goals Section */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-400" />
              <span>90-Day Strategic Micro-Goals Roadmap</span>
            </h3>

            <div className="space-y-3 text-xs">
              {data?.micro_goals && data.micro_goals.length > 0 ? (
                data.micro_goals.map((goal, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </div>
                    <div className="pt-0.5">
                      <p className="text-white font-semibold">{goal}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Execute within the next 90 days to enhance compounding efficiency.</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400">
                  Your portfolio is operating efficiently. No urgent 90-day adjustments required.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
