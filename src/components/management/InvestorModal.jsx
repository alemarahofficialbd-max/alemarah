import React from 'react';
import { ChevronLeft, X, Users } from 'lucide-react';

// Full-screen "Add Investor" view for an Investment Offer (e.g. Agro).
// No flats/sqft here — just an amount within the offer's slab, placed
// into the general tier (fixed tenure) or the director tier (recurring).
export default function InvestorModal({
  isOpen,
  form,
  setForm,
  offer,
  isSidebarCollapsed,
  onClose,
  onSubmit
}) {
  if (!isOpen || !offer) return null;

  const minAllowed = form.tier === 'director'
    ? Number(offer.directorTierMinInvestment) || 0
    : Number(offer.minInvestment) || 0;
  const maxAllowed = form.tier === 'director' ? null : (Number(offer.maxInvestment) || 0);
  const amountNum = Number(form.investedAmount) || 0;
  const amountOk = amountNum >= minAllowed && (maxAllowed === null || amountNum <= maxAllowed);

  return (
    <div className={`fixed inset-y-0 right-0 left-0 ${isSidebarCollapsed ? "md:left-20" : "md:left-64 lg:left-72"} z-[60] bg-[#F8FAFC] flex flex-col overflow-y-auto animate-fadeIn select-none`}>
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
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#006231] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">নতুন ইনভেস্টর যোগ করুন</h3>
              <p className="text-3xs text-slate-500">{offer.name}</p>
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

      <div className="flex-1 py-6 sm:py-8 px-4 sm:px-6 flex justify-center items-start">
        <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <form onSubmit={onSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ইনভেস্টরের নাম *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#006231]"
                  required
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  মোবাইল নম্বর *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#006231]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                টিয়ার *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, tier: 'general' })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    (form.tier || 'general') === 'general'
                      ? 'bg-[#006231] text-white border-[#006231] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  সাধারণ ইনভেস্টর
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, tier: 'director' })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    form.tier === 'director'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ডিরেক্টর টিয়ার (রিকারিং)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                বিনিয়োগের পরিমাণ (টাকা) *
              </label>
              <input
                type="number"
                value={form.investedAmount}
                onChange={(e) => setForm({ ...form, investedAmount: e.target.value })}
                className={`w-full bg-white border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 outline-none ${
                  form.investedAmount && !amountOk ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#006231]'
                }`}
                required
              />
              <span className={`text-[10px] mt-1 block ${form.investedAmount && !amountOk ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                {form.tier === 'director'
                  ? `ডিরেক্টর টিয়ারে সর্বনিম্ন ৳${minAllowed.toLocaleString('bn-BD')} (কোনো সর্বোচ্চ সীমা নেই)`
                  : `সাধারণ টিয়ারে সীমা: ৳${minAllowed.toLocaleString('bn-BD')} – ৳${(maxAllowed || 0).toLocaleString('bn-BD')}`}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-2xs text-slate-600 space-y-1">
              <div>মেয়াদ: <strong>{offer.tenureYears} বছর</strong> {form.tier === 'director' ? '(প্রতি সাইকেলে, রিকারিং)' : '(এক-কালীন)'}</div>
              <div>নেট মুনাফা: <strong>{offer.netProfitPercent}%</strong></div>
              {amountOk && amountNum > 0 && (
                <div>সম্ভাব্য মুনাফা (মেয়াদ শেষে): <strong className="text-[#006231]">৳{Math.round(amountNum * (Number(offer.netProfitPercent) || 0) / 100).toLocaleString('bn-BD')}</strong></div>
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
                disabled={!amountOk}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#006231] to-[#004d26] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#006231]/25 hover:opacity-95 transition-all cursor-pointer text-center active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                নিশ্চিত করুন ও ইনভেস্টর যোগ করুন
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
