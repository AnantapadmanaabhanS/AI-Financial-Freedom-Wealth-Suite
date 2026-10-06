import React, { useState, useEffect } from 'react';
import { FinancialProfile, AssetAllocationResponse } from '../types';
import { ENDPOINTS } from '../config/api';
import { PieChart as PieIcon, RefreshCw, AlertCircle, Cpu, DollarSign, Wallet, Shield } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AssetAllocationPageProps {
  userProfile: FinancialProfile;
}

export const AssetAllocationPage: React.FC<AssetAllocationPageProps> = ({ userProfile }) => {
  const [data, setData] = useState<AssetAllocationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ENDPOINTS.ALLOCATION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });

      const result: AssetAllocationResponse = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        setError('Failed to compute asset allocation breakdown.');
      }
    } catch (err) {
      setError('Backend API unavailable. Ensure Flask API is running on http://127.0.0.1:5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocation();
  }, [userProfile]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'];

  const pieData = data?.allocation_percentages
    ? Object.entries(data.allocation_percentages).map(([name, value]) => ({
        name,
        value,
      }))
    : [
        { name: 'Equity', value: 60 },
        { name: 'Debt / Fixed Income', value: 25 },
        { name: 'Gold & Commodities', value: 10 },
        { name: 'Liquid FDs & Cash', value: 5 },
      ];

  const formatCurrency = (amt: number) => `₹ ${Math.round(amt).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 rounded-full uppercase">
              ◐ Analytical Engine
            </span>
            <span className="text-xs text-slate-400 font-medium">Asset Allocation Optimizer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Asset Allocation Strategy
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Optimized portfolio asset split and monthly Systematic Investment Plan (SIP) routing tailored to your risk profile ({data?.risk_profile_used || userProfile.risk_tolerance}).
          </p>
        </div>

        <button
          onClick={fetchAllocation}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-optimize Split</span>
        </button>
      </div>

      {loading ? (
        <div className="glass-card p-12 rounded-2xl text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-blue-500/10 text-blue-400 animate-pulse">
            <Cpu className="h-8 w-8 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-white">Computing Optimal Allocation...</h3>
          <p className="text-xs text-slate-400">Distributing monthly cashflow surplus across asset classes.</p>
        </div>
      ) : error ? (
        <div className="glass-card p-6 rounded-2xl border-rose-500/40 bg-rose-950/20 text-rose-300 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            <span>Optimization Failed</span>
          </div>
          <p className="text-xs text-rose-200">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Chart & Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recharts Pie Donut Chart */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieIcon className="h-4 w-4 text-indigo-400" />
                <span>Asset Percentage Breakdown (%)</span>
              </h3>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Allocation']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Allocation Percentages Cards */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>Target Asset Split Weights</span>
              </h3>

              <div className="space-y-3 text-xs">
                {pieData.map((item, idx) => (
                  <div key={item.name} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-slate-300 font-semibold">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly SIP Breakdown Card */}
          {data?.sip_breakdown && (
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wallet className="h-4 w-4 text-amber-400" />
                <span>Recommended Monthly SIP Routing (Surplus: {formatCurrency(data.sip_breakdown.total_available_surplus)})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40">
                  <span className="text-slate-400 block font-medium">Equity SIP</span>
                  <span className="text-lg font-black text-indigo-400">{formatCurrency(data.sip_breakdown.equity_sip)}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Growth & Inflation Hedges</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                  <span className="text-slate-400 block font-medium">Debt / Bonds SIP</span>
                  <span className="text-lg font-black text-emerald-400">{formatCurrency(data.sip_breakdown.debt_sip)}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Fixed Income Stability</span>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40">
                  <span className="text-slate-400 block font-medium">Gold / Precious Metals</span>
                  <span className="text-lg font-black text-amber-400">{formatCurrency(data.sip_breakdown.gold_sip)}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Systemic Shock Buffer</span>
                </div>

                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40">
                  <span className="text-slate-400 block font-medium">Liquid FDs / Reserve</span>
                  <span className="text-lg font-black text-blue-400">{formatCurrency(data.sip_breakdown.liquid_sip)}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Emergency Cash Cushion</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
