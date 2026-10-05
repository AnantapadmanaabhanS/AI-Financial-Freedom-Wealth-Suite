import React, { useState } from 'react';
import { FinancialProfile } from '../types';
import { User, Wallet, Target, Sliders, ArrowRight, Loader2 } from 'lucide-react';

interface PlannerFormProps {
  onSubmit: (profile: FinancialProfile) => void;
  isLoading: boolean;
}

export const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FinancialProfile>({
    age: 32,
    gender: 'Male',
    marital_status: 'Married',
    dependents: 1,
    monthly_income: 120000,
    monthly_expenses: 65000,
    current_savings: 500000,
    existing_investments: 1200000,
    retirement_age: 60,
    desired_monthly_retirement_income: 80000,
    risk_tolerance: 'Medium',
    expected_inflation_rate: 0.06,
    expected_roi: 0.10,
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (field: keyof FinancialProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend validation matching backend src/data_preprocessing.py rules
    if (formData.age < 18 || formData.age > 75) {
      setValidationError('Current age must be between 18 and 75 years.');
      return;
    }

    if (formData.retirement_age <= formData.age) {
      setValidationError(`Retirement age (${formData.retirement_age}) must be greater than current age (${formData.age}).`);
      return;
    }

    if (formData.retirement_age > 80) {
      setValidationError('Target retirement age cannot exceed 80 years.');
      return;
    }

    if (formData.monthly_income <= 0) {
      setValidationError('Monthly income must be greater than zero.');
      return;
    }

    if (formData.monthly_expenses < 0) {
      setValidationError('Monthly expenses cannot be negative.');
      return;
    }

    if (formData.monthly_expenses > formData.monthly_income * 1.5) {
      setValidationError('Monthly expenses exceed 150% of monthly income. Please verify expenses.');
      return;
    }

    if (formData.current_savings < 0 || formData.existing_investments < 0) {
      setValidationError('Savings and investments cannot be negative.');
      return;
    }

    if (formData.desired_monthly_retirement_income <= 0) {
      setValidationError('Desired monthly retirement income must be greater than zero.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {validationError && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-sm font-medium animate-pulse">
          <span>⚠️ {validationError}</span>
        </div>
      )}

      {/* Grid of Input Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Personal Profile */}
        <div className="glass-card glass-card-hover p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Personal Profile</h3>
              <p className="text-xs text-slate-400">Demographic & household parameters</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Age</label>
              <input
                type="number"
                min="18"
                max="75"
                value={formData.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || 18)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value as 'Male' | 'Female')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Marital Status</label>
                <select
                  value={formData.marital_status}
                  onChange={(e) => handleChange('marital_status', e.target.value as 'Single' | 'Married')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Number of Dependents</label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.dependents}
                onChange={(e) => handleChange('dependents', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Income & Current Financials */}
        <div className="glass-card glass-card-hover p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Current Cashflow & Savings</h3>
              <p className="text-xs text-slate-400">Monthly income, expenses & liquid assets</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Monthly Income (₹)</label>
                <input
                  type="number"
                  step="5000"
                  min="10000"
                  value={formData.monthly_income}
                  onChange={(e) => handleChange('monthly_income', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Monthly Expenses (₹)</label>
                <input
                  type="number"
                  step="2000"
                  min="5000"
                  value={formData.monthly_expenses}
                  onChange={(e) => handleChange('monthly_expenses', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Liquid Savings (₹)</label>
              <input
                type="number"
                step="10000"
                min="0"
                value={formData.current_savings}
                onChange={(e) => handleChange('current_savings', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Existing Investments (₹)</label>
              <input
                type="number"
                step="25000"
                min="0"
                value={formData.existing_investments}
                onChange={(e) => handleChange('existing_investments', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Retirement Goals */}
        <div className="glass-card glass-card-hover p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Retirement Timeline & Goal</h3>
              <p className="text-xs text-slate-400">Target retirement age & lifestyle income</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Retirement Age</label>
              <input
                type="number"
                min={formData.age + 1}
                max="80"
                value={formData.retirement_age}
                onChange={(e) => handleChange('retirement_age', parseInt(e.target.value) || 60)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Desired Monthly Retirement Income (₹)</label>
              <input
                type="number"
                step="5000"
                min="10000"
                value={formData.desired_monthly_retirement_income}
                onChange={(e) => handleChange('desired_monthly_retirement_income', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Risk Tolerance Profile</label>
              <select
                value={formData.risk_tolerance}
                onChange={(e) => handleChange('risk_tolerance', e.target.value as 'Low' | 'Medium' | 'High')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Low">Low (Conservative)</option>
                <option value="Medium">Medium (Balanced)</option>
                <option value="High">High (Aggressive)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 4: Macroeconomic Assumptions */}
        <div className="glass-card glass-card-hover p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Macroeconomic Assumptions</h3>
              <p className="text-xs text-slate-400">Expected annual inflation and investment ROI</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                <span>Expected Inflation Rate</span>
                <span className="text-indigo-400 font-bold">{(formData.expected_inflation_rate * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.03"
                max="0.10"
                step="0.005"
                value={formData.expected_inflation_rate}
                onChange={(e) => handleChange('expected_inflation_rate', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                <span>Expected Annual Investment Return (ROI)</span>
                <span className="text-emerald-400 font-bold">{(formData.expected_roi * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.18"
                step="0.005"
                value={formData.expected_roi}
                onChange={(e) => handleChange('expected_roi', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="glow-btn flex items-center gap-3 px-10 py-4 rounded-xl text-white font-semibold text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Running ML Prediction...</span>
            </>
          ) : (
            <>
              <span>Generate AI Retirement Plan</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
