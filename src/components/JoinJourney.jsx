import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Coins, 
  FileCheck2, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  TrendingUp,
  HeartHandshake
} from 'lucide-react';

export default function JoinJourney({ lang, t, onJoinClick, onExplorePolicy }) {
  const jj = t.joinJourney;

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative gradient accents */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-100/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#006231] text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4 text-[#8EBF40]" />
            <span>{jj.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#231F20] tracking-tight">
            {jj.title}
          </h2>
          <p className="text-base text-gray-600 font-serif italic max-w-2xl mx-auto leading-relaxed">
            "{jj.headline}"
          </p>
        </div>

        {/* 3 Pillars / Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#CE2028] flex items-center justify-center font-bold text-lg">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {lang === 'en' ? 'Starting from BDT 1,00,000' : 'সর্বনিম্ন ১,০০,০০০ টাকা থেকে শুরু'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {jj.desc1}
            </p>
            <div className="pt-2 text-xs font-bold text-[#CE2028] flex items-center space-x-1">
              <span>{lang === 'en' ? 'Accessible Capital Threshold' : 'সহজ প্রবেশযোগ্য বিনিয়োগ'}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8EBF40]" />
            </div>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006231] flex items-center justify-center font-bold text-lg">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {lang === 'en' ? 'Formal Written Agreement' : '১০০% লিখিত স্ট্যাম্প চুক্তি'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {jj.desc2}
            </p>
            <div className="pt-2 text-xs font-bold text-[#006231] flex items-center space-x-1">
              <span>{lang === 'en' ? 'Legally Protected Rights' : 'আইনগত সংরক্ষিত অধিকার'}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8EBF40]" />
            </div>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-900 flex items-center justify-center font-bold text-lg">
              <Clock className="w-6 h-6 text-[#006231]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {lang === 'en' ? 'Max 90-Day Capital Settlement' : 'সর্বোচ্চ ৯০ দিনে মূলধন নিষ্পত্তি'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {lang === 'en' 
                ? 'Clear terms for regular profit distribution, periodic accounting reconciliation, and transparent exit protocols.'
                : 'নিয়মিত লভ্যাংশ বণ্টন, প্রকল্পের স্বচ্ছ নিরীক্ষিত হিসাব এবং মেয়াদশেষে দ্রুততম সময়ে মূলধন নিষ্পত্তির নিশ্চয়তা।'
              }
            </p>
            <div className="pt-2 text-xs font-bold text-gray-700 flex items-center space-x-1">
              <span>{lang === 'en' ? 'Transparent Exit Policy' : 'স্বচ্ছ প্রস্থান ও লিকুইডেশন'}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8EBF40]" />
            </div>
          </div>
        </div>

        {/* Action Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#1C1819] via-[#2A2324] to-[#1C1819] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              {lang === 'en' ? 'Ready to Transform Your Savings into Real Assets?' : 'আপনার সঞ্চয়কে একটি বাস্তব সম্পদে রূপান্তর করতে চান?'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              {lang === 'en' 
                ? 'Consult our senior investment managers to explore ongoing tower units and productive agro assets.' 
                : 'আমাদের সিনিয়র ইনভেস্টমেন্ট ম্যানেজারের সাথে সরাসরি কথা বলুন এবং আল কুদস টাওয়ার বা ইমারাহ এগ্রোর বিনিয়োগ শর্তসমূহ পর্যালোচনা করুন।'
              }
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onJoinClick}
              className="px-6 py-3.5 rounded-xl bg-[#CE2028] hover:bg-[#A9141B] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#CE2028]/25 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <span>{jj.ctaBtn}</span>
              <ArrowRight className="w-4 h-4 inline-block ml-1.5" />
            </button>

            <button
              onClick={onExplorePolicy}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>{lang === 'en' ? 'Explore Full Policy' : 'সম্পূর্ণ নীতিমালা দেখুন'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
