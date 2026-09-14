import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, Camera, CheckCircle2, ShieldCheck, CreditCard, Sparkles, Globe, KeyRound } from 'lucide-react';
import { sanitizeText, validateFileUpload } from '../lib/security';

export const UserProfileSection = ({ userProfile, onSaveProfile, onShowToast }) => {
  const [firstName, setFirstName] = useState(userProfile?.firstName || 'Ranjeet');
  const [surname, setSurname] = useState(userProfile?.surname || 'Gupta');
  const [gmail, setGmail] = useState(userProfile?.gmail || 'ranjeet.gupta@deepmarket.org');
  const [phone, setPhone] = useState(userProfile?.phone || '+91 98765 43210');
  const [city, setCity] = useState(userProfile?.city || 'New Delhi');
  const [country, setCountry] = useState(userProfile?.country || 'India');
  const [zipCode, setZipCode] = useState(userProfile?.zipCode || '110001');
  const [telegramHandle, setTelegramHandle] = useState(userProfile?.telegramHandle || '@ranjeet_vip');
  const [preferredCurrency, setPreferredCurrency] = useState(userProfile?.preferredCurrency || 'INR');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || '/assets/avatars/men1.jpg');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName || 'Ranjeet');
      setSurname(userProfile.surname || 'Gupta');
      setGmail(userProfile.gmail || 'ranjeet.gupta@deepmarket.org');
      setPhone(userProfile.phone || '+91 98765 43210');
      setCity(userProfile.city || 'New Delhi');
      setCountry(userProfile.country || 'India');
      setZipCode(userProfile.zipCode || '110001');
      setTelegramHandle(userProfile.telegramHandle || '@ranjeet_vip');
      setPreferredCurrency(userProfile.preferredCurrency || 'INR');
      setAvatarUrl(userProfile.avatarUrl || '/assets/avatars/men1.jpg');
    }
  }, [userProfile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileCheck = validateFileUpload(file, 2);
      if (!fileCheck.valid) {
        if (onShowToast) onShowToast(fileCheck.message);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = {
      firstName: sanitizeText(firstName),
      surname: sanitizeText(surname),
      gmail: sanitizeText(gmail),
      phone: sanitizeText(phone),
      city: sanitizeText(city),
      country: sanitizeText(country),
      zipCode: sanitizeText(zipCode),
      telegramHandle: sanitizeText(telegramHandle),
      preferredCurrency: preferredCurrency,
      avatarUrl: avatarUrl,
      isLoggedIn: true
    };

    onSaveProfile(updatedProfile);
    setIsSaved(true);
    if (onShowToast) onShowToast("✅ Profile Details Saved & Updated!");
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 font-['Satoshi'] space-y-8 animate-fade-in">
      
      {/* SECTION TITLE & BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 text-[11px] font-black uppercase px-3 py-1 rounded-full border border-purple-200 tracking-wider">
              Account Management
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase px-3 py-1 rounded-full border border-emerald-200 tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> VIP Verified
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1e1035] tracking-tight mt-2">
            My Profile Information
          </h2>
          <p className="text-xs sm:text-sm text-[#6e5a8e] font-medium mt-1">
            Update your personal details, contact preferences, and delivery information.
          </p>
        </div>

        {/* Quick Avatar Card */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-purple-100 shadow-sm shrink-0">
          <div className="relative group">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-600 shadow-md">
              <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
            <label 
              htmlFor="user-section-avatar-input"
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-purple-800 transition-colors border-2 border-white"
              title="Change Avatar Picture"
            >
              <Camera className="w-3 h-3" />
            </label>
            <input 
              id="user-section-avatar-input" 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="hidden" 
            />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-[#1e1035]">{firstName} {surname}</h4>
            <p className="text-xs font-mono text-purple-700 font-bold">{gmail}</p>
          </div>
        </div>
      </div>

      {/* FORM CARD */}
      <form onSubmit={handleSubmit} className="bg-white border border-purple-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
        
        {/* SECTION 1: PERSONAL INFORMATION */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-purple-900 flex items-center gap-2 border-b border-purple-100 pb-2">
            <User className="w-4 h-4 text-purple-700" /> Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#1e1035] uppercase tracking-wider">First Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ranjeet"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-11 px-4 bg-purple-50/60 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#1e1035] uppercase tracking-wider">Surname / Last Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Gupta"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full h-11 px-4 bg-purple-50/60 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTACT INFORMATION */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-purple-900 flex items-center gap-2 border-b border-purple-100 pb-2">
            <Mail className="w-4 h-4 text-purple-700" /> Contact Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#1e1035] uppercase tracking-wider">Gmail / Email Address</label>
              <input
                type="email"
                required
                placeholder="name@gmail.com"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                className="w-full h-11 px-4 bg-purple-50/60 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#1e1035] uppercase tracking-wider">Phone / WhatsApp Number</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-4 bg-purple-50/60 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: ADDRESS & LOCATION */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-purple-900 flex items-center gap-2 border-b border-purple-100 pb-2">
            <MapPin className="w-4 h-4 text-purple-700" /> Address &amp; Region Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#1e1035] uppercase tracking-wider">City</label>
              <input
                type="text"
                placeholder="e.g. New Delhi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-11 px-4 bg-purple-50/60 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#1e1035] uppercase tracking-wider">Country</label>
              <input
                type="text"
                placeholder="e.g. India"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-11 px-4 bg-purple-50/60 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#1e1035] uppercase tracking-wider">ZIP / Postal Code</label>
              <input
                type="text"
                placeholder="e.g. 110001"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full h-11 px-4 bg-purple-50/60 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600 transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: PREFERENCES & TELEGRAM */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-purple-900 flex items-center gap-2 border-b border-purple-100 pb-2">
            <Globe className="w-4 h-4 text-purple-700" /> Account Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#1e1035] uppercase tracking-wider">Telegram Handle (Optional)</label>
              <input
                type="text"
                placeholder="@username"
                value={telegramHandle}
                onChange={(e) => setTelegramHandle(e.target.value)}
                className="w-full h-11 px-4 bg-purple-50/60 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#1e1035] uppercase tracking-wider">Preferred Currency</label>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
                className="w-full h-11 px-4 bg-purple-50/60 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600 transition-colors cursor-pointer"
              >
                <option value="INR">INR (₹ Indian Rupee)</option>
                <option value="USD">USD ($ United States Dollar)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 border-t border-purple-100">
          <button
            type="submit"
            className="glass-btn w-full h-13 rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 cursor-pointer shadow-xl transition-transform active:scale-[0.99]"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
                <span>PROFILE SAVED!</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>SAVE PROFILE INFORMATION</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
