import React, { useState, useRef } from 'react';
import { 
  Building2,
  Lock, 
  User, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  FileText, 
  Phone, 
  HardHat, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Camera, 
  Home, 
  Check,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Copy,
  Printer,
  Calendar,
  X,
  Settings,
  HelpCircle
} from 'lucide-react';
import { formatBDT, getManagementData, updateStore } from '../data/managementStore';

export default function ClientDashboard({ 
  client: propClient, 
  lang = 'bn', 
  t, 
  onLogout, 
  onNavigateHome 
}) {
  const [activeTab, setActiveTabState] = useState(() => {
    try {
      return localStorage.getItem('alemarah_client_tab') || 'details';
    } catch {
      return 'details';
    }
  });

  const setActiveTab = (tabId) => {
    setActiveTabState(tabId);
    try {
      localStorage.setItem('alemarah_client_tab', tabId);
    } catch {}
  };
  
  // Load management data to ensure sync with admin updates
  const mgtData = getManagementData();
  const client = propClient
    ? (mgtData.clients.find(c => c.id === propClient.id || (c.phone && propClient.phone && c.phone.replace(/[^0-9]/g, '') === propClient.phone.replace(/[^0-9]/g, ''))) || propClient)
    : null;
  const project = client ? (mgtData.projects.find(p => p.id === client.projectId) || null) : null;

  // Selected receipt modal
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Profile Photo state stored in localStorage
  const [avatarImage, setAvatarImage] = useState(() => {
    try {
      return localStorage.getItem(`alemarah_avatar_${client?.id}`) || null;
    } catch {
      return null;
    }
  });

  const avatarInputRef = useRef(null);

  const totalDue = (client?.totalPrice || 0) - (client?.totalPaid || 0);
  const paidPercent = client?.totalPrice ? Math.round((client.totalPaid / client.totalPrice) * 100) : 0;

  // Handle Avatar file upload with canvas downscaling (preventing localStorage QuotaExceededError)
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('ছবির সাইজ সর্বোচ্চ ৮ মেগাবাইট হতে হবে।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 180;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setAvatarImage(compressedDataUrl);
        try {
          localStorage.setItem(`alemarah_avatar_${client?.id}`, compressedDataUrl);
        } catch (err) {
          console.error('Error storing avatar in localStorage:', err);
        }
        if (client?.id) {
          updateStore((prev) => ({
            ...prev,
            clients: prev.clients.map(c => c.id === client.id ? { ...c, image: compressedDataUrl } : c)
          }));
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const copyBankInfo = () => {
    navigator.clipboard?.writeText('1501204893001');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // The 5 Main Options for Software Sidebar and Mobile Navbar
  const clientNavItems = [
    { id: 'details', label: 'কাস্টমার ও ফ্ল্যাট তথ্য', shortLabel: 'তথ্য', icon: User },
    { id: 'payments', label: 'কিস্তির হিসাব', shortLabel: 'কিস্তি', icon: CreditCard },
    { id: 'progress', label: 'কাজের অগ্রগতি', shortLabel: 'অগ্রগতি', icon: HardHat },
    { id: 'history', label: 'জমার হিস্ট্রি', shortLabel: 'হিস্ট্রি', icon: FileText },
    { id: 'profile', label: 'প্রোফাইল ও সেটিংস', shortLabel: 'প্রোফাইল', icon: Settings }
  ];

  if (!client) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">লগইন প্রয়োজন</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            আপনার ক্লায়েন্ট ড্যাশবোর্ড ও কিস্তির হিসাব দেখতে অনুগ্রহ করে সঠিক কাস্টমার আইডি অথবা মোবাইল নম্বর দিয়ে লগইন করুন।
          </p>
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-xl bg-[#006231] text-white font-bold text-sm hover:opacity-95 transition-all cursor-pointer shadow-md shadow-[#006231]/20"
          >
            লগইন পেজে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col md:flex-row font-sans animate-fadeIn">
      {/* Hidden File Input for Profile Avatar */}
      <input 
        ref={avatarInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleAvatarChange}
      />

      {/* ========================================================= */}
      {/* 1. WEB VIEW: LEFT SIDEBAR NAVIGATION (SOFTWARE / ERP STYLE)*/}
      {/* ========================================================= */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200/80 h-screen sticky top-0 shrink-0 z-30 justify-between p-5 select-none">
        
        {/* Top: Logo & Client Mini Card */}
        <div className="space-y-6">
          {/* Logo & Software Tag */}
          <div>
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-2 group cursor-pointer text-left"
              title="ওয়েবসাইটে ফিরে যান"
            >
              <img 
                src="/alemarah_logo_header.svg" 
                alt="Al-Emarah Properties" 
                className="h-9 w-auto object-contain"
              />
            </button>
            <div className="mt-2.5 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[#006231] text-3xs font-bold border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>গ্রাহক পোর্টাল সফটওয়্যার</span>
            </div>
          </div>

          {/* Client Mini Profile Card in Sidebar */}
          <div 
            onClick={() => setActiveTab('profile')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/70 transition-all cursor-pointer flex items-center space-x-3 group"
            title="প্রোফাইল দেখতে ক্লিক করুন"
          >
            <div className="relative shrink-0">
              {avatarImage ? (
                <img 
                  src={avatarImage} 
                  alt={client?.name} 
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500 shadow-2xs" 
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-black text-sm shadow-2xs">
                  {client?.name ? client.name.slice(0, 2) : 'গ্রা'}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-slate-900 truncate group-hover:text-[#CE2028] transition-colors">
                {client?.name}
              </div>
              <div className="text-3xs text-slate-400 font-semibold truncate">
                আইডি: {client?.id}
              </div>
              <div className="text-3xs text-[#006231] font-bold truncate">
                {client?.flatNo}
              </div>
            </div>
          </div>

          {/* Sidebar Navigation Menu (All 5 Options on the Left) */}
          <nav className="space-y-1.5 pt-1">
            <div className="text-3xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              নেভিগেশন মেনু
            </div>
            {clientNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all text-xs font-bold cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#CE2028] to-[#B91C1C] text-white shadow-md shadow-[#CE2028]/25 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Actions */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <a
            href="tel:01816233013"
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-2xs font-semibold transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#006231]" />
            <span className="font-bold tracking-wide">হেল্পলাইন: ০১৮১৬-২৩৩০১৩</span>
          </a>

          <button
            onClick={onNavigateHome}
            className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#CE2028]" />
            <span>ওয়েবসাইটে ফিরে যান</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-[#CE2028] text-[#CE2028] hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE / CONTENT AREA (RIGHT SIDE IN WEB VIEW)  */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-28 md:pb-10">
        
        {/* Mobile-Only Top App Bar: ULTRA-CLEAN with ONLY the Logo (Cleaned per user request) */}
        <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs py-2.5 px-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onNavigateHome}
              className="flex items-center cursor-pointer text-left transition-transform active:scale-95"
              title="ওয়েবসাইটে ফিরে যান"
            >
              <img 
                src="/alemarah_logo_header.svg" 
                alt="Al-Emarah Properties" 
                className="h-8 w-auto object-contain"
              />
            </button>
          </div>
        </header>

        {/* Desktop-Only Subtle Top Bar (Breadcrumb & Live Project Tag) */}
        <header className="hidden md:flex items-center justify-between px-6 lg:px-8 py-4 bg-white/60 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20">
          <div>
            <h1 className="text-base font-black text-slate-900">
              {clientNavItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-2xs text-slate-500">
              বরাদ্দকৃত সম্পত্তি: <strong className="text-slate-800">{client?.projectName} ({client?.flatNo})</strong>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#006231] text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8EBF40]" />
              <span>নিবন্ধিত সক্রিয় অ্যাকাউন্ট</span>
            </div>
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Home className="w-3.5 h-3.5 text-[#8EBF40]" />
              <span>ওয়েবসাইট</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab Workspace */}
        <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-5 space-y-6 flex-1">

          {/* ------------------------------------------------------- */}
          {/* TAB 1: কাস্টমার ও ফ্ল্যাট তথ্য (DETAILS)                  */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'details' && (
            <div className="space-y-5 animate-fadeIn">
              {/* VIP Customer Profile Banner Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#0F172A] text-white p-6 sm:p-7 shadow-xl border border-slate-700/50">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 rounded-full bg-[#006231]/30 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-60 h-60 rounded-full bg-[#CE2028]/20 blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  {/* Profile Avatar */}
                  <div 
                    className="relative cursor-pointer shrink-0 group"
                    onClick={() => avatarInputRef.current?.click()}
                    title="ছবি আপলোড করতে ক্লিক করুন"
                  >
                    {avatarImage ? (
                      <img 
                        src={avatarImage} 
                        alt={client?.name} 
                        className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover ring-4 ring-emerald-500 shadow-2xl transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-black text-2xl shadow-xl ring-4 ring-emerald-400">
                        {client?.name ? client.name.slice(0, 2) : 'গ্রা'}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#111827]"></span>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-white/10 text-2xs font-bold text-[#8EBF40] border border-white/10">
                      <Sparkles className="w-3 h-3 text-[#8EBF40]" />
                      <span>নিবন্ধিত প্রিমিয়াম ক্লায়েন্ট</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      {client?.name}
                    </h2>
                    <p className="text-xs text-slate-300 font-medium">
                      মোবাইল: <strong className="text-white font-mono">{client?.phone}</strong> • আইডি: <span className="font-mono text-emerald-400 font-bold">{client?.id}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Flat & Property Details Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-[#CE2028] flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">বরাদ্দকৃত অ্যাপার্টমেন্ট বিবরণ</h3>
                      <p className="text-2xs text-slate-500">আপনার ক্রয়কৃত সম্পত্তির মূল তথ্যাদি</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#006231] font-bold text-2xs border border-emerald-200">
                    অনুমোদিত চুক্তি
                  </span>
                </div>

                {/* Specification Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="text-3xs font-bold text-slate-400 uppercase tracking-wider">প্রকল্পের নাম</div>
                    <div className="text-base font-black text-slate-900">{client?.projectName}</div>
                    <div className="text-xs text-slate-500 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-[#CE2028] shrink-0" />
                      <span>{project?.location}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-1">
                    <div className="text-3xs font-bold text-[#006231] uppercase tracking-wider">ফ্ল্যাট নম্বর ও আয়তন</div>
                    <div className="text-base font-black text-[#006231]">{client?.flatNo}</div>
                    <div className="text-xs text-emerald-700 font-semibold">আবাসিক ইউনিট • ১ম শ্রেণি নির্মাণ</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="text-3xs font-bold text-slate-400 uppercase tracking-wider">মোট চুক্তিভিত্তিক মূল্য</div>
                    <div className="text-base font-black text-slate-900">{formatBDT(client?.totalPrice)}</div>
                    <div className="text-xs text-slate-500">শতভাগ নিষ্কণ্টক রেজিস্ট্রেশন চুক্তি</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="text-3xs font-bold text-slate-400 uppercase tracking-wider">সম্ভাব্য ফ্ল্যাট হস্তান্তর</div>
                    <div className="text-base font-black text-slate-900">জুন ২০২৭ ইং</div>
                    <div className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>নির্ধারিত সময়সূচি অনুযায়ী চলমান</span>
                    </div>
                  </div>
                </div>

                {/* Apartment Features Chips */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-2xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    ফ্ল্যাটের অভ্যন্তরীণ সুযোগ-সুবিধা:
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold">৩টি বেডরুম</span>
                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold">৩টি বাথরুম</span>
                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold">২টি প্রশস্ত বারান্দা</span>
                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold">দক্ষিণমুখী আলো-বাতাস</span>
                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold">১টি সংরক্ষিত কার পার্কিং</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 2: কিস্তির হিসাব (PAYMENTS / FINANCIAL CARD)          */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'payments' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Fintech Digital Wallet Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A4D27] text-white shadow-xl relative overflow-hidden space-y-5 border border-slate-700/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 backdrop-blur-md">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xs font-bold uppercase tracking-wider text-slate-400">কিস্তির হিসাব লেজার</div>
                      <div className="text-xs font-semibold text-slate-200">{client?.projectName}</div>
                    </div>
                  </div>
                  <span className="text-2xs font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {paidPercent}% পরিশোধিত
                  </span>
                </div>

                {/* Big Financial Numbers */}
                <div className="space-y-1 pt-1">
                  <div className="text-xs font-bold text-slate-400 uppercase">এ পর্যন্ত পরিশোধিত মোট টাকা</div>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                    {formatBDT(client?.totalPaid)}
                  </div>
                  <div className="text-xs text-slate-300">
                    মোট চুক্তি মূল্য: <strong className="text-white font-mono">{formatBDT(client?.totalPrice)}</strong>
                  </div>
                </div>

                {/* Dynamic Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-2xs font-bold text-slate-300">
                    <span>পরিশোধ অগ্রগতি</span>
                    <span>বকেয়া: {formatBDT(totalDue)}</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 via-[#8EBF40] to-emerald-400 rounded-full transition-all duration-1000 shadow-sm"
                      style={{ width: `${paidPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Next Installment Due Alert Banner */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#CE2028] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xs font-bold text-[#CE2028] uppercase tracking-wider">পরবর্তী কিস্তির সময়সীমা</div>
                    <div className="text-base font-black text-slate-900">{client?.nextDueDate || 'নির্ধারিত হয়নি'}</div>
                    <div className="text-xs text-slate-600">নির্ধারিত তারিখে জমা দিয়ে রসিদ নিশ্চিত করুন</div>
                  </div>
                </div>
                <div className="sm:text-right bg-white sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-red-100">
                  <div className="text-3xs text-slate-400 font-bold uppercase">প্রদেয় টাকার পরিমাণ</div>
                  <div className="text-xl font-black text-[#CE2028]">{formatBDT(client?.nextDueAmount || 0)}</div>
                </div>
              </div>

              {/* Bank Payment Details Box (With One-Click Copy) */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-[#006231]" />
                    <span>ব্যাংক ডিপোজিট ও কিস্তি জমাদানের বিবরণ</span>
                  </h3>
                  <p className="text-2xs text-slate-500 mt-0.5">নিচের ব্যাংক হিসাবে সরাসরি চেক, ক্যাশ বা ট্রান্সফার করতে পারেন</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="text-3xs text-slate-400 font-bold uppercase">ব্যাংকের নাম</div>
                    <div className="font-bold text-slate-900">সিটি ব্যাংক পিএলসি / ইসলামী ব্যাংক</div>
                    <div className="text-2xs text-slate-500">প্রিন্সিপাল শাখা, মতিঝিল, ঢাকা</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="text-3xs text-slate-400 font-bold uppercase">একাউন্টের নাম</div>
                    <div className="font-bold text-slate-900">Al-Emarah Properties Ltd.</div>
                    <div className="text-2xs text-slate-500">কারেন্ট / কর্পোরেট অ্যাকাউন্ট</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-1 sm:col-span-2 flex items-center justify-between">
                    <div>
                      <div className="text-3xs text-[#006231] font-bold uppercase">হিসাব নম্বর (Account Number)</div>
                      <div className="text-base font-black font-mono text-[#006231]">1501204893001</div>
                      <div className="text-2xs text-emerald-700">রাউটিং নং: ২২৫২৭০৩৪০</div>
                    </div>
                    <button
                      onClick={copyBankInfo}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-100 text-[#006231] font-bold text-xs border border-emerald-200 shadow-2xs flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedAccount ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 3: কাজের অগ্রগতি (PROGRESS TRACKER)                  */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'progress' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Project Overall Status Header */}
              <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="text-2xs font-bold text-[#CE2028] uppercase tracking-wider flex items-center space-x-1.5">
                      <HardHat className="w-3.5 h-3.5" />
                      <span>প্রকল্প নির্মাণকাজ ট্র্যাকার</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      {project?.name || client?.projectName}
                    </h3>
                    <p className="text-xs text-slate-500">{project?.location}</p>
                  </div>
                  <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-emerald-50 text-[#006231] font-bold text-xs border border-emerald-200 self-start sm:self-auto">
                    <span>সার্বিক অগ্রগতি:</span>
                    <strong className="text-base font-black">{project?.progress || 68}% সম্পন্ন</strong>
                  </div>
                </div>

                {/* Stage description & Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>বর্তমান স্টেজ: <strong className="text-slate-900">{project?.currentStage}</strong></span>
                    <span className="text-[#006231] font-black">{project?.progress || 68}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div 
                      className="h-full bg-gradient-to-r from-[#006231] via-[#8EBF40] to-[#006231] rounded-full transition-all duration-1000 shadow-xs"
                      style={{ width: `${project?.progress || 68}%` }}
                    ></div>
                  </div>
                </div>

                {/* Construction Milestone Stepper */}
                <div className="pt-2 space-y-3">
                  <div className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
                    নির্মাণ পর্যায়ভিত্তিক মাইলস্টোন:
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#006231]" />
                        <span className="font-bold text-slate-800">১. সয়েল টেস্ট, পাইলিং ও ডিপ বেসমেন্ট</span>
                      </div>
                      <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#006231]">সম্পন্ন</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#006231]" />
                        <span className="font-bold text-slate-800">২. ১ম থেকে ৫ম তলা আরসিসি ফ্রেম স্ট্রাকচার</span>
                      </div>
                      <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#006231]">সম্পন্ন</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-3xs font-black animate-pulse">●</span>
                        <span className="font-bold text-amber-900">৩. {project?.currentStage}</span>
                      </div>
                      <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">বর্তমানে চলমান</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs opacity-75">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-4 h-4 rounded-full bg-slate-300 text-white flex items-center justify-center text-3xs">৪</span>
                        <span className="font-medium text-slate-600">৪. অভ্যন্তরীণ প্লাস্টার, টাইলস ও পেইন্টিং</span>
                      </div>
                      <span className="text-3xs font-medium text-slate-400">পরবর্তী ধাপ</span>
                    </div>
                  </div>
                </div>

                {/* Direct Site Engineer Connect */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <HardHat className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">সাইট ইনচার্জ: প্রকৌশলী মহিউদ্দিন আহমেদ</div>
                      <div className="text-slate-500">মোবাইল: ০১৯১৮-৬৪৬৫৭৫ (সকাল ৯টা - সন্ধ্যা ৬টা)</div>
                    </div>
                  </div>
                  <a 
                    href="tel:01918646575"
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs text-center transition-colors shadow-2xs cursor-pointer"
                  >
                    সাইটে কল দিন
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 4: জমার হিস্ট্রি (RECEIPTS / FINANCIAL LEDGER)         */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'history' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Header Summary */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-2xs font-bold text-[#006231] uppercase tracking-wider flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>জমার অফিসিয়াল হিস্ট্রি</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                    পরিশোধিত কিস্তিসমূহের রসিদ
                  </h3>
                  <p className="text-xs text-slate-500">আল-ইমারাহ প্রোপার্টিজ কর্তৃক অনুমোদিত ও ভেরিফায়েড জমা</p>
                </div>

                <div className="flex items-center space-x-2.5 self-start sm:self-auto">
                  <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-right">
                    <div className="text-3xs text-[#006231] font-bold">মোট অনুমোদিত জমা</div>
                    <div className="text-sm sm:text-base font-black text-[#006231]">{formatBDT(client?.totalPaid)}</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 text-right">
                    <div className="text-3xs text-slate-400 font-bold">রসিদ সংখ্যা</div>
                    <div className="text-sm sm:text-base font-black text-slate-800">{client?.paymentHistory?.length || 0}টি</div>
                  </div>
                </div>
              </div>

              {/* List of Receipts (Mobile-First Cards) */}
              <div className="space-y-3">
                {client?.paymentHistory && client.paymentHistory.length > 0 ? (
                  client.paymentHistory.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 transition-all hover:border-emerald-300"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#006231] flex items-center justify-center font-bold text-xs">
                            
                          </div>
                          <div>
                            <span className="font-bold text-xs text-slate-900">মানি রিসিট নং:</span>{' '}
                            <span className="font-mono text-xs font-black text-[#CE2028]">{item.id}</span>
                          </div>
                        </div>
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#006231] text-3xs font-bold border border-emerald-200">
                          <span>অনুমোদিত জমা</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <div className="text-slate-400 text-3xs font-bold uppercase">জমার তারিখ ও মাধ্যম</div>
                          <div className="font-semibold text-slate-800 mt-0.5">{item.date} • {item.method}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-slate-400 text-3xs font-bold uppercase">পরিশোধিত টাকা</div>
                          <div className="font-black text-base text-[#006231]">{formatBDT(item.amount)}</div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                        <button
                          onClick={() => setSelectedReceipt(item)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-2xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3 h-3 text-[#CE2028]" />
                          <span>রসিদ প্রিভিউ দেখুন</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                    এখনো কোনো পরিশোধিত কিস্তির রেকর্ড নেই।
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 5: প্রোফাইল ও সেটিংস (PROFILE & CONTROLS)            */}
          {/* ------------------------------------------------------- */}
          {activeTab === 'profile' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Profile Overview Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 text-center">
                {/* Circular Avatar with Camera overlay */}
                <div 
                  className="relative inline-block cursor-pointer mx-auto group" 
                  onClick={() => avatarInputRef.current?.click()}
                  title="ছবি পরিবর্তন করতে ক্লিক করুন"
                >
                  {avatarImage ? (
                    <img 
                      src={avatarImage} 
                      alt={client?.name} 
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500 shadow-xl"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-black text-3xl shadow-xl ring-4 ring-emerald-400">
                      {client?.name ? client.name.slice(0, 2) : 'গ্রা'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-7 h-7" />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {client?.name}
                  </h2>
                  <div className="inline-block mt-1 px-3 py-1 rounded-full bg-emerald-100 text-[#006231] font-bold text-xs">
                    কাস্টমার আইডি: {client?.id}
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium">
                    মোবাইল নম্বর: <strong className="text-slate-800">{client?.phone}</strong>
                  </p>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    বরাদ্দকৃত সম্পত্তি: <span className="text-slate-700 font-semibold">{client?.projectName} ({client?.flatNo})</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="max-w-sm mx-auto space-y-2.5 pt-2">
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                  >
                    <Camera className="w-4 h-4 text-[#006231]" />
                    <span>প্রোফাইল ছবি পরিবর্তন করুন</span>
                  </button>

                  <button
                    onClick={onNavigateHome}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                  >
                    <Home className="w-4 h-4 text-[#CE2028]" />
                    <span>ওয়েবসাইটে ফিরে যান</span>
                  </button>

                  <button
                    onClick={onLogout}
                    className="w-full py-3 px-4 rounded-2xl bg-red-50 hover:bg-[#CE2028] text-[#CE2028] hover:text-white border border-red-200 text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-2xs active:scale-95"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>লগআউট করুন</span>
                  </button>
                </div>
              </div>

              {/* Helpline Card */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">জরুরি কাস্টমার কেয়ার সাপোর্ট</div>
                  <div className="text-slate-500">হটলাইন: ০১৯১৮-৬৪৬৫৭৫ (সকাল ৯টা - রাত ৮টা)</div>
                </div>
                <a
                  href="https://wa.me/8801918646575"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors shadow-2xs"
                >
                  হোয়াটসঅ্যাপ
                </a>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* 3. MOBILE VIEW ONLY: BOTTOM FOOTER NAVBAR (EDGE TO EDGE & ATTACHED TO BOTTOM) */}
      {/* (HIDDEN ON DESKTOP - SINCE DESKTOP USES LEFT SIDEBAR)    */}
      {/* ========================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-2xl border-t border-slate-200 shadow-lg">
        <div className="flex items-center justify-around py-2 px-3 max-w-lg mx-auto">
          {/* 1. কাস্টমার তথ্য */}
          <button
            onClick={() => setActiveTab('details')}
            aria-label="কাস্টমার তথ্য"
            title="কাস্টমার তথ্য"
            className={`p-2 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'details' 
                ? 'bg-red-50 text-[#CE2028] scale-105 shadow-2xs font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {activeTab === 'details' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#CE2028] absolute top-1 right-1.5 animate-pulse"></span>
            )}
            <User className="w-5 h-5" />
          </button>

          {/* 2. কিস্তির হিসাব */}
          <button
            onClick={() => setActiveTab('payments')}
            aria-label="কিস্তির হিসাব"
            title="কিস্তির হিসাব"
            className={`p-2 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'payments' 
                ? 'bg-red-50 text-[#CE2028] scale-105 shadow-2xs font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {activeTab === 'payments' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#CE2028] absolute top-1 right-1.5 animate-pulse"></span>
            )}
            <CreditCard className="w-5 h-5" />
          </button>

          {/* 3. কাজের অগ্রগতি */}
          <button
            onClick={() => setActiveTab('progress')}
            aria-label="কাজের অগ্রগতি"
            title="কাজের অগ্রগতি"
            className={`p-2 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'progress' 
                ? 'bg-red-50 text-[#CE2028] scale-105 shadow-2xs font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {activeTab === 'progress' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#CE2028] absolute top-1 right-1.5 animate-pulse"></span>
            )}
            <HardHat className="w-5 h-5" />
          </button>

          {/* 4. জমার হিস্ট্রি */}
          <button
            onClick={() => setActiveTab('history')}
            aria-label="জমার হিস্ট্রি"
            title="জমার হিস্ট্রি"
            className={`p-2 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'history' 
                ? 'bg-red-50 text-[#CE2028] scale-105 shadow-2xs font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {activeTab === 'history' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#CE2028] absolute top-1 right-1.5 animate-pulse"></span>
            )}
            <FileText className="w-5 h-5" />
          </button>

          {/* 5. প্রোফাইল (CIRCULAR AVATAR PHOTO) */}
          <button
            onClick={() => setActiveTab('profile')}
            aria-label="প্রোফাইল"
            title="প্রোফাইল"
            className={`p-1 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'profile' ? 'scale-105' : 'hover:opacity-80'
            }`}
          >
            {activeTab === 'profile' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#CE2028] absolute top-0.5 right-0.5 animate-pulse"></span>
            )}
            <div className="relative">
              {avatarImage ? (
                <img 
                  src={avatarImage} 
                  alt="Profile" 
                  className={`w-7 h-7 rounded-full object-cover transition-all ${
                    activeTab === 'profile' 
                      ? 'ring-2 ring-[#CE2028] shadow-xs' 
                      : 'ring-1 ring-slate-300'
                  }`} 
                />
              ) : (
                <div className={`w-7 h-7 rounded-full bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-bold text-xs transition-all ${
                  activeTab === 'profile' 
                    ? 'ring-2 ring-[#CE2028] shadow-xs' 
                    : 'ring-1 ring-slate-300'
                }`}>
                  {client?.name ? client.name.slice(0, 1) : 'প্রো'}
                </div>
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* ========================================================= */}
      {/* 4. FULL SCREEN VIEW: OFFICIAL MONEY RECEIPT               */}
      {/* ========================================================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-[#F1F5F9] flex flex-col overflow-y-auto animate-fadeIn select-none">
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center space-x-1"
                title="ফিরে যান"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-bold">ফিরে যান</span>
              </button>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-[#006231]" />
                <span className="font-bold text-sm text-slate-800">অফিসিয়াল মানি রিসিট</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট করুন</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full Screen Body */}
          <div className="flex-1 py-6 sm:py-10 px-4 sm:px-6 flex justify-center items-start">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
              <div className="text-center space-y-1">
                <img src="/alemarah_logo_header.svg" alt="Al-Emarah" className="h-8 mx-auto mb-2" />
                <div className="text-3xs uppercase tracking-widest text-[#006231] font-black">অফিসিয়াল মানি রিসিট</div>
                <h3 className="text-sm font-bold text-slate-800">আল-ইমারাহ প্রোপার্টিজ লিমিটেড</h3>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-2xs">রসিদ নম্বর:</span>
                  <span className="font-mono font-bold text-[#CE2028]">{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-2xs">তারিখ:</span>
                  <span className="font-semibold text-slate-800">{selectedReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-2xs">গ্রাহকের নাম:</span>
                  <span className="font-bold text-slate-800">{client?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-2xs">প্রকল্প ও ফ্ল্যাট:</span>
                  <span className="text-slate-700 font-medium">{client?.projectName} ({client?.flatNo})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-2xs">পেমেন্ট মাধ্যম:</span>
                  <span className="text-slate-700 font-medium">{selectedReceipt.method}</span>
                </div>
                <div className="flex justify-between pt-2.5 border-t border-slate-200 text-base font-black">
                  <span className="text-slate-800">পরিশোধিত টাকা:</span>
                  <span className="text-[#006231]">{formatBDT(selectedReceipt.amount)}</span>
                </div>
              </div>

              <div className="text-center text-3xs text-emerald-700 font-bold bg-emerald-50 py-2 rounded-xl border border-emerald-100 flex items-center justify-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ডিজিটাল অডিট ও অফিস কর্তৃক ভেরিফায়েড ভাউচার</span>
              </div>

              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>রসিদ প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
