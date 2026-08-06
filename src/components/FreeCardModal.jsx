import React, { useState } from 'react';
import { X, Sparkles, Gift, Copy, CheckCircle, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const FreeCardModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const promoCode = "DEEPMARKET50";

  const handleCopy = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={() => {
          soundEngine.playClick();
          onClose();
        }} 
      />

      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-2 border-purple-300 bg-white z-10 p-6 sm:p-8 text-[#1e1035] space-y-6 animate-fade-in text-center">
        
        {/* Close Button */}
        <button 
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center glass-btn-secondary transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-[#6e5a8e]" />
        </button>

        {/* Gift Icon Header */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-purple-500/25 border-2 border-purple-200">
          <Gift className="w-10 h-10 animate-bounce" />
        </div>

        {/* Banner Copy */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>✨ DeepMarket Gift Unlocked ✨</span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-black text-[#1e1035]">
            DeepMarket Sovereign Trial
          </h3>
          <p className="text-xs font-bold text-purple-700 uppercase tracking-widest font-mono">
            Special Promo Discount Unlocked!
          </p>

          <p className="text-xs sm:text-sm text-[#524170] leading-relaxed bg-purple-50 p-4 rounded-2xl border border-purple-100 font-medium">
            Select any card suite tier starting at <strong>₹1,000 CC price</strong> to get an instant <strong>₹8,320 Balance of Card</strong>! Use coupon code <strong>DEEPMARKET50</strong> for <strong>50% OFF</strong>! 
            <span className="block font-bold text-rose-600 mt-1">
              (Note: This offer is only valid for cards worth over ₹2,500)
            </span>
          </p>
        </div>

        {/* Promo Code Copy Box */}
        <div className="p-4 rounded-2xl bg-purple-100/60 border border-purple-200 flex items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-[10px] text-[#6e5a8e] font-mono uppercase font-bold">VIP COUPON CODE</span>
            <p className="font-mono text-xl font-black text-purple-900 tracking-widest">{promoCode}</p>
          </div>

          <button
            onClick={handleCopy}
            className="glass-btn px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 text-white" />
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>COPY CODE</span>
              </>
            )}
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="glass-btn w-full py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Claim Offer & Browse Cards</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
