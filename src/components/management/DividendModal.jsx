import React from 'react';
import { ChevronLeft, X, TrendingUp } from 'lucide-react';

// Full-screen "Dividend Payout" entry view, extracted from ManagementDashboard.
export default function DividendModal({
  isOpen,
  targetDirector,
  form,
  setForm,
  isSidebarCollapsed,
  onClose,
  onSubmit
}) {
  if (!isOpen || !targetDirector) return null;

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
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">লভ্যাংশ / ডিভিডেন্ড প্রদান এন্ট্রি</h3>
              <p className="text-3xs text-slate-500">{targetDirector.name} ({targetDirector.sharePercentage}% শেয়ার)</p>
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
            <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
              প্রদেয় লভ্যাংশের পরিমাণ *
            </label>
            <input
              type="number"
              required
              placeholder="উদাঃ 500000"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-purple-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                বিতরণের তারিখ
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-600 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                ভাউচার নম্বর
              </label>
              <input
                type="text"
                value={form.voucherNo}
                onChange={(e) => setForm({ ...form, voucherNo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
              পরিশোধের মাধ্যম
            </label>
            <select
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-600"
            >
              <option value="ব্যাংক অ্যাকাউন্ট ট্রান্সফার">ব্যাংক একাউন্ট ট্রান্সফার</option>
              <option value="ব্যাংক চেক">অ্যাকাউন্ট পেয়ী চেক</option>
              <option value="পে-অর্ডার">পে-অর্ডার</option>
            </select>
          </div>

          <div>
            <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
              বিবরণ
            </label>
            <input
              type="text"
              placeholder="যেমন: ২০২৪ অর্থ-বছরের বার্ষিক ডিভিডেন্ড"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-600"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-700/20 active:scale-95 transition-all"
            >
              ডিভিডেন্ড ভাউচার ইস্যু করুন
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
