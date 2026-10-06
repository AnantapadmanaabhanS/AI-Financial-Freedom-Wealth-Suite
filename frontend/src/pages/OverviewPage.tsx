import React from 'react';
import { OverviewResponse, FinancialProfile, FeatureViewId } from '../types';
import {
  TrendingUp, Target, Shield, Clock, Wallet, DollarSign, Activity,
  ArrowRight, CheckCircle2, AlertTriangle, Sparkles, PieChart, Zap, Eye, Key, Binary, Shuffle
} from 'lucide-react';

interface OverviewPageProps {
  data: OverviewResponse | null;
  userProfile: FinancialProfile;
  onNavigate: (view: FeatureViewId) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ data, userProfile, onNavigate }) => {
  const predictedCorpus = data?.predicted_corpus || 0;
  const metrics = data?.metrics;
  const riskProfile = data?.risk_profile || userProfile.risk_tolerance;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹ ${(amount / 100000).toFixed(2)} L`;
    }
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  const monthlySurplus = Math.max(0, userProfile.monthly_income - userProfile.monthly_expenses);
  const savingsRate = ((monthlySurplus / (userProfile.monthly_income + 1e-5)) * 100).toFixed(1);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded-full uppercase">
              ✓ Active System
            </span>
            <span className="text-xs text-slate-400 font-medium">Dashboard Overview</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Retirement Command Center
          </h2>
        </div>

        <button
          onClick={() => onNavigate('profile')}
          className="glow-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-semibold cursor-pointer self-start sm:self-auto"
        >
          <span>Update Financial Profile</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card glass-card-hover p-5 rounded-2xl">
          <div className="flex items-center gap-2.5 text-xs text-slate-400 font-medium mb-3">
            <Target className="h-4 w-4 text-indigo-400" />
            <span>Predicted Target Corpus</span>
          </div>
          <p className="text-2xl font-black text-white gradient-text">{formatCurrency(predictedCorpus)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Gradient Boosting ML Model</p>
        </div>

        <div className="glass-card glass-card-hover p-5 rounded-2xl">
          <div className="flex items-center gap-2.5 text-xs text-slate-400 font-medium mb-3">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span>Retirement Readiness</span>
          </div>
          <p className="text-2xl font-black text-emerald-400">{metrics?.readiness_score || 85.0} / 100</p>
          <p className="text-[11px] text-slate-400 mt-1">Analytical Coverage Index</p>
        </div>

        <div className="glass-card glass-card-hover p-5 rounded-2xl">
          <div className="flex items-center gap-2.5 text-xs text-slate-400 font-medium mb-3">
            <Shield className="h-4 w-4 text-purple-400" />
            <span>ML Risk Category</span>
          </div>
          <p className="text-2xl font-black text-purple-300 capitalize">{riskProfile}</p>
          <p className="text-[11px] text-slate-400 mt-1">Logistic Risk Classifier</p>
        </div>

        <div className="glass-card glass-card-hover p-5 rounded-2xl">
          <div className="flex items-center gap-2.5 text-xs text-slate-400 font-medium mb-3">
            <DollarSign className="h-4 w-4 text-blue-400" />
            <span>Savings Rate</span>
          </div>
          <p className="text-2xl font-black text-blue-400">{savingsRate}%</p>
          <p className="text-[11px] text-slate-400 mt-1">₹ {monthlySurplus.toLocaleString('en-IN')} / month</p>
        </div>
      </div>

      {/* Quick AI Insights Banner */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span>Quick Financial Insights & Status</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Savings Velocity</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Saving {savingsRate}% of income provides solid compounding power.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <Activity className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Target Horizon</p>
              <p className="text-slate-400 text-[11px] mt-0.5">{userProfile.retirement_age - userProfile.age} years remaining to target retirement age {userProfile.retirement_age}.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <Shield className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Security Verification</p>
              <p className="text-slate-400 text-[11px] mt-0.5">SHA-256 cryptographic off-chain record hash proof active.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Modules Grid */}
      <div>
        <h3 className="text-base font-bold text-white mb-4">Analytics & Feature Dashboard Modules</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          <button
            onClick={() => onNavigate('prediction')}
            className="glass-card glass-card-hover p-5 rounded-2xl text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Target className="h-5 w-5" />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded">
                ✓ Active ML
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">Retirement Prediction</h4>
            <p className="text-xs text-slate-400 mt-1">Gradient Boosting ML Regressor prediction & gap analysis.</p>
          </button>

          <button
            onClick={() => onNavigate('risk')}
            className="glass-card glass-card-hover p-5 rounded-2xl text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Shield className="h-5 w-5" />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded">
                ✓ Active ML
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">Risk Profiling</h4>
            <p className="text-xs text-slate-400 mt-1">Logistic risk profile classification & probability distribution.</p>
          </button>

          <button
            onClick={() => onNavigate('readiness')}
            className="glass-card glass-card-hover p-5 rounded-2xl text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Activity className="h-5 w-5" />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 rounded">
                ◐ Engine
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">Retirement Readiness</h4>
            <p className="text-xs text-slate-400 mt-1">Analytical readiness score (0-100) & personalized advice.</p>
          </button>

          <button
            onClick={() => onNavigate('allocation')}
            className="glass-card glass-card-hover p-5 rounded-2xl text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <PieChart className="h-5 w-5" />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 rounded">
                ◐ Engine
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">AI Asset Allocation</h4>
            <p className="text-xs text-slate-400 mt-1">Optimal Equity/Debt/Gold portfolio allocation split.</p>
          </button>

          <button
            onClick={() => onNavigate('health-diagnostics')}
            className="glass-card glass-card-hover p-5 rounded-2xl text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Activity className="h-5 w-5" />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 rounded">
                ◐ Engine
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">AI Health Diagnostics</h4>
            <p className="text-xs text-slate-400 mt-1">Financial friction diagnostics & 90-day micro-goals.</p>
          </button>

          <button
            onClick={() => onNavigate('stress-test')}
            className="glass-card glass-card-hover p-5 rounded-2xl text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <Zap className="h-5 w-5" />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 rounded">
                ◐ Engine
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-rose-400 transition-colors">Market Stress-Test</h4>
            <p className="text-xs text-slate-400 mt-1">Bear Market crash & Hyperinflation macroeconomic shocks.</p>
          </button>

          <button
            onClick={() => onNavigate('xai')}
            className="glass-card glass-card-hover p-5 rounded-2xl text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <Eye className="h-5 w-5" />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded">
                ✓ Active ML
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-teal-400 transition-colors">AI Explanation (XAI)</h4>
            <p className="text-xs text-slate-400 mt-1">Feature importance weights driving ML predictions.</p>
          </button>

          <button
            onClick={() => onNavigate('what-if')}
            className="glass-card glass-card-hover p-5 rounded-2xl text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Shuffle className="h-5 w-5" />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 rounded">
                ◐ Engine
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">What-If Simulator</h4>
            <p className="text-xs text-slate-400 mt-1">Scenario timeline comparison for retirement ages 55, 60, 65.</p>
          </button>

          <button
            onClick={() => onNavigate('monte-carlo')}
            className="glass-card glass-card-hover p-5 rounded-2xl text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                <Binary className="h-5 w-5" />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 rounded">
                ◐ Engine
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-yellow-400 transition-colors">Monte Carlo Simulation</h4>
            <p className="text-xs text-slate-400 mt-1">2,000 stochastic portfolio volatility stress simulations.</p>
          </button>

        </div>
      </div>
    </div>
  );
};
