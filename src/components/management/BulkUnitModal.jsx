import React from 'react';
import { X, Layers } from 'lucide-react';

// Modal: smart bulk flats generator for a project.
export default function BulkUnitModal({
  isOpen,
  project,
  config,
  setConfig,
  onClose,
  onSubmit
}) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">স্মার্ট বাল্ক ফ্ল্যাট জেনারেটর</h3>
              <p className="text-3xs text-slate-500">এক ক্লিকে একাধিক তলার ফ্ল্যাট তৈরি করুন</p>
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
            onSubmit(project.id, config);
          }}
          className="space-y-3.5"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                শুরুর তলা / ফ্লোর *
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={config.startFloor}
                onChange={(e) => setConfig({ ...config, startFloor: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                required
              />
            </div>
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                শেষ তলা / ফ্লোর *
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={config.endFloor}
                onChange={(e) => setConfig({ ...config, endFloor: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                প্রতি তলায় ফ্ল্যাট সংখ্যা *
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={config.unitsPerFloor}
                onChange={(e) => setConfig({ ...config, unitsPerFloor: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                required
              />
            </div>
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                ডিফল্ট সাইজ (বর্গফুট) *
              </label>
              <input
                type="text"
                placeholder="যেমন: 1265"
                value={config.defaultSizeSqft}
                onChange={(e) => setConfig({ ...config, defaultSizeSqft: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                বেডরুম সংখ্যা
              </label>
              <input
                type="text"
                value={config.beds}
                onChange={(e) => setConfig({ ...config, beds: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
              />
            </div>
            <div>
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                বাথরুম সংখ্যা
              </label>
              <input
                type="text"
                value={config.baths}
                onChange={(e) => setConfig({ ...config, baths: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-[11px] text-[#006231] font-medium leading-relaxed">
            ✨ {config.startFloor}ম থেকে {config.endFloor}ম তলা পর্যন্ত মোট {Math.max(0, (Number(config.endFloor) - Number(config.startFloor) + 1) * Number(config.unitsPerFloor))}টি ফ্ল্যাট (প্রতিটি {config.defaultSizeSqft} বর্গফুট) তৈরি হবে। তৈরির পর যেকোনো ফ্ল্যাটের সাইজ বা দর আপনি আলাদাভাবে পরিবর্তন করতে পারবেন।
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
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-[#CE2028] text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
            >
              একসাথে তৈরি করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
