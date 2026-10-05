import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PlannerForm } from './components/PlannerForm';
import { PredictionResults } from './components/PredictionResults';
import { ErrorAlert } from './components/ErrorAlert';
import { FinancialProfile, PredictionResponse } from './types';
import { ENDPOINTS } from './config/api';

export const App: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [submittedProfile, setSubmittedProfile] = useState<FinancialProfile | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Check Flask API health on initial load
  useEffect(() => {
    checkApiHealth();
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

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (profile: FinancialProfile) => {
    setIsLoading(true);
    setError(null);
    setPredictionResult(null);
    setSubmittedProfile(profile);

    try {
      const response = await fetch(ENDPOINTS.PREDICT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      const data: PredictionResponse = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.details?.join(', ') || `Server error (HTTP ${response.status})`;
        setError(errorMsg);
        setApiStatus('offline');
      } else if (data.success && (data.predicted_corpus || data.Future_Corpus || data.required_corpus)) {
        setPredictionResult(data);
        setApiStatus('online');
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setError('Malformed response received from ML prediction API.');
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(
        'Unable to connect to the Flask ML Backend API at http://127.0.0.1:5000/predict. Please ensure the backend server is running.'
      );
      setApiStatus('offline');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPredictionResult(null);
    setError(null);
    handleScrollToForm();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar apiStatus={apiStatus} />

      <main className="flex-1 pb-20">
        <Hero onScrollToForm={handleScrollToForm} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
          {/* Input Form Section */}
          <div ref={formRef} className="pt-4">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Enter Financial Parameters
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Fill in your current cashflow, savings, and retirement goals to request a prediction from the ML backend.
              </p>
            </div>

            <PlannerForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="pt-4">
              <ErrorAlert message={error} onRetry={checkApiHealth} />
            </div>
          )}

          {/* Results Dashboard Section */}
          {predictionResult && submittedProfile && (
            <div ref={resultsRef} className="pt-8">
              <PredictionResults
                result={predictionResult}
                submittedProfile={submittedProfile}
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4">
          <p>© 2026 RetireAI - Autonomous Machine Learning Retirement Suite</p>
          <p className="mt-1 text-[11px] text-slate-600">
            Model: Gradient Boosting Regressor (R² = 0.9895) | Flask Backend API: http://127.0.0.1:5000/predict
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
