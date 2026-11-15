import React, { useState, useEffect, useRef } from 'react';
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
  ChevronLeft,
  MessageSquare, 
  ExternalLink,
  Train,
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
  Egg,
  Beef,
  TrendingUp,
  Wallet,
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

  // 1. MRT / Metro Rail / Highway
  if (t.includes('mrt') || t.includes('লাইন-৪') || t.includes('মেট্রোরেল')) {
    return { Icon: Train, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200/60' };
  }

  // 2. Flat Size / Measurement
  if (t.includes('ফ্ল্যাটের সাইজ') || t.includes('বর্গফুট') || t.includes('sq. ft') || t.includes('sqft') || t.includes('1,265') || t.includes('১২৬৫') || t.includes('জফরি')) {
    return { Icon: Maximize2, color: 'text-[#CE2028]', bg: 'bg-red-50 border-red-200/60' };
  }

  // 3. Multi-room Apartment Configuration (Bedrooms, Bathrooms, Living, Dining, Kitchen)
  if (t.includes('বেডরুম') || t.includes('bedroom') || (t.includes('বাথরুম') && t.includes('বারান্দা'))) {
    return { Icon: BedDouble, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200/60' };
  }

  // 4. Multi-story Building & Residential Units
  if (t.includes('বিজি+') || t.includes('তলা') || t.includes('ভবন') || t.includes('বিল্ডিং') || t.includes('আবাসিক ইউনিট') || t.includes('residential unit')) {
    return { Icon: Building2, color: 'text-[#CE2028]', bg: 'bg-red-50 border-red-200/60' };
  }

  // 5. Land Area & Clear Title
  if (t.includes('জমির পরিমাণ') || t.includes('শতাংশ') || t.includes('নিষ্কণ্টক জমি') || t.includes('land area') || t.includes('clear title') || t.includes('প্লট')) {
    return { Icon: Compass, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200/60' };
  }

  // 6. Land Registry & Independent Share Ownership
  if (t.includes('রেজিস্ট্রি') || t.includes('স্বতন্ত্র') || t.includes('মালিকানা') || t.includes('শেয়ার মালিকানা') || t.includes('registry') || t.includes('ownership')) {
    return { Icon: FileCheck, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200/60' };
  }

  // 7. Transparency & Shareholder Progress Monitoring
  if (t.includes('স্বচ্ছতা') || t.includes('পর্যবেক্ষণ') || t.includes('অগ্রগতি') || t.includes('শেয়ারহোল্ডার') || t.includes('transparency') || t.includes('monitor')) {
    return { Icon: ShieldCheck, color: 'text-[#006231]', bg: 'bg-emerald-50 border-emerald-200/60' };
  }

  // 8. Commercial Plaza / Market / Shops
  if (t.includes('মার্কেট') || t.includes('দোকান') || t.includes('শপিং') || t.includes('বাণিজ্যিক') || t.includes('commercial') || t.includes('plaza') || t.includes('retail')) {
    return { Icon: Store, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200/60' };
  }

  // 9. Prayer / Musalla / Rooftop Community & Play
  if (t.includes('নামাজ') || t.includes('মুসাল্লা') || t.includes('prayer') || t.includes('মসজিদ') || t.includes('mosque')) {
    return { Icon: Moon, color: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200/60' };
  }
  if (t.includes('বারবিকিউ') || t.includes('bbq') || t.includes('খেলার') || t.includes('কমিউনিটি') || t.includes('play') || t.includes('community')) {
    return { Icon: Sparkles, color: 'text-pink-600', bg: 'bg-pink-50 border-pink-200/60' };
  }

  // 10. Roads & Highway Access
  if (t.includes('রাস্তা') || t.includes('সড়ক') || t.includes('road') || t.includes('মহাসড়ক') || t.includes('highway') || t.includes('ফুট রাস্তা')) {
    return { Icon: Navigation, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200/60' };
  }

  // 11. Lift, Stairs, Basement Parking & Fire Safety
  if (t.includes('লিফট') || t.includes('সিঁড়ি') || t.includes('lift') || t.includes('elevator') || t.includes('stair')) {
    return { Icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200/60' };
  }
  if (t.includes('পার্কিং') || t.includes('parking') || t.includes('গাড়ি') || t.includes('কার')) {
    return { Icon: Car, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200/60' };
  }
  if (t.includes('অগ্নিনিরাপত্তা') || t.includes('fire') || t.includes('নিরাপত্তা') || t.includes('security')) {
    return { Icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50 border-red-200/60' };
  }

  // Specific single-room utilities
  if (t.includes('কিচেন') || t.includes('kitchen') || t.includes('রান্না')) {
    return { Icon: ChefHat, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200/60' };
  }
  if (t.includes('ডাইনিং') || t.includes('dining')) {
    return { Icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200/60' };
  }
  if (t.includes('ড্রয়িং') || t.includes('drawing')) {
    return { Icon: Sofa, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200/60' };
  }
  if (t.includes('বাথরুম') || t.includes('bathroom') || t.includes('bath')) {
    return { Icon: Bath, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200/60' };
  }
  if (t.includes('বারান্দা') || t.includes('balcon')) {
    return { Icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200/60' };
  }

  // Generator & Electricity & AC
  if (t.includes('জেনারেটর') || t.includes('generator') || t.includes('বিদ্যুৎ') || t.includes('electric') || t.includes('এসি') || t.includes(' ac')) {
    return { Icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200/60' };
  }

  // Financial, Rental, Income, Agreement, Investment
  if (t.includes('ভাড়া') || t.includes('লভ্যাংশ') || t.includes('আয়') || t.includes('income') || t.includes('lease') || t.includes('টাকা')) {
    return { Icon: Coins, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200/60' };
  }
  if (t.includes('চুক্তি') || t.includes('agreement') || t.includes('অংশীদারিত্ব')) {
    return { Icon: Handshake, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200/60' };
  }

  // Security, CCTV, Surveillance
  if (t.includes('সিসিটিভি') || t.includes('cctv') || t.includes('surveillance')) {
    return { Icon: Cctv, color: 'text-slate-800', bg: 'bg-slate-100 border-slate-200' };
  }

  // Agro, Cattle, Dairy, Livestock
  if (t.includes('গরু') || t.includes('দুগ্ধ') || t.includes('ক্যাটল') || t.includes('cattle') || t.includes('dairy') || t.includes('মাংস')) {
    return { Icon: Sprout, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200/60' };
  }
  if (t.includes('মাছ') || t.includes('fish')) {
    return { Icon: Fish, color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200/60' };
  }
  if (t.includes('মুরগি') || t.includes('হাঁস') || t.includes('ডিম') || t.includes('poultry') || t.includes('egg') || t.includes('কৃষি') || t.includes('খামার') || t.includes('farm') || t.includes('agro')) {
    return { Icon: Wheat, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200/60' };
  }
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
  const [selectedImageItem, setSelectedImageItem] = useState(null);
  const [activeMediaTab, setActiveMediaTab] = useState('photos'); // 'photos' or 'floorplan'
  const [galleryCategory, setGalleryCategory] = useState('all'); // 'all', 'exterior', 'interior'
  const [copiedLink, setCopiedLink] = useState(false);

  // Normalize gallery items into uniform objects with titles & categories
  const galleryItems = React.useMemo(() => {
    if (!project?.gallery || project.gallery.length === 0) {
      return project?.image ? [{ url: project.image, titleBn: project.nameBn, titleEn: project.nameEn, category: 'exterior' }] : [];
    }
    return project.gallery.map((item, idx) => {
      if (typeof item === 'string') {
        return {
          url: item,
          titleBn: idx === 0 ? (project.nameBn || 'মূল স্থাপত্য ভিউ') : `গ্যালারি ফটো ০${idx + 1}`,
          titleEn: idx === 0 ? (project.nameEn || 'Main Architectural View') : `Gallery Photo ${idx + 1}`,
          category: 'exterior'
        };
      }
      return item;
    });
  }, [project]);

  // Check categories present in this project
  const hasInterior = galleryItems.some(item => item.category === 'interior');
  const hasExterior = galleryItems.some(item => item.category === 'exterior');

  const filteredGallery = React.useMemo(() => {
    if (galleryCategory === 'all') return galleryItems;
    return galleryItems.filter(item => item.category === galleryCategory);
  }, [galleryItems, galleryCategory]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageItem(null);
    setActiveMediaTab('photos');
    setGalleryCategory('all');
  }, [project]);

  if (!project) return null;

  const isEn = lang === 'en';
  const isAgro = project.category === 'agro';

  const statusColors = {
    ongoing: 'bg-amber-500 text-white',
    upcoming: 'bg-blue-600 text-white',
    ready: 'bg-[#006231] text-white',
    active: 'bg-[#8EBF40] text-white'
  };

  const statusLabels = {
    ongoing: t.projects.card.statusOngoing,
    upcoming: t.projects.card.statusUpcoming,
    ready: t.projects.card.statusReady,
    active: t.projects.card.statusActive || (isEn ? 'Active & Running' : 'চলমান ও সক্রিয়')
  };

  const currentItem = selectedImageItem || galleryItems[0] || { url: project.image, titleBn: project.nameBn, titleEn: project.nameEn, category: 'exterior' };
  const activeDisplayImage = activeMediaTab === 'floorplan' && project.floorPlan ? project.floorPlan : currentItem.url;
  const isLogoDisplayImage = typeof activeDisplayImage === 'string' && activeDisplayImage.endsWith('emarah_agro.svg');

  // Swipe/arrow navigation through the currently filtered gallery, wrapping
  // around at both ends so the main photo can be changed without scrolling
  // down to a big thumbnail grid.
  const goToGalleryOffset = (offset) => {
    if (!filteredGallery.length) return;
    const currentIdx = filteredGallery.findIndex(item => item.url === currentItem.url);
    const baseIdx = currentIdx === -1 ? 0 : currentIdx;
    const nextIdx = (baseIdx + offset + filteredGallery.length) % filteredGallery.length;
    setSelectedImageItem(filteredGallery[nextIdx]);
  };

  const touchStartXRef = useRef(null);
  const handleGalleryTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleGalleryTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(deltaX) < 40) return;
    goToGalleryOffset(deltaX < 0 ? 1 : -1);
  };
  const activeDisplayTitle = activeMediaTab === 'floorplan' 
    ? (isEn ? 'Approved Architectural Floor Plan' : 'অনুমোদিত আর্কিটেকচারাল ফ্লোর প্ল্যান নকশা')
    : (isEn ? (currentItem.titleEn || currentItem.titleBn) : (currentItem.titleBn || currentItem.titleEn));

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#project-details?id=${project.id}`;
    if (navigator.share) {
      navigator.share({
        title: isEn ? project.nameEn : project.nameBn,
        text: isEn ? project.taglineEn : project.taglineBn,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
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
              href={project.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.locationEn)}`}
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
              <span>{isAgro ? (isEn ? 'Status' : 'বর্তমান অবস্থা') : t.projects.card.handover}: <strong>{isEn ? project.handoverEn : project.handoverBn}</strong></span>
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

              {/* Main Image View -- swipe left/right (touch) or use the arrow
                  buttons to move through the gallery without scrolling down
                  to a big thumbnail grid. */}
              <div
                className={`relative h-72 sm:h-96 md:h-[480px] rounded-2xl overflow-hidden shadow-inner group select-none ${isLogoDisplayImage ? 'bg-white' : 'bg-gray-900'}`}
                onTouchStart={activeMediaTab === 'photos' ? handleGalleryTouchStart : undefined}
                onTouchEnd={activeMediaTab === 'photos' ? handleGalleryTouchEnd : undefined}
              >
                <img
                  src={activeDisplayImage}
                  alt={activeDisplayTitle || (isEn ? project.nameEn : project.nameBn)}
                  className={`transition-all duration-500 group-hover:scale-[1.02] ${isLogoDisplayImage ? 'w-full h-full object-contain p-10 sm:p-16' : 'w-full h-full object-cover'}`}
                  draggable={false}
                />

                {activeMediaTab === 'photos' && filteredGallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => goToGalleryOffset(-1)}
                      aria-label={isEn ? 'Previous photo' : 'আগের ছবি'}
                      className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md text-white flex items-center justify-center cursor-pointer transition-all active:scale-90"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => goToGalleryOffset(1)}
                      aria-label={isEn ? 'Next photo' : 'পরের ছবি'}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md text-white flex items-center justify-center cursor-pointer transition-all active:scale-90"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Top Badge: View type indicator */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white shadow-md flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{activeMediaTab === 'floorplan' ? (isEn ? 'Floor Plan' : 'ফ্লোর প্ল্যান') : (isEn ? 'Photo Showcase' : 'প্রকল্পের বাস্তব দৃশ্য')}</span>
                  {activeMediaTab === 'photos' && filteredGallery.length > 1 && (
                    <span className="text-emerald-300">
                      {filteredGallery.findIndex(item => item.url === currentItem.url) + 1}/{filteredGallery.length}
                    </span>
                  )}
                </div>

                {/* Bottom Overlay: Room / View Caption & Label */}
                {activeDisplayTitle && (
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-white flex items-center justify-between gap-3 shadow-lg pointer-events-none">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
                      <span className="font-bold text-xs sm:text-sm truncate drop-shadow-sm">{activeDisplayTitle}</span>
                    </div>
                    {activeMediaTab !== 'floorplan' && currentItem?.category && (
                      <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-md bg-white/20 text-emerald-300 shrink-0 uppercase tracking-wider">
                        {currentItem.category === 'interior' ? (isEn ? 'Interior Design' : 'ইন্টেরিয়র ডিজাইন') : (isEn ? 'Exterior View' : 'এক্সটেরিয়র ভিউ')}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnails Gallery Strip & Category Filter */}
              {activeMediaTab === 'photos' && galleryItems && galleryItems.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
                    <div className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-2">
                      <span>{isEn ? `Gallery Photos (${galleryItems.length})` : `গ্যালারি ছবিসমূহ (${galleryItems.length}টি)`}</span>
                    </div>

                    {/* Filter Tabs if both Exterior & Interior are present */}
                    {hasInterior && hasExterior && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setGalleryCategory('all')}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            galleryCategory === 'all'
                              ? 'bg-gray-900 text-white shadow-2xs'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {isEn ? `All (${galleryItems.length})` : `সকল ছবি (${galleryItems.length})`}
                        </button>
                        <button
                          type="button"
                          onClick={() => setGalleryCategory('exterior')}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            galleryCategory === 'exterior'
                              ? 'bg-[#006231] text-white shadow-2xs'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {isEn ? 'Exterior' : 'এক্সটেরিয়র'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setGalleryCategory('interior')}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            galleryCategory === 'interior'
                              ? 'bg-[#CE2028] text-white shadow-2xs'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {isEn ? 'Interior Design' : 'ইন্টেরিয়র ডিজাইন'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Strip: one compact scrollable row instead of a tall grid */}
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory">
                    {filteredGallery.map((item, idx) => {
                      const isSelected = activeDisplayImage === item.url;
                      const itemTitle = isEn ? (item.titleEn || item.titleBn) : (item.titleBn || item.titleEn);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImageItem(item)}
                          title={itemTitle}
                          className={`group relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer snap-start ${
                            isSelected
                              ? 'border-[#CE2028] ring-2 ring-[#CE2028]/30 shadow-sm'
                              : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400'
                          }`}
                        >
                          <div className={`w-full h-full overflow-hidden relative ${item.url.endsWith('emarah_agro.svg') ? 'bg-white' : 'bg-gray-100'}`}>
                            <img
                              src={item.url}
                              alt={itemTitle}
                              className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${item.url.endsWith('emarah_agro.svg') ? 'object-contain p-1.5' : 'object-cover'}`}
                            />
                            {false && (
                              <span className="absolute top-1 left-1 bg-red-600/90 text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow-xs">
                                ইন্টেরিয়র
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Metrics Bar with Matching Icons */}
            {isAgro ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-gray-200/90 shadow-2xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-gray-400">
                    <Wallet className="w-3.5 h-3.5 shrink-0 text-[#CE2028]" />
                    <span className="text-2xs uppercase tracking-wider font-bold text-gray-500">{isEn ? 'Min. Investment' : 'ন্যূনতম বিনিয়োগ'}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                    {isEn ? project.minInvestmentEn : project.minInvestmentBn}
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-gray-200/90 shadow-2xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-gray-400">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0 text-[#006231]" />
                    <span className="text-2xs uppercase tracking-wider font-bold text-gray-500">{isEn ? 'Profit Share' : 'মুনাফার অংশ'}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                    {isEn ? project.profitShareEn : project.profitShareBn}
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-gray-200/90 shadow-2xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-gray-400">
                    <Calendar className="w-3.5 h-3.5 shrink-0 text-[#8EBF40]" />
                    <span className="text-2xs uppercase tracking-wider font-bold text-gray-500">{isEn ? 'Payout Schedule' : 'লভ্যাংশ প্রদান'}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                    {isEn ? project.payoutEn : project.payoutBn}
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-gray-200/90 shadow-2xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-gray-400">
                    <Layers className="w-3.5 h-3.5 shrink-0 text-purple-600" />
                    <span className="text-2xs uppercase tracking-wider font-bold text-gray-500">{isEn ? 'Contract Term' : 'চুক্তির মেয়াদ'}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                    {isEn ? project.durationEn : project.durationBn}
                  </div>
                </div>
              </div>
            ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {/* Size */}
              <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-gray-200/90 shadow-2xs space-y-1">
                <div className="flex items-center space-x-1.5 text-gray-400">
                  <Maximize2 className="w-3.5 h-3.5 shrink-0 text-[#CE2028]" />
                  <span className="text-2xs uppercase tracking-wider font-bold text-gray-500">{isEn ? 'Size / Area' : 'ফ্ল্যাটের সাইজ'}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                  {isEn ? (project.sizeNoteEn || `${project.sizeSqft} Sq.Ft.`) : (project.sizeNoteBn || `${project.sizeSqft} বর্গফুট`)}
                </div>
              </div>

              {/* Beds */}
              {project.beds > 0 && (
                <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-gray-200/90 shadow-2xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-gray-400">
                    <Bed className="w-3.5 h-3.5 shrink-0 text-[#006231]" />
                    <span className="text-2xs uppercase tracking-wider font-bold text-gray-500">{isEn ? 'Bedrooms' : 'বেডরুম'}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                    {isEn ? `${project.beds} Bedrooms` : `০${project.beds}টি বেডরুম`}
                  </div>
                </div>
              )}

              {/* Baths */}
              {project.baths > 0 && (
                <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-gray-200/90 shadow-2xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-gray-400">
                    <Bath className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                    <span className="text-2xs uppercase tracking-wider font-bold text-gray-500">{isEn ? 'Bathrooms' : 'বাথরুম'}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                    {isEn ? `${project.baths} Bathrooms` : `০${project.baths}টি বাথরুম`}
                  </div>
                </div>
              )}

              {/* Balconies */}
              {project.balconies && (
                <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-gray-200/90 shadow-2xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-gray-400">
                    <Sun className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                    <span className="text-2xs uppercase tracking-wider font-bold text-gray-500">{isEn ? 'Balconies' : 'বারান্দা'}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                    {isEn ? `${project.balconies} Balconies` : `০${project.balconies}টি বারান্দা`}
                  </div>
                </div>
              )}

              {/* Land Area */}
              <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-gray-200/90 shadow-2xs space-y-1">
                <div className="flex items-center space-x-1.5 text-gray-400">
                  <Compass className="w-3.5 h-3.5 shrink-0 text-[#8EBF40]" />
                  <span className="text-2xs uppercase tracking-wider font-bold text-gray-500">{isEn ? 'Land Area' : 'জমির পরিমাণ'}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                  {isEn ? project.landAreaEn : project.landAreaBn}
                </div>
              </div>

              {/* Building Height */}
              <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-gray-200/90 shadow-2xs space-y-1">
                <div className="flex items-center space-x-1.5 text-gray-400">
                  <Layers className="w-3.5 h-3.5 shrink-0 text-purple-600" />
                  <span className="text-2xs uppercase tracking-wider font-bold text-gray-500">{isEn ? 'Building Type' : 'ভবনের ধরণ'}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                  {isEn ? project.buildingTypeEn : project.buildingTypeBn}
                </div>
              </div>

              {/* Lifts */}
              {project.lifts && (
                <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-gray-200/90 shadow-2xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-gray-400">
                    <Zap className="w-3.5 h-3.5 shrink-0 text-orange-500" />
                    <span className="text-2xs uppercase tracking-wider font-bold text-gray-500">{isEn ? 'Elevators' : 'লিফট ও সিঁড়ি'}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                    {isEn ? `${project.lifts} Lifts, ${project.stairs || 1} Stair` : `০${project.lifts}টি লিফট ও ০১টি সিঁড়ি`}
                  </div>
                </div>
              )}

              {/* Handover */}
              <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-gray-200/90 shadow-2xs space-y-1">
                <div className="flex items-center space-x-1.5 text-gray-400">
                  <Calendar className="w-3.5 h-3.5 shrink-0 text-[#CE2028]" />
                  <span className="text-2xs uppercase tracking-wider font-bold text-gray-500">{isEn ? 'Handover' : 'হস্তান্তর'}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                  {isEn ? project.handoverEn : project.handoverBn}
                </div>
              </div>
            </div>
            )}

            {/* Comprehensive Features & Specifications without bulky nested boxes */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#CE2028] uppercase tracking-wider flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Project Specifications' : 'প্রকল্পের সুযোগ-সুবিধা ও বিবরণ'}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {isEn ? 'Detailed Features & Amenities' : 'বৈশিষ্ট্য ও আধুনিক সুযোগ-সুবিধাসমূহ'}
                  </h3>
                </div>
              </div>

              {/* Clean, space-saving specification list without separate card boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {((isEn ? project.featuresEn : project.featuresBn) || []).map((feature, idx) => {
                  const { Icon: FeatureIcon, color, bg } = getFeatureIconConfig(feature, idx);
                  return (
                    <div 
                      key={idx} 
                      className="flex items-start space-x-3 py-2 border-b border-gray-100/70 last:border-b-0 hover:bg-gray-50/60 rounded-lg px-2 transition-colors"
                    >
                      <div className={`w-7 h-7 rounded-lg ${bg} border flex items-center justify-center shrink-0 mt-0.5 shadow-2xs`}>
                        <FeatureIcon className={`w-3.5 h-3.5 ${color}`} />
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug flex-1 pt-0.5">
                        {feature}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Structural Safety & Engineering Assurance (real-estate only) */}
              {!isAgro && (
              <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-gray-900 via-[#1C1819] to-gray-900 text-white space-y-4 shadow-lg">
                <div className="flex items-center space-x-2 text-[#8EBF40] text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isEn ? 'BUET Tested Structural Engineering Safety' : 'বুয়েট পরীক্ষিত কাঠামোগত নিরাপত্তা'}</span>
                </div>
                <h4 className="text-lg sm:text-xl font-black text-white">
                  {isEn ? 'Engineered for Earthquake & Structural Durability' : 'ভূমিকম্প সহনশীল ও দীর্ঘমেয়াদি শতভাগ নিরাপদ নির্মাণ'}
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
              )}
            </div>

            {/* Business Sectors (Agro projects only) */}
            {isAgro && (project.businessSectorsEn || project.businessSectorsBn) && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#CE2028] uppercase tracking-wider flex items-center space-x-1.5">
                    <Sprout className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Core Business Sectors' : 'আমাদের ব্যবসার প্রধান ক্ষেত্র'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                    {isEn ? 'What We Farm & Produce' : 'যেসব কার্যক্রম নিয়ে আমরা কাজ করি'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {(isEn ? project.businessSectorsEn : project.businessSectorsBn).map((sector, idx) => {
                    const sectorIcons = [Egg, Fish, Beef, Wheat];
                    const SectorIcon = sectorIcons[idx % sectorIcons.length];
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-gray-200 transition-all flex items-start space-x-3.5"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 shadow-2xs">
                          <SectorIcon className="w-5 h-5 text-[#006231]" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{sector.title}</div>
                          <div className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-0.5">{sector.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Project Detailed Description / Overview (if available) */}
            {(project.descriptionBn || project.descriptionEn) && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 text-[#006231] text-xs font-bold uppercase tracking-wider">
                  <Info className="w-4 h-4 text-[#8EBF40]" />
                  <span>{isEn ? 'Project Concept & Overview' : 'প্রকল্পের ধারণা ও সার্বিক পরিচিতি'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  {isAgro
                    ? (isEn ? 'Growing With Trust' : 'বিশ্বাসের সঙ্গে এগিয়ে চলা')
                    : (isEn ? 'Strategic Land Ownership & Living' : 'জমির স্বতন্ত্র মালিকানা ও পরিকল্পিত আবাসন')}
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

            {/* Why Choose Us (Agro projects only) */}
            {isAgro && (project.whyChooseUsEn || project.whyChooseUsBn) && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#CE2028] uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Our Strength' : 'আমাদের শক্তি'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                    {isEn ? 'Why Emarah Agro?' : 'কেন ইমারাহ এগ্রো?'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {(isEn ? project.whyChooseUsEn : project.whyChooseUsBn).map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                      <Check className="w-4 h-4 text-[#006231] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold text-gray-900">{item.title}</div>
                        <div className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Future Plan (Agro projects only) */}
            {isAgro && (project.futurePlanEn || project.futurePlanBn) && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center space-x-2 text-[#006231] text-xs font-bold uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-[#8EBF40]" />
                  <span>{isEn ? 'Our Future Plan' : 'আমাদের ভবিষ্যৎ পরিকল্পনা'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  {isEn ? "Today's Foundation, Tomorrow's Potential" : 'আজকের ভিত্তি, আগামী দিনের সম্ভাবনা'}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                  {isEn ? project.futurePlanEn : project.futurePlanBn}
                </p>
              </div>
            )}

            {/* Location & Multi-Route Connectivity with Panoramic Google Map */}
            {(project.connectivity || project.id === 'al-quds-tower') && (
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4 sm:space-y-5">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-gray-100 pb-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#CE2028] uppercase tracking-wider flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#CE2028]" />
                      <span>{isEn ? (project.connectivity?.titleEn || 'Location & Transit Connectivity') : (project.connectivity?.titleBn || 'প্রকল্পের অবস্থান ও বহুমুখী যাতায়াত সুবিধা')}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      {isEn ? 'Strategic Connectivity Across Greater Dhaka' : 'কৌশলগত অবস্থান ও ঢাকার সঙ্গে বহুমুখী যোগাযোগ'}
                    </h3>
                  </div>
                  <a
                    href={project.mapUrl || "https://maps.app.goo.gl/2qVAq5uPZf4Rtwqx7"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-[#CE2028] text-gray-700 text-xs font-bold transition-all border border-gray-200 shrink-0 self-start sm:self-center"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#CE2028]" />
                    <span>{isEn ? 'Open in Google Maps' : 'গুগল ম্যাপে বড় করে দেখুন'}</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>

                {/* Clean Address & Distance Header (No nested bulky boxes) */}
                <div className="space-y-1.5 py-0.5">
                  <div className="flex items-start space-x-2 text-xs sm:text-sm text-gray-800">
                    <MapPin className="w-4 h-4 text-[#CE2028] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-gray-900">{isEn ? 'Address: ' : 'ঠিকানা: '}</span>
                      <span className="font-medium text-gray-700">
                        {isEn 
                          ? (project.connectivity?.addressEn || 'West Sanarpar, Madinabaag (Kodaldhoya), Ward-66, Demra, Dhaka.') 
                          : (project.connectivity?.addressBn || 'পশ্চিম সানারপাড়, মদিনাবাগ (কোদালধোয়া), ৬৬ নং ওয়ার্ড, ডেমরা, ঢাকা।')}
                      </span>
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-md bg-red-50 border border-red-200 text-[#CE2028] text-2xs sm:text-xs font-bold whitespace-nowrap">
                        📍 {isEn ? (project.connectivity?.highwayDistanceEn || '700–800m from Highway') : (project.connectivity?.highwayDistanceBn || 'ঢাকা–চট্টগ্রাম মহাসড়ক থেকে আনুমানিক ৭০০–৮০০ মিটার')}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-6">
                    {isEn
                      ? (project.connectivity?.highlightEn || "One of the standout advantages of the project is its versatile multi-route connectivity to Dhaka's major commercial, residential, and transit corridors.")
                      : (project.connectivity?.highlightBn || "প্রকল্পটির অন্যতম বিশেষত্ব হলো—ঢাকার গুরুত্বপূর্ণ বাণিজ্যিক, আবাসিক ও যোগাযোগকেন্দ্রগুলোর সঙ্গে একাধিক রুটে যাতায়াতের সুবিধা।")}
                  </p>
                </div>

                {/* Wide Panoramic Google Map (No square look, no overlapping floating cards) */}
                <div className="relative w-full h-52 sm:h-64 md:h-72 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-xs">
                  <iframe
                    title={isEn ? `${project.nameEn} Location on Google Maps` : `${project.nameBn} গুগল ম্যাপ লোকেশন`}
                    src={project.mapEmbedUrl || "https://maps.google.com/maps?q=23.727009,90.422822&hl=bn&z=16&output=embed"}
                    className="w-full h-full border-0"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                {/* Fixed Map Navigation & Information Banner (Clean, responsive, never broken) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img 
                      src={project.image || "/images/al_quds_tower.webp"} 
                      alt={isEn ? project.nameEn : project.nameBn} 
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0 shadow-2xs"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">{isEn ? project.nameEn : project.nameBn}</span>
                        <span className="text-3xs font-bold text-[#006231] bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded shrink-0">
                          {isEn ? 'Live Project Pin' : 'সরাসরি প্রজেক্ট পিন'}
                        </span>
                      </div>
                      <p className="text-3xs sm:text-2xs text-gray-500 truncate">
                        {isEn ? 'West Sanarpar, Madinabaag, Demra, Dhaka' : 'পশ্চিম সানারপাড়, মদিনাবাগ, ডেমরা, ঢাকা'}
                      </p>
                    </div>
                  </div>

                  <a
                    href={project.mapUrl || "https://maps.app.goo.gl/2qVAq5uPZf4Rtwqx7"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-1.5 py-2 px-3.5 rounded-lg bg-[#CE2028] hover:bg-[#A9141B] text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Open in Google Maps' : 'গুগল ম্যাপে পিন দেখুন'}</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                  </a>
                </div>

                {/* 3 Major Routes Grid */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <Navigation className="w-3.5 h-3.5 text-[#006231]" />
                    <span>{isEn ? 'Key Commuter & Commercial Routes' : 'প্রধান ৩টি সহজ যাতায়াত রুটসমূহ'}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Route 1: Motijheel - Paltan - Gulistan */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-gray-200/60">
                        <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-blue-600" />
                          {isEn ? 'Commercial Hub' : 'বাণিজ্যিক কেন্দ্র'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-3xs font-extrabold">
                          {isEn ? '15–20 Mins' : '১৫–২০ মিনিট'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                          {isEn ? 'Motijheel – Paltan – Gulistan' : 'মতিঝিল–পল্টন–গুলিস্তান রুট'}
                        </h4>
                        <span className="text-3xs text-blue-600 font-semibold block mt-0.5">
                          {isEn ? 'Via Mayor Hanif Flyover' : 'হানিফ ফ্লাইওভার ব্যবহার করে'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {isEn
                          ? 'From commercial hubs Motijheel, Paltan & Gulistan via Hanif Flyover in approx. 15–20 mins to Signboard/Sanarpar bus stop, then only 800m directly to the project.'
                          : 'ঢাকার ব্যস্ততম বাণিজ্যিক এলাকা মতিঝিল, পল্টন ও গুলিস্তান থেকে হানিফ ফ্লাইওভার ব্যবহার করে আনুমানিক ১৫–২০ মিনিটে ঢাকা–চট্টগ্রাম মহাসড়কের সাইনবোর্ড/সানারপাড় বাসস্ট্যান্ডে পৌঁছে সেখান থেকে মাত্র ৮০০ মিটার পথ পেরিয়ে প্রকল্পে আসা যায়।'}
                      </p>
                    </div>

                    {/* Route 2: Banasree - Hatirjheel - Gulshan - Baridhara */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-gray-200/60">
                        <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                          {isEn ? 'Diplomatic Zone' : 'কূটনৈতিক ও অভিজাত জোন'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-3xs font-extrabold">
                          {isEn ? '~10 Mins (Staff Qtr)' : '~১০ মিনিট (স্টাফ কোয়ার্টার)'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                          {isEn ? 'Banasree – Hatirjheel – Gulshan – Baridhara' : 'বনশ্রী–হাতিরঝিল–গুলশান–বারিধারা রুট'}
                        </h4>
                        <span className="text-3xs text-emerald-600 font-semibold block mt-0.5">
                          {isEn ? 'Via Staff Quarter & Hatirjheel' : 'স্টাফ কোয়ার্টার ও হাতিরঝিল লিঙ্ক দিয়ে'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {isEn
                          ? 'Connect easily to Gulshan and Baridhara via Staff Quarter and Banasree connecting Hatirjheel. Staff Quarter area is only approx. 10 minutes away from the project.'
                          : 'প্রকল্প থেকে স্টাফ কোয়ার্টার হয়ে বনশ্রী রুট ব্যবহার করে হাতিরঝিলের মাধ্যমে গুলশান ও বারিধারার দিকে যাতায়াতের সুযোগ রয়েছে। স্টাফ কোয়ার্টার এলাকা প্রকল্প থেকে আনুমানিক ১০ মিনিটের দূরত্বে।'}
                      </p>
                    </div>

                    {/* Route 3: Kanchpur - Bhulta - Narayanganj - 300 Feet Highway */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-gray-200/60">
                        <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-amber-600" />
                          {isEn ? 'Regional Arteries' : 'উত্তর ও পূর্বাঞ্চল সংযোগ'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-3xs font-extrabold">
                          {isEn ? 'Direct Access' : 'সরাসরি সংযোগ'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                          {isEn ? 'Kanchpur – Bhulta – Narayanganj – 300 Feet' : 'কাঁচপুর–ভুলতা–নারায়ণগঞ্জ–৩০০ ফুট সড়ক রুট'}
                        </h4>
                        <span className="text-3xs text-amber-600 font-semibold block mt-0.5">
                          {isEn ? 'Via 300ft Expressway & Highways' : '৩০০ ফুট ও মহাসড়ক করিডোর দিয়ে'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {isEn
                          ? 'Via Kanchpur connecting Bhulta–Narayanganj and 300 Feet Road, offering swift transit towards Gazipur and northern districts.'
                          : 'কাঁচপুর হয়ে ভুলতা–নারায়ণগঞ্জের সংযোগপথ এবং ৩০০ ফুট সড়ক ব্যবহার করে গাজীপুরসহ উত্তরাঞ্চলের দিকে যাতায়াতের সুযোগ রয়েছে।'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Multi-connectivity Summary */}
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 text-xs sm:text-sm text-gray-700 leading-relaxed flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#006231] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900">{isEn ? 'Key Advantage: ' : 'সারসংক্ষেপ: '}</span>
                    <span>
                      {isEn
                        ? 'The project does not rely on a single artery; rather, it enjoys versatile, resilient multi-corridor transit across all major parts of Dhaka.'
                        : 'অর্থাৎ, প্রকল্পটি শুধু একটি সড়কের ওপর নির্ভরশীল নয়; বরং ঢাকার বিভিন্ন গুরুত্বপূর্ণ এলাকার সঙ্গে একাধিক যোগাযোগপথে সংযুক্ত হওয়ার সুবিধা রয়েছে।'}
                    </span>
                  </div>
                </div>

                {/* Future Infrastructure / MRT Line-4 Feature Card */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-gray-900 via-[#1C1819] to-gray-900 text-white space-y-1.5 shadow-sm">
                  <div className="flex items-center space-x-2 text-[#8EBF40] text-xs font-bold uppercase tracking-wider">
                    <Train className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isEn ? 'Future Mega Infrastructure' : 'মেগাপ্রকল্প ও ভবিষ্যৎ যোগাযোগ ব্যবস্থা'}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {isEn ? 'Planned MRT Line-4 (Metro Rail) Corridor' : 'পরিকল্পিত MRT Line-4 (মেট্রোরেল লাইন-৪) ও সমৃদ্ধ ভবিষ্যৎ'}
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {isEn
                      ? 'From the perspective of future urban connectivity, the location is immensely strategic. Once the planned MRT Line-4 begins operations, the project will be situated right within its immediate transit catchment zone.'
                      : 'ভবিষ্যৎ যোগাযোগব্যবস্থার দিক থেকেও এলাকাটি অত্যন্ত গুরুত্বপূর্ণ। পরিকল্পিত MRT Line-4 চালু হলে প্রকল্পটি এর নিকটবর্তী এলাকার মধ্যে অবস্থান করবে।'}
                  </p>
                </div>
              </div>
            )}

            {/* Nearby Amenities / Religious & Educational Institutions */}
            {project.nearbyInstitutions && (
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4 sm:space-y-5">
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
                  {isAgro ? <Coins className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                  <span>{isAgro ? (isEn ? 'Start Your Investment' : 'বিনিয়োগ শুরু করুন') : (isEn ? 'Free Site Consultation' : 'ফ্রি সাইট ভিজিট')}</span>
                </span>
                <h3 className="text-xl font-black text-gray-900">
                  {isAgro ? (isEn ? 'Become an Investment Partner' : 'বিনিয়োগ অংশীদার হোন') : (isEn ? 'Schedule a Site Visit' : 'সরাসরি সাইট পরিদর্শন করুন')}
                </h3>
                <p className="text-xs text-gray-500">
                  {isAgro
                    ? (isEn ? 'Share your details and our team will contact you with the formal investment agreement.' : 'আপনার তথ্য দিন, আমাদের প্রতিনিধি লিখিত বিনিয়োগ চুক্তি নিয়ে যোগাযোগ করবেন।')
                    : (isEn ? 'Experience the location and project progress in person with our senior engineers.' : 'আমাদের সিনিয়র ইঞ্জিনিয়ারের তত্ত্বাবধানে প্রকল্প এলাকা ও নির্মাণ অগ্রগতি সরাসরি ঘুরে দেখুন।')}
                </p>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={() => onBookVisit(project)}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-[#CE2028] hover:bg-[#A9141B] text-white text-sm font-bold shadow-lg shadow-[#CE2028]/25 transition-all cursor-pointer active:scale-95"
              >
                {isAgro ? <Coins className="w-4 h-4 text-white" /> : <Calendar className="w-4 h-4 text-white" />}
                <span>{isAgro ? (isEn ? 'Invest Now' : 'বিনিয়োগ করুন') : (isEn ? 'Book Free Site Visit' : 'সাইট ভিজিট বুক করুন')}</span>
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
                    className="flex items-center space-x-2 text-sm font-extrabold text-gray-950 hover:text-[#CE2028] transition-colors tracking-wide"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#CE2028]" />
                    <span className="font-extrabold">{isEn ? '01816-233013' : '০১৮১৬-২৩৩০১৩'}</span>
                  </a>
                  <a 
                    href="tel:01918646575" 
                    className="flex items-center space-x-2 text-sm font-bold text-gray-800 hover:text-[#CE2028] transition-colors tracking-wide"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#CE2028]" />
                    <span className="font-bold">{isEn ? '01918-646575' : '০১৯১৮-৬৪৬৫৭৫'}</span>
                  </a>
                  <a 
                    href="tel:01743926926" 
                    className="flex items-center space-x-2 text-sm font-bold text-gray-800 hover:text-[#CE2028] transition-colors tracking-wide"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#CE2028]" />
                    <span className="font-bold">{isEn ? '01743-926926' : '০১৭৪৩-৯২৬৯২৬'}</span>
                  </a>
                </div>
              </div>

              {/* Brochure Download Action */}
              <button
                onClick={() => project.brochureUrl ? window.open(project.brochureUrl, '_blank', 'noreferrer') : alert(isEn ? `Brochure for ${project.nameEn} will be sent to your WhatsApp/Email.` : `${project.nameBn}-এর বিস্তারিত ব্রোশিউর ও বুকলেট প্রস্তুত রয়েছে। আমাদের প্রতিনিধি আপনাকে পাঠিয়ে দেবেন।`)}
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
        {otherProjects.length > 0 && (
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
        )}

      </div>
    </div>
  );
}
