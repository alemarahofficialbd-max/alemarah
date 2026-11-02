import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, ArrowRight, Camera, X, Users, Quote } from 'lucide-react';
import { eventsData } from '../data/eventsData';

export default function EventsSection({ lang = 'bn', onNavigateToEvents = () => {} }) {
  const [activePhotoModal, setActivePhotoModal] = useState(null);
  const isEn = lang === 'en';
  const event = eventsData[0];

  if (!event) return null;

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-white via-slate-50/60 to-white border-y border-slate-200/80 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-red-100/25 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200/70">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#006231] text-xs font-bold uppercase tracking-wider border border-emerald-200/80 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#006231]" />
              <span>{isEn ? 'Corporate Events & Updates' : 'কোম্পানি ইভেন্টস ও কার্যক্রম'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              <span>{isEn ? 'Recent Highlight:' : 'সাম্প্রতিক আয়োজন:'} </span>
              <span className="text-[#006231]">
                AL QUDS CONNECT 2026
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {isEn
                ? 'Meaningful gatherings, investor dialogues, and institutional milestones building trust for the future.'
                : 'সম্মানিত বিনিয়োগকারী ও গ্রাহকদের সাথে আন্তরিক মিলনমেলা, পারস্পরিক মতবিনিময় ও আস্থার সুদৃঢ় বন্ধন।'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToEvents(null)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#006231] text-white text-xs sm:text-sm font-bold shadow-md transition-all shrink-0 cursor-pointer self-start md:self-end active:scale-95"
          >
            <span>{isEn ? 'View All Events' : 'সকল ইভেন্ট তালিকা'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Event Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left/Top: 3-Image Interactive Grid */}
            <div className="lg:col-span-7 p-4 sm:p-6 bg-slate-50/70 border-b lg:border-b-0 lg:border-r border-slate-200/70 flex flex-col justify-between space-y-3">
              {/* Main Feature Photo */}
              <div 
                onClick={() => setActivePhotoModal(event.images[0])}
                className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[16/10] bg-slate-900 group cursor-pointer shadow-md"
              >
                <img 
                  src={event.images[0].src} 
                  alt={event.images[0].title[lang]} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-emerald-300 text-3xs font-bold border border-white/10 w-fit mb-1.5">
                    <Camera className="w-3 h-3" />
                    <span>{isEn ? 'Click to enlarge' : 'বড় করে দেখতে ক্লিক করুন'}</span>
                  </span>
                  <h4 className="text-sm sm:text-base font-black leading-snug">
                    {event.images[0].title[lang]}
                  </h4>
                  <p className="text-3xs sm:text-2xs text-slate-200 mt-0.5 line-clamp-1">
                    {event.images[0].caption[lang]}
                  </p>
                </div>
              </div>

              {/* Secondary 2 Photos Row */}
              <div className="grid grid-cols-2 gap-3">
                {event.images.slice(1, 3).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePhotoModal(img)}
                    className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 group cursor-pointer shadow-sm border border-slate-200/80"
                  >
                    <img 
                      src={img.src} 
                      alt={img.title[lang]} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                      <p className="text-3xs font-black truncate">
                        {img.title[lang]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right/Bottom: Story & Deliberations */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Meta info tags */}
                <div className="flex items-center flex-wrap gap-2 text-2xs text-slate-500">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#006231] font-bold border border-emerald-100">
                    <Users className="w-3.5 h-3.5" />
                    <span>{event.category[lang]}</span>
                  </span>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{event.date[lang]}</span>
                  </span>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{event.location[lang]}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-snug">
                  {event.title[lang]}
                </h3>

                {/* Motto / Tagline Badge */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-slate-50 border border-emerald-200/80 flex items-start space-x-2.5">
                  <Quote className="w-4 h-4 text-[#006231] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-bold text-[#006231] leading-relaxed">
                    "{event.tagline[lang]}"
                  </p>
                </div>

                {/* Excerpt paragraphs */}
                <div className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
                  <p>{event.paragraphs[lang][0]}</p>
                  <p className="hidden sm:block text-slate-500">{event.paragraphs[lang][1]}</p>
                </div>
              </div>

              {/* Bottom CTA to full details with Logo */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-3xs text-slate-400 font-semibold">{isEn ? 'Organized by' : 'আয়োজনে :'}</div>
                  <img 
                    src="/alemarah_logo_header.svg" 
                    alt="Al-Emarah Properties Limited" 
                    className="h-7 sm:h-8 w-auto object-contain"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateToEvents(event.id)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#006231] to-[#004724] hover:from-[#004724] hover:to-[#003318] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#006231]/25 flex items-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <span>{isEn ? 'Read Details' : 'সম্পূর্ণ বিবরণ পড়ুন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      {activePhotoModal && (
        <div 
          className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActivePhotoModal(null)}
        >
          <div 
            className="max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-4 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-white px-2">
              <h4 className="font-bold text-sm sm:text-base">{activePhotoModal.title[lang]}</h4>
              <button 
                type="button"
                onClick={() => setActivePhotoModal(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden max-h-[75vh] flex items-center justify-center bg-black">
              <img 
                src={activePhotoModal.src} 
                alt={activePhotoModal.title[lang]} 
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 px-2 leading-relaxed">
              {activePhotoModal.caption[lang]}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
