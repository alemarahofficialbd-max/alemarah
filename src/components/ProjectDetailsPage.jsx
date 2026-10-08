import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Maximize2, 
  Bed, 
  BedDouble,
  Bath, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Phone, 
  Compass, 
  Download, 
  Building,
  Building2, 
  Car, 
  Zap, 
  Sparkles, 
  Layers, 
  Coins, 
  Check, 
  Share2, 
  ChevronRight, 
  MessageSquare, 
  ExternalLink,
  Utensils,
  ChefHat,
  Sofa,
  Sun,
  ShieldAlert,
  Flame,
  FileCheck,
  Ruler,
  Moon,
  Volume2,
  Trees,
  Users,
  Navigation,
  Store,
  Handshake,
  Cctv,
  Sprout,
  Fish,
  Wheat,
  Briefcase,
  GraduationCap,
  School,
  BookOpen,
  Gift,
  Info
} from 'lucide-react';
import { projectsData } from '../data/projectsData';

// Premium icon mapper providing tailored Lucide vector icons and elegant styling
const getFeatureIconConfig = (text, idx) => {
  const t = (text || '').toLowerCase();

  // Kitchen & Cooking
  if (t.includes('কিচেন') || t.includes('kitchen') || t.includes('রান্না')) {
    return { Icon: ChefHat, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200/60' };
  }
  // Dining
  if (t.includes('ডাইনিং') || t.includes('dining')) {
    return { Icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200/60' };
  }
  // Drawing / Living
  if (t.includes('ড্রয়িং') || t.includes('drawing')) {
    return { Icon: Sofa, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200/60' };
  }
  // Bed & Bath & Balcony
  if (t.includes('বেডরুম') || t.includes('bedroom') || t.includes('bed')) {
    return { Icon: BedDouble, color: 'text-[#006231]', bg: 'bg-emerald-50 border-emerald-200/60' };
  }
  if (t.includes('বাথরুম') || t.includes('bathroom') || t.includes('bath')) {
    return { Icon: Bath, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200/60' };
  }
  if (t.includes('বারান্দা') || t.includes('balcon')) {
    return { Icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200/60' };
  }
  // Land / Clear Title / Plot
  if (t.includes('জমির') || t.includes('নিষ্কণ্টক') || t.includes('land area') || t.includes('clear title') || t.includes('প্লট') || t.includes('plot')) {
    return { Icon: FileText, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200/60' };
  }
  // Size / Measurement
  if (t.includes('সাইজ') || t.includes('size') || t.includes('বর্গফুট') || t.includes('sq. ft') || t.includes('sqft') || t.includes('জফরি')) {
    return { Icon: Ruler, color: 'text-[#CE2028]', bg: 'bg-red-50 border-red-200/60' };
  }
  // Lift / Elevator / Stairs / Escalator
  if (t.includes('লিফট') || t.includes('lift') || t.includes('elevator') || t.includes('এসকেলেটর') || t.includes('escalator') || t.includes('সিঁড়ি') || t.includes('staircase')) {
    return { Icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200/60' };
  }
  // Parking & Vehicle
  if (t.includes('পার্কিং') || t.includes('parking') || t.includes('গাড়ি') || t.includes('কার')) {
    return { Icon: Car, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200/60' };
  }
  // BBQ & Landscaping / Rooftop Garden
  if (t.includes('বারবিকিউ') || t.includes('barbecue') || t.includes('bbq')) {
    return { Icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200/60' };
  }
  if (t.includes('ল্যান্ডস্কেপ') || t.includes('বাগান') || t.includes('garden') || t.includes('সবুজ') || t.includes('green')) {
    return { Icon: Trees, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200/60' };
  }
  // Prayer, Mosque, Musalla, Adhan
  if (t.includes('নামাজ') || t.includes('মুসাল্লা') || t.includes('prayer') || t.includes('মসজিদ') || t.includes('mosque')) {
    return { Icon: Moon, color: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200/60' };
  }
  if (t.includes('আজান') || t.includes('adhan')) {
    return { Icon: Volume2, color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200/60' };
  }
  // Play / Children
  if (t.includes('খেলার') || t.includes('play') || t.includes('শিশু') || t.includes('children')) {
    return { Icon: Sparkles, color: 'text-pink-600', bg: 'bg-pink-50 border-pink-200/60' };
  }
  // Family / Community
  if (t.includes('পারিবারিক') || t.includes('family') || t.includes('কমিউনিটি') || t.includes('community')) {
    return { Icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200/60' };
  }
  // Generator & Electricity & AC
  if (t.includes('জেনারেটর') || t.includes('generator') || t.includes('বিদ্যুৎ') || t.includes('electric') || t.includes('এসি') || t.includes(' ac')) {
    return { Icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200/60' };
  }
  // Road & Accessibility
  if (t.includes('রাস্তা') || t.includes('সড়ক') || t.includes('road') || t.includes('frontage') || t.includes('যোগাযোগ') || t.includes('access')) {
    return { Icon: Navigation, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200/60' };
  }
  // Commercial / Shop / Market / Plaza / Retail
  if (t.includes('মার্কেট') || t.includes('দোকান') || t.includes('শপিং') || t.includes('বাণিজ্যিক') || t.includes('retail') || t.includes('plaza') || t.includes('mall') || t.includes('commercial')) {
    return { Icon: Store, color: 'text-[#CE2028]', bg: 'bg-red-50 border-red-200/60' };
  }
  // Financial, Rental, Income, Agreement, Investment
  if (t.includes('ভাড়া') || t.includes('লভ্যাংশ') || t.includes('আয়') || t.includes('income') || t.includes('lease') || t.includes('টাকা')) {
    return { Icon: Coins, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200/60' };
  }
  if (t.includes('চুক্তি') || t.includes('agreement') || t.includes('অংশীদারিত্ব') || t.includes('ownership')) {
    return { Icon: Handshake, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200/60' };
  }
  // Security, CCTV, Surveillance
  if (t.includes('সিসিটিভি') || t.includes('cctv') || t.includes('surveillance') || t.includes('নিরাপদ') || t.includes('security') || t.includes('guard')) {
    return { Icon: Cctv, color: 'text-slate-800', bg: 'bg-slate-100 border-slate-200' };
  }
  // Residential Units / Apartment
  if (t.includes('ইউনিট') || t.includes('unit') || t.includes('আবাসিক') || t.includes('apartment')) {
    return { Icon: Building, color: 'text-[#CE2028]', bg: 'bg-red-50 border-red-200/60' };
  }
  // Agro, Cattle, Dairy, Livestock
  if (t.includes('গরু') || t.includes('দুগ্ধ') || t.includes('ক্যাটল') || t.includes('cattle') || t.includes('dairy') || t.includes('মাংস')) {
    return { Icon: Sprout, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200/60' };
  }
  // Fisheries / Fish
  if (t.includes('মাছ') || t.includes('fish')) {
    return { Icon: Fish, color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200/60' };
  }
  // Agriculture / Crops
  if (t.includes('মুরগি') || t.includes('হাঁস') || t.includes('ডিম') || t.includes('poultry') || t.includes('egg') || t.includes('duck') || t.includes('কৃষি') || t.includes('খামার') || t.includes('farm') || t.includes('agro') || t.includes('agriculture')) {
    return { Icon: Wheat, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200/60' };
  }
  // Employment
  if (t.includes('কর্মসংস্থান') || t.includes('employment') || t.includes('job')) {
    return { Icon: Briefcase, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200/60' };
  }

  // Fallback distinct configs based on index
  const fallbacks = [
    { Icon: Sparkles, color: 'text-[#CE2028]', bg: 'bg-red-50 border-red-200/60' },
    { Icon: ShieldCheck, color: 'text-[#006231]', bg: 'bg-emerald-50 border-emerald-200/60' },
    { Icon: CheckCircle2, color: 'text-[#8EBF40]', bg: 'bg-lime-50 border-lime-200/60' },
    { Icon: Compass, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200/60' }
  ];
  return fallbacks[idx % fallbacks.length];
};

export default function ProjectDetailsPage({ 
  project, 
  lang = 'bn', 
  t, 
  onBack, 
  onSelectProject,
  onBookVisit 
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeMediaTab, setActiveMediaTab] = useState('photos'); // 'photos' or 'floorplan'
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImage(null);
    setActiveMediaTab('photos');
  }, [project]);

  if (!project) return null;

  const isEn = lang === 'en';

  const statusColors = {
    ongoing: 'bg-amber-500 text-white',
    upcoming: 'bg-blue-600 text-white',
    ready: 'bg-[#006231] text-white'
  };

  const statusLabels = {
    ongoing: t.projects.card.statusOngoing,
    upcoming: t.projects.card.statusUpcoming,
    ready: t.projects.card.statusReady
  };

  const activeDisplayImage = selectedImage || project.image;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: isEn ? project.nameEn : project.nameBn,
        text: isEn ? project.taglineEn : project.taglineBn,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Other projects to explore
  const otherProjects = projectsData.filter(p => p.id !== project.id);

  return (
    <div className="bg-[#F8F9FA] text-[#231F20] min-h-screen pb-20 animate-fadeIn">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[57px] sm:top-[65px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-[#CE2028] bg-gray-50 hover:bg-red-50/50 px-3.5 py-1.5 rounded-xl border border-gray-200 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#CE2028] group-hover:-translate-x-1 transition-transform" />
            <span>{isEn ? 'Back to All Projects' : 'সকল প্রকল্পে ফিরে যান'}</span>
          </button>

          <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500">
            <button
              onClick={handleShare}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 cursor-pointer transition-colors"
              title={isEn ? 'Share Project' : 'প্রকল্প শেয়ার করুন'}
            >
              <Share2 className="w-3.5 h-3.5 text-gray-500" />
              <span>{copiedLink ? (isEn ? 'Link Copied!' : 'লিংক কপি হয়েছে!') : (isEn ? 'Share' : 'শেয়ার')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        
        {/* Project Header Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-2xs ${statusColors[project.status]}`}>
              {statusLabels[project.status]}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200 flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-gray-500" />
              <span>{isEn ? project.typeEn : project.typeBn}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#006231] text-xs font-bold border border-emerald-100 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8EBF40]" />
              <span>{isEn ? project.rajukApprovalEn : project.rajukApprovalBn}</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#231F20] tracking-tight">
              {isEn ? project.nameEn : project.nameBn}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
              {isEn ? project.taglineEn : project.taglineBn}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm text-gray-600 border-t border-gray-100">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.locationEn)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 font-bold text-gray-800 hover:text-[#CE2028] transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#CE2028]" />
              <span>{isEn ? project.locationEn : project.locationBn}</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
            <span className="text-gray-300">|</span>
            <div className="flex items-center space-x-1.5 font-medium">
              <Calendar className="w-4 h-4 text-[#006231]" />
              <span>{t.projects.card.handover}: <strong>{isEn ? project.handoverEn : project.handoverBn}</strong></span>
            </div>
          </div>
        </div>

        {/* Media & Key Specs Grid (Two columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Showcase & Specs (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Gallery / Media Card */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              
              {/* Media Switcher Tab (Photos vs Floorplan) */}
              {project.floorPlan && (
                <div className="flex border-b border-gray-100 pb-3 gap-2">
                  <button
                    onClick={() => setActiveMediaTab('photos')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeMediaTab === 'photos'
                        ? 'bg-gray-900 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isEn ? 'Project Photos' : 'প্রকল্পের ছবি ও নকশা'}
                  </button>
                  <button
                    onClick={() => setActiveMediaTab('floorplan')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeMediaTab === 'floorplan'
                        ? 'bg-[#CE2028] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isEn ? 'Floor Plan Preview' : 'ফ্লোর প্ল্যান ভিউ'}
                  </button>
                </div>
              )}

              {/* Main Image View */}
              <div className="relative h-72 sm:h-96 md:h-[460px] rounded-2xl overflow-hidden shadow-inner bg-gray-900 group">
                <img
                  src={activeMediaTab === 'floorplan' && project.floorPlan ? project.floorPlan : activeDisplayImage}
                  alt={isEn ? project.nameEn : project.nameBn}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.02]"
                />
                
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white">
                  {activeMediaTab === 'floorplan' ? (isEn ? 'Floor Plan' : 'ফ্লোর প্ল্যান') : (isEn ? 'Architectural View' : 'নান্দনিক স্থাপত্য দৃশ্য')}
                </div>
              </div>

              {/* Thumbnails Gallery Strip */}
              {activeMediaTab === 'photos' && project.gallery && project.gallery.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {isEn ? `Gallery Photos (${project.gallery.length})` : `গ্যালারি ছবিসমূহ (${project.gallery.length}টি)`}
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                    {project.gallery.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(imgUrl)}
                        className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          activeDisplayImage === imgUrl
                            ? 'border-[#CE2028] ring-2 ring-[#CE2028]/30 scale-102'
                            : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Metrics Bar with Matching Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {/* Size */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Maximize2 className="w-4 h-4 text-[#CE2028]" />
                  <span className="text-2xs uppercase tracking-wider font-bold">{isEn ? 'Size / Area' : 'ফ্ল্যাটের সাইজ'}</span>
                </div>
                <div className="text-base sm:text-lg font-black text-gray-900">
                  {isEn ? (project.sizeNoteEn || `${project.sizeSqft} Sq.Ft.`) : (project.sizeNoteBn || `${project.sizeSqft} বর্গফুট`)}
                </div>
              </div>

              {/* Beds */}
              {project.beds > 0 && (
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Bed className="w-4 h-4 text-[#006231]" />
                    <span className="text-2xs uppercase tracking-wider font-bold">{isEn ? 'Bedrooms' : 'বেডরুম'}</span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-gray-900">
                    {isEn ? `${project.beds} Bedrooms` : `০${project.beds}টি বেডরুম`}
                  </div>
                </div>
              )}

              {/* Baths */}
              {project.baths > 0 && (
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Bath className="w-4 h-4 text-blue-600" />
                    <span className="text-2xs uppercase tracking-wider font-bold">{isEn ? 'Bathrooms' : 'বাথরুম'}</span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-gray-900">
                    {isEn ? `${project.baths} Bathrooms` : `০${project.baths}টি বাথরুম`}
                  </div>
                </div>
              )}

              {/* Balconies */}
              {project.balconies && (
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="text-2xs uppercase tracking-wider font-bold">{isEn ? 'Balconies' : 'বারান্দা'}</span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-gray-900">
                    {isEn ? `${project.balconies} Balconies` : `০${project.balconies}টি বারান্দা`}
                  </div>
                </div>
              )}

              {/* Land Area */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Compass className="w-4 h-4 text-[#8EBF40]" />
                  <span className="text-2xs uppercase tracking-wider font-bold">{isEn ? 'Land Area' : 'জমির পরিমাণ'}</span>
                </div>
                <div className="text-base sm:text-lg font-black text-gray-900">
                  {isEn ? project.landAreaEn : project.landAreaBn}
                </div>
              </div>

              {/* Building Height */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span className="text-2xs uppercase tracking-wider font-bold">{isEn ? 'Building Type' : 'ভবনের ধরণ'}</span>
                </div>
                <div className="text-base sm:text-lg font-black text-gray-900">
                  {isEn ? project.buildingTypeEn : project.buildingTypeBn}
                </div>
              </div>

              {/* Lifts */}
              {project.lifts && (
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span className="text-2xs uppercase tracking-wider font-bold">{isEn ? 'Elevators' : 'লিফট ও সিঁড়ি'}</span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-gray-900">
                    {isEn ? `${project.lifts} Lifts, ${project.stairs || 1} Stair` : `০${project.lifts}টি লিফট ও ০১টি সিঁড়ি`}
                  </div>
                </div>
              )}

              {/* Handover */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Calendar className="w-4 h-4 text-[#CE2028]" />
                  <span className="text-2xs uppercase tracking-wider font-bold">{isEn ? 'Handover' : 'হস্তান্তর'}</span>
                </div>
                <div className="text-base sm:text-lg font-black text-gray-900">
                  {isEn ? project.handoverEn : project.handoverBn}
                </div>
              </div>
            </div>

            {/* Comprehensive Features & Specifications with Dedicated Icons */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#CE2028] uppercase tracking-wider flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Project Specifications' : 'প্রকল্পের পুঙ্খানুপুঙ্খ বিবরণ ও সুযোগ-সুবিধা'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                    {isEn ? 'Detailed Features & Amenities' : 'বৈশিষ্ট্য ও আধুনিক সুযোগ-সুবিধাসমূহ'}
                  </h3>
                </div>
              </div>

              {/* Specific breakdown grid with distinct premium vector icons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {(isEn ? project.featuresEn : project.featuresBn).map((feature, idx) => {
                  const { Icon: FeatureIcon, color, bg } = getFeatureIconConfig(feature, idx);
                  return (
                    <div 
                      key={idx} 
                      className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-gray-200 transition-all flex items-start space-x-3.5 group"
                    >
                      <div className={`w-10 h-10 rounded-xl ${bg} border flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                        <FeatureIcon className={`w-5 h-5 ${color}`} />
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-800 leading-relaxed pt-2">
                        {feature}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Structural Safety & Engineering Assurance */}
              <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-gray-900 via-[#1C1819] to-gray-900 text-white space-y-4 shadow-lg">
                <div className="flex items-center space-x-2 text-[#8EBF40] text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isEn ? 'BUET Tested Structural Engineering Safety' : 'বুয়েট পরীক্ষিত কাঠামোগত নিরাপত্তা'}</span>
                </div>
                <h4 className="text-lg sm:text-xl font-black text-white">
                  {isEn ? 'Engineered for Earthquake & Structural Durability' : 'ভূমিকম্প সহনশীল ও দীর্ঘমেয়াদি শতভাগ নিরাপদ নির্মাণ'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-300 pt-2">
                  <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <Check className="w-4 h-4 text-[#8EBF40] shrink-0" />
                    <span>{isEn ? '7.5+ Richter Earthquake Resistant' : '৭.৫+ মাত্রার ভূমিকম্প সহনশীল'}</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <Check className="w-4 h-4 text-[#8EBF40] shrink-0" />
                    <span>{isEn ? '60/72.5 Grade Rebar Steel' : '৬০/৭২.৫ গ্রেড রিবার স্টিল'}</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <Check className="w-4 h-4 text-[#8EBF40] shrink-0" />
                    <span>{isEn ? '100% Soundproof Auto Generator' : 'অটো সাউন্ডপ্রুফ জেনারেটর'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Detailed Description / Overview (if available) */}
            {(project.descriptionBn || project.descriptionEn) && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 text-[#006231] text-xs font-bold uppercase tracking-wider">
                  <Info className="w-4 h-4 text-[#8EBF40]" />
                  <span>{isEn ? 'Project Concept & Overview' : 'প্রকল্পের ধারণা ও সার্বিক পরিচিতি'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  {isEn ? 'Strategic Land Ownership & Living' : 'জমির স্বতন্ত্র মালিকানা ও পরিকল্পিত আবাসন'}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                  {isEn ? project.descriptionEn : project.descriptionBn}
                </p>

                {/* Financial Plan & Special Offer Banner */}
                {(project.financialPlanBn || project.specialOfferBn) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3">
                    {project.financialPlanBn && (
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-1">
                        <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                          <Coins className="w-4 h-4 text-amber-600" />
                          <span>{isEn ? 'Financial Plan' : 'আর্থিক পরিকল্পনা ও কিস্তি'}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug">
                          {isEn ? project.financialPlanEn : project.financialPlanBn}
                        </p>
                      </div>
                    )}

                    {project.specialOfferBn && (
                      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-1">
                        <div className="flex items-center space-x-2 text-[#006231] text-xs font-bold uppercase tracking-wider">
                          <Gift className="w-4 h-4 text-[#8EBF40]" />
                          <span>{isEn ? 'Special Launch Offer' : 'সিরাতুন্নবী বিশেষ অফার'}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                          {isEn ? project.specialOfferEn : project.specialOfferBn}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Nearby Amenities / Religious & Educational Institutions */}
            {project.nearbyInstitutions && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#CE2028] uppercase tracking-wider flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#CE2028]" />
                      <span>{isEn ? 'Surrounding Facilities' : 'আশেপাশের নাগরিক ও দ্বীনি সুবিধাসমূহ'}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                      {isEn ? 'Nearby Mosques, Madrasas & Educational Hubs' : 'নিকটবর্তী মসজিদ, মাদ্রাসা ও খ্যাতনামা শিক্ষাপ্রতিষ্ঠান'}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {isEn 
                        ? 'Prominent spiritual, educational, and civic landmarks within walking distance & 500m radius of West Sanarpar, Madinabaag (Ward-66, Demra).'
                        : 'পশ্চিম সানারপাড়, মদিনাবাগ (কোদালধোয়া), ৬৬ নং ওয়ার্ড, ডেমরা এলাকার ৫০০ মিটার পরিমণ্ডলে অবস্থিত গুরুত্বপূর্ণ প্রতিষ্ঠানসমূহ:'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1. Mosques */}
                  {project.nearbyInstitutions.mosques && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-emerald-50/60 to-white border border-emerald-100/80 shadow-2xs space-y-3">
                      <div className="flex items-center space-x-2 pb-2 border-b border-emerald-100">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Moon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">
                            {isEn ? 'Nearby Mosques' : 'নিকটবর্তী মসজিদসমূহ'}
                          </h4>
                          <span className="text-3xs text-emerald-700 font-semibold">
                            {isEn ? 'Within 300-500m' : '৩০০-৫০০ মিটারের মধ্যে'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {project.nearbyInstitutions.mosques.map((item, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-white border border-emerald-50 shadow-2xs space-y-1 hover:border-emerald-200 transition-colors">
                            <div className="text-xs font-bold text-gray-900 leading-snug">
                              {isEn ? item.nameEn : item.nameBn}
                            </div>
                            <div className="flex items-center text-3xs font-medium text-emerald-700 pt-0.5">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100/60 font-semibold">
                                {isEn ? item.distanceEn : item.distanceBn}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Madrasas */}
                  {project.nearbyInstitutions.madrasas && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-teal-50/60 to-white border border-teal-100/80 shadow-2xs space-y-3">
                      <div className="flex items-center space-x-2 pb-2 border-b border-teal-100">
                        <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">
                            {isEn ? 'Islamic Madrasas' : 'মাদ্রাসা ও দ্বীনি শিক্ষা'}
                          </h4>
                          <span className="text-3xs text-teal-700 font-semibold">
                            {isEn ? 'Renowned Institutions' : 'ঐতিহ্যবাহী শীর্ষ প্রতিষ্ঠান'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {project.nearbyInstitutions.madrasas.map((item, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-white border border-teal-50 shadow-2xs space-y-1 hover:border-teal-200 transition-colors">
                            <div className="text-xs font-bold text-gray-900 leading-snug">
                              {isEn ? item.nameEn : item.nameBn}
                            </div>
                            <div className="flex items-center text-3xs font-medium text-teal-700 pt-0.5">
                              <span className="px-2 py-0.5 rounded-full bg-teal-50 border border-teal-100/60 font-semibold">
                                {isEn ? item.distanceEn : item.distanceBn}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Schools & Colleges */}
                  {project.nearbyInstitutions.education && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-indigo-50/60 to-white border border-indigo-100/80 shadow-2xs space-y-3">
                      <div className="flex items-center space-x-2 pb-2 border-b border-indigo-100">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">
                            {isEn ? 'Schools & Colleges' : 'স্কুল ও খ্যাতনামা কলেজ'}
                          </h4>
                          <span className="text-3xs text-indigo-700 font-semibold">
                            {isEn ? 'Top Academic Centers' : 'উচ্চমানের শিক্ষা প্রতিষ্ঠান'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {project.nearbyInstitutions.education.map((item, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-white border border-indigo-50 shadow-2xs space-y-1 hover:border-indigo-200 transition-colors">
                            <div className="text-xs font-bold text-gray-900 leading-snug">
                              {isEn ? item.nameEn : item.nameBn}
                            </div>
                            <div className="flex items-center text-3xs font-medium text-indigo-700 pt-0.5">
                              <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100/60 font-semibold">
                                {isEn ? item.distanceEn : item.distanceBn}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sticky Action & Booking Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Direct Booking Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg space-y-5">
              <div className="space-y-1">
                <span className="text-2xs font-bold text-[#CE2028] uppercase tracking-wider flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{isEn ? 'Free Site Consultation' : 'ফ্রি সাইট ভিজিট'}</span>
                </span>
                <h3 className="text-xl font-black text-gray-900">
                  {isEn ? 'Schedule a Site Visit' : 'সরাসরি সাইট পরিদর্শন করুন'}
                </h3>
                <p className="text-xs text-gray-500">
                  {isEn ? 'Experience the location and project progress in person with our senior engineers.' : 'আমাদের সিনিয়র ইঞ্জিনিয়ারের তত্ত্বাবধানে প্রকল্প এলাকা ও নির্মাণ অগ্রগতি সরাসরি ঘুরে দেখুন।'}
                </p>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={() => onBookVisit(project)}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-[#CE2028] hover:bg-[#A9141B] text-white text-sm font-bold shadow-lg shadow-[#CE2028]/25 transition-all cursor-pointer active:scale-95"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>{isEn ? 'Book Free Site Visit' : 'সাইট ভিজিট বুক করুন'}</span>
              </button>

              {/* WhatsApp Direct Chat */}
              <a
                href={`https://wa.me/8801918646575?text=${encodeURIComponent(`Assalamu Alaikum. I am interested in ${isEn ? project.nameEn : project.nameBn}. Please share details.`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>{isEn ? 'WhatsApp Instant Inquiry' : 'হোয়াটসঅ্যাপে সরাসরি কথা বলুন'}</span>
              </a>

              {/* Direct Hotline Call Box */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#006231]" />
                  <span>{isEn ? 'Dedicated Hotline Desk:' : 'সরাসরি হটলাইনে কল দিন:'}</span>
                </div>
                <div className="space-y-1.5 pt-1">
                  <a 
                    href="tel:01816233013" 
                    className="flex items-center space-x-2 text-sm font-bold text-gray-900 hover:text-[#CE2028] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#CE2028]" />
                    <span>{isEn ? '01816-233013' : '০১৮১৬-২৩৩০১৩'}</span>
                  </a>
                  <a 
                    href="tel:01918646575" 
                    className="flex items-center space-x-2 text-sm font-bold text-gray-900 hover:text-[#CE2028] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#CE2028]" />
                    <span>{isEn ? '01918-646575' : '০১৯১৮-৬৪৬৫৭৫'}</span>
                  </a>
                  <a 
                    href="tel:01743926926" 
                    className="flex items-center space-x-2 text-sm font-bold text-gray-900 hover:text-[#CE2028] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#CE2028]" />
                    <span>{isEn ? '01743-926926' : '০১৭৪৩-৯২৬৯২৬'}</span>
                  </a>
                </div>
              </div>

              {/* Brochure Download Action */}
              <button
                onClick={() => alert(isEn ? `Brochure for ${project.nameEn} will be sent to your WhatsApp/Email.` : `${project.nameBn}-এর বিস্তারিত ব্রোশিউর ও বুকলেট প্রস্তুত রয়েছে। আমাদের প্রতিনিধি আপনাকে পাঠিয়ে দেবেন।`)}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-gray-600" />
                <span>{isEn ? 'Download Project Brochure (PDF)' : 'ব্রোশিউর ও স্পেসিফিকেশন (PDF)'}</span>
              </button>
            </div>

            {/* Office Directory Card */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-2.5 text-xs text-gray-600">
              <div className="font-bold text-gray-900 flex items-center space-x-1.5 text-xs sm:text-sm">
                <Building2 className="w-4 h-4 text-[#CE2028]" />
                <span>আল-ইমারাহ প্রধান কার্যালয়</span>
              </div>
              <p className="leading-relaxed">
                ৩/১, স্কাই ভিউ হেনোলাক্স সেন্টার (লেভেল-১০), পুরানা পল্টন, ঢাকা-১০০০
              </p>
              <div className="pt-1 text-gray-400 text-2xs">
                শনি - বৃহস্পতি: সকাল ৯:০০ - সন্ধ্যা ৬:০০
              </div>
            </div>

          </div>

        </div>

        {/* Explore Other Signature Projects Section */}
        <div className="pt-12 border-t border-gray-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#CE2028] uppercase tracking-wider">
                {isEn ? 'Explore More Landmarks' : 'আমাদের অন্যান্য সিগনেচার প্রকল্পসমূহ'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                {isEn ? 'Other Prestigious Developments' : 'আল-ইমারাহ পরিবারের অন্যান্য প্রকল্প'}
              </h3>
            </div>
            <button
              onClick={onBack}
              className="inline-flex items-center space-x-1 text-xs font-bold text-[#CE2028] hover:underline"
            >
              <span>{isEn ? 'View All Projects' : 'সকল প্রকল্প একসাথে দেখুন'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherProjects.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectProject(item)}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-gray-900">
                  <img
                    src={item.image}
                    alt={isEn ? item.nameEn : item.nameBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-2xs font-bold shadow-xs ${statusColors[item.status]}`}>
                      {statusLabels[item.status]}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#CE2028] transition-colors">
                      {isEn ? item.nameEn : item.nameBn}
                    </h4>
                    <p className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#CE2028]" />
                      <span>{isEn ? item.locationEn : item.locationBn}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#006231]">
                    <span>{isEn ? 'View Full Details' : 'সম্পূর্ণ বিবরণ দেখুন'}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
