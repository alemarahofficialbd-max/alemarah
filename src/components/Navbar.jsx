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
  Coins
} from 'lucide-react';

export default function Navbar({ 
  currentPage = 'home', 
  setCurrentPage = () => {}, 
  lang, 
  setLang, 
  t, 
  onOpenLogin, 
  onOpenBookVisit,
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
            <a href="tel:+8801816233013" className="flex items-center space-x-1 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#8EBF40]" />
              <span>{t.nav.callUs}: <strong className="font-bold text-white tracking-wide">{t.nav.phoneNo}</strong></span>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors font-medium cursor-pointer"
              title={lang === 'en' ? 'বাংলাতে পরিবর্তন করুন' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5 text-[#8EBF40]" />
              <span>{t.nav.langName}</span>
            </button>

            <span className="text-gray-600">|</span>

            {/* সাইন ইন / ক্লায়েন্ট ড্যাশবোর্ড বাটন */}
            <button 
              onClick={() => handleNavClick(isLoggedIn ? 'dashboard' : 'login')}
              className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer group"
            >
              <User className={`w-3.5 h-3.5 ${isLoggedIn ? 'text-[#8EBF40]' : 'text-[#CE2028]'}`} />
              <span className="font-semibold">{isLoggedIn ? (lang === 'en' ? 'Client Dashboard' : 'ক্লায়েন্ট ড্যাশবোর্ড') : t.nav.login}</span>
              {isLoggedIn && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EBF40] animate-pulse"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header with Logo, 6 Categories, and Book Visit */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'glass-nav shadow-md shadow-black/5 py-2.5 border-b border-gray-100' 
          : 'bg-white py-3 border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-3 group cursor-pointer text-left shrink-0"
              title="Al-Emarah Properties Limited"
            >
              <img 
                src="/alemarah_logo_header.svg" 
                alt="Al-Emarah Properties Limited" 
                className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
            </button>

            {/* Desktop Navigation Categories (6 exact items) */}
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

            {/* Medium screens navigation (lg to xl) */}
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

            {/* Right Corner Button: সাইট ভিজিট বুক করুন */}
            <div className="hidden lg:flex items-center shrink-0">
              <button
                onClick={onOpenBookVisit}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#CE2028] hover:bg-[#A9141B] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#CE2028]/25 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>{t.nav.bookVisit}</span>
              </button>
            </div>

            {/* Mobile Header Controls */}
            <div className="flex items-center space-x-2 lg:hidden">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-xs font-semibold cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#006231]" />
                <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:text-[#CE2028] hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-[#CE2028]" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Mobile Menu Drawer (Outside header to avoid backdrop-filter traps) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[70] bg-white flex flex-col overflow-y-auto animate-fadeIn select-none">
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-2xs">
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavClick('home');
              }}
              className="cursor-pointer"
            >
              <img 
                src="/alemarah_logo_header.svg" 
                alt="Al-Emarah" 
                className="h-8 w-auto object-contain"
              />
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-xs font-semibold cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#006231]" />
                <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-6 h-6 text-[#CE2028]" />
              </button>
            </div>
          </div>

          {/* Full Screen Content Body */}
          <div className="flex-1 p-5 space-y-4 pb-28">
            {/* Hotline Contact Info */}
            <div className="p-3.5 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#CE2028]/10 flex items-center justify-center text-[#CE2028]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-3xs text-gray-500 font-medium">{t.nav.callUs}</div>
                  <a href="tel:+8801816233013" className="text-xs font-extrabold text-gray-900 tracking-wide">{t.nav.phoneNo}</a>
                </div>
              </div>
              <button
                onClick={toggleLanguage}
                className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-[#006231] shadow-xs cursor-pointer"
              >
                {t.nav.langSwitchTo}
              </button>
            </div>

            {/* The 6 Main Navigation Links */}
            <div className="space-y-1.5">
              <div className="text-3xs font-extrabold uppercase tracking-wider text-gray-400 px-3 pb-0.5">
                ওয়েবসাইট মেনু
              </div>
              {navLinks.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleNavClick(item.id);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-colors text-left cursor-pointer ${
                      isActive 
                        ? 'bg-red-50 text-[#CE2028] font-bold border border-red-100' 
                        : 'text-gray-800 hover:bg-gray-50 bg-white border border-gray-100'
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

            {/* Action Buttons */}
            <div className="pt-3 space-y-2.5 border-t border-gray-100">
              {/* সাইন ইন / ক্লায়েন্ট ড্যাশবোর্ড বাটন */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick(isLoggedIn ? 'dashboard' : 'login');
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-800 text-sm font-bold hover:bg-gray-100 cursor-pointer"
              >
                <User className="w-4 h-4 text-[#CE2028]" />
                <span>{isLoggedIn ? (lang === 'en' ? 'Client Dashboard' : 'ক্লায়েন্ট ড্যাশবোর্ড') : t.nav.login}</span>
              </button>

              {/* সাইট ভিজিট বুক করুন বাটন */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBookVisit();
                }}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-[#CE2028] text-white text-sm font-bold shadow-md shadow-[#CE2028]/25 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.nav.bookVisit}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar for Phone View (Exact 6 items as requested) */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 py-1.5 px-1 z-40 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-6 items-center max-w-lg mx-auto">
          {navLinks.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center justify-center py-0.5 px-0.5 transition-colors cursor-pointer text-center group ${
                  isActive ? 'text-[#CE2028]' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <div className={`p-1 rounded-lg transition-transform group-active:scale-90 ${isActive ? 'bg-red-50 text-[#CE2028]' : ''}`}>
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                </div>
                <span className={`text-[9.5px] sm:text-[11px] leading-tight mt-0.5 truncate max-w-full block ${
                  isActive ? 'font-bold text-[#CE2028]' : 'font-medium text-gray-600'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
