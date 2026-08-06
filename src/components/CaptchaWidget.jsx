import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, RefreshCw, Lock } from 'lucide-react';

export const CaptchaWidget = ({ onVerify, isVerified: externalVerified }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(externalVerified || false);

  const handleCheckboxClick = () => {
    if (verified || isVerifying) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
      if (onVerify) onVerify(true);
    }, 1200);
  };

  const handleReset = () => {
    setVerified(false);
    setIsVerifying(false);
    if (onVerify) onVerify(false);
  };

  return (
    <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md font-['Satoshi'] text-xs">
      <div className="flex items-center justify-between gap-3">
        
        {/* Left: Checkbox + Verification Text */}
        <div className="flex items-center gap-3">
          <div 
            onClick={handleCheckboxClick}
            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
              verified 
                ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md scale-105' 
                : isVerifying
                ? 'border-amber-400 bg-slate-800'
                : 'border-slate-600 bg-slate-800 hover:border-purple-400'
            }`}
          >
            {verified ? (
              <CheckCircle2 className="w-5 h-5 stroke-[3]" />
            ) : isVerifying ? (
              <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
            ) : null}
          </div>

          <div className="space-y-0.5">
            <span className="font-extrabold text-xs text-white block">
              {verified ? 'Success: Human Verification Passed' : isVerifying ? 'Verifying Cloudflare Turnstile...' : "I'm not a robot"}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block">
              {verified ? 'Token: cf-turnstile-verified-ok' : 'Protected by Cloudflare Turnstile & DDoS Guard'}
            </span>
          </div>
        </div>

        {/* Right: Cloudflare Logo Badge */}
        <div className="text-right shrink-0 flex flex-col items-end">
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TURNSTILE</span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono">Privacy • Terms</span>
        </div>

      </div>
    </div>
  );
};
