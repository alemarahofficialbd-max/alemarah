import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import ProjectDetailsPage from './components/ProjectDetailsPage';
import WhyChooseUs from './components/WhyChooseUs';
import AboutUs from './components/AboutUs';
import Amenities from './components/Amenities';
import ContactSection from './components/ContactSection';
import LoginPage from './components/LoginPage';
import ClientDashboard from './components/ClientDashboard';
import ManagementDashboard from './components/ManagementDashboard';
import JoinJourney from './components/JoinJourney';
import InvestmentPage from './components/InvestmentPage';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import { translations } from './translations';
import { projectsData } from './data/projectsData';
import { 
  Building2, 
  ShieldCheck, 
  Compass, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Sprout, 
  Sparkles,
  Calendar,
  ChevronRight,
  MapPin,
  Coins,
  Scale,
  Award,
  FileText,
  Clock,
  TrendingUp,
  MessageSquare,
  Check,
  Layers
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('bn'); // 'bn' (Bangla) or 'en' (English)
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'projects', 'why-us', 'about', 'contact', 'login', 'dashboard', 'management'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [preselectedProject, setPreselectedProject] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      // Auto prompt user to install app on website entry without any manual button
      const hasPrompted = sessionStorage.getItem('aep_install_prompted');
      if (!hasPrompted) {
        setTimeout(() => {
          try {
            e.prompt();
            sessionStorage.setItem('aep_install_prompted', 'true');
          } catch (err) {
            console.log('Install prompt notice:', err);
          }
        }, 2200);
      }
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Synchronize browser history and hash navigation (back/forward button support)
  useEffect(() => {
    const validPages = ['home', 'projects', 'investment', 'why-us', 'about', 'contact', 'login', 'dashboard', 'project-details'];
    const initialHash = window.location.hash.replace('#', '');
    
    if (initialHash && validPages.includes(initialHash)) {
      setCurrentPage(initialHash);
      window.history.replaceState({ page: initialHash }, '', `#${initialHash}`);
    } else {
      window.history.replaceState({ page: 'home' }, '', window.location.pathname);
    }

    const handlePopState = (event) => {
      const pageFromState = event.state?.page;
      const hash = window.location.hash.replace('#', '');
      const targetPage = pageFromState || (hash && validPages.includes(hash) ? hash : 'home');
      setCurrentPage(targetPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isPortalMode = currentPage === 'login' || currentPage === 'dashboard' || currentPage === 'management';

  const t = translations[lang];

  const navigateTo = (pageId, addToHistory = true) => {
    setCurrentPage(pageId);
    if (addToHistory) {
      const url = pageId === 'home' ? window.location.pathname : `#${pageId}`;
      window.history.pushState({ page: pageId }, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    navigateTo('project-details');
  };

  const handleOpenBookVisit = (project = null) => {
    if (project) {
      setPreselectedProject(project);
    }
    navigateTo('contact');
  };

  const handleSearchFromHero = (filter) => {
    setSearchFilter(filter);
    navigateTo('projects');
  };

  const handleLoginSuccess = (client) => {
    setIsLoggedIn(true);
    setCurrentClient(client);
    navigateTo('dashboard');
  };

  const handleManagementLoginSuccess = (admin) => {
    setIsLoggedIn(true);
    setCurrentAdmin(admin);
    navigateTo('management');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentClient(null);
    setCurrentAdmin(null);
    navigateTo('home');
  };

  // Find agro project for the spotlight card
  const agroProject = projectsData.find(p => p.id === 'emarah-agro');

  return (
    <div className={`min-h-screen bg-[#FBFBFB] flex flex-col font-${lang === 'bn' ? 'bengali' : 'sans'}`}>
      {/* Official Header (Logo, Hotline, Language, Sign-In, and Book Visit) */}
      {!isPortalMode && (
        <Navbar
          currentPage={currentPage}
          setCurrentPage={navigateTo}
          lang={lang}
          setLang={setLang}
          t={t}
          onOpenLogin={() => navigateTo(isLoggedIn ? 'dashboard' : 'login')}
          onOpenBookVisit={() => handleOpenBookVisit()}
          isLoggedIn={isLoggedIn}
        />
      )}

      {/* Main Multi-Page Content Area */}
      <main className="flex-1 pb-16 lg:pb-0">
        {/* ==================================================== */}
        {/* PAGE 1: HOME PAGE                                   */}
        {/* ==================================================== */}
        {currentPage === 'home' && (
          <div className="space-y-4">
            {/* Hero with Search and Stats */}
            <Hero
              lang={lang}
              t={t}
              onSearch={handleSearchFromHero}
              onOpenBookVisit={() => handleOpenBookVisit()}
              onExploreProjects={() => navigateTo('projects')}
            />

            {/* Featured Signature Projects Showcase */}
            <Projects
              lang={lang}
              t={t}
              searchFilter={searchFilter}
              onSelectProject={handleSelectProject}
              onOpenBookVisit={(project) => handleOpenBookVisit(project)}
              featured={true}
              onViewAllProjects={() => navigateTo('projects')}
            />

            {/* ==================================================== */}
            {/* SECTION: আল-ইমারাহ এর বিশেষত্ব (Why Al-Emarah 6 Pillars) */}
            {/* ==================================================== */}
            <section id="why-al-emarah" className="py-14 sm:py-20 bg-gradient-to-b from-white via-gray-50/60 to-white border-y border-gray-200/80 relative overflow-hidden">
              {/* Subtle architectural background accents */}
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-100/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
              <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                  <div className="space-y-3 max-w-3xl">
                    <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#CE2028] text-xs font-bold uppercase tracking-wider border border-red-200/80 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-[#CE2028]" />
                      <span>{lang === 'en' ? 'Core Specialties of Al-Emarah' : 'আল-ইমারাহ এর বিশেষত্ব'}</span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                      <span>{lang === 'en' ? 'Planned Housing & Trusted Construction:' : 'পরিকল্পিত আবাসন ও বিশ্বস্ত নির্মাণে'} </span>
                      <span className="text-[#CE2028]">
                        {lang === 'en' ? 'Our 6 Signature Specialties' : 'আমাদের অনন্য ৬টি প্রাতিষ্ঠানিক বিশেষত্ব'}
                      </span>
                    </h2>

                    <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed font-normal">
                      {lang === 'en' 
                        ? 'Al-Emarah Properties is not just another real estate developer. We take full responsibility for securing your hard-earned investment with early land registration, 100% Shariah ethics, and BUET-tested structural engineering.'
                        : 'আল-ইমারাহ প্রোপার্টিজ কেবল একটি আবাসন নির্মাণ প্রতিষ্ঠান নয়—আমরা ক্রেতার কষ্টার্জিত সঞ্চয়ের নিরাপত্তা, শুরুতেই জমির স্বতন্ত্র রেজিস্ট্রেশন এবং বুয়েট পরীক্ষিত সর্বোচ্চ কাঠামোগত নিরাপত্তার শতভাগ নিশ্চয়তা প্রদান করি।'}
                    </p>
                  </div>

                  <button
                    onClick={() => navigateTo('why-us')}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-[#006231] text-white text-xs sm:text-sm font-bold shadow-md transition-all shrink-0 cursor-pointer self-start md:self-end"
                  >
                    <span>{lang === 'en' ? 'Full Standards & Policy' : 'আমাদের সম্পূর্ণ নীতিমালা দেখুন'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 6 Signature Specialty Cards Grid (3 cols x 2 rows) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {/* Specialty 1: Land Share Independent Registry */}
                  <div className="p-6 sm:p-7 rounded-3xl bg-white border border-gray-200/90 shadow-xs hover:shadow-xl hover:border-[#CE2028]/50 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#CE2028] border border-red-100 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-xs">
                          <FileText className="w-6 h-6" />
                        </div>
                        <span className="text-3xs font-extrabold px-2.5 py-1 rounded-full bg-red-50 text-[#CE2028] border border-red-200 uppercase tracking-wider">
                          {lang === 'en' ? 'Specialty 01' : 'বিশেষত্ব ০১'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#CE2028] transition-colors leading-snug">
                          {lang === 'en' ? 'Independent Land Registry Upfront' : 'শুরুতেই জমির স্বতন্ত্র রেজিস্ট্রেশন'}
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 mt-1">
                          {lang === 'en' ? 'Land Share-Based Flat Scheme' : 'জমির শেয়ার ভিত্তিক ফ্ল্যাট প্রকল্প'}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                        {lang === 'en'
                          ? 'Buyers receive legal land share registration under their own name at the sub-registry office before construction begins, guaranteeing 100% legal title safety.'
                          : 'ভবন নির্মাণের আগেই সাব-রেজিস্ট্রি অফিসে প্রতিটি ক্রেতার নামে শেয়ার অনুযায়ী জমির স্বতন্ত্র রেজিস্ট্রেশন সম্পন্ন করা হয়—যাতে শুরু থেকেই আপনার জমির মালিকানা নিশ্চিত থাকে।'}
                      </p>

                      <div className="pt-2 space-y-1.5 border-t border-gray-100">
                        <div className="flex items-center space-x-2 text-3xs sm:text-xs text-gray-700">
                          <Check className="w-3.5 h-3.5 text-[#006231] shrink-0" />
                          <span>{lang === 'en' ? 'Land deed registered before construction' : 'নির্মাণ শুরুর আগেই জমি রেজিস্ট্রি হস্তান্তর'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-3xs sm:text-xs text-gray-700">
                          <Check className="w-3.5 h-3.5 text-[#006231] shrink-0" />
                          <span>{lang === 'en' ? '100% permanent legal title ownership' : 'শেয়ার অনুযায়ী শতভাগ বৈধ স্থায়ী মালিকানা'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#CE2028]">
                      <span>{lang === 'en' ? '100% Legal Ownership' : 'আইনি মালিকানার শতভাগ নিশ্চয়তা'}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Specialty 2: 100% Shariah Compliant */}
                  <div className="p-6 sm:p-7 rounded-3xl bg-white border border-gray-200/90 shadow-xs hover:shadow-xl hover:border-[#006231]/50 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006231] border border-emerald-100 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-xs">
                          <Scale className="w-6 h-6" />
                        </div>
                        <span className="text-3xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-[#006231] border border-emerald-200 uppercase tracking-wider">
                          {lang === 'en' ? 'Specialty 02' : 'বিশেষত্ব ০২'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#006231] transition-colors leading-snug">
                          {lang === 'en' ? '100% Shariah & Ethical Foundation' : '১০০% সুদমুক্ত ও শরীয়াহসম্মত নীতি'}
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 mt-1">
                          {lang === 'en' ? 'Interest-Free Halal Principles' : 'সম্পূর্ণ হালাল ও নৈতিক অংশীদারিত্ব'}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                        {lang === 'en'
                          ? 'Strictly interest-free, fair and ethical joint-venture real estate and agro investment model. No hidden penalties, interest charges, or un-Islamic contracts.'
                          : 'সম্পূর্ণ সুদমুক্ত, নৈতিক ও যৌথ অংশীদারিত্বমূলক হালাল অর্থনৈতিক কাঠামো। কিস্তিতে কোনো প্রকার লুকানো সুদ, পেনাল্টি চার্জ বা অনৈতিক শর্তের কোনো সুযোগ নেই।'}
                      </p>

                      <div className="pt-2 space-y-1.5 border-t border-gray-100">
                        <div className="flex items-center space-x-2 text-3xs sm:text-xs text-gray-700">
                          <Check className="w-3.5 h-3.5 text-[#006231] shrink-0" />
                          <span>{lang === 'en' ? 'Strictly interest-free Mudarabah/Musharakah' : 'সম্পূর্ণ সুদমুক্ত ও হালাল নীতিতে পরিচালিত'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-3xs sm:text-xs text-gray-700">
                          <Check className="w-3.5 h-3.5 text-[#006231] shrink-0" />
                          <span>{lang === 'en' ? 'No hidden fees or compounding interest' : 'কোনো প্রকার গোপন চার্জ বা সুদ নেই'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#006231]">
                      <span>{lang === 'en' ? 'Shariah Ethical Assurance' : 'সুদমুক্ত হালাল নিশ্চয়তা'}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Specialty 3: 100% Clear Land Title */}
                  <div className="p-6 sm:p-7 rounded-3xl bg-white border border-gray-200/90 shadow-xs hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-xs">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <span className="text-3xs font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 uppercase tracking-wider">
                          {lang === 'en' ? 'Specialty 03' : 'বিশেষত্ব ০৩'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                          {lang === 'en' ? '100% Clear Title & Verified Land' : 'শতভাগ নিষ্কণ্টক নিজস্ব জমি'}
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 mt-1">
                          {lang === 'en' ? 'Zero Legal Disputes Guarantee' : 'আইনি জটিলতামুক্ত পরিষ্কার সম্পত্তি'}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                        {lang === 'en'
                          ? 'Zero litigation, flawless mutation deeds, clear CS, SA, RS, and City records with complete municipal and building compliance verification.'
                          : 'মামলা-মোকদ্দমামুক্ত, নিখুঁত সিএস/এসএ/আরএস/সিটি খতিয়ান ও নিজ নামে নামজারি সম্পন্ন শতভাগ নিষ্কণ্টক জমিতেই কেবল আল-ইমারাহ প্রকল্প গ্রহণ করে।'}
                      </p>

                      <div className="pt-2 space-y-1.5 border-t border-gray-100">
                        <div className="flex items-center space-x-2 text-3xs sm:text-xs text-gray-700">
                          <Check className="w-3.5 h-3.5 text-[#006231] shrink-0" />
                          <span>{lang === 'en' ? 'Up-to-date Mutation & Khatian deeds' : 'আপ-টু-ডেট মিউটেশন ও খতিয়ান সম্পন্ন'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-3xs sm:text-xs text-gray-700">
                          <Check className="w-3.5 h-3.5 text-[#006231] shrink-0" />
                          <span>{lang === 'en' ? 'Zero court disputes or title complications' : 'আইন বিশেষজ্ঞদের দ্বারা যাচাইকৃত নির্ভেজাল জমি'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                      <span>{lang === 'en' ? 'Verified Title Deed' : 'নিষ্কণ্টক নিজস্ব সম্পত্তি'}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Specialty 4: BUET Tested Safety */}
                  <div className="p-6 sm:p-7 rounded-3xl bg-white border border-gray-200/90 shadow-xs hover:shadow-xl hover:border-red-500/50 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#CE2028] border border-red-100 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-xs">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <span className="text-3xs font-extrabold px-2.5 py-1 rounded-full bg-red-50 text-[#CE2028] border border-red-200 uppercase tracking-wider">
                          {lang === 'en' ? 'Specialty 04' : 'বিশেষত্ব ০৪'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#CE2028] transition-colors leading-snug">
                          {lang === 'en' ? 'BUET Tested Structural Safety' : 'বুয়েট টেস্ট ও সর্বোচ্চ নিরাপত্তা'}
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 mt-1">
                          {lang === 'en' ? '7.5+ Earthquake Resistant Design' : '৭.৫+ রিখটার ভূমিকম্প সহনশীল'}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                        {lang === 'en'
                          ? 'Soil test and structural design verified by BUET engineers. Built with 60/72.5 grade high-tensile TMT steel, casted with stone chips and deep pile foundations.'
                          : 'বুয়েট সার্টিফাইড বিশেষজ্ঞ প্রকৌশলী দ্বারা সয়েল টেস্ট ও স্ট্রাকচারাল ডিজাইন। ৬০/৭২.৫ গ্রেড উন্নতমানের রিবার স্টিল ও গভীর পাইল ফাউন্ডেশনের সর্বোচ্চ নিরাপত্তা।'}
                      </p>

                      <div className="pt-2 space-y-1.5 border-t border-gray-100">
                        <div className="flex items-center space-x-2 text-3xs sm:text-xs text-gray-700">
                          <Check className="w-3.5 h-3.5 text-[#006231] shrink-0" />
                          <span>{lang === 'en' ? 'Certified by senior BUET engineers' : 'বুয়েট টেস্ট ও অনুমোদিত স্ট্রাকচারাল নকশা'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-3xs sm:text-xs text-gray-700">
                          <Check className="w-3.5 h-3.5 text-[#006231] shrink-0" />
                          <span>{lang === 'en' ? '60/72.5 Grade high-yield rebar steel' : '৬০/৭২.৫ গ্রেড রিবার স্টিল ও পাথরের ঢালাই'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#CE2028]">
                      <span>{lang === 'en' ? 'Highest Engineering Rigor' : 'সর্বোচ্চ স্ট্রাকচারাল স্থায়িত্ব'}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Specialty 5: Transparent Management & Direct Monitoring */}
                  <div className="p-6 sm:p-7 rounded-3xl bg-white border border-gray-200/90 shadow-xs hover:shadow-xl hover:border-purple-500/50 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-xs">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <span className="text-3xs font-extrabold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-200 uppercase tracking-wider">
                          {lang === 'en' ? 'Specialty 05' : 'বিশেষত্ব ০৫'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors leading-snug">
                          {lang === 'en' ? 'Open Governance & Live Monitoring' : 'স্বচ্ছ ব্যবস্থাপনা ও সরাসরি তদারকি'}
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 mt-1">
                          {lang === 'en' ? 'Real-Time Progress & Accounts Access' : 'হিসাব ও কাজের অগ্রগতি সবসময় উন্মুক্ত'}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                        {lang === 'en'
                          ? 'Shareholders and buyers can inspect construction progress and budget statements at any time. Direct site visits and regular milestone updates guaranteed.'
                          : 'প্রতিটি নির্মাণ কাজের অগ্রগতি, রড-সিমেন্টের মান ও ব্যয়ের হিসাব ফ্ল্যাট ক্রেতা ও অংশীদারদের জন্য উন্মুক্ত। ক্রেতারা সরাসরি সাইটে গিয়ে কাজের মান তদারকি করতে পারেন।'}
                      </p>

                      <div className="pt-2 space-y-1.5 border-t border-gray-100">
                        <div className="flex items-center space-x-2 text-3xs sm:text-xs text-gray-700">
                          <Check className="w-3.5 h-3.5 text-[#006231] shrink-0" />
                          <span>{lang === 'en' ? 'Full access to milestone progress and budget' : 'নির্মাণ অগ্রগতি ও ব্যয়ের হিসাব সবসময় উন্মুক্ত'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-3xs sm:text-xs text-gray-700">
                          <Check className="w-3.5 h-3.5 text-[#006231] shrink-0" />
                          <span>{lang === 'en' ? 'Direct site inspection rights for every buyer' : 'সরাসরি সাইট পরিদর্শন ও তদারকির অবাধ সুযোগ'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-purple-600">
                      <span>{lang === 'en' ? '100% Institutional Transparency' : '১০০% স্বচ্ছতা ও নিয়মিত রিপোর্ট'}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Specialty 6: Time-Bound Handover */}
                  <div className="p-6 sm:p-7 rounded-3xl bg-white border border-gray-200/90 shadow-xs hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-xs">
                          <Award className="w-6 h-6" />
                        </div>
                        <span className="text-3xs font-extrabold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                          {lang === 'en' ? 'Specialty 06' : 'বিশেষত্ব ০৬'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors leading-snug">
                          {lang === 'en' ? 'On-Time Handover Commitment' : 'সময়মতো হস্তান্তর ও দীর্ঘমেয়াদি কেয়ার'}
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 mt-1">
                          {lang === 'en' ? 'Time-Bound Milestone Execution' : 'নির্দিষ্ট সময়ভিত্তিক নির্মাণ অঙ্গীকার'}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                        {lang === 'en'
                          ? 'Strict adherence to project timelines and handover dates. Comprehensive post-handover facility maintenance and homeowner support structure.'
                          : 'পূর্বনির্ধারিত সময়ভিত্তিক মাইলস্টোন অনুযায়ী নির্মাণ কাজ সম্পন্নকরণ এবং ফ্ল্যাট বুঝিয়ে দেওয়ার পরও ভবনের দীর্ঘমেয়াদি রক্ষণাবেক্ষণ ও কেয়ার সার্ভিসের স্থায়ী প্রতিশ্রুতি।'}
                      </p>

                      <div className="pt-2 space-y-1.5 border-t border-gray-100">
                        <div className="flex items-center space-x-2 text-3xs sm:text-xs text-gray-700">
                          <Check className="w-3.5 h-3.5 text-[#006231] shrink-0" />
                          <span>{lang === 'en' ? 'Strict adherence to committed handover dates' : 'প্রতিশ্রুতিবদ্ধ সময়সীমার মধ্যে প্রকল্প হস্তান্তর'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-3xs sm:text-xs text-gray-700">
                          <Check className="w-3.5 h-3.5 text-[#006231] shrink-0" />
                          <span>{lang === 'en' ? 'Dedicated post-handover facility care' : 'হস্তান্তর-পরবর্তী দায়িত্বশীল রক্ষণাবেক্ষণ সেবা'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-amber-700">
                      <span>{lang === 'en' ? 'Guaranteed Timely Delivery' : 'অন-টাইম ডেলিভারি প্রতিশ্রুতি'}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ==================================================== */}
            {/* SECTION: পরিকল্পিত বিনিয়োগ, আস্থার সাথে সম্পদ সৃষ্টি */}
            {/* ==================================================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              <div className="relative rounded-3xl bg-gradient-to-br from-[#002715] via-[#004724] to-[#011C0F] text-white p-6 sm:p-10 md:p-14 shadow-2xl border border-emerald-500/25 overflow-hidden">
                {/* Glow & Atmosphere Background Effects */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#8EBF40]/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#CE2028]/15 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(#8EBF40_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

                <div className="relative z-10 space-y-8 sm:space-y-10">
                  {/* Top Header & Intro */}
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
                    <div className="space-y-3 max-w-3xl">
                      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#8EBF40]/15 text-[#8EBF40] border border-[#8EBF40]/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5 text-[#8EBF40]" />
                        <span>{lang === 'en' ? '100% Shariah-Compliant Partnership' : '১০০% হালাল ও শরীয়াহসম্মত বিনিয়োগ'}</span>
                      </div>

                      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.2]">
                        <span className="block">{lang === 'en' ? 'Planned Investment,' : 'পরিকল্পিত বিনিয়োগ,'}</span>
                        <span className="bg-gradient-to-r from-[#8EBF40] via-emerald-300 to-[#8EBF40] bg-clip-text text-transparent">
                          {lang === 'en' ? 'Creating Wealth with Trust' : 'আস্থার সাথে সম্পদ সৃষ্টি'}
                        </span>
                      </h2>

                      <p className="text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed font-normal">
                        {lang === 'en'
                          ? 'Al-Emarah Properties & Agro offers secure, asset-backed, interest-free joint-venture partnership schemes. Designed for expatriates and families seeking verified halal returns backed by registered land shares and livestock assets.'
                          : 'আল-ইমারাহ প্রোপার্টিজ ও এগ্রো প্রকল্পে বাস্তব সম্পদের ওপর ভিত্তি করে নিরাপদ ও লাভজনক যৌথ অংশীদারিত্ব। মধ্যবিত্ত পরিবার ও প্রবাসীদের জন্য সরকারি স্ট্যাম্পে রেজিস্ট্রিকৃত চুক্তি ও সুদমুক্ত আয়ের নিশ্চিত প্ল্যাটফর্ম।'}
                      </p>
                    </div>

                    {/* Quick Stats Pill Column */}
                    <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-2.5 shrink-0">
                      <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-white">
                        <Check className="w-4 h-4 text-[#8EBF40] shrink-0" />
                        <span>{lang === 'en' ? 'Tangible Real Estate & Livestock' : 'বাস্তব জমি ও ডেইরি প্রকল্প'}</span>
                      </div>
                      <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-white">
                        <Check className="w-4 h-4 text-[#8EBF40] shrink-0" />
                        <span>{lang === 'en' ? 'Zero Hidden Charges or Penalty' : 'সুদমুক্ত মুদারাবা নীতি'}</span>
                      </div>
                    </div>
                  </div>

                  {/* 4 Core Pillars Grid (Cards with modern frosted glass look) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {/* Pillar 1 */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#8EBF40]/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-md space-y-3 group">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-[#8EBF40]/20 text-[#8EBF40] border border-[#8EBF40]/30 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                          <Coins className="w-5 h-5" />
                        </div>
                        <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#8EBF40] border border-emerald-500/30">
                          {lang === 'en' ? 'Accessible' : 'সবার সাধ্যে'}
                        </span>
                      </div>
                      <div>
                        <div className="text-2xs font-bold uppercase tracking-wider text-gray-300">
                          {lang === 'en' ? 'Minimum Capital' : 'ন্যূনতম বিনিয়োগ'}
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                          {lang === 'en' ? 'BDT 1,00,000' : '৳ ১,০০,০০০'}
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {lang === 'en' 
                          ? 'Starting from only 1 Lakh Taka, open for expatriates and service holders.' 
                          : 'স্বল্প পুঁজিতেও হালাল প্রফিট শেয়ারিংয়ের সুযোগ; সকল স্তরের মানুষের প্রবেশযোগ্য।'}
                      </p>
                    </div>

                    {/* Pillar 2 */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#8EBF40]/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-md space-y-3 group">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {lang === 'en' ? '100% Legal' : 'আইনি সুরক্ষা'}
                        </span>
                      </div>
                      <div>
                        <div className="text-2xs font-bold uppercase tracking-wider text-gray-300">
                          {lang === 'en' ? 'Legal Deed' : 'আইনি নিশ্চয়তা'}
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                          {lang === 'en' ? 'Judicial Stamp' : 'সরকারি স্ট্যাম্প'}
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {lang === 'en' 
                          ? 'Every investment is executed on government judicial stamp with money receipt.' 
                          : 'প্রতিটি লেনদেনের জন্য সরকারি স্ট্যাম্পে রেজিস্ট্রিকৃত চুক্তি ও মানি রিসিট প্রদান।'}
                      </p>
                    </div>

                    {/* Pillar 3 */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#8EBF40]/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-md space-y-3 group">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                          <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {lang === 'en' ? 'Zero Penalty' : 'নিরাপদ এক্সিট'}
                        </span>
                      </div>
                      <div>
                        <div className="text-2xs font-bold uppercase tracking-wider text-gray-300">
                          {lang === 'en' ? 'Capital Refund' : 'মূলধন ফেরত সুবিধা'}
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                          {lang === 'en' ? '90 Days Notice' : '৯০ দিনের নোটিশে'}
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {lang === 'en' 
                          ? 'Request full capital withdrawal anytime with 90-day written notice.' 
                          : 'প্রয়োজনে কোনো প্রকার কর্তন ছাড়াই সম্পূর্ণ মূলধন ফেরত নেওয়ার শতভাগ গ্যারান্টি।'}
                      </p>
                    </div>

                    {/* Pillar 4 */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#8EBF40]/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-md space-y-3 group">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {lang === 'en' ? 'Direct Bank' : 'স্বচ্ছ অডিট'}
                        </span>
                      </div>
                      <div>
                        <div className="text-2xs font-bold uppercase tracking-wider text-gray-300">
                          {lang === 'en' ? 'Profit Distribution' : 'লভ্যাংশ বণ্টন'}
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                          {lang === 'en' ? 'Quarterly Payout' : 'ত্রৈমাসিক বণ্টন'}
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {lang === 'en' 
                          ? 'Quarterly profit transferred directly to your bank account after audit.' 
                          : 'প্রতি ৩ মাস পর পর নিট অর্জিত মুনাফা সরাসরি বিনিয়োগকারীর ব্যাংক অ্যাকাউন্টে জমা।'}
                      </p>
                    </div>
                  </div>

                  {/* Dual Investment Sectors Showcase Bar */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-black/25 border border-white/10 backdrop-blur-md">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <div className="flex items-center space-x-2 text-xs font-bold text-gray-200 uppercase tracking-wider">
                        <Layers className="w-4 h-4 text-[#8EBF40]" />
                        <span>{lang === 'en' ? 'Where Your Money Is Invested' : 'যেখানে আপনার অর্থ নিয়োজিত থাকবে (বাস্তব সম্পদ)'}</span>
                      </div>
                      <span className="text-3xs text-[#8EBF40] font-semibold hidden sm:inline-block">
                        {lang === 'en' ? 'Tangible Asset Backed' : 'দৃশ্যমান সম্পদের নিরাপত্তা'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start space-x-3 hover:bg-white/10 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-[#8EBF40] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-white text-sm">
                            {lang === 'en' ? '1. Real Estate Land Share Scheme' : '১. বাণিজ্যিক ও আবাসিক জমির শেয়ার প্রকল্প'}
                          </div>
                          <p className="text-gray-300 leading-snug">
                            {lang === 'en'
                              ? 'Al Quds Tower & Barakah Tower apartment developments with independent registered land share ownership.'
                              : 'আল কুদস টাওয়ার ও বারাকাহ টাওয়ারের মতো বহুতল ভবনে নির্মাণ শুরুর আগেই স্বতন্ত্র রেজিস্ট্রিতে জমির মালিকানা।'}
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start space-x-3 hover:bg-white/10 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-[#8EBF40]/20 text-[#8EBF40] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          <Sprout className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-white text-sm">
                            {lang === 'en' ? '2. Emarah Dairy & Cattle Agro Farming' : '২. ইমারাহ ডেইরি ও পশু খামার প্রকল্প'}
                          </div>
                          <p className="text-gray-300 leading-snug">
                            {lang === 'en'
                              ? 'Sustainable dairy milk production, high-yield breeding, and cattle rearing with steady agricultural cash flow.'
                              : 'উন্নত জাতের গাভী পালন, দুধ উৎপাদন ও পশু মোটাতাজাকরণ প্রকল্প—যেখানে সম্পদ দৃশ্যমান ও খামার উন্মুক্ত।'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Hotline Strip */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => navigateTo('investment')}
                        className="px-6 py-3.5 rounded-xl bg-[#8EBF40] hover:bg-[#7ca935] text-gray-950 font-bold text-xs sm:text-sm shadow-lg shadow-[#8EBF40]/25 transition-all cursor-pointer active:scale-95 inline-flex items-center justify-center space-x-2"
                      >
                        <span>{lang === 'en' ? 'Investment Policy & Calculator' : 'বিনিয়োগ নীতিমালা ও লাভ ক্যালকুলেটর'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <a
                        href="tel:01918646575"
                        className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Phone className="w-4 h-4 text-[#8EBF40]" />
                        <span>{lang === 'en' ? 'Call Desk: 01918-646575' : 'বিনিয়োগ ডেস্ক: ০১৯১৮-৬৪৬৫৭৫'}</span>
                      </a>
                    </div>

                    <a
                      href="https://wa.me/8801918646575?text=%E0%A6%86%E0%A6%B8%E0%A6%B8%E0%A6%BE%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%81%E0%A6%AE%E0%A7%A4%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%AC%E0%A6%BF%E0%A6%A8%E0%A6%BF%E0%A7%9F%E0%A7%8B%E0%A6%97%20%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A7%87%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A7%A4"
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3.5 rounded-xl bg-[#006231] hover:bg-[#004723] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 border border-emerald-400/30 shadow-md cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-[#8EBF40]" />
                      <span>{lang === 'en' ? 'WhatsApp Inquiry' : 'হোয়াটসঅ্যাপে পরামর্শ নিন'}</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Signature Amenities Preview */}
            <Amenities 
              lang={lang} 
              t={t} 
              onOpenBookVisit={() => handleOpenBookVisit()}
              onExploreProjects={() => navigateTo('projects')}
            />

            {/* Quick Contact & Site Visit Invitation Strip */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center lg:text-left">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#CE2028] uppercase tracking-wider">
                    <MapPin className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Office Visit & Site Tour' : 'সরাসরি সাইট ভিজিট ও অফিস আমন্ত্রণ'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                    {lang === 'en' ? 'Schedule a Guided Project Tour with Us' : 'আমাদের যেকোনো প্রকল্পে সরাসরি সাইট ভিজিট করতে চান?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-xl">
                    {lang === 'en'
                      ? 'Visit our Purana Paltan corporate office or schedule dedicated transport to inspect ongoing construction sites.'
                      : 'আমাদের পুরানা পল্টন কর্পোরেট অফিসে চা পানের আমন্ত্রণ। আপনার সুবিধাজনক সময়ে সাইট ঘুরিয়ে দেখানোর জন্য আমাদের প্রতিনিধিরা প্রস্তুত।'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => handleOpenBookVisit()}
                    className="px-6 py-3.5 rounded-xl bg-[#CE2028] hover:bg-[#A9141B] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    <Calendar className="w-4 h-4 inline-block mr-2" />
                    <span>{t.nav.bookVisit}</span>
                  </button>

                  <a
                    href="https://wa.me/8801918646575"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    <span>{lang === 'en' ? 'Chat on WhatsApp' : 'হোয়াটসঅ্যাপে কথা বলুন'}</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==================================================== */}
        {/* PAGE 2: DEDICATED PROJECTS PAGE                     */}
        {/* ==================================================== */}
        {currentPage === 'projects' && (
          <div className="animate-fadeIn">
            {/* Full Projects Catalog */}
            <Projects
              lang={lang}
              t={t}
              searchFilter={searchFilter}
              onSelectProject={handleSelectProject}
              onOpenBookVisit={(project) => handleOpenBookVisit(project)}
              featured={false}
            />

            {/* Bottom Call to Action for Site Visit */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="p-8 rounded-3xl bg-gradient-to-r from-[#CE2028] to-[#A9141B] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-[#CE2028]/20">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-black">
                    {lang === 'en' ? 'Would you like a guided site tour of any project?' : 'আমাদের যেকোনো প্রকল্পে সরাসরি সাইট ভিজিট করতে চান?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-red-100 max-w-xl">
                    {lang === 'en' ? 'Our project engineers and customer relation team are ready to receive you with dedicated transport arrangements.' : 'আমাদের সাইট ইঞ্জিনিয়ার এবং সিনিয়র প্রতিনিধি আপনাকে সশরীরে প্রকল্প ঘুরিয়ে দেখানোর জন্য প্রস্তুত।'}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenBookVisit()}
                  className="px-7 py-3.5 rounded-xl bg-white text-[#CE2028] hover:bg-gray-100 font-bold text-sm shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
                >
                  <Calendar className="w-4 h-4 inline-block mr-2" />
                  <span>{t.nav.bookVisit}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* PAGE 3: DEDICATED INVESTMENT & PARTNERSHIP PAGE      */}
        {/* ==================================================== */}
        {currentPage === 'investment' && (
          <InvestmentPage
            lang={lang}
            t={t}
            onNavigateToProjects={() => navigateTo('projects')}
            onOpenBookVisit={() => handleOpenBookVisit()}
          />
        )}

        {/* ==================================================== */}
        {/* PAGE 4: DEDICATED WHY CHOOSE US PAGE                */}
        {/* ==================================================== */}
        {currentPage === 'why-us' && (
          <div className="animate-fadeIn">
            {/* Why Choose Us Full Details & Comparison */}
            <WhyChooseUs lang={lang} t={t} />

            {/* Amenities Section on Quality Page */}
            <Amenities 
              lang={lang} 
              t={t} 
              onOpenBookVisit={() => handleOpenBookVisit()}
              onExploreProjects={() => navigateTo('projects')}
            />

            {/* Bottom CTA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="p-8 rounded-3xl bg-gray-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center space-x-1.5 text-[#8EBF40] text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Quality & Structural Guarantee' : 'কাঠামোগত স্থায়িত্ব ও নিরাপত্তা গ্যারান্টি'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">
                    {lang === 'en' ? 'Inspect Our BUET Test Reports & Clear Land Deeds' : 'আমাদের বুয়েট টেস্ট রিপোর্ট ও জমির দলিল সরাসরি দেখুন'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
                    {lang === 'en' ? 'We welcome all prospective apartment buyers to visit our Purana Paltan office and review all structural records with complete transparency.' : 'আমাদের পুরানা পল্টন কর্পোরেট অফিসে এসে যেকোনো প্রকল্পের ফাইল ও রাজউক নথি পর্যালোচনা করার জন্য সাদর আমন্ত্রণ।'}
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('contact')}
                  className="px-7 py-3.5 rounded-xl bg-[#CE2028] hover:bg-[#A9141B] text-white font-bold text-sm shadow-md shadow-[#CE2028]/25 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                >
                  <Phone className="w-4 h-4 inline-block mr-2" />
                  <span>{lang === 'en' ? 'Contact Corporate Office' : 'কর্পোরেট অফিসে যোগাযোগ'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* PAGE 4: DEDICATED ABOUT US PAGE                     */}
        {/* ==================================================== */}
        {currentPage === 'about' && (
          <div className="animate-fadeIn">
            {/* Full About Us Content with Chairman & MD Speeches */}
            <AboutUs lang={lang} t={t} />

            {/* Signature Amenities */}
            <Amenities 
              lang={lang} 
              t={t} 
              onOpenBookVisit={() => handleOpenBookVisit()}
              onExploreProjects={() => navigateTo('projects')}
            />

            {/* Corporate Location Details Card */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#CE2028] uppercase tracking-wider">
                    {lang === 'en' ? 'Central Corporate Address' : 'কেন্দ্রীয় কর্পোরেট ঠিকানা'}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-[#CE2028]" />
                    <span>{t.contact.office.addressLine1}, {t.contact.office.addressLine2}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {lang === 'en' ? 'Hotlines: 01918-646575, 01743-926926, 01914-425073, 01833-544548' : 'হটলাইন নম্বরসমূহ: ০১৯১৮-৬৪৬৫৭৫, ০১৭৪৩-৯২৬৯২৬, ০১৯১৪-৪২৫০৭৩, ০১৮৩৩-৫৪৪৫৪৮'}
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('contact')}
                  className="px-6 py-3 rounded-xl bg-[#006231] hover:bg-[#004724] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  {lang === 'en' ? 'Schedule Office Meeting' : 'অফিস মিটিং নির্ধারণ করুন'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* PAGE 5: DEDICATED CONTACT US PAGE                   */}
        {/* ==================================================== */}
        {currentPage === 'contact' && (
          <div className="animate-fadeIn">
            {/* Full Contact Form & Office Directory */}
            <ContactSection
              lang={lang}
              t={t}
              preselectedProject={preselectedProject}
            />
          </div>
        )}

        {/* ==================================================== */}
        {/* PAGE 6: DEDICATED CLIENT & MANAGEMENT LOGIN PAGE     */}
        {/* ==================================================== */}
        {currentPage === 'login' && (
          <LoginPage
            lang={lang}
            t={t}
            onLoginSuccess={handleLoginSuccess}
            onManagementLoginSuccess={handleManagementLoginSuccess}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {/* ==================================================== */}
        {/* PAGE 7: DEDICATED CLIENT DASHBOARD PAGE             */}
        {/* ==================================================== */}
        {currentPage === 'dashboard' && (
          <ClientDashboard
            client={currentClient}
            lang={lang}
            setLang={setLang}
            t={t}
            onLogout={handleLogout}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {/* ==================================================== */}
        {/* PAGE 8: DEDICATED MANAGEMENT CONTROL PANEL          */}
        {/* ==================================================== */}
        {currentPage === 'management' && (
          <ManagementDashboard
            admin={currentAdmin}
            lang={lang}
            onLogout={handleLogout}
            onNavigateHome={() => navigateTo('home')}
          />
        )}
        {/* ==================================================== */}
        {/* PAGE 8: DEDICATED FULL-PAGE PROJECT DETAILS          */}
        {/* ==================================================== */}
        {currentPage === 'project-details' && selectedProject && (
          <ProjectDetailsPage
            project={selectedProject}
            lang={lang}
            t={t}
            onBack={() => navigateTo('projects')}
            onSelectProject={handleSelectProject}
            onBookVisit={(project) => handleOpenBookVisit(project)}
          />
        )}
      </main>

      {/* Footer - Hidden on Login & Client Dashboard */}
      {!isPortalMode && (
        <Footer
          lang={lang}
          setLang={setLang}
          t={t}
          onNavigate={navigateTo}
          isLoggedIn={isLoggedIn}
        />
      )}

      {/* App Splash / Flash Screen on Launch */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} minDuration={1600} />
      )}
    </div>
  );
}
