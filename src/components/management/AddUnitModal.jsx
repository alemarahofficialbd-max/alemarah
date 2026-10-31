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

  const isFlatOrShare = form.type === 'flat' || form.type === 'share';
  const computedTotal = (Number(form.landPrice) || 0) + (Number(form.constructionPrice) || 0);

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
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

          {/* Size */}
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

          {/* PACKAGE DETAILS (For Flat & Share): Inclusions & Separate Land + Construction Price */}
          {isFlatOrShare && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xs font-bold text-slate-700 uppercase tracking-wider">
                    প্যাকেজের অন্তর্ভুক্ত:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#006231] text-xs font-bold border border-emerald-200/80">
                    ফ্ল্যাট + ল্যান্ড শেয়ার
                  </span>
                </div>

                {/* Tickmark: Car Parking */}
                <label className="inline-flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(form.hasParking)}
                    onChange={(e) => setForm({ ...form, hasParking: e.target.checked })}
                    className="w-4 h-4 rounded text-[#CE2028] border-slate-300 focus:ring-[#CE2028] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    {form.hasParking ? '✓ কার পার্কিং সহ' : 'পার্কিং ছাড়া'}
                  </span>
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-2xs font-bold text-slate-700 uppercase tracking-wider">
                    প্যাকেজ মূল্য নির্ধারণ (আলাদাভাবে)
                  </label>
                  {computedTotal > 0 && (
                    <span className="text-xs font-extrabold text-[#006231] font-mono">
                      মোট: ৳ {computedTotal.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-3xs font-bold text-slate-500 mb-0.5">
                      জমির মূল্য / Land Price (টাকা)
                    </label>
                    <input
                      type="number"
                      placeholder="যেমন: 2000000"
                      value={form.landPrice || ''}
                      onChange={(e) => {
                        const land = e.target.value;
                        const constr = form.constructionPrice || '';
                        const total = (Number(land) || 0) + (Number(constr) || 0);
                        setForm({
                          ...form,
                          landPrice: land,
                          price: total > 0 ? String(total) : form.price
                        });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#CE2028]"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-slate-500 mb-0.5">
                      নির্মাণ খরচ / Construction Price (টাকা)
                    </label>
                    <input
                      type="number"
                      placeholder="যেমন: 2500000"
                      value={form.constructionPrice || ''}
                      onChange={(e) => {
                        const constr = e.target.value;
                        const land = form.landPrice || '';
                        const total = (Number(land) || 0) + (Number(constr) || 0);
                        setForm({
                          ...form,
                          constructionPrice: constr,
                          price: total > 0 ? String(total) : form.price
                        });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#CE2028]"
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <label className="block text-3xs font-bold text-slate-500 mb-0.5">
                    মোট আনুমানিক প্যাকেজ মূল্য (টাকা)
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 4500000"
                    value={form.price || ''}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#CE2028]"
                  />
                  <span className="text-3xs text-slate-400 mt-0.5 block">
                    জমির মূল্য ও নির্মাণ খরচ দিলে এটি স্বয়ংক্রিয়ভাবে যোগ হবে (প্রয়োজনে এডিট করা যাবে)।
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Standard Price for shop or parking */}
          {!isFlatOrShare && (
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                বিক্রয় মূল্য (টাকা)
              </label>
              <input
                type="number"
                placeholder="যেমন: 1500000"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
              />
            </div>
          )}

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
