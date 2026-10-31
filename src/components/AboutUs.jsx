import React, { useState } from 'react';
import { 
  Building2, 
  Award, 
  CheckCircle, 
  Quote, 
  Sparkles, 
  Target, 
  Eye, 
  ShieldCheck, 
  Compass, 
  TrendingUp,
  UserCheck,
  FileCheck2,
  Scale,
  Users2,
  Briefcase,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export default function AboutUs({ lang, t }) {
  const [activePolicyTab, setActivePolicyTab] = useState('governance'); // 'governance', 'shareholder', 'commitment'
  const g = t.governance;
  const sp = t.shareholderPolicy;
  const cm = t.commitment;

  return (
    <section id="about" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#CE2028] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.about.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#231F20] tracking-tight">
            {t.about.title}
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t.about.subtitle}
          </p>
        </div>

        {/* Philosophy, Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Philosophy */}
          <div className="p-7 rounded-2xl bg-gradient-to-br from-red-50/50 via-white to-gray-50 border border-red-100 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#CE2028]/10 text-[#CE2028] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{t.about.philosophyTitle}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t.about.philosophyText}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 text-xs font-bold text-[#CE2028] flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Core Philosophy' : 'আমাদের মূল দর্শন'}</span>
            </div>
          </div>

          {/* Vision */}
          <div className="p-7 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-white to-gray-50 border border-emerald-100 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#006231]/10 text-[#006231] flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{t.about.visionTitle}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t.about.visionText}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 text-xs font-bold text-[#006231] flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Long-Term Vision' : 'আমাদের দূরদর্শী ভিশন'}</span>
            </div>
          </div>

          {/* Mission */}
          <div className="p-7 rounded-2xl bg-gradient-to-br from-gray-50 via-white to-gray-50 border border-gray-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gray-900/10 text-gray-900 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{t.about.missionTitle}</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                {t.about.missions.slice(0, 4).map((m, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-[#006231] shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 text-xs font-bold text-gray-700 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#006231]" />
              <span>{lang === 'en' ? 'Action Plan' : 'বাস্তবায়নযোগ্য মিশন'}</span>
            </div>
          </div>
        </div>

        {/* Leadership Messages: Chairman & Managing Director */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chairman's Message */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border-2 border-red-100 shadow-xl shadow-red-900/5 relative flex flex-col justify-between overflow-hidden">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-[#CE2028] flex items-center space-x-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>{t.about.chairmanTitle}</span>
                </span>
                <Quote className="w-7 h-7 text-[#CE2028]/30" />
              </div>

              {/* Executive Portrait */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="relative w-40 sm:w-44 h-52 sm:h-60 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-red-100 bg-gray-50">
                  <img
                    src="/images/chairman.webp"
                    alt={t.about.chairmanName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                    "{t.about.chairmanQuote}"
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-gray-100 text-center sm:text-left space-y-0.5">
              <div className="text-base font-extrabold text-gray-900">{t.about.chairmanName}</div>
              <div className="text-xs font-bold text-[#CE2028]">{t.about.chairmanDesignation}</div>
              {t.about.chairmanEducation && (
                <div className="text-xs text-gray-500 font-medium">{t.about.chairmanEducation}</div>
              )}
            </div>
          </div>

          {/* Managing Director's Message */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border-2 border-emerald-100 shadow-xl shadow-emerald-900/5 relative flex flex-col justify-between overflow-hidden">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-[#006231] flex items-center space-x-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>{t.about.mdTitle}</span>
                </span>
                <Quote className="w-7 h-7 text-[#006231]/30" />
              </div>

              {/* Executive Portrait */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="relative w-40 sm:w-44 h-52 sm:h-60 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-emerald-100 bg-gray-50">
                  <img
                    src="/images/managing_director.webp"
                    alt={t.about.mdName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                    "{t.about.mdQuote}"
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-gray-100 text-center sm:text-left space-y-0.5">
              <div className="text-base font-extrabold text-gray-900">{t.about.mdName}</div>
              <div className="text-xs font-bold text-[#006231]">{t.about.mdDesignation}</div>
              {t.about.mdEducation && (
                <div className="text-xs text-gray-500 font-medium">{t.about.mdEducation}</div>
              )}
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-gray-50 to-white border border-gray-200 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 text-[#CE2028] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Core Institutional Pillars' : 'মূল প্রাতিষ্ঠানিক স্তম্ভ'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#231F20] tracking-tight">
              {t.about.valuesTitle}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              {t.about.valuesSubtitle || (lang === 'en' 
                ? 'The foundational pillars governing every decision, project, and partnership at Al-Emarah' 
                : 'আল-ইমারাহ প্রোপার্টিজের প্রতিটি সিদ্ধান্ত ও অংশীদারিত্বের দীর্ঘমেয়াদি ভিত্তি'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.about.values.map((val, idx) => {
              const iconsList = [Eye, Scale, Briefcase, Building2, FileCheck2, ShieldCheck];
              const IconComp = iconsList[idx] || ShieldCheck;
              const isObj = typeof val === 'object';
              const title = isObj ? val.title : val;
              const sub = isObj ? val.sub : '';
              const desc = isObj ? val.desc : '';

              return (
                <div 
                  key={idx} 
                  className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#CE2028]/40 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-emerald-50 border border-gray-100 flex items-center justify-center text-[#CE2028] group-hover:scale-110 transition-transform">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-extrabold text-gray-300 group-hover:text-[#CE2028] transition-colors">
                        0{idx + 1}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#CE2028] transition-colors flex items-center gap-2">
                      {title}
                      {sub && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 group-hover:bg-red-50 group-hover:text-[#CE2028] transition-colors">
                          {sub}
                        </span>
                      )}
                    </h4>

                    {desc && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed">
                        {desc}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center text-xs font-bold text-[#006231]">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-[#8EBF40]" />
                    <span>{lang === 'en' ? 'Institutional Principle' : 'প্রতিষ্ঠানিক মূলনীতি'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* EXECUTIVE COMMITTEE                                      */}
        {/* ========================================================= */}
        <div id="executive-committee" className="pt-4 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#006231] text-xs font-bold uppercase tracking-wider">
              <Users2 className="w-3.5 h-3.5" />
              <span>{t.about.board?.badge || (lang === 'en' ? 'Leadership & Governance' : 'নির্বাহী নেতৃত্ব ও সুশাসন')}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#231F20] tracking-tight">
              {t.about.board?.title || 'Executive Committee'}
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t.about.board?.subtitle || (lang === 'en' 
                ? 'Visionary leadership upholding ethical governance, transparent management, and strategic development for Al-Emarah Properties.'
                : 'সুপরিকল্পিত উন্নয়ন, স্বচ্ছ ব্যবস্থাপনা ও আস্থার সাথে স্থায়ী সম্পদ গড়ার লক্ষ্যে পরিচালিত কার্যনির্বাহী কমিটি।'
              )}
            </p>
          </div>

          {/* Unified Grid: All Executive Committee Members (4 members) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(t.about.board?.members || []).map((member) => (
              <div 
                key={member.id}
                className="bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Photo Portrait */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Info */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold tracking-wide mb-2.5">
                      {member.role}
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-[#006231] transition-colors leading-snug">
                      {member.name}
                    </h4>
                    <p className="text-xs font-semibold text-[#006231] mt-0.5">
                      {member.organization || (lang === 'en' ? 'Al-Emarah Properties' : 'আল-ইমারাহ প্রোপার্টিজ')}
                    </p>
                  </div>

                  {member.education && (
                    <div className="pt-3 border-t border-gray-100 flex items-start space-x-2 text-[11px] text-gray-600 leading-tight">
                      <GraduationCap className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#006231] shrink-0 mt-0.5 transition-colors" />
                      <span>{member.education}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOARD OF DIRECTORS (FULL 12 DIRECTORS)                   */}
        {/* ========================================================= */}
        <div id="board-of-directors" className="pt-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5 text-[#006231]" />
              <span>{t.about.boardOfDirectors?.badge || (lang === 'en' ? 'Board of Directors' : 'বোর্ড অব ডিরেক্টরস')}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#231F20] tracking-tight">
              {t.about.boardOfDirectors?.title || (lang === 'en' ? 'Board of Directors' : 'বোর্ড অব ডিরেক্টরস (Board of Directors)')}
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t.about.boardOfDirectors?.subtitle || (lang === 'en' 
                ? 'Distinguished board of directors steering Al-Emarah Properties toward sustainable growth, ethical investments, and excellence.'
                : 'আল-ইমারাহ প্রোপার্টিজের সামগ্রিক নীতিনির্ধারণ, স্বচ্ছ ব্যবসায়িক সুশাসন ও টেকসই প্রবৃদ্ধি অর্জনে সম্মানিত পরিচালনা পর্ষদ।'
              )}
            </p>
          </div>

          {/* 12 Directors Grid (4 columns desktop, 3 columns tablet, 2 columns mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {(t.about.boardOfDirectors?.members || []).map((member) => (
              <div 
                key={member.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group relative"
              >
                {/* Serial Badge */}
                <div className="absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-bold">
                  #{member.serial}
                </div>

                {/* Photo Portrait / Placeholder */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-slate-200">
                  {member.image ? (
                    <>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-50">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-slate-400 group-hover:text-[#006231] group-hover:scale-105 transition-all duration-300">
                        <Users2 className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5]" />
                      </div>
                      <span className="mt-3 text-[10px] sm:text-[11px] font-medium text-gray-400">
                        {lang === 'en' ? 'Photo Updating' : 'ছবি সংযোজন প্রক্রিয়াধীন'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <div className={`inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide mb-2 ${
                      member.role === 'Chairman' || member.role === 'চেয়ারম্যান'
                        ? 'bg-red-50 text-[#CE2028] border border-red-100'
                        : member.role === 'Managing Director' || member.role === 'ব্যবস্থাপনা পরিচালক'
                        ? 'bg-emerald-50 text-[#006231] border border-emerald-100'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {member.role}
                    </div>
                    <h4 className="text-sm sm:text-base md:text-lg font-black text-gray-900 group-hover:text-[#006231] transition-colors leading-snug">
                      {member.name}
                    </h4>
                    <p className="text-[11px] sm:text-xs font-semibold text-[#006231] mt-0.5">
                      {member.organization || (lang === 'en' ? 'Al-Emarah Properties' : 'আল-ইমারাহ প্রোপার্টিজ')}
                    </p>
                  </div>

                  {member.education && (
                    <div className="pt-2.5 border-t border-gray-100 flex items-start space-x-1.5 text-[10px] sm:text-[11px] text-gray-500 leading-tight">
                      <GraduationCap className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#006231] shrink-0 mt-0.5 transition-colors" />
                      <span className="line-clamp-2">{member.education}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* UNITED EMARAH LIMITED & SISTER CONCERNS                   */}
        {/* ========================================================= */}
        <div id="group-concerns" className="pt-6 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#CE2028] text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>{t.about.concerns?.badge || (lang === 'en' ? 'Corporate Ecosystem' : 'গ্রুপ কাঠামো ও অঙ্গপ্রতিষ্ঠানসমূহ')}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#231F20] tracking-tight">
              {t.about.concerns?.title || (lang === 'en' ? 'United Emarah Limited & Sister Concerns' : 'ইউনাইটেড ইমারাহ লিমিটেড ও সিস্টার কনসার্নস')}
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t.about.concerns?.subtitle || (lang === 'en' 
                ? 'A progressive corporate conglomerate delivering excellence across real estate development, agriculture, and emerging growth ventures in Bangladesh.'
                : 'আবাসন উন্নয়ন, আধুনিক কৃষি ও বহুমুখী শিল্প উদ্যোগের সমন্বয়ে দেশের অর্থনীতিতে ভূমিকা রাখা একটি সুদৃঢ় প্রাতিষ্ঠানিক পরিবার।')}
            </p>
          </div>

          {/* Master Parent / Holding Company Showcase Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C1819] via-[#241F21] to-[#121011] p-6 sm:p-10 text-white shadow-2xl border border-white/10">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#CE2028]/20 via-[#006231]/10 to-transparent blur-3xl pointer-events-none -mr-20 -mt-20"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10">
              {/* Left Info */}
              <div className="space-y-4 max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-emerald-400 text-xs font-bold tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.about.concerns?.parentTag || (lang === 'en' ? 'Principal Parent / Holding Company' : 'মূল মাদার / প্যারেন্ট কোম্পানি')}</span>
                </div>

                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                  UNITED EMARAH LIMITED
                </h4>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                  {t.about.concerns?.parentDesc || (lang === 'en'
                    ? 'The parent holding company responsible for strategic direction, policy enforcement, capital stewardship, and ethical corporate governance across all group ventures.'
                    : 'গ্রুপের সার্বিক দিকনির্দেশনা, কৌশলগত নীতি ও সুশাসনের মূল চালিকাশক্তি হিসেবে দায়িত্বরত শীর্ষ মাদার প্রতিষ্ঠান।')}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs text-gray-300">
                  <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 font-medium">
                    {lang === 'en' ? '✓ Registered Conglomerate' : '✓ নিবন্ধিত কর্পোরেট গ্রুপ'}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 font-medium">
                    {lang === 'en' ? '✓ Multi-Sector Growth' : '✓ বহুমুখী শিল্প বিনিয়োগ'}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 font-medium">
                    {lang === 'en' ? '✓ Ethical Corporate Governance' : '✓ সুশাসিত ব্যবস্থাপনা'}
                  </span>
                </div>
              </div>

              {/* Right Logo Display Frame */}
              <div className="w-full lg:w-auto shrink-0 flex justify-center">
                <div className="p-6 sm:p-8 rounded-2xl bg-white shadow-xl border border-gray-100 flex items-center justify-center max-w-xs sm:max-w-sm w-full">
                  <img
                    src="/images/united_emarah_limited.svg"
                    alt="United Emarah Limited"
                    className="w-full h-auto max-h-24 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sister Concerns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {(t.about.concerns?.list || []).map((concern) => (
              <div
                key={concern.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Concern Logo Box */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 border border-gray-100 p-3 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                      <img
                        src={concern.logo}
                        alt={concern.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-emerald-50 text-[#006231] border border-emerald-200">
                        {concern.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#CE2028] uppercase tracking-wider block">
                      {concern.badge}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-[#006231] transition-colors">
                      {concern.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {concern.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span className="text-[#006231] font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#8EBF40]" />
                    {concern.highlight}
                  </span>
                  <span className="text-3xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-mono font-medium">
                    {lang === 'en' ? 'A Concern of UEL' : 'ইউনাইটেড ইমারাহ এর অঙ্গপ্রতিষ্ঠান'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* NEW SECTION: CORPORATE POLICIES & GOVERNANCE ACCORDION   */}
        {/* (Corporate Governance, Shareholder Policy, Commitment)   */}
        {/* ========================================================= */}
        <div className="pt-4 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5 text-[#006231]" />
              <span>{lang === 'en' ? 'Institutional Framework & Rights' : 'প্রাতিষ্ঠানিক কাঠামো ও নীতিমালা'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#231F20]">
              {lang === 'en' ? 'Corporate Governance & Policies' : 'কর্পোরেট সুশাসন ও প্রাতিষ্ঠানিক নীতি'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {lang === 'en' 
                ? 'Official governance, partnership rules, and ethical commitments from our Corporate Profile' 
                : 'আমাদের কর্পোরেট প্রোফাইল অনুযায়ী সুসংগঠিত প্রশাসনিক কাঠামো, শেয়ারহোল্ডার অধিকার ও অঙ্গীকার'
              }
            </p>
          </div>

          {/* Interactive Policy Tabs */}
          <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActivePolicyTab('governance')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activePolicyTab === 'governance'
                  ? 'bg-[#1C1819] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Briefcase className="w-4 h-4 text-[#8EBF40]" />
              <span>{g.badge}</span>
            </button>

            <button
              onClick={() => setActivePolicyTab('shareholder')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activePolicyTab === 'shareholder'
                  ? 'bg-[#006231] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users2 className="w-4 h-4 text-[#8EBF40]" />
              <span>{sp.badge}</span>
            </button>

            <button
              onClick={() => setActivePolicyTab('commitment')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activePolicyTab === 'commitment'
                  ? 'bg-[#CE2028] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>{cm.badge}</span>
            </button>
          </div>

          {/* Policy Tab 1: Corporate Governance */}
          {activePolicyTab === 'governance' && (
            <div className="bg-[#FAFBFB] p-7 sm:p-10 rounded-3xl border border-gray-200 shadow-xs space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#006231]">{g.badge}</span>
                <h4 className="text-xl sm:text-2xl font-bold text-gray-900">{g.title}</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {g.intro}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-red-50 text-[#CE2028] flex items-center justify-center font-bold text-sm">
                    ১
                  </div>
                  <h5 className="font-bold text-sm text-gray-900">{g.chairmanRole.title}</h5>
                  <p className="text-xs text-gray-600 leading-relaxed">{g.chairmanRole.desc}</p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#006231] flex items-center justify-center font-bold text-sm">
                    ২
                  </div>
                  <h5 className="font-bold text-sm text-gray-900">{g.execRole.title}</h5>
                  <p className="text-xs text-gray-600 leading-relaxed">{g.execRole.desc}</p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center font-bold text-sm">
                    ৩
                  </div>
                  <h5 className="font-bold text-sm text-gray-900">{g.supervisionRole.title}</h5>
                  <p className="text-xs text-gray-600 leading-relaxed">{g.supervisionRole.desc}</p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-900 font-medium">
                "{g.conclusion}"
              </div>
            </div>
          )}

          {/* Policy Tab 2: Shareholder Policy */}
          {activePolicyTab === 'shareholder' && (
            <div className="bg-[#FAFBFB] p-7 sm:p-10 rounded-3xl border border-gray-200 shadow-xs space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#006231]">{sp.badge}</span>
                <h4 className="text-xl sm:text-2xl font-bold text-gray-900">{sp.title}</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {sp.intro}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {sp.rules.map((rule, idx) => (
                  <div key={idx} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2">
                    <div className="flex items-center space-x-2">
                      <FileCheck2 className="w-4 h-4 text-[#006231]" />
                      <h5 className="font-bold text-sm text-gray-900">{rule.title}</h5>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-2xl text-xs text-gray-600 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#8EBF40] shrink-0" />
                <span>
                  {lang === 'en'
                    ? 'All shareholder and partnership agreements are sealed under formal written stamps according to Bangladesh contract laws.'
                    : 'প্রতিটি শেয়ারহোল্ডার ও অংশীদারিত্ব চুক্তিপত্র বাংলাদেশ চুক্তি আইন অনুযায়ী নির্ধারিত নন-জুডিশিয়াল স্ট্যাম্পে সিলমোহরকৃত।'
                  }
                </span>
              </div>
            </div>
          )}

          {/* Policy Tab 3: Our Commitment */}
          {activePolicyTab === 'commitment' && (
            <div className="bg-gradient-to-r from-[#1C1819] via-[#2A2324] to-[#1C1819] text-white p-7 sm:p-10 rounded-3xl shadow-xl space-y-5 animate-fadeIn">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#8EBF40] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{cm.badge}</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                "{cm.quote}"
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-3xl">
                {cm.description}
              </p>
              <div className="pt-3 border-t border-white/10 text-xs font-bold text-[#8EBF40]">
                {cm.tagline}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
