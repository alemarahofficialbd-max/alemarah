import React, { useState, useEffect } from 'react';
import { Download, X, Share, SquarePlus, Menu, Sparkles } from 'lucide-react';

const isIOSDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const iOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return iOS || iPadOS;
};

const isStandaloneDisplay = () =>
  (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
  window.navigator.standalone === true;

export default function InstallAppNotification({ lang = 'bn' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [installed, setInstalled] = useState(() => isStandaloneDisplay());
  const isEn = lang === 'en';
  const isIOS = isIOSDevice();

  useEffect(() => {
    if (installed) return;

    // Check if dismissed in this session
    try {
      if (sessionStorage.getItem('alemarah_install_dismissed') === 'true') {
        return;
      }
    } catch (_) {}

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowNotification(true);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setShowNotification(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);

    // Show popup notification smoothly after a short delay (2.5s)
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 2500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, [installed]);

  if (installed || !showNotification) return null;

  const handleDismiss = () => {
    setShowNotification(false);
    try {
      sessionStorage.setItem('alemarah_install_dismissed', 'true');
    } catch (_) {}
  };

  const handleInstallClick = async () => {
    if (!isIOS && deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice?.outcome === 'accepted') {
          setInstalled(true);
          setShowNotification(false);
        }
      } catch (_) {}
      setDeferredPrompt(null);
      return;
    }
    // iOS or browser without prompt: show step-by-step guide
    setShowGuide(true);
  };

  return (
    <>
      {/* Floating Notification / Popup Banner */}
      <div 
        role="alert"
        aria-live="polite"
        className="fixed bottom-20 sm:bottom-6 right-3 left-3 sm:left-auto sm:right-6 z-[95] max-w-sm sm:max-w-md bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-2xl sm:rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] p-3.5 sm:p-4 select-none animate-fadeIn"
      >
        <div className="flex items-start space-x-3">
          {/* Official Al-Emarah Logo Mark with pulse ring */}
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center shadow-md shadow-emerald-950/10 border border-slate-200/80 p-1.5 overflow-hidden">
              <img src="/alemarah_favicon.svg" alt="Al-Emarah Logo" className="w-full h-full object-contain" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#006231]"></span>
            </span>
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1 pr-6">
            <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#006231] text-3xs font-black tracking-wide border border-emerald-200/60 mb-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{isEn ? 'Official App' : 'অফিশিয়াল অ্যাপ'}</span>
            </div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
              {isEn ? 'Install Al-Emarah App' : 'আল-ইমারাহ অ্যাপ ইনস্টল করুন'}
            </h4>
            <p className="text-3xs sm:text-2xs text-slate-500 mt-0.5 leading-relaxed">
              {isEn
                ? 'Fast browsing, instant updates, and offline access directly from your phone.'
                : 'সহজ ব্রাউজিং ও হোম স্ক্রিন থেকে দ্রুত ব্যবহারের জন্য অ্যাপটি ইনস্টল করে নিন।'}
            </p>

            {/* Actions */}
            <div className="mt-2.5 flex items-center space-x-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#006231] to-[#004724] hover:from-[#004724] hover:to-[#003318] text-white font-bold text-xs shadow-md shadow-[#006231]/25 flex items-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isEn ? 'Install' : 'ইনস্টল করুন'}</span>
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                {isEn ? 'Later' : 'পরে'}
              </button>
            </div>
          </div>

          {/* Top-right close X */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close"
            className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guide Modal for iOS or manual install */}
      {showGuide && (
        <div
          className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
                  <img src="/alemarah_favicon.svg" alt="Al-Emarah" className="w-full h-full object-contain" />
                </div>
                <h3 className="font-black text-slate-900 text-base">
                  {isIOS
                    ? (isEn ? 'Install on iPhone / iPad' : 'আইফোন / আইপ্যাডে ইনস্টল করুন')
                    : (isEn ? 'Install the App' : 'অ্যাপ ইনস্টল করুন')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {isIOS ? (
              <ol className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start space-x-2.5">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#006231] text-white text-3xs font-bold flex items-center justify-center mt-0.5">১</span>
                  <span className="flex items-center flex-wrap gap-1">
                    {isEn ? 'Tap the' : 'Safari-এর নিচের'}
                    <Share className="w-4 h-4 inline text-[#006231]" />
                    {isEn ? 'Share button at the bottom of Safari.' : 'Share বাটনে ট্যাপ করুন।'}
                  </span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#006231] text-white text-3xs font-bold flex items-center justify-center mt-0.5">২</span>
                  <span className="flex items-center flex-wrap gap-1">
                    {isEn ? 'Scroll down and choose' : 'নিচে স্ক্রল করে বেছে নিন'}
                    <SquarePlus className="w-4 h-4 inline text-[#006231]" />
                    <strong>{isEn ? '"Add to Home Screen"' : '"Add to Home Screen" (হোম স্ক্রিনে যোগ করুন)'}</strong>
                  </span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#006231] text-white text-3xs font-bold flex items-center justify-center mt-0.5">৩</span>
                  <span>{isEn ? 'Tap "Add" at the top right — done!' : 'উপরে ডানদিকে "Add" ট্যাপ করুন — হয়ে গেলো!'}</span>
                </li>
              </ol>
            ) : (
              <ol className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start space-x-2.5">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#006231] text-white text-3xs font-bold flex items-center justify-center mt-0.5">১</span>
                  <span className="flex items-center flex-wrap gap-1">
                    {isEn ? 'Open your browser menu' : 'ব্রাউজারের মেনু'}
                    <Menu className="w-4 h-4 inline text-[#006231]" />
                    {isEn ? '(top right, three dots).' : '(উপরে ডানদিকের তিন-ডট আইকন) খুলুন।'}
                  </span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#006231] text-white text-3xs font-bold flex items-center justify-center mt-0.5">২</span>
                  <span>
                    {isEn
                      ? <>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</>
                      : <>"Install app" অথবা "Add to Home screen" অপশনে ট্যাপ করুন।</>}
                  </span>
                </li>
              </ol>
            )}

            <p className="text-3xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
              {isEn
                ? 'Once installed, the app opens full-screen from your home screen — no browser address bar, works like a native app.'
                : 'ইনস্টল হয়ে গেলে হোম স্ক্রিন থেকেই পূর্ণ স্ক্রিনে অ্যাপ খুলবে — ব্রাউজারের অ্যাড্রেস বার থাকবে না, একদম নেটিভ অ্যাপের মতো।'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
