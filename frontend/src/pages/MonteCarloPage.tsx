import React, { useState, useEffect } from 'react';
import { FinancialProfile, MonteCarloResponse } from '../types';
import { ENDPOINTS } from '../config/api';
import { Binary, RefreshCw, AlertCircle, Cpu, TrendingUp, ShieldCheck, Activity, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MonteCarloPageProps {
  userProfile: FinancialProfile;
}

export const MonteCarloPage: React.FC<MonteCarloPageProps> = ({ userProfile }) => {
  const [data, setData] = useState<MonteCarloResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonteCarlo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ENDPOINTS.MONTE_CARLO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });

      const result: MonteCarloResponse = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        setError('Failed to execute Monte Carlo stochastic simulation.');
      }
    } catch (err) {
      setError('Backend API unavailable. Ensure Flask API is running on http://127.0.0.1:5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonteCarlo();
  }, [userProfile]);

  const formatCurrency = (amt: number) => {
    if (amt >= 10000000) return `₹ ${(amt / 10000000).toFixed(2)} Cr`;
    if (amt >= 100000) return `₹ ${(amt / 100000).toFixed(2)} L`;
    return `₹ ${Math.round(amt).toLocaleString('en-IN')}`;
  };

  const chartData = data?.chart_points
    ? data.chart_points.map((pt) => ({
        bin: formatCurrency(pt.bin),
        Frequency: pt.count,
      }))
    : [];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-yellow-400 bg-yellow-950/80 border border-yellow-800/60 rounded-full uppercase">
              ◐ Analytical Engine
            </span>
            <span className="text-xs text-slate-400 font-medium">Stochastic Simulation Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Monte Carlo Simulation (2,000 Runs)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulates 2,000 independent random market return trajectories to compute confidence intervals and probability of goal attainment.
          </p>
        </div>

        <button
          onClick={fetchMonteCarlo}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-run 2,000 Trails</span>
        </button>
      </div>

      {loading ? (
        <div className="glass-card p-12 rounded-2xl text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-yellow-500/10 text-yellow-400 animate-pulse">
            <Cpu className="h-8 w-8 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-white">Running 2,000 Stochastic Iterations...</h3>
          <p className="text-xs text-slate-400">Sampling random Gaussian return distributions across investment horizons.</p>
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
          {/* Key Simulation Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs text-slate-400 block font-medium">Probability of Goal Success</span>
              <p className="text-3xl font-black text-emerald-400 mt-2">
                {data?.summary.probability_of_success.toFixed(1)}%
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Goal Met in {data?.summary.num_simulations} Runs</p>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs text-slate-400 block font-medium">Median Projected Corpus (50th)</span>
              <p className="text-xl font-bold text-white mt-2">
                {formatCurrency(data?.summary.median_projected_corpus || 0)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">50% Probability Expectation</p>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs text-slate-400 block font-medium">Conservative Bound (10th)</span>
              <p className="text-xl font-bold text-amber-400 mt-2">
                {formatCurrency(data?.summary.percentile_10 || 0)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">10% Worst-Case Outcome</p>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs text-slate-400 block font-medium">Optimistic Bound (90th)</span>
              <p className="text-xl font-bold text-indigo-400 mt-2">
                {formatCurrency(data?.summary.percentile_90 || 0)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">90% Bull-Market Outcome</p>
            </div>
          </div>

          {/* Frequency Histogram Chart */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-yellow-400" />
              <span>Stochastic Distribution Frequency Histogram</span>
            </h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <XAxis dataKey="bin" stroke="#94a3b8" fontSize={9} interval={1} angle={-15} textAnchor="end" />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip
                    formatter={(val: any) => [`${val} runs`, 'Frequency']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="Frequency" fill="#eab308" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
