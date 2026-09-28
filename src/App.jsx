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
  Award
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('bn'); // 'bn' (Bangla) or 'en' (English)
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'projects', 'why-us', 'about', 'contact', 'login', 'dashboard'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const isPortalMode = currentPage === 'login' || currentPage === 'dashboard';

  const t = translations[lang];

  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigateTo('home');
  };

  // Find agro project for the spotlight card
  const agroProject = projectsData.find(p => p.id === 'emarah-agro');

  return (
    <div className={`min-h-screen bg-[#FBFBFB] flex flex-col font-${lang === 'bn' ? 'bengali' : 'sans'}`}>
      {/* Top and Mobile Navbar System - Hidden on Login & Client Dashboard */}
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

            {/* Why Choose Us Highlights Strip (4 Pillars) */}
            <section className="py-12 bg-white border-y border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#CE2028] uppercase tracking-wider">
                      {lang === 'en' ? 'Pillars of Excellence' : 'আমাদের মূল ভিত্তি ও অঙ্গীকার'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                      {lang === 'en' ? 'Why Al-Emarah Properties?' : 'কেন আল-ইমারাহ প্রোপার্টিজ?'}
                    </h2>
                  </div>
                  <button
                    onClick={() => navigateTo('why-us')}
                    className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-[#006231] hover:text-[#CE2028] transition-colors cursor-pointer"
                  >
                    <span>{lang === 'en' ? 'Read full engineering standards' : 'আমাদের মান ও বিশেষত্ব বিস্তারিত দেখুন'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-6 rounded-2xl bg-[#FBFBFB] border border-gray-200/80 hover:border-[#006231] hover:bg-white hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#006231] flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                      <Scale className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#006231] transition-colors">
                      {lang === 'en' ? '100% Shariah Foundation' : '১০০% হালাল ও নৈতিক ভিত্তি'}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {lang === 'en' ? 'Strictly interest-free, Halal Mudarabah partnership principles.' : 'সুদমুক্ত যৌথ লাভ-ক্ষতির অংশীদারিত্ব ও ইসলামী অর্থনৈতিক মূল্যবোধ।'}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#FBFBFB] border border-gray-200/80 hover:border-[#006231] hover:bg-white hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-[#CE2028] flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#CE2028] transition-colors">
                      {lang === 'en' ? 'BUET Tested Safety' : 'বুয়েট টেস্ট ও সর্বোচ্চ নিরাপত্তা'}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {lang === 'en' ? 'Rigorous soil testing, 7.5+ earthquake resistance, and 60-grade steel.' : '৭.৫+ মাত্রার ভূমিকম্প সহনশীল স্ট্রাকচার ও সর্বোচ্চ গ্রেডের রড-পাথর।'}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#FBFBFB] border border-gray-200/80 hover:border-[#006231] hover:bg-white hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#006231] flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#006231] transition-colors">
                      {lang === 'en' ? '100% Clear Land Title' : 'নিষ্কণ্টক নিজস্ব জমি'}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {lang === 'en' ? 'Verified municipal approvals, clear mutation deeds, and zero legal disputes.' : 'শতভাগ নির্ভেজাল জমি, রাজউক কমপ্লায়েন্স ও আইনি স্বচ্ছতা।'}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#FBFBFB] border border-gray-200/80 hover:border-[#006231] hover:bg-white hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-amber-700 transition-colors">
                      {lang === 'en' ? 'On-Time Handover' : 'সময়মতো হস্তান্তর অঙ্গীকার'}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {lang === 'en' ? 'Time-bound project milestones and dedicated post-handover facility care.' : 'নির্দিষ্ট সময়ভিত্তিক নির্মাণ এবং হস্তান্তর-পরবর্তী দীর্ঘমেয়াদি যত্ন।'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Halal Investment Teaser Card */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-[#004724] to-emerald-900 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#8EBF40]/15 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#8EBF40] border border-white/10">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Participatory Halal Wealth Creation' : 'পরিকল্পিত বিনিয়োগ, আস্থার সাথে সম্পদ সৃষ্টি'}</span>
                    </div>

                    <h3 className="text-2xl sm:text-4xl font-black text-white">
                      {lang === 'en' ? 'Grow Your Wealth with Halal Agro & Real Estate Shares' : 'ন্যূনতম ১ লক্ষ টাকা থেকে হালাল যৌথ ব্যবসায় অংশীদার হোন'}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-2xl">
                      {lang === 'en' 
                        ? 'Invest in tangible dairy cattle farming and prime apartment developments with guaranteed legal agreements, quarterly accounting audits, and a 90-day capital refund policy.'
                        : 'আল-ইমারাহ প্রোপার্টিজ ও এগ্রো প্রকল্পে রয়েছে সীমিত আয়ের মানুষ ও প্রবাসীদের জন্য হালাল মুনাফা উপার্জনের সুযোগ। সরকারি স্ট্যাম্পে চুক্তি এবং ৯০ দিনের নোটিশে মূলধন ফেরতের সুদৃঢ় নিশ্চয়তা।'}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-3">
                      <button
                        onClick={() => navigateTo('investment')}
                        className="px-6 py-3 rounded-xl bg-[#8EBF40] hover:bg-[#7ca935] text-gray-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 inline-flex items-center space-x-2"
                      >
                        <span>{lang === 'en' ? 'Read Full Investment Policy' : 'বিনিয়োগের সম্পূর্ণ নীতিমালা পড়ুন'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <a
                        href="tel:+8801918646575"
                        className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center space-x-2 cursor-pointer"
                      >
                        <Phone className="w-4 h-4 text-[#8EBF40]" />
                        <span>{lang === 'en' ? 'Call: 01918-646575' : 'হটলাইন: ০১৯১৮-৬৪৬৫৭৫'}</span>
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
                      <div className="text-[11px] font-bold text-[#8EBF40] uppercase">সর্বনিম্ন বিনিয়োগ</div>
                      <div className="text-2xl font-black text-white">৳ ১,০০,০০০</div>
                      <div className="text-[11px] text-gray-300">সকল আয়ের মানুষের সুযোগ</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
                      <div className="text-[11px] font-bold text-red-300 uppercase">মূলধন প্রত্যাহার</div>
                      <div className="text-2xl font-black text-white">৯০ দিনের নোটিশ</div>
                      <div className="text-[11px] text-gray-300">নিরাপদ এক্সিট গ্যারান্টি</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Signature Amenities Preview */}
            <Amenities lang={lang} t={t} />

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
            <Amenities lang={lang} t={t} />

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
            <Amenities lang={lang} t={t} />

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
        {/* PAGE 6: DEDICATED CLIENT LOGIN PAGE                 */}
        {/* ==================================================== */}
        {currentPage === 'login' && (
          <LoginPage
            lang={lang}
            t={t}
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {/* ==================================================== */}
        {/* PAGE 7: DEDICATED CLIENT DASHBOARD PAGE             */}
        {/* ==================================================== */}
        {currentPage === 'dashboard' && (
          <ClientDashboard
            lang={lang}
            setLang={setLang}
            t={t}
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
