import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Wallet, 
  HardHat, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowUpRight, 
  Filter, 
  Phone, 
  Home, 
  LogOut, 
  ShieldCheck, 
  X, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Check, 
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  MapPin,
  CreditCard,
  Key,
  FileText,
  Layers,
  Eye
} from 'lucide-react';
import { 
  formatBDT, 
  getManagementData, 
  saveManagementData, 
  subscribeToManagementData 
} from '../data/managementStore';

export default function ManagementDashboard({ 
  admin, 
  lang = 'bn', 
  t, 
  onLogout, 
  onNavigateHome 
}) {
  const [data, setData] = useState(getManagementData);
  const [activeTab, setActiveTab] = useState('clients'); // 'clients', 'payments', 'projects', 'expenses', 'team'
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [selectedClientForProfile, setSelectedClientForProfile] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [successAlert, setSuccessAlert] = useState('');

  const profileRef = useRef(null);

  // Subscribe to central store updates
  useEffect(() => {
    const unsubscribe = subscribeToManagementData((newData) => {
      setData(newData);
    });
    return () => unsubscribe();
  }, []);

  const updateStore = (updater) => {
    const updated = typeof updater === 'function' ? updater(data) : updater;
    setData(updated);
    saveManagementData(updated);
  };

  const triggerAlert = (msg) => {
    setSuccessAlert(msg);
    setTimeout(() => setSuccessAlert(''), 3500);
  };

  // Close profile dropdown on outside click (supports mouse and mobile touch)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
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
      nextDueDate: clientForm.nextDueDate || '১৫ নভেম্বর, ২০২৬',
      nextDueAmount: Number(clientForm.nextDueAmount) || 0,
      paymentHistory: initialPaidNum > 0 ? [
        {
          id: `TRX-${Math.floor(100 + Math.random() * 900)}`,
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
    triggerAlert(`নতুন ক্লায়েন্ট "${newClient.name}" সফলভাবে যুক্ত হয়েছেন!`);
  };

  const handleReceivePayment = (e) => {
    e.preventDefault();
    const payAmount = Number(paymentForm.amount);
    if (!payAmount || payAmount <= 0) {
      alert('অনুগ্রহ করে জমার সঠিক টাকার পরিমাণ লিখুন।');
      return;
    }

    const targetClient = data.clients.find(c => c.id === paymentForm.clientId);
    if (!targetClient) {
      alert('ক্লায়েন্ট খুঁজে পাওয়া যায়নি।');
      return;
    }

    const newTrx = {
      id: `TRX-${Math.floor(100 + Math.random() * 900)}`,
      date: paymentForm.date || new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      amount: payAmount,
      method: paymentForm.method || 'ব্যাংক ডিপোজিট'
    };

    updateStore((prev) => ({
      ...prev,
      clients: prev.clients.map(c => {
        if (c.id === targetClient.id) {
          return {
            ...c,
            totalPaid: (c.totalPaid || 0) + payAmount,
            paymentHistory: [newTrx, ...(c.paymentHistory || [])]
          };
        }
        return c;
      })
    }));

    setPaymentForm({
      ...paymentForm,
      amount: '',
      note: ''
    });
    triggerAlert(`৳ ${payAmount.toLocaleString('bn-BD')} টাকা জমা এন্ট্রি সফল হয়েছে!`);
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!projectForm.name || !projectForm.budget) {
      alert('প্রজেক্টের নাম ও আনুমানিক বাজেট পূরণ করুন।');
      return;
    }

    const newProj = {
      id: `proj-${Date.now().toString().slice(-4)}`,
      name: projectForm.name,
      location: projectForm.location || 'ঢাকা',
      progress: Number(projectForm.progress) || 10,
      currentStage: projectForm.currentStage || 'পাইলিং ও সাইট প্রিপারেশন',
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

  // Calculations for Stats
  const totalClientsCount = data.clients.length;
  const totalCollections = data.clients.reduce((acc, c) => acc + (c.totalPaid || 0), 0);
  const totalContractVal = data.clients.reduce((acc, c) => acc + (c.totalPrice || 0), 0);
  const totalDues = totalContractVal - totalCollections;
  const totalConstructionSpent = data.projects.reduce((acc, p) => {
    const pExp = (p.expenses || []).reduce((eAcc, e) => eAcc + (e.amount || 0), 0);
    return acc + pExp;
  }, 0);

  // Filter clients
  const filteredClients = data.clients.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.projectName.toLowerCase().includes(q)
    );
    const matchesProject = projectFilter === 'all' || c.projectId === projectFilter;
    return matchesSearch && matchesProject;
  });

  const selectedProjForExpense = data.projects.find(p => p.id === selectedExpenseProject) || data.projects[0];
  const projectTotalExpense = (selectedProjForExpense?.expenses || []).reduce((acc, e) => acc + (e.amount || 0), 0);
  const projectRemainingBudget = (selectedProjForExpense?.budget || 0) - projectTotalExpense;

  // Selected client for quick payment calculation
  const targetClientForCalc = data.clients.find(c => c.id === paymentForm.clientId);
  const targetClientDue = (targetClientForCalc?.totalPrice || 0) - (targetClientForCalc?.totalPaid || 0);

  // Management Footer Navbar items (Exactly 5 icons)
  const managementNavItems = [
    { id: 'clients', label: '১. ক্লায়েন্ট তালিকা ও নতুন এন্ট্রি', shortLabel: 'ক্লায়েন্ট', icon: Users },
    { id: 'payments', label: '২. কিস্তি ও জমা এন্ট্রি', shortLabel: 'জমা এন্ট্রি', icon: DollarSign },
    { id: 'projects', label: '৩. প্রজেক্ট কন্ট্রোল ও স্টেজ', shortLabel: 'প্রজেক্ট', icon: Building2 },
    { id: 'expenses', label: '৪. প্রজেক্ট বাজেট ও খরচ', shortLabel: 'বাজেট ও খরচ', icon: Wallet },
    { id: 'team', label: '৫. ম্যানেজমেন্ট টিম ও অফিসার', shortLabel: 'টিম', icon: HardHat }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col md:flex-row font-sans animate-fadeIn">
      
      {/* ========================================================= */}
      {/* 1. WEB VIEW: LEFT SIDEBAR NAVIGATION (SOFTWARE / ERP STYLE)*/}
      {/* ========================================================= */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200/80 h-screen sticky top-0 shrink-0 z-30 justify-between p-5 select-none">
        
        {/* Top: Logo & Manager Mini Card */}
        <div className="space-y-6">
          {/* Logo & Software Tag */}
          <div>
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-2 group cursor-pointer text-left"
              title="ওয়েবসাইটে ফিরে যান"
            >
              <img 
                src="/alemarah_logo_header.svg" 
                alt="Al-Emarah Properties" 
                className="h-9 w-auto object-contain"
              />
            </button>
            <div className="mt-2.5 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-50 text-[#CE2028] text-3xs font-bold border border-red-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CE2028] animate-pulse"></span>
              <span>ম্যানেজমেন্ট সফটওয়্যার v2.0</span>
            </div>
          </div>

          {/* Manager Mini Profile Card in Sidebar */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center space-x-3">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#CE2028] to-[#991B1B] text-white flex items-center justify-center font-black text-sm shadow-2xs">
                {admin?.name ? admin.name.slice(0, 2) : 'ম্যা'}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-slate-900 truncate">
                {admin?.name || 'অ্যাডমিন কর্মকর্তা'}
              </div>
              <div className="text-3xs text-[#006231] font-bold truncate">
                {admin?.role || 'ম্যানেজমেন্ট টিম'}
              </div>
              <div className="text-3xs text-slate-400 font-semibold truncate">
                {admin?.phone || '০১৯১৮-৬৪৬৫৭৫'}
              </div>
            </div>
          </div>

          {/* Sidebar Navigation Menu (All 5 Options on the Left) */}
          <nav className="space-y-1.5 pt-1">
            <div className="text-3xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              নেভিগেশন মেনু
            </div>
            {managementNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all text-xs font-bold cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#CE2028] to-[#991B1B] text-white shadow-md shadow-[#CE2028]/25 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Actions */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <a
            href="tel:01918646575"
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-2xs font-semibold transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#006231]" />
            <span>হটলাইন: ০১৯১৮-৬৪৬৫৭৫</span>
          </a>

          <button
            onClick={onNavigateHome}
            className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#CE2028]" />
            <span>ওয়েবসাইটে ফিরে যান</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-[#CE2028] text-[#CE2028] hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE / CONTENT AREA (RIGHT SIDE IN WEB VIEW)  */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-28 md:pb-10">

        {/* Mobile-Only Top App Bar: Clean with Logo and Avatar (Badge removed) */}
        <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs py-2.5 px-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onNavigateHome}
              className="flex items-center cursor-pointer text-left transition-transform active:scale-95"
              title="ওয়েবসাইটে ফিরে যান"
            >
              <img 
                src="/alemarah_logo_header.svg" 
                alt="Al-Emarah Properties" 
                className="h-8 w-auto object-contain"
              />
            </button>

            {/* Right: Circular Manager Avatar & Menu for Mobile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="relative cursor-pointer rounded-full p-0 border-0 bg-transparent focus:outline-none transition-transform hover:scale-105 active:scale-95 block"
                aria-expanded={isProfileOpen}
                title="ম্যানেজমেন্ট মেনু"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#CE2028] to-[#991B1B] text-white flex items-center justify-center font-black text-xs ring-2 ring-[#CE2028]/30 shadow-xs">
                  {admin?.name ? admin.name.slice(0, 2) : 'ম্যা'}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </button>

              {/* Mobile Backdrop Overlay */}
              {isProfileOpen && (
                <div 
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
                  onClick={() => setIsProfileOpen(false)}
                />
              )}

              {/* Manager Profile Popup Drawer / Dropdown */}
              {isProfileOpen && (
                <div className="fixed inset-x-4 top-16 max-w-sm mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-50 animate-fadeIn divide-y divide-slate-100">
                  <div className="px-5 py-3">
                    <div className="text-sm font-black text-slate-900 truncate">
                      {admin?.name || 'অ্যাডমিন কর্মকর্তা'}
                    </div>
                    <div className="text-xs text-[#006231] font-semibold mt-0.5">
                      {admin?.role || 'ম্যানেজমেন্ট টিম'}
                    </div>
                    <div className="text-2xs text-slate-400 mt-0.5">
                      মোবাইল: {admin?.phone || '০১৯১৮-৬৪৬৫৭৫'}
                    </div>
                  </div>

                  <div className="p-2 space-y-1 text-xs font-bold text-slate-700">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onNavigateHome();
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors text-left cursor-pointer"
                    >
                      <Home className="w-4 h-4 text-[#CE2028]" />
                      <span>ওয়েবসাইটে ফিরে যান</span>
                    </button>
                    <a
                      href="tel:01918646575"
                      className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
                    >
                      <Phone className="w-4 h-4 text-[#006231]" />
                      <span>সাইট হটলাইনে কল করুন</span>
                    </a>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-[#CE2028] text-[#CE2028] hover:text-white transition-all text-xs font-bold text-left cursor-pointer active:scale-95"
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

        {/* Desktop-Only Subtle Top Bar (Breadcrumb & Live Project Tag) */}
        <header className="hidden md:flex items-center justify-between px-6 lg:px-8 py-4 bg-white/60 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20">
          <div>
            <h1 className="text-base font-black text-slate-900">
              {managementNavItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-2xs text-slate-500">
              সিস্টেম স্ট্যাটাস: <strong className="text-slate-800">কেন্দ্রীয় ডেটাবেজ লাইভ সিঙ্কড</strong>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 text-[#CE2028] text-xs font-bold border border-red-200/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>অ্যাডমিন কন্ট্রোল এক্সেস</span>
            </div>
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Home className="w-3.5 h-3.5 text-[#8EBF40]" />
              <span>ওয়েবসাইট</span>
            </button>
          </div>
        </header>

        {/* Floating Success Toast Alert */}
        {successAlert && (
          <div className="fixed top-16 right-4 z-50 bg-[#006231] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-xs sm:text-sm font-bold animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-[#8EBF40]" />
            <span>{successAlert}</span>
          </div>
        )}

      {/* ========================================================= */}
      {/* 2. STATS OVERVIEW CARDS (PHONE OPTIMIZED)                 */}
      {/* ========================================================= */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-3xs sm:text-2xs font-bold uppercase">
              <span>মোট ক্লায়েন্ট</span>
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
            </div>
            <div className="text-base sm:text-2xl font-black text-slate-900 truncate">
              {totalClientsCount} জন
            </div>
            <div className="text-3xs text-slate-400 truncate">নিবন্ধিত ফ্ল্যাট ক্রেতা</div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/20 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#006231] text-3xs sm:text-2xs font-bold uppercase">
              <span className="truncate">সংগৃহীত টাকা</span>
              <DollarSign className="w-4 h-4 text-[#006231] shrink-0" />
            </div>
            <div className="text-base sm:text-2xl font-black text-[#006231] truncate">
              {formatBDT(totalCollections)}
            </div>
            <div className="text-3xs text-[#006231] font-semibold truncate">মোট পরিশোধিত জমা</div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-200/80 bg-gradient-to-b from-white to-amber-50/20 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-amber-800 text-3xs sm:text-2xs font-bold uppercase">
              <span className="truncate">মোট বাকি / বকেয়া</span>
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            </div>
            <div className="text-base sm:text-2xl font-black text-amber-700 truncate">
              {formatBDT(totalDues)}
            </div>
            <div className="text-3xs text-amber-700 font-semibold truncate">ভবিষ্যত প্রাপ্য কিস্তি</div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-3xs sm:text-2xs font-bold uppercase">
              <span className="truncate">প্রজেক্টে মোট ব্যয়</span>
              <HardHat className="w-4 h-4 text-[#CE2028] shrink-0" />
            </div>
            <div className="text-base sm:text-2xl font-black text-[#CE2028] truncate">
              {formatBDT(totalConstructionSpent)}
            </div>
            <div className="text-3xs text-slate-400 truncate">{data.projects.length}টি প্রকল্পে মোট ব্যয়</div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN WORKSPACE (SWITCHED VIA FOOTER NAVBAR)            */}
      {/* ========================================================= */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 space-y-5 flex-1">
        
        {/* ------------------------------------------------------- */}
        {/* TAB 1: CLIENT MANAGEMENT                                */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'clients' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Search & Project Filter Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="নাম, ফোন বা আইডি দিয়ে খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028] outline-none transition-all"
                  />
                </div>

                <button
                  onClick={() => setIsClientModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#991B1B] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#CE2028]/20 hover:opacity-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ নতুন ক্লায়েন্ট যোগ করুন</span>
                </button>
              </div>

              {/* Project Filter Pills (with no-scrollbar) */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-2xs font-semibold no-scrollbar">
                <button
                  onClick={() => setProjectFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    projectFilter === 'all'
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  সব প্রজেক্ট ({data.clients.length})
                </button>
                {data.projects.map(p => {
                  const count = data.clients.filter(c => c.projectId === p.id).length;
                  const isSelected = projectFilter === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setProjectFilter(p.id)}
                      className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#006231] text-white font-bold shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/60'
                      }`}
                    >
                      {p.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile-First Clients Cards View: Clean & Compact List */}
            <div className="block md:hidden space-y-2.5">
              {filteredClients.map((cl) => {
                const due = (cl.totalPrice || 0) - (cl.totalPaid || 0);

                return (
                  <div 
                    key={cl.id} 
                    onClick={() => setSelectedClientForProfile(cl)}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-[#006231]/40 hover:shadow-xs transition-all p-3.5 flex items-center justify-between gap-3 cursor-pointer group active:scale-[0.99]"
                    title="সম্পূর্ণ প্রোফাইল দেখতে ক্লিক করুন"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                        {cl.name ? cl.name.slice(0, 2) : 'গ্রা'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-black text-slate-900 text-sm truncate group-hover:text-[#006231] transition-colors">
                            {cl.name}
                          </h4>
                          <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded text-3xs font-semibold shrink-0">
                            {cl.id}
                          </span>
                        </div>
                        <div className="text-2xs text-slate-500 font-medium truncate mt-0.5 flex items-center space-x-1.5">
                          <span>{cl.phone}</span>
                          <span>•</span>
                          <span className="text-slate-700 font-semibold truncate">{cl.projectName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-emerald-50 text-[#006231] border border-emerald-200/70 text-3xs font-bold">
                          {cl.flatNo.split(' ')[0] || cl.flatNo}
                        </span>
                        <div className="text-3xs text-amber-700 font-bold mt-0.5">
                          বাকি: {formatBDT(due)}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#006231] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Clients Table View */}
            <div className="hidden md:block bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-bold text-xs">
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
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {filteredClients.map((cl) => {
                      const due = (cl.totalPrice || 0) - (cl.totalPaid || 0);
                      const percent = cl.totalPrice ? Math.round((cl.totalPaid / cl.totalPrice) * 100) : 0;

                      return (
                        <tr 
                          key={cl.id} 
                          onClick={() => setSelectedClientForProfile(cl)}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                          title="প্রোফাইল দেখতে ক্লিক করুন"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                {cl.name ? cl.name.slice(0, 2) : 'গ্রা'}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 group-hover:text-[#006231] transition-colors flex items-center space-x-1.5">
                                  <span>{cl.name}</span>
                                  <span className="font-mono text-3xs text-slate-400 bg-slate-100 px-1 py-0.2 rounded font-normal">
                                    {cl.id}
                                  </span>
                                </div>
                                <div className="text-2xs text-slate-500">{cl.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-800">{cl.projectName}</div>
                            <div className="text-2xs text-emerald-700 font-semibold">{cl.flatNo}</div>
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900">
                            {formatBDT(cl.totalPrice)}
                          </td>
                          <td className="py-4 px-6 font-black text-[#006231]">
                            <div>{formatBDT(cl.totalPaid)}</div>
                            <span className="text-3xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                              {percent}% আদায়
                            </span>
                          </td>
                          <td className="py-4 px-6 font-bold text-amber-700">
                            {formatBDT(due)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-xs text-slate-900 font-bold">{cl.nextDueDate}</div>
                            <div className="text-2xs text-[#CE2028] font-bold">{formatBDT(cl.nextDueAmount)}</div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedClientForProfile(cl);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                              >
                                প্রোফাইল
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPaymentForm({
                                    ...paymentForm,
                                    clientId: cl.id,
                                    amount: cl.nextDueAmount || ''
                                  });
                                  setActiveTab('payments');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-[#006231] text-[#006231] hover:text-white font-bold text-xs border border-emerald-200 transition-all cursor-pointer active:scale-95"
                              >
                                + জমা
                              </button>
                            </div>
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

        {/* ------------------------------------------------------- */}
        {/* TAB 2: কিস্তি ও জমা এন্ট্রি (PAYMENTS COLLECTION)        */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'payments' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
            {/* Payment Entry Form (5 cols) */}
            <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-[#006231]" />
                  <span>কিস্তি বা টাকা জমার নতুন এন্ট্রি</span>
                </h3>
                <p className="text-2xs text-slate-500 mt-0.5">
                  কাস্টমার থেকে টাকা জমা পেলে এখানে এন্ট্রি দিন। সাথে সাথে কাস্টমার পোর্টালে যুক্ত হবে।
                </p>
              </div>

              <form onSubmit={handleReceivePayment} className="space-y-4">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    কাস্টমার নির্বাচন করুন *
                  </label>
                  <select
                    value={paymentForm.clientId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, clientId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028]"
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
                  {targetClientForCalc && (
                    <div className="mt-1 text-2xs text-slate-500 flex justify-between">
                      <span>মোট মূল্য: {formatBDT(targetClientForCalc.totalPrice)}</span>
                      <span className="font-bold text-amber-700">বর্তমান বকেয়া: {formatBDT(targetClientDue)}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    জমার টাকার পরিমাণ (BDT) *
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 600000"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028]"
                    required
                  />
                  {paymentForm.amount && targetClientDue > 0 && (
                    <div className="mt-1 text-2xs text-[#006231] font-semibold">
                      জমা প্রদানের পর অবশিষ্ট বকেয়া থাকবে: {formatBDT(Math.max(0, targetClientDue - Number(paymentForm.amount)))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      জমার তারিখ
                    </label>
                    <input
                      type="text"
                      value={paymentForm.date}
                      onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-[#CE2028]"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      পেমেন্ট মাধ্যম
                    </label>
                    <select
                      value={paymentForm.method}
                      onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
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
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    রসিদ নম্বর বা নোট (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ব্যাংক চালান #৮২০১"
                    value={paymentForm.note}
                    onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-[#CE2028]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#006231] to-[#0A4D27] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-900/20 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center space-x-1.5 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>জমা নিশ্চিত করুন ও এন্ট্রি দিন</span>
                </button>
              </form>
            </div>

            {/* Recent Collections Feed (7 cols) */}
            <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">সাম্প্রতিক সংগৃহীত কিস্তির তালিকা</h3>
                  <p className="text-2xs text-slate-500 mt-0.5">সকল কাস্টমার থেকে সংগৃহীত এন্ট্রিসমূহ</p>
                </div>
                <span className="text-xs font-bold text-[#006231] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  সর্বমোট: {formatBDT(totalCollections)}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {data.clients.flatMap(c => (c.paymentHistory || []).map(p => ({ ...p, clientName: c.name, projectName: c.projectName, clientId: c.id })))
                  .sort((a, b) => (b.id > a.id ? 1 : -1))
                  .map((trx, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                          <span>{trx.clientName}</span>
                          <span className="text-3xs text-slate-400 font-normal">({trx.projectName})</span>
                        </div>
                        <div className="text-2xs text-slate-500">
                          {trx.date} • {trx.method} • রসিদ: {trx.id}
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

        {/* ------------------------------------------------------- */}
        {/* TAB 3: PROJECT MANAGEMENT & PROGRESS UPDATE             */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'projects' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">চলমান ও আসন্ন প্রজেক্টসমূহ</h3>
                <p className="text-xs text-slate-500">প্রজেক্টের কাজের শতাংশ ও চলমান তলার কাজ আপডেট করুন</p>
              </div>
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#991B1B] text-white font-bold text-xs shadow-md shadow-[#CE2028]/20 hover:opacity-95 transition-all flex items-center justify-center space-x-1 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন প্রজেক্ট যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.projects.map((proj) => {
                const projClients = data.clients.filter(c => c.projectId === proj.id);
                return (
                  <div key={proj.id} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-slate-900">{proj.name}</h4>
                        <p className="text-xs text-slate-500 flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-[#CE2028]" />
                          <span>{proj.location}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-[#006231]">{proj.progress}%</span>
                        <div className="text-3xs text-slate-400 font-bold">সম্পন্ন</div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>কাজের অগ্রগতি স্লাইডার:</span>
                        <span className="text-[#CE2028] font-black">{proj.progress}%</span>
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
                      <label className="block text-3xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        বর্তমান চলমান কাজের বিবরণ (ফ্লোর/ফেজ)
                      </label>
                      <input
                        type="text"
                        defaultValue={proj.currentStage}
                        onBlur={(e) => handleUpdateProjectProgress(proj.id, proj.progress, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-3xs text-slate-400 font-bold">মোট বাজেট</div>
                        <div className="font-bold text-slate-900 mt-0.5 truncate">{formatBDT(proj.budget)}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-3xs text-slate-400 font-bold">নিবন্ধিত ক্রেতা</div>
                        <div className="font-bold text-[#006231] mt-0.5">{projClients.length} জন</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 4: PROJECT EXPENSE & SHORT BUDGET BREAKDOWN         */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'expenses' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Top Project Selector & Budget Summary */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="w-full lg:w-auto">
                  <label className="block text-2xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    প্রজেক্ট নির্বাচন করুন
                  </label>
                  <select
                    value={selectedExpenseProject}
                    onChange={(e) => setSelectedExpenseProject(e.target.value)}
                    className="w-full lg:w-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm sm:text-base font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028]"
                  >
                    {data.projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2 w-full lg:w-auto divide-x divide-slate-100 lg:divide-x-0">
                  <div className="text-center sm:text-right px-1">
                    <div className="text-3xs text-slate-400 font-bold uppercase">প্রজেক্ট বাজেট</div>
                    <div className="text-xs sm:text-base font-black text-slate-900 truncate">
                      {formatBDT(selectedProjForExpense?.budget)}
                    </div>
                  </div>
                  <div className="text-center sm:text-right px-1 lg:border-l lg:pl-4 lg:border-slate-200">
                    <div className="text-3xs text-[#CE2028] font-bold uppercase">মোট ব্যয়</div>
                    <div className="text-xs sm:text-base font-black text-[#CE2028] truncate">
                      {formatBDT(projectTotalExpense)}
                    </div>
                  </div>
                  <div className="text-center sm:text-right px-1 lg:border-l lg:pl-4 lg:border-slate-200">
                    <div className="text-3xs text-[#006231] font-bold uppercase">অবশিষ্ট ফান্ড</div>
                    <div className="text-xs sm:text-base font-black text-[#006231] truncate">
                      {formatBDT(projectRemainingBudget)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Add New Short Expense Form */}
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    খরচের পর্যায় / বিবরণ (যেমন: ১ম-৫ম তলা ঢালাই) *
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ১ম থেকে ৫ম তলা আরসিসি ঢালাই"
                    value={expenseForm.title}
                    onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    খরচের পরিমাণ (BDT) *
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 31000000"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                    required
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#991B1B] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#CE2028]/20 hover:opacity-95 transition-all cursor-pointer h-[38px] active:scale-95"
                  >
                    + খরচ এন্ট্রি দিন
                  </button>
                </div>
              </form>
            </div>

            {/* Expenses Breakdown Mobile Cards & Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedProjForExpense?.name} - পর্যায়ভিত্তিক খরচের সংক্ষিপ্ত বিবরণ
                  </h3>
                  <p className="text-2xs text-slate-500">ফ্লোর ও কনস্ট্রাকশন ধাপ অনুযায়ী খরচের হিসাব</p>
                </div>
                <span className="text-xs font-bold text-[#CE2028] bg-red-50 px-2.5 py-1 rounded-full self-start sm:self-auto border border-red-100">
                  মোট ব্যয়: {formatBDT(projectTotalExpense)}
                </span>
              </div>

              {/* Mobile Cards View (Phones) */}
              <div className="block md:hidden p-4 space-y-2.5">
                {selectedProjForExpense?.expenses && selectedProjForExpense.expenses.length > 0 ? (
                  selectedProjForExpense.expenses.map((exp, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">{exp.title}</div>
                        <div className="text-2xs text-slate-500 mt-0.5">{exp.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-sm text-[#CE2028]">{formatBDT(exp.amount)}</div>
                        <span className="text-3xs px-2 py-0.5 rounded-full bg-emerald-50 text-[#006231] font-bold border border-emerald-100">
                          বিল পরিশোধিত
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    এই প্রজেক্টে এখনো কোনো খরচের এন্ট্রি যুক্ত করা হয়নি।
                  </div>
                )}
              </div>

              {/* Desktop Table View (Tablets & Desktops) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-bold text-xs">
                    <tr>
                      <th className="py-3.5 px-6">খরচের পর্যায় / বিবরণ</th>
                      <th className="py-3.5 px-6">তারিখ</th>
                      <th className="py-3.5 px-6 text-right">ব্যয়কৃত পরিমাণ</th>
                      <th className="py-3.5 px-6 text-center">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {selectedProjForExpense?.expenses && selectedProjForExpense.expenses.length > 0 ? (
                      selectedProjForExpense.expenses.map((exp, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900">{exp.title}</td>
                          <td className="py-4 px-6 text-slate-500">{exp.date}</td>
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
                        <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
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

        {/* ------------------------------------------------------- */}
        {/* TAB 5: MANAGEMENT TEAM                                  */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'team' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">ম্যানেজমেন্ট টিম ও দায়িত্বপ্রাপ্ত কর্মকর্তাগণ</h3>
                <p className="text-xs text-slate-500">অ্যাডমিন, অ্যাকাউন্টস ও সাইট ইঞ্জিনিয়ারদের তালিকা</p>
              </div>
              <button
                onClick={() => setIsTeamModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#991B1B] text-white font-bold text-xs shadow-md shadow-[#CE2028]/20 hover:opacity-95 transition-all flex items-center justify-center space-x-1 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন কর্মকর্তা যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {data.managementTeam.map((mem) => (
                <div key={mem.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#CE2028] flex items-center justify-center font-black text-base">
                      <HardHat className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{mem.name}</h4>
                      <p className="text-xs text-[#006231] font-semibold">{mem.role}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div>মোবাইল: <strong className="text-slate-900 font-mono">{mem.phone}</strong></div>
                    <div>অ্যাক্সেস কী: <span className="font-mono text-slate-600 font-semibold">{mem.accessKey}</span></div>
                  </div>

                  <a
                    href={`tel:${mem.phone}`}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#006231]" />
                    <span>কল দিন</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
      </div>

      {/* ========================================================= */}
      {/* 4. FLOATING PILL FOOTER NAVBAR (EXACTLY 5 ICONS - PHONE ONLY) */}
      {/* ========================================================= */}
      <nav className="md:hidden fixed bottom-3 left-4 right-4 z-50 max-w-sm sm:max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl rounded-full py-1.5 px-3 flex items-center justify-around ring-1 ring-black/5">
          {managementNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-label={item.shortLabel || item.label}
                title={item.label}
                className={`p-2.5 rounded-full transition-all cursor-pointer relative ${
                  isActive 
                    ? 'bg-red-50 text-[#CE2028] scale-110 shadow-xs' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CE2028] absolute -top-1 left-1/2 -translate-x-1/2 animate-pulse"></span>
                )}
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                নতুন ক্লায়েন্ট / ফ্ল্যাট ক্রেতা নিবন্ধন
              </h3>
              <button 
                onClick={() => setIsClientModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    কাস্টমারের নাম *
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: মোহাম্মদ আরিফুল ইসলাম"
                    value={clientForm.name}
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
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
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    প্রজেক্ট নির্বাচন *
                  </label>
                  <select
                    value={clientForm.projectId}
                    onChange={(e) => setClientForm({ ...clientForm, projectId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                  >
                    {data.projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ফ্ল্যাট ও সাইজ বিবরণ *
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ৭ম তলা, ফ্ল্যাট ৭-বি (১২৬৫ বর্গফুট)"
                    value={clientForm.flatNo}
                    onChange={(e) => setClientForm({ ...clientForm, flatNo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    মোট চুক্তি মূল্য (BDT) *
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 12000000"
                    value={clientForm.totalPrice}
                    onChange={(e) => setClientForm({ ...clientForm, totalPrice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    বুকিং মানি / প্রাথমিক জমা (BDT)
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 2400000"
                    value={clientForm.initialPaid}
                    onChange={(e) => setClientForm({ ...clientForm, initialPaid: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    পরবর্তী কিস্তির তারিখ
                  </label>
                  <input
                    type="text"
                    value={clientForm.nextDueDate}
                    onChange={(e) => setClientForm({ ...clientForm, nextDueDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-[#CE2028]"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    পরবর্তী কিস্তির পরিমাণ (BDT)
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 600000"
                    value={clientForm.nextDueAmount}
                    onChange={(e) => setClientForm({ ...clientForm, nextDueAmount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#991B1B] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#CE2028]/25 hover:opacity-95 transition-all cursor-pointer text-center active:scale-95"
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
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-slate-100 relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                নতুন প্রজেক্ট যোগ করুন
              </h3>
              <button 
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-3.5">
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  প্রজেক্টের নাম *
                </label>
                <input
                  type="text"
                  placeholder="যেমন: আল-ইমারাহ হাইটস"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                  required
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  লোকেশন / ঠিকানা
                </label>
                <input
                  type="text"
                  placeholder="যেমন: পুরানা পল্টন, ঢাকা"
                  value={projectForm.location}
                  onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  মোট আনুমানিক বাজেট (BDT) *
                </label>
                <input
                  type="number"
                  placeholder="যেমন: 85000000"
                  value={projectForm.budget}
                  onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                  required
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#991B1B] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#CE2028]/25 hover:opacity-95 transition-all cursor-pointer text-center active:scale-95"
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
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                নতুন কর্মকর্তা / অ্যাডমিন যুক্ত করুন
              </h3>
              <button 
                onClick={() => setIsTeamModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTeam} className="space-y-3.5">
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  কর্মকর্তার নাম *
                </label>
                <input
                  type="text"
                  placeholder="যেমন: প্রকৌশলী মাহমুদুর রহমান"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                  required
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  মোবাইল নম্বর *
                </label>
                <input
                  type="tel"
                  placeholder="যেমন: 01918646575"
                  value={teamForm.phone}
                  onChange={(e) => setTeamForm({ ...teamForm, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                  required
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  পদবী / রোল
                </label>
                <select
                  value={teamForm.role}
                  onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                >
                  <option value="সাইট ইঞ্জিনিয়ার">সাইট ইঞ্জিনিয়ার</option>
                  <option value="প্রজেক্ট ডিরেক্টর">প্রজেক্ট ডিরেক্টর</option>
                  <option value="অ্যাকাউন্টস অফিসার">অ্যাকাউন্টস অফিসার</option>
                  <option value="সিনিয়র অ্যাডমিন">সিনিয়র অ্যাডমিন</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  লগইন অ্যাক্সেস কী / পাসওয়ার্ড
                </label>
                <input
                  type="text"
                  value={teamForm.accessKey}
                  onChange={(e) => setTeamForm({ ...teamForm, accessKey: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#991B1B] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#CE2028]/25 hover:opacity-95 transition-all cursor-pointer text-center active:scale-95"
                >
                  যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: FULL CLIENT PROFILE DETAILS                      */}
      {/* ========================================================= */}
      {selectedClientForProfile && (() => {
        const cl = selectedClientForProfile;
        const project = data.projects.find(p => p.id === cl.projectId);
        const due = (cl.totalPrice || 0) - (cl.totalPaid || 0);
        const percent = cl.totalPrice ? Math.round((cl.totalPaid / cl.totalPrice) * 100) : 0;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 relative divide-y divide-slate-100">
              
              {/* Profile Header Banner */}
              <div className="p-5 sm:p-6 flex items-start justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-3xl relative">
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-black text-lg ring-4 ring-white/10 shadow-md shrink-0">
                    {cl.name ? cl.name.slice(0, 2) : 'গ্রা'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base sm:text-lg font-black text-white truncate">{cl.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#8EBF40] border border-emerald-400/30 text-3xs font-bold shrink-0">
                        অনুমোদিত ক্লায়েন্ট
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium mt-0.5 truncate">
                      মোবাইল: <strong className="text-white font-mono">{cl.phone}</strong> • আইডি: <span className="font-mono text-emerald-400 font-bold">{cl.id}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedClientForProfile(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                  title="বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Body */}
              <div className="p-5 sm:p-6 space-y-4 text-slate-800">
                
                {/* 1. Property Specs */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2">
                  <div className="text-3xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#006231]" />
                    <span>বরাদ্দকৃত ফ্ল্যাট ও প্রজেক্ট তথ্য</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-3xs block">প্রকল্প ও লোকেশন</span>
                      <strong className="text-slate-800 font-bold">{cl.projectName}</strong>
                      {project?.location && (
                        <p className="text-2xs text-slate-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#CE2028] shrink-0" />
                          <span>{project.location}</span>
                        </p>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-400 text-3xs block">ফ্ল্যাট নম্বর ও সাইজ</span>
                      <strong className="text-[#006231] font-bold">{cl.flatNo}</strong>
                      {project?.currentStage && (
                        <p className="text-2xs text-slate-600 mt-0.5">
                          চলমান কাজ: {project.currentStage} ({project.progress}%)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Financial Overview */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-3">
                  <div className="flex items-center justify-between text-2xs font-bold">
                    <span className="text-emerald-700 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>পরিশোধিত: {percent}%</span>
                    </span>
                    <span className="text-amber-800">বকেয়া বাকি: {formatBDT(due)}</span>
                  </div>

                  <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#006231] to-[#8EBF40] h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                      <div className="text-3xs text-slate-400 font-bold uppercase">মোট চুক্তি</div>
                      <div className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">{formatBDT(cl.totalPrice)}</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                      <div className="text-3xs text-[#006231] font-bold uppercase">পরিশোধিত</div>
                      <div className="text-xs sm:text-sm font-black text-[#006231] mt-0.5">{formatBDT(cl.totalPaid)}</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                      <div className="text-3xs text-amber-800 font-bold uppercase">বাকি টাকা</div>
                      <div className="text-xs sm:text-sm font-black text-amber-700 mt-0.5">{formatBDT(due)}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="text-3xs text-slate-400 font-bold uppercase">পরবর্তী কিস্তির তারিখ</div>
                        <div className="text-xs font-bold text-slate-800">{cl.nextDueDate}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xs text-slate-400 font-bold uppercase">প্রদেয় টাকা</div>
                      <div className="text-xs sm:text-sm font-black text-[#CE2028]">{formatBDT(cl.nextDueAmount)}</div>
                    </div>
                  </div>
                </div>

                {/* 3. Login Credentials for Manager Support */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-bold text-amber-800 uppercase tracking-wider flex items-center space-x-1">
                      <Key className="w-3.5 h-3.5 text-amber-700" />
                      <span>গ্রাহক পোর্টাল লগইন তথ্য</span>
                    </span>
                    <span className="text-3xs text-amber-700">কাস্টমারকে সহায়তা দিন</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 bg-white/90 p-2.5 rounded-xl border border-amber-100 text-center">
                    <div>
                      <span className="text-3xs text-slate-400 block font-bold">লগইন ফোন</span>
                      <span className="font-bold text-slate-800 font-mono text-2xs truncate block">{cl.phone}</span>
                    </div>
                    <div>
                      <span className="text-3xs text-slate-400 block font-bold">আইডি</span>
                      <span className="font-bold text-slate-800 font-mono text-2xs truncate block">{cl.id}</span>
                    </div>
                    <div>
                      <span className="text-3xs text-slate-400 block font-bold">পাসওয়ার্ড</span>
                      <span className="font-bold text-[#CE2028] font-mono text-2xs truncate block">{cl.password || 'password123'}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Payment History Statement */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-2xs font-bold text-slate-700 px-1">
                    <span className="flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#006231]" />
                      <span>পরিশোধিত কিস্তির রেকর্ড ({cl.paymentHistory?.length || 0}টি)</span>
                    </span>
                    <span className="text-3xs text-slate-400">অনুমোদিত রসিদসমূহ</span>
                  </div>

                  {cl.paymentHistory && cl.paymentHistory.length > 0 ? (
                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {cl.paymentHistory.map((trx, tIdx) => (
                        <div key={tIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-2xs">
                          <div className="space-y-0.5">
                            <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                              <span>{trx.method}</span>
                              <span className="font-mono text-3xs text-slate-400">({trx.id})</span>
                            </div>
                            <div className="text-3xs text-slate-500 font-medium">
                              {trx.date}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-xs text-[#006231]">
                              +{formatBDT(trx.amount)}
                            </span>
                            <div className="text-3xs text-emerald-600 font-bold">অনুমোদিত</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-3xs text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                      এখনো কোনো পূর্ববর্তী জমার রেকর্ড যুক্ত করা হয়নি।
                    </div>
                  )}
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 rounded-b-3xl">
                <div className="flex items-center space-x-2">
                  <a
                    href={`tel:${cl.phone}`}
                    className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#006231]" />
                    <span>কল দিন</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedClientForProfile(null)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-bold text-xs transition-colors cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const targetId = cl.id;
                    const nextAmt = cl.nextDueAmount || '';
                    setSelectedClientForProfile(null);
                    setPaymentForm({
                      ...paymentForm,
                      clientId: targetId,
                      amount: nextAmt
                    });
                    setActiveTab('payments');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#006231] to-[#0A4D27] text-white hover:opacity-95 font-bold text-xs shadow-md shadow-[#006231]/20 flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>+ কিস্তি জমা এন্ট্রি</span>
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
