import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  User, 
  LogOut, 
  Globe, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  DollarSign, 
  FileText, 
  Download, 
  Phone, 
  MessageSquare, 
  HardHat, 
  ShieldCheck, 
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  MapPin,
  Sparkles,
  Camera,
  Upload,
  Plus,
  X,
  CreditCard,
  Check,
  AlertCircle,
  Home
} from 'lucide-react';

export default function ClientDashboard({ lang, setLang, t, onLogout, onNavigateHome }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'payments', 'documents', 'support'
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Profile Photo state stored in localStorage
  const [avatarImage, setAvatarImage] = useState(() => {
    try {
      return localStorage.getItem('alemarah_client_avatar') || null;
    } catch {
      return null;
    }
  });

  // Client payment slips list (with sample & uploaded items)
  const [paymentSlips, setPaymentSlips] = useState(() => {
    try {
      const saved = localStorage.getItem('alemarah_payment_slips');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'SLIP-04',
        installmentEn: '4th Installment',
        installmentBn: '৪র্থ কিস্তি',
        date: '১৫ সেপ্টেম্বর, ২০২৬',
        amount: '৳ ১৮,০০,০০০',
        methodEn: 'Bank Transfer (City Bank)',
        methodBn: 'ব্যাংক ট্রান্সফার (সিটি ব্যাংক)',
        status: 'verified',
        slipUrl: null
      }
    ];
  });

  // New slip form state
  const [newSlipAmount, setNewSlipAmount] = useState('');
  const [newSlipInstallment, setNewSlipInstallment] = useState('৫ম কিস্তি (চলমান)');
  const [newSlipMethod, setNewSlipMethod] = useState('bank');
  const [newSlipFile, setNewSlipFile] = useState(null);
  const [newSlipPreview, setNewSlipPreview] = useState(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState(false);

  const profileRef = useRef(null);
  const avatarInputRef = useRef(null);
  const slipInputRef = useRef(null);

  const d = t.dashboard;
  const isEn = lang === 'en';

  // Handle click outside for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Avatar file upload
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert(isEn ? 'Image size should be less than 4MB.' : 'ছবির সাইজ সর্বোচ্চ ৪ মেগাবাইট হতে হবে।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setAvatarImage(dataUrl);
      try {
        localStorage.setItem('alemarah_client_avatar', dataUrl);
      } catch {}
      setIsProfileOpen(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle Slip file selection
  const handleSlipFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewSlipFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewSlipPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Submit new payment slip
  const handleSlipSubmit = (e) => {
    e.preventDefault();
    if (!newSlipAmount) {
      alert(isEn ? 'Please enter payment amount' : 'অনুগ্রহ করে কিস্তির পরিমাণ লিখুন');
      return;
    }

    const methodLabels = {
      bank: { en: 'Bank Deposit / Cheque', bn: 'ব্যাংক জমা / চেক' },
      online: { en: 'bKash / Nagad Transfer', bn: 'বিকাশ / নগদ পেমেন্ট' },
      office: { en: 'Cash at Corporate Office', bn: 'অফিসে নগদ পরিশোধ' }
    };

    const newRecord = {
      id: `SLIP-${Date.now().toString().slice(-4)}`,
      installmentEn: newSlipInstallment,
      installmentBn: newSlipInstallment,
      date: new Date().toLocaleDateString(isEn ? 'en-US' : 'bn-BD', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      amount: newSlipAmount.startsWith('৳') ? newSlipAmount : `৳ ${newSlipAmount}`,
      methodEn: methodLabels[newSlipMethod]?.en || 'Bank Deposit',
      methodBn: methodLabels[newSlipMethod]?.bn || 'ব্যাংক জমা',
      status: 'pending',
      slipUrl: newSlipPreview
    };

    const updated = [newRecord, ...paymentSlips];
    setPaymentSlips(updated);
    try {
      localStorage.setItem('alemarah_payment_slips', JSON.stringify(updated));
    } catch {}

    setUploadSuccessMsg(true);
    setTimeout(() => {
      setUploadSuccessMsg(false);
      setIsUploadModalOpen(false);
      setNewSlipAmount('');
      setNewSlipFile(null);
      setNewSlipPreview(null);
    }, 1500);
  };

  // Navigation Tab Configurations
  const navTabs = [
    { id: 'overview', label: d.tabs.overview, icon: TrendingUp },
    { id: 'payments', label: d.tabs.payments, icon: DollarSign },
    { id: 'documents', label: d.tabs.documents, icon: FileText },
    { id: 'support', label: d.tabs.support, icon: HardHat }
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-gray-900 flex flex-col font-sans animate-fadeIn">
      {/* Hidden File Input for Profile Avatar */}
      <input 
        ref={avatarInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleAvatarChange}
      />

      {/* ========================================================= */}
      {/* 1. TOP HEADER (CLEAN & ELEGANT WITH AVATAR DROPDOWN)     */}
      {/* ========================================================= */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8 shadow-2xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: Brand Logo & Secured Portal Tag */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-2 group cursor-pointer text-left"
              title={isEn ? 'Return to Website' : 'ওয়েবসাইটে ফিরে যান'}
            >
              <img 
                src="/alemarah_logo_header.svg" 
                alt="Al-Emarah Properties" 
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </button>
            <span className="text-gray-200 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[#006231] text-xs font-bold border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8EBF40]" />
              <span>{isEn ? 'Secured Client Portal' : 'সুরক্ষিত ক্লায়েন্ট ড্যাশবোর্ড'}</span>
            </div>
          </div>

          {/* Right: User Profile Avatar Dropdown Trigger */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2.5 sm:space-x-3 p-1.5 pr-2.5 sm:pr-3 rounded-2xl hover:bg-gray-100 transition-all border border-gray-200/80 bg-gray-50/50 cursor-pointer shadow-2xs group"
              aria-expanded={isProfileOpen}
            >
              {/* Avatar circle with online indicator */}
              <div className="relative">
                {avatarImage ? (
                  <img 
                    src={avatarImage} 
                    alt={d.clientName} 
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover ring-2 ring-emerald-500/80 shadow-xs"
                  />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs ring-2 ring-emerald-400">
                    {isEn ? 'AI' : 'মআ'}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>

              {/* Client Info Text (Hidden on small mobile) */}
              <div className="hidden sm:block text-left text-xs leading-tight">
                <div className="font-bold text-gray-900 group-hover:text-[#CE2028] transition-colors line-clamp-1">
                  {d.clientName}
                </div>
                <div className="text-2xs text-gray-500 font-medium">
                  {d.clientId}
                </div>
              </div>

              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180 text-gray-700' : ''}`} />
            </button>

            {/* Profile Dropdown Popup Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-3xl shadow-2xl border border-gray-200/90 py-3 z-50 animate-fadeIn divide-y divide-gray-100">
                {/* Header Profile Summary */}
                <div className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative group/avatar cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                      {avatarImage ? (
                        <img 
                          src={avatarImage} 
                          alt={d.clientName} 
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#006231] shadow-xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-black text-base shadow-xs ring-2 ring-emerald-400">
                          {isEn ? 'AI' : 'মআ'}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                        <Camera className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-gray-900 truncate">
                        {d.clientName}
                      </div>
                      <div className="text-xs text-gray-500 font-semibold flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>{d.clientId}</span>
                      </div>
                      <div className="text-2xs text-[#006231] font-bold truncate mt-0.5">
                        {d.projectBadge}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions List */}
                <div className="p-2 space-y-1 text-xs font-bold text-gray-700">
                  {/* Change Profile Photo Button */}
                  <button
                    onClick={() => {
                      avatarInputRef.current?.click();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors text-left cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#006231] flex items-center justify-center">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <span>{isEn ? 'Change Profile Photo' : 'প্রোফাইল ছবি পরিবর্তন'}</span>
                  </button>

                  {/* Switch Language */}
                  {setLang && (
                    <button
                      onClick={() => {
                        setLang(lang === 'en' ? 'bn' : 'en');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                        <span>{isEn ? 'Language (বাংলা)' : 'ভাষা পরিবর্তন (English)'}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-2xs uppercase">
                        {isEn ? 'BN' : 'EN'}
                      </span>
                    </button>
                  )}

                  {/* Return to Website */}
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onNavigateHome();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors text-left cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
                      <Home className="w-3.5 h-3.5" />
                    </div>
                    <span>{d.backToHome}</span>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-[#CE2028] text-[#CE2028] hover:text-white transition-all text-xs font-bold text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{d.logout}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE WITH DESKTOP LEFT SIDEBAR              */}
      {/* ========================================================= */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* DESKTOP LEFT SIDEBAR (Hidden on mobile/tablet) */}
        <aside className="hidden lg:flex w-72 bg-white border-r border-gray-200 shrink-0 flex-col justify-between p-6 sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Sidebar Client Profile Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 text-center space-y-3 relative group">
              <div className="relative mx-auto w-16 h-16 cursor-pointer" onClick={() => avatarInputRef.current?.click()} title={isEn ? 'Click to change photo' : 'ছবি পরিবর্তন করতে ক্লিক করুন'}>
                {avatarImage ? (
                  <img 
                    src={avatarImage} 
                    alt={d.clientName} 
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-black text-xl shadow-sm ring-2 ring-emerald-400">
                    {isEn ? 'AI' : 'মআ'}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black text-gray-900">{d.clientName}</h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#006231] text-2xs font-bold">
                  {d.clientId}
                </span>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {d.projectBadge}
                </p>
              </div>
            </div>

            {/* Sidebar Navigation Links */}
            <nav className="space-y-1.5">
              <div className="text-2xs font-extrabold text-gray-400 uppercase tracking-wider px-3 mb-2">
                {isEn ? 'Dashboard Menu' : 'ড্যাশবোর্ড মেনু'}
              </div>

              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#CE2028] to-[#A9141B] text-white shadow-md shadow-[#CE2028]/25'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span className="flex-1">{tab.label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Bottom Site Helpline Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-[#006231] font-bold">
              <HardHat className="w-4 h-4 text-[#8EBF40]" />
              <span>{isEn ? 'Site Support Desk' : 'সাইট সাপোর্ট ডেস্ক'}</span>
            </div>
            <p className="text-gray-600 text-2xs leading-relaxed">
              {isEn ? 'Need urgent construction enquiry? Reach site engineer.' : 'জরুরি নির্মাণ তথ্যের জন্য সাইট ইনচার্জের সাথে কথা বলুন।'}
            </p>
            <a 
              href="tel:01918646575" 
              className="inline-flex items-center space-x-1.5 font-bold text-[#CE2028] hover:underline"
            >
              <Phone className="w-3 h-3" />
              <span>০১৯১৮-৬৪৬৫৭৫</span>
            </a>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12">
          
          {/* Welcome Client Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1C1819] via-[#2A2223] to-[#1C1819] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#CE2028]/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8EBF40]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center space-x-4">
                {/* Large Avatar in Banner */}
                <div 
                  className="relative group cursor-pointer shrink-0" 
                  onClick={() => avatarInputRef.current?.click()}
                  title={isEn ? 'Upload Photo' : 'ছবি আপলোড করুন'}
                >
                  {avatarImage ? (
                    <img 
                      src={avatarImage} 
                      alt={d.clientName} 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-black text-2xl shadow-md ring-2 ring-emerald-400">
                      {isEn ? 'AI' : 'মআ'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#8EBF40]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{d.clientId}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
                    {d.welcome}, {d.clientName}!
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-300 flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-[#CE2028]" />
                    <span>{d.projectBadge}</span>
                  </p>
                </div>
              </div>

              {/* Quick Overall Status Metric */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-2xl flex items-center space-x-4 shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#8EBF40] to-[#006231] flex items-center justify-center text-white text-lg sm:text-xl font-black shadow-md">
                  68%
                </div>
                <div>
                  <div className="text-xs text-gray-300 font-medium">{d.progress.overall}</div>
                  <div className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#8EBF40]" />
                    <span>{isEn ? 'On-Schedule Construction' : 'নির্ধারিত সময়ে চলমান'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW (MILESTONES & SITE UPDATES)               */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Progress Timeline (8 cols) */}
              <div className="lg:col-span-8 bg-white p-5 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">{d.progress.title}</h2>
                    <p className="text-xs text-gray-500 mt-1">{d.progress.lastUpdated}</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#006231] text-xs font-bold border border-emerald-200">
                    {d.progress.overall}: 68%
                  </div>
                </div>

                {/* Progress Bar Stages */}
                <div className="space-y-4">
                  {d.progress.stages.map((stg, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                        <span className="text-gray-900">{stg.name}</span>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                          stg.percent === 100 
                            ? 'bg-emerald-100 text-[#006231]' 
                            : stg.percent >= 50 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-gray-200 text-gray-700'
                        }`}>
                          {stg.percent}% ({stg.status})
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            stg.percent === 100 ? 'bg-[#006231]' : 'bg-[#CE2028]'
                          }`}
                          style={{ width: `${stg.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Site Photo Preview (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">
                      {isEn ? 'Latest Site Photography' : 'সর্বশেষ সাইট স্থিরচিত্র'}
                    </h3>
                    <span className="text-xs text-[#006231] font-bold">Live Photo</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-inner h-56 bg-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=800&q=80"
                      alt="Al Quds Tower Construction"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {d.progress.droneUpdate}
                  </p>
                  <button
                    onClick={() => alert(isEn ? 'Drone high-definition video is preparing for playback.' : 'হাই-রেজোলিউশন ড্রোন ভিডিও প্রস্তুত হচ্ছে।')}
                    className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isEn ? 'View 360° Site View' : '৩৬০° সাইট ভিউ দেখুন'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PAYMENTS (FINANCIAL STATS & RECEIPT UPLOAD)       */}
          {/* ========================================================= */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              {/* 4 Financial Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="text-xs text-gray-500 font-medium">{d.financial.totalValue}</div>
                  <div className="text-2xl font-black text-gray-900 mt-1">৳ ১,২০,০০,০০০</div>
                  <div className="text-xs text-gray-400 mt-1">{isEn ? 'Contract Value' : 'চুক্তিভিত্তিক মোট মূল্য'}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
                  <div className="text-xs text-emerald-800 font-medium">{d.financial.totalPaid}</div>
                  <div className="text-2xl font-black text-[#006231] mt-1">৳ ৭২,০০,০০০</div>
                  <div className="text-xs text-[#006231] mt-1 font-bold">60% Cleared</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs">
                  <div className="text-xs text-amber-800 font-medium">{d.financial.totalDue}</div>
                  <div className="text-2xl font-black text-amber-700 mt-1">৳ ৪৮,০০,০০০</div>
                  <div className="text-xs text-amber-700 mt-1 font-medium">{isEn ? 'Installment Schedule' : 'চলমান কিস্তি'}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-xs">
                  <div className="text-xs text-red-800 font-medium">{d.financial.nextInstallment}</div>
                  <div className="text-2xl font-black text-[#CE2028] mt-1">৳ ৬,০০,০০০</div>
                  <div className="text-xs text-red-600 font-bold mt-1">{d.financial.dueDate}</div>
                </div>
              </div>

              {/* Upload Payment Receipt Action Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-[#0A2616] to-emerald-950 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-flex items-center space-x-1.5 text-xs text-[#8EBF40] font-bold">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Client Payment Management' : 'ক্লায়েন্ট কিস্তি পরিশোধ ব্যবস্থাপনা'}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {isEn ? 'Have you deposited an installment?' : 'আপনি কি নতুন কিস্তির টাকা জমা দিয়েছেন?'}
                  </h3>
                  <p className="text-xs text-emerald-200/80">
                    {isEn 
                      ? 'Upload your bank deposit voucher or payment receipt for instant ledger verification.' 
                      : 'আপনার ব্যাংক ডিপোজিট স্লিপ বা রসিদের ছবি আপলোড করুন, দ্রুত ভেরিফাই করে স্টেটমেন্টে যোগ করা হবে।'
                    }
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#A9141B] text-white text-xs sm:text-sm font-bold shadow-lg shadow-black/20 hover:opacity-95 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isEn ? 'Upload Payment Slip' : 'পেমেন্ট স্লিপ আপলোড করুন'}</span>
                </button>
              </div>

              {/* Uploaded Slips & Verified Receipts Table */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{d.financial.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isEn ? 'Verified transactions and submitted vouchers' : 'যাচাইকৃত ট্রানজেকশন ও জমা দেওয়া ভাউচারসমূহ'}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#006231] bg-emerald-50 px-2.5 py-1 rounded-md">
                    {paymentSlips.length} {isEn ? 'Records' : 'টি রেকর্ড'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold text-xs">
                      <tr>
                        <th className="py-3.5 px-6">Receipt / Slip ID</th>
                        <th className="py-3.5 px-6">Date</th>
                        <th className="py-3.5 px-6">Amount</th>
                        <th className="py-3.5 px-6">Method</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                      {paymentSlips.map((rcp, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 font-bold text-gray-900">
                            {rcp.id || rcp.receiptNo}
                            <div className="text-2xs text-gray-400 font-normal">
                              {isEn ? rcp.installmentEn : rcp.installmentBn}
                            </div>
                          </td>
                          <td className="py-4 px-6">{rcp.date}</td>
                          <td className="py-4 px-6 font-bold text-[#006231]">{rcp.amount}</td>
                          <td className="py-4 px-6 text-gray-600">{isEn ? rcp.methodEn : rcp.methodBn}</td>
                          <td className="py-4 px-6">
                            {rcp.status === 'verified' ? (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#006231] text-xs font-bold border border-emerald-100">
                                <Check className="w-3 h-3 text-[#8EBF40]" />
                                <span>{isEn ? 'Verified' : 'অনুমোদিত'}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>{isEn ? 'Under Review' : 'যাচাইকরণাধীন'}</span>
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right">
                            {rcp.slipUrl ? (
                              <a
                                href={rcp.slipUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all"
                              >
                                <span>{isEn ? 'View Slip' : 'স্লিপ দেখুন'}</span>
                              </a>
                            ) : (
                              <button
                                onClick={() => alert(`${rcp.receiptNo || rcp.id} PDF receipt download initiated.`)}
                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#CE2028] hover:text-white text-gray-800 text-xs font-bold transition-all cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>PDF</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: DOCUMENTS VAULT                                    */}
          {/* ========================================================= */}
          {activeTab === 'documents' && (
            <div className="bg-white p-5 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900">{d.documents.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isEn 
                    ? 'All official allotment papers, legal agreements, and certified building sanction blueprints.' 
                    : 'আপনার বুকিংকৃত ফ্ল্যাটের বরাদ্দপত্র, চুক্তিপত্র এবং রাজউক অনুমোদিত ড্রয়িং এর ডিজিটাল কপি।'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {d.documents.items.map((doc, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-11 h-11 rounded-xl bg-red-50 text-[#CE2028] flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{doc.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{doc.type} • {doc.size}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`${doc.title} download started.`)}
                      className="p-2.5 rounded-xl bg-white hover:bg-[#006231] text-gray-700 hover:text-white border border-gray-200 shadow-xs transition-colors cursor-pointer"
                      title={d.documents.downloadBtn}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: SITE ENGINEER & RELATIONSHIP OFFICER               */}
          {/* ========================================================= */}
          {activeTab === 'support' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Engineer Card */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xs space-y-5">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-xl">
                    <HardHat className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                      {isEn ? 'Project Site In-Charge' : 'সাইট ইনচার্জ'}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{d.support.engineerName}</h3>
                    <p className="text-xs text-gray-500">{d.support.engineerRole}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs text-gray-700">
                  <div className="font-bold text-gray-900">Al Quds Tower Construction Site</div>
                  <div>Direct Site Helpline: {d.support.contactHotline}</div>
                  <div>Available: Saturday – Thursday (9:00 AM – 6:00 PM)</div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href="https://wa.me/8801918646575"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#006231] hover:bg-[#004723] text-white text-xs font-bold transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{d.support.whatsappChat}</span>
                  </a>

                  <a
                    href="tel:01918646575"
                    className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#CE2028] hover:bg-[#A9141B] text-white text-xs font-bold transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{d.support.callNow}</span>
                  </a>
                </div>
              </div>

              {/* Relationship Officer Card */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xs space-y-5">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#006231] flex items-center justify-center font-black text-xl">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                      {isEn ? 'Customer Relationship' : 'রিলেশনশিপ অফিসার'}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{d.support.officerName}</h3>
                    <p className="text-xs text-gray-500">{d.support.officerRole}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs text-gray-700">
                  <div className="font-bold text-gray-900">Corporate Customer Care Office</div>
                  <div>Email: support@alemarahproperties.com</div>
                  <div>Office: ৩/১, স্কাই ভিউ হেনোলাক্স সেন্টার, পুরানা পল্টন, ঢাকা</div>
                </div>

                <div className="pt-2">
                  <a
                    href="tel:01743926926"
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{isEn ? 'Call Customer Relationship' : 'কাস্টমার কেয়ারে কল দিন'}</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* 3. MOBILE STICKY BOTTOM NAVIGATION BAR (PHONE VIEW)       */}
      {/* ========================================================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-xl px-2 py-2">
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
                  isActive 
                    ? 'text-[#CE2028] font-black' 
                    : 'text-gray-500 hover:text-gray-900 font-semibold'
                }`}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CE2028] mb-1"></span>
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-[#CE2028]' : 'text-gray-500'} transition-transform`} />
                <span className="text-3xs mt-1 tracking-tight text-center truncate max-w-full">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ========================================================= */}
      {/* 4. MODAL: UPLOAD PAYMENT SLIP / VOUCHER                   */}
      {/* ========================================================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#CE2028] flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {isEn ? 'Upload Payment Voucher' : 'কিস্তির ব্যাংক স্লিপ আপলোড'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isEn ? 'Submit your deposit receipt for official verification' : 'পরিশোধিত কিস্তির রসিদ বা স্লিপ সংযুক্ত করুন'}
                  </p>
                </div>
              </div>

              {uploadSuccessMsg ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 text-[#006231]">
                  <CheckCircle2 className="w-10 h-10 text-[#8EBF40] mx-auto animate-bounce" />
                  <div className="font-bold text-sm">
                    {isEn ? 'Voucher Submitted Successfully!' : 'স্লিপ সফলভাবে জমা দেওয়া হয়েছে!'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {isEn ? 'Our accounts team will verify and update ledger within 24 hours.' : 'আমাদের অ্যাকাউন্টস বিভাগ ২৪ ঘণ্টার মধ্যে ভেরিফাই করে স্টেটমেন্টে যোগ করবে।'}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSlipSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      {isEn ? 'Installment Type' : 'কিস্তির বিবরণ'}
                    </label>
                    <select
                      value={newSlipInstallment}
                      onChange={(e) => setNewSlipInstallment(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028]"
                    >
                      <option value="৫ম কিস্তি (চলমান)">৫ম কিস্তি (চলমান)</option>
                      <option value="৬ষ্ঠ কিস্তি">৬ষ্ঠ কিস্তি</option>
                      <option value="৭ম কিস্তি">৭ম কিস্তি</option>
                      <option value="অন্যান্য / অগ্রিম কিস্তি">অন্যান্য / অগ্রিম কিস্তি</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      {isEn ? 'Amount Paid (BDT)' : 'জমার পরিমাণ (টাকা)'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6,00,000"
                      value={newSlipAmount}
                      onChange={(e) => setNewSlipAmount(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      {isEn ? 'Payment Channel' : 'পরিশোধের মাধ্যম'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewSlipMethod('bank')}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                          newSlipMethod === 'bank'
                            ? 'border-[#006231] bg-emerald-50 text-[#006231]'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      >
                        {isEn ? 'Bank Deposit' : 'ব্যাংক ডিপোজিট'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewSlipMethod('online')}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                          newSlipMethod === 'online'
                            ? 'border-[#006231] bg-emerald-50 text-[#006231]'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      >
                        {isEn ? 'bKash / Nagad' : 'বিকাশ / নগদ'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewSlipMethod('office')}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                          newSlipMethod === 'office'
                            ? 'border-[#006231] bg-emerald-50 text-[#006231]'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      >
                        {isEn ? 'Cash Office' : 'ক্যাশ অফিস'}
                      </button>
                    </div>
                  </div>

                  {/* Voucher File Upload */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      {isEn ? 'Slip Photo / Document' : 'স্লিপ বা রসিদের ছবি / ফাইল'}
                    </label>
                    <input 
                      ref={slipInputRef}
                      type="file" 
                      accept="image/*,.pdf" 
                      className="hidden" 
                      onChange={handleSlipFileSelect}
                    />

                    {newSlipPreview ? (
                      <div className="relative rounded-2xl overflow-hidden border border-gray-200 h-36 bg-gray-50">
                        <img 
                          src={newSlipPreview} 
                          alt="Slip Preview" 
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setNewSlipFile(null);
                            setNewSlipPreview(null);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => slipInputRef.current?.click()}
                        className="p-6 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#CE2028] bg-gray-50 hover:bg-red-50/20 text-center cursor-pointer transition-colors space-y-2"
                      >
                        <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                        <div className="text-xs font-bold text-gray-700">
                          {isEn ? 'Click to browse bank voucher image' : 'ব্যাংক ভাউচার বা পে-অর্ডারের ছবি নির্বাচন করুন'}
                        </div>
                        <div className="text-2xs text-gray-400">
                          PNG, JPG, PDF (Max 5MB)
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#A9141B] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#CE2028]/25 hover:opacity-95 transition-all cursor-pointer"
                    >
                      {isEn ? 'Confirm & Submit Slip' : 'নিশ্চিত করুন ও স্লিপ জমা দিন'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. STANDALONE DASHBOARD FOOTER                            */}
      {/* ========================================================= */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#8EBF40]" />
            <span>
              {isEn 
                ? '© 2026 Al-Emarah Properties Limited • Secured Client Portal. 256-Bit SSL Encrypted.' 
                : '© ২০২৬ আল-ইমারাহ প্রোপার্টিজ লিমিটেড • সিকিউরড ক্লায়েন্ট পোর্টাল | ২৫৬-বিট এসএসএল এনক্রিপ্টেড।'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">
              {isEn ? 'Support Desk: 01743-926926' : 'সাপোর্ট ডেস্ক: ০১৭৪৩-৯২৬৯২৬'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
