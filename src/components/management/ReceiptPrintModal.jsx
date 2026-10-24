import React from 'react';
import { ChevronLeft, X, CheckCircle2, Printer } from 'lucide-react';
import { formatBDT } from '../../data/managementStore';

// Full-screen "Official Money Receipt" preview & print view, extracted from ManagementDashboard.
export default function ReceiptPrintModal({ receipt, isSidebarCollapsed, onClose }) {
  if (!receipt) return null;
  const { trx, client } = receipt;

  return (
    <div className={`fixed inset-y-0 right-0 left-0 ${isSidebarCollapsed ? "md:left-20" : "md:left-64 lg:left-72"} z-[60] bg-[#F1F5F9] flex flex-col overflow-y-auto animate-fadeIn select-none`}>
      {/* Top Controls Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs no-print">
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
            <CheckCircle2 className="w-5 h-5 text-[#006231]" />
            <span className="font-bold text-sm text-slate-800">অফিশিয়াল মানি রিসিট ভাউচার</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Printable Document Sheet in Fullscreen Center */}
      <div className="flex-1 py-4 sm:py-8 px-2 sm:px-6 flex justify-center items-start">
        <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-sm space-y-5 sm:space-y-6 printable-document">

          {/* Header with Logo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <img
                src="/alemarah_logo_header.svg"
                alt="Al-Emarah Properties"
                className="h-9 sm:h-10 w-auto object-contain"
              />
              <div className="text-[11px] text-slate-600 font-medium mt-1 leading-tight">
                <p>৩/১, স্কাই ভিউ হেনোলাক্স সেন্টার</p>
                <p className="text-slate-500 text-[10px]">পুরানা পল্টন, ঢাকা</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-[#006231] font-bold text-xs border border-emerald-200">
                মানি রিসিট
              </span>
              <div className="text-2xs font-mono font-bold text-slate-600 mt-1">
                রসিদ নং: <strong className="text-slate-900">{trx.id}</strong>
              </div>
              <div className="text-[11px] text-slate-400">
                তারিখ: {trx.date}
              </div>
            </div>
          </div>

          {/* Customer & Unit Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
            <div className="flex items-center space-x-3">
              {client.image && (
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-slate-300 shrink-0">
                  <img src={client.image} alt={client.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="min-w-0">
                <span className="text-3xs text-slate-400 block font-bold uppercase">গ্রাহকের নাম</span>
                <strong className="text-slate-900 text-sm truncate block">{client.name}</strong>
                {client.phone && <div className="text-slate-500 text-2xs font-mono">{client.phone}</div>}
              </div>
            </div>

            <div>
              <span className="text-3xs text-slate-400 block font-bold uppercase">বরাদ্দকৃত প্রকল্প ও ইউনিট</span>
              <strong className="text-[#006231] text-xs block">{client.projectName}</strong>
              <div className="text-slate-600 text-2xs font-medium">{client.flatNo || 'বরাদ্দকৃত ইউনিট'}</div>
            </div>
          </div>

          {/* Payment Breakdown Table */}
          <div className="border border-slate-200/80 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200/80 text-slate-600 font-bold uppercase text-3xs">
                <tr>
                  <th className="py-2.5 px-3 text-left">বিবরণ / খাত</th>
                  <th className="py-2.5 px-3 text-center">পরিশোধের মাধ্যম</th>
                  <th className="py-2.5 px-3 text-right">জমার পরিমাণ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-3 font-medium text-slate-800">
                    ফ্ল্যাট / ইউনিট চুক্তি কিস্তি জমা
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-700">
                    {trx.method}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-sm text-[#006231]">
                    {formatBDT(trx.amount)}
                  </td>
                </tr>
                <tr className="bg-slate-50/60 font-bold">
                  <td colSpan="2" className="py-2.5 px-3 text-right text-slate-600 text-xs">
                    সর্বমোট সংগৃহীত টাকা:
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-black text-base text-[#006231]">
                    {formatBDT(trx.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Authorization & Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200/80 text-center text-xs">
            <div>
              <div className="w-28 sm:w-32 h-8 border-b border-slate-400 mx-auto"></div>
              <div className="text-3xs font-bold text-slate-600 mt-1">আদায়কারীর স্বাক্ষর</div>
              <div className="text-[10px] text-slate-400">হিসাব বিভাগ, আল-ইমারাহ</div>
            </div>

            <div>
              <div className="w-28 sm:w-32 h-8 border-b border-slate-400 mx-auto"></div>
              <div className="text-3xs font-bold text-slate-600 mt-1">অনুমোদিত স্বাক্ষর</div>
              <div className="text-[10px] text-slate-400">ম্যানেজমেন্ট কন্ট্রোল</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
