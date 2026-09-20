import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle, RefreshCw, Send, HelpCircle, Lock, Award, QrCode, Play, Smartphone, CreditCard } from 'lucide-react';

export const HowItWorksPage = ({ onGoToMarketplace }) => {
  const [activeShowcase, setActiveShowcase] = useState('video'); // 'video' | 'pc' | 'vc'

  return (
    <div className="min-h-screen bg-[#f8f6fc] text-[#1e1035] py-10 px-4 sm:px-6 font-['Satoshi']">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* HERO BANNER WITH FLIPKART MOBILE PAYMENT & HAND REGISTER VIDEO SHOWCASES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center rounded-3xl bg-gradient-to-r from-white via-[#f3eefc] to-white border border-purple-200 p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />

          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-200 bg-purple-50 text-purple-800 text-xs font-['Satoshi'] font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              <span>CARD CLEARANCE DEMONSTRATIONS</span>
            </div>

            <h1 className="font-['Satoshi'] text-4xl sm:text-6xl font-black text-[#1e1035] tracking-tight leading-tight">
              How Virtual Cards Work on{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-600">
                DeepMarket
              </span>
            </h1>

            <p className="text-[#524170] text-base sm:text-lg font-medium leading-relaxed font-['Satoshi']">
              Watch step-by-step how virtual cards clear online checkout instantly. Acquire cards starting at <strong className="text-purple-700 font-bold">₹1,000 CC Price</strong> with pre-calibrated <strong className="text-[#1e1035] font-bold">₹8,320 Balance</strong> (8.32x ratio) and instant order tracking.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 font-['Satoshi']">
              <button
                onClick={onGoToMarketplace}
                className="glass-btn px-8 py-4 rounded-full font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Browse Card Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Video Showcase Player */}
          <div className="lg:col-span-5 flex flex-col items-center gap-4 z-10">
            
            {/* Showcase Tabs */}
            <div className="flex gap-2 p-1 rounded-full bg-white border border-purple-200 text-xs shadow-xs font-['Satoshi']">
              <button
                onClick={() => setActiveShowcase('video')}
                className={`px-4 py-1.5 rounded-full font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeShowcase === 'video'
                    ? 'glass-btn shadow-md'
                    : 'text-[#6e5a8e] hover:text-[#1e1035]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card Register</span>
              </button>
              <button
                onClick={() => setActiveShowcase('vc')}
                className={`px-4 py-1.5 rounded-full font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeShowcase === 'vc'
                    ? 'glass-btn shadow-md'
                    : 'text-[#6e5a8e] hover:text-[#1e1035]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Super Card (VC)</span>
              </button>
              <button
                onClick={() => setActiveShowcase('pc')}
                className={`px-4 py-1.5 rounded-full font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  activeShowcase === 'pc'
                    ? 'glass-btn shadow-md'
                    : 'text-[#6e5a8e] hover:text-[#1e1035]'
                }`}
              >
                <span>Purple Card (PC)</span>
              </button>
            </div>

            {/* Showcase Video / Image Frame */}
            <div className="relative group max-w-sm sm:max-w-md w-full">
              <div className="absolute -inset-1 rounded-3xl bg-purple-400/30 blur-xl opacity-40 group-hover:opacity-60 transition duration-500 pointer-events-none" />
              <div className="relative rounded-3xl border-2 border-purple-200 overflow-hidden bg-white shadow-2xl">
                
                {activeShowcase === 'video' ? (
                  <video
                    key="video-register"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    className="w-full h-auto object-cover rounded-2xl max-h-[400px]"
                    poster="/assets/vc_ref.jpg"
                  >
                    <source src="/assets/how_it_works_video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : activeShowcase === 'vc' ? (
                  <video
                    key="video-flipkart"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    className="w-full h-auto object-cover rounded-2xl max-h-[400px]"
                    poster="/assets/vc_ref.jpg"
                  >
                    <source src="/assets/flipkart_payment_video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src="/assets/pc_ref.jpg"
                    alt="Virtual Card Showcase"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 max-h-[380px]"
                  />
                )}

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#1e1035]/90 via-[#1e1035]/50 to-transparent p-4 flex justify-between items-center text-xs font-['Satoshi'] text-white">
                  <span className="font-bold uppercase flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                    {activeShowcase === 'video' ? 'HAND REGISTERS CREDIT CARD' : activeShowcase === 'vc' ? 'FLIPKART MOBILE CHECKOUT' : 'PURPLE VELOCITY CLEARANCE'}
                  </span>
                  <span className="bg-purple-600 px-2 py-0.5 rounded font-extrabold text-[10px]">
                    1080P HD
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 4-STEP DETAILED PIPELINE WALKTHROUGH */}
        <div className="space-y-10 font-['Satoshi']">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-['Satoshi'] text-3xl sm:text-4xl font-black text-[#1e1035] mb-3">
              The 4-Step Acquisition Process
            </h2>
            <p className="text-[#6e5a8e] text-xs sm:text-sm font-medium">
              Follow these simple steps to issue and activate your virtual card instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 space-y-4 relative border border-purple-200 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 text-purple-700 font-black text-lg flex items-center justify-center font-mono">
                01
              </div>
              <h3 className="font-['Satoshi'] text-xl font-bold text-[#1e1035]">Select Card Suite</h3>
              <p className="text-xs text-[#6e5a8e] leading-relaxed font-medium">
                Choose your preferred card suite. Entry starts at <strong>₹1,000 CC Price</strong> for a <strong>₹8,320 Balance</strong>.
              </p>
              <div className="pt-2 text-xs font-mono font-bold text-purple-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-purple-600" /> 8.32x Balance Included
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 space-y-4 relative border border-purple-200 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 text-purple-700 font-black text-lg flex items-center justify-center font-mono">
                02
              </div>
              <h3 className="font-['Satoshi'] text-xl font-bold text-[#1e1035]">Crypto Payment (BTC / LTC)</h3>
              <p className="text-xs text-[#6e5a8e] leading-relaxed font-medium">
                Choose between Bitcoin (BTC) or Litecoin (LTC). Scan the official crypto QR code or copy the designated wallet address.
              </p>
              <div className="pt-2 text-xs font-mono font-bold text-purple-700 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-purple-600" /> Dynamic Crypto QR Code
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-6 space-y-4 relative border border-purple-200 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 text-purple-700 font-black text-lg flex items-center justify-center font-mono">
                03
              </div>
              <h3 className="font-['Satoshi'] text-xl font-bold text-[#1e1035]">TXID &amp; Proof Verification</h3>
              <p className="text-xs text-[#6e5a8e] leading-relaxed font-medium">
                Provide your blockchain Transaction ID (TXID) along with your payment screenshot. Store admin confirms receipt on the ledger.
              </p>
              <div className="pt-2 text-xs font-mono font-bold text-purple-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Admin Blockchain Verification
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-3xl p-6 space-y-4 relative border border-purple-200 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 text-purple-700 font-black text-lg flex items-center justify-center font-mono">
                04
              </div>
              <h3 className="font-['Satoshi'] text-xl font-bold text-[#1e1035]">Order Confirmation</h3>
              <p className="text-xs text-[#6e5a8e] leading-relaxed font-medium">
                Receive your order confirmation, access key, and receipt details instantly saved to your personal account drawer.
              </p>
              <div className="pt-2 text-xs font-mono font-bold text-purple-700 flex items-center gap-1">
                <Send className="w-3.5 h-3.5 text-purple-600" /> Instant Activation
              </div>
            </div>

          </div>
        </div>

        {/* GALLERY */}
        <div className="space-y-6 pt-6 font-['Satoshi']">
          <div className="text-center">
            <h3 className="font-['Satoshi'] text-2xl sm:text-3xl font-black text-[#1e1035] mb-2">
              Virtual Card Architecture
            </h3>
            <p className="text-xs text-[#6e5a8e] font-medium">Supported high-speed virtual card models on DeepMarket.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-6 border border-purple-200 space-y-4 shadow-sm">
              <div className="relative rounded-2xl overflow-hidden border border-purple-200 max-h-56">
                <img src="/assets/pc_ref.jpg" alt="Purple Velocity Card Reference" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-purple-900 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  PURPLE VELOCITY (PC)
                </div>
              </div>
              <div>
                <h4 className="font-bold text-[#1e1035] text-base">Purple Velocity Suite</h4>
                <p className="text-xs text-[#6e5a8e] mt-1 font-medium">High-speed dynamic ledger routing engineered for maximum transaction velocity.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-6 border border-purple-200 space-y-4 shadow-sm">
              <div className="relative rounded-2xl overflow-hidden border border-purple-200 max-h-56">
                <img src="/assets/vc_ref.jpg" alt="Super Card Reference" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-[#1e1035] text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  SUPER CARD (VC)
                </div>
              </div>
              <div>
                <h4 className="font-bold text-[#1e1035] text-base">VIB Super Card Suite</h4>
                <p className="text-xs text-[#6e5a8e] mt-1 font-medium">Crisp minimalist architecture designed for seamless global merchant acceptance.</p>
              </div>
            </div>

          </div>
        </div>

        {/* SECURITY GUARANTEES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-['Satoshi']">
          <div className="bg-white rounded-3xl p-6 border border-purple-200 flex items-start gap-4 shadow-xs">
            <div className="p-3 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[#1e1035] text-base">Zero-Knowledge Encryption</h4>
              <p className="text-xs text-[#6e5a8e] font-medium">Cards are isolated with zero third-party data sharing or disclosure.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-purple-200 flex items-start gap-4 shadow-xs">
            <div className="p-3 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[#1e1035] text-base">Real-Time Order Tracking</h4>
              <p className="text-xs text-[#6e5a8e] font-medium">Track your order progress live directly in your account dashboard.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-purple-200 flex items-start gap-4 shadow-xs">
            <div className="p-3 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[#1e1035] text-base">Global Acceptance</h4>
              <p className="text-xs text-[#6e5a8e] font-medium">Accepted worldwide for digital subscriptions, online platforms, and merchant checkouts.</p>
            </div>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="text-center py-8 font-['Satoshi']">
          <button
            onClick={onGoToMarketplace}
            className="glass-btn px-9 py-4 rounded-full font-extrabold text-xs uppercase tracking-widest cursor-pointer inline-flex items-center gap-2 shadow-lg"
          >
            <span>Get Your Virtual Card Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
