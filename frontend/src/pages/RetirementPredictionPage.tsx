import React, { useState, useEffect } from 'react';
import { FinancialProfile, PredictionResponse } from '../types';
import { ENDPOINTS } from '../config/api';
import { Target, TrendingUp, Cpu, RefreshCw, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RetirementPredictionPageProps {
  userProfile: FinancialProfile;
}

export const RetirementPredictionPage: React.FC<RetirementPredictionPageProps> = ({ userProfile }) => {
  const [data, setData] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ENDPOINTS.PREDICT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });

      const result: PredictionResponse = await res.json();
      if (res.ok && result.success) {
        setData(result);
      } else {
        setError(result.error || 'Failed to generate ML retirement prediction.');
      }
    } catch (err) {
      setError('Backend API unavailable. Ensure Flask API is running on http://127.0.0.1:5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, [userProfile]);

  const formatCurrency = (amt: number) => {
    if (amt >= 10000000) return `₹ ${(amt / 10000000).toFixed(2)} Cr`;
    if (amt >= 100000) return `₹ ${(amt / 100000).toFixed(2)} L`;
    return `₹ ${amt.toLocaleString('en-IN')}`;
  };

  const predicted = data?.predicted_corpus || data?.Future_Corpus || 0;
  const required = data?.required_corpus || data?.metrics?.required_corpus || 0;
  const gap = data?.metrics?.funding_gap || Math.max(0, required - predicted);
  const fundedPct = data?.metrics?.funded_percentage || (required > 0 ? (predicted / required) * 100 : 100);

  const chartData = [
    { name: 'Projected ML Corpus', value: predicted, fill: '#6366f1' },
    { name: 'Required Corpus Goal', value: required, fill: '#a855f7' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded-full uppercase">
              ✓ Active ML Model
            </span>
            <span className="text-xs text-slate-400 font-medium">Gradient Boosting Regressor</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Retirement Corpus ML Prediction
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time inference using trained scikit-learn Gradient Boosting model trained on financial compounding trajectories.
          </p>
        </div>

        <button
          onClick={fetchPrediction}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-run Prediction</span>
        </button>
      </div>

      {loading ? (
        <div className="glass-card p-12 rounded-2xl text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-indigo-500/10 text-indigo-400 animate-pulse">
            <Cpu className="h-8 w-8 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-white">Running ML Regressor Inference...</h3>
          <p className="text-xs text-slate-400">Evaluating 14 feature parameters across model trees.</p>
        </div>
      ) : error ? (
        <div className="glass-card p-6 rounded-2xl border-rose-500/40 bg-rose-950/20 text-rose-300 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            <span>Prediction Failed</span>
          </div>
          <p className="text-xs text-rose-200">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Big Result Card */}
          <div className="glass-card p-8 rounded-3xl relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Target className="h-48 w-48 text-indigo-400" />
            </div>

            <div className="relative z-10 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Predicted Accumulation at Age {userProfile.retirement_age}
              </span>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-3">
                <h1 className="text-4xl sm:text-5xl font-black text-white gradient-text tracking-tight">
                  {formatCurrency(predicted)}
                </h1>
                <span className="text-sm font-semibold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60">
                  {fundedPct.toFixed(1)}% Goal Coverage
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Required Corpus Goal</span>
                  <span className="text-base font-bold text-white">{formatCurrency(required)}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Funding Surplus / Gap</span>
                  <span className={`text-base font-bold ${gap > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {gap > 0 ? `- ${formatCurrency(gap)}` : 'Fully Funded (+ Surplus)'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Investment Horizon</span>
                  <span className="text-base font-bold text-white">
                    {userProfile.retirement_age - userProfile.age} Years ({userProfile.age} → {userProfile.retirement_age})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart & Metrics Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recharts Bar Chart */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                <span>Projected vs Required Corpus Comparison</span>
              </h3>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={10}
                      tickFormatter={(val) => `₹ ${(val / 10000000).toFixed(1)}Cr`}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(val: any) => [formatCurrency(Number(val) || 0), 'Amount']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Model Architecture Card */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-purple-400" />
                <span>ML Model Architecture & Metadata</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Algorithm</span>
                  <span className="font-bold text-white">Gradient Boosting Regressor</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Coefficient of Determination (R²)</span>
                  <span className="font-bold text-emerald-400">0.9895 (98.95% Accuracy)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Feature Dimensions</span>
                  <span className="font-bold text-indigo-400">14 Core Financial Vectors</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Inference Endpoint</span>
                  <span className="font-mono text-[11px] text-purple-300">POST http://127.0.0.1:5000/predict</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
