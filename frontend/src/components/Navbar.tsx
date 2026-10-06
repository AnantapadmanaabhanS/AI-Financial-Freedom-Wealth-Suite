import React from 'react';
import { Menu, Activity, ShieldCheck, UserCheck } from 'lucide-react';
import { FinancialProfile } from '../types';

interface NavbarProps {
  apiStatus: 'online' | 'offline' | 'checking';
  onOpenMobile: () => void;
  userProfile: FinancialProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ apiStatus, onOpenMobile, userProfile }) => {
  return (
    <header className="sticky top-0 z-30 h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger button */}
        <button
          onClick={onOpenMobile}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Page Title Context */}
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white tracking-tight">AI Retirement Command Suite</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 rounded-full">
              v2.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Decentralized Machine Learning & Financial Intelligence</p>
        </div>
      </div>

      {/* Right User & System Badges */}
      <div className="flex items-center gap-3">
        {/* Shared User Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <UserCheck className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-slate-300 font-medium">Age {userProfile.age} • Retire @ {userProfile.retirement_age}</span>
        </div>

        {/* Security Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
          <span>SHA-256 Proof</span>
        </div>

        {/* API Health Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <Activity className={`h-3.5 w-3.5 ${apiStatus === 'online' ? 'text-emerald-400 animate-pulse' : 'text-rose-400'}`} />
          <span className="text-slate-300 font-medium">
            {apiStatus === 'online' && 'API Online (Port 5000)'}
            {apiStatus === 'offline' && 'API Offline'}
            {apiStatus === 'checking' && 'Connecting...'}
          </span>
        </div>
      </div>
    </header>
  );
};
