import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Quote, 
  Camera, 
  X, 
  Share2, 
  CheckCircle2, 
  Sparkles,
  Building2,
  Phone,
  ArrowRight,
  Filter,
  MessageCircle
} from 'lucide-react';
import { eventsData } from '../data/eventsData';

export default function EventsPage({ 
  lang = 'bn', 
  onBack = () => {}, 
  onOpenBookVisit = () => {},
  initialEventId = null
}) {
  const isEn = lang === 'en';
  const [selectedEventId, setSelectedEventId] = useState(() => {
    // Check URL hash for ?id=event-id or /event-id
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      const match = hash.match(/[?&]id=([^&]+)/i);
      if (match && match[1]) return decodeURIComponent(match[1]);
      if (hash.startsWith('#events/')) return hash.replace('#events/', '').split('?')[0];
    }
    return initialEventId;
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const [activePhotoModal, setActivePhotoModal] = useState(null);
  const [copied, setCopied] = useState(false);

  // Sync hash when selectedEventId changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedEventId) {
        window.history.replaceState(null, '', `#events?id=${selectedEventId}`);
      } else {
        window.history.replaceState(null, '', '#events');
      }
    }
  }, [selectedEventId]);

  // Listen to popstate or hashchange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || '';
      const match = hash.match(/[?&]id=([^&]+)/i);
      if (match && match[1]) {
        setSelectedEventId(decodeURIComponent(match[1]));
      } else if (hash.startsWith('#events/')) {
        setSelectedEventId(hash.replace('#events/', '').split('?')[0]);
      } else if (hash === '#events') {
        setSelectedEventId(null);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const currentEvent = eventsData.find(e => e.id === selectedEventId);

  // Dynamic Open Graph / Twitter Meta Tags for Social Media Sharing
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const origin = window.location.origin;

    if (currentEvent) {
      const titleText = `${currentEvent.title[lang]} | Al-Emarah Properties`;
      const descText = currentEvent.tagline[lang] || currentEvent.paragraphs[lang][0];
      const imageUrl = `${origin}${currentEvent.featuredImage || currentEvent.images[0]?.src || '/images/events/al_quds_connect_1.jpg'}`;
      const shareUrl = `${origin}/#events?id=${currentEvent.id}`;

      document.title = titleText;

      const setMeta = (attr, key, content) => {
        let el = document.querySelector(`meta[${attr}="${key}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute(attr, key);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };

      setMeta('property', 'og:title', titleText);
      setMeta('property', 'og:description', descText);
      setMeta('property', 'og:image', imageUrl);
      setMeta('property', 'og:image:secure_url', imageUrl);
      setMeta('property', 'og:image:type', 'image/jpeg');
      setMeta('property', 'og:url', shareUrl);
      setMeta('name', 'twitter:title', titleText);
      setMeta('name', 'twitter:description', descText);
      setMeta('name', 'twitter:image', imageUrl);
    } else {
      document.title = isEn ? 'Corporate Events & Updates | Al-Emarah Properties' : 'কোম্পানি ইভেন্টস ও কার্যক্রম | আল-ইমারাহ প্রোপার্টিজ';
    }
  }, [currentEvent, lang, isEn]);

  const handleShare = async () => {
    if (!currentEvent) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.alemarahproperties.com';
    const shareUrl = `${origin}/#events?id=${currentEvent.id}`;
    const shareTitle = currentEvent.title[lang];
    const shareText = currentEvent.tagline[lang];

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
      } catch (_) {}
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (_) {}
    }
  };

  const handleCopyLink = async () => {
    if (!currentEvent) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.alemarahproperties.com';
    const shareUrl = `${origin}/#events?id=${currentEvent.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {}
  };

  const filteredEvents = activeCategory === 'all' 
    ? eventsData 
    : eventsData.filter(e => e.categorySlug === activeCategory);

  // --------------------------------------------------------------------------
  // VIEW 1: DEDICATED EVENT DETAILS VIEW (When an event is selected)
  // --------------------------------------------------------------------------
  if (currentEvent) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.alemarahproperties.com';
    const shareUrl = `${origin}/#events?id=${currentEvent.id}`;

    return (
      <div className="min-h-screen bg-[#FBFBFB] py-6 sm:py-12 animate-fadeIn select-none">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          {/* Top Bar with Back to Grid button */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setSelectedEventId(null)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isEn ? 'All Events' : 'সকল ইভেন্ট তালিকা'}</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#006231] hover:bg-emerald-50/50 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">{isEn ? 'Link Copied' : 'লিংক কপি হয়েছে'}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-500" />
                    <span>{isEn ? 'Share Event' : 'শেয়ার করুন'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Article Container */}
          <article className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            {/* Article Header Banner */}
            <div className="p-6 sm:p-10 border-b border-slate-100 bg-gradient-to-b from-slate-50/60 to-white space-y-4">
              <div className="flex items-center flex-wrap gap-2 text-2xs sm:text-xs">
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 text-[#006231] font-bold border border-emerald-200">
                  <Users className="w-3.5 h-3.5" />
                  <span>{currentEvent.category[lang]}</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentEvent.date[lang]}</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentEvent.location[lang]}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {currentEvent.title[lang]}
              </h1>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 flex items-start space-x-3">
                <Quote className="w-5 h-5 text-[#006231] shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base font-bold text-[#006231] leading-relaxed">
                  "{currentEvent.tagline[lang]}"
                </p>
              </div>
            </div>

            {/* Photo Gallery Grid */}
            <div className="p-6 sm:p-10 space-y-4 bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-[#006231]" />
                  <span>{isEn ? 'Event Photo Gallery' : 'অনুষ্ঠানের আলোকচিত্র ও বিশেষ মুহূর্ত'}</span>
                </h3>
                <span className="text-3xs text-slate-400 font-medium">
                  {isEn ? 'Click any photo to enlarge' : 'বড় করে দেখতে ছবিতে ক্লিক করুন'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {currentEvent.images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePhotoModal(img)}
                    className="group rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-900 relative">
                      <img
                        src={img.src}
                        alt={img.title[lang]}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1 rounded-full bg-black/60 text-white text-3xs font-bold backdrop-blur-xs flex items-center space-x-1">
                          <Camera className="w-3 h-3" />
                          <span>{isEn ? 'View' : 'দেখুন'}</span>
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-white flex-1 flex flex-col justify-between">
                      <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{img.title[lang]}</h5>
                      <p className="text-3xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{img.caption[lang]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Article Text Body */}
            <div className="p-6 sm:p-10 space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed select-text">
              {currentEvent.paragraphs[lang].map((p, idx) => (
                <p key={idx} className="font-normal text-slate-800 leading-loose">
                  {p}
                </p>
              ))}

              {/* Social Media Share Bar */}
              <div className="pt-6 mt-6 border-t border-slate-100 bg-slate-50/70 p-4 sm:p-6 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                    <Share2 className="w-4 h-4 text-[#006231]" />
                    <span>{isEn ? 'Share this event on social media:' : 'সোশ্যাল মিডিয়ায় এই আয়োজন শেয়ার করুন:'}</span>
                  </span>
                  {copied && (
                    <span className="text-3xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {isEn ? 'Link copied to clipboard!' : 'লিংক ক্লিপবোর্ডে কপি হয়েছে!'}
                    </span>
                  )}
                </div>

                <div className="flex items-center flex-wrap gap-2 pt-1">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${currentEvent.title[lang]}\n\n${shareUrl}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#1877F2] hover:bg-[#0c6be6] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span>Facebook</span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    <span>LinkedIn</span>
                  </a>

                  {/* Copy Link */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isEn ? 'Copy Link' : 'লিংক কপি করুন'}</span>
                  </button>
                </div>
              </div>

              {/* Formal Closing */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-slate-400 font-medium">{currentEvent.closing.signOff[lang]}</div>
                  <div className="text-base font-black text-slate-900">{currentEvent.closing.organization}</div>
                  <div className="text-xs font-semibold text-[#006231] tracking-wide">{currentEvent.closing.motto}</div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={onOpenBookVisit}
                    className="px-5 py-2.5 rounded-xl bg-[#CE2028] hover:bg-[#A9141B] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#CE2028]/25 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                  >
                    <Building2 className="w-4 h-4 inline mr-1.5" />
                    <span>{isEn ? 'Explore Projects' : 'প্রকল্প পরিদর্শন করুন'}</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Lightbox Photo Modal */}
        {activePhotoModal && (
          <div 
            className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setActivePhotoModal(null)}
          >
            <div 
              className="max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-4 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between text-white px-2">
                <h4 className="font-bold text-sm sm:text-base">{activePhotoModal.title[lang]}</h4>
                <button 
                  type="button"
                  onClick={() => setActivePhotoModal(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden max-h-[75vh] flex items-center justify-center bg-black">
                <img 
                  src={activePhotoModal.src} 
                  alt={activePhotoModal.title[lang]} 
                  className="w-full h-auto max-h-[75vh] object-contain"
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 px-2 leading-relaxed">
                {activePhotoModal.caption[lang]}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW 2: EVENTS CATALOG / GRID LIST VIEW (When at #events)
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FBFBFB] py-8 sm:py-14 animate-fadeIn select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#006231] text-xs font-bold uppercase tracking-wider border border-emerald-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#006231]" />
              <span>{isEn ? 'Corporate Events & Updates' : 'কোম্পানি ইভেন্টস ও কার্যক্রম'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              <span>{isEn ? 'Al-Emarah' : 'আল-ইমারাহ'} </span>
              <span className="text-[#006231]">
                {isEn ? 'Events & Media' : 'ইভেন্টস ও মিডিয়া গ্যালারি'}
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
              {isEn
                ? 'Explore our seminars, foundation ceremonies, investor meetups, and key milestones building ethical housing.'
                : 'সম্মানিত অংশীদার ও গ্রাহকদের উপস্থিতিতে আমাদের নিয়মিত মতবিনিময় সভা, সেমিনার ও প্রকল্প অগ্রগতির সচিত্র বিবরণ।'}
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer self-start md:self-end active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Back to Home' : 'হোমপেজে ফিরে যান'}</span>
          </button>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {isEn ? 'All Events' : 'সকল আয়োজন'} ({eventsData.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('meetup')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'meetup'
                ? 'bg-[#006231] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {isEn ? 'Investor Meetups' : 'গ্রাহক ও বিনিয়োগকারী সম্মেলন'}
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('project')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'project'
                ? 'bg-[#006231] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {isEn ? 'Project Seminars' : 'প্রকল্প সম্মেলন ও অগ্রগতি'}
          </button>
        </div>

        {/* Events Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => setSelectedEventId(evt.id)}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Image Cover */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={evt.featuredImage || evt.images[0].src}
                    alt={evt.title[lang]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-4 sm:p-5 text-white">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-3xs font-black uppercase tracking-wider shadow-xs">
                        <Users className="w-3 h-3" />
                        <span>{evt.category[lang]}</span>
                      </span>

                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-3xs font-bold border border-white/20">
                        <Camera className="w-3 h-3" />
                        <span>{evt.images.length} {isEn ? 'Photos' : 'টি ছবি'}</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-3 text-3xs text-slate-200 font-semibold">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          <span>{evt.date[lang]}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          <span>{evt.location[lang]}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 group-hover:text-[#006231] transition-colors leading-snug">
                    {evt.title[lang]}
                  </h3>

                  <p className="text-xs sm:text-sm font-semibold text-[#006231] line-clamp-1">
                    "{evt.tagline[lang]}"
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {evt.paragraphs[lang][0]}
                  </p>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-3xs text-slate-400 font-bold uppercase tracking-wider">
                  Al-Emarah Properties
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEventId(evt.id);
                  }}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 group-hover:bg-[#006231] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <span>{isEn ? 'View Details' : 'বিস্তারিত বিবরণ'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Initiatives Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl border border-white/10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-3xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{isEn ? 'Continuous Engagement' : 'পরবর্তী আয়োজন'}</span>
            </div>
            <h4 className="text-base sm:text-xl font-black text-white">
              {isEn ? 'Upcoming Foundation Ceremonies & Project Updates' : 'আসন্ন ভিত্তিপ্রস্তর স্থাপন ও প্রকল্প অগ্রগতি সম্মেলন'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isEn
                ? 'We regularly host open discussions, on-site briefings, and interactive forums ensuring complete transparency for all partners.'
                : 'প্রতিটি নতুন প্রজেক্টের সূচনা ও অগ্রগতির সচিত্র তথ্য নিয়ে নিয়মিত অনুষ্ঠান ও মতবিনিময় সভার আয়োজন করা হবে।'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenBookVisit}
            className="px-6 py-3 rounded-xl bg-[#006231] hover:bg-[#004d26] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#006231]/30 transition-all flex items-center space-x-2 shrink-0 cursor-pointer active:scale-95"
          >
            <Building2 className="w-4 h-4" />
            <span>{isEn ? 'Book Site Visit' : 'সাইট ভিজিট বুক করুন'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
