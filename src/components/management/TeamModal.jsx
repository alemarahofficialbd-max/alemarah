import React from 'react';
import { ChevronLeft, X, Crown, ShieldCheck, CheckSquare, Square } from 'lucide-react';

export const PERMISSION_OPTIONS = [
  { id: 'clients', label: '১. ক্লায়েন্ট তালিকা ও নতুন এন্ট্রি', desc: 'গ্রাহকের প্রোফাইল, বুকিং ও ফ্ল্যাট বরাদ্দ' },
  { id: 'payments', label: '২. পেমেন্ট ও জমা এন্ট্রি', desc: 'কিস্তি ও কালেকশন মানি রিসিট ভাউচার' },
  { id: 'projects', label: '৩. প্রজেক্ট কন্ট্রোল', desc: 'প্রকল্প তৈরি, এডিট, ফ্ল্যাট ইউনিট ও প্রাইসিং' },
  { id: 'expenses', label: '৪. প্রজেক্ট বাজেট ও খরচ', desc: 'নির্মাণ খরচ, অফিস ব্যয় ও ক্যাশ বুক' },
  { id: 'investments', label: '৫. ইনভেস্টমেন্ট ও শেয়ার প্যাকেজ', desc: 'বিনিয়োগ অফার, শেয়ারহোল্ডার ও পেআউট' },
  { id: 'directors', label: '৬. বোর্ড অব ডিরেক্টরস ও শেয়ার', desc: 'পরিচালনা পর্ষদ, মূলধন জমা ও লভ্যাংশ' },
  { id: 'inquiries', label: '৭. ইনকোয়ারি ও ওয়েবসাইট লিড', desc: 'সাইট ভিজিট অনুরোধ ও কন্ট্যাক্ট ফর্ম লিড' },
  { id: 'jobs', label: '৮. চাকরির আবেদন ও সিভি', desc: 'আবেদনকারী সিভি, ইন্টারভিউ শিডিউলিং' },
  { id: 'team', label: '৯. অ্যাডমিন ও টিম কন্ট্রোল', desc: 'অন্যান্য কর্মকর্তাদের ভূমিকা ও পারমিশন কন্ট্রোল' }
];

