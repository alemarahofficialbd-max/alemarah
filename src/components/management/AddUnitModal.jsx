import React from 'react';
import { X, Plus, Home, Store, Car } from 'lucide-react';

// Modal: add a single unit (flat / shop / parking) to a project's inventory.
export default function AddUnitModal({
  isOpen,
  project,
  form,
  setForm,
  onClose,
  onSubmit
}) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#CE2028] flex items-center justify-center font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">নতুন ইউনিট যোগ করুন</h3>
              <p className="text-3xs text-slate-500">{project.name}-এর ইনভেন্টরি</p>
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(project.id, form);
          }}
          className="space-y-3.5"
        >
          {/* Unit Type Selection */}
          <div>
            <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              ইউনিটের ধরন / টাইপ *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'flat' })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-all ${
                  form.type === 'flat'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>ফ্ল্যাট</span>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'shop' })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-all ${
                  form.type === 'shop'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>দোকান / স্পেস</span>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'parking' })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-all ${
                  form.type === 'parking'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>পার্কিং স্লট</span>
              </button>
            </div>
          </div>

          {/* Floor & Unit Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                তলা / ফ্লোর / লেভেল *
              </label>
              <input
                type="text"
                placeholder="যেমন: ৫ম তলা বা গ্রাউন্ড ফ্লোর বা বেসমেন্ট-১"
                value={form.floor}
                onChange={(e) => setForm({ ...form, floor: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                required
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                ইউনিট / ফ্ল্যাট নম্বর *
              </label>
              <input
                type="text"
                placeholder="যেমন: ফ্ল্যাট ৫-বি বা দোকান নং জি-০১ বা P-12"
                value={form.unitNo}
                onChange={(e) => setForm({ ...form, unitNo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                required
              />
            </div>
          </div>

          {/* Size & Estimated Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                সাইজ (বর্গফুট / Sq. Ft.) {form.type === 'parking' ? '(অপশনাল)' : '*'}
              </label>
              <input
                type="text"
                placeholder="যেমন: 1265 বা 1450"
                value={form.sizeSqft}
                onChange={(e) => setForm({ ...form, sizeSqft: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                required={form.type !== 'parking'}
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                আনুমানিক বিক্রয় মূল্য (টাকা)
              </label>
              <input
                type="number"
                placeholder="যেমন: 4500000"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
              />
            </div>
          </div>

          {/* Beds & Baths (Only for Flat) */}
          {form.type === 'flat' && (
            <div className="grid grid-cols-2 gap-3 animate-fadeIn">
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  বেডরুম সংখ্যা
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ৩"
                  value={form.beds}
                  onChange={(e) => setForm({ ...form, beds: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  বাথরুম সংখ্যা
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ৩"
                  value={form.baths}
                  onChange={(e) => setForm({ ...form, baths: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              অতিরিক্ত বিবরণ / নোট
            </label>
            <input
              type="text"
              placeholder="যেমন: দক্ষিণমুখী, কর্নার ফ্ল্যাট, সামনের রাস্তা সংলগ্ন"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-[#CE2028]"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#991B1B] text-white font-bold text-xs shadow-md shadow-[#CE2028]/25 hover:opacity-95 transition-all cursor-pointer active:scale-95"
            >
              ইউনিট সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
