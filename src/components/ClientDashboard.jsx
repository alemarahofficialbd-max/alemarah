import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  LogOut, 
  Globe, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  DollarSign, 
  FileText, 
  Download, 
  Phone, 
  MessageSquare, 
  HardHat, 
  ShieldCheck, 
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function ClientDashboard({ lang, setLang, t, onLogout, onNavigateHome }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'payments', 'documents', 'support'
  const d = t.dashboard;

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-gray-900 flex flex-col font-sans animate-fadeIn">
      {/* Dashboard Sub-Bar */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-gray-700 hover:text-[#CE2028] transition-colors p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#CE2028]" />
              <span>{d.backToHome}</span>
            </button>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <span className="text-xs sm:text-sm font-bold text-gray-900 hidden sm:flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8EBF40]" />
              <span>{d.title}</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onLogout}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 text-[#CE2028] hover:bg-[#CE2028] hover:text-white transition-all text-xs font-bold border border-red-200 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{d.logout}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Client Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1C1819] via-[#2A2223] to-[#1C1819] text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#CE2028]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8EBF40]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#8EBF40]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{d.clientId}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {d.welcome}, {d.clientName}!
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-[#CE2028]" />
                <span>{d.projectBadge}</span>
              </p>
            </div>

            {/* Quick Overall Status Metric */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center space-x-4 shrink-0">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#8EBF40] to-[#006231] flex items-center justify-center text-white text-xl font-black shadow-md">
                68%
              </div>
              <div>
                <div className="text-xs text-gray-300 font-medium">{d.progress.overall}</div>
                <div className="text-sm font-bold text-white flex items-center space-x-1 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8EBF40]" />
                  <span>{lang === 'en' ? 'On-Schedule Construction' : 'নির্ধারিত সময়ে চলমান'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#CE2028] text-white shadow-md shadow-[#CE2028]/25'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{d.tabs.overview}</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-[#CE2028] text-white shadow-md shadow-[#CE2028]/25'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{d.tabs.payments}</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-[#CE2028] text-white shadow-md shadow-[#CE2028]/25'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{d.tabs.documents}</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'support'
                ? 'bg-[#CE2028] text-white shadow-md shadow-[#CE2028]/25'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <HardHat className="w-4 h-4" />
            <span>{d.tabs.support}</span>
          </button>
        </div>

        {/* Tab 1: Construction Milestone Progress */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Progress Timeline (8 cols) */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{d.progress.title}</h2>
                  <p className="text-xs text-gray-500 mt-1">{d.progress.lastUpdated}</p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#006231] text-xs font-bold border border-emerald-200">
                  {d.progress.overall}: 68%
                </div>
              </div>

              {/* Progress Bar Stages */}
              <div className="space-y-4">
                {d.progress.stages.map((stg, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                      <span className="text-gray-900">{stg.name}</span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                        stg.percent === 100 
                          ? 'bg-emerald-100 text-[#006231]' 
                          : stg.percent >= 50 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-gray-200 text-gray-700'
                      }`}>
                        {stg.percent}% ({stg.status})
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          stg.percent === 100 ? 'bg-[#006231]' : 'bg-[#CE2028]'
                        }`}
                        style={{ width: `${stg.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Site Photo Preview (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900">
                    {lang === 'en' ? 'Latest Site Photography' : 'সর্বশেষ সাইট স্থিরচিত্র'}
                  </h3>
                  <span className="text-xs text-[#006231] font-bold">Live Photo</span>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-inner h-56 bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=800&q=80"
                    alt="Al Quds Tower Construction"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {d.progress.droneUpdate}
                </p>
                <button
                  onClick={() => alert(lang === 'en' ? 'Drone high-definition video is preparing for playback.' : 'হাই-রেজোলিউশন ড্রোন ভিডিও প্রস্তুত হচ্ছে।')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  {lang === 'en' ? 'View 360° Site View' : '৩৬০° সাইট ভিউ দেখুন'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Financial Ledger & Payment Statement */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* 4 Financial Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <div className="text-xs text-gray-500 font-medium">{d.financial.totalValue}</div>
                <div className="text-2xl font-black text-gray-900 mt-1">৳ ১,২০,০০,০০০</div>
                <div className="text-xs text-gray-400 mt-1">{lang === 'en' ? 'Contract Value' : 'চুক্তিভিত্তিক মোট মূল্য'}</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
                <div className="text-xs text-emerald-800 font-medium">{d.financial.totalPaid}</div>
                <div className="text-2xl font-black text-[#006231] mt-1">৳ ৭২,০০,০০০</div>
                <div className="text-xs text-[#006231] mt-1 font-bold">60% Cleared</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs">
                <div className="text-xs text-amber-800 font-medium">{d.financial.totalDue}</div>
                <div className="text-2xl font-black text-amber-700 mt-1">৳ ৪৮,০০,০০০</div>
                <div className="text-xs text-amber-700 mt-1 font-medium">{lang === 'en' ? 'Installment Schedule' : 'চলমান কিস্তি'}</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-xs">
                <div className="text-xs text-red-800 font-medium">{d.financial.nextInstallment}</div>
                <div className="text-2xl font-black text-[#CE2028] mt-1">৳ ৬,০০,০০০</div>
                <div className="text-xs text-red-600 font-bold mt-1">{d.financial.dueDate}</div>
              </div>
            </div>

            {/* Receipts Table */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">{d.financial.title}</h3>
                <span className="text-xs font-bold text-[#006231] bg-emerald-50 px-2.5 py-1 rounded-md">
                  4 Verified Transactions
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold text-xs">
                    <tr>
                      <th className="py-3.5 px-6">Receipt No</th>
                      <th className="py-3.5 px-6">Date</th>
                      <th className="py-3.5 px-6">Amount</th>
                      <th className="py-3.5 px-6">Payment Method</th>
                      <th className="py-3.5 px-6 text-right">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                    {d.financial.receipts.map((rcp, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-900">{rcp.receiptNo}</td>
                        <td className="py-4 px-6">{rcp.date}</td>
                        <td className="py-4 px-6 font-bold text-[#006231]">{rcp.amount}</td>
                        <td className="py-4 px-6 text-gray-600">{rcp.method}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => alert(`${rcp.receiptNo} PDF receipt download initiated.`)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#CE2028] hover:text-white text-gray-800 text-xs font-bold transition-all cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Documents Vault */}
        {activeTab === 'documents' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900">{d.documents.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {lang === 'en' 
                  ? 'All official allotment papers, legal agreements, and certified building sanction blueprints.' 
                  : 'আপনার বুকিংকৃত ফ্ল্যাটের বরাদ্দপত্র, চুক্তিপত্র এবং রাজউক অনুমোদিত ড্রয়িং এর ডিজিটাল কপি।'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {d.documents.items.map((doc, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-red-50 text-[#CE2028] flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{doc.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{doc.type} • {doc.size}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`${doc.title} download started.`)}
                    className="p-2.5 rounded-xl bg-white hover:bg-[#006231] text-gray-700 hover:text-white border border-gray-200 shadow-xs transition-colors cursor-pointer"
                    title={d.documents.downloadBtn}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Assigned Project Engineer & Support */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Engineer Card */}
            <div className="bg-white p-7 rounded-3xl border border-gray-200 shadow-xs space-y-5">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-xl">
                  <HardHat className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                    {lang === 'en' ? 'Project Site In-Charge' : 'সাইট ইনচার্জ'}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{d.support.engineerName}</h3>
                  <p className="text-xs text-gray-500">{d.support.engineerRole}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs text-gray-700">
                <div className="font-bold text-gray-900">Al Quds Tower Construction Site</div>
                <div>Direct Site Helpline: {d.support.contactHotline}</div>
                <div>Available: Saturday – Thursday (9:00 AM – 6:00 PM)</div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href="https://wa.me/8801918646575"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#006231] hover:bg-[#004723] text-white text-xs font-bold transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{d.support.whatsappChat}</span>
                </a>

                <a
                  href="tel:01918646575"
                  className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#CE2028] hover:bg-[#A9141B] text-white text-xs font-bold transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{d.support.callNow}</span>
                </a>
              </div>
            </div>

            {/* Relationship Officer Card */}
            <div className="bg-white p-7 rounded-3xl border border-gray-200 shadow-xs space-y-5">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#006231] flex items-center justify-center font-black text-xl">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                    {lang === 'en' ? 'Customer Relationship' : 'রিলেশনশিপ অফিসার'}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{d.support.officerName}</h3>
                  <p className="text-xs text-gray-500">{d.support.officerRole}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs text-gray-700">
                <div className="font-bold text-gray-900">Corporate Customer Care Office</div>
                <div>Email: support@alemarahproperties.com</div>
                <div>Office: ৩/১, স্কাই ভিউ হেনোলাক্স সেন্টার, পুরানা পল্টন, ঢাকা</div>
              </div>

              <div className="pt-2">
                <a
                  href="tel:01743926926"
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Call Customer Relationship' : 'কাস্টমার কেয়ারে কল দিন'}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
