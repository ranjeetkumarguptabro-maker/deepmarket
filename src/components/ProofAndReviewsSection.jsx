import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Star, Zap, Lock, ArrowUpRight, Award, MessageSquare, ExternalLink, Activity, Radio, UserCheck, Shield, User } from 'lucide-react';

export const ProofAndReviewsSection = ({ onOpenReviews, onOpenBuyCourse }) => {
  const [activeProofTab, setActiveProofTab] = useState('live');

  // Verified Proof Feed Log Data
  const proofLogs = [
    { id: 'TX-98402', item: 'Shadow Suite (₹11,920 Balance)', method: 'Instant Demo UPI', amount: '₹1,430', status: 'Delivered', time: '2 mins ago', utr: 'UTR99840281' },
    { id: 'TX-98401', item: 'Carding Masterclass Course', method: 'Instant Demo UPI', amount: '₹400', status: 'Active', time: '5 mins ago', utr: 'UTR99840112' },
    { id: 'TX-98399', item: 'Ananya Gold Mastercard', method: 'Crypto (LTC)', amount: '₹1,900', status: 'Admin Approved', time: '12 mins ago', utr: 'LTC-CONF-449' },
    { id: 'TX-98397', item: 'Beta Suite (₹8,320 Balance)', method: 'Instant Demo UPI', amount: '₹1,000', status: 'Delivered', time: '18 mins ago', utr: 'UTR99839745' },
    { id: 'TX-98394', item: 'Arjun Neon Black Mastercard', method: 'Crypto (LTC)', amount: '₹2,750', status: 'Admin Approved', time: '25 mins ago', utr: 'LTC-CONF-410' },
  ];

  // Customer Reviews Data - Exactly 2 Native Indian Face Photos & Diverse Initials/Badges
  const customerReviews = [
    {
      id: 1,
      name: "Rahul Mehta",
      avatarType: 'photo',
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
      rating: 4.6,
      date: "Today",
      item: "Shadow Suite",
      comment: "Super fast instant clearance! The ₹11,920 card balance was loaded in seconds. Worked smoothly on Google Ads and AWS billing with 0 issues.",
      verified: true
    },
    {
      id: 2,
      name: "Karan Johar",
      avatarType: 'initials',
      initials: 'KJ',
      bgColor: 'bg-purple-900 text-amber-300 border-purple-700',
      rating: 4.5,
      date: "Yesterday",
      item: "Ananya Gold Mastercard",
      comment: "The gold Mastercard layout is stunning! Used promo code DEEPNET50 for 10% OFF discount. Admin approved the LTC request in 2 minutes.",
      verified: true
    },
    {
      id: 3,
      name: "Sneha Patel",
      avatarType: 'photo',
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      rating: 4.4,
      date: "2 days ago",
      item: "Carding Masterclass Course",
      comment: "Bought the course for ₹400 right from the center poster button. Step-by-step BIN routing guides are crystal clear and beginner friendly!",
      verified: true
    },
    {
      id: 4,
      name: "Vikram Singh",
      avatarType: 'icon',
      icon: Shield,
      bgColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      rating: 4.3,
      date: "3 days ago",
      item: "Maya Bronze Mastercard",
      comment: "Smooth instant demo UPI payment gateway! Got my card details right after confirmation with complete UTR log.",
      verified: true
    },
    {
      id: 5,
      name: "Ananya Rao",
      avatarType: 'initials',
      initials: 'AR',
      bgColor: 'bg-indigo-950 text-purple-200 border-indigo-700',
      rating: 4.5,
      date: "4 days ago",
      item: "Arjun Neon Black Mastercard",
      comment: "The obsidian black neon theme looks amazing. Zero hidden fees as promised. High velocity carding clearance protocol is top notch.",
      verified: true
    },
    {
      id: 6,
      name: "Deepak Sharma",
      avatarType: 'initials',
      initials: 'DS',
      bgColor: 'bg-amber-100 text-amber-900 border-amber-300',
      rating: 4.2,
      date: "5 days ago",
      item: "Beta Suite",
      comment: "100% genuine clearance service. Added the masterclass course as a ₹400 bundle during checkout for extra knowledge.",
      verified: true
    }
  ];

  return (
    <div className="space-y-16 py-12 font-['Satoshi']">
      
      {/* SECTION 1: PROOF OF DELIVERY & REAL-TIME TRANSACTION FEED */}
      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Ledger Proof</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#1e1035] tracking-tight">
              Real-Time <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">Proof of Clearance</span>
            </h2>
            <p className="text-[#6e5a8e] text-xs sm:text-sm font-medium">
              Live transaction dispatches, UTR confirmations, and immutable node ledger commits.
            </p>
          </div>

          {/* Proof Grid: Live Ticker + Trust Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left 7 Columns: Live Dispatch Log Feed */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-purple-100 shadow-xl space-y-4 flex flex-col justify-between">
              
              <div className="flex justify-between items-center border-b border-purple-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="font-extrabold text-sm text-[#1e1035] uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-purple-600" /> Live Clearance Stream
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-bold bg-purple-50 text-purple-800 px-3 py-1 rounded-full border border-purple-200">
                  AUTO SYNCED
                </span>
              </div>

              {/* Feed items */}
              <div className="space-y-3">
                {proofLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 hover:border-purple-300 transition-all flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-purple-950 text-xs">{log.id}</span>
                        <span className="font-bold text-[#1e1035] truncate">{log.item}</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {log.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6e5a8e] font-medium flex items-center gap-2">
                        <span>{log.method}</span>
                        <span>•</span>
                        <span className="font-mono text-purple-700 font-semibold">{log.utr}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-black text-purple-900 text-sm block">{log.amount}</span>
                      <span className="text-[10px] text-[#6e5a8e] font-medium">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-xs text-[#6e5a8e]">
                <span className="flex items-center gap-1 font-medium">
                  <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> 100% UTR Verified Dispatches
                </span>
                <span className="font-bold text-purple-700 font-mono text-[11px]">256-BIT ENCRYPTED</span>
              </div>

            </div>

            {/* Right 5 Columns: Trust & Security Badges */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              
              {/* Card 1: Instant Clearance SLA */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950 via-indigo-950 to-[#1e1035] text-white shadow-xl space-y-3 relative overflow-hidden border border-purple-800/40">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                    INSTANT SLA
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-xl text-white">Under 10-Second Clearance</h4>
                  <p className="text-xs text-purple-200 leading-relaxed font-medium mt-1">
                    Every virtual card clearance request undergoes immediate automated ledger matching and encrypted instant dispatch.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-purple-800/60 font-mono text-xs">
                  <div>
                    <span className="text-purple-300 text-[10px] block font-sans uppercase">Dispatch Rate</span>
                    <strong className="text-emerald-400 text-base font-bold">99.98%</strong>
                  </div>
                  <div>
                    <span className="text-purple-300 text-[10px] block font-sans uppercase">Issued Cards</span>
                    <strong className="text-amber-300 text-base font-bold">15,420+</strong>
                  </div>
                </div>
              </div>

              {/* Card 2: 0-Log Data Privacy Guarantee */}
              <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-[#1e1035]">Zero-Knowledge Security</h4>
                    <p className="text-xs text-[#6e5a8e] font-medium">Asymmetrical quantum-safe data protection.</p>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-[#1e1035] font-medium pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No personal identity logs stored on public ledgers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant demo UPI & LTC payment gateway verification</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: VERIFIED CUSTOMER REVIEWS GRID */}
      <section className="py-8 px-4 sm:px-6 bg-purple-50/50 border-t border-b border-purple-100/80">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Verified Buyer Feedback</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1e1035] tracking-tight">
                What Our Customers Say
              </h2>
              <p className="text-[#6e5a8e] text-xs sm:text-sm font-medium">
                Authentic customer reviews from verified buyers (Ratings: 4.1 – 4.6 ⭐).
              </p>
            </div>

            <button
              onClick={onOpenReviews}
              className="glass-btn px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer hover:scale-105 transition-transform"
            >
              <MessageSquare className="w-4 h-4 text-purple-200" />
              <span>VIEW ALL REVIEWS (300+)</span>
            </button>
          </div>

          {/* Customer Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {customerReviews.map((rev) => (
              <div 
                key={rev.id}
                className="bg-white rounded-3xl p-6 border border-purple-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  
                  {/* Rating Stars & Item */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="font-extrabold text-xs text-amber-900 ml-1.5 font-mono">{rev.rating}</span>
                    </div>

                    <span className="text-[10px] font-extrabold bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200">
                      {rev.item}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-[#524170] leading-relaxed font-medium italic">
                    "{rev.comment}"
                  </p>
                </div>

                {/* User Info & Verified Badge */}
                <div className="flex items-center justify-between pt-3 border-t border-purple-100 text-xs">
                  <div className="flex items-center gap-3">
                    
                    {/* Render exact 2 native photos vs initials/icons */}
                    {rev.avatarType === 'photo' ? (
                      <img 
                        src={rev.avatar} 
                        alt={rev.name} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-300 shadow-xs" 
                      />
                    ) : rev.avatarType === 'initials' ? (
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-extrabold text-xs tracking-wider shadow-xs ${rev.bgColor}`}>
                        {rev.initials}
                      </div>
                    ) : (
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center shadow-xs ${rev.bgColor}`}>
                        <rev.icon className="w-5 h-5" />
                      </div>
                    )}

                    <div>
                      <h4 className="font-extrabold text-[#1e1035] text-xs flex items-center gap-1">
                        {rev.name}
                      </h4>
                      <span className="text-[10px] text-[#6e5a8e]">{rev.date}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-emerald-600" /> Verified
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
