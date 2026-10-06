import React, { useState, useEffect } from 'react';
import { FinancialProfile, WhatIfResponse } from '../types';
import { ENDPOINTS } from '../config/api';
import { Shuffle, RefreshCw, AlertCircle, Cpu, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface WhatIfPageProps {
  userProfile: FinancialProfile;
}

export const WhatIfPage: React.FC<WhatIfPageProps> = ({ userProfile }) => {
  const [data, setData] = useState<WhatIfResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWhatIfScenarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ENDPOINTS.WHAT_IF, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });

      const result: WhatIfResponse = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        setError('Failed to compute What-If retirement age scenarios.');
      }
    } catch (err) {
      setError('Backend API unavailable. Ensure Flask API is running on http://127.0.0.1:5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhatIfScenarios();
  }, [userProfile]);

  const formatCurrency = (amt: number) => {
    if (amt >= 10000000) return `₹ ${(amt / 10000000).toFixed(2)} Cr`;
    if (amt >= 100000) return `₹ ${(amt / 100000).toFixed(2)} L`;
    return `₹ ${Math.round(amt).toLocaleString('en-IN')}`;
  };

  const chartData = data?.scenarios
    ? data.scenarios.map((sc) => ({
        name: sc.Scenario,
        Projected: sc['Projected Corpus (INR)'],
        Required: sc['Required Corpus (INR)'],
      }))
    : [];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 rounded-full uppercase">
              ◐ Analytical Engine
            </span>
            <span className="text-xs text-slate-400 font-medium">Scenario Timeline Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            What-If Scenario Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare target corpus requirements and projected accumulations across early (Age 55), standard (Age 60), and delayed (Age 65) retirement horizons.
          </p>
        </div>

        <button
          onClick={fetchWhatIfScenarios}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Simulate Horizons</span>
        </button>
      </div>

      {loading ? (
        <div className="glass-card p-12 rounded-2xl text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-indigo-500/10 text-indigo-400 animate-pulse">
            <Cpu className="h-8 w-8 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-white">Simulating Retirement Age Horizons...</h3>
          <p className="text-xs text-slate-400">Computing inflation-adjusted corpus for Ages 55, 60, and 65.</p>
        </div>
      ) : error ? (
        <div className="glass-card p-6 rounded-2xl border-rose-500/40 bg-rose-950/20 text-rose-300 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            <span>Scenario Simulation Failed</span>
          </div>
          <p className="text-xs text-rose-200">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Comparison Bar Chart */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-400" />
              <span>Projected vs Required Corpus Across Horizons</span>
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
                    formatter={(val: any) => [formatCurrency(Number(val) || 0), 'Corpus Amount']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                  <Bar dataKey="Projected" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Required" fill="#a855f7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scenario Comparison Table */}
          <div className="glass-card p-6 rounded-2xl space-y-4 overflow-x-auto">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-400" />
              <span>Detailed Scenario Matrix</span>
            </h3>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3">Scenario</th>
                  <th className="py-3 px-3">Retire Age</th>
                  <th className="py-3 px-3">Required Goal</th>
                  <th className="py-3 px-3">Projected Accumulation</th>
                  <th className="py-3 px-3">Funding Gap</th>
                  <th className="py-3 px-3">Readiness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data?.scenarios.map((sc, i) => (
                  <tr key={i} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-3 font-bold text-white">{sc.Scenario}</td>
                    <td className="py-3.5 px-3 text-slate-300 font-semibold">{sc['Retirement Age']} yrs</td>
                    <td className="py-3.5 px-3 text-purple-300 font-semibold">{formatCurrency(sc['Required Corpus (INR)'])}</td>
                    <td className="py-3.5 px-3 text-indigo-400 font-extrabold">{formatCurrency(sc['Projected Corpus (INR)'])}</td>
                    <td className={`py-3.5 px-3 font-semibold ${sc['Funding Gap (INR)'] > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {sc['Funding Gap (INR)'] > 0 ? `- ${formatCurrency(sc['Funding Gap (INR)'])}` : 'Surplus'}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 font-bold text-[11px]">
                        {sc['Readiness Score'].toFixed(1)} / 100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
