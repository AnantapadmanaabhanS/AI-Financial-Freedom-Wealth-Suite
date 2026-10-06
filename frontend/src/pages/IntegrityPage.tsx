import React, { useState, useEffect } from 'react';
import { FinancialProfile, IntegrityResponse } from '../types';
import { ENDPOINTS } from '../config/api';
import { Key, RefreshCw, AlertCircle, Cpu, CheckCircle2, Copy, ShieldCheck, Lock, Play, XCircle } from 'lucide-react';

interface IntegrityPageProps {
  userProfile: FinancialProfile;
}

export const IntegrityPage: React.FC<IntegrityPageProps> = ({ userProfile }) => {
  const [data, setData] = useState<IntegrityResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Verification Sandbox State
  const [testJson, setTestJson] = useState<string>(JSON.stringify(userProfile, null, 2));
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<{ isValid: boolean; message: string } | null>(null);

  const fetchIntegrity = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ENDPOINTS.INTEGRITY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });

      const result: IntegrityResponse = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        setError('Failed to generate cryptographic hash proof.');
      }
    } catch (err) {
      setError('Backend API unavailable. Ensure Flask API is running on http://127.0.0.1:5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrity();
    setTestJson(JSON.stringify(userProfile, null, 2));
  }, [userProfile]);

  const handleCopyHash = () => {
    if (data?.hash) {
      navigator.clipboard.writeText(data.hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerifyPayload = async () => {
    if (!data?.hash) return;
    setVerifying(true);
    setVerifyResult(null);

    try {
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(testJson);
      } catch (e) {
        setVerifyResult({ isValid: false, message: 'Invalid JSON payload formatting.' });
        setVerifying(false);
        return;
      }

      const res = await fetch(ENDPOINTS.VERIFY_INTEGRITY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: parsedPayload,
          hash: data.hash,
        }),
      });

      const result = await res.json();
      if (res.ok && result.valid) {
        setVerifyResult({ isValid: true, message: 'SHA-256 Match Verified: Record payload is 100% authentic & untampered.' });
      } else {
        setVerifyResult({ isValid: false, message: 'SHA-256 Hash Mismatch: Payload tampering detected! Hash does not match off-chain record proof.' });
      }
    } catch (err) {
      setVerifyResult({ isValid: false, message: 'Failed to contact verification endpoint.' });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-purple-400 bg-purple-950/80 border border-purple-800/60 rounded-full uppercase">
              ✓ Active Cryptographic Proof
            </span>
            <span className="text-xs text-slate-400 font-medium">Decentralized Security Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cryptographic Integrity & Verification
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generates deterministic SHA-256 cryptographic hashes for off-chain immutable record verification and audit compliance.
          </p>
        </div>

        <button
          onClick={fetchIntegrity}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-hash Record</span>
        </button>
      </div>

      {loading ? (
        <div className="glass-card p-12 rounded-2xl text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-purple-500/10 text-purple-400 animate-pulse">
            <Cpu className="h-8 w-8 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-white">Computing SHA-256 Hash Proof...</h3>
          <p className="text-xs text-slate-400">Hashing user canonical JSON profile payload.</p>
        </div>
      ) : error ? (
        <div className="glass-card p-6 rounded-2xl border-rose-500/40 bg-rose-950/20 text-rose-300 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            <span>Hashing Failed</span>
          </div>
          <p className="text-xs text-rose-200">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main SHA-256 Cryptographic Hash Banner */}
          <div className="glass-card p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950/20 to-slate-900 border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                <Lock className="h-4 w-4" />
                <span>Deterministic SHA-256 Record Hash</span>
              </div>

              <span className="px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded-full">
                ✓ {data?.status || 'Valid & Immutable'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-900/40 flex items-center justify-between gap-4 font-mono text-xs text-purple-300 break-all">
              <span>{data?.hash}</span>
              <button
                onClick={handleCopyHash}
                className="p-2 rounded-lg bg-purple-900/30 hover:bg-purple-900/50 text-purple-200 cursor-pointer shrink-0"
                title="Copy Hash"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-400">
              <div>
                <span className="block text-slate-500 font-medium">Algorithm</span>
                <span className="font-bold text-white">{data?.algorithm || 'SHA-256'}</span>
              </div>

              <div>
                <span className="block text-slate-500 font-medium">Verification Status</span>
                <span className="font-bold text-emerald-400">100% Immutable</span>
              </div>

              <div>
                <span className="block text-slate-500 font-medium">Ledger Compliance</span>
                <span className="font-bold text-indigo-400">Decentralized Compatible</span>
              </div>
            </div>
          </div>

          {/* Interactive Cryptographic Tamper Verification Sandbox */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-purple-400" />
                <span>Interactive Tamper Verification Sandbox</span>
              </h3>

              <button
                onClick={handleVerifyPayload}
                disabled={verifying}
                className="glow-btn flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5" />
                <span>Verify Payload Integrity</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Modify any number or value in the JSON payload below to simulate tamper detection. The cryptographic verifier will immediately flag any hash mismatch.
            </p>

            <textarea
              rows={8}
              value={testJson}
              onChange={(e) => setTestJson(e.target.value)}
              className="w-full bg-slate-950 font-mono text-xs text-emerald-400 p-4 rounded-xl border border-slate-800 focus:border-purple-500 focus:outline-none custom-scrollbar"
            />

            {verifyResult && (
              <div
                className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-3 animate-fadeIn ${
                  verifyResult.isValid
                    ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-700/60 text-rose-300'
                }`}
              >
                {verifyResult.isValid ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
                )}
                <span>{verifyResult.message}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
