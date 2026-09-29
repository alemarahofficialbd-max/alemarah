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
  ChevronDown,
  TrendingUp,
  MapPin,
  Sparkles,
  Camera,
  Home,
  Check
} from 'lucide-react';
import { formatBDT, getManagementData } from '../data/managementStore';

export default function ClientDashboard({ 
  client: propClient, 
  lang = 'bn', 
  setLang, 
  t, 
  onLogout, 
  onNavigateHome 
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Load management data to ensure we always have the latest client & project data
  const mgtData = getManagementData();
  const client = propClient || mgtData.clients[0];
  
  // Find project details for this client
  const project = mgtData.projects.find(p => p.id === client?.projectId) || mgtData.projects[0];

  // Profile Photo state stored in localStorage per client
  const [avatarImage, setAvatarImage] = useState(() => {
    try {
      return localStorage.getItem(`alemarah_avatar_${client?.id}`) || null;
    } catch {
      return null;
    }
  });

  const profileRef = useRef(null);
  const avatarInputRef = useRef(null);

  const isEn = lang === 'en';
  const totalDue = (client?.totalPrice || 0) - (client?.totalPaid || 0);
  const paidPercent = client?.totalPrice ? Math.round((client.totalPaid / client.totalPrice) * 100) : 0;

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
        localStorage.setItem(`alemarah_avatar_${client?.id}`, dataUrl);
      } catch {}
      setIsProfileOpen(false);
    };
    reader.readAsDataURL(file);
  };

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
      {/* TOP HEADER (CLEAN & ELEGANT WITH AVATAR DROPDOWN)         */}
      {/* ========================================================= */}
      <header className="bg-white border-b border-gray-200 py-3.5 px-4 sm:px-6 lg:px-8 shadow-2xs sticky top-0 z-40">
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
              <span>{isEn ? 'Client Dashboard' : 'গ্রাহক ড্যাশবোর্ড'}</span>
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
                    alt={client?.name} 
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover ring-2 ring-emerald-500/80 shadow-xs"
                  />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs ring-2 ring-emerald-400">
                    {client?.name ? client.name.slice(0, 2) : 'গ্রা'}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>

              {/* Client Info Text (Hidden on small mobile) */}
              <div className="hidden sm:block text-left text-xs leading-tight">
                <div className="font-bold text-gray-900 group-hover:text-[#CE2028] transition-colors line-clamp-1">
                  {client?.name}
                </div>
                <div className="text-2xs text-gray-500 font-medium">
                  {client?.id}
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
                          alt={client?.name} 
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#006231] shadow-xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-black text-base shadow-xs ring-2 ring-emerald-400">
                          {client?.name ? client.name.slice(0, 2) : 'গ্রা'}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                        <Camera className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-gray-900 truncate">
                        {client?.name}
                      </div>
                      <div className="text-xs text-gray-500 font-semibold flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>{client?.id}</span>
                      </div>
                      <div className="text-2xs text-[#006231] font-bold truncate mt-0.5">
                        {client?.projectName}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions List */}
                <div className="p-2 space-y-1 text-xs font-bold text-gray-700">
                  {/* Change Profile Photo Button */}
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors text-left cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#006231] flex items-center justify-center">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <span>{isEn ? 'Change Profile Photo' : 'প্রোফাইল ছবি পরিবর্তন'}</span>
                  </button>

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
                    <span>{isEn ? 'Return to Website' : 'ওয়েবসাইটে ফিরে যান'}</span>
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
                    <span>{isEn ? 'Sign Out' : 'লগআউট'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN CONTAINER: FOCUSED CUSTOMER INFORMATION              */}
      {/* ========================================================= */}
      <main className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* 1. CUSTOMER & PROPERTY DETAILS BANNER */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1C1819] via-[#2A2223] to-[#1C1819] text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#CE2028]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8EBF40]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center space-x-4">
              <div 
                className="relative group cursor-pointer shrink-0" 
                onClick={() => avatarInputRef.current?.click()}
                title={isEn ? 'Upload Photo' : 'ছবি আপলোড করুন'}
              >
                {avatarImage ? (
                  <img 
                    src={avatarImage} 
                    alt={client?.name} 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-black text-2xl shadow-md ring-2 ring-emerald-400">
                    {client?.name ? client.name.slice(0, 2) : 'গ্রা'}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#8EBF40]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>আইডি: {client?.id}</span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
                  স্বাগতম, {client?.name}!
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
                  <span className="flex items-center space-x-1">
                    <Building2 className="w-4 h-4 text-[#CE2028]" />
                    <strong className="text-white">{client?.projectName}</strong>
                  </span>
                  <span>•</span>
                  <span>ফ্ল্যাট: <strong className="text-emerald-400">{client?.flatNo}</strong></span>
                  <span>•</span>
                  <span>মোবাইল: {client?.phone}</span>
                </div>
              </div>
            </div>

            {/* Quick Completion Badge */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-2xl flex items-center space-x-4 shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#8EBF40] to-[#006231] flex items-center justify-center text-white text-lg sm:text-xl font-black shadow-md">
                {project?.progress || 68}%
              </div>
              <div>
                <div className="text-xs text-gray-300 font-medium">প্রকল্পের সার্বিক কাজ</div>
                <div className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8EBF40]" />
                  <span>নির্ধারিত সময়ে চলমান</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. FINANCIAL OVERVIEW CARDS (টাকা জমা ও বাকি হিসাব) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Price */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-xs space-y-1">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">ফ্ল্যাটের মোট মূল্য</div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {formatBDT(client?.totalPrice)}
            </div>
            <div className="text-2xs text-gray-400 font-semibold pt-1">
              চুক্তিভিত্তিক সর্বমোট মূল্য
            </div>
          </div>

          {/* Card 2: Total Paid */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/20 shadow-xs space-y-1">
            <div className="text-xs font-bold text-[#006231] uppercase tracking-wider flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>এ পর্যন্ত পরিশোধিত</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#006231]">
              {formatBDT(client?.totalPaid)}
            </div>
            <div className="text-2xs text-[#006231] font-bold pt-1">
              মোট মূল্যের {paidPercent}% পরিশোধ সম্পন্ন
            </div>
          </div>

          {/* Card 3: Total Due */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-amber-200/80 bg-gradient-to-b from-white to-amber-50/20 shadow-xs space-y-1">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>মোট বকেয়া / বাকি টাকা</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-700">
              {formatBDT(totalDue)}
            </div>
            <div className="text-2xs text-amber-700 font-semibold pt-1">
              অবশিষ্ট কিস্তিতে পরিশোধযোগ্য
            </div>
          </div>

          {/* Card 4: Next Due Date & Amount */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-red-200/80 bg-gradient-to-b from-white to-red-50/20 shadow-xs space-y-1">
            <div className="text-xs font-bold text-[#CE2028] uppercase tracking-wider flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>পরবর্তী কিস্তির সময়</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#CE2028]">
              {formatBDT(client?.nextDueAmount)}
            </div>
            <div className="text-2xs text-red-600 font-bold pt-1">
              তারিখ: {client?.nextDueDate || '১৫ অক্টোবর, ২০২৬'}
            </div>
          </div>
        </div>

        {/* 3. CONSTRUCTION PROGRESS CARD (কাজের অগ্রগতি) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <div className="text-xs font-bold text-[#CE2028] uppercase tracking-wider flex items-center space-x-1.5">
                <HardHat className="w-4 h-4" />
                <span>নির্মাণকাজের অগ্রগতি বিবরণ</span>
              </div>
              <h2 className="text-xl font-black text-gray-900 mt-1">
                {project?.name || client?.projectName}
              </h2>
            </div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#006231] font-bold text-xs border border-emerald-200 self-start sm:self-auto">
              <span>সার্বিক অগ্রগতি:</span>
              <strong className="text-sm">{project?.progress || 68}% সম্পন্ন</strong>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-gray-700">
              <span>বর্তমান চলমান কাজ: <strong className="text-gray-900">{project?.currentStage || 'ছাদ ঢালাই ও কাঠামো নির্মাণ'}</strong></span>
              <span className="text-[#006231]">{project?.progress || 68}%</span>
            </div>
            <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-gray-200">
              <div 
                className="h-full bg-gradient-to-r from-[#006231] via-[#8EBF40] to-[#006231] rounded-full transition-all duration-700 shadow-xs"
                style={{ width: `${project?.progress || 68}%` }}
              ></div>
            </div>
          </div>

          {/* Site Engineer Contact Note */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900">সাইট ইনচার্জ: প্রকৌশলী মহিউদ্দিন আহমেদ</span>
                <div className="text-gray-500">সরাসরি সাইট হটলাইন: ০১৯১৮-৬৪৬৫৭৫ (সকাল ৯টা - সন্ধ্যা ৬টা)</div>
              </div>
            </div>
            <a 
              href="tel:01918646575"
              className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs transition-colors shrink-0"
            >
              সাইটে কল দিন
            </a>
          </div>
        </div>

        {/* 4. PAYMENT HISTORY TABLE (টাকা জমার হিস্ট্রি) */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">পরিশোধিত কিস্তিসমূহের বিবরণ</h3>
              <p className="text-xs text-gray-500 mt-0.5">অফিস কর্তৃক অনুমোদিত সকল জমার স্টেটমেন্ট</p>
            </div>
            <span className="text-xs font-bold text-[#006231] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              {client?.paymentHistory?.length || 0}টি জমা রেকর্ড
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold text-xs">
                <tr>
                  <th className="py-3.5 px-6">রসিদ নম্বর</th>
                  <th className="py-3.5 px-6">তারিখ</th>
                  <th className="py-3.5 px-6">জমার মাধ্যম</th>
                  <th className="py-3.5 px-6 text-right">পরিশোধিত টাকা</th>
                  <th className="py-3.5 px-6 text-center">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {client?.paymentHistory && client.paymentHistory.length > 0 ? (
                  client.paymentHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-900">{item.id}</td>
                      <td className="py-4 px-6 text-gray-600">{item.date}</td>
                      <td className="py-4 px-6">{item.method}</td>
                      <td className="py-4 px-6 text-right font-black text-[#006231]">
                        {formatBDT(item.amount)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#006231] text-xs font-bold border border-emerald-100">
                          <Check className="w-3 h-3 text-[#8EBF40]" />
                          <span>অনুমোদিত</span>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 text-xs">
                      এখনো কোনো পরিশোধিত কিস্তির রেকর্ড নেই।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#8EBF40]" />
            <span>© ২০২৬ আল-ইমারাহ প্রোপার্টিজ লিমিটেড • সিকিউরড ক্লায়েন্ট পোর্টাল</span>
          </div>
          <div>
            <span>কেন্দ্রীয় সহায়তা: ০১৭৪৩-৯২৬৯২৬</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
