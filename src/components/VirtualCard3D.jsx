import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

const VisaLogoSvg = () => (
  <svg viewBox="0 0 100 32" className="h-4 sm:h-5 w-auto drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M38.86 1.77L25.4 30.51h-8.68L3.25 7.64C2.17 6.13 1.04 5.37 0 4.88v-0.65h14.28c1.84 0 3.49 1.23 3.9 3.35l3.52 18.66L30.2 1.77h8.66zm26.43 19.57c0.07-5.5-4.48-7.79-8.42-9.74-2.69-1.33-4.32-2.22-4.32-3.57 0-1.22 1.39-2.51 4.39-2.51 2.5 0 4.32 0.54 5.75 1.15l1.03-4.83c-1.42-0.57-3.66-1.07-6.52-1.07-6.89 0-11.75 3.66-11.79 8.92-0.07 3.88 3.46 6.04 6.11 7.34 2.73 1.33 3.65 2.19 3.63 3.39-0.03 1.84-2.21 2.68-4.25 2.68-2.83 0-4.46-0.45-6.86-1.5l-1.18 5.48c1.51 0.7 4.3 1.3 7.21 1.33 6.9 0 11.39-3.41 11.45-8.91zM84.14 1.77h-6.72c-2.08 0-3.64 0.6-4.54 2.75l-12.87 30.68h9.13l1.82-5.04h11.16l1.05 5.04h8.05L84.14 1.77zm-8.81 21.05l3.66-9.92 2.11 9.92h-5.77zM50.41 1.77L43.27 30.51h8.7L59.1 1.77h-8.69z" fill="#FFFFFF"/>
    <path d="M14.28 0.68H0v0.65c2.59 0.65 5.56 1.72 7.35 2.92 1.04 0.7 1.35 1.1 1.69 2.45l6.32 23.81h8.72L37.54 0.68H14.28z" fill="#F7B600"/>
  </svg>
);

const MastercardLogoSvg = () => (
  <svg viewBox="0 0 100 60" className="h-5 sm:h-6 w-auto drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
    <circle cx="36" cy="30" r="26" fill="#EB001B" />
    <circle cx="64" cy="30" r="26" fill="#F79E1B" />
    <path d="M50 10.37A25.86 25.86 0 0 0 39.53 30 25.86 25.86 0 0 0 50 49.63 25.86 25.86 0 0 0 60.47 30 25.86 25.86 0 0 0 50 10.37Z" fill="#FF5F00" />
  </svg>
);

export const VirtualCard3D = ({ suite, activeBrand }) => {
  const [flipped, setFlipped] = useState(false);

  // Safe fallback for holderNames and digits
  const holderName = (suite && suite.holderNames && suite.holderNames[activeBrand]) || "DEEPMARKET VIP";
  const digits = (suite && suite.digits && suite.digits[activeBrand]) || "8888";

  const getBrandLogo = () => {
    if (suite && suite.network === 'mastercard') {
      return <MastercardLogoSvg />;
    }
    if (activeBrand === 'mastercard') {
      return <MastercardLogoSvg />;
    }
    if (activeBrand === 'rupay') {
      return <span className="font-black italic text-xs text-sky-400 tracking-tight">RuPay</span>;
    }
    return <VisaLogoSvg />;
  };

  return (
    <div 
      className="[perspective:1000px] w-full aspect-[1.58/1] relative cursor-pointer select-none mb-4 group"
      onClick={() => setFlipped(!flipped)}
      title="Click to flip card"
    >
      <div 
        className={`w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* FRONT OF CARD WITH USER'S CLEANED IMAGE BACKGROUND (BORDERLESS) */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl border-0 flex flex-col justify-between [backface-visibility:hidden] [-webkit-backface-visibility:hidden] overflow-hidden shadow-2xl bg-cover bg-center"
          style={{
            backgroundImage: suite.image ? `url("${suite.image}")` : 'none',
            backgroundColor: '#0a0d18'
          }}
        >
          {/* Subtle Dark Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 pointer-events-none" />

          {/* Top Row: EMV Chip & Network Brand Logo */}
          <div className="flex justify-between items-center z-10 p-3 sm:p-4">
            <div className="w-8 sm:w-10 h-6 sm:h-7 rounded-md bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 border-0 shadow-md relative flex items-center justify-center overflow-hidden shrink-0">
              <div className="w-full h-[1px] bg-amber-900/50 absolute top-1/2 -translate-y-1/2" />
              <div className="h-full w-[1px] bg-amber-900/50 absolute left-[35%]" />
              <div className="h-full w-[1px] bg-amber-900/50 absolute right-[35%]" />
              <div className="w-2.5 sm:w-3.5 h-2 sm:h-2.5 rounded-[2px] bg-yellow-300/90 z-10" />
            </div>
            {getBrandLogo()}
          </div>

          {/* Middle Row: Masked Card Number */}
          <div className="z-10 px-3 sm:px-4 my-auto">
            <p className="font-mono text-xs sm:text-sm tracking-[0.2em] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              •••• •••• •••• {digits}
            </p>
          </div>

          {/* Bottom Row: Cardholder & Expiry */}
          <div className="flex justify-between items-end z-10 p-3 sm:p-4">
            <div className="min-w-0 pr-2">
              <p className="text-[7px] uppercase tracking-wider text-zinc-300 font-semibold drop-shadow">Card Holder</p>
              <p className="font-mono text-[10px] sm:text-xs font-bold text-white truncate max-w-[120px] sm:max-w-[150px] uppercase drop-shadow">
                {holderName}
              </p>
            </div>
            <div>
              <p className="text-[7px] uppercase tracking-wider text-zinc-300 font-semibold drop-shadow">Valid Thru</p>
              <p className="font-mono text-[10px] sm:text-xs font-bold text-white drop-shadow">{suite.expiry}</p>
            </div>
          </div>

          {/* Flip Hint */}
          <div className="absolute top-2 right-2 text-[8px] text-white/60 flex items-center gap-1 z-20 opacity-70 group-hover:opacity-100 transition-opacity bg-black/40 px-1.5 py-0.5 rounded-full backdrop-blur-xs">
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Flip</span>
          </div>
        </div>

        {/* BACK OF CARD (BORDERLESS) */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl border-0 flex flex-col justify-between [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden shadow-2xl bg-cover bg-center"
          style={{
            backgroundImage: suite.image ? `url("${suite.image}")` : 'none',
            backgroundColor: '#0a0d18'
          }}
        >
          <div className="absolute inset-0 bg-black/75 pointer-events-none" />

          {/* Black Magnetic Stripe */}
          <div className="w-full h-7 sm:h-9 bg-[#05070a] mt-4 shadow-inner z-10" />

          {/* Signature & CVV Bar */}
          <div className="px-4 z-10">
            <div className="w-full bg-slate-100 rounded-lg p-1.5 flex items-center justify-between shadow-inner">
              <div className="h-3 sm:h-4 flex-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded mr-3 opacity-70" />
              <div className="text-right shrink-0 pr-1">
                <span className="block text-[6px] font-bold text-slate-500 uppercase tracking-wider">CVV</span>
                <span className="font-mono text-[10px] sm:text-xs font-black text-slate-900 tracking-widest">***</span>
              </div>
            </div>
          </div>

          {/* Back Footer */}
          <div className="px-4 pb-3 flex justify-between items-center text-[9px] text-white/70 z-10">
            <span className="font-mono text-[8px]">DEEPMARKET ENCLAVE</span>
            <div className="flex items-center gap-1">
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Tap to flip back</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