// Full-screen "Add / Edit Team Member & Permissions" view - Staff Officers only
export default function TeamModal({
  isOpen,
  editingTeamMember,
  form,
  setForm,
  isSidebarCollapsed,
  onClose,
  onSubmit
}) {
  if (!isOpen) return null;

  const currentPermissions = Array.isArray(form.permissions) ? form.permissions : [];

  const handleToggleAllPermissions = (selectAll) => {
    if (selectAll) {
      setForm({ ...form, permissions: PERMISSION_OPTIONS.map(p => p.id) });
    } else {
      setForm({ ...form, permissions: [] });
    }
  };

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
            {editingTeamMember?.isSuperAdmin ? (
              <Crown className="w-5 h-5 text-amber-500" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-[#006231]" />
            )}
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editingTeamMember
                  ? (editingTeamMember.isSuperAdmin ? 'সুপার অ্যাডমিন তথ্য ও পাসওয়ার্ড সম্পাদনা' : 'কর্মকর্তার তথ্য ও পারমিশন সম্পাদনা')
                  : 'নতুন অফিস স্টাফ / কর্মকর্তা যুক্ত করুন'}
              </h3>
              <p className="text-3xs text-slate-500">অফিস কর্মকর্তা রোল ও অ্যাক্সেস কন্ট্রোল</p>
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
      <div className="flex-1 py-6 sm:py-8 pb-32 sm:pb-16 px-4 sm:px-6 flex justify-center items-start">
        <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                কর্মকর্তার নাম *
              </label>
              <input
                type="text"
                placeholder="যেমন: প্রকৌশলী মাহমুদুর রহমান"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  মোবাইল নম্বর *
                </label>
                <input
                  type="tel"
                  placeholder="যেমন: 01918646575"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                  required
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ইমেইল (ঐচ্ছিক)
                </label>
                <input
                  type="email"
                  placeholder="officer@alemarah.com"
                  value={form.email || ''}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                />
              </div>
            </div>

            {!editingTeamMember?.isSuperAdmin && (
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  পদবী / নির্ধারিত রোল
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                >
                  <option value="সাইট ইঞ্জিনিয়ার">সাইট ইঞ্জিনিয়ার</option>
                  <option value="প্রজেক্ট ডিরেক্টর / সাইট ইনচার্জ">প্রজেক্ট ডিরেক্টর / সাইট ইনচার্জ</option>
                  <option value="হেড অফ অ্যাকাউন্টস & ফাইন্যান্স">হেড অফ অ্যাকাউন্টস & ফাইন্যান্স</option>
                  <option value="সেলস অ্যান্ড মার্কেটিং ম্যানেজার">সেলস অ্যান্ড মার্কেটিং ম্যানেজার</option>
                  <option value="এইচআর ও রিক্রুটমেন্ট অফিসার">এইচআর ও রিক্রুটমেন্ট অফিসার</option>
                  <option value="ইনভেস্টর রিলেশন অফিসার">ইনভেস্টর রিলেশন অফিসার</option>
                  <option value="কাস্টমার সাপোর্ট ও ফ্রন্ট ডেস্ক">কাস্টমার সাপোর্ট ও ফ্রন্ট ডেস্ক</option>
                  <option value="আইন ও কমপ্লায়েন্স অফিসার">আইন ও কমপ্লায়েন্স অফিসার</option>
                  <option value="অফিস স্টাফ">অফিস স্টাফ</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  এটা শুধু নাম/পদবী — এতে কোনো এক্সেস নির্ধারণ হয় না। নিচের পারমিশন চেকবক্সগুলো ঠিক করে দেয় এই কর্মকর্তা কোন কোন সেকশনে কাজ করতে পারবেন।
                </span>
              </div>
            )}

            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {editingTeamMember ? 'নতুন পাসওয়ার্ড সেট করুন (ঐচ্ছিক)' : 'লগইন অ্যাক্সেস কী / পাসওয়ার্ড *'}
              </label>
              <input
                type="text"
                value={form.accessKey}
                onChange={(e) => setForm({ ...form, accessKey: e.target.value })}
                placeholder={editingTeamMember ? 'ফাঁকা রাখলে বর্তমান পাসওয়ার্ড অপরিবর্তিত থাকবে' : 'যেমন: admin123'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                required={!editingTeamMember}
              />
              {editingTeamMember && (
                <span className="text-[10px] text-slate-500 mt-1 block">
                  নিরাপত্তার জন্য বর্তমান পাসওয়ার্ড দেখানো হয় না — পরিবর্তন করতে চাইলে নতুন একটি লিখুন
                </span>
              )}
            </div>

            {!editingTeamMember?.isSuperAdmin && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider">
                    অনুমোদিত দায়িত্ব ও পারমিশনসমূহ ({currentPermissions.length}/{PERMISSION_OPTIONS.length}):
                  </label>
                  <div className="flex items-center space-x-2 text-3xs font-bold">
                    <button
                      type="button"
                      onClick={() => handleToggleAllPermissions(true)}
                      className="px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#006231] border border-emerald-200 transition-colors cursor-pointer"
                    >
                      সব সিলেক্ট করুন
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleAllPermissions(false)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                    >
                      সব আনচেক করুন
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  {PERMISSION_OPTIONS.map(p => {
                    const isChecked = currentPermissions.includes(p.id);
                    return (
                      <label 
                        key={p.id} 
                        className={`flex items-start space-x-2.5 p-2 rounded-xl border transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-emerald-50/70 border-emerald-200/90 text-slate-900 shadow-2xs' 
                            : 'bg-white border-slate-200/70 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const next = e.target.checked ? [...currentPermissions, p.id] : currentPermissions.filter(x => x !== p.id);
                            setForm({ ...form, permissions: next });
                          }}
                          className="w-4 h-4 mt-0.5 text-[#006231] rounded accent-[#006231] cursor-pointer"
                        />
                        <div className="min-w-0 flex-1">
                          <span className={`block text-xs font-bold leading-tight ${isChecked ? 'text-[#006231]' : 'text-slate-800'}`}>
                            {p.label}
                          </span>
                          <span className="block text-3xs text-slate-500 leading-snug mt-0.5">
                            {p.desc}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

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
                {editingTeamMember ? 'আপডেট করুন' : 'কর্মকর্তা সংরক্ষণ করুন'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
