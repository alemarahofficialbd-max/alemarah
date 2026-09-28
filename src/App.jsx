import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import ProjectModal from './components/ProjectModal';
import WhyChooseUs from './components/WhyChooseUs';
import AboutUs from './components/AboutUs';
import Amenities from './components/Amenities';
import ContactSection from './components/ContactSection';
import LoginPage from './components/LoginPage';
import ClientDashboard from './components/ClientDashboard';
import JoinJourney from './components/JoinJourney';
import Footer from './components/Footer';
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
  MapPin
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('bn'); // 'bn' (Bangla) or 'en' (English)
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'projects', 'why-us', 'about', 'contact', 'login', 'dashboard'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeProjectModal, setActiveProjectModal] = useState(null);
  const [preselectedProject, setPreselectedProject] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);

  const t = translations[lang];

  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      {/* Top and Mobile Navbar System */}
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

      {/* Main Multi-Page Content Area */}
      <main className="flex-1">
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
              onSelectProject={(project) => setActiveProjectModal(project)}
              onOpenBookVisit={(project) => handleOpenBookVisit(project)}
              featured={true}
              onViewAllProjects={() => navigateTo('projects')}
            />

            {/* Emarah Agro Spotlight Banner */}
            {agroProject && (
              <section className="py-12 bg-gradient-to-r from-emerald-900 via-[#004724] to-emerald-950 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#8EBF40]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#8EBF40] border border-white/10">
                        <Sprout className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Sustainable Economic Asset' : 'টেকসই অর্থনৈতিক সম্পদ'}</span>
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                        {lang === 'en' ? agroProject.nameEn : agroProject.nameBn}
                      </h2>
                      <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl">
                        {lang === 'en' ? agroProject.taglineEn : agroProject.taglineBn}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-gray-200">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-[#8EBF40] shrink-0" />
                          <span>{lang === 'en' ? 'Dairy Cattle & Livestock Farming' : 'উন্নত জাতের ডেইরি ক্যাটল ও খামার'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-[#8EBF40] shrink-0" />
                          <span>{lang === 'en' ? 'Minimum Investment: ৳ 1,00,000' : 'সর্বনিম্ন বিনিয়োগ: ৳ ১,০০,০০০'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-[#8EBF40] shrink-0" />
                          <span>{lang === 'en' ? 'Government Registered Project' : 'সরকারি প্রাণিসম্পদ অধিদপ্তর নিবন্ধিত'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-[#8EBF40] shrink-0" />
                          <span>{lang === 'en' ? 'Formal Written Profit Contract' : 'আনুষ্ঠানিক লিখিত অংশীদারিত্ব চুক্তি'}</span>
                        </div>
                      </div>

                      <div className="pt-4 flex flex-wrap gap-3">
                        <button
                          onClick={() => setActiveProjectModal(agroProject)}
                          className="px-6 py-3 rounded-xl bg-[#8EBF40] hover:bg-[#7ca935] text-gray-950 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-black/20"
                        >
                          {lang === 'en' ? 'Explore Emarah Agro Details' : 'ইমারাহ এগ্রোর বিস্তারিত দেখুন'}
                        </button>
                        <button
                          onClick={() => handleOpenBookVisit(agroProject)}
                          className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
                        >
                          {lang === 'en' ? 'Inquire Investment' : 'বিনিয়োগ সম্পর্কে জানুন'}
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 aspect-4/3 relative group">
                        <img
                          src={agroProject.image}
                          alt="Emarah Agro Project"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                          <span className="text-xs font-bold text-white bg-emerald-700/80 px-3 py-1.5 rounded-lg backdrop-blur-xs">
                            {lang === 'en' ? 'Active Production Phase' : 'সরাসরি চলমান উৎপাদনমুখী প্রকল্প'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Join The Journey - Participatory Wealth Creation Section */}
            <JoinJourney
              lang={lang}
              t={t}
              onJoinClick={() => navigateTo('contact')}
              onExplorePolicy={() => navigateTo('why-us')}
            />

            {/* Why Choose Us Preview Section */}
            <div className="relative">
              <WhyChooseUs lang={lang} t={t} />
              <div className="text-center pb-12 -mt-6">
                <button
                  onClick={() => navigateTo('why-us')}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-[#CE2028] text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  <span>{lang === 'en' ? 'Read More About Our Engineering Standards' : 'আমাদের ইঞ্জিনিয়ারিং ও কোয়ালিটি স্ট্যান্ডার্ড বিস্তারিত জানুন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* About Leadership Preview Section */}
            <div className="relative">
              <AboutUs lang={lang} t={t} />
              <div className="text-center pb-12 -mt-6">
                <button
                  onClick={() => navigateTo('about')}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-[#CE2028] text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  <span>{lang === 'en' ? 'View Corporate Profile & Approvals' : 'আমাদের পরিচিতি ও সম্পূর্ণ পরিচালনা পর্ষদ দেখুন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Contact & Consultation Booking Form */}
            <ContactSection
              lang={lang}
              t={t}
              preselectedProject={preselectedProject}
            />
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
              onSelectProject={(project) => setActiveProjectModal(project)}
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
        {/* PAGE 3: DEDICATED WHY CHOOSE US PAGE                */}
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
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        setLang={setLang}
        t={t}
        onNavigate={navigateTo}
        isLoggedIn={isLoggedIn}
      />

      {/* Project Details Modal */}
      <ProjectModal
        project={activeProjectModal}
        lang={lang}
        t={t}
        onClose={() => setActiveProjectModal(null)}
        onBookVisit={(project) => handleOpenBookVisit(project)}
      />
    </div>
  );
}
