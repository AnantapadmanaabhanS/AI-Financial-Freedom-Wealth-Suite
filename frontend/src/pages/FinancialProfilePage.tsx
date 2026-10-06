import React, { useState } from 'react';
import { FinancialProfile, FeatureViewId } from '../types';
import { User, DollarSign, Calendar, Shield, Save, CheckCircle2, ArrowRight } from 'lucide-react';

interface FinancialProfilePageProps {
  userProfile: FinancialProfile;
  onUpdateProfile: (updated: FinancialProfile) => void;
  onNavigate: (view: FeatureViewId) => void;
}

export const FinancialProfilePage: React.FC<FinancialProfilePageProps> = ({
  userProfile,
  onUpdateProfile,
  onNavigate,
}) => {
  const [formData, setFormData] = useState<FinancialProfile>(userProfile);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded-full uppercase">
              ✓ Input Schema
            </span>
            <span className="text-xs text-slate-400 font-medium">Core User Parameters</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Financial Profile Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure your personal, cashflow, and retirement metrics. Updating here syncs all 12 AI analytics engines.
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 rounded-xl text-xs font-medium animate-fadeIn">
            <CheckCircle2 className="h-4 w-4" />
            <span>Profile Saved & Synced Across All Engines!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Demographics & Personal */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm pb-2 border-b border-slate-800">
            <User className="h-4 w-4" />
            <span>1. Demographics & Household</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Current Age</label>
              <input
                type="number"
                name="age"
                min={18}
                max={90}
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-indigo-500 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Marital Status</label>
              <select
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-indigo-500 focus:outline-none"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Dependents</label>
              <input
                type="number"
                name="dependents"
                min={0}
                max={10}
                value={formData.dependents}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Current Cashflow & Assets */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm pb-2 border-b border-slate-800">
            <DollarSign className="h-4 w-4" />
            <span>2. Cashflow & Existing Wealth</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Monthly Gross Income (₹)</label>
              <input
                type="number"
                name="monthly_income"
                min={0}
                step={1000}
                value={formData.monthly_income}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Monthly Living Expenses (₹)</label>
              <input
                type="number"
                name="monthly_expenses"
                min={0}
                step={1000}
                value={formData.monthly_expenses}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Current Cash Savings (₹)</label>
              <input
                type="number"
                name="current_savings"
                min={0}
                step={10000}
                value={formData.current_savings}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Existing Investments (₹)</label>
              <input
                type="number"
                name="existing_investments"
                min={0}
                step={10000}
                value={formData.existing_investments}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Retirement Horizon & Expectations */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm pb-2 border-b border-slate-800">
            <Calendar className="h-4 w-4" />
            <span>3. Retirement Goal Parameters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Target Retirement Age</label>
              <input
                type="number"
                name="retirement_age"
                min={formData.age + 1}
                max={90}
                value={formData.retirement_age}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Desired Monthly Pension (₹)</label>
              <input
                type="number"
                name="desired_monthly_retirement_income"
                min={0}
                step={5000}
                value={formData.desired_monthly_retirement_income}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Self-Reported Risk Preference</label>
              <select
                name="risk_tolerance"
                value={formData.risk_tolerance}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-purple-500 focus:outline-none"
              >
                <option value="Low">Low (Conservative)</option>
                <option value="Medium">Medium (Balanced)</option>
                <option value="High">High (Aggressive)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Expected Inflation Rate (%)</label>
              <input
                type="number"
                name="expected_inflation_rate"
                min={1}
                max={20}
                step={0.5}
                value={formData.expected_inflation_rate}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Expected Portfolio ROI (%)</label>
              <input
                type="number"
                name="expected_roi"
                min={1}
                max={30}
                step={0.5}
                value={formData.expected_roi}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="glow-btn flex items-center gap-2 px-6 py-3 rounded-xl text-white text-xs font-bold cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save & Update All Engines</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('prediction')}
            className="flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <span>Run ML Prediction Model</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
