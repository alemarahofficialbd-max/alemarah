import React from 'react';
import { ChevronLeft, X, UserCircle2, Phone, MapPin, Plus, Wallet } from 'lucide-react';

const fmt = (n) => `৳${(Number(n) || 0).toLocaleString('bn-BD')}`;

// Full-screen investor profile: groups every investment slab this person
// holds (by phone number, across every offer) in one place, with their
// identity/nominee info and payout history -- one person can hold more
// than one slab, even in different offers.
export default function InvestorProfileModal({
  isOpen,
  investor,
  allInvestors,
  allOffers,
  isSidebarCollapsed,
  onClose,
  onAddPayout,
  onAddAnotherInvestment
}) {
  if (!isOpen || !investor) return null;

  const phone = investor.phone;
  const slabs = (allInvestors || []).filter(inv => inv.phone === phone);
  const totalInvested = slabs.reduce((acc, inv) => acc + (Number(inv.investedAmount) || 0), 0);
  const totalPaid = slabs.reduce((acc, inv) => acc + (Number(inv.totalPaid) || 0), 0);
  const allPayouts = slabs
    .flatMap(inv => (inv.payoutHistory || []).map(p => ({ ...p, offerName: (allOffers || []).find(o => o.id === inv.offerId)?.name })))
    .slice(0, 30);

  return (
    <div className={`fixed inset-y-0 right-0 left-0 ${isSidebarCollapsed ? "md:left-20" : "md:left-64 lg:left-72"} z-[65] bg-[#F8FAFC] flex flex-col overflow-y-auto animate-fadeIn select-none`}>
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
              <UserCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">{investor.name}</h3>
              <p className="text-3xs text-slate-500">ইনভেস্টর প্রোফাইল</p>
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
        <div className="w-full max-w-3xl space-y-4">
          {/* Identity card */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-[#006231]" />
                <span className="font-mono font-bold">{investor.phone}</span>
              </div>
              {investor.address && (
                <div className="flex items-center space-x-2 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-[#006231]" />
                  <span>{investor.address}</span>
                </div>
              )}
            </div>
            {(investor.nomineeName || investor.nomineePhone) && (
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-2xs text-amber-900">
                <strong>মনোনীত নমিনি:</strong> {investor.nomineeName || '—'} {investor.nomineeRelation ? `(${investor.nomineeRelation})` : ''} {investor.nomineePhone ? `• ${investor.nomineePhone}` : ''}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <div>
                <div className="text-3xs text-slate-400 font-bold uppercase">মোট স্ল্যাব</div>
                <div className="text-lg font-black text-slate-900">{slabs.length} টি</div>
              </div>
              <div>
                <div className="text-3xs text-slate-400 font-bold uppercase">মোট বিনিয়োগ</div>
                <div className="text-lg font-black text-[#006231]">{fmt(totalInvested)}</div>
              </div>
              <div>
                <div className="text-3xs text-slate-400 font-bold uppercase">মোট পরিশোধিত</div>
                <div className="text-lg font-black text-purple-900">{fmt(totalPaid)}</div>
              </div>
            </div>

            {onAddAnotherInvestment && (
              <button
                type="button"
                onClick={onAddAnotherInvestment}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#006231] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>এই ব্যক্তির আরেকটি বিনিয়োগ স্ল্যাব যোগ করুন</span>
              </button>
            )}
          </div>

          {/* Slabs */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">বিনিয়োগ স্ল্যাবসমূহ</h4>
            </div>
            <div className="divide-y divide-slate-50">
              {slabs.map(inv => {
                const offer = (allOffers || []).find(o => o.id === inv.offerId);
                return (
                  <div key={inv.id} className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-slate-900 truncate">{offer?.name || inv.offerId}</div>
                      <div className="text-2xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className={`px-2 py-0.5 rounded-full text-3xs font-bold ${inv.tier === 'director' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-[#006231]'}`}>
                          {inv.tier === 'director' ? 'ডিরেক্টর' : 'সাধারণ'}
                        </span>
                        <span>{inv.investmentDate}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-3">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{fmt(inv.investedAmount)}</div>
                        <div className="text-3xs text-slate-400">পরিশোধিত {fmt(inv.totalPaid)}</div>
                      </div>
                      {onAddPayout && (
                        <button
                          type="button"
                          onClick={() => onAddPayout(inv)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#006231] font-bold text-3xs border border-emerald-200 cursor-pointer inline-flex items-center space-x-1"
                        >
                          <Wallet className="w-3 h-3" />
                          <span>পরিশোধ</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payout history */}
          {allPayouts.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">পরিশোধের ইতিহাস</h4>
              </div>
              <div className="divide-y divide-slate-50">
                {allPayouts.map(p => (
                  <div key={p.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{fmt(p.amount)}</div>
                      <div className="text-3xs text-slate-400">{p.offerName} • {p.method} {p.note ? `• ${p.note}` : ''}</div>
                    </div>
                    <div className="text-3xs text-slate-500">{p.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
