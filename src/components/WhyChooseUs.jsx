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
  FileText,
  Quote,
  Compass,
  Users,
  ArrowRight,
  Phone,
  MessageSquare
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
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-[#006231] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#8EBF40]" />
            <span>{t.whyUs.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#231F20] tracking-tight">
            {t.whyUs.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t.whyUs.subtitle}
          </p>
        </div>

        {/* 4-Stat Institutional Metrics Bar */}
        {t.whyUs.stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {t.whyUs.stats.map((stat, sIdx) => (
              <div 
                key={sIdx} 
                className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs hover:border-[#006231] transition-colors text-center space-y-1"
              >
                <div className="text-2xl sm:text-3xl font-black text-[#006231]">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-gray-900">
                  {stat.label}
                </div>
                <div className="text-[11px] text-gray-500 font-medium">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 6 Core Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.whyUs.features.map((feature, idx) => {
            const pillarIcons = [
              Compass,
              TrendingUp,
              Users,
              FileCheck2,
              Scale,
              Award
            ];
            const IconComponent = pillarIcons[idx] || ShieldCheck;

            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-gray-200 shadow-xs hover:shadow-xl hover:border-[#CE2028]/40 transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-50 to-emerald-50 border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 text-[#CE2028]" />
                    </div>
                    <span className="text-xs font-black text-gray-300 group-hover:text-[#CE2028] transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#CE2028] transition-colors">
                      {feature.title}
                    </h3>
                    {feature.sub && (
                      <span className="inline-block text-xs font-semibold text-gray-500 mt-0.5">
                        {feature.sub}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center text-xs font-bold text-[#006231]">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-[#8EBF40]" />
                    <span>{feature.tag || (lang === 'en' ? 'Verified Pillar' : 'যাচাইকৃত স্তম্ভ')}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#CE2028] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        {/* The Way Forward Section (Strategic Multi-Asset Roadmap) */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#004723] via-[#006231] to-[#002e16] text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#8EBF40]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#8EBF40] border border-white/10">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t.whyUs.wayForwardBadge || (lang === 'en' ? 'Strategic Roadmap' : 'কৌশলগত রোডম্যাপ')}</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.whyUs.wayForwardTitle}
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
              {t.whyUs.wayForwardText}
            </p>
          </div>

          {/* 3 Pillars Roadmap Cards */}
          {t.whyUs.wayForwardPillars && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 relative z-10">
              {t.whyUs.wayForwardPillars.map((pillar, pIdx) => (
                <div key={pIdx} className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1.5 hover:bg-white/15 transition-all">
                  <div className="text-xs font-black text-[#8EBF40]">0{pIdx + 1}</div>
                  <h4 className="text-sm font-bold text-white">{pillar.title}</h4>
                  <p className="text-xs text-gray-300">{pillar.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* NEW SECTION: PROJECT SELECTION PRIORITIES (PDF PROFILE)   */}
        {/* ========================================================= */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-md space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 text-[#CE2028] text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>{ps.badge}</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#231F20] tracking-tight">
              {ps.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {ps.subtitle || ps.intro}
            </p>
          </div>

          {/* Official Quote Banner from PDF Profile */}
          {ps.quote && (
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-50/70 via-amber-50/40 to-emerald-50/70 border border-gray-200 flex items-start space-x-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#CE2028] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Quote className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-gray-700 italic font-medium leading-relaxed">
                "{ps.quote}"
              </p>
            </div>
          )}

          {/* 8 Factor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {ps.factors.map((factor, idx) => {
              const factorIcons = [
                MapPin,
                FileCheck2,
                TrendingUp,
                Building,
                Coins,
                Sparkles,
                Award,
                ShieldCheck
              ];
              const IconComp = factorIcons[idx] || CheckCircle2;

              return (
                <div 
                  key={idx} 
                  className="p-6 rounded-2xl bg-gray-50/80 border border-gray-200 hover:border-[#006231] hover:bg-white hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 text-[#006231] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#006231] group-hover:text-white transition-all shadow-2xs">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black text-gray-400 group-hover:text-[#CE2028] transition-colors">
                        0{idx + 1}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#006231] transition-colors">
                        {factor.title}
                      </h4>
                      {factor.sub && (
                        <span className="inline-block text-[11px] font-semibold text-gray-500 mt-0.5">
                          {factor.sub}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {factor.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center text-[11px] font-bold text-[#006231]">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#8EBF40]" />
                    <span>{lang === 'en' ? 'Verified Criterion' : 'যাচাইকৃত মানদণ্ড'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 5-Step Feasibility Audit Bar */}
          {ps.checklist && (
            <div className="p-6 sm:p-7 rounded-2xl bg-emerald-950 text-white space-y-4 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#8EBF40]" />
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {ps.checklistTitle}
                  </h4>
                </div>
                <span className="text-xs text-[#8EBF40] font-semibold">
                  {lang === 'en' ? 'Zero Compromise Policy' : '১০০% আপসহীন প্রাতিষ্ঠানিক পলিসি'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                {ps.checklist.map((item, cIdx) => (
                  <div key={cIdx} className="flex items-start space-x-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-[#8EBF40] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* NEW SECTION: INVESTMENT POLICY (PDF PROFILE)              */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-br from-emerald-950 via-[#004724] to-emerald-950 text-white p-8 sm:p-12 rounded-3xl shadow-2xl space-y-10 relative overflow-hidden border border-emerald-800/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8EBF40]/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header */}
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#8EBF40] border border-white/10">
              <Coins className="w-3.5 h-3.5" />
              <span>{ip.badge}</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {ip.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
              {ip.subtitle || ip.intro}
            </p>
          </div>

          {/* 2 Strategic Highlights: Min Investment & Settlement Guarantee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-[#8EBF40]/30 flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#8EBF40] text-emerald-950 flex items-center justify-center shrink-0 font-bold shadow-md">
                <Coins className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-[#8EBF40]">
                  {ip.minInvestmentLabel || (lang === 'en' ? 'Minimum Investment' : 'সর্বনিম্ন বিনিয়োগের পরিমাণ')}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {ip.minInvestmentValue || (lang === 'en' ? 'BDT 1,00,000' : '৳ ১,০০,০০০ (এক লক্ষ)')}
                </div>
                <p className="text-xs text-gray-300">
                  {ip.minInvestmentSub || (lang === 'en' ? 'Participatory asset creation for all income levels' : 'সীমিত আয়ের মানুষের সম্পদ সৃষ্টির অংশীদারিত্ব')}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#CE2028] text-white flex items-center justify-center shrink-0 font-bold shadow-md">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-red-300">
                  {ip.settlementLabel || (lang === 'en' ? 'Capital Settlement Guarantee' : 'মূলধন নিষ্পত্তি নিশ্চয়তা')}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {ip.settlementValue || (lang === 'en' ? 'Max 90 Business Days' : 'সর্বোচ্চ ৯০ কার্যদিবস')}
                </div>
                <p className="text-xs text-gray-300">
                  {ip.settlementSub || (lang === 'en' ? 'Post final audit & reconciliation clearance' : 'চূড়ান্ত হিসাব ও নিরীক্ষা সমন্বয়ের পর সম্পন্ন')}
                </p>
              </div>
            </div>
          </div>

          {/* 6 Formal Policy Clauses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
            {ip.points.map((pt, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:border-[#8EBF40]/60 hover:bg-white/15 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#8EBF40]/20 text-[#8EBF40] text-xs font-bold border border-[#8EBF40]/30">
                      {pt.clause || `0${idx + 1}`}
                    </span>
                    <FileCheck2 className="w-4 h-4 text-gray-400" />
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white leading-snug">
                      {pt.title}
                    </h4>
                    {pt.sub && (
                      <span className="inline-block text-xs font-semibold text-[#8EBF40] mt-0.5">
                        {pt.sub}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-200 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center text-[11px] font-bold text-[#8EBF40]">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                  <span>{pt.tag || (lang === 'en' ? 'Verified Clause' : 'অনুমোদিত ধারা')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Legal Guarantee & Investor Action Bar */}
          <div className="p-6 rounded-2xl bg-black/30 backdrop-blur-md border border-white/15 flex flex-col lg:flex-row items-center justify-between gap-5 relative z-10">
            <div className="flex items-start space-x-3 text-xs text-gray-300 max-w-2xl">
              <ShieldCheck className="w-5 h-5 text-[#8EBF40] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {ip.legalFooter || (lang === 'en' 
                  ? 'All investments are governed under verified written legal contracts, institutional accounting, and applicable regulatory frameworks.' 
                  : 'সকল বিনিয়োগ প্রতিষ্ঠানের অনুমোদিত কর্পোরেট কাঠামো, নিরীক্ষিত হিসাবরক্ষণ এবং বাংলাদেশ সরকারের প্রচলিত আইন ও লিখিত দলিলের অধীনে শতভাগ সুরক্ষিত।'
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="https://wa.me/8801918646575?text=Hello%20Al-Emarah%20Properties,%20I%20would%20like%20to%20know%20more%20about%20your%20Investment%20Policy"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#006231] hover:bg-[#004d26] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#8EBF40]" />
                <span>{lang === 'en' ? 'Chat on WhatsApp' : 'হোয়াটসঅ্যাপে জানুন'}</span>
              </a>

              <a
                href="tel:01918646575"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#CE2028] hover:bg-[#A9141B] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>{lang === 'en' ? 'Call Investment Desk' : 'বিনিয়োগ হটলাইন'}</span>
              </a>
            </div>
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
