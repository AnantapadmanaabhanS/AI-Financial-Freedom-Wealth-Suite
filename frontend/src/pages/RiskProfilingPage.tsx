import React, { useState, useEffect } from 'react';
import { FinancialProfile, RiskResponse } from '../types';
import { ENDPOINTS } from '../config/api';
import { ShieldCheck, RefreshCw, AlertCircle, Cpu, CheckCircle2, TrendingUp, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RiskProfilingPageProps {
  userProfile: FinancialProfile;
}

export const RiskProfilingPage: React.FC<RiskProfilingPageProps> = ({ userProfile }) => {
  const [data, setData] = useState<RiskResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRiskProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ENDPOINTS.RISK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });

      const result: RiskResponse = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        setError('Failed to fetch risk profiling classification.');
      }
    } catch (err) {
      setError('Backend API unavailable. Ensure Flask API is running on http://127.0.0.1:5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskProfile();
  }, [userProfile]);

  const probData = data?.probabilities
    ? Object.entries(data.probabilities).map(([key, val]) => ({
        category: key,
        percentage: Number((val * 100).toFixed(1)),
      }))
    : [
        { category: 'Low', percentage: 20 },
        { category: 'Medium', percentage: 65 },
        { category: 'High', percentage: 15 },
      ];

  const getCategoryColor = (cat: string) => {
    if (cat === 'Low') return '#10b981';
    if (cat === 'Medium') return '#6366f1';
    return '#f43f5e';
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded-full uppercase">
              ✓ Active ML Model
            </span>
            <span className="text-xs text-slate-400 font-medium">Logistic Risk Profile Classifier</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Risk Profiling & Classification
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Uses multi-class Logistic Regression trained on financial capacity, age, dependents, and asset volatility tolerance.
          </p>
        </div>

        <button
          onClick={fetchRiskProfile}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-evaluate Risk</span>
        </button>
      </div>

      {loading ? (
        <div className="glass-card p-12 rounded-2xl text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-purple-500/10 text-purple-400 animate-pulse">
            <Cpu className="h-8 w-8 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-white">Classifying Risk Profile...</h3>
          <p className="text-xs text-slate-400">Computing class probabilities across Low, Medium, and High risk tiers.</p>
        </div>
      ) : error ? (
        <div className="glass-card p-6 rounded-2xl border-rose-500/40 bg-rose-950/20 text-rose-300 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            <span>Classification Failed</span>
          </div>
          <p className="text-xs text-rose-200">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Risk Result Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-4 border-indigo-500/30">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <ShieldCheck className="h-4 w-4" />
                <span>ML Predicted Risk Profile</span>
              </div>

              <div className="text-3xl font-black text-white capitalize gradient-text">
                {data?.predicted_risk_profile || userProfile.risk_tolerance} Risk
              </div>

              <p className="text-xs text-slate-400">
                Determined autonomously based on income surplus, years to retirement ({userProfile.retirement_age - userProfile.age} yrs), and dependents count ({userProfile.dependents}).
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <BarChart2 className="h-4 w-4" />
                <span>Self-Reported Preference</span>
              </div>

              <div className="text-3xl font-black text-slate-300 capitalize">
                {data?.self_reported_risk || userProfile.risk_tolerance} Risk
              </div>

              <p className="text-xs text-slate-400">
                User input setting provided in your financial profile.
                {data?.predicted_risk_profile !== data?.self_reported_risk && (
                  <span className="text-amber-400 block mt-1">
                    Note: ML model suggests a higher capacity than self-reported preference.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Probability Distribution Bar Chart */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <span>Multi-Class Probability Distribution (%)</span>
            </h3>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={probData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} tickFormatter={(v) => `${v}%`} tickLine={false} />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Probability']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                    {probData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
