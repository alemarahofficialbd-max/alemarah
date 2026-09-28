import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Calendar, 
  ArrowRight, 
  CheckCircle,
  Eye,
  SlidersHorizontal,
  Search
} from 'lucide-react';
import { projectsData } from '../data/projectsData';

export default function Projects({ 
  lang, 
  t, 
  searchFilter, 
  onSelectProject, 
  onOpenBookVisit,
  featured = false,
  onViewAllProjects = () => {}
}) {
  const [activeTab, setActiveTab] = useState('all'); // all, ongoing, upcoming, ready

  // Filter projects by tab and by search filters passed from Hero
  const filteredProjects = projectsData.filter((item) => {
    // Tab filter
    if (activeTab !== 'all' && item.status !== activeTab) {
      return false;
    }

    // Hero search filter
    if (searchFilter) {
      if (searchFilter.status && searchFilter.status !== 'all' && item.status !== searchFilter.status) {
        return false;
      }
      if (searchFilter.location && searchFilter.location !== 'all') {
        const areaMatch = item.areaEn.toLowerCase().includes(searchFilter.location.toLowerCase()) ||
                          item.locationEn.toLowerCase().includes(searchFilter.location.toLowerCase());
        if (!areaMatch) return false;
      }
      if (searchFilter.propertyType && searchFilter.propertyType !== 'all') {
        if (searchFilter.propertyType === 'commercial' && !item.typeEn.toLowerCase().includes('commercial')) {
          return false;
        }
        if (searchFilter.propertyType === 'condo' && !item.typeEn.toLowerCase().includes('condo')) {
          return false;
        }
        if (searchFilter.propertyType === 'apartment' && item.typeEn.toLowerCase().includes('commercial')) {
          return false;
        }
      }
    }

    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ongoing':
        return {
          label: t.projects.card.statusOngoing,
          className: 'bg-amber-500 text-white shadow-xs'
        };
      case 'upcoming':
        return {
          label: t.projects.card.statusUpcoming,
          className: 'bg-blue-600 text-white shadow-xs'
        };
      case 'ready':
        return {
          label: t.projects.card.statusReady,
          className: 'bg-[#006231] text-white shadow-xs'
        };
      default:
        return { label: '', className: '' };
    }
  };

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 text-[#CE2028] text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.projects.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#231F20] tracking-tight">
            {t.projects.title}
          </h2>
          <p className="mt-3 text-base text-gray-600">
            {t.projects.subtitle}
          </p>

          {/* Category Tabs */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-gray-100 border border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.projects.tabs.all}
            </button>

            <button
              onClick={() => setActiveTab('ongoing')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'ongoing'
                  ? 'bg-[#CE2028] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.projects.tabs.ongoing}
            </button>

            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.projects.tabs.upcoming}
            </button>

            <button
              onClick={() => setActiveTab('ready')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'ready'
                  ? 'bg-[#006231] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.projects.tabs.ready}
            </button>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const badge = getStatusBadge(project.status);
            return (
              <div
                key={project.id}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={project.image}
                    alt={project.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Property Type Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-xs">
                    {lang === 'en' ? project.typeEn : project.typeBn}
                  </div>

                  {/* Location Overlay on Image Bottom */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="flex items-center space-x-1.5 text-xs font-medium text-gray-200">
                      <MapPin className="w-3.5 h-3.5 text-[#8EBF40]" />
                      <span className="truncate">{lang === 'en' ? project.locationEn : project.locationBn}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#231F20] group-hover:text-[#CE2028] transition-colors line-clamp-1">
                      {lang === 'en' ? project.nameEn : project.nameBn}
                    </h3>
                  </div>

                  {/* Key Specifications Grid */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 text-center">
                    <div>
                      <div className="text-xs text-gray-400 font-medium">{t.projects.card.beds}</div>
                      <div className="text-sm font-bold text-gray-800 flex items-center justify-center space-x-1 mt-0.5">
                        <Bed className="w-3.5 h-3.5 text-[#CE2028]" />
                        <span>{project.beds > 0 ? project.beds : 'N/A'}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-400 font-medium">{t.projects.card.baths}</div>
                      <div className="text-sm font-bold text-gray-800 flex items-center justify-center space-x-1 mt-0.5">
                        <Bath className="w-3.5 h-3.5 text-[#006231]" />
                        <span>{project.baths}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-400 font-medium">{t.projects.card.size}</div>
                      <div className="text-sm font-bold text-gray-800 flex items-center justify-center space-x-1 mt-0.5">
                        <Maximize2 className="w-3.5 h-3.5 text-[#8EBF40]" />
                        <span>{project.sizeSqft}</span>
                      </div>
                    </div>
                  </div>

                  {/* Handover Timeline */}
                  <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{t.projects.card.handover}:</span>
                    </span>
                    <span className="font-bold text-gray-900">
                      {lang === 'en' ? project.handoverEn : project.handoverBn}
                    </span>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-2 flex items-center space-x-2">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                      <span>{t.projects.card.viewDetails}</span>
                    </button>

                    <button
                      onClick={() => onOpenBookVisit(project)}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-[#CE2028] hover:bg-[#A9141B] text-white text-xs font-bold shadow-md shadow-[#CE2028]/20 transition-all cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-white" />
                      <span>{t.projects.card.bookVisit}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">
              {lang === 'en' ? 'No projects matched your criteria' : 'আপনার পছন্দের সাথে কোনো প্রকল্প পাওয়া যায়নি'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {lang === 'en' ? 'Try adjusting your search filters or view all developments.' : 'ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন অথবা সকল প্রকল্প দেখুন।'}
            </p>
            <button
              onClick={() => setActiveTab('all')}
              className="mt-4 px-4 py-2 bg-[#CE2028] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              {lang === 'en' ? 'Reset Filters' : 'ফিল্টার রিসেট করুন'}
            </button>
          </div>
        )}

        {/* Featured View All CTA */}
        {featured && (
          <div className="mt-12 text-center">
            <button
              onClick={onViewAllProjects}
              className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-gray-900 to-[#1C1819] hover:from-[#CE2028] hover:to-[#A9141B] text-white text-sm font-bold shadow-xl shadow-black/10 hover:shadow-[#CE2028]/25 transition-all duration-300 cursor-pointer group active:scale-95"
            >
              <span>{lang === 'en' ? 'Explore Full Portfolio (All 4 Projects)' : 'আমাদের সকল প্রকল্প দেখুন (৪টি প্রকল্প)'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
