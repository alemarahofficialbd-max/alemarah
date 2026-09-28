import React from 'react';
import { 
  Trees, 
  ArrowUpCircle, 
  Zap, 
  ShieldCheck, 
  Dumbbell, 
  Flame,
  Sparkles
} from 'lucide-react';

export default function Amenities({ lang, t }) {
  const amenityIcons = [
    Trees,
    ArrowUpCircle,
    Zap,
    ShieldCheck,
    Dumbbell,
    Flame
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 via-[#1C1819] to-gray-900 text-white relative overflow-hidden">
      {/* Subtle brand glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#CE2028]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#8EBF40]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-[#8EBF40] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.amenities.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.amenities.title}
          </h2>
          <p className="mt-3 text-base text-gray-400">
            {t.amenities.subtitle}
          </p>
        </div>

        {/* 6 Amenities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.amenities.items.map((item, idx) => {
            const IconComponent = amenityIcons[idx] || Sparkles;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#CE2028]/20 to-[#8EBF40]/20 flex items-center justify-center text-[#8EBF40] group-hover:scale-110 transition-transform mb-4">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#8EBF40] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
