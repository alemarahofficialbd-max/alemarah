import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles, 
  PhoneCall, 
  ShieldCheck,
  Building2,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage({ 
  lang, 
  t, 
  onLoginSuccess, 
  onNavigateHome 
}) {
  const [activeTab, setActiveTab] = useState('owner'); // 'owner' or 'investor'
  const [showPassword, setShowPassword] = useState(false);
  const [clientInput, setClientInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!clientInput || !passwordInput) {
      setIsSuccess(false);
      setStatusMessage(lang === 'en' ? 'Please enter both your Client ID and Password.' : 'অনুগ্রহ করে ক্লায়েন্ট আইডি এবং পাসওয়ার্ড লিখুন।');
      return;
    }
    setIsSubmitting(true);
    setIsSuccess(false);
    setStatusMessage(lang === 'en' ? 'Verifying credentials with Al-Emarah Central Server...' : 'আল-ইমারাহ সেন্ট্রাল সার্ভারের সাথে তথ্য যাচাই করা হচ্ছে...');
    
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess();
    }, 800);
  };

  const handleDemoFill = () => {
    if (activeTab === 'owner') {
      setClientInput('AEP-QUDS-2024-7B');
      setPasswordInput('Emarah@2026');
    } else {
      setClientInput('INV-AGRO-2024-104');
      setPasswordInput('Partner@2026');
    }
    setIsSuccess(true);
    setStatusMessage(lang === 'en' ? 'Demo credentials filled. Click "Access Owner Dashboard" below.' : 'ডেমো আইডি ও পাসওয়ার্ড বসানো হয়েছে। নিচের বাটনে ক্লিক করে ড্যাশবোর্ডে প্রবেশ করুন।');
  };

  return (
    <div className="min-h-screen py-10 md:py-16 bg-gradient-to-b from-[#F8F9FA] via-white to-gray-50 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-lg">
        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/5 border border-gray-100">
          {/* Official Brand Logo and Title */}
          <div className="text-center mb-6">
            <button 
              type="button" 
              onClick={onNavigateHome} 
              className="inline-block cursor-pointer group"
              title="Al-Emarah Properties"
            >
              <img 
                src="/alemarah_logo_header.svg" 
                alt="Al-Emarah Logo" 
                className="h-11 sm:h-12 w-auto object-contain mx-auto mb-3 transition-transform group-hover:scale-105"
              />
            </button>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231F20]">
              {t.login.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
              {t.login.subtitle}
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-gray-100 rounded-xl mb-6 border border-gray-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab('owner');
                setStatusMessage('');
              }}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'owner'
                  ? 'bg-white text-[#CE2028] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.login.tabOwner}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('investor');
                setStatusMessage('');
              }}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'investor'
                  ? 'bg-white text-[#006231] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.login.tabInvestor}
            </button>
          </div>

          {/* Status Feedback Banner */}
          {statusMessage && (
            <div className={`p-3.5 rounded-xl mb-5 text-xs sm:text-sm font-medium text-center flex items-center justify-center space-x-2 ${
              isSuccess 
                ? 'bg-emerald-50 border border-emerald-200 text-[#006231]' 
                : 'bg-red-50 border border-red-200 text-[#CE2028]'
            }`}>
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#8EBF40] shrink-0" />}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Client ID / Phone Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                {t.login.usernameLabel} <span className="text-[#CE2028]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={clientInput}
                  onChange={(e) => setClientInput(e.target.value)}
                  placeholder={t.login.usernamePlaceholder}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 font-medium focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028] outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {t.login.passwordLabel} <span className="text-[#CE2028]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert(lang === 'en' ? 'Contact our hotline at 01918-646575 / 01743-926926 for instant password reset.' : 'পাসওয়ার্ড রিসেট করতে আমাদের হটলাইন ০১৯১৮-৬৪৬৫৭৫ / ০১৭৪৩-৯২৬৯২৬ এ যোগাযোগ করুন।')}
                  className="text-xs font-semibold text-[#CE2028] hover:underline cursor-pointer"
                >
                  {t.login.forgotPass}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={t.login.passwordPlaceholder}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-800 font-medium focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox & Quick Demo Fill */}
            <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#CE2028] rounded border-gray-300 focus:ring-[#CE2028] cursor-pointer"
                />
                <span>{t.login.rememberMe}</span>
              </label>

              {/* Instant Demo Fill Button for Easy Testing */}
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-xs font-bold text-[#006231] hover:underline flex items-center space-x-1 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8EBF40]" />
                <span>{lang === 'en' ? 'Quick Demo Fill' : 'ডেমো আইডি বসান'}</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#A9141B] text-white text-sm font-bold shadow-lg shadow-[#CE2028]/25 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              <span>{isSubmitting ? (lang === 'en' ? 'Verifying & Loading Dashboard...' : 'যাচাই হচ্ছে ও ড্যাশবোর্ড লোড হচ্ছে...') : t.login.loginBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Help & Support Hotline */}
          <div className="mt-7 pt-5 border-t border-gray-100 text-center space-y-2.5">
            <p className="text-xs text-gray-500 leading-relaxed">
              {t.login.supportText}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-gray-800 pt-1">
              <a href="tel:01918646575" className="flex items-center space-x-1 text-[#006231] hover:underline">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>01918-646575</span>
              </a>
              <span className="text-gray-300">|</span>
              <a href="tel:01743926926" className="flex items-center space-x-1 text-[#006231] hover:underline">
                <span>01743-926926</span>
              </a>
            </div>
          </div>
        </div>

        {/* Feature Highlights beneath login card */}
        <div className="mt-8 grid grid-cols-2 gap-3 text-xs text-gray-600">
          <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs flex items-center space-x-2.5">
            <Building2 className="w-4 h-4 text-[#CE2028] shrink-0" />
            <span>{lang === 'en' ? 'Live Construction Progress' : 'লাইভ নির্মাণ অগ্রগতি'}</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#006231] shrink-0" />
            <span>{lang === 'en' ? 'Verified PDF Receipts' : 'ভেরিফাইড মানি রিসিট'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
