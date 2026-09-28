import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Home, 
  CheckCircle2
} from 'lucide-react';

export default function Hero({ 
  lang, 
  t, 
  onSearch, 
  onOpenBookVisit,
  onExploreProjects = () => {}
}) {
  const [location, setLocation] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [status, setStatus] = useState('all');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({ location, propertyType, status });
  };

  return (
    <section id="home" className="relative pt-2 pb-4 sm:pb-8 md:pt-10 md:pb-14 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Decorative Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Phone View Skyline Hero (Texts and CTAs floating over bottom illustration) */}
      <div className="relative md:hidden w-full overflow-hidden pt-4 pb-28 px-4">
        {/* Background Skyline Image at the bottom */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none z-0">
          <picture className="w-full">
            <source srcSet="/images/headr_phoneview.webp" type="image/webp" />
            <img 
              src="/images/headr_phoneview.png" 
              alt="Al-Emarah Planned Development" 
              className="w-full h-auto object-cover max-h-64 sm:max-h-72 opacity-95"
              loading="eager"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/95"></div>
        </div>

        {/* Floating Content over the skyline */}
        <div className="relative z-10 text-center space-y-4 max-w-lg mx-auto">
          {/* Master Headline */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231F20] tracking-tight leading-[1.2]">
            <span>{t.hero.headlinePrefix} </span>
            <span className="relative inline-block text-[#CE2028]">
              {t.hero.headlineHighlight}
              <svg className="absolute -bottom-1.5 left-0 w-full h-2.5 text-[#8EBF40]/70" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,15 Q50,0 100,15" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
              </svg>
            </span>{' '}
            <span className="text-gray-900">{t.hero.headlineSuffix}</span>
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium bg-white/70 backdrop-blur-xs rounded-xl p-2.5 shadow-2xs">
            {t.hero.description}
          </p>

          {/* Hero CTAs */}
          <div className="flex items-center justify-center pt-1">
            <button
              onClick={onExploreProjects}
              className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-[#CE2028] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#CE2028]/25 hover:bg-[#A9141B] transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>{t.hero.exploreBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Main Hero Header (Hidden on mobile) */}
        <div className="hidden md:block text-center max-w-4xl mx-auto space-y-6">
          {/* Master Headline */}
          <h1 className="text-4xl lg:text-6xl font-extrabold text-[#231F20] tracking-tight leading-[1.15]">
            <span>{t.hero.headlinePrefix} </span>
            <span className="relative inline-block text-[#CE2028]">
              {t.hero.headlineHighlight}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#8EBF40]/70" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,15 Q50,0 100,15" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
              </svg>
            </span>{' '}
            <span className="text-gray-900">{t.hero.headlineSuffix}</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.hero.description}
          </p>

          {/* Hero CTAs */}
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={onExploreProjects}
              className="inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-[#CE2028] text-white text-base font-bold shadow-lg shadow-[#CE2028]/25 hover:bg-[#A9141B] transition-all cursor-pointer"
            >
              <Building2 className="w-5 h-5" />
              <span>{t.hero.exploreBtn}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Dynamic Property Search Box */}
        <div className="mt-5 sm:mt-10 max-w-5xl mx-auto bg-white rounded-2xl shadow-xl shadow-black/5 p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center space-x-2">
              <Search className="w-4 h-4 text-[#CE2028]" />
              <span>{t.hero.searchBox.title}</span>
            </h2>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#006231]" />
              <span>{lang === 'en' ? 'Verified Listings' : 'যাচাইকৃত প্রকল্পসমূহ'}</span>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Location Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#CE2028]" />
                <span>{t.hero.searchBox.locationPlaceholder}</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 font-medium focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028] outline-none transition-all cursor-pointer"
              >
                <option value="all">{t.hero.searchBox.allLocations}</option>
                <option value="Signboard-Sanarpar">{lang === 'en' ? 'Signboard - Sanarpar' : 'সাইনবোর্ড - সানারপাড়'}</option>
                <option value="Purana Paltan">{lang === 'en' ? 'Purana Paltan' : 'পুরানা পল্টন'}</option>
                <option value="Commercial Hub">{lang === 'en' ? 'Commercial Zone' : 'বাণিজ্যিক জোন'}</option>
                <option value="Agro Project">{lang === 'en' ? 'Emarah Agro' : 'ইমারাহ এগ্রো'}</option>
                <option value="Dhaka">{lang === 'en' ? 'Dhaka Metropolitan' : 'ঢাকা মেট্রোপলিটন'}</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Home className="w-3.5 h-3.5 text-[#006231]" />
                <span>{t.hero.searchBox.typePlaceholder}</span>
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 font-medium focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028] outline-none transition-all cursor-pointer"
              >
                <option value="all">{t.hero.searchBox.allTypes}</option>
                <option value="apartment">{lang === 'en' ? 'Residential Apartment' : 'আবাসিক অ্যাপার্টমেন্ট'}</option>
                <option value="commercial">{lang === 'en' ? 'Commercial Plaza' : 'বাণিজ্যিক প্লাজা'}</option>
                <option value="agro">{lang === 'en' ? 'Agro & Livestock' : 'এগ্রো ও ডেইরি সম্পদ'}</option>
              </select>
            </div>

            {/* Project Status */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-[#8EBF40]" />
                <span>{t.hero.searchBox.statusPlaceholder}</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 font-medium focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028] outline-none transition-all cursor-pointer"
              >
                <option value="all">{t.hero.searchBox.statuses.all}</option>
                <option value="ongoing">{t.hero.searchBox.statuses.ongoing}</option>
                <option value="ready">{t.hero.searchBox.statuses.ready}</option>
                <option value="upcoming">{t.hero.searchBox.statuses.upcoming}</option>
              </select>
            </div>

            {/* Search Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#A9141B] text-white text-sm font-bold shadow-md shadow-[#CE2028]/25 hover:opacity-95 transition-all active:scale-[0.98] cursor-pointer h-[42px]"
              >
                <Search className="w-4 h-4" />
                <span>{t.hero.searchBox.searchBtn}</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}
