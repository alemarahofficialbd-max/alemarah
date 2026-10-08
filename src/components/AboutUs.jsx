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
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic font-serif">
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
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic font-serif">
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

        {/* ========================================================= */}
        {/* EXECUTIVE COMMITTEE BOARD OF DIRECTORS                   */}
        {/* ========================================================= */}
        <div id="board-of-directors" className="pt-4 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#CE2028] text-xs font-bold uppercase tracking-wider">
              <Users2 className="w-3.5 h-3.5" />
              <span>{t.about.board?.badge || (lang === 'en' ? 'Leadership & Governance' : 'নির্বাহী নেতৃত্ব ও সুশাসন')}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#231F20] tracking-tight">
              {t.about.board?.title || 'Executive Committee Board of Directors'}
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t.about.board?.subtitle || (lang === 'en' 
                ? 'Visionary leadership upholding ethical governance, transparent management, and strategic development for Al-Emarah Properties.'
                : 'সুপরিকল্পিত উন্নয়ন, স্বচ্ছ ব্যবস্থাপনা ও আস্থার সাথে স্থায়ী সম্পদ গড়ার লক্ষ্যে পরিচালিত কার্যনির্বাহী কমিটি ও পরিচালনা পর্ষদ।'
              )}
            </p>
          </div>

          {/* Top Row: Executive Leadership (Chairman & Managing Director) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Sheikh Fazlul Karim Maroof - Chairman */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-red-50/60 via-white to-gray-50 border-2 border-red-100/80 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
                <div className="relative w-36 h-44 sm:w-40 sm:h-48 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-red-200/70 bg-gray-100 group-hover:scale-[1.02] transition-transform">
                  <img
                    src="/images/chairman.webp"
                    alt={lang === 'en' ? 'Sheikh Fazlul Karim Maroof' : 'শেখ ফজলুল করিম মারুফ'}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:hidden"></div>
                  <div className="absolute bottom-2 left-2 right-2 text-center sm:hidden text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs py-0.5 rounded-md">
                    {lang === 'en' ? 'Chairman' : 'চেয়ারম্যান'}
                  </div>
                </div>

                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-100/80 text-[#CE2028] text-xs font-extrabold uppercase tracking-wider">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Chairman' : 'চেয়ারম্যান'}</span>
                  </div>

                  <div>
                    <h4 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-[#CE2028] transition-colors">
                      {lang === 'en' ? 'Sheikh Fazlul Karim Maroof' : 'শেখ ফজলুল করিম মারুফ'}
                    </h4>
                    <p className="text-xs sm:text-sm font-bold text-[#CE2028] mt-0.5">
                      {lang === 'en' ? 'Chairman, Al-Emarah Properties' : 'চেয়ারম্যান, আল-ইমারাহ প্রোপার্টিজ'}
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="inline-flex items-center space-x-2 text-xs sm:text-sm text-gray-700 font-semibold bg-white p-2.5 rounded-xl border border-red-100 shadow-2xs">
                      <GraduationCap className="w-4 h-4 text-[#CE2028] shrink-0" />
                      <span>{lang === 'en' ? 'Graduate, Public Administration, University of Dhaka' : 'স্নাতক, লোক প্রশাসন, ঢাকা বিশ্ববিদ্যালয়'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed pt-1">
                    {lang === 'en'
                      ? 'Guiding institutional vision, corporate ethics, and community-centric sustainable urbanization.'
                      : 'প্রাতিষ্ঠানিক দূরদর্শিতা, নৈতিক সুশাসন ও জনকল্যাণমুখী টেকসই নগরায়ণের প্রধান দিকনির্দেশক।'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Talukdar Tariq Masud - Managing Director */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-50/60 via-white to-gray-50 border-2 border-emerald-100/80 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
                <div className="relative w-36 h-44 sm:w-40 sm:h-48 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-emerald-200/70 bg-gray-100 group-hover:scale-[1.02] transition-transform">
                  <img
                    src="/images/managing_director.webp"
                    alt={lang === 'en' ? 'Talukdar Tariq Masud' : 'তালুকদার তারিক মাসউদ'}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:hidden"></div>
                  <div className="absolute bottom-2 left-2 right-2 text-center sm:hidden text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs py-0.5 rounded-md">
                    {lang === 'en' ? 'Managing Director' : 'ব্যবস্থাপনা পরিচালক'}
                  </div>
                </div>

                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-[#006231] text-xs font-extrabold uppercase tracking-wider">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Managing Director' : 'ব্যবস্থাপনা পরিচালক'}</span>
                  </div>

                  <div>
                    <h4 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-[#006231] transition-colors">
                      {lang === 'en' ? 'Talukdar Tariq Masud' : 'তালুকদার তারিক মাসউদ'}
                    </h4>
                    <p className="text-xs sm:text-sm font-bold text-[#006231] mt-0.5">
                      {lang === 'en' ? 'Managing Director, Al-Emarah Properties' : 'ব্যবস্থাপনা পরিচালক, আল-ইমারাহ প্রোপার্টিজ'}
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="inline-flex items-center space-x-2 text-xs sm:text-sm text-gray-700 font-semibold bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                      <GraduationCap className="w-4 h-4 text-[#006231] shrink-0" />
                      <span>{lang === 'en' ? 'BSS Political Science, Govt. Titumir College' : 'BSS রাষ্ট্রবিজ্ঞান, সরকারি তিতুমীর কলেজ'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed pt-1">
                    {lang === 'en'
                      ? 'Spearheading executive operations, project execution, agro initiatives, and stakeholder trust.'
                      : 'সার্বিক নির্বাহী ব্যবস্থাপনা, নির্মাণ প্রকল্প বাস্তবায়ন, এগ্রো উদ্যোগ ও অংশীদারিত্বের কাণ্ডারি।'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Additional Directors / Demo Placeholders */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gray-50/70 border border-gray-200/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/80 pb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-[#006231]" />
                  <span>{t.about.board?.directorsBadge || (lang === 'en' ? 'Board of Directors (Upcoming Inductions)' : 'পরিচালকবৃন্দ (আসন্ন সদস্য / প্রস্তাবিত)')}</span>
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t.about.board?.directorsNote || (lang === 'en' 
                    ? 'Additional executive and advisory board members are currently in the process of induction.'
                    : 'কার্যনির্বাহী পরিচালনা পর্ষদে আরো সম্মানিত পরিচালক সদস্য যুক্ত করার কার্যক্রম চলমান রয়েছে।'
                  )}
                </p>
              </div>
              <span className="inline-flex items-center self-start sm:self-auto px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                {lang === 'en' ? '4 Slots Pending Induction' : '৪টি পদে সংযোজন প্রক্রিয়াধীন'}
              </span>
            </div>

            {/* Demo Grid: 4 Directors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(t.about.board?.members?.filter(m => m.isDemo) || [
                {
                  id: "dir_technical",
                  name: lang === 'en' ? 'Engr. M. A. Rahman' : 'ইঞ্জি. এম. এ. রহমান',
                  role: lang === 'en' ? 'Director (Technical & Engineering)' : 'পরিচালক (প্রকৌশল ও কারিগরি)',
                  education: lang === 'en' ? 'B.Sc Civil Engineering, BUET' : 'বিএসসি ইন সিভিল ইঞ্জিনিয়ারিং, বুয়েট'
                },
                {
                  id: "dir_legal",
                  name: lang === 'en' ? 'Barrister S. H. Chowdhury' : 'ব্যারিস্টার এস. এইচ. চৌধুরী',
                  role: lang === 'en' ? 'Director (Legal & Compliance)' : 'পরিচালক (আইন ও কমপ্লায়েন্স)',
                  education: lang === 'en' ? 'LL.B (Hons), LL.M, DU' : 'এলএলবি (অনার্স), এলএলএম, ঢাকা বিশ্ববিদ্যালয়'
                },
                {
                  id: "dir_finance",
                  name: lang === 'en' ? 'Tanvir Hasan, FCA' : 'তানভীর হাসান, এফসিএ',
                  role: lang === 'en' ? 'Director (Finance & Accounts)' : 'পরিচালক (অর্থ ও নিরীক্ষা)',
                  education: lang === 'en' ? 'Chartered Accountant (ICAB)' : 'চার্টার্ড অ্যাকাউন্ট্যান্ট (আইসিএবি)'
                },
                {
                  id: "dir_planning",
                  name: lang === 'en' ? 'Syed Mahmudul Huq' : 'সৈয়দ মাহমুদুল হক',
                  role: lang === 'en' ? 'Director (Planning & Business Dev.)' : 'পরিচালক (পরিকল্পনা ও বিজনেস ডেভ.)',
                  education: lang === 'en' ? 'MBA in Urban Management, DU' : 'এমবিএ, ঢাকা বিশ্ববিদ্যালয়'
                }
              ]).map((director, idx) => (
                <div 
                  key={director.id || idx}
                  className="p-5 bg-white rounded-2xl border border-dashed border-gray-300 hover:border-[#006231] hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-[#006231]/10 text-gray-500 group-hover:text-[#006231] flex items-center justify-center transition-colors">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 group-hover:bg-emerald-50 group-hover:text-[#006231] transition-colors">
                        {lang === 'en' ? 'Board Member' : 'বোর্ড সদস্য'}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-bold text-sm text-gray-900 group-hover:text-[#006231] transition-colors">
                        {director.name}
                      </h5>
                      <p className="text-xs font-semibold text-[#006231] mt-0.5">
                        {director.role}
                      </p>
                    </div>

                    <div className="flex items-start space-x-1.5 text-[11px] text-gray-500">
                      <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                      <span>{director.education}</span>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                    <span>{lang === 'en' ? 'Director Slot' : 'পরিচালক পদ'}</span>
                    <span className="text-[#8EBF40] font-bold">{lang === 'en' ? 'Demo / Upcoming' : 'আসন্ন / ডেমো'}</span>
                  </div>
                </div>
              ))}
            </div>
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
