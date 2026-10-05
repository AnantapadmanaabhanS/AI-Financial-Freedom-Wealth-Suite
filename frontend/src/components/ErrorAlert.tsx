import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry }) => {
  return (
    <div className="p-6 rounded-2xl bg-rose-950/80 border border-rose-800/80 text-rose-200 glass-card animate-fadeIn">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-xl bg-rose-900/60 text-rose-300 shrink-0 mt-0.5">
          <AlertCircle className="h-6 w-6" />
        </div>

        <div className="space-y-2 flex-1">
          <h4 className="font-bold text-base text-white">Prediction Request Failed</h4>
          <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">{message}</p>

          {onRetry && (
            <div className="pt-2">
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
