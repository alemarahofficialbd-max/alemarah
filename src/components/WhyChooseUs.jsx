import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  FileCheck2, 
  Leaf, 
  Award, 
  Headphones,
  CheckCircle2,
  Sparkles,
  DollarSign,
  Scale,
  MapPin,
  Building,
  Coins,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function WhyChooseUs({ lang, t }) {
  const icons = [
    ShieldCheck,
    Clock,
    FileCheck2,
    Leaf,
    Award,
    Headphones
  ];

  const ip = t.investmentPolicy;
  const ps = t.projectSelection;

  return (
    <section id="why-us" className="py-16 md:py-20 bg-gray-50 border-y border-gray-100 relative overflow-hidden">
      {/* Decorative gradient accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-red-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-[#006231] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#8EBF40]" />
            <span>{t.whyUs.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#231F20] tracking-tight">
            {t.whyUs.title}
          </h2>
          <p className="mt-3 text-base text-gray-600">
            {t.whyUs.subtitle}
          </p>
        </div>

        {/* 6 Core Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.whyUs.features.map((feature, idx) => {
            const IconComponent = icons[idx] || ShieldCheck;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-gray-200 shadow-xs hover:shadow-lg hover:border-gray-300 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-50 to-emerald-50 border border-gray-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-[#CE2028]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#CE2028] transition-colors mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center text-xs font-bold text-[#006231]">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-[#8EBF40]" />
                  <span>{lang === 'en' ? 'Quality Guaranteed' : 'মানসম্মত নিশ্চয়তা'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* The Way Forward Strip (Authentic from Corporate Profile PDF) */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#006231] to-[#8EBF40] text-white flex items-center justify-center shrink-0 shadow-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-gray-900">{t.whyUs.wayForwardTitle}</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 leading-relaxed">{t.whyUs.wayForwardText}</p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* NEW SECTION: PROJECT SELECTION PRIORITIES (PDF PROFILE)   */}
        {/* ========================================================= */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xs space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#CE2028] bg-red-50 px-3 py-1 rounded-full">
              {ps.badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#231F20]">
              {ps.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {ps.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ps.factors.map((factor, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#006231] transition-colors space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#006231] flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <h4 className="text-sm font-bold text-gray-900">{factor.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{factor.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* NEW SECTION: INVESTMENT POLICY (PDF PROFILE)              */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-br from-emerald-950 via-[#004724] to-emerald-950 text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8EBF40]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#8EBF40] border border-white/10">
              <Coins className="w-3.5 h-3.5" />
              <span>{ip.badge}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {ip.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
              {ip.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
            {ip.points.map((pt, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
                <div className="flex items-center space-x-2 text-[#8EBF40] text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{pt.title}</span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300 flex items-center justify-between flex-wrap gap-3 relative z-10">
            <span>
              {lang === 'en' 
                ? '★ Guaranteed Capital Settlement within 90 Working Days post audit reconciliation.'
                : '★ চূড়ান্ত হিসাব নিরীক্ষা ও প্রাপ্যতা নিষ্পত্তির পর সর্বোচ্চ ৯০ কার্যদিবসের মধ্যে মূলধন পরিশোধের নিশ্চয়তা।'
              }
            </span>
            <span className="font-bold text-[#8EBF40]">
              {lang === 'en' ? 'Minimum: BDT 1,00,000' : 'সর্বনিম্ন বিনিয়োগ: ৳ ১,০০,০০০'}
            </span>
          </div>
        </div>

        {/* Highlight Banner / Trust Strip */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1C1819] via-[#2A2324] to-[#1C1819] text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="space-y-2 text-center lg:text-left">
            <div className="text-xs uppercase font-extrabold tracking-widest text-[#8EBF40]">
              {lang === 'en' ? 'Built on Trust & Heritage' : 'আস্থা ও ঐতিহ্যের প্রতীক'}
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'en' ? 'Over 15 Years of Engineering Distinction' : '১৫ বছরেরও বেশি স্থাপত্য ও নির্মাণ শ্রেষ্ঠত্ব'}
            </h3>
            <p className="text-sm text-gray-300 max-w-xl">
              {lang === 'en' 
                ? 'From foundation pile integrity testing to final handover keys, we take total ownership of your living legacy.' 
                : 'ফাউন্ডেশন পাইলিং থেকে শুরু করে ফ্ল্যাটের চাবি হস্তান্তর পর্যন্ত প্রতিটি ধাপে আমরা শতভাগ দায়বদ্ধ।'
              }
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
              <div className="text-xl font-black text-[#8EBF40]">7.5+</div>
              <div className="text-xs text-gray-300">{lang === 'en' ? 'Richter Scale Safe' : 'ভূমিকম্প সহনশীলতা'}</div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
              <div className="text-xl font-black text-[#CE2028]">100%</div>
              <div className="text-xs text-gray-300">{lang === 'en' ? 'RAJUK Approval' : 'রাজউক অনুমোদন'}</div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
              <div className="text-xl font-black text-blue-400">BUET</div>
              <div className="text-xs text-gray-300">{lang === 'en' ? 'Tested Steel & Concrete' : 'রড ও পাথর টেস্ট'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
