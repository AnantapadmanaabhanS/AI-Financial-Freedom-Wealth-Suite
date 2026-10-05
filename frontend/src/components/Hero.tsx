import React from 'react';
import { Sparkles, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onScrollToForm: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToForm }) => {
  return (
    <div className="relative overflow-hidden pt-12 pb-16 border-b border-slate-800/60">
      {/* Background Lighting Glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[200px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Gradient Boosting ML Engine (R² = 0.9895)</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Autonomous AI-Powered <br />
          <span className="gradient-text">Retirement Planning</span>
        </h1>

        <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-10">
          Predict your future required retirement corpus using our trained machine learning model.
          Ingests personal financial parameters, inflation expectations, and investment horizons to deliver data-driven decision support.
        </p>

        {/* Feature Pill Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
            <TrendingUp className="h-5 w-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">Corpus Prediction</p>
              <p className="text-[11px] text-slate-400">Gradient Boosting ML Model</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">Risk Classification</p>
              <p className="text-[11px] text-slate-400">Logistic Classifier (93.4%)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
            <ShieldAlert className="h-5 w-5 text-purple-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">Readiness Score</p>
              <p className="text-[11px] text-slate-400">Analytical Gap Index</p>
            </div>
          </div>
        </div>

        <button
          onClick={onScrollToForm}
          className="glow-btn inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-sm cursor-pointer"
        >
          <span>Calculate Your AI Retirement Plan</span>
          <TrendingUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
