import React from 'react';
import { ChevronLeft, X, Crown, ShieldCheck } from 'lucide-react';

const PERMISSION_OPTIONS = [
  { id: 'projects', label: 'প্রজেক্ট কন্ট্রোল' },
  { id: 'expenses', label: 'খরচ ও ব্যয় এন্ট্রি' },
  { id: 'clients', label: 'ক্লায়েন্ট তালিকা' },
  { id: 'payments', label: 'কিস্তি ও জমা এন্ট্রি' }
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
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  অনুমোদিত দায়িত্ব ও পারমিশনসমূহ:
                </label>
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-2xs font-semibold text-slate-700">
                  {PERMISSION_OPTIONS.map(p => {
                    const isChecked = (form.permissions || []).includes(p.id);
                    return (
                      <label key={p.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const curr = form.permissions || [];
                            const next = e.target.checked ? [...curr, p.id] : curr.filter(x => x !== p.id);
                            setForm({ ...form, permissions: next });
                          }}
                          className="w-3.5 h-3.5 text-[#006231] rounded"
                        />
                        <span>{p.label}</span>
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
