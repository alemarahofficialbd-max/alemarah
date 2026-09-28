import React from 'react';
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
  Download
} from 'lucide-react';

export default function ProjectModal({ project, lang, t, onClose, onBookVisit }) {
  if (!project) return null;

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

          {/* Image Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 h-64 sm:h-80 rounded-xl overflow-hidden shadow-inner">
              <img
                src={project.image}
                alt={project.nameEn}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              {project.gallery.slice(1, 3).map((img, idx) => (
                <div key={idx} className="h-30 sm:h-38 rounded-xl overflow-hidden shadow-inner">
                  <img
                    src={img}
                    alt={`${project.nameEn} gallery`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
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
