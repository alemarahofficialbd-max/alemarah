import React from 'react';
import { ChevronLeft, X, Building2 } from 'lucide-react';

// Full-screen "Add New Project" view, extracted from ManagementDashboard.
export default function AddProjectModal({
  isOpen,
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
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#CE2028] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">নতুন প্রজেক্ট যোগ করুন</h3>
              <p className="text-3xs text-slate-500">প্রজেক্টের বিবরণ, অবস্থান, বাজেট ও কনফিগারেশন</p>
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
        <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                প্রজেক্টের নাম *
              </label>
              <input
                type="text"
                placeholder="যেমন: আল-ইমারাহ হাইটস"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                required
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                লোকেশন / ঠিকানা *
              </label>
              <input
                type="text"
                placeholder="যেমন: পশ্চিম সানারপাড়, মদিনাবাগ, ডেমরা, ঢাকা"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  মোট আনুমানিক বাজেট (টাকা) *
                </label>
                <input
                  type="number"
                  placeholder="যেমন: 85000000"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                  required
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  প্রজেক্টের ধরন / টাইপ *
                </label>
                <select
                  value={form.projectType}
                  onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                >
                  <option value="residential">আবাসিক ফ্ল্যাট প্রকল্প</option>
                  <option value="commercial">বাণিজ্যিক কমপ্লেক্স / শপিং মল</option>
                  <option value="mixed">মিক্সড ইউজ (আবাসিক ও বাণিজ্যিক)</option>
                  <option value="share">জমি শেয়ার ভিত্তিক ফ্ল্যাট প্রকল্প</option>
                  <option value="agro">এগ্রো ও লাইভস্টক প্রকল্প</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  মোট তলা / ফ্লোর সংখ্যা
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={form.totalFloors}
                  onChange={(e) => setForm({ ...form, totalFloors: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  বর্তমান অগ্রগতি (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.progress}
                  onChange={(e) => setForm({ ...form, progress: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  হস্তান্তর টার্গেট তারিখ
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ডিসেম্বর ২০২৮"
                  value={form.handoverDate}
                  onChange={(e) => setForm({ ...form, handoverDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                />
              </div>
            </div>

            {/* Optional Auto-generation Option */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.autoGenerateUnits}
                  onChange={(e) => setForm({ ...form, autoGenerateUnits: e.target.checked })}
                  className="w-4 h-4 rounded text-[#CE2028] focus:ring-[#CE2028] cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">
                  শুরুতেই প্রাথমিক ফ্ল্যাট ড্রাফট তৈরি করতে চান? (অপশনাল)
                </span>
              </label>

              {form.autoGenerateUnits ? (
                <div className="pt-2 border-t border-slate-200/80 space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-3xs font-bold text-slate-600 uppercase mb-1">প্রতি তলায় ফ্ল্যাট</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={form.unitsPerFloor}
                        onChange={(e) => setForm({ ...form, unitsPerFloor: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-3xs font-bold text-slate-600 uppercase mb-1">ডিফল্ট ফ্ল্যাট সাইজ (বর্গফুট)</label>
                      <input
                        type="text"
                        placeholder="যেমন: 1265"
                        value={form.defaultUnitSize}
                        onChange={(e) => setForm({ ...form, defaultUnitSize: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    স্বয়ংক্রিয়ভাবে {Math.max(0, ((Number(form.totalFloors) || 10) - 1) * (Number(form.unitsPerFloor) || 2))}টি ফ্ল্যাট (প্রতিটি {form.defaultUnitSize || 1265} বর্গফুট) তৈরি হবে।
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  💡 প্রজেক্টটি তৈরি হওয়ার সাথে সাথেই বিস্তারিত প্যানেল খুলে যাবে, যেখান থেকে আপনি যেকোনো সময় নির্দিষ্ট সাইজ অনুযায়ী ফ্ল্যাট, দোকান বা পার্কিং স্লট আলাদাভাবে যুক্ত করতে পারবেন।
                </p>
              )}
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
                প্রজেক্ট তৈরি ও কনফিগার করুন
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
