import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Save, Camera, CheckCircle2, ShieldCheck, Globe } from 'lucide-react';
import { sanitizeText, validateFileUpload } from '../lib/security';

export const NewProfileModal = ({ isOpen, onClose, userProfile, onSaveProfile, onShowToast }) => {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [gmail, setGmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState('INR');
  const [avatarUrl, setAvatarUrl] = useState('/assets/avatars/men1.jpg');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFirstName(userProfile?.firstName || 'Ranjeet');
      setSurname(userProfile?.surname || 'Gupta');
      setGmail(userProfile?.gmail || 'ranjeet.gupta@deepmarket.org');
      setPhone(userProfile?.phone || '+91 98765 43210');
      setCity(userProfile?.city || 'New Delhi');
      setCountry(userProfile?.country || 'India');
      setZipCode(userProfile?.zipCode || '110001');
      setTelegramHandle(userProfile?.telegramHandle || '@ranjeet_vip');
      setPreferredCurrency(userProfile?.preferredCurrency || 'INR');
      setAvatarUrl(userProfile?.avatarUrl || '/assets/avatars/men1.jpg');
    }
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

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
      firstName: sanitizeText(firstName) || 'Ranjeet',
      surname: sanitizeText(surname) || 'Gupta',
      gmail: sanitizeText(gmail) || 'ranjeet.gupta@deepmarket.org',
      phone: sanitizeText(phone) || '+91 98765 43210',
      city: sanitizeText(city) || 'New Delhi',
      country: sanitizeText(country) || 'India',
      zipCode: sanitizeText(zipCode) || '110001',
      telegramHandle: sanitizeText(telegramHandle) || '@ranjeet_vip',
      preferredCurrency: preferredCurrency,
      avatarUrl: avatarUrl,
      isLoggedIn: true
    };

    if (onSaveProfile) onSaveProfile(updatedProfile);
    setIsSaved(true);
    if (onShowToast) onShowToast("✅ Profile Information Saved & Updated!");
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-['Satoshi']">
      
      {/* Dark Blur Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-purple-200 bg-white z-10 p-6 sm:p-8 text-[#1e1035] space-y-6 font-['Satoshi'] max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 p-2 flex items-center justify-center text-purple-700 shadow-xs">
              <User className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-['Satoshi'] font-black text-xl text-[#1e1035]">My Profile &amp; Settings</h3>
              <p className="text-xs text-[#6e5a8e] font-medium">Edit your personal details and account info</p>
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 space-y-5 pr-1 font-['Satoshi']">
          
          {/* Avatar Picture Header */}
          <div className="flex flex-col items-center justify-center space-y-2 py-2 bg-purple-50/50 rounded-2xl border border-purple-100 p-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-600 shadow-md bg-white">
                <img src={avatarUrl} alt="Profile Avatar" className="w-full h-full object-cover" />
              </div>
              <label 
                htmlFor="new-profile-avatar-upload"
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-purple-800 transition-colors border-2 border-white"
                title="Change Avatar Picture"
              >
                <Camera className="w-3.5 h-3.5" />
              </label>
              <input 
                id="new-profile-avatar-upload" 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="hidden" 
              />
            </div>
            <div className="text-center">
              <p className="font-black text-sm text-[#1e1035]">{firstName} {surname}</p>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 mt-0.5">
                <ShieldCheck className="w-3 h-3" /> VIP Verified User
              </span>
            </div>
          </div>

          {/* Basic Info: First Name & Last Name */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5 border-b border-purple-100 pb-1.5">
              <User className="w-3.5 h-3.5 text-purple-700" /> Basic Details
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1e1035] uppercase">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-10 px-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1e1035] uppercase">Surname / Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Last Name"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full h-10 px-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5 border-b border-purple-100 pb-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-700" /> Contact Info
            </h4>

            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1e1035] uppercase">Gmail / Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  className="w-full h-10 px-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1e1035] uppercase">Phone / Contact</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Location & Preferences */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5 border-b border-purple-100 pb-1.5">
              <Globe className="w-3.5 h-3.5 text-purple-700" /> Region &amp; Preferences
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1e1035] uppercase">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 px-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1e1035] uppercase">Country</label>
                <input
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-10 px-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1e1035] uppercase">Telegram Handle</label>
                <input
                  type="text"
                  placeholder="@username"
                  value={telegramHandle}
                  onChange={(e) => setTelegramHandle(e.target.value)}
                  className="w-full h-10 px-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1e1035] uppercase">Currency</label>
                <select
                  value={preferredCurrency}
                  onChange={(e) => setPreferredCurrency(e.target.value)}
                  className="w-full h-10 px-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-[#1e1035] font-bold focus:outline-none focus:border-purple-600 cursor-pointer"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="glass-btn w-full h-12 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>PROFILE SAVED!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>SAVE PROFILE INFORMATION</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
