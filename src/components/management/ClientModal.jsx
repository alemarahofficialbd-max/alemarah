import React from 'react';
import { ChevronLeft, X, Users, Upload, Key } from 'lucide-react';
import { getUnitData } from './helpers';

// Full-screen "Add Client" registration view, extracted from ManagementDashboard.
export default function ClientModal({
  isOpen,
  form,
  setForm,
  projects,
  clients,
  isSidebarCollapsed,
  onClose,
  onSubmit
}) {
  if (!isOpen) return null;

  const selProj = projects.find(p => p.id === form.projectId) || projects[0];
  const projectUnits = (selProj?.units || []).map(u => getUnitData(u));
  const soldUnits = clients.filter(c => c.projectId === selProj?.id).map(c => c.flatNo);

  return (
    <div className={`fixed inset-y-0 right-0 left-0 ${isSidebarCollapsed ? "md:left-20" : "md:left-64 lg:left-72"} z-[60] bg-[#F8FAFC] flex flex-col overflow-y-auto animate-fadeIn select-none`}>
      {/* Top Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center space-x-1"
            title="ফিরে যান"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-bold">ফিরে যান</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#CE2028] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">নতুন ক্লায়েন্ট / ফ্ল্যাট ক্রেতা নিবন্ধন</h3>
              <p className="text-3xs text-slate-500">গ্রাহকের বুকিং, ফ্ল্যাট ও কিস্তির তথ্য এন্ট্রি করুন</p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Full Screen Body */}
      <div className="flex-1 py-6 sm:py-8 px-4 sm:px-6 flex justify-center items-start">
        <div className="w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <form onSubmit={onSubmit} className="space-y-4">
          {/* Client Profile Photo Upload Option */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-bold overflow-hidden ring-2 ring-emerald-500/20 shadow-xs shrink-0">
                {form.image ? (
                  <img src={form.image} alt="Client Preview" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-7 h-7 text-white/90" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">কাস্টমারের ছবি (ঐচ্ছিক)</span>
                <span className="text-3xs text-slate-500">প্রোফাইল ও মানি রিসিটে ব্যবহারের জন্য পাসপোর্ট ছবি আপলোড করুন</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <label className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs transition-colors flex items-center space-x-1.5">
                <Upload className="w-3.5 h-3.5 text-[#006231]" />
                <span>{form.image ? 'ছবি পরিবর্তন করুন' : 'ছবি আপলোড করুন'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) {
                      alert('ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে হবে।');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setForm(prev => ({ ...prev, image: event.target.result }));
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              {form.image && (
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                  title="ছবি বাদ দিন"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                কাস্টমারের নাম *
              </label>
              <input
                type="text"
                placeholder="যেমন: মোহাম্মদ আরিফুল ইসলাম"
                value={form.name}
                onChange={(e) => {
                  const val = e.target.value;
                  const autoPrefix = val.toLowerCase().replace(/[^a-z0-9]/g, '');
                  setForm(prev => ({
                    ...prev,
                    name: val,
                    emailPrefix: prev.emailPrefix || autoPrefix
                  }));
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                required
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                মোবাইল নম্বর *
              </label>
              <input
                type="tel"
                placeholder="যেমন: 01711223344"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                required
              />
            </div>
          </div>

          {/* Client Portal Login Credentials (Fixed @alemarah.com & Password) */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-xs">
                <Key className="w-4 h-4 text-amber-600" />
                <span>গ্রাহক পোর্টাল লগইন ও অ্যাকাউন্ট ক্রেডেনশিয়ালস</span>
              </div>
              <span className="text-3xs text-amber-700 font-bold bg-amber-100/70 px-2 py-0.5 rounded-full">
                সিস্টেম অ্যাকাউন্ট
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  গ্রাহক ইউজারনেম *
                </label>
                <div className="flex items-center rounded-xl bg-white border border-slate-200 overflow-hidden focus-within:border-[#CE2028]">
                  <input
                    type="text"
                    placeholder="যেমন: ariful"
                    value={form.emailPrefix}
                    onChange={(e) => setForm({ ...form, emailPrefix: e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, '') })}
                    className="flex-1 px-3 py-2 text-xs font-semibold text-slate-800 outline-none min-w-0"
                  />
                  <span className="px-3 py-2 bg-slate-100 text-slate-600 font-mono font-bold text-xs border-l border-slate-200 shrink-0 select-none">
                    @alemarah.com
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  গ্রাহক এই ইউজারনেম বা মোবাইল নম্বর দিয়ে লগইন করতে পারবেন
                </span>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  লগইন পাসওয়ার্ড *
                </label>
                <input
                  type="text"
                  placeholder="পাসওয়ার্ড লিখুন (ডিফল্ট: password123)"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  গ্রাহককে সহায়তার জন্য এটি সংরক্ষণ করা থাকবে
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                প্রজেক্ট নির্বাচন *
              </label>
              <select
                value={form.projectId}
                onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider">
                  বরাদ্দকৃত ফ্ল্যাট / ইউনিট *
                </label>
                <span className="text-[10px] text-slate-400">ড্রপডাউন থেকে নির্বাচন করুন</span>
              </div>
              <div className="space-y-1.5">
                <select
                  value={form.flatNo}
                  onChange={(e) => setForm({ ...form, flatNo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                  required
                >
                  <option value="">-- ফ্ল্যাট / দোকান / পার্কিং নির্বাচন করুন --</option>
                  {projectUnits.map((u, uIdx) => {
                    const isSold = soldUnits.includes(u.name) || (u.unitNo && soldUnits.some(s => s && s.includes(u.unitNo)));
                    const typeTag = u.type === 'shop' ? 'দোকান' : (u.type === 'parking' ? 'পার্কিং' : (u.type === 'share' ? 'শেয়ার' : 'ফ্ল্যাট'));
                    return (
                      <option key={u.id || uIdx} value={u.name} disabled={isSold}>
                        [{typeTag}] {u.name} {isSold ? '(বিক্রিত / বুকড)' : '(খালি)'}
                      </option>
                    );
                  })}
                  <option value="custom_manual">তালিকায় নেই (ম্যানুয়ালি লিখুন)</option>
                </select>

                {form.flatNo === 'custom_manual' && (
                  <input
                    type="text"
                    placeholder="যেমন: ৯ম তলা, ফ্ল্যাট ৯-এ (১৪৫০ বর্গফুট)"
                    onChange={(e) => setForm({ ...form, flatNo: e.target.value })}
                    className="w-full bg-white border border-[#CE2028] rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none animate-fadeIn"
                    autoFocus
                    required
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                মোট চুক্তি মূল্য *
              </label>
              <input
                type="number"
                placeholder="যেমন: 12000000"
                value={form.totalPrice}
                onChange={(e) => setForm({ ...form, totalPrice: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                required
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                বুকিং মানি / প্রাথমিক জমা
              </label>
              <input
                type="number"
                placeholder="যেমন: 2400000"
                value={form.initialPaid}
                onChange={(e) => setForm({ ...form, initialPaid: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
              />
            </div>
          </div>


          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#991B1B] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#CE2028]/25 hover:opacity-95 transition-all cursor-pointer text-center active:scale-95"
            >
              নিশ্চিত করুন ও ক্লায়েন্ট তৈরি করুন
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
