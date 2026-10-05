import React from 'react';
import { ShieldCheck, Cpu, Activity } from 'lucide-react';

interface NavbarProps {
  apiStatus: 'online' | 'offline' | 'checking';
}

export const Navbar: React.FC<NavbarProps> = ({ apiStatus }) => {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">RetireAI</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 rounded-full uppercase">
                  ML Suite
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Decentralized Retirement Intelligence</p>
            </div>
          </div>

          {/* Right Status Indicator */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>SHA-256 Record Integrity</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <Activity className={`h-3.5 w-3.5 ${apiStatus === 'online' ? 'text-emerald-400 animate-pulse' : 'text-rose-400'}`} />
              <span className="text-slate-300 font-medium">
                {apiStatus === 'online' && 'ML API Ready'}
                {apiStatus === 'offline' && 'API Offline (Port 5000)'}
                {apiStatus === 'checking' && 'Connecting API...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
