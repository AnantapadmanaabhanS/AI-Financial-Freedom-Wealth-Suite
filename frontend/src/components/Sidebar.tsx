import React from 'react';
import { FeatureViewId } from '../types';
import {
  LayoutDashboard, User, Target, ShieldCheck, PieChart,
  Activity, Zap, Eye, Shuffle, Binary, Key, ChevronRight, X
} from 'lucide-react';

interface SidebarProps {
  currentView: FeatureViewId;
  onSelectView: (view: FeatureViewId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: FeatureViewId;
  label: string;
  icon: React.ElementType;
  badgeText: string;
  badgeType: 'active' | 'partial' | 'crypto';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard, badgeText: 'Live', badgeType: 'active' },
  { id: 'profile', label: 'Financial Profile', icon: User, badgeText: 'Input', badgeType: 'active' },
  { id: 'prediction', label: 'Retirement Prediction', icon: Target, badgeText: 'ML Model', badgeType: 'active' },
  { id: 'risk', label: 'Risk Profiling', icon: ShieldCheck, badgeText: 'Classifier', badgeType: 'active' },
  { id: 'readiness', label: 'Retirement Readiness', icon: Activity, badgeText: 'Index', badgeType: 'partial' },
  { id: 'allocation', label: 'AI Asset Allocation', icon: PieChart, badgeText: 'Optimizer', badgeType: 'partial' },
  { id: 'health-diagnostics', label: 'AI Health Diagnostics', icon: Activity, badgeText: 'Advisor', badgeType: 'partial' },
  { id: 'stress-test', label: 'Market Stress-Test', icon: Zap, badgeText: 'Shock', badgeType: 'partial' },
  { id: 'xai', label: 'AI Explanation (XAI)', icon: Eye, badgeText: 'XAI Tree', badgeType: 'active' },
  { id: 'what-if', label: 'What-If Simulator', icon: Shuffle, badgeText: 'Scenarios', badgeType: 'partial' },
  { id: 'monte-carlo', label: 'Monte Carlo Simulation', icon: Binary, badgeText: '2K Runs', badgeType: 'partial' },
  { id: 'integrity', label: 'Cryptographic Integrity', icon: Key, badgeText: 'SHA-256', badgeType: 'crypto' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView, isOpenMobile, onCloseMobile }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              R
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white">RetireAI Suite</span>
              <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Command Center</p>
            </div>
          </div>

          <button onClick={onCloseMobile} className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Navigation Analytics
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-lg shadow-indigo-600/20 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeType === 'active'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                        : item.badgeType === 'crypto'
                        ? 'bg-purple-950/80 text-purple-400 border border-purple-800/60'
                        : 'bg-indigo-950/80 text-indigo-400 border border-indigo-800/60'
                    }`}
                  >
                    {item.badgeText}
                  </span>
                  <ChevronRight className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
            <p className="font-semibold text-slate-300">Gradient Boosting ML</p>
            <p className="text-[10px] text-slate-500 mt-0.5">R² = 0.9895 | Flask REST API</p>
          </div>
        </div>
      </aside>
    </>
  );
};
