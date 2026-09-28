import React from 'react';
import { 
  Moon,
  Users2,
  Smile,
  Trees,
  MapPin,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function Amenities({ lang, t }) {
  // Correctly aligned icons for the 6 signature amenities
  const amenityIcons = [
    Moon,        // 1. Rooftop Prayer Space (Musalla) & Adhan
    Users2,      // 2. Community Space & Social Hall
    Smile,       // 3. Children's Safe Play Zone
    Trees,       // 4. Landscaped Rooftop Garden & BBQ
    MapPin,      // 5. Civic Conveniences Proximity
    ShieldCheck  // 6. Dual-Tier Residential Security
  ];

  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-[#0F1412] via-[#161D1A] to-[#0D110F] text-white relative overflow-hidden">
      {/* Background ambient lighting accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#006231]/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#CE2028]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#8EBF40]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#8EBF40] text-xs font-bold uppercase tracking-wider border border-white/10 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#8EBF40] animate-pulse" />
            <span>{t.amenities.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {t.amenities.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t.amenities.subtitle}
          </p>
        </div>

        {/* 4 Feature Highlights Pills Strip */}
        {t.amenities.highlights && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 max-w-4xl mx-auto">
            {t.amenities.highlights.map((highlight, hIdx) => (
              <div 
                key={hIdx}
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs sm:text-sm text-gray-200 backdrop-blur-md shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8EBF40] shrink-0" />
                <span className="font-medium">{highlight}</span>
              </div>
            ))}
          </div>
        )}

        {/* 6 Luxury Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {t.amenities.items.map((item, idx) => {
            const IconComponent = amenityIcons[idx] || Sparkles;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#8EBF40]/40 hover:bg-white/[0.07] backdrop-blur-md transition-all duration-300 group flex flex-col justify-between shadow-lg shadow-black/20 hover:scale-[1.01]"
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon & Sequence Number */}
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#8EBF40]/20 via-[#006231]/30 to-[#CE2028]/20 border border-white/10 flex items-center justify-center text-[#8EBF40] group-hover:scale-110 group-hover:text-white group-hover:border-[#8EBF40]/40 transition-all shadow-md">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-gray-500 group-hover:text-[#8EBF40] transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#8EBF40] transition-colors">
                      {item.title}
                    </h3>
                    {item.sub && (
                      <span className="inline-block text-xs font-semibold text-gray-400 mt-1">
                        {item.sub}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Tag */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="inline-flex items-center text-xs font-semibold text-[#8EBF40]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8EBF40] mr-2"></span>
                    <span>{item.tag || (lang === 'en' ? 'Signature Feature' : 'বিশেষ আয়োজন')}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Assurance Strip */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs sm:text-sm text-gray-300">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#8EBF40]/20 text-[#8EBF40] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>
              {lang === 'en' 
                ? 'Designed for complete architectural serenity, social harmony, and family safety.'
                : 'আপনার পরিবারের আত্মিক প্রশান্তি, সামাজিক সৌহার্দ্য ও নিরাপদ জীবনযাপনে আল-ইমারাহ অঙ্গীকারবদ্ধ।'
              }
            </span>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#A9141B] hover:opacity-95 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
          >
            <span>{lang === 'en' ? 'Book a Project Walkthrough' : 'সাইট পরিদর্শনের আবেদন করুন'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
