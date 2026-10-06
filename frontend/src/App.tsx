import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FinancialProfile, FeatureViewId, OverviewResponse } from './types';
import { ENDPOINTS } from './config/api';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { FinancialProfilePage } from './pages/FinancialProfilePage';
import { RetirementPredictionPage } from './pages/RetirementPredictionPage';
import { RiskProfilingPage } from './pages/RiskProfilingPage';
import { RetirementReadinessPage } from './pages/RetirementReadinessPage';
import { AssetAllocationPage } from './pages/AssetAllocationPage';
import { HealthDiagnosticsPage } from './pages/HealthDiagnosticsPage';
import { StressTestPage } from './pages/StressTestPage';
import { XaiPage } from './pages/XaiPage';
import { WhatIfPage } from './pages/WhatIfPage';
import { MonteCarloPage } from './pages/MonteCarloPage';
import { IntegrityPage } from './pages/IntegrityPage';

const DEFAULT_PROFILE: FinancialProfile = {
  age: 35,
  gender: 'Male',
  marital_status: 'Married',
  dependents: 2,
  monthly_income: 150000,
  monthly_expenses: 80000,
  current_savings: 500000,
  existing_investments: 1500000,
  retirement_age: 60,
  desired_monthly_retirement_income: 100000,
  risk_tolerance: 'Medium',
  expected_inflation_rate: 6.0,
  expected_roi: 12.0,
};

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<FeatureViewId>('overview');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<FinancialProfile>(DEFAULT_PROFILE);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [overviewData, setOverviewData] = useState<OverviewResponse | null>(null);

  // Initial API health check & Overview fetch
  useEffect(() => {
    checkApiHealth();
    fetchOverviewData(userProfile);
  }, []);

  const checkApiHealth = async () => {
    try {
      setApiStatus('checking');
      const response = await fetch(ENDPOINTS.HEALTH, { method: 'GET' });
      if (response.ok) {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }
    } catch (err) {
      setApiStatus('offline');
    }
  };

  const fetchOverviewData = async (profile: FinancialProfile) => {
    try {
      const res = await fetch(ENDPOINTS.OVERVIEW, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        const data: OverviewResponse = await res.json();
        setOverviewData(data);
        setApiStatus('online');
      }
    } catch (err) {
      console.warn('Overview fetch error:', err);
    }
  };

  const handleUpdateProfile = (updated: FinancialProfile) => {
    setUserProfile(updated);
    fetchOverviewData(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Navbar
          apiStatus={apiStatus}
          onOpenMobile={() => setIsOpenMobile(true)}
          userProfile={userProfile}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'overview' && (
            <OverviewPage data={overviewData} userProfile={userProfile} onNavigate={setCurrentView} />
          )}

          {currentView === 'profile' && (
            <FinancialProfilePage
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'prediction' && <RetirementPredictionPage userProfile={userProfile} />}

          {currentView === 'risk' && <RiskProfilingPage userProfile={userProfile} />}

          {currentView === 'readiness' && <RetirementReadinessPage userProfile={userProfile} />}

          {currentView === 'allocation' && <AssetAllocationPage userProfile={userProfile} />}

          {currentView === 'health-diagnostics' && <HealthDiagnosticsPage userProfile={userProfile} />}

          {currentView === 'stress-test' && <StressTestPage userProfile={userProfile} />}

          {currentView === 'xai' && <XaiPage />}

          {currentView === 'what-if' && <WhatIfPage userProfile={userProfile} />}

          {currentView === 'monte-carlo' && <MonteCarloPage userProfile={userProfile} />}

          {currentView === 'integrity' && <IntegrityPage userProfile={userProfile} />}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <p>© 2026 RetireAI - Autonomous Machine Learning & Financial Intelligence Suite</p>
            <p className="mt-1 text-[11px] text-slate-600">
              Models: Gradient Boosting Regressor (R² = 0.9895) & Logistic Classifier | Flask API: http://127.0.0.1:5000
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
