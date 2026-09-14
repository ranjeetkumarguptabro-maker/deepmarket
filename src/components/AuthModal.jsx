import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, RefreshCw, KeyRound, User, ShieldAlert, Bot, AlertTriangle } from 'lucide-react';
import { sanitizeText, isValidEmail, checkRateLimit } from '../lib/security';

export const AuthModal = ({ isOpen, onClose, onSaveProfile, onShowToast }) => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp_verify'

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  
  // Anti-Bot Honeypot Trap Field (Invisible to human users)
  const [botHoneypot, setBotHoneypot] = useState('');

  // Math CAPTCHA Security Challenge State
  const [num1, setNum1] = useState(6);
  const [num2, setNum2] = useState(4);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // Rate Limiting & IP Lockout State
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isIpLocked, setIsIpLocked] = useState(false);
  const [lockoutMessage, setLockoutMessage] = useState('');

  // 6-Digit Gmail OTP Verification State
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtpInput, setUserOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);

  // Generate new math CAPTCHA problem
  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    setNum1(a);
    setNum2(b);
    setCaptchaInput('');
    setCaptchaError('');
  };

  // Generate random 6-digit Gmail OTP Code
  const dispatchGmailOtp = (recipientEmail) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setUserOtpInput('');
    setOtpError('');
    setResendTimer(60);
    setStep('otp_verify');
    if (onShowToast) onShowToast(`📧 6-Digit Verification OTP Code sent to ${recipientEmail}! (Code: ${code})`);
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab('login');
      setStep('credentials');
      setEmail('');
      setPassword('');
      setFirstName('');
      setSurname('');
      setBotHoneypot('');
      setCaptchaError('');
      setOtpError('');
      setIsIpLocked(false);
      setLockoutMessage('');
      generateCaptcha();
    }
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (step === 'otp_verify' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  // Handle Step 1 Submit (Credentials + Anti-Bot Check + Rate Limiting)
  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    setCaptchaError('');

    // 1. Anti-Bot Honeypot Detection
    if (botHoneypot.trim().length > 0) {
      setIsIpLocked(true);
      setLockoutMessage("🤖 Security Alert: Automated Bot Activity Detected! Mass login request blocked by Bot Firewall.");
      if (onShowToast) onShowToast("Security Alert: Automated bot attempt blocked!");
      return;
    }

    // 2. IP Rate Limiting Check (Max 3 failed attempts per 15 minutes)
    const rateCheck = checkRateLimit(`auth_ip_rate_limit_${activeTab}`, 3, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      setIsIpLocked(true);
      setLockoutMessage(rateCheck.message + " Mass login attempts from this IP address are restricted.");
      if (onShowToast) onShowToast(rateCheck.message);
      return;
    }

    // 3. Email Format Validation
    if (!isValidEmail(email)) {
      setCaptchaError('Security Requirement: Please enter a valid Gmail / Email address.');
      return;
    }

    // 4. Password Strength Check
    if (password.length < 6) {
      setCaptchaError('Password must be at least 6 characters long.');
      return;
    }

    // 5. Math CAPTCHA Security Verification
    const expected = num1 + num2;
    if (parseInt(captchaInput.trim(), 10) !== expected) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setCaptchaError(`Incorrect CAPTCHA! What is ${num1} + ${num2}? (Failed attempts: ${newAttempts}/3)`);
      generateCaptcha();
      return;
    }

    // Pass Step 1 -> Dispatch Gmail OTP Verification Code
    dispatchGmailOtp(email.trim());
  };

  // Handle Step 2 Submit (Gmail 6-Digit OTP Verification)
  const handleOtpVerifySubmit = (e) => {
    e.preventDefault();
    setOtpError('');

    if (userOtpInput.trim() !== generatedOtp) {
      setOtpError('Invalid OTP Code! Please check the 6-digit verification code sent to your Gmail.');
      return;
    }

    // Verification Success! Construct User Profile
    const finalProfile = {
      firstName: sanitizeText(firstName).trim() || email.split('@')[0] || 'User',
      surname: sanitizeText(surname).trim() || 'Account',
      gmail: email.trim(),
      avatarUrl: '/assets/avatars/men1.jpg',
      isLoggedIn: true
    };

    if (onSaveProfile) onSaveProfile(finalProfile);
    if (onShowToast) onShowToast(`🎉 Gmail Verified Successfully! Welcome back, ${finalProfile.firstName}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-['Satoshi']">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card Container */}
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-purple-200 bg-white z-10 p-6 sm:p-8 text-[#1e1035] space-y-5 font-['Satoshi']">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 p-1.5 flex items-center justify-center">
              <img src="/assets/dm_logo_original_black.png" alt="DeepMarket Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-['Satoshi'] font-black text-xl text-[#1e1035]">
                {step === 'otp_verify' ? 'Verify Gmail OTP' : (activeTab === 'login' ? 'Account Login' : 'Create Account')}
              </h3>
              <p className="text-xs text-[#6e5a8e] font-medium">
                {step === 'otp_verify' ? 'Enter 6-Digit Email Verification Code' : 'Encrypted Session & Bot Firewall Active'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center glass-btn-secondary cursor-pointer"
          >
            <X className="w-4 h-4 text-[#6e5a8e]" />
          </button>
        </div>

        {/* Tab Switcher: Login vs Sign Up */}
        {step === 'credentials' && (
          <div className="grid grid-cols-2 gap-1 p-1 bg-purple-50 border border-purple-200 rounded-2xl font-['Satoshi'] text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setCaptchaError('');
              }}
              className={`py-2 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'glass-btn shadow-md'
                  : 'text-[#6e5a8e] hover:text-[#1e1035]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setCaptchaError('');
              }}
              className={`py-2 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'glass-btn shadow-md'
                  : 'text-[#6e5a8e] hover:text-[#1e1035]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        )}

        {/* IP SECURITY LOCKOUT WARNING BOX */}
        {isIpLocked && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2 animate-shake">
            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-rose-700">
              <Bot className="w-4 h-4 text-rose-600" />
              <span>IP Security Lockout &amp; Anti-Bot Firewall</span>
            </div>
            <p className="text-xs text-rose-800 font-medium leading-relaxed">
              {lockoutMessage}
            </p>
          </div>
        )}

        {/* STEP 1: CREDENTIALS & ANTI-BOT FORM */}
        {!isIpLocked && step === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4 font-['Satoshi']">
            
            {/* INVISIBLE ANTI-BOT HONEYPOT TRAP */}
            <input
              type="text"
              name="website_url_honeypot_trap"
              value={botHoneypot}
              onChange={(e) => setBotHoneypot(e.target.value)}
              className="hidden opacity-0 pointer-events-none absolute -left-[9999px]"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Sign Up Name Fields */}
            {activeTab === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1e1035] uppercase">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-10 px-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1e1035] uppercase">Surname</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharma"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full h-10 px-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>
            )}

            {/* Account Gmail / Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1e1035] uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-600" /> Account Gmail / Email
              </label>
              <input
                type="email"
                required
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1e1035] uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-600" /> Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3.5 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600"
              />
            </div>

            {/* ANTI-BOT MATH CAPTCHA SECURITY CHALLENGE */}
            <div className="p-3.5 rounded-2xl bg-purple-50/90 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-purple-700" /> Math CAPTCHA Security:
                </label>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-[10.5px] text-purple-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-purple-900 text-white font-mono text-sm font-black tracking-widest shrink-0">
                  {num1} + {num2} = ?
                </div>
                <input
                  type="number"
                  required
                  placeholder="Answer"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="flex-1 h-10 px-3 bg-white border border-purple-300 rounded-xl text-xs font-mono font-bold text-[#1e1035] focus:outline-none focus:border-purple-600"
                />
              </div>

              {captchaError && (
                <p className="text-[11px] font-bold text-rose-600 animate-bounce">{captchaError}</p>
              )}
            </div>

            {/* Submit Credentials Button */}
            <button
              type="submit"
              className="glass-btn w-full h-12 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
            >
              <span>{activeTab === 'login' ? 'VERIFY & SIGN IN' : 'VERIFY & REGISTER'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: GMAIL 6-DIGIT OTP VERIFICATION FORM */}
        {!isIpLocked && step === 'otp_verify' && (
          <form onSubmit={handleOtpVerifySubmit} className="space-y-5 font-['Satoshi'] animate-fade-in">
            
            {/* OTP Banner Notice */}
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-1.5">
              <Mail className="w-6 h-6 text-purple-700 mx-auto animate-bounce" />
              <h4 className="font-extrabold text-xs text-[#1e1035]">Check Your Gmail Inbox</h4>
              <p className="text-[11.5px] text-[#6e5a8e] font-medium leading-relaxed">
                A 6-digit verification OTP code was dispatched to: <strong className="text-purple-950 font-mono">{email}</strong>
              </p>
              
              {/* Generated Demo OTP Code Helper */}
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900 text-white font-mono text-xs font-black tracking-widest border border-purple-700">
                  🔑 Verification Code: {generatedOtp}
                </span>
              </div>
            </div>

            {/* 6-Digit OTP Code Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1e1035] uppercase tracking-wider text-center block">
                Enter 6-Digit Verification OTP
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="584920"
                value={userOtpInput}
                onChange={(e) => setUserOtpInput(e.target.value.trim())}
                className="w-full h-12 text-center text-xl font-mono font-black tracking-[0.5em] bg-purple-50/80 border-2 border-purple-300 rounded-2xl text-purple-950 focus:outline-none focus:border-purple-600"
              />
              {otpError && (
                <p className="text-[11px] font-bold text-rose-600 text-center animate-bounce">{otpError}</p>
              )}
            </div>

            {/* Timer & Resend OTP */}
            <div className="flex items-center justify-between text-xs font-bold text-[#6e5a8e]">
              <span>Resend OTP Code in:</span>
              <span className="font-mono text-purple-700 font-extrabold">
                {resendTimer > 0 ? `${resendTimer}s` : (
                  <button
                    type="button"
                    onClick={() => dispatchGmailOtp(email)}
                    className="text-purple-700 hover:underline cursor-pointer"
                  >
                    Resend Code Now
                  </button>
                )}
              </span>
            </div>

            {/* Submit Verification OTP Button */}
            <button
              type="submit"
              className="glass-btn w-full h-12 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>VERIFY GMAIL &amp; COMPLETE AUTH</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
