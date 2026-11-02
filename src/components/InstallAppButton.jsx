import React, { useState, useEffect } from 'react';
import { Download, X, Share, SquarePlus, Menu } from 'lucide-react';

const isIOSDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const iOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  // iPadOS 13+ reports as "MacIntel" but has touch support, unlike a real Mac.
  const iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return iOS || iPadOS;
};

const isStandaloneDisplay = () =>
  (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
  window.navigator.standalone === true;

// A persistent "Install App" button that works everywhere a browser-triggered
// download/install can silently fail to appear:
// - Android/Chrome/Edge: uses the captured beforeinstallprompt event.
// - iPhone/iPad (Safari never fires beforeinstallprompt): shows manual
//   "Share -> Add to Home Screen" steps instead.
// - Any other browser/desktop where the native prompt hasn't fired yet:
//   shows a generic manual fallback instead of doing nothing.
export default function InstallAppButton({ lang = 'bn', className = '', compact = false }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [installed, setInstalled] = useState(() => isStandaloneDisplay());
  const isEn = lang === 'en';
  const isIOS = isIOSDevice();

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (installed) return null;

  const handleClick = async () => {
    if (!isIOS && deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice?.outcome === 'accepted') setInstalled(true);
      } catch (_) {}
      setDeferredPrompt(null);
      return;
    }
    // iOS, or a browser that hasn't (yet) fired beforeinstallprompt.
    setShowGuide(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={className || 'inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#006231]/10 hover:bg-[#006231]/15 text-[#006231] text-xs font-bold transition-colors cursor-pointer border border-[#006231]/20'}
        title={isEn ? 'Install App' : 'অ্যাপ ইনস্টল করুন'}
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        {!compact && <span className="hidden sm:inline">{isEn ? 'Install App' : 'অ্যাপ ইনস্টল করুন'}</span>}
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-[300] bg-black/60 flex items-end sm:items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base">
                {isIOS
                  ? (isEn ? 'Install on iPhone / iPad' : 'আইফোন / আইপ্যাডে ইনস্টল করুন')
                  : (isEn ? 'Install the App' : 'অ্যাপ ইনস্টল করুন')}
              </h3>
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
