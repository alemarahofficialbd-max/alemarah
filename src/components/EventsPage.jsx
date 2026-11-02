import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Quote, 
  Camera, 
  X, 
  Share2, 
  CheckCircle2, 
  Sparkles,
  Building2,
  Phone
} from 'lucide-react';
import { eventsData } from '../data/eventsData';

export default function EventsPage({ lang = 'bn', onBack = () => {}, onOpenBookVisit = () => {} }) {
  const [activePhotoModal, setActivePhotoModal] = useState(null);
  const [copied, setCopied] = useState(false);
  const isEn = lang === 'en';
  const event = eventsData[0];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title[lang],
          text: event.tagline[lang],
          url: url
        });
      } catch (_) {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (_) {}
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-8 sm:py-12 animate-fadeIn select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Back to Home' : 'হোমপেজে ফিরে যান'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#006231] hover:bg-emerald-50/50 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">{isEn ? 'Link Copied' : 'লিংক কপি হয়েছে'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>{isEn ? 'Share Event' : 'শেয়ার করুন'}</span>
              </>
            )}
          </button>
        </div>

        {/* Main Article Container */}
        <article className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          {/* Article Header Banner */}
          <div className="p-6 sm:p-10 border-b border-slate-100 bg-gradient-to-b from-slate-50/60 to-white space-y-4">
            {/* Meta Tags */}
            <div className="flex items-center flex-wrap gap-2 text-2xs sm:text-xs">
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 text-[#006231] font-bold border border-emerald-200">
                <Users className="w-3.5 h-3.5" />
                <span>{event.category[lang]}</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{event.date[lang]}</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{event.location[lang]}</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {event.title[lang]}
            </h1>

            {/* Tagline / Core Message */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 flex items-start space-x-3">
              <Quote className="w-5 h-5 text-[#006231] shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base font-bold text-[#006231] leading-relaxed">
                "{event.tagline[lang]}"
              </p>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="p-6 sm:p-10 space-y-4 bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Camera className="w-5 h-5 text-[#006231]" />
                <span>{isEn ? 'Event Photo Gallery' : 'অনুষ্ঠানের আলোকচিত্র ও বিশেষ মুহূর্ত'}</span>
              </h3>
              <span className="text-3xs text-slate-400 font-medium">
                {isEn ? 'Click any photo to enlarge' : 'বড় করে দেখতে ছবিতে ক্লিক করুন'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {event.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePhotoModal(img)}
                  className="group rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-900 relative">
                    <img
                      src={img.src}
                      alt={img.title[lang]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1 rounded-full bg-black/60 text-white text-3xs font-bold backdrop-blur-xs flex items-center space-x-1">
                        <Camera className="w-3 h-3" />
                        <span>{isEn ? 'View' : 'দেখুন'}</span>
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-white flex-1 flex flex-col justify-between">
                    <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{img.title[lang]}</h5>
                    <p className="text-3xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{img.caption[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Article Text Body */}
          <div className="p-6 sm:p-10 space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed select-text">
            {event.paragraphs[lang].map((p, idx) => (
              <p key={idx} className="font-normal text-slate-800 leading-loose">
                {p}
              </p>
            ))}

            {/* Formal Closing */}
            <div className="pt-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-medium">{event.closing.signOff[lang]}</div>
                <div className="text-base font-black text-slate-900">{event.closing.organization}</div>
                <div className="text-xs font-semibold text-[#006231] tracking-wide">{event.closing.motto}</div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onOpenBookVisit}
                  className="px-5 py-2.5 rounded-xl bg-[#CE2028] hover:bg-[#A9141B] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#CE2028]/25 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <Building2 className="w-4 h-4 inline mr-1.5" />
                  <span>{isEn ? 'Explore Projects' : 'প্রকল্প পরিদর্শন করুন'}</span>
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Future Events Notice Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl border border-white/10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-3xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{isEn ? 'Upcoming Initiatives' : 'ধারাবাহিক আয়োজন'}</span>
            </div>
            <h4 className="text-base sm:text-lg font-black text-white">
              {isEn ? 'Stay Connected with Al-Emarah' : 'পরবর্তী আয়োজনে অংশ নিতে আমাদের সাথে যুক্ত থাকুন'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {isEn
                ? 'We regularly host site seminars, foundation ceremonies, and client meetups upholding total transparency.'
                : 'প্রতিটি নতুন প্রজেক্টের সূচনা, ভিত্তিপ্রস্তর স্থাপন ও অগ্রগতি নিয়ে নিয়মিত মতবিনিময় সভার আয়োজন অব্যাহত থাকবে।'}
            </p>
          </div>

          <a
            href="tel:+8801816233013"
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold flex items-center space-x-2 shrink-0 cursor-pointer self-start sm:self-auto transition-all"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>{isEn ? 'Contact Office' : 'অফিসে যোগাযোগ'}</span>
          </a>
        </div>
      </div>

      {/* Lightbox Photo Modal */}
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
    </div>
  );
}
