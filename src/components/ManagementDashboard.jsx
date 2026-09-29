import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Users, 
  DollarSign, 
  HardHat, 
  Plus, 
  Check, 
  Search, 
  LogOut, 
  Home, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Wallet,
  Coins,
  ChevronRight
} from 'lucide-react';
import { 
  getManagementData, 
  saveManagementData, 
  formatBDT 
} from '../data/managementStore';

export default function ManagementDashboard({ 
  admin, 
  onLogout, 
  onNavigateHome,
  lang = 'bn'
}) {
  const [data, setData] = useState(() => getManagementData());
  const [activeTab, setActiveTab] = useState('clients'); // 'clients', 'payments', 'projects', 'expenses', 'team'
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [successAlert, setSuccessAlert] = useState('');

  const profileRef = useRef(null);

  const triggerAlert = (msg) => {
    setSuccessAlert(msg);
    setTimeout(() => setSuccessAlert(''), 3000);
  };

  const updateStore = (updater) => {
    setData((prev) => {
      const updated = updater(prev);
      saveManagementData(updated);
      return updated;
    });
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // -------------------------------------------------------------
  // FORM STATES
  // -------------------------------------------------------------
  // 1. New Client Form
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientForm, setClientForm] = useState({
    name: '',
    phone: '',
    password: 'password123',
    projectId: data.projects[0]?.id || '',
    flatNo: '',
    totalPrice: '',
    initialPaid: '',
    nextDueDate: '১৫ নভেম্বর, ২০২৬',
    nextDueAmount: '৫০০০০০'
  });

  // 2. Receive Payment Form
  const [paymentForm, setPaymentForm] = useState({
    clientId: data.clients[0]?.id || '',
    amount: '',
    date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
    method: 'ব্যাংক ডিপোজিট',
    note: ''
  });

  // 3. New Project Form
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    location: '',
    progress: 10,
    currentStage: 'পাইলিং ও সাইট প্রিপারেশন',
    budget: ''
  });

  // 4. Project Expense Form
  const [selectedExpenseProject, setSelectedExpenseProject] = useState(data.projects[0]?.id || '');
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
  });

  // 5. Team Member Form
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamForm, setTeamForm] = useState({
    name: '',
    phone: '',
    role: 'সাইট ইঞ্জিনিয়ার',
    accessKey: 'admin123'
  });

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  const handleAddClient = (e) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.phone || !clientForm.totalPrice) {
      alert('অনুগ্রহ করে কাস্টমারের নাম, ফোন ও মোট মূল্য লিখুন।');
      return;
    }

    const selectedProj = data.projects.find(p => p.id === clientForm.projectId) || data.projects[0];
    const initialPaidNum = Number(clientForm.initialPaid) || 0;
    const newId = `CLI-${Math.floor(10000 + Math.random() * 90000)}`;

    const newClient = {
      id: newId,
      name: clientForm.name,
      phone: clientForm.phone,
      password: clientForm.password || 'password123',
      projectId: selectedProj.id,
      projectName: selectedProj.name,
      flatNo: clientForm.flatNo || 'বরাদ্দকৃত ইউনিট',
      totalPrice: Number(clientForm.totalPrice) || 0,
      totalPaid: initialPaidNum,
      nextDueDate: clientForm.nextDueDate,
      nextDueAmount: Number(clientForm.nextDueAmount) || 0,
      paymentHistory: initialPaidNum > 0 ? [
        {
          id: `TRX-${Date.now().toString().slice(-4)}`,
          date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
          amount: initialPaidNum,
          method: 'বুকিং মানি / প্রাথমিক জমা'
        }
      ] : []
    };

    updateStore((prev) => ({
      ...prev,
      clients: [newClient, ...prev.clients]
    }));

    setIsClientModalOpen(false);
    setClientForm({
      name: '',
      phone: '',
      password: 'password123',
      projectId: data.projects[0]?.id || '',
      flatNo: '',
      totalPrice: '',
      initialPaid: '',
      nextDueDate: '১৫ নভেম্বর, ২০২৬',
      nextDueAmount: '৫০০০০০'
    });
    triggerAlert(`নতুন কাস্টমার ${newClient.name} (আইডি: ${newId}) সফলভাবে যোগ হয়েছে!`);
  };

  const handleReceivePayment = (e) => {
    e.preventDefault();
    const payAmount = Number(paymentForm.amount);
    if (!paymentForm.clientId || !payAmount || payAmount <= 0) {
      alert('সঠিক কাস্টমার ও জমার পরিমাণ লিখুন।');
      return;
    }

    const targetClient = data.clients.find(c => c.id === paymentForm.clientId);
    if (!targetClient) return;

    const newPaymentRecord = {
      id: `TRX-${Date.now().toString().slice(-4)}`,
      date: paymentForm.date,
      amount: payAmount,
      method: paymentForm.method + (paymentForm.note ? ` (${paymentForm.note})` : '')
    };

    updateStore((prev) => ({
      ...prev,
      clients: prev.clients.map(c => {
        if (c.id === paymentForm.clientId) {
          return {
            ...c,
            totalPaid: (c.totalPaid || 0) + payAmount,
            paymentHistory: [newPaymentRecord, ...(c.paymentHistory || [])]
          };
        }
        return c;
      })
    }));

    triggerAlert(`${targetClient.name}-এর একাউন্টে ${formatBDT(payAmount)} টাকা জমার এন্ট্রি সফল হয়েছে!`);
    setPaymentForm({
      ...paymentForm,
      amount: '',
      note: ''
    });
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!projectForm.name || !projectForm.budget) {
      alert('প্রজেক্টের নাম ও মোট বাজেট লিখুন।');
      return;
    }

    const newProj = {
      id: `proj-${Date.now()}`,
      name: projectForm.name,
      location: projectForm.location || 'ঢাকা',
      progress: Number(projectForm.progress) || 10,
      currentStage: projectForm.currentStage || 'সাইট কাজ শুরু',
      budget: Number(projectForm.budget) || 0,
      expenses: []
    };

    updateStore((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));

    setIsProjectModalOpen(false);
    setProjectForm({
      name: '',
      location: '',
      progress: 10,
      currentStage: 'পাইলিং ও সাইট প্রিপারেশন',
      budget: ''
    });
    triggerAlert(`নতুন প্রজেক্ট "${newProj.name}" সফলভাবে যুক্ত হয়েছে!`);
  };

  const handleUpdateProjectProgress = (projId, newProgress, newStage) => {
    updateStore((prev) => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id === projId) {
          return {
            ...p,
            progress: Number(newProgress),
            currentStage: newStage !== undefined ? newStage : p.currentStage
          };
        }
        return p;
      })
    }));
    triggerAlert('প্রকল্পের কাজের অগ্রগতি সফলভাবে আপডেট হয়েছে!');
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const expAmount = Number(expenseForm.amount);
    if (!expenseForm.title || !expAmount || expAmount <= 0) {
      alert('খরচের খাত এবং টাকার পরিমাণ লিখুন।');
      return;
    }

    const newExp = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      title: expenseForm.title,
      amount: expAmount,
      date: expenseForm.date
    };

    updateStore((prev) => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id === selectedExpenseProject) {
          return {
            ...p,
            expenses: [newExp, ...(p.expenses || [])]
          };
        }
        return p;
      })
    }));

    setExpenseForm({
      title: '',
      amount: '',
      date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
    });
    triggerAlert('প্রজেক্ট খরচের এন্ট্রি সফলভাবে যুক্ত হয়েছে!');
  };

  const handleAddTeam = (e) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.phone) {
      alert('নাম এবং ফোন নম্বর লিখুন।');
      return;
    }

    const newMember = {
      id: `MGT-0${data.managementTeam.length + 1}`,
      name: teamForm.name,
      phone: teamForm.phone,
      role: teamForm.role,
      accessKey: teamForm.accessKey || 'admin123'
    };

    updateStore((prev) => ({
      ...prev,
      managementTeam: [...prev.managementTeam, newMember]
    }));

    setIsTeamModalOpen(false);
    setTeamForm({
      name: '',
      phone: '',
      role: 'সাইট ইঞ্জিনিয়ার',
      accessKey: 'admin123'
    });
    triggerAlert(`কর্মকর্তা ${newMember.name} সফলভাবে যুক্ত হয়েছেন!`);
  };

  // Calculations for Overview Cards
  const totalClientsCount = data.clients.length;
  const totalCollections = data.clients.reduce((acc, c) => acc + (c.totalPaid || 0), 0);
  const totalDues = data.clients.reduce((acc, c) => acc + Math.max(0, (c.totalPrice || 0) - (c.totalPaid || 0)), 0);
  const totalConstructionSpent = data.projects.reduce((acc, p) => {
    const pSpent = (p.expenses || []).reduce((expAcc, e) => expAcc + (e.amount || 0), 0);
    return acc + pSpent;
  }, 0);

  // Filtered clients for table search
  const filteredClients = data.clients.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.projectName.toLowerCase().includes(q)
    );
  });

  const selectedProjForExpense = data.projects.find(p => p.id === selectedExpenseProject) || data.projects[0];
  const projectTotalExpense = (selectedProjForExpense?.expenses || []).reduce((acc, e) => acc + (e.amount || 0), 0);
  const projectRemainingBudget = (selectedProjForExpense?.budget || 0) - projectTotalExpense;

  // Management Footer Navbar items
  const managementNavItems = [
    { id: 'clients', label: '১. ক্লায়েন্ট', icon: Users },
    { id: 'payments', label: '২. জমা এন্ট্রি', icon: DollarSign },
    { id: 'projects', label: '৩. প্রজেক্ট', icon: Building2 },
    { id: 'expenses', label: '৪. বাজেট ও খরচ', icon: Wallet },
    { id: 'team', label: '৫. টিম', icon: HardHat }
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-gray-900 flex flex-col font-sans animate-fadeIn pb-24">
      
      {/* ========================================================= */}
      {/* 1. TOP HEADER (JUST LOGO & PURE CIRCULAR AVATAR - NO BOX) */}
      {/* ========================================================= */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8 shadow-2xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Portal Badge */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-2 group cursor-pointer"
              title="ওয়েবসাইটে ফিরে যান"
            >
              <img 
                src="/alemarah_logo_header.svg" 
                alt="Al-Emarah Properties" 
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </button>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-50 text-[#CE2028] text-xs font-bold border border-red-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ম্যানেজমেন্ট প্যানেল</span>
            </div>
          </div>

          {/* Right: PURE CIRCULAR AVATAR (NO BOX / NO BUTTON BORDER BOX) */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="relative cursor-pointer rounded-full p-0 border-0 bg-transparent focus:outline-none transition-transform hover:scale-105 active:scale-95 block"
              aria-expanded={isProfileOpen}
              title="ম্যানেজমেন্ট মেনু"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#CE2028] to-[#A9141B] text-white flex items-center justify-center font-black text-sm ring-2 ring-[#CE2028] shadow-sm hover:ring-[#006231] transition-all">
                {admin?.name ? admin.name.slice(0, 2) : 'ম্যা'}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </button>

            {/* Profile Dropdown Popup Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 py-3 z-50 animate-fadeIn divide-y divide-gray-100">
                <div className="px-4 py-3">
                  <div className="text-sm font-black text-gray-900 truncate">
                    {admin?.name || 'অ্যাডমিন কর্মকর্তা'}
                  </div>
                  <div className="text-xs text-[#006231] font-semibold mt-0.5">
                    {admin?.role || 'ম্যানেজমেন্ট টিম'}
                  </div>
                  <div className="text-2xs text-gray-400 mt-0.5">
                    মোবাইল: {admin?.phone || '০১৯১৮-৬৪৬৫৭৫'}
                  </div>
                </div>

                <div className="p-2 space-y-1 text-xs font-bold text-gray-700">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onNavigateHome();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors text-left cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
                      <Home className="w-3.5 h-3.5" />
                    </div>
                    <span>ওয়েবসাইটে ফিরে যান</span>
                  </button>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-[#CE2028] text-[#CE2028] hover:text-white transition-all text-xs font-bold text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>লগআউট</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Floating Success Toast Alert */}
      {successAlert && (
        <div className="fixed top-18 right-4 z-50 bg-[#006231] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-xs sm:text-sm font-bold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#8EBF40]" />
          <span>{successAlert}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. STATS OVERVIEW CARDS                                   */}
      {/* ========================================================= */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-bold">
              <span>মোট ক্লায়েন্ট</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-gray-900 mt-1">
              {totalClientsCount} জন
            </div>
            <div className="text-2xs text-gray-400">নিবন্ধিত ফ্ল্যাট ক্রেতা</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/20 shadow-xs">
            <div className="flex items-center justify-between text-[#006231] text-xs font-bold">
              <span>মোট সংগৃহীত টাকা</span>
              <DollarSign className="w-4 h-4 text-[#006231]" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-[#006231] mt-1">
              {formatBDT(totalCollections)}
            </div>
            <div className="text-2xs text-[#006231] font-semibold">মোট পরিশোধ জমা</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200/80 bg-gradient-to-b from-white to-amber-50/20 shadow-xs">
            <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
              <span>মোট বকেয়া কিস্তি</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-amber-700 mt-1">
              {formatBDT(totalDues)}
            </div>
            <div className="text-2xs text-amber-700 font-semibold">ভবিষ্যত প্রাপ্য কিস্তি</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-bold">
              <span>প্রজেক্টে মোট ব্যয়</span>
              <HardHat className="w-4 h-4 text-[#CE2028]" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-[#CE2028] mt-1">
              {formatBDT(totalConstructionSpent)}
            </div>
            <div className="text-2xs text-gray-400">{data.projects.length}টি প্রজেক্টে এ পর্যন্ত ব্যয়</div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN WORKSPACE (SWITCHED VIA FOOTER NAVBAR)            */}
      {/* ========================================================= */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6 flex-1">
        
        {/* ======================================================= */}
        {/* TAB 1: CLIENT MANAGEMENT                                */}
        {/* ======================================================= */}
        {activeTab === 'clients' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Action Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="নাম, ফোন বা আইডি দিয়ে খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3.5 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028] outline-none"
                />
              </div>

              <button
                onClick={() => setIsClientModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#A9141B] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#CE2028]/20 hover:opacity-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন ক্লায়েন্ট যুক্ত করুন</span>
              </button>
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold text-xs">
                    <tr>
                      <th className="py-3.5 px-6">কাস্টমার তথ্য</th>
                      <th className="py-3.5 px-6">প্রজেক্ট ও ফ্ল্যাট</th>
                      <th className="py-3.5 px-6">মোট চুক্তি মূল্য</th>
                      <th className="py-3.5 px-6">পরিশোধিত</th>
                      <th className="py-3.5 px-6">বকেয়া / বাকি</th>
                      <th className="py-3.5 px-6">পরবর্তী কিস্তি</th>
                      <th className="py-3.5 px-6 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                    {filteredClients.map((cl) => {
                      const due = (cl.totalPrice || 0) - (cl.totalPaid || 0);
                      return (
                        <tr key={cl.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-gray-900">{cl.name}</div>
                            <div className="text-2xs text-gray-500">{cl.phone} • {cl.id}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-gray-800">{cl.projectName}</div>
                            <div className="text-2xs text-emerald-700 font-semibold">{cl.flatNo}</div>
                          </td>
                          <td className="py-4 px-6 font-bold text-gray-900">
                            {formatBDT(cl.totalPrice)}
                          </td>
                          <td className="py-4 px-6 font-black text-[#006231]">
                            {formatBDT(cl.totalPaid)}
                          </td>
                          <td className="py-4 px-6 font-bold text-amber-700">
                            {formatBDT(due)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-xs text-gray-900 font-bold">{cl.nextDueDate}</div>
                            <div className="text-2xs text-[#CE2028] font-bold">{formatBDT(cl.nextDueAmount)}</div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => {
                                setPaymentForm({
                                  ...paymentForm,
                                  clientId: cl.id,
                                  amount: cl.nextDueAmount || ''
                                });
                                setActiveTab('payments');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-[#006231] text-[#006231] hover:text-white font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
                            >
                              + জমা এন্ট্রি
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* TAB 2: PAYMENT COLLECTION ENTRY                         */}
        {/* ======================================================= */}
        {activeTab === 'payments' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            {/* Payment Entry Form (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-[#006231]" />
                  <span>কিস্তি বা টাকা জমার নতুন এন্ট্রি</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  কাস্টমার টাকা পরিশোধ করলে এখানে এন্ট্রি দিলে স্বয়ংক্রিয়ভাবে তার একাউন্টে আপডেট হবে।
                </p>
              </div>

              <form onSubmit={handleReceivePayment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    কাস্টমার নির্বাচন করুন *
                  </label>
                  <select
                    value={paymentForm.clientId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, clientId: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028]"
                  >
                    {data.clients.map(c => {
                      const due = (c.totalPrice || 0) - (c.totalPaid || 0);
                      return (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.projectName} (বাকি: {formatBDT(due)})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    টাকা জমার পরিমাণ (BDT) *
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 600000"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      জমার তারিখ
                    </label>
                    <input
                      type="text"
                      value={paymentForm.date}
                      onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800 outline-none focus:border-[#CE2028]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      পেমেন্ট মাধ্যম
                    </label>
                    <select
                      value={paymentForm.method}
                      onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-[#CE2028]"
                    >
                      <option value="ব্যাংক ডিপোজিট">ব্যাংক ডিপোজিট</option>
                      <option value="ব্যাংক চেক">ব্যাংক চেক</option>
                      <option value="পে-অর্ডার">পে-অর্ডার</option>
                      <option value="নগদ / ক্যাশ">নগদ / ক্যাশ</option>
                      <option value="অনলাইন ট্রান্সফার">অনলাইন ট্রান্সফার</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    রসিদ নম্বর বা নোট (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: মানি রিসিট #৪২০১"
                    value={paymentForm.note}
                    onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-800 outline-none focus:border-[#CE2028]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#006231] to-[#0A4D27] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-900/20 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>জমা নিশ্চিত করুন ও এন্ট্রি দিন</span>
                </button>
              </form>
            </div>

            {/* Recent Collections Table (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">সাম্প্রতিক সংগৃহীত কিস্তির তালিকা</h3>
                  <p className="text-xs text-gray-500 mt-0.5">সকল কাস্টমার থেকে সংগৃহীত এন্ট্রিসমূহ</p>
                </div>
                <span className="text-xs font-bold text-[#006231] bg-emerald-50 px-2.5 py-1 rounded-md">
                  সর্বমোট: {formatBDT(totalCollections)}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {data.clients.flatMap(c => (c.paymentHistory || []).map(p => ({ ...p, clientName: c.name, projectName: c.projectName, clientId: c.id })))
                  .sort((a, b) => (b.id > a.id ? 1 : -1))
                  .map((trx, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-gray-900 flex items-center space-x-1.5">
                          <span>{trx.clientName}</span>
                          <span className="text-2xs text-gray-400 font-normal">({trx.projectName})</span>
                        </div>
                        <div className="text-2xs text-gray-500">
                          {trx.date} • {trx.method} • আইডি: {trx.id}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-sm text-[#006231]">
                          +{formatBDT(trx.amount)}
                        </div>
                        <span className="text-3xs px-2 py-0.5 rounded-full bg-emerald-100 text-[#006231] font-bold">
                          অনুমোদিত
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* TAB 3: PROJECT MANAGEMENT & PROGRESS UPDATE             */}
        {/* ======================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-gray-900">চলমান ও আসন্ন প্রজেক্টসমূহ</h3>
                <p className="text-xs text-gray-500">প্রজেক্টের কাজের শতাংশ ও চলমান তলার কাজ আপডেট করুন</p>
              </div>
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#A9141B] text-white font-bold text-xs shadow-md shadow-[#CE2028]/20 hover:opacity-95 transition-all flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন প্রজেক্ট অ্যাড করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.projects.map((proj) => {
                const projClients = data.clients.filter(c => c.projectId === proj.id);
                return (
                  <div key={proj.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <h4 className="text-lg font-black text-gray-900">{proj.name}</h4>
                        <p className="text-xs text-gray-500">{proj.location}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-[#006231]">{proj.progress}%</span>
                        <div className="text-2xs text-gray-400 font-bold">সম্পন্ন</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                        <span>কাজের অগ্রগতি পরিবর্তন করুন:</span>
                        <span className="text-[#CE2028]">{proj.progress}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={proj.progress}
                        onChange={(e) => handleUpdateProjectProgress(proj.id, e.target.value)}
                        className="w-full accent-[#CE2028] cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-2xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        বর্তমান চলমান কাজের বিবরণ (ফ্লোর/ফেজ)
                      </label>
                      <input
                        type="text"
                        defaultValue={proj.currentStage}
                        onBlur={(e) => handleUpdateProjectProgress(proj.id, proj.progress, e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-[#CE2028]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="text-2xs text-gray-400 font-bold">মোট বাজেট</div>
                        <div className="font-bold text-gray-900 mt-0.5">{formatBDT(proj.budget)}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="text-2xs text-gray-400 font-bold">নিবন্ধিত ক্রেতা</div>
                        <div className="font-bold text-[#006231] mt-0.5">{projClients.length} জন</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* TAB 4: PROJECT EXPENSE & SHORT BUDGET BREAKDOWN         */}
        {/* ======================================================= */}
        {activeTab === 'expenses' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Project Selector & Budget Summary */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    প্রজেক্ট নির্বাচন করুন
                  </label>
                  <select
                    value={selectedExpenseProject}
                    onChange={(e) => setSelectedExpenseProject(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm sm:text-base font-black text-gray-900 outline-none focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028]"
                  >
                    {data.projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xs text-gray-400 font-bold">প্রজেক্ট বাজেট</div>
                    <div className="text-base sm:text-lg font-black text-gray-900">
                      {formatBDT(selectedProjForExpense?.budget)}
                    </div>
                  </div>
                  <div className="text-right border-l pl-4 border-gray-200">
                    <div className="text-xs text-[#CE2028] font-bold">এ পর্যন্ত মোট ব্যয়</div>
                    <div className="text-base sm:text-lg font-black text-[#CE2028]">
                      {formatBDT(projectTotalExpense)}
                    </div>
                  </div>
                  <div className="text-right border-l pl-4 border-gray-200">
                    <div className="text-xs text-[#006231] font-bold">অবশিষ্ট ফান্ড</div>
                    <div className="text-base sm:text-lg font-black text-[#006231]">
                      {formatBDT(projectRemainingBudget)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Add New Short Expense Form */}
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    খরচের পর্যায় / বিবরণ (যেমন: পাইলিং, ১ম-৫ম তলা ঢালাই) *
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ১ম থেকে ৫ম তলা আরসিসি ঢালাই"
                    value={expenseForm.title}
                    onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 outline-none focus:border-[#CE2028]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    খরচের পরিমাণ (BDT) *
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 31000000"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-gray-800 outline-none focus:border-[#CE2028]"
                    required
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#A9141B] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#CE2028]/20 hover:opacity-95 transition-all cursor-pointer h-[42px]"
                  >
                    + খরচ এন্ট্রি দিন
                  </button>
                </div>
              </form>
            </div>

            {/* Expenses Breakdown Table */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedProjForExpense?.name} - পর্যায়ভিত্তিক খরচের সংক্ষিপ্ত বিবরণ
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">ফ্লোর ও কনস্ট্রাকশন ধাপ অনুযায়ী খরচের হিসাব</p>
                </div>
                <span className="text-xs font-bold text-[#CE2028] bg-red-50 px-2.5 py-1 rounded-md">
                  মোট ব্যয়: {formatBDT(projectTotalExpense)}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold text-xs">
                    <tr>
                      <th className="py-3.5 px-6">খরচের পর্যায় / বিবরণ</th>
                      <th className="py-3.5 px-6">তারিখ</th>
                      <th className="py-3.5 px-6 text-right">ব্যয়কৃত পরিমাণ</th>
                      <th className="py-3.5 px-6 text-center">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                    {selectedProjForExpense?.expenses && selectedProjForExpense.expenses.length > 0 ? (
                      selectedProjForExpense.expenses.map((exp, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-4 px-6 font-bold text-gray-900">{exp.title}</td>
                          <td className="py-4 px-6 text-gray-500">{exp.date}</td>
                          <td className="py-4 px-6 text-right font-black text-[#CE2028]">
                            {formatBDT(exp.amount)}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#006231] text-xs font-bold border border-emerald-100">
                              <Check className="w-3 h-3 text-[#8EBF40]" />
                              <span>বিল পরিশোধিত</span>
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-400 text-xs">
                          এই প্রজেক্টে এখনো কোনো খরচের এন্ট্রি যুক্ত করা হয়নি।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* TAB 5: MANAGEMENT TEAM                                  */}
        {/* ======================================================= */}
        {activeTab === 'team' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-gray-900">ম্যানেজমেন্ট টিম ও দায়িত্বপ্রাপ্ত কর্মকর্তাগণ</h3>
                <p className="text-xs text-gray-500">অ্যাডমিন, অ্যাকাউন্টস ও সাইট ইঞ্জিনিয়ারদের তালিকা</p>
              </div>
              <button
                onClick={() => setIsTeamModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#A9141B] text-white font-bold text-xs shadow-md shadow-[#CE2028]/20 hover:opacity-95 transition-all flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন কর্মকর্তা যুক্ত করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.managementTeam.map((mem) => (
                <div key={mem.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-red-50 text-[#CE2028] flex items-center justify-center font-black text-lg">
                      <HardHat className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900">{mem.name}</h4>
                      <p className="text-xs text-gray-500">{mem.role}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1">
                    <div>মোবাইল: <strong className="text-gray-900">{mem.phone}</strong></div>
                    <div>অ্যাক্সেস কী: <span className="font-mono text-gray-600">{mem.accessKey}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* 4. STICKY FOOTER NAVBAR (ALL 5 MANAGEMENT OPTIONS AT BOTTOM) */}
      {/* ========================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl py-1.5 px-2">
        <div className="grid grid-cols-5 max-w-lg mx-auto gap-1">
          {managementNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
                  isActive 
                    ? 'text-[#CE2028] font-black' 
                    : 'text-gray-500 hover:text-gray-800 font-semibold'
                }`}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CE2028] mb-1 animate-pulse"></span>
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-[#CE2028]' : 'text-gray-400'} transition-transform`} />
                <span className="text-3xs mt-1 tracking-tight text-center truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ========================================================= */}
      {/* MODAL 1: ADD CLIENT                                       */}
      {/* ========================================================= */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              নতুন ক্লায়েন্ট / ফ্ল্যাট ক্রেতা নিবন্ধন
            </h3>

            <form onSubmit={handleAddClient} className="space-y-4 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    কাস্টমারের নাম *
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: মোহাম্মদ আরিফুল ইসলাম"
                    value={clientForm.name}
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-800 outline-none focus:border-[#CE2028]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    placeholder="যেমন: 01711223344"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-800 outline-none focus:border-[#CE2028]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    প্রজেক্ট নির্বাচন *
                  </label>
                  <select
                    value={clientForm.projectId}
                    onChange={(e) => setClientForm({ ...clientForm, projectId: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-gray-800 outline-none focus:border-[#CE2028]"
                  >
                    {data.projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    ফ্ল্যাট ও সাইজ বিবরণ *
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ৭ম তলা, ফ্ল্যাট ৭-বি (১২৬৫ বর্গফুট)"
                    value={clientForm.flatNo}
                    onChange={(e) => setClientForm({ ...clientForm, flatNo: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-800 outline-none focus:border-[#CE2028]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    মোট চুক্তি মূল্য (BDT) *
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 12000000"
                    value={clientForm.totalPrice}
                    onChange={(e) => setClientForm({ ...clientForm, totalPrice: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-gray-800 outline-none focus:border-[#CE2028]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    বুকিং মানি / প্রাথমিক জমা (BDT)
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 2400000"
                    value={clientForm.initialPaid}
                    onChange={(e) => setClientForm({ ...clientForm, initialPaid: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-800 outline-none focus:border-[#CE2028]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    পরবর্তী কিস্তির তারিখ
                  </label>
                  <input
                    type="text"
                    value={clientForm.nextDueDate}
                    onChange={(e) => setClientForm({ ...clientForm, nextDueDate: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-800 outline-none focus:border-[#CE2028]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    পরবর্তী কিস্তির পরিমাণ (BDT)
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 600000"
                    value={clientForm.nextDueAmount}
                    onChange={(e) => setClientForm({ ...clientForm, nextDueAmount: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-800 outline-none focus:border-[#CE2028]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#A9141B] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#CE2028]/25 hover:opacity-95 transition-all cursor-pointer"
                >
                  নিশ্চিত করুন ও ক্লায়েন্ট তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ADD PROJECT                                      */}
      {/* ========================================================= */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              নতুন প্রজেক্ট যোগ করুন
            </h3>

            <form onSubmit={handleAddProject} className="space-y-4 pt-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  প্রজেক্টের নাম *
                </label>
                <input
                  type="text"
                  placeholder="যেমন: আল-ইমারাহ হাইটস"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-800 outline-none focus:border-[#CE2028]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  লোকেশন / ঠিকানা
                </label>
                <input
                  type="text"
                  placeholder="যেমন: পুরানা পল্টন, ঢাকা"
                  value={projectForm.location}
                  onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-800 outline-none focus:border-[#CE2028]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  মোট আনুমানিক বাজেট (BDT) *
                </label>
                <input
                  type="number"
                  placeholder="যেমন: 85000000"
                  value={projectForm.budget}
                  onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-gray-800 outline-none focus:border-[#CE2028]"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#A9141B] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#CE2028]/25 hover:opacity-95 transition-all cursor-pointer"
                >
                  প্রজেক্ট যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ADD TEAM MEMBER                                  */}
      {/* ========================================================= */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              নতুন কর্মকর্তা / অ্যাডমিন যুক্ত করুন
            </h3>

            <form onSubmit={handleAddTeam} className="space-y-4 pt-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  কর্মকর্তার নাম *
                </label>
                <input
                  type="text"
                  placeholder="যেমন: প্রকৌশলী মাহমুদুর রহমান"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-800 outline-none focus:border-[#CE2028]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  মোবাইল নম্বর *
                </label>
                <input
                  type="tel"
                  placeholder="যেমন: 01918646575"
                  value={teamForm.phone}
                  onChange={(e) => setTeamForm({ ...teamForm, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-800 outline-none focus:border-[#CE2028]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  পদবী / রোল
                </label>
                <select
                  value={teamForm.role}
                  onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-gray-800 outline-none focus:border-[#CE2028]"
                >
                  <option value="সাইট ইঞ্জিনিয়ার">সাইট ইঞ্জিনিয়ার</option>
                  <option value="প্রজেক্ট ডিরেক্টর">প্রজেক্ট ডিরেক্টর</option>
                  <option value="অ্যাকাউন্টস অফিসার">অ্যাকাউন্টস অফিসার</option>
                  <option value="সিনিয়র অ্যাডমিন">সিনিয়র অ্যাডমিন</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  লগইন অ্যাক্সেস কী / পাসওয়ার্ড
                </label>
                <input
                  type="text"
                  value={teamForm.accessKey}
                  onChange={(e) => setTeamForm({ ...teamForm, accessKey: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-800 outline-none focus:border-[#CE2028]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#A9141B] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#CE2028]/25 hover:opacity-95 transition-all cursor-pointer"
                >
                  যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
