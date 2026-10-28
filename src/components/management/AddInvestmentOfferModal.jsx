import React from 'react';
import { ChevronLeft, X, TrendingUp } from 'lucide-react';

// Full-screen "Add Investment Offer" view (e.g. Agro & Livestock) — these
// have no flats/sqft, just a min/max investment slab, tenure, and a flat
// net-profit rate, plus a separate recurring "director tier".
export default function AddInvestmentOfferModal({
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
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#006231] flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">নতুন ইনভেস্টমেন্ট অফার যোগ করুন</h3>
              <p className="text-3xs text-slate-500">এগ্রো / লাইভস্টক জাতীয় প্রকল্প — ফ্ল্যাট/স্কয়ারফিট নেই, শুধু বিনিয়োগ স্ল্যাব</p>
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

      <div className="flex-1 py-6 sm:py-8 px-4 sm:px-6 flex justify-center items-start">
        <div className="w-full max-w-2xl bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <form onSubmit={onSubmit} className="space-y-3.5">
            <div>
              <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                অফারের নাম *
              </label>
              <input
                type="text"
                placeholder="যেমন: আল-ইমারাহ এগ্রো ফার্ম"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-[#006231] focus:border-[#006231] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                লোকেশন
              </label>
              <input
                type="text"
                placeholder="যেমন: গাজীপুর, ঢাকা"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-[#006231] focus:border-[#006231] transition-all"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
              <div className="text-2xs font-extrabold text-[#006231] uppercase tracking-wider">সাধারণ ইনভেস্টর স্ল্যাব</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    সর্বনিম্ন বিনিয়োগ (টাকা) *
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 100000"
                    value={form.minInvestment}
                    onChange={(e) => setForm({ ...form, minInvestment: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#006231]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    সর্বোচ্চ বিনিয়োগ (টাকা) *
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 1000000"
                    value={form.maxInvestment}
                    onChange={(e) => setForm({ ...form, maxInvestment: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#006231]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    মেয়াদ (বছর) *
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 3"
                    value={form.tenureYears}
                    onChange={(e) => setForm({ ...form, tenureYears: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#006231]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  নেট মুনাফা % (পুরো মেয়াদ শেষে) *
                </label>
                <input
                  type="number"
                  placeholder="যেমন: 65"
                  value={form.netProfitPercent}
                  onChange={(e) => setForm({ ...form, netProfitPercent: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#006231]"
                  required
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <div className="text-2xs font-extrabold text-amber-700 uppercase tracking-wider">ডিরেক্টর টিয়ার (রিকারিং)</div>
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ন্যূনতম বিনিয়োগ (টাকা) *
                </label>
                <input
                  type="number"
                  placeholder="যেমন: 500000"
                  value={form.directorTierMinInvestment}
                  onChange={(e) => setForm({ ...form, directorTierMinInvestment: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-amber-500"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  একই মুনাফা হারে (উপরের নেট মুনাফা %), কিন্তু মেয়াদ ফিক্সড না — প্রতি {form.tenureYears || 'X'} বছর পর পর নতুন cycle শুরু হয় (তুলে না নেওয়া পর্যন্ত চলতে থাকে)।
                </span>
              </div>
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                বিবরণ (ঐচ্ছিক)
              </label>
              <textarea
                rows={3}
                placeholder="অফার সম্পর্কে সংক্ষিপ্ত বিবরণ"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-[#006231] focus:border-[#006231] transition-all"
              />
            </div>

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
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-[#006231] to-[#004d26] text-white font-bold text-xs shadow-md shadow-[#006231]/20 hover:opacity-95 transition-all cursor-pointer text-center active:scale-95"
              >
                অফার তৈরি করুন
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
