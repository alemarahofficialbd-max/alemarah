import React from 'react';
import { X, FileSpreadsheet, CheckCircle2, Copy, Printer } from 'lucide-react';
import { formatBDT } from '../../data/managementStore';

// Popup: payment transaction detail (phone & desktop), extracted from ManagementDashboard.
export default function TransactionDetailModal({ trxModal, onClose, onPrint, onCopy }) {
  if (!trxModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md shadow-2xl border border-slate-200/80 overflow-hidden animate-scaleIn flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#006231] flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">জমার পূর্ণাঙ্গ তথ্য</h3>
              <p className="text-3xs text-slate-500 font-medium">রসিদ ও পেমেন্ট বিবরণী</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Highlight */}
        <div className="p-5 text-center bg-gradient-to-b from-emerald-50/60 to-white border-b border-slate-100">
          <div className="text-3xs font-bold uppercase tracking-wider text-slate-400">পরিশোধিত জমার পরিমাণ</div>
          <div className="text-2xl font-black text-[#006231] mt-0.5">
            +{formatBDT(trxModal.trx.amount)}
          </div>
          <div className="inline-flex items-center space-x-1 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-[#006231] text-3xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-[#006231]" />
            <span>অনুমোদিত জমা</span>
          </div>
        </div>

        {/* Detailed Parameters */}
        <div className="p-5 space-y-3 text-xs divide-y divide-slate-100">
          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-500 text-2xs">রসিদ / ট্রানজাকশন আইডি</span>
            <div className="flex items-center space-x-1.5">
              <span className="font-mono font-bold text-slate-800 text-2xs bg-slate-100 px-2 py-0.5 rounded-md">
                {trxModal.trx.id}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(trxModal.trx.id);
                  onCopy('রসিদ আইডি কপি হয়েছে!');
                }}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                title="আইডি কপি করুন"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2.5">
            <span className="text-slate-500 text-2xs">জমার তারিখ</span>
            <span className="font-bold text-slate-800 text-2xs">
              {trxModal.trx.date}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2.5">
            <span className="text-slate-500 text-2xs">পরিশোধের মাধ্যম</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-2xs border border-slate-200/60">
              {trxModal.trx.method}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2.5">
            <span className="text-slate-500 text-2xs">গ্রাহকের নাম</span>
            <span className="font-bold text-slate-800 text-2xs truncate max-w-[190px]">
              {trxModal.client.name}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2.5">
            <span className="text-slate-500 text-2xs">প্রজেক্ট ও ফ্ল্যাট</span>
            <span className="font-bold text-slate-700 text-2xs truncate max-w-[190px]">
              {trxModal.client.projectName || trxModal.client.project} ({trxModal.client.flatNo})
            </span>
          </div>

          {trxModal.trx.note && (
            <div className="flex items-start justify-between pt-2.5">
              <span className="text-slate-500 text-2xs">বিশেষ বিবরণ / নোট</span>
              <span className="font-medium text-slate-700 text-2xs text-right max-w-[190px]">
                {trxModal.trx.note}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onPrint(trxModal)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#006231] hover:bg-[#0A4D27] text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>রসিদ প্রিন্ট করুন</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
