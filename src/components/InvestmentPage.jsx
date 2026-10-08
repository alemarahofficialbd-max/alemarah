import React, { useState } from 'react';
import { 
  Coins, 
  ShieldCheck, 
  FileCheck2, 
  Clock, 
  Users, 
  Sprout, 
  Building2, 
  Scale, 
  CheckCircle2, 
  Phone, 
  ArrowRight, 
  Send,
  Calendar,
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';

export default function InvestmentPage({ 
  lang = 'bn', 
  t, 
  onNavigateToProjects,
  onOpenBookVisit 
}) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    investmentAmount: '১,০০,০০০ - ৫,০০,০০০ টাকা',
    interestedSector: 'উভয় প্রকল্প (এগ্রো ও রিয়েল এস্টেট)',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        investmentAmount: '১,০০,০০০ - ৫,০০,০০০ টাকা',
        interestedSector: 'উভয় প্রকল্প (এগ্রো ও রিয়েল এস্টেট)',
        message: ''
      });
    }, 4000);
  };

  const isEn = lang === 'en';

  const clauses = [
    {
      num: '০১',
      title: isEn ? 'Shariah-Compliant Partnership' : 'শরীয়াহভিত্তিক যৌথ লাভ-ক্ষতির অংশীদারিত্ব',
      desc: isEn 
        ? 'Strictly interest-free, Halal Mudarabah / Musharakah investment structure where profits and risks are shared ethically as per Islamic Shariah guidelines.' 
        : 'সুদমুক্ত, শতভাগ হালাল মুদারাবা ও মুশারাকা মূলনীতিতে পরিচালিত। কোনো ফিক্সড বা হারাম সুদ নেই, বরং ব্যবসায়িক প্রকৃত লাভ ও ঝুঁকি যৌথভাবে বণ্টিত হয়।'
    },
    {
      num: '০২',
      title: isEn ? 'Formal Legal Stamp Agreement' : 'রেজিস্টার্ড স্ট্যাম্পে লিখিত প্রাতিষ্ঠানিক চুক্তি',
      desc: isEn 
        ? 'Every investor receives an enforceable, signed contract on government judicial non-judicial stamps guaranteeing clear rights, terms, and capital records.' 
        : 'প্রতিটি বিনিয়োগকারীর সঙ্গে সরকারি নন-জুডিশিয়াল স্ট্যাম্পে প্রাতিষ্ঠানিক লিখিত ও আইনি বাধ্যবাধকতাপূর্ণ অংশীদারিত্ব চুক্তি সম্পাদন করা হয়।'
    },
    {
      num: '০৩',
      title: isEn ? 'Quarterly Accounting & Audit Transparency' : 'ত্রৈমাসিক নিরীক্ষিত হিসাব ও রিপোর্ট প্রদান',
      desc: isEn 
        ? 'Complete financial accounting statements, livestock/construction production audits, and business progress reports are delivered on schedule.' 
        : 'প্রকল্পের আয়-ব্যয়, উৎপাদন ও নির্মাণ অগ্রগতির শতভাগ স্বচ্ছ অডিট রিপোর্ট এবং নিয়মিত আর্থিক বিবরণী প্রতিটি অংশীদারের কাছে সরবরাহ করা হয়।'
    },
    {
      num: '০৪',
      title: isEn ? 'Guaranteed 90-Day Capital Refund' : '৩ মাসের নোটিশে সম্পূর্ণ মূলধন প্রত্যাহারের নিশ্চয়তা',
      desc: isEn 
        ? 'Flexibility to exit. Investors can withdraw their invested principal capital upon a 90-day prior written notice without hidden exit penalties.' 
        : 'বিনিয়োগকারী যে কোনো সময় লিখিত নোটিশের মাধ্যমে সর্বোচ্চ ৯০ (তিন) দিনের মধ্যে তার সম্পূর্ণ মূলধন নিরাপদে ফেরত তুলে নেওয়ার অধিকার সংরক্ষণ করেন।'
    },
    {
      num: '০৫',
      title: isEn ? 'On-Site Inspection & Verification Rights' : 'সরাসরি প্রকল্প পরিদর্শন ও যাচাইয়ের সার্বক্ষণিক অধিকার',
      desc: isEn 
        ? 'Investors are welcome to inspect project sites, farms, building developments, land deeds, and administrative records at any time.' 
        : 'আমাদের কৃষি খামার, চলমান ফ্ল্যাট নির্মাণ সাইট এবং জমির রেজিস্ট্রিকৃত মূল দলিল যে কোনো সময় সশরীরে এসে পরিদর্শন ও যাচাই করার পূর্ণ অধিকার রয়েছে।'
    },
    {
      num: '০৬',
      title: isEn ? 'Minimum BDT 100,000 Accessible Entry' : 'ন্যূনতম ১,০০,০০০ (এক লক্ষ) টাকা থেকে শুরু',
      desc: isEn 
        ? 'Democratizing real estate and agro enterprise creation for middle-class and expatriate Bangladeshis seeking halal wealth generation.' 
        : 'প্রবাসী এবং মধ্যবিত্ত পরিবারের জন্য হালাল সম্পদ সৃষ্টির দ্বার উন্মোচন। মাত্র ১ লাখ টাকা থেকে শুরু করে সামর্থ্য অনুযায়ী যে কোনো অংকের শেয়ার গ্রহণ করা যায়।'
    }
  ];

  const steps = [
    {
      step: '০১',
      title: isEn ? 'Consultation & Proposal' : 'পরামর্শ ও ক্ষেত্র নির্বাচন',
      desc: isEn 
        ? 'Discuss with our investment counselors at our Purana Paltan office or via direct hotline.' 
        : 'পুরানা পল্টন কর্পোরেট অফিসে সরাসরি আলোচনা অথবা হটলাইনে জেনে আপনার পছন্দসই খাত নির্বাচন করুন।'
    },
    {
      step: '০২',
      title: isEn ? 'Site & Legal Document Review' : 'সাইট ও লিগ্যাল ফাইল পরিদর্শন',
      desc: isEn 
        ? 'Verify our physical dairy farms, project lands, government registrations, and municipal approvals.' 
        : 'খামার, জমি, রাজউক ও সরকারি প্রাণিসম্পদ অধিদপ্তরের সনদপত্র নিজ চোখে দেখে সম্পূর্ণ নিশ্চিত হোন।'
    },
    {
      step: '০৩',
      title: isEn ? 'Formal Agreement & Execution' : 'চুক্তি সম্পাদন ও অর্থ জমাদান',
      desc: isEn 
        ? 'Sign official stamped partnership deeds and transfer funds securely via banking channels.' 
        : 'সরকারি স্ট্যাম্পে লিখিত চুক্তি স্বাক্ষর এবং ব্যাংকিং চ্যানেলে প্রাতিষ্ঠানিক মানি রিসিট গ্রহণ করুন।'
    },
    {
      step: '০৪',
      title: isEn ? 'Regular Returns & Reports' : 'লাভ ও নিয়মিত আপডেট গ্রহণ',
      desc: isEn 
        ? 'Receive periodic profit shares and quarterly project audit performance statements directly.' 
        : 'চুক্তি অনুযায়ী নিয়মিত লভ্যাংশ এবং প্রকল্পের আর্থিক ও উৎপাদন অগ্রগতি রিপোর্ট গ্রহণ করুন।'
    }
  ];

  return (
    <div className="py-10 bg-[#FBFBFB] space-y-16 animate-fadeIn">
      {/* 1. HERO HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#004724] via-[#006231] to-[#002e16] text-white p-8 sm:p-14 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8EBF40]/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs sm:text-sm font-bold text-[#8EBF40] border border-white/10">
              <Sparkles className="w-4 h-4" />
              <span>{isEn ? 'Shariah Compliant & Transparent Wealth Creation' : 'পরিকল্পিত বিনিয়োগ, আস্থার সাথে হালাল সম্পদ সৃষ্টি'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {isEn ? 'Halal Investment Policy & Partnership Opportunities' : 'হালাল অংশীদারিত্ব ও টেকসই বিনিয়োগ নীতিমালা'}
            </h1>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
              {isEn 
                ? 'Al-Emarah Properties Limited invites forward-thinking investors and expatriates to build long-term, interest-free wealth across prime residential real estate and sustainable commercial agro farming.'
                : 'আল-ইমারাহ প্রোপার্টিজ লিমিটেড বিশ্বাস করে স্বচ্ছ, সুদমুক্ত ও শরীয়াহসম্মত যৌথ উদ্যোগে। আমাদের চলমান নির্মাণাধীন রিয়েল এস্টেট এবং উৎপাদনমুখী এগ্রো প্রকল্পে সর্বনিম্ন ১ লক্ষ টাকা থেকে হালাল অংশীদারিত্বের সুযোগ রয়েছে।'}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#inquiry-form"
                className="px-6 py-3.5 rounded-xl bg-[#8EBF40] hover:bg-[#7ca935] text-gray-950 font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95"
              >
                {isEn ? 'Apply for Investment Consultation' : 'বিনিয়োগ পরামর্শের জন্য আবেদন করুন'}
              </a>
              <a
                href="tel:+8801816233013"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center space-x-2"
              >
                <Phone className="w-4 h-4 text-[#8EBF40]" />
                <span>{isEn ? 'Investment Hotline: 01816-233013' : 'ইনভেস্টমেন্ট হটলাইন: ০১৮১৬-২৩৩০১৩'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR KEY INSTITUTIONAL HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs hover:shadow-lg transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#006231] flex items-center justify-center font-bold">
              <Coins className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#006231]">
              {isEn ? 'Low Minimum Capital' : 'ন্যূনতম বিনিয়োগ'}
            </div>
            <div className="text-2xl font-black text-gray-900">
              {isEn ? 'BDT 1,00,000' : '৳ ১,০০,০০০'}
            </div>
            <p className="text-xs text-gray-600">
              {isEn ? 'Affordable entry for expatriates & middle-class earners' : 'মধ্যবিত্ত পরিবার ও প্রবাসীদের জন্য সহজ কিস্তি ও শেয়ার সুবিধা'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs hover:shadow-lg transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#CE2028] flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#CE2028]">
              {isEn ? 'Exit Settlement Notice' : 'মূলধন ফেরত গ্যারান্টি'}
            </div>
            <div className="text-2xl font-black text-gray-900">
              {isEn ? '90 Days Notice' : '৯০ দিনের নোটিশে'}
            </div>
            <p className="text-xs text-gray-600">
              {isEn ? 'Request capital withdrawal with zero penalty anytime' : 'প্রয়োজনে কোনো কর্তন ছাড়াই সম্পূর্ণ বিনিয়োগ ফেরত নেওয়ার অধিকার'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs hover:shadow-lg transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#006231] flex items-center justify-center font-bold">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#006231]">
              {isEn ? 'Legal Guarantee' : 'আইনি নিরাপত্তা'}
            </div>
            <div className="text-2xl font-black text-gray-900">
              {isEn ? 'Judicial Stamp' : 'সরকারি স্ট্যাম্প'}
            </div>
            <p className="text-xs text-gray-600">
              {isEn ? 'Formal legally enforceable partnership agreement deed' : 'প্রতিটি লেনদেনের জন্য সরকারি স্ট্যাম্পে রেজিস্ট্রিকৃত চুক্তি'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs hover:shadow-lg transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Scale className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
              {isEn ? 'Shariah Compliance' : 'শরীয়াহ বিধান'}
            </div>
            <div className="text-2xl font-black text-gray-900">
              {isEn ? '100% Halal' : '১০০% সুদমুক্ত'}
            </div>
            <p className="text-xs text-gray-600">
              {isEn ? 'Strict adherence to Islamic partnership principles' : 'মুদারাবা ও মুশারাকা নিয়মে লাভ-ক্ষতি ন্যায্য বণ্টন'}
            </p>
          </div>
        </div>
      </section>

      {/* 3. DUAL INVESTMENT SECTORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#CE2028] uppercase tracking-wider">
            {isEn ? 'Active Investment Sectors' : 'বিনিয়োগের দুটি প্রধান ক্ষেত্র'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            {isEn ? 'Choose Your Preferred Investment Opportunity' : 'আপনার পছন্দের খাতে হালাল অংশীদার হোন'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            {isEn ? 'Invest in tangible, productive physical assets with continuous value appreciation.' : 'বাস্তব সম্পদ এবং উৎপাদনশীল প্রকল্পে আপনার কষ্টার্জিত সঞ্চয় নিরাপদ রাখুন।'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SECTOR 1: EMARAH AGRO */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="relative aspect-16/9 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=1200&q=80"
                alt="Al-Emarah Agro"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-emerald-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-[#8EBF40] flex items-center space-x-1.5">
                <Sprout className="w-3.5 h-3.5" />
                <span>{isEn ? 'High Yield Production' : 'উৎপাদনমুখী কৃষি ও ডেইরি'}</span>
              </div>
            </div>

            <div className="p-7 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {isEn ? 'Al-Emarah Agro & Livestock Project' : 'আল-ইমারাহ এগ্রো ও লাইভস্টক প্রকল্প'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {isEn 
                    ? 'State-of-the-art cattle breeding, dairy supply, and sacrificial livestock farm registered under the Department of Livestock Services.'
                    : 'সরকারি প্রাণিসম্পদ অধিদপ্তর নিবন্ধিত আধুনিক ডেইরি ক্যাটল ও খামার। নিয়মিত দুধ উৎপাদন ও কোরবানির পশু সরবরাহকারী একটি চলমান উৎপাদনমুখী যৌথ প্রকল্প।'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-gray-700">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8EBF40] shrink-0" />
                    <span>{isEn ? 'Direct physical cattle assets' : 'জীবন্ত ও দৃশ্যমান গবাদিপশু সম্পদ'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8EBF40] shrink-0" />
                    <span>{isEn ? 'Periodic dairy sale distribution' : 'নিয়মিত দুধ ও পশু বিক্রির মুনাফা'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8EBF40] shrink-0" />
                    <span>{isEn ? 'Regular physical farm visits' : 'সরাসরি খামার পরিদর্শনের সুযোগ'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8EBF40] shrink-0" />
                    <span>{isEn ? 'Formal partnership contract' : 'আইনি অংশীদারিত্ব চুক্তি'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-500 block">{isEn ? 'Starting from' : 'শুরু মাত্র'}</span>
                  <span className="text-lg font-black text-[#006231]">{isEn ? 'BDT 1,00,000' : '৳ ১,০০,০০০'}</span>
                </div>
                <a
                  href="#inquiry-form"
                  className="px-5 py-2.5 rounded-xl bg-[#006231] hover:bg-[#004724] text-white text-xs font-bold transition-all"
                >
                  {isEn ? 'Inquire Agro Share' : 'এগ্রো শেয়ারে যুক্ত হোন'}
                </a>
              </div>
            </div>
          </div>

          {/* SECTOR 2: REAL ESTATE SHARES */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="relative aspect-16/9 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
                alt="Al-Emarah Real Estate"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-gray-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-[#CE2028] flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{isEn ? 'Prime Land & Apartment Shares' : 'প্রাইম ল্যান্ড ও ফ্ল্যাট শেয়ার'}</span>
              </div>
            </div>

            <div className="p-7 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {isEn ? 'Real Estate Property & Flat Share Partnership' : 'রিয়েল এস্টেট প্রোপার্টি ও ফ্ল্যাট শেয়ার পার্টনারশিপ'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {isEn 
                    ? 'Invest in prime residential and commercial projects in Dhaka. Gain asset-backed ownership with future appreciation and rental revenue dividends.'
                    : 'রাজধানীর বসুন্ধরা, আফতাবনগর, গুলশান ও মিরপুরের মতো প্রাইম লোকেশনে যৌথ জমিতে ভবন নির্মাণে অংশীদারিত্ব। ফ্ল্যাট হস্তান্তরের পর ভাড়া বা বিক্রয়ের লভ্যাংশ সমবণ্টন।'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-gray-700">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8EBF40] shrink-0" />
                    <span>{isEn ? 'Clear deeded land ownership' : 'শতভাগ নিষ্কণ্টক জমির অংশীদারিত্ব'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8EBF40] shrink-0" />
                    <span>{isEn ? 'BUET tested construction' : 'বুয়েট টেস্ট সম্পন্ন আধুনিক স্ট্রাকচার'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8EBF40] shrink-0" />
                    <span>{isEn ? 'Continuous capital appreciation' : 'জমি ও ফ্ল্যাটের দীর্ঘমেয়াদী মূল্যবৃদ্ধি'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8EBF40] shrink-0" />
                    <span>{isEn ? 'Flexible equity installments' : 'সুবিধাজনক কিস্তিতে শেয়ার পরিশোধ'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-500 block">{isEn ? 'Flexible Slots' : 'ইউনিট ও শেয়ার'}</span>
                  <span className="text-lg font-black text-[#CE2028]">{isEn ? 'Share Allocation' : 'প্রকল্পভিত্তিক শেয়ার'}</span>
                </div>
                <button
                  onClick={onNavigateToProjects}
                  className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-[#CE2028] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  {isEn ? 'View Active Projects' : 'চলমান প্রকল্পসমূহ দেখুন'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIX OFFICIAL INVESTMENT CLAUSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-[#006231] uppercase tracking-wider flex items-center space-x-1.5">
              <Scale className="w-4 h-4 text-[#8EBF40]" />
              <span>{isEn ? 'Legal & Shariah Framework' : 'প্রাতিষ্ঠানিক ও আইনি ফ্রেমওয়ার্ক'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              {isEn ? 'Six Core Clauses of Our Investment Agreement' : 'বিনিয়োগ চুক্তির মূল ৬টি সুনির্দিষ্ট ধারা'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              {isEn ? 'Transparent, safe, and legally documented under the laws of Bangladesh.' : 'বাংলাদেশের প্রচলিত আইন এবং ইসলামিক মুদারাবা নীতির পূর্ণাঙ্গ অনুসরণে প্রণীত।'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clauses.map((clause, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-[#006231] hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-[#006231] group-hover:text-[#CE2028] transition-colors">
                      {clause.num}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#8EBF40]"></span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#006231] transition-colors">
                    {clause.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {clause.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center text-[11px] font-bold text-[#006231]">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#8EBF40]" />
                  <span>{isEn ? 'Guaranteed Legal Clause' : 'চুক্তির আইনসম্মত ধারা'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOUR STEP PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#CE2028] uppercase tracking-wider">
            {isEn ? 'Easy Process' : 'সহজ বিনিয়োগ প্রক্রিয়া'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            {isEn ? 'How to Become an Al-Emarah Partner in 4 Steps' : 'মাত্র ৪টি সহজ ধাপে আল-ইমারাহ-এর অংশীদার হোন'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, sIdx) => (
            <div key={sIdx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs relative space-y-3">
              <span className="text-2xl font-black text-gray-200 block">
                {st.step}
              </span>
              <h4 className="text-base font-bold text-gray-900">
                {st.title}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INQUIRY FORM & CONSULTATION CALL */}
      <section id="inquiry-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Information & Hotlines */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#8EBF40] border border-white/10">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{isEn ? 'Free One-on-One Advisory' : 'বিনামূল্যে একক ইনভেস্টমেন্ট কাউন্সেলিং'}</span>
              </span>

              <h3 className="text-2xl sm:text-4xl font-black text-white">
                {isEn ? 'Schedule an In-Person Office Meeting' : 'কর্পোরেট অফিসে সামনাসামনি আলোচনার সময় নির্ধারণ করুন'}
              </h3>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {isEn 
                  ? 'Our senior investment advisors are available at our Purana Paltan head office to walk you through our original land deeds, livestock audit books, and profit distribution schedules.'
                  : 'আমাদের পুরানা পল্টন কর্পোরেট অফিসে চা পানের আমন্ত্রণ। এসে সরাসরি মূল দলিল, এগ্রো প্রকল্পের ভিডিও ও হিসাব নথি নিজ চোখে দেখে সিদ্ধান্ত নিন।'}
              </p>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="text-xs font-bold text-[#8EBF40] uppercase tracking-wider">
                  {isEn ? 'Dedicated Investment Hotlines' : 'সরাসরি ইনভেস্টমেন্ট হটলাইন নম্বর'}
                </div>
                <div className="flex flex-wrap gap-4 text-sm sm:text-base font-bold">
                  <a href="tel:+8801816233013" className="hover:text-[#8EBF40] transition-colors flex items-center space-x-1.5">
                    <Phone className="w-4 h-4 text-[#8EBF40]" />
                    <span>{isEn ? '01816-233013' : '০১৮১৬-২৩৩০১৩'}</span>
                  </a>
                  <a href="tel:+8801918646575" className="hover:text-[#8EBF40] transition-colors flex items-center space-x-1.5">
                    <Phone className="w-4 h-4 text-[#8EBF40]" />
                    <span>{isEn ? '01918-646575' : '০১৯১৮-৬৪৬৫৭৫'}</span>
                  </a>
                  <a href="tel:+8801743926926" className="hover:text-[#8EBF40] transition-colors flex items-center space-x-1.5">
                    <Phone className="w-4 h-4 text-[#8EBF40]" />
                    <span>{isEn ? '01743-926926' : '০১৭৪৩-৯২৬৯২৬'}</span>
                  </a>
                </div>
                <p className="text-[11px] text-gray-400">
                  {isEn ? 'Corporate Address: 21/2, B-B Avenue (2nd Floor), Purana Paltan, Dhaka-1000' : 'কর্পোরেট ঠিকানা: ২১/২, বি-বি এভিনিউ (২য় তলা), পুরানা পল্টন, ঢাকা-১০০০'}
                </p>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-6 bg-white p-7 sm:p-8 rounded-2xl text-gray-900 shadow-xl">
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                {isEn ? 'Submit Investment Inquiry' : 'বিনিয়োগ আগ্রহ ও প্রশ্ন পাঠান'}
              </h4>
              <p className="text-xs text-gray-500 mb-5">
                {isEn ? 'We will get back to you within 2 business hours.' : 'আমাদের ইনভেস্টমেন্ট রিলেশনস অফিসার দ্রুততম সময়ে কল করবেন।'}
              </p>

              {formSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-[#006231] mx-auto" />
                  <h5 className="font-bold text-sm text-[#006231]">
                    {isEn ? 'Inquiry Submitted Successfully!' : 'আপনার আবেদন সফলভাবে গৃহীত হয়েছে!'}
                  </h5>
                  <p className="text-xs text-gray-600">
                    {isEn ? 'Our investment officer will contact you shortly.' : 'আমাদের প্রতিনিধি খুব শীঘ্রই আপনার দেওয়া নম্বরে যোগাযোগ করবেন।'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isEn ? 'Your Full Name' : 'আপনার পূর্ণ নাম'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isEn ? 'e.g. Mohammad Rahim' : 'যেমন: মো: রহিম উল্লাহ'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-hidden focus:border-[#006231] focus:ring-1 focus:ring-[#006231]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isEn ? 'Mobile / WhatsApp Number' : 'মোবাইল / হোয়াটসঅ্যাপ নম্বর'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-hidden focus:border-[#006231] focus:ring-1 focus:ring-[#006231]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        {isEn ? 'Proposed Amount' : 'সম্ভাব্য বিনিয়োগের পরিমাণ'}
                      </label>
                      <select
                        value={formData.investmentAmount}
                        onChange={(e) => setFormData({ ...formData, investmentAmount: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-hidden focus:border-[#006231] bg-white"
                      >
                        <option value="১,০০,০০০ - ৫,০০,০০০ টাকা">{isEn ? 'BDT 100K - 500K' : '১ - ৫ লক্ষ টাকা'}</option>
                        <option value="৫,০০,০০০ - ১০,০০,০০০ টাকা">{isEn ? 'BDT 500K - 1M' : '৫ - ১০ লক্ষ টাকা'}</option>
                        <option value="১০,০০,০০০ - ২৫,০০,০০০ টাকা">{isEn ? 'BDT 1M - 2.5M' : '১০ - ২৫ লক্ষ টাকা'}</option>
                        <option value="২৫,০০,০০০+ টাকা">{isEn ? 'BDT 2.5M+' : '২৫ লক্ষ টাকার উপরে'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        {isEn ? 'Interested Sector' : 'আগ্রহের খাত'}
                      </label>
                      <select
                        value={formData.interestedSector}
                        onChange={(e) => setFormData({ ...formData, interestedSector: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-hidden focus:border-[#006231] bg-white"
                      >
                        <option value="উভয় প্রকল্প (এগ্রো ও রিয়েল এস্টেট)">{isEn ? 'Both (Agro & Real Estate)' : 'উভয় খাত (এগ্রো ও রিয়েল এস্টেট)'}</option>
                        <option value="আল-ইমারাহ এগ্রো ও ডেইরি">{isEn ? 'Al-Emarah Agro Only' : 'শুধু এগ্রো ও খামার'}</option>
                        <option value="রিয়েল এস্টেট ও ফ্ল্যাট শেয়ার">{isEn ? 'Real Estate Shares Only' : 'শুধু রিয়েল এস্টেট ফ্ল্যাট শেয়ার'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isEn ? 'Message or Specific Questions' : 'আপনার বার্তা বা কোনো নির্দিষ্ট প্রশ্ন (ঐচ্ছিক)'}
                    </label>
                    <textarea
                      rows="2"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={isEn ? 'Write your message...' : 'আপনার কোনো প্রশ্ন থাকলে লিখুন...'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-hidden focus:border-[#006231]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#006231] hover:bg-[#004724] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isEn ? 'Send My Inquiry' : 'আবেদন জমা দিন'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
