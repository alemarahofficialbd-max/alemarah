import React, { useState, useEffect, useRef } from 'react';
import { 
  Award,
  PieChart,
  GraduationCap,
  Briefcase,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
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
  Eye,
  Crown,
  Trash2,
  Edit3,
  Mail,
  KeyRound
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Check if current logged-in account has Super Admin privileges
  const isSuperAdmin = admin?.isSuperAdmin || 
    admin?.roleType === 'super_admin' || 
    admin?.email === 'alemarah.officialbd@gmail.com' ||
    admin?.phone === '01816233013' ||
    Boolean(admin?.role?.includes('সুপার অ্যাডমিন'));

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

  // 5. Team Member & Admin Form
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [showAccessKeys, setShowAccessKeys] = useState({});
  const [teamForm, setTeamForm] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'সাইট ইঞ্জিনিয়ার',
    accessKey: 'admin123',
    permissions: ['projects', 'expenses']
  });

  // 6. Board Director Form & Profile
  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);
  const [selectedDirectorForProfile, setSelectedDirectorForProfile] = useState(null);
  const [directorForm, setDirectorForm] = useState({
    name: '',
    role: 'পরিচালক',
    investment: '',
    sharePercentage: '',
    phone: '',
    email: '',
    nomineeName: '',
    nomineeRelation: '',
    nomineePhone: ''
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

  const handleOpenAddTeam = () => {
    setEditingTeamMember(null);
    setTeamForm({
      name: '',
      phone: '',
      email: '',
      role: 'সাইট ইঞ্জিনিয়ার',
      accessKey: 'admin123',
      permissions: ['projects', 'expenses']
    });
    setIsTeamModalOpen(true);
  };

  const handleOpenEditTeam = (mem) => {
    setEditingTeamMember(mem);
    setTeamForm({
      name: mem.name || '',
      phone: mem.phone || '',
      email: mem.email || '',
      role: mem.role || 'সাইট ইঞ্জিনিয়ার',
      accessKey: mem.accessKey || 'admin123',
      permissions: mem.permissions || ['projects', 'expenses']
    });
    setIsTeamModalOpen(true);
  };

  const handleSaveTeam = (e) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.phone) {
      alert('নাম এবং মোবাইল নম্বর পূরণ করুন।');
      return;
    }

    if (editingTeamMember) {
      updateStore((prev) => {
        const updatedTeam = prev.managementTeam.map((m) => {
          if (m.id === editingTeamMember.id) {
            return {
              ...m,
              name: teamForm.name,
              phone: teamForm.phone,
              email: teamForm.email,
              role: teamForm.role,
              accessKey: teamForm.accessKey || 'admin123',
              permissions: teamForm.permissions
            };
          }
          return m;
        });

        let updatedSuperAdmin = prev.superAdmin;
        if (editingTeamMember.isSuperAdmin && updatedSuperAdmin) {
          updatedSuperAdmin = {
            ...updatedSuperAdmin,
            name: teamForm.name,
            phone: teamForm.phone,
            email: teamForm.email || updatedSuperAdmin.email,
            accessKey: teamForm.accessKey || 'admin123'
          };
        }

        return {
          ...prev,
          managementTeam: updatedTeam,
          superAdmin: updatedSuperAdmin
        };
      });

      triggerAlert(`অ্যাডমিন/কর্মকর্তা ${teamForm.name}-এর তথ্য সফলভাবে আপডেট হয়েছে!`);
    } else {
      const newMember = {
        id: `MGT-0${data.managementTeam.length + 1}`,
        name: teamForm.name,
        phone: teamForm.phone,
        email: teamForm.email || '',
        role: teamForm.role,
        accessKey: teamForm.accessKey || 'admin123',
        isSuperAdmin: false,
        permissions: teamForm.permissions || ['projects', 'expenses'],
        status: 'সক্রিয় (Active)'
      };

      updateStore((prev) => ({
        ...prev,
        managementTeam: [...prev.managementTeam, newMember]
      }));

      triggerAlert(`নতুন কর্মকর্তা ${newMember.name} সফলভাবে যুক্ত হয়েছেন!`);
    }

    setIsTeamModalOpen(false);
    setEditingTeamMember(null);
  };

  const handleDeleteTeam = (id, name) => {
    if (window.confirm(`আপনি কি নিশ্চিতভাবে ${name}-কে অ্যাডমিন তালিকা থেকে অপসারণ করতে চান?`)) {
      updateStore((prev) => ({
        ...prev,
        managementTeam: prev.managementTeam.filter(m => m.id !== id)
      }));
      triggerAlert(`${name}-কে সফলভাবে অপসারণ করা হয়েছে।`);
    }
  };

  const handleAddDirector = (e) => {
    e.preventDefault();
    if (!directorForm.name || !directorForm.investment || !directorForm.sharePercentage) {
      alert('দয়া করে পরিচালকের নাম, মোট বিনিয়োগ এবং শেয়ার শতাংশ পূরণ করুন।');
      return;
    }

    const currentDirectors = data.directors || [];
    const invAmt = Number(directorForm.investment) || 0;
    const sharePct = Number(directorForm.sharePercentage) || 0;
    const nextIndex = currentDirectors.length + 1;
    const autoFolioNo = `AEP-DIR-${String(nextIndex).padStart(3, '0')}`;

    const newDirector = {
      id: `DIR-${String(nextIndex).padStart(2, '0')}`,
      name: directorForm.name,
      role: directorForm.role || 'পরিচালক',
      folioNo: autoFolioNo,
      image: null,
      investment: invAmt,
      sharePercentage: sharePct,
      dividendEarned: 0,
      phone: directorForm.phone || '01918-646575',
      email: directorForm.email || 'director@alemarahproperties.com',
      joiningDate: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'সক্রিয় (Active)',
      nomineeName: directorForm.nomineeName || 'সংরক্ষিত',
      nomineeRelation: directorForm.nomineeRelation || 'উত্তরাধিকারী',
      nomineePhone: directorForm.nomineePhone || '',
      theme: 'blue'
    };

    updateStore((prev) => ({
      ...prev,
      directors: [...(prev.directors || []), newDirector]
    }));

    setIsDirectorModalOpen(false);
    setDirectorForm({
      name: '',
      role: 'পরিচালক',
      investment: '',
      sharePercentage: '',
      phone: '',
      email: '',
      nomineeName: '',
      nomineeRelation: '',
      nomineePhone: ''
    });
    triggerAlert(`পরিচালক ${newDirector.name} (${newDirector.sharePercentage}% শেয়ার, ফোলিও: ${autoFolioNo}) সফলভাবে যুক্ত হয়েছেন!`);
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

  // Director calculations
  const directorsList = data.directors || [];
  const totalDirectorInvestment = directorsList.reduce((acc, d) => acc + (d.investment || 0), 0);
  const totalDirectorShares = directorsList.reduce((acc, d) => acc + (d.sharePercentage || 0), 0);
  const totalDirectorDividends = directorsList.reduce((acc, d) => acc + (d.dividendEarned || 0), 0);

  // Management Footer Navbar items (6 icons including Directors)
  const managementNavItems = [
    { id: 'clients', label: '১. ক্লায়েন্ট তালিকা ও নতুন এন্ট্রি', shortLabel: 'ক্লায়েন্ট', icon: Users },
    { id: 'payments', label: '২. কিস্তি ও জমা এন্ট্রি', shortLabel: 'জমা এন্ট্রি', icon: DollarSign },
    { id: 'projects', label: '৩. প্রজেক্ট কন্ট্রোল ও স্টেজ', shortLabel: 'প্রজেক্ট', icon: Building2 },
    { id: 'expenses', label: '৪. প্রজেক্ট বাজেট ও খরচ', shortLabel: 'বাজেট ও খরচ', icon: Wallet },
    { id: 'team', label: '৫. অ্যাডমিন ও টিম রোল কন্ট্রোল', shortLabel: 'অ্যাডমিন/টিম', icon: ShieldCheck },
    { id: 'directors', label: '৬. বোর্ড অব ডিরেক্টরস ও শেয়ার', shortLabel: 'ডিরেক্টরস', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col md:flex-row font-sans animate-fadeIn">
      
      {/* ========================================================= */}
      {/* 1. WEB VIEW: COLLAPSIBLE LEFT SIDEBAR NAVIGATION          */}
      {/* ========================================================= */}
      <aside 
        className={`hidden md:flex flex-col bg-white border-r border-slate-200/80 h-screen sticky top-0 shrink-0 z-30 justify-between select-none transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20 p-3' : 'w-64 lg:w-72 p-5'
        }`}
      >
        {/* Top: Logo, Collapse Button & Manager Profile */}
        <div className="space-y-5">
          {/* Top Header Row with Logo & Collapse Toggle */}
          <div className={`flex items-center ${isSidebarCollapsed ? 'flex-col space-y-2 justify-center' : 'justify-between'}`}>
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-2 group cursor-pointer text-left overflow-hidden"
              title="ওয়েবসাইটে ফিরে যান"
            >
              {isSidebarCollapsed ? (
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#CE2028] to-[#991B1B] text-white flex items-center justify-center font-black text-base shadow-sm">
                  AE
                </div>
              ) : (
                <img 
                  src="/alemarah_logo_header.svg" 
                  alt="Al-Emarah Properties" 
                  className="h-9 w-auto object-contain"
                />
              )}
            </button>

            {/* Collapse/Expand Toggle Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer ${
                isSidebarCollapsed ? 'w-9 h-9 flex items-center justify-center bg-slate-50' : ''
              }`}
              title={isSidebarCollapsed ? "প্যানেল বড় করুন (Expand)" : "প্যানেল ছোট করুন (Collapse)"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-[#CE2028]" />
              ) : (
                <PanelLeftClose className="w-5 h-5 text-slate-500" />
              )}
            </button>
          </div>

          {/* Sidebar Navigation Menu */}
          <nav className="space-y-1.5 pt-2">
            {managementNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`w-full flex items-center rounded-2xl transition-all font-bold cursor-pointer relative group ${
                    isSidebarCollapsed 
                      ? 'justify-center p-3 text-sm' 
                      : 'justify-between px-3.5 py-3 text-xs'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-[#CE2028] to-[#991B1B] text-white shadow-md shadow-[#CE2028]/25 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                    {!isSidebarCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </div>
                  {isActive && !isSidebarCollapsed && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  )}
                  {/* Tooltip on Hover in Collapsed Mode */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Actions */}
        <div className={`pt-4 border-t border-slate-100 space-y-2 ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
          <a
            href="tel:01918646575"
            title="হটলাইন: ০১৯১৮-৬৪৬৫৭৫"
            className={`flex items-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors ${
              isSidebarCollapsed 
                ? 'w-11 h-11 justify-center' 
                : 'w-full space-x-2.5 px-3 py-2 text-2xs font-semibold'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-[#006231]" />
            {!isSidebarCollapsed && <span>হটলাইন: ০১৯১৮-৬৪৬৫৭৫</span>}
          </a>

          <button
            onClick={onNavigateHome}
            title="ওয়েবসাইটে ফিরে যান"
            className={`flex items-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer ${
              isSidebarCollapsed 
                ? 'w-11 h-11 justify-center' 
                : 'w-full space-x-2.5 px-3 py-2.5 text-xs'
            }`}
          >
            <Home className="w-4 h-4 text-[#CE2028]" />
            {!isSidebarCollapsed && <span>ওয়েবসাইটে ফিরে যান</span>}
          </button>

          <button
            onClick={onLogout}
            title="লগআউট"
            className={`flex items-center rounded-xl bg-red-50 hover:bg-[#CE2028] text-[#CE2028] hover:text-white font-bold transition-all cursor-pointer ${
              isSidebarCollapsed 
                ? 'w-11 h-11 justify-center' 
                : 'w-full space-x-2.5 px-3 py-2.5 text-xs'
            }`}
          >
            <LogOut className="w-4 h-4" />
            {!isSidebarCollapsed && <span>লগআউট</span>}
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
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs ring-2 shadow-xs ${
                  isSuperAdmin 
                    ? 'bg-gradient-to-tr from-amber-500 to-[#CE2028] text-white ring-amber-400/60' 
                    : 'bg-gradient-to-tr from-[#CE2028] to-[#991B1B] text-white ring-[#CE2028]/30'
                }`}>
                  {isSuperAdmin ? <Crown className="w-4 h-4 text-amber-200" /> : (admin?.name ? admin.name.slice(0, 2) : 'ম্যা')}
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
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm font-black text-slate-900 truncate">
                        {admin?.name || 'সুপার অ্যাডমিন'}
                      </span>
                      {isSuperAdmin && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                    </div>
                    <div className="text-xs text-[#006231] font-semibold mt-0.5">
                      {isSuperAdmin ? '👑 সুপার অ্যাডমিন (Master Admin)' : (admin?.role || 'ম্যানেজমেন্ট টিম')}
                    </div>
                    <div className="text-2xs text-slate-400 mt-0.5">
                      {admin?.email || admin?.phone || 'alemarah.officialbd@gmail.com'}
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
        {/* TAB 5: SUPER ADMIN & TEAM ROLE MANAGEMENT               */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'team' && (() => {
          const superAdminMember = data.managementTeam?.find(m => m.isSuperAdmin || m.email === 'alemarah.officialbd@gmail.com') || data.superAdmin || {
            name: 'প্রধান নির্বাহী ও সুপার অ্যাডমিন',
            email: 'alemarah.officialbd@gmail.com',
            phone: '01816233013',
            role: 'সুপার অ্যাডমিন (Super Admin)',
            accessKey: 'admin123',
            isSuperAdmin: true
          };

          const officerTeam = (data.managementTeam || []).filter(m => !(m.isSuperAdmin || m.email === 'alemarah.officialbd@gmail.com'));

          return (
            <div className="space-y-6 animate-fadeIn">
              {/* Top Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-[#006231]" />
                      <span>কেন্দ্রীয় অ্যাডমিন ও ইউজার রোল ম্যানেজমেন্ট</span>
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    সুপার অ্যাডমিন দ্বারা পরিচালিত — সকল কর্মকর্তা, দায়িত্ব, রোল ও অ্যাক্সেস পারমিশন কন্ট্রোল প্যানেল
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddTeam}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#991B1B] text-white font-bold text-xs shadow-md shadow-[#CE2028]/20 hover:opacity-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ নতুন কর্মকর্তা / অ্যাডমিন যুক্ত করুন</span>
                </button>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-red-50 border border-amber-200/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-extrabold uppercase text-amber-900 tracking-wider">রুট অ্যাডমিন একাউন্ট</span>
                    <Crown className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-sm font-black text-slate-900 mt-1 truncate">
                    {superAdminMember.email}
                  </div>
                  <div className="text-2xs text-[#006231] font-bold mt-0.5 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-[#006231]" />
                    <span>সুরক্ষিত কেন্দ্রীয় নিয়ন্ত্রণাধিকার</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-extrabold uppercase text-slate-500 tracking-wider">মোট কর্মকর্তা ও সাব-অ্যাডমিন</span>
                    <Users className="w-4 h-4 text-[#006231]" />
                  </div>
                  <div className="text-xl font-black text-slate-900 mt-1">
                    {officerTeam.length} জন
                  </div>
                  <div className="text-2xs text-slate-500 mt-0.5 font-medium">
                    সাইট, ইঞ্জিনিয়ারিং ও ফাইন্যান্স টিম
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-extrabold uppercase text-slate-500 tracking-wider">নিরাপত্তা ও অ্যাক্সেস পলিসি</span>
                    <KeyRound className="w-4 h-4 text-[#CE2028]" />
                  </div>
                  <div className="text-xl font-black text-[#006231] mt-1">
                    সক্রিয় ও সুরক্ষিত
                  </div>
                  <div className="text-2xs text-slate-500 mt-0.5 font-medium">
                    ভূমিকা ভিত্তিক রোল নির্ধারণ (RBAC)
                  </div>
                </div>
              </div>

              {/* Master Super Admin Spotlight Card */}
              <div className="bg-gradient-to-r from-slate-950 via-zinc-900 to-[#2A080A] rounded-3xl p-5 sm:p-6 text-white border-2 border-amber-500/40 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-start sm:items-center space-x-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#CE2028] text-white flex items-center justify-center font-black text-2xl shadow-lg ring-4 ring-amber-400/20 shrink-0">
                      <Crown className="w-8 h-8 text-amber-100" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-3xs border border-amber-400/30 uppercase tracking-wider flex items-center space-x-1">
                          <Crown className="w-3 h-3 text-amber-400" />
                          <span>প্রধান সুপার অ্যাডমিন (Master Account)</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-3xs font-bold border border-emerald-400/30">
                          সর্বময় পরিচালিত
                        </span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-black text-white">
                        {superAdminMember.name}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-0.5">
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-mono">{superAdminMember.email}</span>
                        </span>
                        <span className="text-slate-600">|</span>
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-mono font-bold text-white">{superAdminMember.phone}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Super Admin Access Key & Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                    <div className="bg-black/50 border border-white/15 px-3.5 py-2 rounded-xl text-xs flex items-center justify-between sm:justify-start space-x-2">
                      <span className="text-slate-400 font-medium text-3xs uppercase">অ্যাক্সেস কী:</span>
                      <span className="font-mono font-bold text-amber-300">
                        {showAccessKeys['super'] ? superAdminMember.accessKey : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAccessKeys(prev => ({ ...prev, super: !prev.super }))}
                        className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                        title={showAccessKeys['super'] ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenEditTeam(superAdminMember)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>পাসওয়ার্ড / তথ্য সম্পাদনা</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-white/10 text-2xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-amber-400 font-bold">অনুমোদিত নিয়ন্ত্রণ:</span>
                    <span>পরিচালক পরিষদ, প্রজেক্ট বাজেট, আয়-ব্যয়, ফ্ল্যাট বুকিং ও কর্মকর্তা রোল নির্ধারণ</span>
                  </div>
                  <span className="text-emerald-400 font-bold">✓ রুট প্রোটেকশন সক্রিয়</span>
                </div>
              </div>

              {/* Sub-Admins & Officers Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
                      <HardHat className="w-4 h-4 text-[#006231]" />
                      <span>কর্মকর্তা ও সাব-অ্যাডমিনদের তালিকা ({officerTeam.length})</span>
                    </h4>
                    <p className="text-2xs text-slate-500 mt-0.5">
                      সুপার অ্যাডমিনের অধীনে প্রতিটি কর্মকর্তার দায়িত্ব ও পারমিশন
                    </p>
                  </div>
                </div>

                {officerTeam.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 text-slate-500">
                    <HardHat className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">বর্তমানে কোনো অতিরিক্ত কর্মকর্তা যুক্ত নেই</p>
                    <p className="text-2xs text-slate-400 mt-0.5">নতুন কর্মকর্তা যুক্ত করতে উপরের বাটনে ক্লিক করুন</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {officerTeam.map((mem) => {
                      const isMemKeyVisible = Boolean(showAccessKeys[mem.id]);
                      return (
                        <div key={mem.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center space-x-3">
                                <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#CE2028] flex items-center justify-center font-black text-base border border-red-100">
                                  <HardHat className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-black text-slate-900 truncate">{mem.name}</h4>
                                  <span className="inline-block px-2 py-0.5 rounded-full text-3xs font-black bg-emerald-50 text-[#006231] border border-emerald-200 mt-0.5">
                                    {mem.role}
                                  </span>
                                </div>
                              </div>
                              <span className="font-mono text-3xs text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                                #{mem.id}
                              </span>
                            </div>

                            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                              <div className="flex items-center justify-between text-2xs">
                                <span className="text-slate-500 font-medium">মোবাইল:</span>
                                <strong className="text-slate-900 font-mono">{mem.phone}</strong>
                              </div>
                              {mem.email && (
                                <div className="flex items-center justify-between text-2xs">
                                  <span className="text-slate-500 font-medium">ইমেইল:</span>
                                  <span className="text-slate-700 font-mono truncate max-w-[170px]">{mem.email}</span>
                                </div>
                              )}
                              <div className="flex items-center justify-between text-2xs pt-1 border-t border-slate-200/60">
                                <span className="text-slate-500 font-medium">লগইন কী:</span>
                                <div className="flex items-center space-x-1.5">
                                  <span className="font-mono font-bold text-slate-800">
                                    {isMemKeyVisible ? mem.accessKey : '••••••••'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setShowAccessKeys(prev => ({ ...prev, [mem.id]: !prev[mem.id] }))}
                                    className="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                                  >
                                    <Eye className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Assigned Permissions Tags */}
                            <div className="space-y-1">
                              <div className="text-3xs font-bold uppercase tracking-wider text-slate-400">অনুমোদিত ক্ষমতা:</div>
                              <div className="flex flex-wrap gap-1">
                                {(mem.permissions || ['projects', 'expenses']).map((perm, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-3xs font-semibold">
                                    {perm === 'projects' ? 'প্রজেক্ট' : perm === 'expenses' ? 'খরচ ভাউচার' : perm === 'clients' ? 'ক্লায়েন্ট' : perm === 'payments' ? 'কিস্তি জমা' : perm === 'directors' ? 'পরিচালক' : perm}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-2 border-t border-slate-100 flex items-center space-x-1.5">
                            <a
                              href={`tel:${mem.phone}`}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="কল দিন"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#006231]" />
                            </a>

                            <button
                              type="button"
                              onClick={() => handleOpenEditTeam(mem)}
                              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-2xs font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                              <span>সম্পাদনা</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteTeam(mem.id, mem.name)}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-[#CE2028] transition-colors cursor-pointer"
                              title="অপসারণ করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ------------------------------------------------------- */}
        {/* TAB 6: BOARD OF DIRECTORS & SHAREHOLDERS                 */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'directors' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CE2028] animate-pulse"></span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    বোর্ড অব ডিরেক্টরস ও শেয়ারহোল্ডার ক্যাপিটাল
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  কোম্পানির সম্মানিত পরিচালকবৃন্দ, বিনিয়োগকৃত মূলধন, শেয়ার শতাংশ এবং ডিভিডেন্ড বিতরণ হিসাব
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsDirectorModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#006231] to-[#0A4D27] text-white font-bold text-xs shadow-md shadow-[#006231]/20 hover:opacity-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ নতুন ডিরেক্টর যুক্ত করুন</span>
                </button>
              </div>
            </div>

            {/* Top KPI Metrics for Directors */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-3xs sm:text-2xs font-bold uppercase tracking-wider">মোট পরিশোধিত মূলধন</span>
                  <DollarSign className="w-4 h-4 text-[#006231]" />
                </div>
                <div className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                  {formatBDT(totalDirectorInvestment)}
                </div>
                <div className="text-3xs text-emerald-600 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>১০০% পেইড-আপ ইকুইটি</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-3xs sm:text-2xs font-bold uppercase tracking-wider">মোট শেয়ার বণ্টন</span>
                  <PieChart className="w-4 h-4 text-[#CE2028]" />
                </div>
                <div className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                  {totalDirectorShares}% / ১০০%
                </div>
                <div className="text-3xs text-[#CE2028] font-bold flex items-center space-x-1">
                  <Award className="w-3 h-3" />
                  <span>{totalDirectorShares === 100 ? 'সম্পূর্ণ ১০০% বণ্টিত' : `${100 - totalDirectorShares}% অবশিষ্ট উন্মুক্ত`}</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-3xs sm:text-2xs font-bold uppercase tracking-wider">বোর্ড ডিরেক্টর সংখ্যা</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                  {directorsList.length} জন সম্মানিত সদস্য
                </div>
                <div className="text-3xs text-blue-600 font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>কার্যনির্বাহী কমিটি সক্রিয়</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-3xs sm:text-2xs font-bold uppercase tracking-wider">মোট বণ্টিত ডিভিডেন্ড</span>
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                  {formatBDT(totalDirectorDividends)}
                </div>
                <div className="text-3xs text-purple-600 font-bold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>নিয়মিত লভ্যাংশ পরিশোধিত</span>
                </div>
              </div>
            </div>

            {/* Equity Breakdown Progress Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <div className="flex items-center space-x-2">
                  <PieChart className="w-4 h-4 text-[#006231]" />
                  <span>শেয়ারহোল্ডিং ইকুইটি ডিস্ট্রিবিউশন বার (১০০%)</span>
                </div>
                <span className="text-3xs text-slate-500 font-bold">মোট প্রাতিষ্ঠানিক শেয়ার: ১০০%</span>
              </div>

              {/* Stacked Progress Bar */}
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                {directorsList.map((dir, idx) => {
                  const colors = [
                    'bg-[#CE2028]',
                    'bg-[#006231]',
                    'bg-blue-600',
                    'bg-amber-500',
                    'bg-purple-600',
                    'bg-cyan-600'
                  ];
                  const color = colors[idx % colors.length];
                  return (
                    <div
                      key={dir.id}
                      style={{ width: `${dir.sharePercentage}%` }}
                      className={`${color} hover:opacity-90 transition-all relative group cursor-pointer`}
                      title={`${dir.name}: ${dir.sharePercentage}%`}
                    />
                  );
                })}
              </div>

              {/* Legend with Investment & Share % */}
              <div className="flex flex-wrap gap-2.5 pt-1 text-2xs font-semibold">
                {directorsList.map((dir, idx) => {
                  const dotColors = [
                    'bg-[#CE2028]',
                    'bg-[#006231]',
                    'bg-blue-600',
                    'bg-amber-500',
                    'bg-purple-600',
                    'bg-cyan-600'
                  ];
                  return (
                    <div key={dir.id} className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                      <span className={`w-2.5 h-2.5 rounded-full ${dotColors[idx % dotColors.length]}`}></span>
                      <span className="text-slate-900 font-bold">{dir.name}</span>
                      <span className="text-[#CE2028] font-black">({dir.sharePercentage}% শেয়ার)</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-[#006231] font-black">বিনিয়োগ: {formatBDT(dir.investment)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Comprehensive Table: All Directors Investment & Share Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden mt-6">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
                    <FileSpreadsheet className="w-4 h-4 text-[#006231]" />
                    <span>পরিচালকগণের মোট বিনিয়োগ ও ১০০% শেয়ার বণ্টন তালিকা</span>
                  </h4>
                  <p className="text-2xs text-slate-500 mt-0.5">এক নজরে সকল ডিরেক্টরের বিনিয়োগকৃত টাকার অঙ্ক ও শেয়ার অনুপাত</p>
                </div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[#006231] font-black text-xs border border-emerald-200">
                  <span>সর্বমোট মূলধন:</span>
                  <span className="font-mono text-sm">{formatBDT(totalDirectorInvestment)}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-3xs">
                    <tr>
                      <th className="py-3 px-4">পরিচালকের নাম ও পদবি</th>
                      <th className="py-3 px-4">ফোলিও নং</th>
                      <th className="py-3 px-4">বিনিয়োগকৃত টাকা (Investment)</th>
                      <th className="py-3 px-4">শেয়ার অংশীদারিত্ব (% Share)</th>
                      <th className="py-3 px-4">মনোনীত নমিনি ও মোবাইল</th>
                      <th className="py-3 px-4 text-right">সনদ ও প্রোফাইল</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {directorsList.map((dir) => (
                      <tr key={dir.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                              {dir.image ? (
                                <img src={dir.image} alt={dir.name} className="w-full h-full object-cover object-top" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs bg-slate-100">
                                  {dir.name.slice(0, 1)}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{dir.name}</div>
                              <div className="text-3xs text-[#CE2028] font-bold">{dir.role}</div>
                              {dir.phone && (
                                <a href={`tel:${dir.phone}`} className="text-3xs text-slate-500 font-mono font-bold hover:text-[#006231] inline-block mt-0.5">
                                  {dir.phone}
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-3xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-bold border border-emerald-200">
                            {dir.folioNo}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-black text-sm text-[#006231] font-mono">{formatBDT(dir.investment)}</div>
                          <div className="text-3xs text-emerald-600 font-bold">পরিশোধিত বিনিয়োগ</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-red-50 text-[#CE2028] font-black text-xs border border-red-200 shadow-2xs">
                            <span>{dir.sharePercentage}%</span>
                            <span className="text-[10px] font-normal text-slate-500">(১০০% এর মধ্যে)</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{dir.nomineeName || 'সংরক্ষিত'} ({dir.nomineeRelation || 'উত্তরাধিকারী'})</div>
                          {dir.nomineePhone && (
                            <div className="text-3xs font-mono font-bold text-[#006231] mt-0.5">{dir.nomineePhone}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedDirectorForProfile(dir)}
                            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-2xs cursor-pointer shadow-2xs inline-flex items-center space-x-1.5 transition-all hover:scale-105 active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5 text-white/80" />
                            <span>সনদ ও প্রোফাইল</span>
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
      {/* MODAL: ADD DIRECTOR                                       */}
      {/* ========================================================= */}
      {isDirectorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#CE2028] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">নতুন বোর্ড ডিরেক্টর এন্ট্রি</h3>
                  <p className="text-3xs text-slate-500">বোর্ড অব ডিরেক্টরস তালিকায় নতুন শেয়ারহোল্ডার যুক্ত করুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsDirectorModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDirector} className="space-y-3.5">
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                  পরিচালকের পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="উদাঃ প্রকৌশলী তানভীর আহমেদ"
                  value={directorForm.name}
                  onChange={(e) => setDirectorForm({ ...directorForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                    বোর্ড পদবি / ভূমিকা *
                  </label>
                  <select
                    value={directorForm.role}
                    onChange={(e) => setDirectorForm({ ...directorForm, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                  >
                    <option value="পরিচালক">পরিচালক (Director)</option>
                    <option value="পরিচালক (প্রকৌশল ও কারিগরি)">পরিচালক (প্রকৌশল ও কারিগরি)</option>
                    <option value="পরিচালক (অর্থ ও নিরীক্ষা)">পরিচালক (অর্থ ও নিরীক্ষা)</option>
                    <option value="পরিচালক (আইন ও কমপ্লায়েন্স)">পরিচালক (আইন ও কমপ্লায়েন্স)</option>
                    <option value="পরিচালক (পরিকল্পনা ও উন্নয়ন)">পরিচালক (পরিকল্পনা ও উন্নয়ন)</option>
                    <option value="উপ-ব্যবস্থাপনা পরিচালক">উপ-ব্যবস্থাপনা পরিচালক (DMD)</option>
                    <option value="স্বতন্ত্র পরিচালক">স্বতন্ত্র পরিচালক (Independent Director)</option>
                  </select>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
                  <span className="text-3xs font-bold text-slate-400 uppercase">শেয়ার সার্টিফিকেট / ফোলিও নং</span>
                  <span className="font-mono text-xs font-bold text-[#006231] mt-0.5">
                    AEP-DIR-{String((data.directors || []).length + 1).padStart(3, '0')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                    বিনিয়োগকৃত টাকা (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="উদাঃ 5000000"
                    value={directorForm.investment}
                    onChange={(e) => setDirectorForm({ ...directorForm, investment: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                    শেয়ার শতাংশ (%) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.5"
                    placeholder="যেমন: 5, 10, 20"
                    value={directorForm.sharePercentage}
                    onChange={(e) => setDirectorForm({ ...directorForm, sharePercentage: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                    পরিচালকের মোবাইল নম্বর
                  </label>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={directorForm.phone}
                    onChange={(e) => setDirectorForm({ ...directorForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                    ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    placeholder="director@alemarahproperties.com"
                    value={directorForm.email}
                    onChange={(e) => setDirectorForm({ ...directorForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                  />
                </div>
              </div>

              {/* Nominee Details Section */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="text-2xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1">
                  <span>মনোনীত নমিনির তথ্য</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">
                      নমিনির নাম
                    </label>
                    <input
                      type="text"
                      placeholder="নমিনির নাম"
                      value={directorForm.nomineeName}
                      onChange={(e) => setDirectorForm({ ...directorForm, nomineeName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">
                      সম্পর্ক
                    </label>
                    <input
                      type="text"
                      placeholder="স্ত্রী / সন্তান / উত্তরসূরি"
                      value={directorForm.nomineeRelation}
                      onChange={(e) => setDirectorForm({ ...directorForm, nomineeRelation: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">
                      মোবাইল নম্বর *
                    </label>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={directorForm.nomineePhone}
                      onChange={(e) => setDirectorForm({ ...directorForm, nomineePhone: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDirectorModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#006231] to-[#0A4D27] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#006231]/25 hover:opacity-95 transition-all cursor-pointer text-center active:scale-95"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: FULL DIRECTOR PROFILE & SHARE CERTIFICATE DOSSIER  */}
      {/* ========================================================= */}
      {selectedDirectorForProfile && (() => {
        const d = selectedDirectorForProfile;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 relative divide-y divide-slate-100">
              
              {/* Header */}
              <div className="p-5 sm:p-6 flex items-start justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-3xl relative">
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-800 border-2 border-white/20 shadow-md">
                    {d.image ? (
                      <img src={d.image} alt={d.name} className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                        <Award className="w-8 h-8 text-[#8EBF40]" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base sm:text-lg font-black text-white truncate">{d.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#8EBF40] border border-emerald-400/30 text-3xs font-bold shrink-0">
                        {d.role}
                      </span>
                    </div>
                    <div className="text-3xs text-slate-300 font-mono">
                      ফোলিও নং: {d.folioNo} | আইডি: #{d.id}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDirectorForProfile(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 space-y-5">
                {/* Financial Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                    <div className="text-3xs font-bold text-emerald-800 uppercase">মোট পরিশোধিত মূলধন</div>
                    <div className="text-base font-black text-[#006231] mt-0.5">{formatBDT(d.investment)}</div>
                    <div className="text-3xs text-emerald-600 font-medium">১০০% পরিশোধিত</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-100">
                    <div className="text-3xs font-bold text-red-800 uppercase">শেয়ার অংশীদারিত্ব</div>
                    <div className="text-base font-black text-[#CE2028] mt-0.5">{d.sharePercentage}%</div>
                    <div className="text-3xs text-red-700 font-bold">মোট ১০০% এর মধ্যে</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 col-span-2 sm:col-span-1">
                    <div className="text-3xs font-bold text-purple-800 uppercase">অর্জিত মোট ডিভিডেন্ড</div>
                    <div className="text-base font-black text-purple-800 mt-0.5">{formatBDT(d.dividendEarned)}</div>
                    <div className="text-3xs text-purple-600 font-medium">পরিশোধিত হিসাব</div>
                  </div>
                </div>

                {/* Corporate Details */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">কোম্পানির মোট ইকুইটি শেয়ার:</span>
                    <span className="font-bold text-slate-800">১০০% এর মধ্যে {d.sharePercentage}% অংশীদারিত্ব</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">বোর্ড সদস্য হিসেবে অন্তর্ভুক্তি:</span>
                    <span className="font-bold text-slate-800">{d.joiningDate}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">আইনানুগ মনোনীত নমিনি:</span>
                    <span className="font-bold text-slate-800">{d.nomineeName || 'সংরক্ষিত'} ({d.nomineeRelation || 'উত্তরাধিকারী'})</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">নমিনির মোবাইল নম্বর:</span>
                    <span className="font-bold text-[#006231] font-mono">{d.nomineePhone || 'সংরক্ষিত নেই'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">অফিশিয়াল ইমেইল:</span>
                    <span className="font-bold text-slate-800">{d.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">যোগাযোগের মোবাইল:</span>
                    <span className="font-bold text-slate-800 font-mono">{d.phone}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-2.5 bg-slate-50 rounded-b-3xl">
                <a
                  href={`tel:${d.phone}`}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-[#006231]" />
                  <span>কল দিন</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedDirectorForProfile(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>

            </div>
          </div>
        );
      })()}

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
      {/* MODAL 3: ADD / EDIT TEAM MEMBER & PERMISSIONS             */}
      {/* ========================================================= */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                {editingTeamMember?.isSuperAdmin ? (
                  <Crown className="w-5 h-5 text-amber-500" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-[#006231]" />
                )}
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {editingTeamMember 
                    ? (editingTeamMember.isSuperAdmin ? 'সুপার অ্যাডমিন তথ্য ও পাসওয়ার্ড সম্পাদনা' : 'কর্মকর্তার তথ্য ও পারমিশন সম্পাদনা') 
                    : 'নতুন কর্মকর্তা / সাব-অ্যাডমিন যুক্ত করুন'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsTeamModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTeam} className="space-y-3.5">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    placeholder="officer@alemarah.com"
                    value={teamForm.email || ''}
                    onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                  />
                </div>
              </div>

              {!editingTeamMember?.isSuperAdmin && (
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    পদবী / নির্ধারিত রোল
                  </label>
                  <select
                    value={teamForm.role}
                    onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                  >
                    <option value="সাইট ইঞ্জিনিয়ার">সাইট ইঞ্জিনিয়ার</option>
                    <option value="প্রজেক্ট ডিরেক্টর / সাইট ইনচার্জ">প্রজেক্ট ডিরেক্টর / সাইট ইনচার্জ</option>
                    <option value="হেড অফ অ্যাকাউন্টস & ফাইন্যান্স">হেড অফ অ্যাকাউন্টস & ফাইন্যান্স</option>
                    <option value="সেলস অ্যান্ড মার্কেটিং ম্যানেজার">সেলস অ্যান্ড মার্কেটিং ম্যানেজার</option>
                    <option value="আইন ও কমপ্লায়েন্স অফিসার">আইন ও কমপ্লায়েন্স অফিসার</option>
                    <option value="সিনিয়র অ্যাডমিন">সিনিয়র অ্যাডমিন</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  লগইন অ্যাক্সেস কী / পাসওয়ার্ড *
                </label>
                <input
                  type="text"
                  value={teamForm.accessKey}
                  onChange={(e) => setTeamForm({ ...teamForm, accessKey: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                  required
                />
              </div>

              {!editingTeamMember?.isSuperAdmin && (
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    অনুমোদিত দায়িত্ব ও পারমিশনসমূহ:
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-2xs font-semibold text-slate-700">
                    {[
                      { id: 'projects', label: 'প্রজেক্ট কন্ট্রোল' },
                      { id: 'expenses', label: 'খরচ ও ব্যয় এন্ট্রি' },
                      { id: 'clients', label: 'ক্লায়েন্ট তালিকা' },
                      { id: 'payments', label: 'কিস্তি ও জমা এন্ট্রি' },
                      { id: 'directors', label: 'পরিচালক পরিষদ' }
                    ].map(p => {
                      const isChecked = (teamForm.permissions || []).includes(p.id);
                      return (
                        <label key={p.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const curr = teamForm.permissions || [];
                              const next = e.target.checked ? [...curr, p.id] : curr.filter(x => x !== p.id);
                              setTeamForm({ ...teamForm, permissions: next });
                            }}
                            className="w-3.5 h-3.5 text-[#006231] rounded"
                          />
                          <span>{p.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

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
                  {editingTeamMember ? 'আপডেট করুন' : 'যুক্ত করুন'}
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
