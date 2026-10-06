import React, { useState, useEffect } from 'react';
import { FinancialProfile, StressTestResponse } from '../types';
import { ENDPOINTS } from '../config/api';
import { Zap, RefreshCw, AlertCircle, Cpu, TrendingDown, Flame, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StressTestPageProps {
  userProfile: FinancialProfile;
}

export const StressTestPage: React.FC<StressTestPageProps> = ({ userProfile }) => {
  const [data, setData] = useState<StressTestResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStressTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ENDPOINTS.STRESS_TEST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });

      const result: StressTestResponse = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        setError('Failed to simulate macroeconomic stress tests.');
      }
    } catch (err) {
      setError('Backend API unavailable. Ensure Flask API is running on http://127.0.0.1:5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStressTest();
  }, [userProfile]);

  const formatCurrency = (amt: number) => {
    if (amt >= 10000000) return `₹ ${(amt / 10000000).toFixed(2)} Cr`;
    if (amt >= 100000) return `₹ ${(amt / 100000).toFixed(2)} L`;
    return `₹ ${Math.round(amt).toLocaleString('en-IN')}`;
  };

  const chartData = data
    ? [
        {
          name: 'Baseline Plan',
          Projected: data.recession_scenario.original_proj,
          Required: data.recession_scenario.original_req,
        },
        {
          name: 'Bear Market (-30%)',
          Projected: data.recession_scenario.shocked_proj,
          Required: data.recession_scenario.shocked_req,
        },
        {
          name: 'Hyperinflation (+3%)',
          Projected: data.hyperinflation_scenario.shocked_proj,
          Required: data.hyperinflation_scenario.shocked_req,
        },
      ]
    : [];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-rose-400 bg-rose-950/80 border border-rose-800/60 rounded-full uppercase">
              ◐ Analytical Engine
            </span>
            <span className="text-xs text-slate-400 font-medium">Macroeconomic Stress-Test Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Market Shock Stress-Test
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulates extreme macroeconomic events including a 30% Bear Market asset crash and a 300 bps Hyperinflation shock.
          </p>
        </div>

        <button
          onClick={fetchStressTest}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Simulate Shocks</span>
        </button>
      </div>

      {loading ? (
        <div className="glass-card p-12 rounded-2xl text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-rose-500/10 text-rose-400 animate-pulse">
            <Cpu className="h-8 w-8 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-white">Simulating Macroeconomic Shocks...</h3>
          <p className="text-xs text-slate-400">Applying market crash vectors and purchasing power erosion models.</p>
        </div>
      ) : error ? (
        <div className="glass-card p-6 rounded-2xl border-rose-500/40 bg-rose-950/20 text-rose-300 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            <span>Simulation Failed</span>
          </div>
          <p className="text-xs text-rose-200">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Scenario Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bear Market Crash */}
            <div className="glass-card p-6 rounded-2xl space-y-4 border-rose-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <TrendingDown className="h-5 w-5" />
                  <span>Bear Market Crash (-30%)</span>
                </div>
                <span className="px-2 py-0.5 text-[9px] font-bold text-rose-400 bg-rose-950/80 border border-rose-800/60 rounded">
                  Equity Shock
                </span>
              </div>

              <p className="text-xs text-slate-400">{data?.recession_scenario.description}</p>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Shocked Projected Corpus:</span>
                  <span className="font-bold text-rose-400">
                    {formatCurrency(data?.recession_scenario.shocked_proj || 0)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Gap Increase:</span>
                  <span className="font-bold text-amber-400">
                    + {formatCurrency(data?.recession_scenario.gap_increase || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Hyperinflation Shock */}
            <div className="glass-card p-6 rounded-2xl space-y-4 border-amber-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Flame className="h-5 w-5" />
                  <span>Hyperinflation Surge (+3%)</span>
                </div>
                <span className="px-2 py-0.5 text-[9px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800/60 rounded">
                  Inflation Shock
                </span>
              </div>

              <p className="text-xs text-slate-400">{data?.hyperinflation_scenario.description}</p>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Shocked Required Goal:</span>
                  <span className="font-bold text-amber-400">
                    {formatCurrency(data?.hyperinflation_scenario.shocked_req || 0)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Target Gap Surge:</span>
                  <span className="font-bold text-rose-400">
                    + {formatCurrency(data?.hyperinflation_scenario.gap_increase || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shock Comparison Chart */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-rose-400" />
              <span>Baseline vs Shocked Corpus Metrics</span>
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
                  <Bar dataKey="Required" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
