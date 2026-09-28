import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Laptop, 
  Apple, 
  CheckCircle2, 
  Share2, 
  PlusSquare, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function InstallAppModal({ isOpen, onClose, lang = 'bn', installPromptEvent }) {
  const [deviceType, setDeviceType] = useState('desktop'); // 'ios', 'android', 'desktop'

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      setDeviceType('ios');
    } else if (/android/i.test(ua)) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      const { outcome } = await installPromptEvent.userChoice;
      if (outcome === 'accepted') {
        onClose();
      }
    }
  };

  const isBn = lang === 'bn';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#1C1819] via-[#2A2223] to-[#1C1819] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-2 shadow-md flex items-center justify-center">
              <img 
                src="/alemarah_favicon.svg" 
                alt="Al-Emarah App" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-[#8EBF40] uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isBn ? 'অফিসিয়াল ওয়েব অ্যাপ' : 'Official Web App'}</span>
              </span>
              <h3 className="text-xl font-black text-white">
                {isBn ? 'আল-ইমারাহ অ্যাপ ডাউনলোড' : 'Install Al-Emarah App'}
              </h3>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-300">
            {isBn 
              ? 'মোবাইল, ট্যাবলেট বা পিসিতে ইনস্টল করে ব্রাউজার ছাড়াই সরাসরি দ্রুত ব্যবহার করুন।' 
              : 'Install on your Phone, Tablet, or PC for lightning-fast direct access.'}
          </p>
        </div>

        {/* Device selector tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/80 px-4 pt-3 gap-2">
          <button
            onClick={() => setDeviceType('android')}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              deviceType === 'android'
                ? 'bg-white text-[#006231] border-t-2 border-[#006231] shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android / ফোন</span>
          </button>

          <button
            onClick={() => setDeviceType('ios')}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              deviceType === 'ios'
                ? 'bg-white text-[#CE2028] border-t-2 border-[#CE2028] shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>iPhone / iPad / Apple</span>
          </button>

          <button
            onClick={() => setDeviceType('desktop')}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              deviceType === 'desktop'
                ? 'bg-white text-gray-900 border-t-2 border-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>PC / Windows / Mac</span>
          </button>
        </div>

        {/* Content body based on device */}
        <div className="p-6 space-y-4">
          {/* Native Install Prompt Button if available */}
          {installPromptEvent && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-[#006231]">
                  {isBn ? 'এক ক্লিকেই ইনস্টল করুন!' : '1-Click Direct Install!'}
                </h4>
                <p className="text-xs text-gray-600">
                  {isBn ? 'সরাসরি আপনার ডিভাইসে অ্যাপ হিসেবে সেভ করুন।' : 'Directly add the app to your home screen or desktop.'}
                </p>
              </div>
              <button
                onClick={handleNativeInstall}
                className="px-4 py-2.5 rounded-xl bg-[#006231] hover:bg-[#004724] text-white text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95 whitespace-nowrap"
              >
                {isBn ? 'ইনস্টল করুন' : 'Install Now'}
              </button>
            </div>
          )}

          {/* Android instructions */}
          {deviceType === 'android' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-[#006231]" />
                <span>{isBn ? 'Android ফোন ও ট্যাবলেটে ইনস্টল করার নিয়ম:' : 'How to install on Android:'}</span>
              </h4>
              <ol className="space-y-2.5 text-xs text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#006231] text-white flex items-center justify-center font-bold text-2xs shrink-0 mt-0.5">১</span>
                  <span>{isBn ? 'Chrome ব্রাউজারের উপরে ডানদিকের তিনটি ডট (⋮) মেনুতে চাপুন।' : 'Tap the three dots (⋮) menu in Chrome.'}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#006231] text-white flex items-center justify-center font-bold text-2xs shrink-0 mt-0.5">২</span>
                  <span>{isBn ? 'তালিকায় "Install app" অথবা "Add to Home screen" নির্বাচন করুন।' : 'Select "Install app" or "Add to Home screen".'}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#006231] text-white flex items-center justify-center font-bold text-2xs shrink-0 mt-0.5">৩</span>
                  <span>{isBn ? '"Install" চাপুন। অ্যাপটি সরাসরি আপনার ফোনে অ্যাপ হিসেবে ইনস্টল হয়ে যাবে।' : 'Tap "Install". The app will appear on your phone screen.'}</span>
                </li>
              </ol>
            </div>
          )}

          {/* iOS / Apple instructions */}
          {deviceType === 'ios' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <Apple className="w-4 h-4 text-[#CE2028]" />
                <span>{isBn ? 'iPhone / iPad (Apple) ডিভাইসে ইনস্টল করার নিয়ম:' : 'How to install on iPhone & iPad:'}</span>
              </h4>
              <ol className="space-y-2.5 text-xs text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#CE2028] text-white flex items-center justify-center font-bold text-2xs shrink-0 mt-0.5">১</span>
                  <span>
                    {isBn ? 'Safari ব্রাউজারের নিচে শেয়ার বোতামে ' : 'In Safari, tap the Share button '}
                    <Share2 className="w-3.5 h-3.5 inline text-blue-600 mx-1" />
                    {isBn ? 'চাপুন।' : '.'}
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#CE2028] text-white flex items-center justify-center font-bold text-2xs shrink-0 mt-0.5">২</span>
                  <span>
                    {isBn ? 'মেনুটি একটু স্ক্রোল করে ' : 'Scroll down and tap '}
                    <strong className="text-gray-900">"Add to Home Screen"</strong>
                    <PlusSquare className="w-3.5 h-3.5 inline text-gray-700 mx-1" />
                    {isBn ? 'নির্বাচন করুন।' : '.'}
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#CE2028] text-white flex items-center justify-center font-bold text-2xs shrink-0 mt-0.5">৩</span>
                  <span>{isBn ? 'উপরে ডানপাশে "Add" বোতামে চাপুন। আপনার হোম স্ক্রিনে আল-ইমারাহ অ্যাপ যুক্ত হবে।' : 'Tap "Add" in the top-right corner to complete installation.'}</span>
                </li>
              </ol>
            </div>
          )}

          {/* Desktop instructions */}
          {deviceType === 'desktop' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <Laptop className="w-4 h-4 text-gray-900" />
                <span>{isBn ? 'PC / ল্যাপটপ (Windows / Mac) এ ইনস্টল করার নিয়ম:' : 'How to install on PC & Laptop:'}</span>
              </h4>
              <ol className="space-y-2.5 text-xs text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-2xs shrink-0 mt-0.5">১</span>
                  <span>{isBn ? 'ব্রাউজারের (Chrome/Edge) অ্যাড্রেস বারের ডানপাশে ইনস্টল আইকনটিতে (কম্পিউটার বা ডাউনলোড চিহ্ন) চাপুন।' : 'Look for the Install icon in your browser address bar on the right.'}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-2xs shrink-0 mt-0.5">২</span>
                  <span>{isBn ? '"Install" চাপলেই এটি ডেক্সটপ বা টাস্কবারে স্বতন্ত্র অ্যাপ হিসেবে সেভ হবে।' : 'Click "Install" to create a desktop and taskbar shortcut.'}</span>
                </li>
              </ol>
            </div>
          )}

          {/* Features badge */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-2xs text-gray-600">
            <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-gray-50">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8EBF40]" />
              <span>{isBn ? 'অতি দ্রুত লোডিং গতি' : 'Ultra-fast loading speed'}</span>
            </div>
            <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-gray-50">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8EBF40]" />
              <span>{isBn ? 'স্বতন্ত্র ফুল-স্ক্রিন ভিউ' : 'Dedicated full-screen view'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-2xs text-gray-400">
            Al-Emarah Properties Limited PWA v1.0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold cursor-pointer transition-colors"
          >
            {isBn ? 'বুঝেছি / বন্ধ করুন' : 'Got it / Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
