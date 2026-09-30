import React from 'react';
import { 
  Moon,
  Users2,
  Smile,
  Trees,
  MapPin,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Volume2,
  Zap,
  Cctv,
  Building2,
  Sun,
  Shield
} from 'lucide-react';

export default function Amenities({ 
  lang, 
  t,
  onOpenBookVisit = () => {},
  onExploreProjects = () => {}
}) {
  const isEn = lang === 'en';

  // Harmonized styling and content for each amenity
  const amenityCards = [
    {
      Icon: Moon,
      title: t?.amenities?.items?.[0]?.title || (isEn ? "Rooftop Musalla & Prayer Space" : "ছাদে বিশেষ নামাজের স্থান (মুসাল্লা)"),
      sub: t?.amenities?.items?.[0]?.sub || (isEn ? "Spiritual Peace & Adhan" : "আজানের পবিত্র সুর ও শান্তিময় পরিবেশ"),
      desc: t?.amenities?.items?.[0]?.desc || (isEn ? "Tranquil rooftop prayer space with architectural acoustics carrying the peaceful sound of Adhan to all apartments." : "ভবনের ছাদে নিরিবিলি নামাজের স্থান এবং সমগ্র আবাসিক পরিবেশে স্পষ্ট আজানের পবিত্র ধ্বনি পৌঁছানোর নিখুঁত ভৌগোলিক ও আর্কিটেকচারাল বিন্যাস।"),
      tag: t?.amenities?.items?.[0]?.tag || (isEn ? "Spiritual Tranquility" : "আত্মিক ও আধ্যাত্মিক প্রশান্তি"),
      bullets: isEn 
        ? ["Peaceful prayer atmosphere", "Crystal clear Adhan acoustics", "Ablution (Wudu) facility"]
        : ["শান্তিময় ও পবিত্র নামাজের পরিবেশ", "সমগ্র ফ্ল্যাটে আজানের সুর", "পরিপাটি ওজু ও বসার ব্যবস্থা"]
    },
    {
      Icon: Users2,
      title: t?.amenities?.items?.[1]?.title || (isEn ? "Spacious Community Space" : "সুপ্রশস্ত সুসজ্জিত কমিউনিটি স্পেস"),
      sub: t?.amenities?.items?.[1]?.sub || (isEn ? "Social & Family Gatherings" : "পারিবারিক অনুষ্ঠান ও সামাজিক মেলবন্ধন"),
      desc: t?.amenities?.items?.[1]?.desc || (isEn ? "Dedicated modern multipurpose hall designed for residents' family gatherings, milad, social events, and friendly get-togethers." : "পারিবারিক যেকোনো অনুষ্ঠান, সামাজিক মেলবন্ধন, মিলাদ মাহফিল ও বাসিন্দাদের মতবিনিময়ের জন্য নিজস্ব আধুনিক কমিউনিটি হল।"),
      tag: t?.amenities?.items?.[1]?.tag || (isEn ? "Social Harmony" : "সামাজিক সম্প্রীতি"),
      bullets: isEn
        ? ["Multipurpose banquet setup", "Residents' general meetings", "Sound & lighting integrated"]
        : ["পারিবারিক ঘরোয়া অনুষ্ঠান", "বাসিন্দাদের মতবিনিময় সভা", "আধুনিক লাইটিং ও সাউন্ড ব্যবস্থা"]
    },
    {
      Icon: Smile,
      title: t?.amenities?.items?.[2]?.title || (isEn ? "Protected Modern Play Zone" : "শিশুদের সুরক্ষিত আধুনিক প্লে-জোন"),
      sub: t?.amenities?.items?.[2]?.sub || (isEn ? "Joyful Safe Childhood" : "নিরাপদ আনন্দময় শৈশব"),
      desc: t?.amenities?.items?.[2]?.desc || (isEn ? "Zero-vehicle secured dedicated area ensuring children's healthy physical growth, creative play, and carefree joyful childhood." : "গাড়ি চলাচলমুক্ত সম্পূর্ণ নিরাপদ পরিবেশে শিশুদের শারীরিক বিকাশ ও মুক্ত আনন্দের জন্য ইনডোর ও আউটডোর শিশুবান্ধব খেলার জায়গা।"),
      tag: t?.amenities?.items?.[2]?.tag || (isEn ? "Child-Safe Zone" : "শিশুবান্ধব নিরাপদ জোন"),
      bullets: isEn
        ? ["Completely vehicle-free safe zone", "Child-safe protective flooring", "Indoor & outdoor joy rides"]
        : ["গাড়িমুক্ত ১০০% নিরাপদ জোন", "শিশুবান্ধব নন-স্লিপ সারফেস", "ইনডোর ও আউটডোর খেলার সামগ্রী"]
    },
    {
      Icon: Trees,
      title: t?.amenities?.items?.[3]?.title || (isEn ? "Rooftop Garden & BBQ Corner" : "ছাদে রুফটপ গার্ডেন ও বারবিকিউ কর্নার"),
      sub: t?.amenities?.items?.[3]?.sub || (isEn ? "Lush Greenery & Open Sky" : "মনোরম ল্যান্ডস্কেপিং ও ওপেন স্কাই ভিউ"),
      desc: t?.amenities?.items?.[3]?.desc || (isEn ? "Curated landscaped flora, seating pergolas, 360-degree city views, and dedicated family outdoor barbecue arrangement." : "সবুজ বাগান, দৃষ্টিনন্দন বসার জায়গা, ওপেন স্কাই সিটি ভিউ এবং পারিবারিক আনন্দের জন্য বিশেষ রুফটপ ফ্যামিলি বারবিকিউ সুবিধা।"),
      tag: t?.amenities?.items?.[3]?.tag || (isEn ? "Eco Recreation" : "সবুজ ও নান্দনিক বিনোদন"),
      bullets: isEn
        ? ["Lush green rooftop flora", "Dedicated family BBQ counter", "Scenic evening sunset deck"]
        : ["মনোরম রুফটপ ল্যান্ডস্কেপ", "ফ্যামিলি বারবিকিউ কাউন্টার", "খোলা আকাশের মনোরম সিটি ভিউ"]
    },
    {
      Icon: MapPin,
      title: t?.amenities?.items?.[4]?.title || (isEn ? "Everyday Civic Proximity" : "দৈনন্দিন নাগরিক সুবিধার সহজলভ্যতা"),
      sub: t?.amenities?.items?.[4]?.sub || (isEn ? "Everything Within Reach" : "সবকিছু হাতের নাগালে"),
      desc: t?.amenities?.items?.[4]?.desc || (isEn ? "Walking distance to reputed schools, colleges, specialized hospitals, shopping hubs, and central rapid transit highways." : "নামকরা স্কুল, কলেজ, বিশেষায়িত হাসপাতাল, কাঁচাবাজার ও প্রধান যোগাযোগ সড়কের ঠিক হাঁটার দূরত্বে কৌশলগত সুবিধাজনক অবস্থান।"),
      tag: t?.amenities?.items?.[4]?.tag || (isEn ? "Civic Connectivity" : "কমিউনিকেশন ও নাগরিক সান্নিধ্য"),
      bullets: isEn
        ? ["800m from Highway & MRT corridor", "Renowned colleges & schools", "Daily groceries & markets"]
        : ["মহাসড়ক ও MRT করিডোরের নিকটে", "নামকরা স্কুল, কলেজ ও মাদ্রাসা", "কাঁচাবাজার ও দৈনন্দিন শপিং"]
    },
    {
      Icon: ShieldCheck,
      title: t?.amenities?.items?.[5]?.title || (isEn ? "Dual-Tier Residential Privacy & Security" : "আবাসিক ও বাণিজ্যিক সমন্বিত দ্বিস্তর নিরাপত্তা"),
      sub: t?.amenities?.items?.[5]?.sub || (isEn ? "24/7 Monitored Privacy" : "২৪/৭ সার্বক্ষণিক নজরদারি ও প্রাইভেসি"),
      desc: t?.amenities?.items?.[5]?.desc || (isEn ? "Separate commercial parking & customer flow, combined with dedicated private entry gates and round-the-clock CCTV surveillance for residential families." : "নিচের বাণিজ্যিক স্পেসের জন্য আলাদা গ্রাহক পার্কিং ও আবাসিক পরিবারের জন্য সম্পূর্ণ পৃথক, সুরক্ষিত ও প্রাইভেট এন্ট্রি পয়েন্ট।"),
      tag: t?.amenities?.items?.[5]?.tag || (isEn ? "Family Security" : "১০০% পারিবারিক নিরাপত্তা"),
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
    <section id="amenities" className="py-16 sm:py-24 bg-gradient-to-b from-white via-[#F8FAF9] to-white relative overflow-hidden">
      {/* Subtle, soft ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-100/40 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#006231] border border-emerald-200 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#006231]" />
            <span>{isEn ? "Building Amenities & Living Facilities" : "বিল্ডিং ও প্রকল্পের আধুনিক সুযোগ-সুবিধা"}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            <span>{isEn ? "Master-Planned for" : "পরিকল্পিত, সুসংগঠিত ও"} </span>
            <span className="text-[#006231]">
              {isEn ? "Serene, Modern & Grand Living" : "শান্তিময় আধুনিক জীবনযাপন"}
            </span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
            {t?.amenities?.subtitle || (isEn 
              ? "Every Al-Emarah project harmonizes civic connectivity, spiritual serenity, and vibrant family living."
              : "আল ইমারাহ-এর প্রতিটি প্রকল্পে আধুনিক নাগরিক সুযোগ-সুবিধা, আত্মিক প্রশান্তি ও সামাজিক মেলবন্ধনের নিখুঁত আয়োজন।")}
          </p>
        </div>

        {/* 4 Feature Highlights Clean Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 max-w-5xl mx-auto">
          {highlights.map((item, hIdx) => {
            const HIcon = item.Icon;
            return (
              <div 
                key={hIdx}
                className="flex items-center space-x-2.5 p-3 sm:p-3.5 rounded-2xl bg-white border border-gray-200/90 hover:border-emerald-300 hover:shadow-sm transition-all shadow-2xs group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#006231] border border-emerald-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <HIcon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug group-hover:text-[#006231] transition-colors">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* 6 Signature Amenity Cards Grid - Unified Elegant White Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-2">
          {amenityCards.map((card, idx) => {
            const CardIcon = card.Icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-gray-200/90 hover:border-[#006231]/40 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between shadow-xs relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon, Index & Tag */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006231] border border-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                      <CardIcon className="w-6 h-6" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-3xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600">
                        {isEn ? `Feature 0${idx + 1}` : `সুবিধা 0${idx + 1}`}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#006231] transition-colors leading-snug">
                      {card.title}
                    </h3>
                    {card.sub && (
                      <span className="inline-block text-xs font-semibold text-[#006231] mt-1">
                        {card.sub}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                    {card.desc}
                  </p>

                  {/* Micro-Bullets Checklist with subtle emerald bullet pill */}
                  <div className="pt-2.5 space-y-2 border-t border-gray-100">
                    {card.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center space-x-2.5 text-3xs sm:text-xs text-gray-700">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#006231] flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#006231]"></div>
                        </div>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Tag & Arrow */}
                <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="inline-flex items-center text-xs font-semibold text-gray-600 group-hover:text-[#006231] transition-colors">
                    <span className="w-2 h-2 rounded-full bg-[#006231] mr-2 shadow-2xs"></span>
                    <span>{card.tag}</span>
                  </span>
                  <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-[#006231] text-gray-500 group-hover:text-white flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Architectural Excellence Standards Strip */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/90 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="flex items-center space-x-2.5">
              <Building2 className="w-5 h-5 text-[#006231]" />
              <h4 className="text-sm sm:text-base font-bold text-gray-900">
                {isEn ? "Structural Safety & Engineering Benchmarks" : "স্ট্রাকচারাল নিরাপত্তা ও ইঞ্জিনিয়ারিং নিশ্চয়তা"}
              </h4>
            </div>
            <span className="text-2xs text-[#006231] font-bold uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {isEn ? "BUET Tested Standards" : "বুয়েট পরীক্ষিত নির্মাণ মান"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-1">
              <div className="flex items-center space-x-2 text-gray-900 font-bold">
                <Shield className="w-4 h-4 text-[#006231]" />
                <span>{isEn ? "7.5+ Richter Earthquake Safe" : "৭.৫+ রিখটার ভূমিকম্প সহনশীল"}</span>
              </div>
              <p className="text-gray-600 text-3xs sm:text-xs">
                {isEn ? "High-grade 60/72.5 TMT steel rebar and dense concrete pile foundation." : "৬০/৭২.৫ গ্রেড রিবার স্টিল ও গভীর পাইল ফাউন্ডেশন সমৃদ্ধ।"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-1">
              <div className="flex items-center space-x-2 text-gray-900 font-bold">
                <Zap className="w-4 h-4 text-[#006231]" />
                <span>{isEn ? "100% Soundproof Generator" : "সাউন্ডপ্রুফ স্ট্যান্ডবাই জেনারেটর"}</span>
              </div>
              <p className="text-gray-600 text-3xs sm:text-xs">
                {isEn ? "Automatic generator backing emergency power, lifts, and common area lighting." : "লোডশেডিংয়ে সার্বক্ষণিক অটো পাওয়ার, লিফট ও জরুরি বিদ্যুৎ ব্যবস্থা।"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-1">
              <div className="flex items-center space-x-2 text-gray-900 font-bold">
                <Sun className="w-4 h-4 text-[#006231]" />
                <span>{isEn ? "Natural Light & Ventilation" : "প্রাকৃতিক আলো ও বাতাস চলাচল"}</span>
              </div>
              <p className="text-gray-600 text-3xs sm:text-xs">
                {isEn ? "Architecturally engineered cross ventilation for refreshing, healthy living." : "প্রতিটি ইউনিটে সর্বোচ্চ দিনের আলো ও উন্মুক্ত বাতাস প্রবাহ নিশ্চিত।"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
