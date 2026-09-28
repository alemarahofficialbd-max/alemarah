import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Home, 
  Phone, 
  Mail, 
  Menu, 
  X, 
  Globe, 
  User, 
  Calendar, 
  ChevronRight, 
  ShieldCheck, 
  Compass, 
  Sparkles, 
  Coins,
  Download,
  Smartphone
} from 'lucide-react';

export default function Navbar({ 
  currentPage = 'home', 
  setCurrentPage = () => {}, 
  lang, 
  setLang, 
  t, 
  onOpenLogin, 
  onOpenBookVisit,
  onOpenInstallApp,
  isLoggedIn = false 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'bn' : 'en');
  };

  const navLinks = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'projects', label: t.nav.projects, icon: Building2 },
    { id: 'investment', label: t.nav.investment || (lang === 'en' ? 'Investment' : 'বিনিয়োগ ও শেয়ার'), icon: Coins },
    { id: 'why-us', label: t.nav.whyUs, icon: ShieldCheck },
    { id: 'about', label: t.nav.about, icon: Compass },
    { id: 'contact', label: t.nav.contact, icon: Phone }
  ];

  const handleNavClick = (pageId) => {
    setMobileMenuOpen(false);
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Notification / Hotline Strip */}
      <div className="bg-[#1C1819] text-gray-300 text-xs py-2 px-4 border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5 text-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#8EBF40] animate-pulse"></span>
              <span className="font-medium">{lang === 'en' ? 'Planned Development, Creating Wealth with Trust' : 'পরিকল্পিত উন্নয়ন, আস্থার সঙ্গে সম্পদ সৃষ্টি'}</span>
            </span>
            <span className="text-gray-500">|</span>
            <a href="tel:+8801918646575" className="flex items-center space-x-1 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#8EBF40]" />
              <span>{t.nav.callUs}: {t.nav.phoneNo}</span>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {onOpenInstallApp && (
              <button 
                onClick={onOpenInstallApp}
                className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
                title={lang === 'en' ? 'Install Web App' : 'অ্যাপ ডাউনলোড করুন'}
              >
                <Download className="w-3.5 h-3.5 text-[#8EBF40]" />
                <span>{lang === 'en' ? 'Install App' : 'অ্যাপ ডাউনলোড'}</span>
              </button>
            )}

            <button 
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors font-medium cursor-pointer"
              title={lang === 'en' ? 'বাংলাতে পরিবর্তন করুন' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5 text-[#8EBF40]" />
              <span>{t.nav.langName}</span>
            </button>

            <button 
              onClick={() => handleNavClick(isLoggedIn ? 'dashboard' : 'login')}
              className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <User className={`w-3.5 h-3.5 ${isLoggedIn ? 'text-[#8EBF40]' : 'text-[#CE2028]'}`} />
              <span>{isLoggedIn ? (lang === 'en' ? 'My Dashboard' : 'আমার ড্যাশবোর্ড') : t.nav.login}</span>
              {isLoggedIn && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EBF40] animate-pulse"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Desktop Navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'glass-nav shadow-lg shadow-black/5 py-2.5 border-b border-gray-100' 
          : 'bg-white py-3.5 border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-3 group cursor-pointer text-left shrink-0"
            >
              <img 
                src="/alemarah_logo_header.svg" 
                alt="Al-Emarah Properties Limited" 
                className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
            </button>

            {/* Desktop Navigation Links (6 exact items) */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navLinks.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'text-[#CE2028] bg-red-50/80 font-bold shadow-2xs' 
                        : 'text-gray-700 hover:text-[#CE2028] hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#CE2028]' : 'text-gray-400 group-hover:text-[#CE2028]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Compact Desktop Navigation Links for medium screens (lg to xl) */}
            <nav className="hidden lg:flex xl:hidden items-center space-x-0.5">
              {navLinks.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'text-[#CE2028] bg-red-50/80 font-bold' 
                        : 'text-gray-700 hover:text-[#CE2028] hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Desktop Right CTAs: App Download, Sign In/Dashboard Corner, Schedule Visit */}
            <div className="hidden lg:flex items-center space-x-2.5 shrink-0">
              {/* Install App Button */}
              {onOpenInstallApp && (
                <button
                  onClick={onOpenInstallApp}
                  className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50/70 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                  title={lang === 'en' ? 'Download App for PC, Android & iOS' : 'পিসি, অ্যান্ড্রয়েড ও আইফোনের জন্য অ্যাপ ডাউনলোড'}
                >
                  <Download className="w-3.5 h-3.5 text-[#006231]" />
                  <span>{t.nav.installApp || (lang === 'en' ? 'App' : 'অ্যাপ')}</span>
                </button>
              )}

              {/* Sign In / Client Dashboard Corner Button */}
              <button
                onClick={() => handleNavClick(isLoggedIn ? 'dashboard' : 'login')}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer whitespace-nowrap ${
                  isLoggedIn
                    ? 'bg-emerald-50 text-[#006231] border-emerald-200 hover:bg-emerald-100'
                    : 'bg-white text-gray-800 border-gray-200 hover:border-[#CE2028] hover:text-[#CE2028]'
                }`}
              >
                <User className={`w-4 h-4 ${isLoggedIn ? 'text-[#006231]' : 'text-[#CE2028]'}`} />
                <span>{isLoggedIn ? (lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড') : t.nav.login}</span>
                {isLoggedIn && (
                  <span className="w-2 h-2 rounded-full bg-[#8EBF40] animate-pulse"></span>
                )}
              </button>

              {/* Schedule Visit Primary Button */}
              <button
                onClick={onOpenBookVisit}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#CE2028] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#CE2028]/25 hover:bg-[#A9141B] hover:shadow-lg hover:shadow-[#CE2028]/35 transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>{t.nav.bookVisit}</span>
              </button>
            </div>

            {/* Mobile Header Controls (Phone View) */}
            <div className="flex items-center space-x-2 lg:hidden">
              {onOpenInstallApp && (
                <button
                  onClick={onOpenInstallApp}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-[#006231] text-xs font-bold cursor-pointer"
                  title={lang === 'en' ? 'App' : 'অ্যাপ'}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'App' : 'অ্যাপ'}</span>
                </button>
              )}

              {/* Mobile Language Button */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-xs font-bold cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#006231]" />
                <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
              </button>

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:text-[#CE2028] hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[60px] bg-white border-b border-gray-200 shadow-2xl z-50 animate-fadeIn overflow-y-auto max-h-[85vh]">
            <div className="p-4 space-y-3">
              {/* Hot Contact Info */}
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#CE2028]/10 flex items-center justify-center text-[#CE2028]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">{t.nav.callUs}</div>
                    <a href="tel:+8801918646575" className="text-sm font-bold text-gray-900">{t.nav.phoneNo}</a>
                  </div>
                </div>
                <button
                  onClick={toggleLanguage}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-[#006231] shadow-xs cursor-pointer"
                >
                  {t.nav.langSwitchTo}
                </button>
              </div>

              {/* Nav Links */}
              <div className="space-y-1">
                {navLinks.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors text-left cursor-pointer ${
                        isActive 
                          ? 'bg-red-50 text-[#CE2028] font-bold' 
                          : 'text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#CE2028]' : 'text-gray-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                  );
                })}
              </div>

              {/* CTA Action Buttons */}
              <div className="pt-2 space-y-2 border-t border-gray-100">
                {onOpenInstallApp && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenInstallApp();
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-emerald-50 text-[#006231] border border-emerald-200 text-xs sm:text-sm font-bold cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Download Mobile & PC App' : 'অ্যাপ ডাউনলোড করুন (Android/iOS/PC)'}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBookVisit();
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-[#CE2028] text-white text-sm font-bold shadow-md shadow-[#CE2028]/25 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t.nav.bookVisit}</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleNavClick(isLoggedIn ? 'dashboard' : 'login');
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 cursor-pointer"
                >
                  <User className={`w-4 h-4 ${isLoggedIn ? 'text-[#006231]' : 'text-gray-600'}`} />
                  <span>{isLoggedIn ? (lang === 'en' ? 'My Dashboard' : 'আমার ড্যাশবোর্ড') : t.nav.login}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom App-like Navigation Bar for Phone View */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 py-1.5 px-3 z-30 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around">
          <button
            onClick={() => handleNavClick('home')}
            className={`flex flex-col items-center py-1 px-2 text-xs font-semibold cursor-pointer ${
              currentPage === 'home' ? 'text-[#CE2028] font-bold' : 'text-gray-500'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>{t.nav.mobileNav.home}</span>
          </button>

          <button
            onClick={() => handleNavClick('projects')}
            className={`flex flex-col items-center py-1 px-2 text-xs font-semibold cursor-pointer ${
              currentPage === 'projects' ? 'text-[#CE2028] font-bold' : 'text-gray-500'
            }`}
          >
            <Building2 className="w-5 h-5 mb-0.5" />
            <span>{t.nav.mobileNav.projects}</span>
          </button>

          {/* Quick Schedule Center Action Button */}
          <button
            onClick={() => handleNavClick('contact')}
            className="-mt-5 w-11 h-11 rounded-full bg-[#CE2028] text-white flex items-center justify-center shadow-lg shadow-[#CE2028]/40 ring-4 ring-white cursor-pointer active:scale-95"
            aria-label={t.nav.bookVisit}
          >
            <Calendar className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleNavClick('investment')}
            className={`flex flex-col items-center py-1 px-2 text-xs font-semibold cursor-pointer ${
              currentPage === 'investment' ? 'text-[#006231] font-bold' : 'text-gray-500'
            }`}
          >
            <Coins className="w-5 h-5 mb-0.5" />
            <span>{t.nav.mobileNav.investment || (lang === 'en' ? 'Invest' : 'বিনিয়োগ')}</span>
          </button>

          <button
            onClick={() => handleNavClick(isLoggedIn ? 'dashboard' : 'login')}
            className={`flex flex-col items-center py-1 px-2 text-xs font-semibold cursor-pointer ${
              currentPage === 'login' || currentPage === 'dashboard' ? 'text-[#CE2028] font-bold' : 'text-gray-500'
            }`}
          >
            <User className={`w-5 h-5 mb-0.5 ${isLoggedIn ? 'text-[#006231]' : ''}`} />
            <span>{isLoggedIn ? (lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড') : (lang === 'en' ? 'Login' : 'লগইন')}</span>
          </button>
        </div>
      </div>
    </>
  );
}
