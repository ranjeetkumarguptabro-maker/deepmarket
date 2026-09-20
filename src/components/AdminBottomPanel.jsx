import React, { useState } from 'react';
import { Shield, Lock, KeyRound, User, CheckCircle2, ArrowRight, LogOut, Zap, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export const AdminBottomPanel = ({
  isAdminLoggedIn,
  onAdminLogin,
  onAdminLogout,
  onOpenAdminPanel,
  transactions = [],
  onShowToast
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const pendingCount = transactions.filter(
    (t) => t.status === 'Pending Verification' || t.status === 'Pending Admin Approval'
  ).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (username.trim() === 'darkerzoneyt' && password === 'Rgbro@779!') {
      onAdminLogin();
      setUsername('');
      setPassword('');
      setIsFormOpen(false);
      if (onShowToast) onShowToast("✅ Admin Authorization Granted! Store Control Panel Unlocked.");
    } else {
      setLoginError("Invalid Admin credentials! (darkerzoneyt / Rgbro@779!)");
    }
  };

  return (
    <section className="w-full bg-[#07090e] border-t-2 border-amber-500/30 text-white font-['Satoshi'] py-6 px-4 sm:px-6 shadow-2xl relative z-30">
      <div className="max-w-7xl mx-auto">
        
        {/* LOGGED IN ADMIN BAR */}
        {isAdminLoggedIn ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-xl">
            
            {/* Left: Admin Status & Verification Count */}
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="text-base font-black tracking-tight text-white">
                    Store Admin Panel Active
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-amber-400 text-black px-2 py-0.5 rounded">
                    darkerzoneyt
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  {pendingCount > 0 ? (
                    <span className="text-amber-300 font-bold">
                      ⚡ {pendingCount} {pendingCount === 1 ? 'order is' : 'orders are'} waiting for payment confirmation
                    </span>
                  ) : (
                    <span>All submitted orders are up to date. Ready for manual payment verification.</span>
                  )}
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <button
                type="button"
                onClick={onOpenAdminPanel}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg transition-all active:scale-95"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>OPEN ADMIN PANEL ({transactions.length} ORDERS)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onAdminLogout}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-colors"
                title="Lock Admin Session"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Logout Admin</span>
              </button>
            </div>

          </div>
        ) : (
          /* NOT LOGGED IN: PROMPT TO LOGIN AS ADMIN */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight text-white flex items-center justify-center sm:justify-start gap-2">
                    <span>Store Administration Portal</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      Staff Access
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    Are you a store manager? Log in here to review Bitcoin &amp; Litecoin payment receipts.
                  </p>
                </div>
              </div>

              {/* Login Trigger Button */}
              <button
                type="button"
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-sm shrink-0"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>{isFormOpen ? 'Close Login Form' : 'Login if you are Admin'}</span>
                {isFormOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

            </div>

            {/* INLINE ADMIN LOGIN FORM */}
            {isFormOpen && (
              <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4 max-w-xl mx-auto animate-fade-in shadow-2xl">
                <div className="text-center space-y-1 pb-1 border-b border-slate-800">
                  <h5 className="text-sm font-black text-white flex items-center justify-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Admin Authentication Gate</span>
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Enter admin credentials to unlock order confirmation tools
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Username</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Admin username"
                        className="w-full h-9 pl-9 pr-3 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Password</label>
                    <div className="relative">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-9 pl-9 pr-3 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-bold"
                      />
                    </div>
                  </div>
                </div>

                {loginError && (
                  <p className="text-xs text-rose-400 font-bold text-center">{loginError}</p>
                )}

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Official Admin: <strong className="text-slate-400">darkerzoneyt</strong>
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <span>UNLOCK ADMIN PANEL</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
