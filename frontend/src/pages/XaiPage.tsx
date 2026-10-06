import React, { useState, useEffect } from 'react';
import { ExplainResponse } from '../types';
import { ENDPOINTS } from '../config/api';
import { Eye, RefreshCw, AlertCircle, Cpu, BarChart2, HelpCircle, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const XaiPage: React.FC = () => {
  const [data, setData] = useState<ExplainResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExplanation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ENDPOINTS.EXPLAIN, { method: 'GET' });
      const result: ExplainResponse = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        setError('Failed to fetch XAI model feature importances.');
      }
    } catch (err) {
      setError('Backend API unavailable. Ensure Flask API is running on http://127.0.0.1:5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplanation();
  }, []);

  const chartData = data?.top_features
    ? data.top_features.map((item) => ({
        feature: item.Feature.replace(/_/g, ' '),
        importance: Number((item.Importance * 100).toFixed(2)),
      }))
    : [];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded-full uppercase">
              ✓ Active ML Model
            </span>
            <span className="text-xs text-slate-400 font-medium">Explainable AI (XAI) Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Model Explainability (XAI)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Transparent breakdown of decision weights and Gini importance metrics driving the Gradient Boosting Regressor.
          </p>
        </div>

        <button
          onClick={fetchExplanation}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload Weights</span>
        </button>
      </div>

      {loading ? (
        <div className="glass-card p-12 rounded-2xl text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-teal-500/10 text-teal-400 animate-pulse">
            <Cpu className="h-8 w-8 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-white">Extracting Feature Importances...</h3>
          <p className="text-xs text-slate-400">Computing Gini gain importance scores across decision trees.</p>
        </div>
      ) : error ? (
        <div className="glass-card p-6 rounded-2xl border-rose-500/40 bg-rose-950/20 text-rose-300 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            <span>XAI Extraction Failed</span>
          </div>
          <p className="text-xs text-rose-200">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Feature Importance Chart */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="h-4 w-4 text-teal-400" />
              <span>Feature Importance Weight Distribution (%)</span>
            </h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} domain={[0, 'auto']} tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} width={120} />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Gini Importance']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="importance" fill="#14b8a6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Transparency Info */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-indigo-400" />
              <span>How the ML Model Evaluates Your Inputs</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <p className="font-bold text-white">Monthly Investment Capacity</p>
                <p className="text-slate-400 text-[11px]">
                  Highest impact variable. Compounding velocity is exponential over multi-decade horizons.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <p className="font-bold text-white">Expected Portfolio ROI</p>
                <p className="text-slate-400 text-[11px]">
                  Directly inflates long-term terminal corpus calculations across market regimes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <p className="font-bold text-white">Years to Retirement</p>
                <p className="text-slate-400 text-[11px]">
                  Calculated from current age vs retirement target age. Determines compounding steps.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <p className="font-bold text-white">Expected Inflation Rate</p>
                <p className="text-slate-400 text-[11px]">
                  Erodes purchasing power and scales up required target retirement corpus.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
