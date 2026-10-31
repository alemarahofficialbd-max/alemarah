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
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center space-x-1"
            title="ফিরে যান"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-bold">ফিরে যান</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#CE2028] flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">নতুন প্রজেক্ট যোগ করুন</h3>
              <p className="text-3xs text-slate-500">প্রজেক্টের বিবরণ, অবস্থান, বাজেট ও ধরন নির্ধারণ করুন</p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Full Screen Body */}
      <div className="flex-1 py-6 sm:py-8 px-4 sm:px-6 flex justify-center items-start">
        <div className="w-full max-w-2xl bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <form onSubmit={onSubmit} className="space-y-3.5">
            <div>
              <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                প্রজেক্টের নাম *
              </label>
              <input
                type="text"
                placeholder="যেমন: আল-ইমারাহ হাইটস"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-[#CE2028] focus:border-[#CE2028] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                লোকেশন / ঠিকানা *
              </label>
              <input
                type="text"
                placeholder="যেমন: পশ্চিম সানারপাড়, মদিনাবাগ, ডেমরা, ঢাকা"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-[#CE2028] focus:border-[#CE2028] transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  মোট আনুমানিক বাজেট (টাকা) *
                </label>
                <input
                  type="number"
                  placeholder="যেমন: 85000000"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-[#CE2028] focus:border-[#CE2028] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  প্রজেক্টের ধরন / টাইপ *
                </label>
                <select
                  value={form.projectType}
                  onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#CE2028] focus:border-[#CE2028] cursor-pointer transition-all"
                >
                  <option value="residential">আবাসিক ফ্ল্যাট প্রকল্প</option>
                  <option value="commercial">বাণিজ্যিক কমপ্লেক্স / শপিং মল</option>
                  <option value="mixed">মিক্সড ইউজ (আবাসিক ও বাণিজ্যিক)</option>
                  <option value="share">জমি শেয়ার ভিত্তিক ফ্ল্যাট প্রকল্প</option>
                </select>
                <p className="text-3xs text-slate-400 mt-1">
                  এগ্রো / লাইভস্টক বা বিনিয়োগ-ভিত্তিক অফারের জন্য "ইনভেস্টমেন্ট অফার" সেকশন ব্যবহার করুন — ফ্ল্যাট/sqft এখানে প্রযোজ্য না।
                </p>
              </div>
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                দাম নির্ধারণের পদ্ধতি *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, pricingMode: 'package' })}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    form.pricingMode === 'package'
                      ? 'bg-[#CE2028] text-white border-[#CE2028] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  শুধু প্যাকেজ
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, pricingMode: 'sqft' })}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    form.pricingMode === 'sqft'
                      ? 'bg-[#CE2028] text-white border-[#CE2028] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  শুধু স্কয়ারফিট
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, pricingMode: 'both' })}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    form.pricingMode === 'both'
                      ? 'bg-[#CE2028] text-white border-[#CE2028] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  দুটোই
                </button>
              </div>
              <p className="text-3xs text-slate-400 mt-1">
                এই প্রজেক্টে ক্লায়েন্ট add করার সময় শুধু এই সিলেক্ট করা পদ্ধতি(গুলো)-ই দেখাবে — ভুল মোড বাছার ঝামেলা থাকবে না।
              </p>
            </div>

            {form.pricingMode !== 'package' && (
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  গড় / বেস প্রতি স্কয়ার ফিট দাম (টাকা) — ঐচ্ছিক
                </label>
                <input
                  type="number"
                  placeholder="যেমন: 8500 (ফাঁকা রাখলেও সমস্যা নেই)"
                  value={form.pricePerSqft}
                  onChange={(e) => setForm({ ...form, pricePerSqft: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-[#CE2028] focus:border-[#CE2028] transition-all"
                />
                <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-3xs leading-relaxed">
                  💡 <strong>ফ্ল্যাট ভেদে আলাদা রেট:</strong> একেক ফ্ল্যাটের দাম একেক রকম হয় — যেমন রাস্তার পাশের ফ্ল্যাট বা কর্নার ইউনিটে বেশি রেট, আবার ভেতরের ফ্ল্যাটে আলাদা রেট হতে পারে। তাই এখানে পুরো প্রজেক্টের একটিমাত্র ফিক্সড রেট দেওয়া বাধ্যতামূলক নয়। ক্লায়েন্টকে ফ্ল্যাট বরাদ্দ করার সময় প্রতিটি ফ্ল্যাটের নির্দিষ্ট রেট (যেমন: রাস্তার পাশে ১০,৫০০ বা ভেতরে ৮,৫০০) আলাদাভাবে বসাতে পারবেন।
                </div>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#991B1B] text-white font-bold text-xs shadow-md shadow-[#CE2028]/20 hover:opacity-95 transition-all cursor-pointer text-center active:scale-95"
              >
                প্রজেক্ট তৈরি করুন
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
