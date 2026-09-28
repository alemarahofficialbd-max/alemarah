import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Maximize2, 
  Bed, 
  Bath, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Phone, 
  Compass, 
  Download,
  Image as ImageIcon
} from 'lucide-react';

export default function ProjectModal({ project, lang, t, onClose, onBookVisit }) {
  if (!project) return null;

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setSelectedImage(null);
  }, [project]);

  const statusColors = {
    ongoing: 'bg-amber-100 text-amber-800 border-amber-200',
    upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
    ready: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  const statusLabels = {
    ongoing: t.projects.card.statusOngoing,
    upcoming: t.projects.card.statusUpcoming,
    ready: t.projects.card.statusReady
  };

  const activeDisplayImage = selectedImage || project.image;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center space-x-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColors[project.status]}`}>
              {statusLabels[project.status]}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              {lang === 'en' ? project.typeEn : project.typeBn}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Main Title & Location */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#231F20]">
              {lang === 'en' ? project.nameEn : project.nameBn}
            </h3>
            <p className="flex items-center text-sm font-medium text-gray-600 mt-1.5">
              <MapPin className="w-4 h-4 text-[#CE2028] mr-1.5 shrink-0" />
              <span>{lang === 'en' ? project.locationEn : project.locationBn}</span>
            </p>
          </div>

          {/* Interactive Image Showcase & Gallery Strip */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-inner bg-gray-950">
              <img
                src={activeDisplayImage}
                alt={project.nameEn}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-white">
                {lang === 'en' ? 'Click thumbnails below to view' : 'নিচের ছবিতে ক্লিক করে গ্যালারি দেখুন'}
              </div>
            </div>

            {/* Gallery Thumbnails Strip */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                <button
                  onClick={() => setSelectedImage(project.image)}
                  className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeDisplayImage === project.image 
                      ? 'border-[#006231] ring-2 ring-[#006231]/30 scale-105' 
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={project.image} alt="Main preview" className="w-full h-full object-cover" />
                </button>
                {project.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeDisplayImage === img 
                        ? 'border-[#006231] ring-2 ring-[#006231]/30 scale-105' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
            {project.beds > 0 && (
              <div className="p-2">
                <div className="text-xs text-gray-500 font-medium">{t.projects.card.beds}</div>
                <div className="text-lg font-bold text-gray-900 flex items-center justify-center space-x-1 mt-0.5">
                  <Bed className="w-4 h-4 text-[#CE2028]" />
                  <span>{project.beds}</span>
                </div>
              </div>
            )}

            <div className="p-2">
              <div className="text-xs text-gray-500 font-medium">{t.projects.card.baths}</div>
              <div className="text-lg font-bold text-gray-900 flex items-center justify-center space-x-1 mt-0.5">
                <Bath className="w-4 h-4 text-[#006231]" />
                <span>{project.baths}</span>
              </div>
            </div>

            <div className="p-2">
              <div className="text-xs text-gray-500 font-medium">{t.projects.card.size}</div>
              <div className="text-lg font-bold text-gray-900 flex items-center justify-center space-x-1 mt-0.5">
                <Maximize2 className="w-4 h-4 text-[#8EBF40]" />
                <span>{project.sizeSqft} {t.projects.card.sqft}</span>
              </div>
            </div>

            <div className="p-2">
              <div className="text-xs text-gray-500 font-medium">{t.projects.card.handover}</div>
              <div className="text-sm font-bold text-gray-900 flex items-center justify-center space-x-1 mt-0.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{lang === 'en' ? project.handoverEn : project.handoverBn}</span>
              </div>
            </div>
          </div>

          {/* Authentic Floor & Unit Specifications (Leaflet Details) */}
          {project.unitSpecs && (
            <div className="rounded-2xl border-2 border-[#006231]/30 overflow-hidden shadow-xs bg-gradient-to-b from-emerald-50/50 to-white">
              <div className="bg-[#006231] text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 shadow-sm">
                <span className="text-base sm:text-lg font-black tracking-wide">
                  {lang === 'en' ? `Land Area: ${project.landAreaEn}` : `জমির পরিমাণ ${project.unitSpecs.landArea}।`}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#8EBF40]">
                  {lang === 'en' ? `Flat Size (Jofri): ${project.sizeSqft} Sq. Ft.` : `ফ্ল্যাটের সাইজ জফরি মাপে ${project.sizeSqft} বর্গফুট`}
                </span>
              </div>

              <div className="p-5 grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="space-y-2.5 border-r border-gray-200/80 pr-4">
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <span className="text-gray-600">{lang === 'en' ? 'Lifts' : 'লিফট'}</span>
                    <span className="font-bold text-gray-900">: {project.unitSpecs.lifts}</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <span className="text-gray-600">{lang === 'en' ? 'Stairs' : 'সিঁড়ি'}</span>
                    <span className="font-bold text-gray-900">: {project.unitSpecs.stairs}</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <span className="text-gray-600">{lang === 'en' ? 'Bedrooms' : 'বেডরুম'}</span>
                    <span className="font-bold text-gray-900">: {project.unitSpecs.beds}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{lang === 'en' ? 'Bathrooms' : 'বাথরুম'}</span>
                    <span className="font-bold text-gray-900">: {project.unitSpecs.baths}</span>
                  </div>
                </div>

                <div className="space-y-2.5 pl-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <span className="text-gray-600">{lang === 'en' ? 'Balconies' : 'বারান্দা'}</span>
                    <span className="font-bold text-gray-900">: {project.unitSpecs.balconies}</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <span className="text-gray-600">{lang === 'en' ? 'Kitchen' : 'কিচেন'}</span>
                    <span className="font-bold text-gray-900">{project.unitSpecs.kitchen}</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <span className="text-gray-600">{lang === 'en' ? 'Drawing' : 'ড্রয়িং'}</span>
                    <span className="font-bold text-gray-900">{project.unitSpecs.drawing}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{lang === 'en' ? 'Dining' : 'ডাইনিং'}</span>
                    <span className="font-bold text-gray-900">{project.unitSpecs.dining}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Features & Amenities */}
          <div>
            <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-[#006231]" />
              <span>{t.projects.modal.features}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(lang === 'en' ? project.featuresEn : project.featuresBn).map((feat, i) => (
                <div key={i} className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs sm:text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006231] mt-2 shrink-0"></span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated Architectural Floor Plan Section */}
          {project.floorPlan && (
            <div className="rounded-2xl border-2 border-emerald-100 bg-emerald-50/20 overflow-hidden shadow-xs">
              <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-950 font-bold text-sm sm:text-base">
                  <Compass className="w-5 h-5 text-[#006231]" />
                  <span>{lang === 'en' ? 'Master Architectural Floor Plan' : 'আবাসিক ফ্লোর প্ল্যান ও ইউনিট লেআউট'}</span>
                </div>
                <a
                  href={project.floorPlan}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#006231] hover:underline"
                >
                  {lang === 'en' ? 'Open Full Size ↗' : 'পূর্ণাকারে দেখুন ↗'}
                </a>
              </div>
              <div className="p-5 flex justify-center bg-white">
                <img
                  src={project.floorPlan}
                  alt={`${project.nameEn} Floor Plan`}
                  className="max-h-96 rounded-xl border border-gray-200 shadow-sm object-contain cursor-pointer hover:scale-[1.01] transition-transform"
                  onClick={() => setSelectedImage(project.floorPlan)}
                />
              </div>
            </div>
          )}

          {/* Project Real Photo Gallery Grid */}
          {project.gallery && project.gallery.length > 3 && (
            <div className="rounded-2xl border border-gray-200 p-5 bg-white space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h4 className="text-sm sm:text-base font-bold text-gray-900 flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-[#006231]" />
                  <span>{lang === 'en' ? 'Actual Site & Farm Gallery' : 'প্রকল্পের বাস্তব দৃশ্য ও ফটোগ্যালারি'}</span>
                </h4>
                <span className="text-xs font-bold text-[#006231] bg-emerald-50 px-2.5 py-1 rounded-full">
                  {lang === 'en' ? `${project.gallery.length} Photos` : `মোট ${project.gallery.length}টি বাস্তব ছবি`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {project.gallery.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer group shadow-2xs ${
                      activeDisplayImage === img ? 'border-[#006231] ring-2 ring-[#006231]/30 scale-105' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Site photo ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                      {lang === 'en' ? 'View' : 'দেখুন'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal Approval Notice */}
          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70 flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-[#006231] shrink-0" />
            <div className="text-xs text-emerald-900">
              <div className="font-bold">{lang === 'en' ? 'Verified Government Approval' : 'সরকারি যাচাইকৃত অনুমোদন'}</div>
              <div>{lang === 'en' ? project.rajukApprovalEn : project.rajukApprovalBn}</div>
            </div>
          </div>

          {/* Pricing Inquiry Box */}
          <div className="p-4 rounded-xl bg-red-50/60 border border-red-100 text-xs text-red-900 leading-relaxed">
            <span className="font-bold">{lang === 'en' ? 'Pricing & Payment Notice: ' : 'মূল্য ও কিস্তির তথ্য: '}</span>
            {t.projects.modal.pricingNotice}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => alert(lang === 'en' ? 'Brochure download initiated.' : 'ব্রোশিউর ডাউনলোড শুরু হয়েছে।')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-gray-600" />
            <span>{t.projects.modal.downloadBrochure}</span>
          </button>

          <div className="w-full sm:w-auto flex items-center space-x-2">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {t.projects.modal.close}
            </button>
            <button
              onClick={() => {
                onClose();
                onBookVisit(project);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#CE2028] text-white text-sm font-bold shadow-md shadow-[#CE2028]/25 hover:bg-[#A9141B] transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.projects.modal.bookSiteVisit}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
