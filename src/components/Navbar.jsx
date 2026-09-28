import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Globe, 
  User, 
  Calendar
} from 'lucide-react';

export default function Header({ 
  currentPage = 'home', 
  setCurrentPage = () => {}, 
  lang, 
  setLang, 
  t, 
  onOpenLogin, 
  onOpenBookVisit,
  isLoggedIn = false 
}) {
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

  const handleLogoClick = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Notification / Hotline Strip */}
      <div className="bg-[#1C1819] text-gray-300 text-xs py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-6">
            <span className="flex items-center space-x-1.5 text-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#8EBF40] animate-pulse shrink-0"></span>
              <span className="font-medium truncate max-w-[200px] sm:max-w-none">
                {lang === 'en' ? 'Planned Development, Creating Wealth with Trust' : 'পরিকল্পিত উন্নয়ন, আস্থার সঙ্গে সম্পদ সৃষ্টি'}
              </span>
            </span>
            <span className="text-gray-500 hidden sm:inline">|</span>
            <a 
              href="tel:+8801918646575" 
              className="hidden sm:flex items-center space-x-1 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#8EBF40]" />
              <span>{t.nav.callUs}: {t.nav.phoneNo}</span>
            </a>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors font-medium cursor-pointer text-xs"
              title={lang === 'en' ? 'বাংলাতে পরিবর্তন করুন' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5 text-[#8EBF40]" />
              <span>{t.nav.langName}</span>
            </button>

            <span className="text-gray-600">|</span>

            {/* সাইন ইন / ক্লায়েন্ট ড্যাশবোর্ড বাটন */}
            <button 
              onClick={() => {
                setCurrentPage(isLoggedIn ? 'dashboard' : 'login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer group"
            >
              <User className={`w-3.5 h-3.5 ${isLoggedIn ? 'text-[#8EBF40]' : 'text-[#CE2028]'}`} />
              <span className="font-semibold text-xs sm:text-xs">
                {isLoggedIn ? (lang === 'en' ? 'Client Dashboard' : 'ক্লায়েন্ট ড্যাশবোর্ড') : t.nav.login}
              </span>
              {isLoggedIn && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EBF40] animate-pulse"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header (Logo & Call-To-Action only, NO navbar links) */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'glass-nav shadow-md shadow-black/5 py-2.5 border-b border-gray-100' 
          : 'bg-white py-3 border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <button 
              onClick={handleLogoClick}
              className="flex items-center space-x-3 group cursor-pointer text-left shrink-0"
              title="Al-Emarah Properties Limited"
            >
              <img 
                src="/alemarah_logo_header.svg" 
                alt="Al-Emarah Properties Limited" 
                className="h-9 sm:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
            </button>

            {/* Right Action: সাইট ভিজিট বুক করুন & Hotline */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              <a 
                href="tel:+8801918646575" 
                className="sm:hidden p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:text-[#CE2028] transition-colors"
                title="হটলাইন কল করুন"
                aria-label="Call Hotline"
              >
                <Phone className="w-4 h-4 text-[#8EBF40]" />
              </a>

              <button
                onClick={onOpenBookVisit}
                className="flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#CE2028] hover:bg-[#A9141B] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#CE2028]/25 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>{t.nav.bookVisit}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
