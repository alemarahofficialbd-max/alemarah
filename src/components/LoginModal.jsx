import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Globe, 
  Sparkles, 
  PhoneCall, 
  ShieldCheck,
  Home, 
  Building2, 
  Compass, 
  Phone,
  Calendar,
  Menu
} from 'lucide-react';

export default function LoginModal({ isOpen, onClose, lang, setLang, t }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('owner'); // 'owner' or 'investor'
  const [showPassword, setShowPassword] = useState(false);
  const [clientInput, setClientInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'projects', label: t.nav.projects, icon: Building2 },
    { id: 'why-us', label: t.nav.whyUs, icon: ShieldCheck },
    { id: 'about', label: t.nav.about, icon: Compass },
    { id: 'contact', label: t.nav.contact, icon: Phone },
  ];

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    onClose();
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!clientInput || !passwordInput) {
      setStatusMessage(lang === 'en' ? 'Please enter both your Client ID and Password.' : 'অনুগ্রহ করে ক্লায়েন্ট আইডি এবং পাসওয়ার্ড লিখুন।');
      return;
    }
    setIsSubmitting(true);
    setStatusMessage(lang === 'en' ? 'Verifying credentials with Al-Emarah Central Server...' : 'আল-ইমারাহ সেন্ট্রাল সার্ভারের সাথে তথ্য যাচাই করা হচ্ছে...');
    
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMessage(lang === 'en' 
        ? '✓ Welcome, Mr. Tanvir Ahmed (Apartment: 7B, Al-Emarah Green Crest, Gulshan). Loading your dashboard...' 
        : '✓ স্বাগতম, জনাব তানভীর আহমেদ (ফ্ল্যাট: ৭বি, আল-ইমারাহ গ্রীন ক্রেস্ট, গুলশান)। আপনার ড্যাশবোর্ড লোড হচ্ছে...'
      );
    }, 1200);
  };

  const handleDemoFill = () => {
    if (activeTab === 'owner') {
      setClientInput('AEP-GUL-2024-07B');
      setPasswordInput('Emarah@2026');
    } else {
      setClientInput('INV-BAN-2023-014');
      setPasswordInput('Partner@2026');
    }
    setStatusMessage(lang === 'en' ? 'Demo credentials filled. Click "Access Owner Dashboard" to test.' : 'ডেমো আইডি ও পাসওয়ার্ড বসানো হয়েছে। টেস্ট করতে বাটনে ক্লিক করুন।');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F8F9FA] text-gray-900 flex flex-col animate-fadeIn">
      {/* Top Desktop & Mobile Header with Full Navigation Categories on Web View */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3.5">
            {/* Brand Logo */}
            <div className="flex items-center">
              <img 
                src="/alemarah_logo_header.svg" 
                alt="Al-Emarah Properties Limited" 
                className="h-9 sm:h-11 w-auto object-contain cursor-pointer"
                onClick={() => handleNavClick('home')}
              />
            </div>

            {/* Web View Navigation Categories (Shown on Desktop) */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-[#CE2028] hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <IconComponent className="w-4 h-4 text-gray-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right CTAs on Web View */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#006231]" />
                <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
              </button>

              {/* Schedule Visit Button */}
              <button
                onClick={() => handleNavClick('contact')}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#CE2028] text-white text-sm font-bold shadow-md shadow-[#CE2028]/25 hover:bg-[#A9141B] transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>{t.nav.bookVisit}</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label={t.login.closeBtn}
                title="Close Portal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile View Controls */}
            <div className="flex items-center space-x-2 lg:hidden">
              <button
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-xs font-bold"
              >
                <Globe className="w-3.5 h-3.5 text-[#006231]" />
                <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:text-[#CE2028] hover:bg-gray-100 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label={t.login.closeBtn}
              >
                <X className="w-6 h-6 text-[#CE2028]" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer when hamburger opened */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 p-4 space-y-2 shadow-xl animate-fadeIn">
            {navLinks.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-gray-800 hover:bg-red-50 hover:text-[#CE2028] font-semibold text-sm transition-colors text-left"
                >
                  <IconComponent className="w-4 h-4 text-gray-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Centered Login Section */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-gradient-to-b from-[#F8F9FA] via-white to-gray-50">
        {/* Subtle decorative background gradient glows */}
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-red-100/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/5 border border-gray-100 my-auto">
          {/* Official Brand Logo and Title */}
          <div className="text-center mb-6">
            <img 
              src="/alemarah_logo_header.svg" 
              alt="Al-Emarah Logo" 
              className="h-11 sm:h-13 w-auto object-contain mx-auto mb-3"
            />
            
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
            <div className={`p-3.5 rounded-xl mb-5 text-xs sm:text-sm font-medium text-center ${
              statusMessage.includes('✓') 
                ? 'bg-emerald-50 border border-emerald-200 text-[#006231]' 
                : 'bg-red-50 border border-red-200 text-[#CE2028]'
            }`}>
              {statusMessage}
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
                className="text-xs font-bold text-[#006231] hover:underline flex items-center space-x-1 cursor-pointer"
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
              <span>{isSubmitting ? (lang === 'en' ? 'Signing in...' : 'লগইন হচ্ছে...') : t.login.loginBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Help & Support Footer */}
          <div className="mt-7 pt-5 border-t border-gray-100 text-center space-y-2.5">
            <p className="text-xs text-gray-500 leading-relaxed">
              {t.login.supportText}
            </p>
            <div className="flex items-center justify-center text-xs font-semibold text-gray-700 pt-1">
              <a href="tel:01918646575" className="flex items-center space-x-1 text-[#006231] hover:underline">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Call Support: 01918-646575' : 'সরাসরি সাপোর্ট: ০১৯১৮-৬৪৬৫৭৫'}</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
