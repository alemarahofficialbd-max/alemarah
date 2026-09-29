import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  User, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Calendar, 
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
  ChevronRight
} from 'lucide-react';
import { formatBDT, getManagementData } from '../data/managementStore';

export default function ClientDashboard({ 
  client: propClient, 
  lang = 'bn', 
  t, 
  onLogout, 
  onNavigateHome 
}) {
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'payments', 'progress', 'profile'
  
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

  const avatarInputRef = useRef(null);

  const totalDue = (client?.totalPrice || 0) - (client?.totalPaid || 0);
  const paidPercent = client?.totalPrice ? Math.round((client.totalPaid / client.totalPrice) * 100) : 0;

  // Handle Avatar file upload
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('ছবির সাইজ সর্বোচ্চ ৪ মেগাবাইট হতে হবে।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setAvatarImage(dataUrl);
      try {
        localStorage.setItem(`alemarah_avatar_${client?.id}`, dataUrl);
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-gray-900 flex flex-col font-sans animate-fadeIn pb-24">
      {/* Hidden File Input for Profile Avatar */}
      <input 
        ref={avatarInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleAvatarChange}
      />

      {/* ========================================================= */}
      {/* 1. TOP HEADER (CLEAN & ELEGANT, NO TOP AVATAR)            */}
      {/* ========================================================= */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8 shadow-2xs sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Left: Brand Logo & Secured Portal Tag */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-2 group cursor-pointer text-left"
              title="ওয়েবসাইটে ফিরে যান"
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
              <span>গ্রাহক পোর্টাল</span>
            </div>
          </div>

          {/* Right: Quick Action to Return to Website */}
          <button
            onClick={onNavigateHome}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-[#CE2028]" />
            <span className="hidden sm:inline">ওয়েবসাইটে ফিরে যান</span>
            <span className="sm:hidden">ওয়েবসাইট</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE: CONTROLLED BY FOOTER NAVBAR            */}
      {/* ========================================================= */}
      <main className="max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">

        {/* ======================================================= */}
        {/* SECTION 1: CUSTOMER & PROPERTY DETAILS                  */}
        {/* ======================================================= */}
        {activeTab === 'details' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Customer Welcome Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1C1819] via-[#2A2223] to-[#1C1819] text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
                {/* Profile Photo */}
                <div 
                  className="relative cursor-pointer shrink-0" 
                  onClick={() => avatarInputRef.current?.click()}
                  title="ছবি আপলোড করতে ক্লিক করুন"
                >
                  {avatarImage ? (
                    <img 
                      src={avatarImage} 
                      alt={client?.name} 
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-black text-2xl shadow-lg ring-4 ring-emerald-400">
                      {client?.name ? client.name.slice(0, 2) : 'গ্রা'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#8EBF40]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>আইডি: {client?.id}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {client?.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-300">
                    মোবাইল নম্বর: <strong className="text-white">{client?.phone}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Property Specification Details Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-[#CE2028]" />
                  <span>ক্রয়কৃত প্রজেক্ট ও ফ্ল্যাটের বিবরণ</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">আপনার বরাদ্দকৃত অ্যাপার্টমেন্ট ও চুক্তিভিত্তিক সম্পত্তি</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <div className="text-2xs font-bold text-gray-400 uppercase">প্রকল্পের নাম</div>
                  <div className="text-base font-black text-gray-900">{client?.projectName}</div>
                  <div className="text-xs text-gray-500">{project?.location}</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                  <div className="text-2xs font-bold text-[#006231] uppercase">ফ্ল্যাট নম্বর ও স্পেস</div>
                  <div className="text-base font-black text-[#006231]">{client?.flatNo}</div>
                  <div className="text-xs text-emerald-700">অনুমোদিত আবাসিক ইউনিট</div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <div className="text-2xs font-bold text-gray-400 uppercase">মোট চুক্তি মূল্য</div>
                  <div className="text-base font-black text-gray-900">{formatBDT(client?.totalPrice)}</div>
                  <div className="text-xs text-gray-500">শতভাগ নিষ্কণ্টক রেজিস্ট্রেশন চুক্তি</div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <div className="text-2xs font-bold text-gray-400 uppercase">হস্তান্তর সম্ভাব্য সময়</div>
                  <div className="text-base font-black text-gray-900">জুন ২০২৭</div>
                  <div className="text-xs text-[#006231] font-semibold">নির্ধারিত সময়ে চলমান</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* SECTION 2: FINANCIAL / INSTALLMENT LEDGER               */}
        {/* ======================================================= */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 4 Financial Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-1">
                <div className="text-xs font-bold text-gray-400 uppercase">মোট ফ্ল্যাটের মূল্য</div>
                <div className="text-2xl font-black text-gray-900">{formatBDT(client?.totalPrice)}</div>
                <div className="text-2xs text-gray-400 pt-1 font-semibold">চুক্তিভিত্তিক চূড়ান্ত মূল্য</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/20 shadow-xs space-y-1">
                <div className="text-xs font-bold text-[#006231] uppercase">এ পর্যন্ত দিয়েছেন</div>
                <div className="text-2xl font-black text-[#006231]">{formatBDT(client?.totalPaid)}</div>
                <div className="text-2xs text-[#006231] font-bold pt-1">মোট মূল্যের {paidPercent}% পরিশোধিত</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-amber-200/80 bg-gradient-to-b from-white to-amber-50/20 shadow-xs space-y-1">
                <div className="text-xs font-bold text-amber-800 uppercase">মোট বাকি / বকেয়া টাকা</div>
                <div className="text-2xl font-black text-amber-700">{formatBDT(totalDue)}</div>
                <div className="text-2xs text-amber-700 font-semibold pt-1">অবশিষ্ট কিস্তিসমূহে প্রদেয়</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-red-200/80 bg-gradient-to-b from-white to-red-50/20 shadow-xs space-y-1">
                <div className="text-xs font-bold text-[#CE2028] uppercase">পরবর্তী কিস্তির পরিমাণ</div>
                <div className="text-2xl font-black text-[#CE2028]">{formatBDT(client?.nextDueAmount)}</div>
                <div className="text-2xs text-red-600 font-bold pt-1">পরিশোধের তারিখ: {client?.nextDueDate}</div>
              </div>
            </div>

            {/* Quick Summary Note */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center space-x-3 text-xs text-gray-600">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900">কিস্তি পরিশোধের নিয়ম:</span> ব্যাংক ডিপোজিট, চেক বা কর্পোরেট অফিসে সরাসরি পে-অর্ডারের মাধ্যমে কিস্তি পরিশোধ করতে পারবেন। পরিশোধের পর অফিস রসিদ যোগ হবে।
              </div>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* SECTION 3: CONSTRUCTION PROGRESS                        */}
        {/* ======================================================= */}
        {activeTab === 'progress' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <div className="text-xs font-bold text-[#CE2028] uppercase tracking-wider flex items-center space-x-1.5">
                  <HardHat className="w-4 h-4" />
                  <span>প্রকল্পের নির্মাণকাজের অগ্রগতি</span>
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

            {/* Progress Bar & Stage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-gray-700">
                <span>বর্তমান চলমান কাজ: <strong className="text-gray-900">{project?.currentStage || 'ছাদ ঢালাই ও কাঠামো নির্মাণ'}</strong></span>
                <span className="text-[#006231] font-black">{project?.progress || 68}%</span>
              </div>
              <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden p-0.5 border border-gray-200">
                <div 
                  className="h-full bg-gradient-to-r from-[#006231] via-[#8EBF40] to-[#006231] rounded-full transition-all duration-700 shadow-xs"
                  style={{ width: `${project?.progress || 68}%` }}
                ></div>
              </div>
            </div>

            {/* Site Engineer Contact Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-gray-900">সাইট ইনচার্জ: প্রকৌশলী মহিউদ্দিন আহমেদ</span>
                  <div className="text-gray-500">সরাসরি সাইট হটলাইন: ০১৯১৮-৬৪৬৫৭৫ (সকাল ৯টা - সন্ধ্যা ৬টা)</div>
                </div>
              </div>
              <a 
                href="tel:01918646575"
                className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs transition-colors shrink-0"
              >
                সাইটে কল দিন
              </a>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* SECTION 4: PROFILE VIEW & ACCOUNT CONTROLS             */}
        {/* ======================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Profile Overview Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6 text-center">
              {/* Circular Avatar with Camera Icon */}
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
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                  {client?.name}
                </h2>
                <div className="inline-block mt-1 px-3 py-1 rounded-full bg-emerald-100 text-[#006231] font-bold text-xs">
                  আইডি: {client?.id}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  মোবাইল নম্বর: <strong>{client?.phone}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="max-w-md mx-auto space-y-2 pt-2">
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-[#006231]" />
                  <span>প্রোফাইল ছবি পরিবর্তন করুন</span>
                </button>

                <button
                  onClick={onNavigateHome}
                  className="w-full py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Home className="w-4 h-4 text-[#CE2028]" />
                  <span>ওয়েবসাইটে ফিরে যান</span>
                </button>

                <button
                  onClick={onLogout}
                  className="w-full py-3 px-4 rounded-xl bg-red-50 hover:bg-[#CE2028] text-[#CE2028] hover:text-white border border-red-200 text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>লগআউট করুন</span>
                </button>
              </div>
            </div>

            {/* Payment History Statement Table */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">পরিশোধিত কিস্তিসমূহের রেকর্ড</h3>
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
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* 3. STICKY FOOTER NAVBAR (WITH CIRCULAR AVATAR AS LAST TAB) */}
      {/* ========================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl py-1.5 px-2">
        <div className="grid grid-cols-4 max-w-md mx-auto gap-1">
          {/* Tab 1: প্রোপার্টি ও তথ্য */}
          <button
            onClick={() => setActiveTab('details')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'details' ? 'text-[#CE2028] font-black' : 'text-gray-500 hover:text-gray-800 font-semibold'
            }`}
          >
            {activeTab === 'details' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#CE2028] mb-1 animate-pulse"></span>
            )}
            <Building2 className={`w-5 h-5 ${activeTab === 'details' ? 'scale-110 text-[#CE2028]' : 'text-gray-400'} transition-transform`} />
            <span className="text-3xs mt-1 tracking-tight text-center truncate max-w-full">
              প্রোপার্টি
            </span>
          </button>

          {/* Tab 2: কিস্তির হিসাব */}
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'payments' ? 'text-[#CE2028] font-black' : 'text-gray-500 hover:text-gray-800 font-semibold'
            }`}
          >
            {activeTab === 'payments' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#CE2028] mb-1 animate-pulse"></span>
            )}
            <DollarSign className={`w-5 h-5 ${activeTab === 'payments' ? 'scale-110 text-[#CE2028]' : 'text-gray-400'} transition-transform`} />
            <span className="text-3xs mt-1 tracking-tight text-center truncate max-w-full">
              কিস্তির হিসাব
            </span>
          </button>

          {/* Tab 3: কাজের অগ্রগতি */}
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'progress' ? 'text-[#CE2028] font-black' : 'text-gray-500 hover:text-gray-800 font-semibold'
            }`}
          >
            {activeTab === 'progress' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#CE2028] mb-1 animate-pulse"></span>
            )}
            <HardHat className={`w-5 h-5 ${activeTab === 'progress' ? 'scale-110 text-[#CE2028]' : 'text-gray-400'} transition-transform`} />
            <span className="text-3xs mt-1 tracking-tight text-center truncate max-w-full">
              কাজের অগ্রগতি
            </span>
          </button>

          {/* Tab 4: প্রোফাইল (CIRCULAR AVATAR DIRECTLY IN THE FOOTER NAVBAR) */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'profile' ? 'text-[#CE2028] font-black' : 'text-gray-500 hover:text-gray-800 font-semibold'
            }`}
          >
            {activeTab === 'profile' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#CE2028] mb-1 animate-pulse"></span>
            )}
            {/* Render actual circular photo in the footer navbar */}
            <div className="relative">
              {avatarImage ? (
                <img 
                  src={avatarImage} 
                  alt="Profile" 
                  className={`w-6 h-6 rounded-full object-cover transition-all ${
                    activeTab === 'profile' 
                      ? 'ring-2 ring-[#CE2028] scale-110 shadow-xs' 
                      : 'ring-1 ring-gray-300'
                  }`} 
                />
              ) : (
                <div className={`w-6 h-6 rounded-full bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-bold text-3xs transition-all ${
                  activeTab === 'profile' 
                    ? 'ring-2 ring-[#CE2028] scale-110 shadow-xs' 
                    : 'ring-1 ring-gray-300'
                }`}>
                  {client?.name ? client.name.slice(0, 1) : 'প্রো'}
                </div>
              )}
            </div>
            <span className="text-3xs mt-1 tracking-tight text-center truncate max-w-full">
              প্রোফাইল
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
