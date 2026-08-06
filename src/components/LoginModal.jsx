import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle, RefreshCw, KeyRound, User, Camera, Save } from 'lucide-react';

export const LoginModal = ({ isOpen, onClose, onSaveProfile, onShowToast }) => {
  const [step, setStep] = useState('login'); // 'login' | 'profile'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [num1, setNum1] = useState(7);
  const [num2, setNum2] = useState(5);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // Profile Form state
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [gmail, setGmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/assets/avatars/men1.jpg');

  // Generate new math captcha problem
  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    setNum1(a);
    setNum2(b);
    setCaptchaInput('');
    setCaptchaError('');
  };

  useEffect(() => {
    if (isOpen) {
      setStep('login');
      generateCaptcha();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const expected = num1 + num2;
    if (parseInt(captchaInput.trim(), 10) !== expected) {
      setCaptchaError(`Incorrect CAPTCHA! What is ${num1} + ${num2}?`);
      generateCaptcha();
      return;
    }

    setCaptchaError('');
    if (onShowToast) onShowToast("Authentication Verified! Please complete your user profile.");
    setStep('profile');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const userProfileData = {
      firstName: firstName.trim() || 'User',
      surname: surname.trim() || 'Account',
      gmail: gmail.trim() || email.trim(),
      avatarUrl: avatarUrl,
      isLoggedIn: true
    };

    onSaveProfile(userProfileData);
    if (onShowToast) onShowToast(`Welcome back, ${userProfileData.firstName}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-['Satoshi']">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-purple-200 bg-white z-10 p-6 sm:p-8 text-[#1e1035] space-y-6 font-['Satoshi']">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-purple-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 p-1.5 flex items-center justify-center">
              <img src="/assets/dm_logo_original_black.png" alt="DeepMarket Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-['Satoshi'] font-black text-xl text-[#1e1035]">
                {step === 'login' ? 'Secure Login' : 'Complete User Profile'}
              </h3>
              <p className="text-xs text-[#6e5a8e] font-medium">
                {step === 'login' ? '256-Bit Encrypted Session Portal' : 'Submit Picture, Name & Details'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center glass-btn-secondary cursor-pointer"
          >
            <X className="w-4 h-4 text-[#6e5a8e]" />
          </button>
        </div>

        {/* STEP 1: CAPTCHA LOGIN FORM */}
        {step === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 font-['Satoshi']">
            
            {/* Account Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1e1035] uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-600" /> Account Email
              </label>
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] focus:outline-none focus:border-purple-600 font-medium"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1e1035] uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-600" /> Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3.5 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] focus:outline-none focus:border-purple-600 font-medium"
              />
            </div>

            {/* INTERACTIVE CAPTCHA SECURITY CHALLENGE */}
            <div className="p-3.5 rounded-2xl bg-purple-50/90 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-purple-700" /> Security CAPTCHA Challenge:
                </label>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-[10px] text-purple-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 py-2 bg-purple-200/80 border border-purple-300 rounded-xl font-mono text-sm font-black text-purple-950 tracking-wider">
                  {num1} + {num2} = ?
                </div>
                <input
                  type="number"
                  required
                  placeholder="Answer"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="flex-1 h-10 px-3 bg-white border border-purple-300 rounded-xl text-xs text-[#1e1035] focus:outline-none focus:border-purple-600 font-bold"
                />
              </div>

              {captchaError && (
                <p className="text-[10.5px] font-bold text-rose-600">{captchaError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="glass-btn w-full h-12 rounded-full font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
            >
              <span>AUTHENTICATE &amp; PROCEED</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: USER PROFILE FORM (PICTURE, NAME, SURNAME, GMAIL OPTIONAL) */}
        {step === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-4 font-['Satoshi'] animate-fade-in">
            
            {/* SUBMIT PROFILE PICTURE */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="relative group">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-purple-400 shadow-md bg-purple-50">
                  <img 
                    src={avatarUrl} 
                    alt="Submitted Avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <label 
                  htmlFor="login-avatar-upload"
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-purple-800 transition-colors border-2 border-white"
                  title="Submit Profile Picture"
                >
                  <Camera className="w-3.5 h-3.5" />
                </label>
                <input 
                  id="login-avatar-upload" 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden" 
                />
              </div>
              <span className="text-[11px] font-bold text-purple-700">Submit Profile Picture (Tap camera icon)</span>
            </div>

            {/* FIRST NAME */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1e1035] uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-600" /> First Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-11 px-3.5 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] focus:outline-none focus:border-purple-600 font-bold"
              />
            </div>

            {/* SURNAME (LAST NAME) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1e1035] uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-600" /> Surname (Last Name)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sharma"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full h-11 px-3.5 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] focus:outline-none focus:border-purple-600 font-bold"
              />
            </div>

            {/* GMAIL / EMAIL (OPTIONAL) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#1e1035] uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-600" /> Gmail / Email
                </label>
                <span className="text-[10px] text-purple-700 font-extrabold uppercase bg-purple-100 px-2 py-0.5 rounded">
                  Optional
                </span>
              </div>
              <input
                type="email"
                placeholder="name@gmail.com (Optional)"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                className="w-full h-11 px-3.5 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] focus:outline-none focus:border-purple-600 font-medium"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="glass-btn w-full h-12 rounded-full font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
            >
              <Save className="w-4 h-4" />
              <span>SAVE PROFILE &amp; ENTER</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
