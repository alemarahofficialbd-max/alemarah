import React from 'react';
import { ChevronLeft, X, Users, Upload, Key, Plus, Trash2, UserCheck } from 'lucide-react';
import { getUnitData } from './helpers';

// Full-screen "Add Client" registration view, extracted from ManagementDashboard.
// Supports two modes:
//  - New customer: enter identity (name/phone/password) once, then one or
//    more units (flat/shop) can be added in the same submission.
//  - Existing customer: pick an already-registered customer and just add
//    one or more extra units under their existing login.
export default function ClientModal({
  isOpen,
  form,
  setForm,
  projects,
  clients,
  customers,
  emptyUnitRow,
  isSidebarCollapsed,
  onClose,
  onSubmit
}) {
  if (!isOpen) return null;

  const isExisting = Boolean(form.existingCustomerId);
  const selectedCustomer = isExisting
    ? (customers || []).find(c => c.id === form.existingCustomerId)
    : null;

  const updateUnit = (idx, patch) => {
    setForm(prev => ({
      ...prev,
      units: prev.units.map((u, i) => (i === idx ? { ...u, ...patch } : u))
    }));
  };

  const addUnitRow = () => {
    setForm(prev => ({ ...prev, units: [...prev.units, emptyUnitRow()] }));
  };

  const removeUnitRow = (idx) => {
    setForm(prev => ({ ...prev, units: prev.units.filter((_, i) => i !== idx) }));
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
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#CE2028] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">ক্লায়েন্ট / ফ্ল্যাট ক্রেতা নিবন্ধন</h3>
              <p className="text-3xs text-slate-500">নতুন গ্রাহক যোগ করুন, অথবা বিদ্যমান গ্রাহকের জন্য আরও ইউনিট যুক্ত করুন</p>
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
        <div className="w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <form onSubmit={onSubmit} className="space-y-4">

          {/* Customer Mode Switch */}
          <div>
            <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              গ্রাহক নির্বাচন
            </label>
            <select
              value={form.existingCustomerId}
              onChange={(e) => setForm(prev => ({ ...prev, existingCustomerId: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
            >
              <option value="">+ নতুন গ্রাহক নিবন্ধন করুন</option>
              {(customers || []).map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
              ))}
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">
              বিদ্যমান কোনো গ্রাহক বেছে নিলে তার নাম/ফোন/পাসওয়ার্ড একই থাকবে — শুধু নতুন ইউনিট(গুলো) যুক্ত হবে
            </span>
          </div>

          {isExisting && selectedCustomer ? (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-[#006231] text-white flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">{selectedCustomer.name}</div>
                <div className="text-2xs text-slate-500">{selectedCustomer.phone} • বিদ্যমান লগইন ব্যবহার হবে</div>
              </div>
            </div>
          ) : (
            <>
              {/* Client Profile Photo Upload Option */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-bold overflow-hidden ring-2 ring-emerald-500/20 shadow-xs shrink-0">
                    {form.image ? (
                      <img src={form.image} alt="Client Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-7 h-7 text-white/90" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">কাস্টমারের ছবি (ঐচ্ছিক)</span>
                    <span className="text-3xs text-slate-500">প্রোফাইল ও মানি রিসিটে ব্যবহারের জন্য পাসপোর্ট ছবি আপলোড করুন</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <label className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs transition-colors flex items-center space-x-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#006231]" />
                    <span>{form.image ? 'ছবি পরিবর্তন করুন' : 'ছবি আপলোড করুন'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024) {
                          alert('ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে হবে।');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setForm(prev => ({ ...prev, image: event.target.result }));
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  {form.image && (
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                      title="ছবি বাদ দিন"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    কাস্টমারের নাম *
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: মোহাম্মদ আরিফুল ইসলাম"
                    value={form.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      const autoPrefix = val.toLowerCase().replace(/[^a-z0-9]/g, '');
                      setForm(prev => ({
                        ...prev,
                        name: val,
                        emailPrefix: prev.emailPrefix || autoPrefix
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    placeholder="যেমন: 01711223344"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                    required
                  />
                </div>
              </div>

              {/* Client Portal Login Credentials */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-xs">
                    <Key className="w-4 h-4 text-amber-600" />
                    <span>গ্রাহক পোর্টাল লগইন</span>
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    লগইন পাসওয়ার্ড *
                  </label>
                  <input
                    type="text"
                    placeholder="পাসওয়ার্ড লিখুন (ডিফল্ট: password123)"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    গ্রাহক তার মোবাইল নম্বর ও এই পাসওয়ার্ড দিয়ে লগইন করবেন
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Unit(s) Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between pt-3">
              <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider">
                ফ্ল্যাট / ইউনিট তথ্য {form.units.length > 1 ? `(${form.units.length}টি)` : ''}
              </label>
              <button
                type="button"
                onClick={addUnitRow}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#006231] text-2xs font-bold border border-emerald-200 cursor-pointer inline-flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>আরেকটি ইউনিট যোগ করুন</span>
              </button>
            </div>

            {form.units.map((unit, idx) => {
              const selProj = projects.find(p => p.id === unit.projectId) || projects[0];
              const projectUnits = (selProj?.units || []).map(u => getUnitData(u));
              const soldUnits = clients.filter(c => c.projectId === selProj?.id).map(c => c.flatNo);
              const allowedPricingModes = selProj?.pricingMode === 'package' ? ['package'] : selProj?.pricingMode === 'sqft' ? ['sqft'] : ['package', 'sqft'];
              const effectivePricingMode = allowedPricingModes.includes(unit.pricingMode) ? unit.pricingMode : allowedPricingModes[0];

              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3 relative">
                  {form.units.length > 1 && (
                    <div className="flex items-center justify-between">
                      <span className="text-3xs font-bold text-slate-500">ইউনিট #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeUnitRow(idx)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="এই ইউনিট বাদ দিন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        প্রজেক্ট নির্বাচন *
                      </label>
                      <select
                        value={unit.projectId}
                        onChange={(e) => updateUnit(idx, { projectId: e.target.value, flatNo: '' })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                      >
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider">
                          বরাদ্দকৃত ফ্ল্যাট / ইউনিট *
                        </label>
                      </div>
                      <div className="space-y-1.5">
                        <select
                          value={unit.flatNo}
                          onChange={(e) => {
                            const flatNo = e.target.value;
                            if (effectivePricingMode === 'sqft') {
                              const picked = projectUnits.find(u => u.name === flatNo);
                              const sqft = picked?.sizeSqft || unit.sizeSqft || '';
                              const currentRate = Number(unit.ratePerSqft || selProj?.pricePerSqft) || 0;
                              updateUnit(idx, { 
                                flatNo, 
                                sizeSqft: sqft, 
                                ratePerSqft: unit.ratePerSqft || (selProj?.pricePerSqft ? String(selProj.pricePerSqft) : ''),
                                totalPrice: currentRate > 0 && sqft ? String(Math.round(Number(sqft) * currentRate)) : unit.totalPrice 
                              });
                            } else {
                              updateUnit(idx, { flatNo });
                            }
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                          required
                        >
                          <option value="">-- ফ্ল্যাট / দোকান / পার্কিং নির্বাচন করুন --</option>
                          {projectUnits.map((u, uIdx) => {
                            const isSold = soldUnits.includes(u.name) || (u.unitNo && soldUnits.some(s => s && s.includes(u.unitNo)));
                            const typeTag = u.type === 'shop' ? 'দোকান' : (u.type === 'parking' ? 'পার্কিং' : (u.type === 'share' ? 'শেয়ার' : 'ফ্ল্যাট'));
                            return (
                              <option key={u.id || uIdx} value={u.name} disabled={isSold}>
                                [{typeTag}] {u.name} {isSold ? '(বিক্রিত / বুকড)' : '(খালি)'}
                              </option>
                            );
                          })}
                          <option value="custom_manual">তালিকায় নেই (ম্যানুয়ালি লিখুন)</option>
                        </select>

                        {unit.flatNo === 'custom_manual' && (
                          <input
                            type="text"
                            placeholder="যেমন: ৯ম তলা, ফ্ল্যাট ৯-এ (১৪৫০ বর্গফুট)"
                            onChange={(e) => updateUnit(idx, { flatNo: e.target.value })}
                            className="w-full bg-white border border-[#CE2028] rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none animate-fadeIn"
                            autoFocus
                            required
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Mode: Package (fixed land + construction) vs Square Feet (size x rate) */}
                  <div>
                    {allowedPricingModes.length > 1 && (
                      <>
                        <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          দাম নির্ধারণের ধরন *
                        </label>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <button
                            type="button"
                            onClick={() => updateUnit(idx, { pricingMode: 'package' })}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                              effectivePricingMode === 'package'
                                ? 'bg-[#CE2028] text-white border-[#CE2028] shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            প্যাকেজ মূল্য
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const picked = projectUnits.find(u => u.name === unit.flatNo);
                              const sqft = picked?.sizeSqft || unit.sizeSqft || '';
                              const currentRate = Number(unit.ratePerSqft || selProj?.pricePerSqft) || 0;
                              updateUnit(idx, {
                                pricingMode: 'sqft',
                                sizeSqft: sqft,
                                ratePerSqft: unit.ratePerSqft || (selProj?.pricePerSqft ? String(selProj.pricePerSqft) : ''),
                                totalPrice: currentRate > 0 && sqft
                                  ? String(Math.round(Number(sqft) * currentRate))
                                  : unit.totalPrice
                              });
                            }}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                              effectivePricingMode === 'sqft'
                                ? 'bg-[#CE2028] text-white border-[#CE2028] shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            স্কয়ারফিট হিসাবে
                          </button>
                        </div>
                      </>
                    )}

                    {effectivePricingMode === 'sqft' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            সাইজ (বর্গফুট) *
                          </label>
                          <input
                            type="number"
                            placeholder="যেমন: 1265"
                            value={unit.sizeSqft}
                            onChange={(e) => {
                              const sqft = e.target.value;
                              const rate = Number(unit.ratePerSqft || selProj?.pricePerSqft) || 0;
                              updateUnit(idx, { 
                                sizeSqft: sqft, 
                                totalPrice: rate > 0 && sqft ? String(Math.round(Number(sqft) * rate)) : unit.totalPrice 
                              });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            প্রতি বর্গফুট রেট (টাকা) *
                          </label>
                          <input
                            type="number"
                            placeholder={selProj?.pricePerSqft ? `বেস: ৳${selProj.pricePerSqft}` : "যেমন: 8500"}
                            value={unit.ratePerSqft}
                            onChange={(e) => {
                              const rate = e.target.value;
                              const sqft = Number(unit.sizeSqft) || 0;
                              updateUnit(idx, { 
                                ratePerSqft: rate, 
                                totalPrice: rate && sqft > 0 ? String(Math.round(Number(rate) * sqft)) : unit.totalPrice 
                              });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                            required
                          />
                          <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
                            (রাস্তার পাশে / ভেতরে রেট)
                          </span>
                        </div>
                        <div>
                          <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            মোট ফ্ল্যাট মূল্য (টাকা) *
                          </label>
                          <input
                            type="number"
                            placeholder="মোট মূল্য"
                            value={unit.totalPrice}
                            onChange={(e) => updateUnit(idx, { totalPrice: e.target.value })}
                            className="w-full bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 outline-none focus:border-[#CE2028]"
                            required
                          />
                          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block truncate">
                            স্বয়ংক্রিয় হিসাব (পরিবর্তনযোগ্য)
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            জমির মূল্য *
                          </label>
                          <input
                            type="number"
                            placeholder="যেমন: 1500000"
                            value={unit.landPrice}
                            onChange={(e) => {
                              const land = e.target.value;
                              updateUnit(idx, {
                                landPrice: land,
                                totalPrice: String((Number(land) || 0) + (Number(unit.constructionPrice) || 0))
                              });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            নির্মাণ খরচ *
                          </label>
                          <input
                            type="number"
                            placeholder="যেমন: 2000000"
                            value={unit.constructionPrice}
                            onChange={(e) => {
                              const construction = e.target.value;
                              updateUnit(idx, {
                                constructionPrice: construction,
                                totalPrice: String((Number(unit.landPrice) || 0) + (Number(construction) || 0))
                              });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                            required
                          />
                        </div>
                        <div className="sm:col-span-2 text-2xs font-bold text-slate-600">
                          মোট প্যাকেজ মূল্য: ৳{(Number(unit.landPrice) || 0) + (Number(unit.constructionPrice) || 0)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        বুকিং মানি / প্রাথমিক জমা
                      </label>
                      <input
                        type="number"
                        placeholder="যেমন: 2400000"
                        value={unit.initialPaid}
                        onChange={(e) => updateUnit(idx, { initialPaid: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
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
              {isExisting
                ? (form.units.length > 1 ? 'ইউনিটগুলো যুক্ত করুন' : 'ইউনিট যুক্ত করুন')
                : 'নিশ্চিত করুন ও ক্লায়েন্ট তৈরি করুন'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
