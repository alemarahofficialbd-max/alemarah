import React, { useState } from 'react';
import { 
  Moon,
  Users2,
  Smile,
  Trees,
  MapPin,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Flame,
  Volume2,
  Zap,
  Cctv,
  Phone,
  Calendar,
  MessageSquare,
  Check,
  Building2,
  ArrowRight,
  Sun
} from 'lucide-react';

export default function Amenities({ 
  lang, 
  t,
  onOpenBookVisit = () => {},
  onExploreProjects = () => {}
}) {
  const isEn = lang === 'en';

  // Customized styling, themed icons, and specific bullet points for each amenity
  const amenityCards = [
    {
      Icon: Moon,
      title: t.amenities.items[0]?.title || (isEn ? "Rooftop Musalla & Prayer Space" : "ছাদে বিশেষ নামাজের স্থান (মুসাল্লা)"),
      sub: t.amenities.items[0]?.sub || (isEn ? "Spiritual Peace & Adhan" : "আজানের পবিত্র সুর ও শান্তিময় পরিবেশ"),
      desc: t.amenities.items[0]?.desc || (isEn ? "Tranquil rooftop prayer space with architectural acoustics carrying the peaceful sound of Adhan to all apartments." : "ভবনের ছাদে নিরিবিলি নামাজের স্থান এবং সমগ্র আবাসিক পরিবেশে স্পষ্ট আজানের পবিত্র ধ্বনি পৌঁছানোর নিখুঁত ভৌগোলিক ও আর্কিটেকচারাল বিন্যাস।"),
      tag: t.amenities.items[0]?.tag || (isEn ? "Spiritual Tranquility" : "আত্মিক ও আধ্যাত্মিক প্রশান্তি"),
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
      accentDot: "bg-emerald-400",
      bullets: isEn 
        ? ["Peaceful prayer atmosphere", "Crystal clear Adhan acoustics", "Ablution (Wudu) facility"]
        : ["শান্তিময় ও পবিত্র নামাজের পরিবেশ", "সমগ্র ফ্ল্যাটে আজানের সুর", "পরিপাটি ওজু ও বসার ব্যবস্থা"]
    },
    {
      Icon: Users2,
      title: t.amenities.items[1]?.title || (isEn ? "Spacious Community Space" : "সুপ্রশস্ত সুসজ্জিত কমিউনিটি স্পেস"),
      sub: t.amenities.items[1]?.sub || (isEn ? "Social & Family Gatherings" : "পারিবারিক অনুষ্ঠান ও সামাজিক মেলবন্ধন"),
      desc: t.amenities.items[1]?.desc || (isEn ? "Dedicated modern multipurpose hall designed for residents' family gatherings, milad, social events, and friendly get-togethers." : "পারিবারিক যেকোনো অনুষ্ঠান, সামাজিক মেলবন্ধন, মিলাদ মাহফিল ও বাসিন্দাদের মতবিনিময়ের জন্য নিজস্ব আধুনিক কমিউনিটি হল।"),
      tag: t.amenities.items[1]?.tag || (isEn ? "Social Harmony" : "সামাজিক সম্প্রীতি"),
      color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
      accentDot: "bg-blue-400",
      bullets: isEn
        ? ["Multipurpose banquet setup", "Residents' general meetings", "Sound & lighting integrated"]
        : ["পারিবারিক ঘরোয়া অনুষ্ঠান", "বাসিন্দাদের মতবিনিময় সভা", "আধুনিক লাইটিং ও সাউন্ড ব্যবস্থা"]
    },
    {
      Icon: Smile,
      title: t.amenities.items[2]?.title || (isEn ? "Protected Modern Play Zone" : "শিশুদের সুরক্ষিত আধুনিক প্লে-জোন"),
      sub: t.amenities.items[2]?.sub || (isEn ? "Joyful Safe Childhood" : "নিরাপদ আনন্দময় শৈশব"),
      desc: t.amenities.items[2]?.desc || (isEn ? "Zero-vehicle secured dedicated area ensuring children's healthy physical growth, creative play, and carefree joyful childhood." : "গাড়ি চলাচলমুক্ত সম্পূর্ণ নিরাপদ পরিবেশে শিশুদের শারীরিক বিকাশ ও মুক্ত আনন্দের জন্য ইনডোর ও আউটডোর শিশুবান্ধব খেলার জায়গা।"),
      tag: t.amenities.items[2]?.tag || (isEn ? "Child-Safe Zone" : "শিশুবান্ধব নিরাপদ জোন"),
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
      accentDot: "bg-amber-400",
      bullets: isEn
        ? ["Completely vehicle-free safe zone", "Child-safe protective flooring", "Indoor & outdoor joy rides"]
        : ["গাড়িমুক্ত ১০০% নিরাপদ জোন", "শিশুবান্ধব নন-স্লিপ সারফেস", "ইনডোর ও আউটডোর খেলার সামগ্রী"]
    },
    {
      Icon: Trees,
      title: t.amenities.items[3]?.title || (isEn ? "Rooftop Garden & BBQ Corner" : "ছাদে রুফটপ গার্ডেন ও বারবিকিউ কর্নার"),
      sub: t.amenities.items[3]?.sub || (isEn ? "Lush Greenery & Open Sky" : "মনোরম ল্যান্ডস্কেপিং ও ওপেন স্কাই ভিউ"),
      desc: t.amenities.items[3]?.desc || (isEn ? "Curated landscaped flora, seating pergolas, 360-degree city views, and dedicated family outdoor barbecue arrangement." : "সবুজ বাগান, দৃষ্টিনন্দন বসার জায়গা, ওপেন স্কাই সিটি ভিউ এবং পারিবারিক আনন্দের জন্য বিশেষ রুফটপ ফ্যামিলি বারবিকিউ সুবিধা।"),
      tag: t.amenities.items[3]?.tag || (isEn ? "Eco Recreation" : "সবুজ ও নান্দনিক বিনোদন"),
      color: "from-emerald-500/20 to-lime-500/20 text-[#8EBF40] border-lime-500/30",
      accentDot: "bg-[#8EBF40]",
      bullets: isEn
        ? ["Lush green rooftop flora", "Dedicated family BBQ counter", "Scenic evening sunset deck"]
        : ["মনোরম রুফটপ ল্যান্ডস্কেপ", "ফ্যামিলি বারবিকিউ কাউন্টার", "খোলা আকাশের মনোরম সিটি ভিউ"]
    },
    {
      Icon: MapPin,
      title: t.amenities.items[4]?.title || (isEn ? "Everyday Civic Proximity" : "দৈনন্দিন নাগরিক সুবিধার সহজলভ্যতা"),
      sub: t.amenities.items[4]?.sub || (isEn ? "Everything Within Reach" : "সবকিছু হাতের নাগালে"),
      desc: t.amenities.items[4]?.desc || (isEn ? "Walking distance to reputed schools, colleges, specialized hospitals, shopping hubs, and central rapid transit highways." : "নামকরা স্কুল, কলেজ, বিশেষায়িত হাসপাতাল, কাঁচাবাজার ও প্রধান যোগাযোগ সড়কের ঠিক হাঁটার দূরত্বে কৌশলগত সুবিধাজনক অবস্থান।"),
      tag: t.amenities.items[4]?.tag || (isEn ? "Civic Connectivity" : "কমিউনিকেশন ও নাগরিক সান্নিধ্য"),
      color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
      accentDot: "bg-cyan-400",
      bullets: isEn
        ? ["800m from Highway & MRT corridor", "Renowned colleges & schools", "Daily groceries & markets"]
        : ["মহাসড়ক ও MRT করিডোরের নিকটে", "নামকরা স্কুল, কলেজ ও মাদ্রাসা", "কাঁচাবাজার ও দৈনন্দিন শপিং"]
    },
    {
      Icon: ShieldCheck,
      title: t.amenities.items[5]?.title || (isEn ? "Dual-Tier Residential Privacy & Security" : "আবাসিক ও বাণিজ্যিক সমন্বিত দ্বিস্তর নিরাপত্তা"),
      sub: t.amenities.items[5]?.sub || (isEn ? "24/7 Monitored Privacy" : "২৪/৭ সার্বক্ষণিক নজরদারি ও প্রাইভেসি"),
      desc: t.amenities.items[5]?.desc || (isEn ? "Separate commercial parking & customer flow, combined with dedicated private entry gates and round-the-clock CCTV surveillance for residential families." : "নিচের বাণিজ্যিক স্পেসের জন্য আলাদা গ্রাহক পার্কিং ও আবাসিক পরিবারের জন্য সম্পূর্ণ পৃথক, সুরক্ষিত ও প্রাইভেট এন্ট্রি পয়েন্ট।"),
      tag: t.amenities.items[5]?.tag || (isEn ? "Family Security" : "১০০% পারিবারিক নিরাপত্তা"),
      color: "from-red-500/20 to-rose-500/20 text-red-400 border-red-500/30",
      accentDot: "bg-red-400",
      bullets: isEn
        ? ["Completely separate residential gate", "24/7 CCTV & guard security", "Isolated commercial parking"]
        : ["আবাসিক পরিবারের পৃথক গেট", "২৪/৭ সিসিটিভি ও গার্ড নিরাপত্তা", "বাণিজ্যিক স্পেসের আলাদা পার্কিং"]
    }
  ];

  const highlights = [
    { text: isEn ? "Rooftop Musalla & Adhan" : "ছাদে মুসাল্লা ও আজানের ধ্বনি", Icon: Volume2 },
    { text: isEn ? "24/7 CCTV & Smart Security" : "২৪/৭ সিসিটিভি ও স্মার্ট সিকিউরিটি", Icon: Cctv },
    { text: isEn ? "Full Soundproof Generator" : "অটো সাউন্ডপ্রুফ জেনারেটর ব্যাকআপ", Icon: Zap },
    { text: isEn ? "Landscaped Rooftop Garden" : "ল্যান্ডস্কেপড রুফটপ গার্ডেন ও বারবিকিউ", Icon: Trees }
  ];

  return (
    <section id="amenities" className="py-16 sm:py-24 bg-gradient-to-b from-[#080C0A] via-[#0E1512] to-[#080C0A] text-white relative overflow-hidden">
      {/* Dynamic Background Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#006231]/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#CE2028]/12 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#8EBF40]/12 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#8EBF40_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#8EBF40]/15 text-[#8EBF40] text-xs font-bold uppercase tracking-wider border border-[#8EBF40]/30 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#8EBF40] animate-pulse" />
            <span>{isEn ? "Building Amenities & Living Facilities" : "বিল্ডিং ও প্রকল্পের আধুনিক সুযোগ-সুবিধা"}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            <span>{isEn ? "Master-Planned for" : "পরিকল্পিত, সুসংগঠিত ও"} </span>
            <span className="bg-gradient-to-r from-white via-emerald-200 to-[#8EBF40] bg-clip-text text-transparent">
              {isEn ? "Serene, Modern & Grand Living" : "শান্তিময় আধুনিক জীবনযাপন"}
            </span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {t.amenities.subtitle || (isEn 
              ? "Every Al-Emarah project harmonizes civic connectivity, spiritual serenity, and vibrant family living."
              : "আল ইমারাহ-এর প্রতিটি প্রকল্পে আধুনিক নাগরিক সুযোগ-সুবিধা, আত্মিক প্রশান্তি ও সামাজিক মেলবন্ধনের নিখুঁত আয়োজন।")}
          </p>
        </div>

        {/* 4 Feature Highlights Glowing Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 max-w-5xl mx-auto">
          {highlights.map((item, hIdx) => {
            const HIcon = item.Icon;
            return (
              <div 
                key={hIdx}
                className="flex items-center space-x-2.5 p-3 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-[#8EBF40]/40 hover:bg-white/[0.08] backdrop-blur-md transition-all shadow-xs group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#8EBF40]/15 text-[#8EBF40] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <HIcon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-200 leading-snug group-hover:text-white transition-colors">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* 6 Signature Amenity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-2">
          {amenityCards.map((card, idx) => {
            const CardIcon = card.Icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-[#8EBF40]/50 hover:bg-white/[0.08] backdrop-blur-md transition-all duration-300 group flex flex-col justify-between shadow-xl shadow-black/20 hover:scale-[1.015] hover:shadow-2xl hover:shadow-[#006231]/20 relative overflow-hidden"
              >
                {/* Subtle card glow overlay on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-[#8EBF40]/10 transition-colors pointer-events-none"></div>

                <div className="space-y-4 relative z-10">
                  {/* Top Bar: Icon, Index & Tag */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} border flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                      <CardIcon className="w-6 h-6" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-3xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-gray-300">
                        {isEn ? `Feature 0${idx + 1}` : `বিশেষত্ব 0${idx + 1}`}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#8EBF40] transition-colors leading-snug">
                      {card.title}
                    </h3>
                    {card.sub && (
                      <span className="inline-block text-xs font-medium text-gray-400 mt-1">
                        {card.sub}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                    {card.desc}
                  </p>

                  {/* Micro-Bullets Checklist */}
                  <div className="pt-2 space-y-1.5 border-t border-white/10">
                    {card.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center space-x-2 text-3xs sm:text-xs text-gray-300">
                        <Check className="w-3.5 h-3.5 text-[#8EBF40] shrink-0" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Tag & Arrow */}
                <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between relative z-10">
                  <span className="inline-flex items-center text-xs font-semibold text-gray-300 group-hover:text-[#8EBF40] transition-colors">
                    <span className={`w-2 h-2 rounded-full ${card.accentDot} mr-2 shadow-xs`}></span>
                    <span>{card.tag}</span>
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-[#8EBF40] text-gray-400 group-hover:text-gray-950 flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Architectural Excellence Standards Strip */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white/[0.04] via-emerald-950/30 to-white/[0.04] border border-white/10 backdrop-blur-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2.5">
              <Building2 className="w-5 h-5 text-[#8EBF40]" />
              <h4 className="text-sm sm:text-base font-bold text-white">
                {isEn ? "Structural Safety & Engineering Benchmarks" : "স্ট্রাকচারাল নিরাপত্তা ও ইঞ্জিনিয়ারিং নিশ্চয়তা"}
              </h4>
            </div>
            <span className="text-2xs text-[#8EBF40] font-bold uppercase tracking-wider bg-[#8EBF40]/10 px-3 py-1 rounded-full border border-[#8EBF40]/20">
              {isEn ? "BUET Tested Standards" : "বুয়েট পরীক্ষিত নির্মাণ মান"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center space-x-2 text-white font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#8EBF40]" />
                <span>{isEn ? "7.5+ Richter Earthquake Safe" : "৭.৫+ রিখটার ভূমিকম্প সহনশীল"}</span>
              </div>
              <p className="text-gray-400 text-3xs sm:text-xs">
                {isEn ? "High-grade 60/72.5 TMT steel rebar and dense concrete pile foundation." : "৬০/৭২.৫ গ্রেড রিবার স্টিল ও গভীর পাইল ফাউন্ডেশন সমৃদ্ধ।"}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center space-x-2 text-white font-bold">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{isEn ? "100% Soundproof Generator" : "সাউন্ডপ্রুফ স্ট্যান্ডবাই জেনারেটর"}</span>
              </div>
              <p className="text-gray-400 text-3xs sm:text-xs">
                {isEn ? "Automatic generator backing emergency power, lifts, and common area lighting." : "লোডশেডিংয়ে সার্বক্ষণিক অটো পাওয়ার, লিফট ও জরুরি বিদ্যুৎ ব্যবস্থা।"}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center space-x-2 text-white font-bold">
                <Sun className="w-4 h-4 text-cyan-400" />
                <span>{isEn ? "Natural Light & Ventilation" : "প্রাকৃতিক আলো ও বাতাস চলাচল"}</span>
              </div>
              <p className="text-gray-400 text-3xs sm:text-xs">
                {isEn ? "Architecturally engineered cross ventilation for refreshing, healthy living." : "প্রতিটি ইউনিটে সর্বোচ্চ দিনের আলো ও উন্মুক্ত বাতাস প্রবাহ নিশ্চিত।"}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Booking & Consultation Action Strip */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#004724] to-[#002715] border border-emerald-500/30 backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#8EBF40] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{isEn ? "Experience the Amenities in Person" : "সরাসরি প্রজেক্ট ঘুরে বিশেষত্ব অনুভব করুন"}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isEn ? "Schedule a Guided Project Walkthrough" : "আমাদের ইঞ্জিনিয়ারের সাথে সরাসরি সাইট ভিজিট করুন"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 max-w-xl">
              {isEn 
                ? "Visit Al Quds Tower (Sanarpar) or Barakah Tower (Paltan) with our senior engineers."
                : "আল কুদস টাওয়ার (পশ্চিম সানারপাড়) অথবা বারাকাহ টাওয়ারের (পল্টন) নির্মাণ কাজ ও সুযোগ-সুবিধা সশরীরে পরিদর্শন করুন।"}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 relative z-10">
            <button
              onClick={onOpenBookVisit}
              className="px-6 py-3.5 rounded-xl bg-[#CE2028] hover:bg-[#A9141B] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#CE2028]/30 transition-all cursor-pointer inline-flex items-center space-x-2 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>{isEn ? "Book Free Site Visit" : "ফ্রি সাইট ভিজিট শিডিউল করুন"}</span>
            </button>

            <a
              href="tel:01918646575"
              className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#8EBF40]" />
              <span>{isEn ? "Call: 01918-646575" : "কল: ০১৯১৮-৬৪৬৫৭৫"}</span>
            </a>

            <a
              href="https://wa.me/8801918646575?text=%E0%A6%86%E0%A6%B8%E0%A6%B8%E0%A6%BE%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%81%E0%A6%AE%E0%A7%A4%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%86%E0%A6%B2-%E0%A6%87%E0%A6%AE%E0%A6%BE%E0%A6%B0%E0%A6%BE%E0%A6%B9%E0%A6%B0%20%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%9C%E0%A7%87%E0%A6%95%E0%A7%8D%E0%A6%9F%20%E0%A6%AD%E0%A6%bf%E0%A6%9C%E0%A6%bf%E0%A6%9f%20%E0%A6%95%E0%A6%B0%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A7%A4"
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl bg-white/10 hover:bg-[#25D366] text-white transition-all border border-white/20 flex items-center justify-center cursor-pointer shadow-md"
              title={isEn ? "WhatsApp Consultation" : "হোয়াটসঅ্যাপে যোগাযোগ"}
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
