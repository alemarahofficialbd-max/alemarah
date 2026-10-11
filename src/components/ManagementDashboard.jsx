import React, { useState, useEffect, useRef } from 'react';
import { 
  Award,
  Settings,
  Globe,
  Lock,
  ShieldAlert,
  Camera,
  Upload,
  PieChart,
  GraduationCap,
  Briefcase,
  Copy,
  UserCheck,
  UserX,
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
  KeyRound,
  Printer,
  Download
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
  setLang,
  t, 
  onLogout, 
  onNavigateHome 
}) {
  const [data, setData] = useState(getManagementData);
  const [activeTab, setActiveTabState] = useState(() => {
    try {
      return localStorage.getItem('alemarah_management_tab') || 'clients';
    } catch {
      return 'clients';
    }
  });

  const setActiveTab = (tabId) => {
    setActiveTabState(tabId);
    try {
      localStorage.setItem('alemarah_management_tab', tabId);
    } catch {}
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [selectedClientForProfile, setSelectedClientForProfile] = useState(null);
  const [selectedHistoryTrxForModal, setSelectedHistoryTrxForModal] = useState(null);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [successAlert, setSuccessAlert] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Master Security PIN for high-privilege operations (default: 7788)
  const [masterPin, setMasterPin] = useState(() => {
    try {
      return localStorage.getItem('alemarah_master_pin') || '7788';
    } catch {
      return '7788';
    }
  });
  const [pinChangeForm, setPinChangeForm] = useState({ oldPin: '', newPin: '', confirmPin: '' });
  const [pinChangeMsg, setPinChangeMsg] = useState('');

  // Delete Confirmation Modal with PIN Verification
  const [deletePendingAction, setDeletePendingAction] = useState(null); // { title: '', desc: '', onConfirm: () => {} }
  const [inputtedPin, setInputtedPin] = useState('');
  const [pinError, setPinError] = useState('');

  const requestProtectedDelete = (title, desc, onConfirm) => {
    setDeletePendingAction({ title, desc, onConfirm });
    setInputtedPin('');
    setPinError('');
  };

  const handleVerifyAndExecuteDelete = (e) => {
    e.preventDefault();
    if (inputtedPin.trim() === masterPin.trim()) {
      if (deletePendingAction?.onConfirm) {
        deletePendingAction.onConfirm();
      }
      setDeletePendingAction(null);
      setInputtedPin('');
      setPinError('');
    } else {
      setPinError('ভুল মাস্টার পিন! মুছে ফেলার অনুমতি দেওয়া সম্ভব নয়।');
    }
  };

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
    image: '',
    emailPrefix: '',
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
  const [paymentSelectedProjectId, setPaymentSelectedProjectId] = useState('all');
  const [isPaymentClientPickerOpen, setIsPaymentClientPickerOpen] = useState(false);
  const [paymentClientSearchQuery, setPaymentClientSearchQuery] = useState('');
  const [isPaymentFormOpenMobile, setIsPaymentFormOpenMobile] = useState(false);
  const [showAllPayments, setShowAllPayments] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    clientId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'ব্যাংক ডিপোজিট',
    note: ''
  });

  // State for Money Receipt Preview & Print modal
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState(null);

  // 3. New Project Form (with Smart Unit & Floor Generator)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [expandedProjectUnits, setExpandedProjectUnits] = useState({});
  const [projectForm, setProjectForm] = useState({
    name: '',
    location: '',
    progress: 10,
    budget: '',
    projectType: 'residential', // 'residential' | 'share' | 'commercial'
    totalFloors: 10,
    unitsPerFloor: 2,
    customUnitsText: ''
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
  const [expandedOfficers, setExpandedOfficers] = useState({});

  const handleToggleOfficerStatus = (officerId) => {
    updateStore((prev) => ({
      ...prev,
      managementTeam: prev.managementTeam.map(m => {
        if (m.id === officerId) {
          const isAct = m.status?.includes('সক্রিয়');
          return {
            ...m,
            status: isAct ? (lang === 'bn' ? 'নিষ্ক্রিয়' : 'Deactive') : (lang === 'bn' ? 'সক্রিয়' : 'Active')
          };
        }
        return m;
      })
    }));
    triggerAlert('কর্মকর্তার স্ট্যাটাস সফলভাবে পরিবর্তন হয়েছে!');
  };

  const handleToggleClientStatus = (clientId) => {
    updateStore((prev) => {
      const updatedClients = prev.clients.map(c => {
        if (c.id === clientId) {
          const isDeact = c.status === 'deactive' || c.status === 'নিষ্ক্রিয়';
          return {
            ...c,
            status: isDeact ? 'active' : 'deactive'
          };
        }
        return c;
      });
      return {
        ...prev,
        clients: updatedClients
      };
    });
    // Also keep selectedClientForProfile updated
    setSelectedClientForProfile(prev => {
      if (!prev || prev.id !== clientId) return prev;
      const isDeact = prev.status === 'deactive' || prev.status === 'নিষ্ক্রিয়';
      return {
        ...prev,
        status: isDeact ? 'active' : 'deactive'
      };
    });
    triggerAlert('গ্রাহকের অ্যাকাউন্ট স্ট্যাটাস সফলভাবে পরিবর্তন করা হয়েছে!');
  };
  const [teamForm, setTeamForm] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'সাইট ইঞ্জিনিয়ার',
    accessKey: 'admin123',
    permissions: ['projects', 'expenses']
  });

  // 6. Board Director Form, Profile, Certificate, Capital Deposit, and Dividend Modals
  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);
  const [expandedDirectors, setExpandedDirectors] = useState({});
  const [selectedDirectorForProfile, setSelectedDirectorForProfile] = useState(null);
  const [selectedDirectorForCertificate, setSelectedDirectorForCertificate] = useState(null);
  
  // Capital Installment Deposit modal state
  const [isCapitalDepositModalOpen, setIsCapitalDepositModalOpen] = useState(false);
  const [capitalDepositTargetDirector, setCapitalDepositTargetDirector] = useState(null);
  const [capitalDepositForm, setCapitalDepositForm] = useState({
    amount: '',
    date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
    method: 'ব্যাংক চেক',
    receiptNo: `RCPT-CAP-${Math.floor(100 + Math.random() * 900)}`,
    note: 'মূলধনের কিস্তি জমা'
  });

  // Dividend Payout modal state
  const [isDividendModalOpen, setIsDividendModalOpen] = useState(false);
  const [dividendTargetDirector, setDividendTargetDirector] = useState(null);
  const [dividendForm, setDividendForm] = useState({
    amount: '',
    date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
    method: 'ব্যাংক অ্যাকাউন্ট ট্রান্সফার',
    voucherNo: `VCH-DIV-${Math.floor(100 + Math.random() * 900)}`,
    note: 'নিয়মিত শেয়ার লভ্যাংশ বণ্টন'
  });

  const [directorProfileActiveTab, setDirectorProfileActiveTab] = useState('installments'); // 'installments' | 'dividends' | 'info'

  const [directorForm, setDirectorForm] = useState({
    name: '',
    image: null,
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

    const generatedEmail = clientForm.emailPrefix 
      ? `${clientForm.emailPrefix.trim()}@alemarah.com`
      : `${clientForm.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'client'}${Math.floor(100 + Math.random() * 900)}@alemarah.com`;

    const newClient = {
      id: newId,
      name: clientForm.name,
      image: clientForm.image || '',
      email: generatedEmail,
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
      image: '',
      emailPrefix: '',
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

    const currentDue = (targetClient.totalPrice || 0) - (targetClient.totalPaid || 0);
    if (payAmount > currentDue) {
      alert(`সতর্কবার্তা: জমার পরিমাণ বর্তমান মোট বকেয়া (${formatBDT(currentDue)})-এর চেয়ে বেশি হতে পারবে না! আপনি লিখছেন: ${formatBDT(payAmount)}`);
      return;
    }

    const newTrx = {
      id: `TRX-${Math.floor(100 + Math.random() * 900)}`,
      date: paymentForm.date ? new Date(paymentForm.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
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
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
    setIsPaymentFormOpenMobile(false);
    triggerAlert(`৳ ${payAmount.toLocaleString('bn-BD')} টাকা জমা এন্ট্রি সফল হয়েছে!`);
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!projectForm.name || !projectForm.budget) {
      alert('প্রজেক্টের নাম ও আনুমানিক বাজেট পূরণ করুন।');
      return;
    }

    // Auto-generate units based on project type
    let generatedUnits = [];
    if (projectForm.projectType === 'residential') {
      const floorsCount = Math.max(1, Number(projectForm.totalFloors) || 10);
      const unitsPerFloorCount = Math.max(1, Number(projectForm.unitsPerFloor) || 2);
      const unitLetters = lang === 'bn' ? ['ইউনিট-এ', 'ইউনিট-বি', 'ইউনিট-সি', 'ইউনিট-ডি', 'ইউনিট-ই', 'ইউনিট-এফ'] : ['Unit-A', 'Unit-B', 'Unit-C', 'Unit-D', 'Unit-E', 'Unit-F'];
      const bnFloorNames = ['', '১ম তলা', '২য় তলা', '৩য় তলা', '৪র্থ তলা', '৫ম তলা', '৬ষ্ঠ তলা', '৭ম তলা', '৮ম তলা', '৯ম তলা', '১০ম তলা', '১১তম তলা', '১২তম তলা', '১৩তম তলা', '১৪তম তলা', '১৫তম তলা'];

      for (let fl = 2; fl <= floorsCount; fl++) {
        const floorName = bnFloorNames[fl] || `${fl}তম তলা`;
        for (let u = 0; u < unitsPerFloorCount; u++) {
          const letter = unitLetters[u] || `ইউনিট ${u + 1}`;
          generatedUnits.push(`${floorName}, ফ্ল্যাট ${fl}-${letter}`);
        }
      }
    } else if (projectForm.projectType === 'share') {
      const shareCount = Math.max(1, Number(projectForm.totalFloors) || 50);
      for (let s = 1; s <= shareCount; s++) {
        generatedUnits.push(`পার্টনারশিপ ইনভেস্টমেন্ট শেয়ার স্লট #${String(s).padStart(2, '0')}`);
      }
    } else if (projectForm.customUnitsText) {
      generatedUnits = projectForm.customUnitsText.split('\n').map(u => u.trim()).filter(Boolean);
    } else {
      generatedUnits = [
        'গ্রাউন্ড ফ্লোর, বাণিজ্যিক স্পেস ০১',
        '১ম তলা, ইউনিট ১০১',
        '১ম তলা, ইউনিট ১০২',
        '২য় তলা, ইউনিট ২০১'
      ];
    }

    const newProj = {
      id: `proj-${Date.now().toString().slice(-4)}`,
      name: projectForm.name,
      location: projectForm.location || 'ঢাকা',
      progress: Number(projectForm.progress) || 10,
      budget: Number(projectForm.budget) || 0,
      type: projectForm.projectType || 'residential',
      totalFloors: Number(projectForm.totalFloors) || 10,
      unitsPerFloor: Number(projectForm.unitsPerFloor) || 2,
      units: generatedUnits,
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
      budget: '',
      projectType: 'residential',
      totalFloors: 10,
      unitsPerFloor: 2,
      customUnitsText: ''
    });
    triggerAlert(`নতুন প্রজেক্ট "${newProj.name}" (${generatedUnits.length}টি ইউনিট সহ) সফলভাবে যুক্ত হয়েছে!`);
  };

  const handleDeleteProject = (projId, projName) => {
    requestProtectedDelete(
      `প্রজেক্ট "${projName}" মুছে ফেলা`,
      `আপনি কি নিশ্চিতভাবে "${projName}" প্রজেক্টটি এবং এর সকল ডাটা মুছে ফেলতে চান? এটি নিশ্চিত করতে মাস্টার পিন দিন।`,
      () => {
        updateStore((prev) => ({
          ...prev,
          projects: prev.projects.filter(p => p.id !== projId)
        }));
        triggerAlert(`প্রজেক্ট "${projName}" সফলভাবে মুছে ফেলা হয়েছে!`);
      }
    );
  };

  const handleUpdateProjectProgress = (projId, newProgress) => {
    updateStore((prev) => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id === projId) {
          return {
            ...p,
            progress: Number(newProgress)
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
        status: lang === 'bn' ? 'সক্রিয়' : 'Active'
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
    requestProtectedDelete(
      `অ্যাডমিন/কর্মকর্তা "${name}" অপসারণ`,
      `আপনি কি নিশ্চিতভাবে "${name}"-কে অপসারণ করতে চান? অনুমতি দিতে মাস্টার পিন লিখুন।`,
      () => {
        updateStore((prev) => ({
          ...prev,
          managementTeam: prev.managementTeam.filter(m => m.id !== id)
        }));
        triggerAlert(`${name}-কে সফলভাবে অপসারণ করা হয়েছে।`);
      }
    );
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
    const autoFolioNo = `DIR-${String(nextIndex).padStart(3, '0')}`;

    const newDirector = {
      id: `DIR-${String(nextIndex).padStart(2, '0')}`,
      name: directorForm.name,
      role: directorForm.role || 'পরিচালক',
      folioNo: autoFolioNo,
      image: directorForm.image || null,
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
      theme: 'blue',
      installments: invAmt > 0 ? [
        {
          id: `INS-${nextIndex}-01`,
          date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
          amount: invAmt,
          method: 'প্রাথমিক ইকুইটি জমা',
          receiptNo: `RCPT-CAP-${String(nextIndex).padStart(3, '0')}-01`,
          note: 'প্রারম্ভিক শেয়ার মূলধন জমা'
        }
      ] : [],
      dividendHistory: []
    };

    updateStore((prev) => ({
      ...prev,
      directors: [...(prev.directors || []), newDirector]
    }));

    setIsDirectorModalOpen(false);
    setDirectorForm({
      name: '',
      image: null,
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

  // Handler: Add Capital Installment for a Director
  const handleAddCapitalInstallment = (e) => {
    e.preventDefault();
    if (!capitalDepositTargetDirector) return;
    const amountNum = Number(capitalDepositForm.amount);
    if (!amountNum || amountNum <= 0) {
      alert('অনুগ্রহ করে জমার সঠিক টাকার পরিমাণ লিখুন।');
      return;
    }

    const newInst = {
      id: `INS-${Date.now().toString().slice(-5)}`,
      date: capitalDepositForm.date || new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      amount: amountNum,
      method: capitalDepositForm.method,
      receiptNo: capitalDepositForm.receiptNo || `RCPT-${Math.floor(100 + Math.random() * 900)}`,
      note: capitalDepositForm.note || 'মূলধনের কিস্তি জমা'
    };

    updateStore((prev) => {
      const updatedDirs = (prev.directors || []).map((dir) => {
        if (dir.id === capitalDepositTargetDirector.id) {
          const currentInsts = dir.installments || [];
          const updatedInsts = [newInst, ...currentInsts];
          const newTotalInvestment = (dir.investment || 0) + amountNum;
          return {
            ...dir,
            investment: newTotalInvestment,
            installments: updatedInsts
          };
        }
        return dir;
      });
      return { ...prev, directors: updatedDirs };
    });

    // Also update selected director if in profile modal
    if (selectedDirectorForProfile?.id === capitalDepositTargetDirector.id) {
      setSelectedDirectorForProfile((prev) => ({
        ...prev,
        investment: (prev.investment || 0) + amountNum,
        installments: [newInst, ...(prev.installments || [])]
      }));
    }

    setIsCapitalDepositModalOpen(false);
    setCapitalDepositTargetDirector(null);
    setCapitalDepositForm({
      amount: '',
      date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      method: 'ব্যাংক চেক',
      receiptNo: `RCPT-CAP-${Math.floor(100 + Math.random() * 900)}`,
      note: 'মূলধনের কিস্তি জমা'
    });
    triggerAlert(`পরিচালক ${capitalDepositTargetDirector.name}-এর ${formatBDT(amountNum)} মূলধন কিস্তি সফলভাবে জমা হয়েছে!`);
  };

  // Handler: Disburse Dividend to a Director
  const handleAddDividendPayout = (e) => {
    e.preventDefault();
    if (!dividendTargetDirector) return;
    const amountNum = Number(dividendForm.amount);
    if (!amountNum || amountNum <= 0) {
      alert('অনুগ্রহ করে ডিভিডেন্ডের সঠিক টাকার পরিমাণ লিখুন।');
      return;
    }

    const newDiv = {
      id: `DIV-${Date.now().toString().slice(-5)}`,
      date: dividendForm.date ? new Date(dividendForm.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      amount: amountNum,
      method: dividendForm.method,
      voucherNo: dividendForm.voucherNo || `VCH-${Math.floor(100 + Math.random() * 900)}`,
      note: dividendForm.note || 'নিয়মিত শেয়ার লভ্যাংশ বণ্টন'
    };

    updateStore((prev) => {
      const updatedDirs = (prev.directors || []).map((dir) => {
        if (dir.id === dividendTargetDirector.id) {
          const currentDivs = dir.dividendHistory || [];
          const updatedDivs = [newDiv, ...currentDivs];
          const newTotalDividends = (dir.dividendEarned || 0) + amountNum;
          return {
            ...dir,
            dividendEarned: newTotalDividends,
            dividendHistory: updatedDivs
          };
        }
        return dir;
      });
      return { ...prev, directors: updatedDirs };
    });

    // Also update selected director if in profile modal
    if (selectedDirectorForProfile?.id === dividendTargetDirector.id) {
      setSelectedDirectorForProfile((prev) => ({
        ...prev,
        dividendEarned: (prev.dividendEarned || 0) + amountNum,
        dividendHistory: [newDiv, ...(prev.dividendHistory || [])]
      }));
    }

    setIsDividendModalOpen(false);
    setDividendTargetDirector(null);
    setDividendForm({
      amount: '',
      date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      method: 'ব্যাংক অ্যাকাউন্ট ট্রান্সফার',
      voucherNo: `VCH-DIV-${Math.floor(100 + Math.random() * 900)}`,
      note: 'নিয়মিত শেয়ার লভ্যাংশ বণ্টন'
    });
    triggerAlert(`পরিচালক ${dividendTargetDirector.name}-কে ${formatBDT(amountNum)} ডিভিডেন্ড সফলভাবে প্রদান করা হয়েছে!`);
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

  // Management Footer Navbar items with Role-Based Permission Control
  const allNavItems = [
    { id: 'clients', label: '১. ক্লায়েন্ট তালিকা ও নতুন এন্ট্রি', shortLabel: 'ক্লায়েন্ট', icon: Users },
    { id: 'payments', label: '২. পেমেন্ট ও জমা এন্ট্রি', shortLabel: 'জমা এন্ট্রি', icon: DollarSign },
    { id: 'projects', label: '৩. প্রজেক্ট কন্ট্রোল', shortLabel: 'প্রজেক্ট', icon: Building2 },
    { id: 'expenses', label: '৪. প্রজেক্ট বাজেট ও খরচ', shortLabel: 'বাজেট ও খরচ', icon: Wallet },
    { id: 'team', label: '৫. অ্যাডমিন ও টিম রোল কন্ট্রোল', shortLabel: 'অ্যাডমিন/টিম', icon: ShieldCheck },
    { id: 'directors', label: '৬. বোর্ড অব ডিরেক্টরস ও শেয়ার', shortLabel: 'ডিরেক্টরস', icon: Award },
    { id: 'settings', label: '৭. সেটিংস, ভাষা ও সিকিউরিটি পিন', shortLabel: 'সেটিংস', icon: Settings }
  ];

  const managementNavItems = allNavItems.filter(item => {
    if (isSuperAdmin) return true; // Super admin has 100% full master access
    if (item.id === 'settings') return true;
    const perms = admin?.permissions || [];
    return perms.includes(item.id) || perms.includes('all');
  });

  // Centralized Tab Navigation: automatically dismisses all open modals/profile views
  const navigateToTab = (tabId) => {
    setSelectedClientForProfile(null);
    setSelectedReceiptForPrint(null);
    setSelectedDirectorForProfile(null);
    setSelectedDirectorForCertificate(null);
    setIsClientModalOpen(false);
    setIsProjectModalOpen(false);
    setIsTeamModalOpen(false);
    setIsDirectorModalOpen(false);
    setIsCapitalDepositModalOpen(false);
    setIsDividendModalOpen(false);
    setEditingTeamMember(null);
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col md:flex-row font-bengali tracking-normal antialiased animate-fadeIn">
      
      {/* ========================================================= */}
      {/* 1. WEB VIEW: COLLAPSIBLE LEFT SIDEBAR NAVIGATION          */}
      {/* ========================================================= */}
      <aside 
        className={`hidden md:flex flex-col bg-white border-r border-slate-200/80 h-screen sticky top-0 shrink-0 z-50 justify-between select-none transition-all duration-300 ease-in-out ${
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
                <img 
                  src="/alemarah_favicon.svg" 
                  alt="Al-Emarah" 
                  className="w-9 h-9 object-contain transition-transform group-hover:scale-110"
                />
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
              title={isSidebarCollapsed ? (lang === 'bn' ? 'প্যানেল বড় করুন' : 'Expand Sidebar') : (lang === 'bn' ? 'প্যানেল ছোট করুন' : 'Collapse Sidebar')}
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
                  onClick={() => navigateToTab(item.id)}
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
        <div className={`pt-4 border-t border-slate-100 ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
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

              {/* Fullscreen Mobile Drawer for Super Admin Profile & System Menu */}
              {isProfileOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center animate-fadeIn">
                  {/* Backdrop Click */}
                  <div 
                    className="absolute inset-0"
                    onClick={() => setIsProfileOpen(false)}
                  />

                  {/* Bottom Sheet on Mobile / Centered Card on larger */}
                  <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200 overflow-hidden animate-slideUp max-h-[90vh] flex flex-col">
                    {/* Top Drag Indicator & Header */}
                    <div className="p-5 pb-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
                      <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden"></div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3.5 min-w-0">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ring-2 shadow-sm shrink-0 ${
                            isSuperAdmin 
                              ? 'bg-gradient-to-tr from-amber-500 to-[#CE2028] text-white ring-amber-400/50' 
                              : 'bg-gradient-to-tr from-[#CE2028] to-[#991B1B] text-white ring-[#CE2028]/30'
                          }`}>
                            {isSuperAdmin ? <Crown className="w-6 h-6 text-amber-100" /> : (admin?.name ? admin.name.slice(0, 2) : 'ম্যা')}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <h3 className="text-base font-black text-slate-900 truncate">
                                {admin?.name || 'সুপার অ্যাডমিন'}
                              </h3>
                              {isSuperAdmin && <Crown className="w-4 h-4 text-amber-500 shrink-0" />}
                            </div>
                            <p className="text-xs text-[#006231] font-bold">
                              {isSuperAdmin ? (lang === 'bn' ? 'সুপার অ্যাডমিন' : 'Master Admin') : (admin?.role || (lang === 'bn' ? 'ম্যানেজমেন্ট টিম' : 'Management Team'))}
                            </p>
                            <p className="text-3xs text-slate-400 truncate">
                              {admin?.email || admin?.phone || 'alemarah.officialbd@gmail.com'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsProfileOpen(false)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
                          title="বন্ধ করুন"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Menu Options List */}
                    <div className="p-4 space-y-2 overflow-y-auto">
                      <div className="text-3xs font-extrabold uppercase tracking-wider text-slate-400 px-3">
                        কুইক অ্যাকশন ও ম্যানেজমেন্ট মেনু
                      </div>

                      {/* Settings Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigateToTab('settings');
                        }}
                        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/60 transition-all text-left cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-[#006231] text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Settings className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 group-hover:text-[#006231]">
                              সিস্টেম সেটিংস ও সিকিউরিটি পিন
                            </div>
                            <div className="text-3xs text-slate-500 font-medium">
                              ভাষা পরিবর্তন ও ডিলিট মাস্টার পিন কনফিগারেশন
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                      </button>

                      {/* All Dashboard Navigation Tabs for Fast Mobile Access */}
                      <div className="pt-2">
                        <div className="text-3xs font-extrabold uppercase tracking-wider text-slate-400 px-3 pb-1.5">
                          সকল বিভাগ ও অপশন
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {managementNavItems.map(item => {
                            const ItemIcon = item.icon;
                            const isCur = activeTab === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setIsProfileOpen(false);
                                  navigateToTab(item.id);
                                }}
                                className={`p-3 rounded-2xl flex items-center space-x-2.5 text-xs font-bold transition-all text-left cursor-pointer ${
                                  isCur 
                                    ? 'bg-[#CE2028] text-white shadow-md shadow-[#CE2028]/25' 
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                                }`}
                              >
                                <ItemIcon className={`w-4 h-4 shrink-0 ${isCur ? 'text-white' : 'text-slate-500'}`} />
                                <span className="truncate">{item.shortLabel || item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Website & Hotline */}
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            onNavigateHome();
                          }}
                          className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors text-left cursor-pointer"
                        >
                          <Home className="w-4 h-4 text-[#CE2028]" />
                          <span>মূল ওয়েবসাইটে ফিরে যান</span>
                        </button>

                        <a
                          href="tel:01918646575"
                          className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors text-left"
                        >
                          <Phone className="w-4 h-4 text-[#006231]" />
                          <span>সাইট হটলাইনে কল করুন (01918-646575)</span>
                        </a>
                      </div>
                    </div>

                    {/* Bottom Logout Button */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-red-50 hover:bg-[#CE2028] text-[#CE2028] hover:text-white transition-all text-xs font-bold cursor-pointer active:scale-95"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>সিস্টেম থেকে লগআউট করুন</span>
                      </button>
                    </div>
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
      {/* 2. STATS OVERVIEW CARDS (FULL WIDTH WORKSPACE)            */}
      {/* ========================================================= */}
      {(activeTab === 'clients' || activeTab === 'payments') && (
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-3xs sm:text-2xs font-medium tracking-wide">
              <span>মোট ক্লায়েন্ট</span>
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
            </div>
            <div className="text-base sm:text-2xl font-bold text-slate-800 truncate">
              {totalClientsCount} জন
            </div>
            <div className="text-3xs text-slate-400 truncate">নিবন্ধিত ফ্ল্যাট ক্রেতা</div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/20 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#006231] text-3xs sm:text-2xs font-medium tracking-wide">
              <span className="truncate">সংগৃহীত টাকা</span>
              <DollarSign className="w-4 h-4 text-[#006231] shrink-0" />
            </div>
            <div className="text-base sm:text-2xl font-bold text-[#006231] truncate">
              {formatBDT(totalCollections)}
            </div>
            <div className="text-3xs text-[#006231] font-medium truncate">মোট পরিশোধিত জমা</div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-200/80 bg-gradient-to-b from-white to-amber-50/20 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-amber-800 text-3xs sm:text-2xs font-medium tracking-wide">
              <span className="truncate">মোট বাকি / বকেয়া</span>
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            </div>
            <div className="text-base sm:text-2xl font-bold text-amber-700 truncate">
              {formatBDT(totalDues)}
            </div>
            <div className="text-3xs text-amber-700 font-medium truncate">পরিশোধযোগ্য বকেয়া ব্যালেন্স</div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-3xs sm:text-2xs font-medium tracking-wide">
              <span className="truncate">প্রজেক্টে মোট ব্যয়</span>
              <HardHat className="w-4 h-4 text-[#CE2028] shrink-0" />
            </div>
            <div className="text-base sm:text-2xl font-bold text-[#CE2028] truncate">
              {formatBDT(totalConstructionSpent)}
            </div>
            <div className="text-3xs text-slate-400 truncate">{data.projects.length}টি প্রকল্পে মোট ব্যয়</div>
          </div>
        </div>
      </div>
      )}

      {/* ========================================================= */}
      {/* 3. MAIN WORKSPACE (SWITCHED VIA FOOTER NAVBAR)            */}
      {/* ========================================================= */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-5 flex-1">
        
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

            {/* Mobile-First Clients Cards View: Clean & Compact List (Only Name, Small Project Name & Due Amount) */}
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
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs overflow-hidden">
                        {cl.image ? (
                          <img src={cl.image} alt={cl.name} className="w-full h-full object-cover" />
                        ) : (
                          cl.name ? cl.name.slice(0, 2) : 'গ্রা'
                        )}
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        {/* 1st Line: Full Name */}
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#006231] transition-colors leading-snug truncate">
                          {cl.name}
                        </h4>

                        {/* 2nd Line: Small Project Name & Small Due Amount */}
                        <div className="flex items-center space-x-2 text-2xs text-slate-500 font-medium truncate">
                          <span className="truncate">{cl.projectName}</span>
                          <span className="text-slate-300 shrink-0">•</span>
                          <span className="text-amber-700 font-semibold shrink-0">
                            বকেয়া: {formatBDT(due)}
                          </span>
                        </div>
                      </div>
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
                      <th className="py-3.5 px-6">পরবর্তী পেমেন্ট তারিখ</th>
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
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs overflow-hidden">
                                {cl.image ? (
                                  <img src={cl.image} alt={cl.name} className="w-full h-full object-cover" />
                                ) : (
                                  cl.name ? cl.name.slice(0, 2) : 'গ্রা'
                                )}
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
            <div className="lg:col-span-5 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-[#006231]" />
                    <span>পেমেন্ট বা টাকা জমার নতুন এন্ট্রি</span>
                  </h3>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    কাস্টমার থেকে টাকা জমা পেলে এখানে এন্ট্রি দিন।
                  </p>
                </div>

                {/* On mobile: button to toggle form open/close */}
                <button
                  type="button"
                  onClick={() => setIsPaymentFormOpenMobile(!isPaymentFormOpenMobile)}
                  className="sm:hidden px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#006231] font-bold text-xs flex items-center space-x-1 border border-emerald-200 transition-colors shrink-0 cursor-pointer"
                >
                  {isPaymentFormOpenMobile ? (
                    <>
                      <span>সংক্ষেপ করুন</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>পেমেন্ট নিন</span>
                    </>
                  )}
                </button>
              </div>

              {/* On Mobile when collapsed: prominent 'পেমেন্ট নিন' button */}
              {!isPaymentFormOpenMobile && (
                <div className="sm:hidden pt-1">
                  <button
                    type="button"
                    onClick={() => setIsPaymentFormOpenMobile(true)}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#006231] to-[#0A4D27] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>পেমেন্ট নিন (টাকা জমা এন্ট্রি)</span>
                  </button>
                </div>
              )}

              {/* Form body: always visible on desktop (sm:block), toggleable on mobile */}
              <div className={`${isPaymentFormOpenMobile ? 'block' : 'hidden sm:block'}`}>
                <form onSubmit={handleReceivePayment} className="space-y-4">
                  {/* Step 1: Filter By Project */}
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      ১. প্রজেক্ট নির্বাচন করুন (ফিল্টার)
                    </label>
                    <select
                      value={paymentSelectedProjectId}
                      onChange={(e) => {
                        const newProjId = e.target.value;
                        setPaymentSelectedProjectId(newProjId);
                        const available = newProjId === 'all' 
                          ? data.clients 
                          : data.clients.filter(c => c.projectId === newProjId);
                        if (!available.some(c => c.id === paymentForm.clientId)) {
                          setPaymentForm(prev => ({ ...prev, clientId: '' }));
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028]"
                    >
                      <option value="all">সকল প্রজেক্টের কাস্টমার ({data.clients.length} জন)</option>
                      {data.projects.map(p => {
                        const pClientsCount = data.clients.filter(c => c.projectId === p.id).length;
                        return (
                          <option key={p.id} value={p.id}>
                            {p.name} ({pClientsCount} জন কাস্টমার)
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Step 2: Visual Customer Selector With Half-Screen Bottom Sheet Picker */}
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      ২. কাস্টমার নির্বাচন করুন *
                    </label>

                    {/* Selected Customer Active Card */}
                    {targetClientForCalc ? (
                      <div 
                        onClick={() => setIsPaymentClientPickerOpen(true)}
                        className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/30 border-2 border-[#006231]/30 hover:border-[#006231] cursor-pointer transition-all shadow-xs flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden ring-2 ring-emerald-500/30 shadow-xs">
                            {targetClientForCalc.image ? (
                              <img src={targetClientForCalc.image} alt={targetClientForCalc.name} className="w-full h-full object-cover" />
                            ) : (
                              targetClientForCalc.name ? targetClientForCalc.name.slice(0, 2) : 'গ্রা'
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-sm truncate flex items-center space-x-1.5">
                              <span>{targetClientForCalc.name}</span>
                              <span className="font-mono text-3xs px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-normal">
                                {targetClientForCalc.id}
                              </span>
                            </div>
                            <div className="text-2xs text-[#006231] font-semibold truncate">
                              {targetClientForCalc.projectName} • {targetClientForCalc.flatNo}
                            </div>
                            <div className="text-3xs text-slate-500 font-medium">
                              মোবাইল: <strong className="text-slate-700 font-mono">{targetClientForCalc.phone}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-3xs text-slate-400 block uppercase font-bold">বর্তমান বকেয়া</span>
                          <span className="text-xs sm:text-sm font-black text-amber-700">
                            {formatBDT(targetClientDue)}
                          </span>
                          <div className="text-3xs text-[#006231] font-bold group-hover:underline">
                            পরিবর্তন করুন ▼
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsPaymentClientPickerOpen(true)}
                        className="w-full p-3.5 rounded-2xl bg-white border-2 border-dashed border-slate-300 hover:border-[#006231] text-slate-700 hover:text-[#006231] font-bold text-xs sm:text-sm transition-all flex items-center justify-between shadow-2xs group cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-50 text-slate-500 group-hover:text-[#006231] flex items-center justify-center transition-colors">
                            <Users className="w-4 h-4" />
                          </div>
                          <span>কাস্টমার নির্বাচন করুন</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#006231] transition-transform" />
                      </button>
                    )}

                    {/* Half-Screen Bottom Sheet Customer Selector Modal */}
                    {isPaymentClientPickerOpen && (() => {
                      const filteredList = data.clients.filter(c => {
                        const matchesProject = paymentSelectedProjectId === 'all' || c.projectId === paymentSelectedProjectId;
                        if (!matchesProject) return false;
                        if (!paymentClientSearchQuery.trim()) return true;
                        const q = paymentClientSearchQuery.toLowerCase().trim();
                        const name = (c.name || '').toLowerCase();
                        const phone = (c.phone || '').toLowerCase();
                        const id = (c.id || '').toLowerCase();
                        const project = (c.projectName || '').toLowerCase();
                        const flat = (c.flatNo || '').toLowerCase();
                        return name.includes(q) || phone.includes(q) || id.includes(q) || project.includes(q) || flat.includes(q);
                      });

                      return (
                        <div className="fixed inset-0 z-[70] bg-slate-950/70 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center animate-fadeIn select-none">
                          {/* Dismiss backdrop */}
                          <div 
                            className="absolute inset-0"
                            onClick={() => {
                              setIsPaymentClientPickerOpen(false);
                              setPaymentClientSearchQuery('');
                            }}
                          />

                          {/* Bottom Sheet Drawer on Mobile / Centered Sheet on larger */}
                          <div 
                            className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-[2.2rem] sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] sm:max-h-[85vh] animate-slideUp"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Top Drag Indicator (mobile only) */}
                            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1 sm:hidden"></div>

                            {/* Header */}
                            <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-100">
                              <div className="flex items-center space-x-2.5">
                                <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#006231] flex items-center justify-center shrink-0">
                                  <Users className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                                    কাস্টমার নির্বাচন করুন...
                                  </h3>
                                  <p className="text-3xs text-slate-500 font-medium">
                                    মোট {filteredList.length} জন কাস্টমার উপলব্ধ
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setIsPaymentClientPickerOpen(false);
                                  setPaymentClientSearchQuery('');
                                }}
                                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="বন্ধ করুন"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Search Input */}
                            <div className="px-5 pt-3 pb-2">
                              <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                  type="text"
                                  value={paymentClientSearchQuery}
                                  onChange={(e) => setPaymentClientSearchQuery(e.target.value)}
                                  placeholder="নাম বা প্রতিষ্ঠান লিখে খুঁজুন..."
                                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                                  autoFocus
                                />
                                {paymentClientSearchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => setPaymentClientSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Horizontal Project Filter Chips */}
                            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar px-5 pb-2.5 text-2xs">
                              <button
                                type="button"
                                onClick={() => setPaymentSelectedProjectId('all')}
                                className={`px-3 py-1 rounded-full whitespace-nowrap font-bold transition-all cursor-pointer ${
                                  paymentSelectedProjectId === 'all'
                                    ? 'bg-[#006231] text-white shadow-2xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                সকল প্রজেক্ট ({data.clients.length})
                              </button>
                              {data.projects.map(p => {
                                const pCount = data.clients.filter(c => c.projectId === p.id).length;
                                return (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setPaymentSelectedProjectId(p.id)}
                                    className={`px-3 py-1 rounded-full whitespace-nowrap font-bold transition-all cursor-pointer ${
                                      paymentSelectedProjectId === p.id
                                        ? 'bg-[#006231] text-white shadow-2xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {p.name} ({pCount})
                                  </button>
                                );
                              })}
                            </div>

                            {/* Customer List Items with ample bottom clearance */}
                            <div className="flex-1 overflow-y-auto px-4 py-2 pb-24 sm:pb-6 space-y-1 divide-y divide-slate-100">
                              {filteredList.length === 0 ? (
                                <div className="py-12 text-center text-slate-400 space-y-1">
                                  <Users className="w-8 h-8 mx-auto text-slate-300" />
                                  <p className="text-xs font-semibold text-slate-600">কোনো কাস্টমার পাওয়া যায়নি</p>
                                  <p className="text-3xs text-slate-400">ভিন্ন নাম বা প্রজেক্ট দিয়ে অনুসন্ধান করুন</p>
                                </div>
                              ) : (
                                filteredList.map(c => {
                                  const cDue = (c.totalPrice || 0) - (c.totalPaid || 0);
                                  const isCurrent = c.id === paymentForm.clientId;

                                  return (
                                    <div
                                      key={c.id}
                                      onClick={() => {
                                        setPaymentForm({ ...paymentForm, clientId: c.id });
                                        setIsPaymentClientPickerOpen(false);
                                        setPaymentClientSearchQuery('');
                                      }}
                                      className={`p-2.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] ${
                                        isCurrent
                                          ? 'bg-emerald-50/80 border border-emerald-300 ring-1 ring-emerald-400/50 shadow-2xs'
                                          : 'hover:bg-slate-50 border border-transparent'
                                      }`}
                                    >
                                      <div className="flex items-center space-x-3 min-w-0">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-2xs ring-2 ring-emerald-500/20">
                                          {c.image ? (
                                            <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                                          ) : (
                                            c.name ? c.name.slice(0, 2) : 'গ্রা'
                                          )}
                                        </div>
                                        <div className="min-w-0">
                                          <div className="text-sm font-bold text-slate-900 truncate flex items-center space-x-1.5">
                                            <span>{c.name}</span>
                                            <span className="text-3xs font-mono font-medium text-slate-400">({c.id})</span>
                                          </div>
                                          <div className="flex items-center space-x-1.5 mt-0.5 flex-wrap">
                                            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-[#006231] border border-emerald-200/60 truncate max-w-[130px]">
                                              {c.projectName}
                                            </span>
                                            <span className="text-2xs text-slate-500 font-medium truncate">
                                              ফ্ল্যাট: {c.flatNo}
                                            </span>
                                            {c.phone && (
                                              <span className="text-3xs font-mono text-slate-400 hidden sm:inline">
                                                • {c.phone}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center space-x-2 shrink-0">
                                        <div className="text-right">
                                          <div className="text-xs sm:text-sm font-black text-amber-700 font-mono">
                                            {formatBDT(cDue)}
                                          </div>
                                          <span className="text-[10px] text-slate-400 font-medium">বকেয়া</span>
                                        </div>
                                        {isCurrent && (
                                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center ml-1 shrink-0 shadow-2xs">
                                            <Check className="w-3.5 h-3.5" />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    জমার টাকার পরিমাণ *
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 600000"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028]"
                    required
                  />
                  {paymentForm.amount && (
                    Number(paymentForm.amount) > targetClientDue ? (
                      <div className="mt-1.5 p-2 rounded-xl bg-red-50 border border-red-200 text-xs text-[#CE2028] font-bold flex items-center space-x-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>সতর্কতা: বর্তমান বকেয়া {formatBDT(targetClientDue)}-এর চেয়ে বেশি টাকা দেওয়া হচ্ছে!</span>
                      </div>
                    ) : (
                      <div className="mt-1 text-2xs text-[#006231] font-semibold">
                        জমা প্রদানের পর অবশিষ্ট বকেয়া থাকবে: {formatBDT(Math.max(0, targetClientDue - Number(paymentForm.amount)))}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      জমার তারিখ
                    </label>
                    <input
                      type="date"
                      value={paymentForm.date}
                      onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#CE2028] cursor-pointer"
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
                      <option value="বিকাশ">বিকাশ</option>
                      <option value="নগদ">নগদ</option>
                      <option value="রকেট">রকেট</option>
                      <option value="ব্যাংক চেক">ব্যাংক চেক</option>
                      <option value="পে-অর্ডার">পে-অর্ডার</option>
                      <option value="নগদ ক্যাশ">নগদ ক্যাশ</option>
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
            </div>

            {/* Recent Collections Feed (Clean Seamless List on Mobile, Box Card on Desktop) */}
            <div className="lg:col-span-7 bg-transparent sm:bg-white p-0 sm:p-6 rounded-none sm:rounded-3xl border-0 sm:border sm:border-slate-200/80 sm:shadow-xs space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 sm:pb-3 border-b border-slate-200/70 sm:border-slate-100">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006231]" />
                    <span>সাম্প্রতিক সংগৃহীত পেমেন্টের তালিকা</span>
                  </h3>
                  <p className="text-3xs sm:text-2xs text-slate-500 mt-0.5">
                    সকল কাস্টমার থেকে সরাসরি সংগৃহীত জমার তালিকা
                  </p>
                </div>
                <div className="hidden sm:flex items-center space-x-2 self-start sm:self-auto">
                  <span className="text-3xs sm:text-xs font-bold text-[#006231] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70">
                    সর্বমোট সংগৃহীত: {formatBDT(totalCollections)}
                  </span>
                </div>
              </div>

              {(() => {
                const allTrxList = data.clients.flatMap(c => 
                  (c.paymentHistory || []).map(p => ({ 
                    ...p, 
                    clientName: c.name, 
                    clientImage: c.image, 
                    projectName: c.projectName, 
                    clientId: c.id 
                  }))
                ).sort((a, b) => (b.id > a.id ? 1 : -1));

                if (allTrxList.length === 0) {
                  return (
                    <div className="p-8 text-center text-xs text-slate-400 bg-white sm:bg-slate-50 rounded-2xl border border-slate-200/60">
                      এখনো কোনো পেমেন্ট রেকর্ড নেই।
                    </div>
                  );
                }

                // Show top 5 recent payments initially on mobile, with show-more option
                const visibleTrxList = showAllPayments ? allTrxList : allTrxList.slice(0, 5);

                return (
                  <div className="space-y-2">
                    <div className="divide-y divide-slate-100 sm:divide-y-0 sm:space-y-2.5 sm:max-h-[500px] sm:overflow-y-auto sm:pr-1">
                      {visibleTrxList.map((trx, idx) => (
                        <div 
                          key={idx} 
                          className="py-3 px-2 sm:p-3.5 bg-white sm:bg-slate-50/90 rounded-2xl sm:border sm:border-slate-100 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors shadow-2xs sm:shadow-none"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden ring-1 ring-emerald-500/20 shadow-2xs">
                              {trx.clientImage ? (
                                <img src={trx.clientImage} alt={trx.clientName} className="w-full h-full object-cover" />
                              ) : (
                                trx.clientName ? trx.clientName.slice(0, 2) : 'গ্রা'
                              )}
                            </div>
                            <div className="min-w-0 space-y-0.5">
                              <div className="font-bold text-slate-900 truncate flex items-center space-x-1.5">
                                <span className="truncate">{trx.clientName}</span>
                                <span className="text-3xs text-slate-400 font-normal shrink-0">({trx.projectName})</span>
                              </div>
                              <div className="text-3xs text-slate-500 truncate flex items-center space-x-1.5">
                                <span className="font-medium text-slate-600">{trx.date}</span>
                                <span>•</span>
                                <span className="text-slate-600">{trx.method}</span>
                                <span className="hidden sm:inline text-slate-400 font-mono">({trx.id})</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right flex items-center space-x-2.5 shrink-0 pl-2">
                            <div>
                              <div className="font-black text-xs sm:text-sm text-[#006231]">
                                +{formatBDT(trx.amount)}
                              </div>
                              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-[#006231] font-bold inline-block">
                                অনুমোদিত
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const cl = data.clients.find(c => c.id === trx.clientId);
                                setSelectedReceiptForPrint({
                                  trx,
                                  client: cl || { name: trx.clientName, phone: '', projectName: trx.projectName, flatNo: '' }
                                });
                              }}
                              title="মানি রিসিট দেখুন ও প্রিন্ট করুন"
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            >
                              <Printer className="w-4 h-4 text-[#006231]" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View All / Collapse Button for Mobile and Long Lists */}
                    {allTrxList.length > 5 && (
                      <button
                        type="button"
                        onClick={() => setShowAllPayments(!showAllPayments)}
                        className="w-full py-2.5 px-4 rounded-xl bg-white sm:bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-[#006231] transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
                      >
                        <span>
                          {showAllPayments 
                            ? 'সংক্ষিপ্ত তালিকা দেখুন (প্রথম ৫টি)' 
                            : `সম্পূর্ণ তালিকা দেখুন (সর্বমোট ${allTrxList.length}টি পেমেন্ট)`}
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showAllPayments ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                );
              })()}
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
                <h3 className="text-base font-bold text-slate-900">সকল প্রজেক্টসমূহ ও বিস্তারিত তথ্য</h3>
                <p className="text-xs text-slate-500">প্রজেক্টের ফ্ল্যাট ও ইউনিট তালিকা, বরাদ্দ ও আর্থিক বিবরণী</p>
              </div>
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#991B1B] text-white font-bold text-xs shadow-md shadow-[#CE2028]/20 hover:opacity-95 transition-all flex items-center justify-center space-x-1 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন প্রজেক্ট যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.projects.map((proj) => {
                const projClients = data.clients.filter(c => c.projectId === proj.id);
                const totalUnitsCount = (proj.units || []).length;
                const bookedUnitsCount = projClients.length;
                const availableUnitsCount = Math.max(0, totalUnitsCount - bookedUnitsCount);
                const projExpenses = (proj.expenses || []).reduce((acc, e) => acc + (e.amount || 0), 0);
                const isUnitsExpanded = expandedProjectUnits[proj.id];

                const typeLabels = {
                  residential: 'আবাসিক ফ্ল্যাট',
                  share: 'বিনিয়োগ শেয়ার',
                  commercial: 'বাণিজ্যিক স্পেস',
                  commercial_share: 'বাণিজ্যিক শেয়ার'
                };

                return (
                  <div key={proj.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded-full bg-red-50 text-[#CE2028] text-3xs font-black border border-red-200/60 shrink-0">
                              {typeLabels[proj.type] || 'আবাসিক'}
                            </span>
                            <span className="font-mono text-3xs text-slate-400 font-bold truncate">
                              ID: {proj.id}
                            </span>
                          </div>
                          <h4 className="text-lg font-black text-slate-900 truncate">{proj.name}</h4>
                          <p className="text-xs text-slate-500 flex items-center space-x-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#CE2028] shrink-0" />
                            <span className="truncate">{proj.location || 'ঢাকা'}</span>
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.id, proj.name)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                          title="প্রজেক্ট মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Specs Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                          <div className="text-3xs text-slate-400 font-bold uppercase tracking-wider">মোট বাজেট</div>
                          <div className="font-black text-slate-900 text-sm truncate">{formatBDT(proj.budget)}</div>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                          <div className="text-3xs text-slate-400 font-bold uppercase tracking-wider">মোট খরচ</div>
                          <div className="font-black text-rose-700 text-sm truncate">{formatBDT(projExpenses)}</div>
                        </div>

                        <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-0.5">
                          <div className="text-3xs text-emerald-800 font-bold uppercase tracking-wider">মোট ফ্ল্যাট / ইউনিট</div>
                          <div className="font-black text-[#006231] text-sm">
                            {totalUnitsCount} টি {proj.totalFloors ? `(${proj.totalFloors} তলা)` : ''}
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                          <div className="text-3xs text-slate-400 font-bold uppercase tracking-wider">বুকিং স্ট্যাটাস</div>
                          <div className="font-black text-slate-900 text-sm flex items-center justify-between">
                            <span>{bookedUnitsCount} বুকড</span>
                            <span className="text-3xs text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded-md">
                              {availableUnitsCount} খালি
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Units Inventory Collapsible List */}
                      {totalUnitsCount > 0 && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => setExpandedProjectUnits(prev => ({ ...prev, [proj.id]: !prev[proj.id] }))}
                            className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700 flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <span className="flex items-center space-x-1.5">
                              <Building2 className="w-3.5 h-3.5 text-[#CE2028]" />
                              <span>ইউনিট তালিকা দেখুন ({totalUnitsCount}টি)</span>
                            </span>
                            {isUnitsExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </button>

                          {isUnitsExpanded && (
                            <div className="mt-2 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 max-h-52 overflow-y-auto space-y-1.5 animate-fadeIn text-xs">
                              {proj.units.map((unitName, uIdx) => {
                                const matchedClient = projClients.find(c => c.flatNo === unitName);
                                return (
                                  <div key={uIdx} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                                    <span className="font-medium text-slate-800 text-2xs truncate">{unitName}</span>
                                    {matchedClient ? (
                                      <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#CE2028] border border-red-200 shrink-0">
                                        বুকড ({matchedClient.name.slice(0, 10)})
                                      </span>
                                    ) : (
                                      <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#006231] border border-emerald-200 shrink-0">
                                        খালি
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-2xs font-semibold text-slate-500">
                      <span>{proj.unitsPerFloor ? `প্রতি তলায় ${proj.unitsPerFloor}টি ফ্ল্যাট` : 'কাস্টম ইউনিট স্পেস'}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setClientForm(prev => ({ ...prev, projectId: proj.id }));
                          setIsClientModalOpen(true);
                        }}
                        className="text-[#006231] hover:text-[#0A4D27] font-bold flex items-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>ক্রেতা যুক্ত করুন</span>
                      </button>
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
                    খরচের পরিমাণ *
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
            role: lang === 'bn' ? 'সুপার অ্যাডমিন' : 'Super Admin',
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
                  <div className="space-y-3">
                    {officerTeam.map((mem) => {
                      const isExpanded = Boolean(expandedOfficers[mem.id]);
                      const isMemKeyVisible = Boolean(showAccessKeys[mem.id]);
                      const isActive = !mem.status?.includes('নিষ্ক্রিয়');

                      return (
                        <div 
                          key={mem.id} 
                          className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200"
                        >
                          {/* List Row Header - Clickable to Slide Down */}
                          <div 
                            onClick={() => setExpandedOfficers(prev => ({ ...prev, [mem.id]: !prev[mem.id] }))}
                            className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 select-none transition-colors"
                          >
                            <div className="flex items-center space-x-3.5 min-w-0">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                                isActive ? 'bg-red-50 text-[#CE2028] border border-red-100' : 'bg-slate-100 text-slate-400 border border-slate-200'
                              }`}>
                                <HardHat className="w-5 h-5" />
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-bold text-slate-900 text-sm truncate">{mem.name}</h4>
                                  <span className={`text-3xs font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${
                                    isActive 
                                      ? 'bg-emerald-50 text-[#006231] border-emerald-200' 
                                      : 'bg-red-50 text-red-700 border-red-200'
                                  }`}>
                                    {isActive ? '● সক্রিয়' : '○ নিষ্ক্রিয়'}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 text-2xs text-slate-500 mt-0.5 truncate">
                                  <span className="font-semibold text-slate-700">{mem.role}</span>
                                  <span>•</span>
                                  <span className="font-mono">{mem.phone}</span>
                                  <span>•</span>
                                  <span className="font-mono text-3xs text-slate-400">#{mem.id}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              <span className="hidden sm:inline-block text-3xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                                {isExpanded ? 'অপশন বন্ধ করুন' : 'বিস্তারিত ও অপশন'}
                              </span>
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </div>
                            </div>
                          </div>

                          {/* Slide-Down Expanded Details & Action Options */}
                          {isExpanded && (
                            <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-200/70 space-y-4 animate-fadeIn">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                {/* 1. Contact & Email */}
                                <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
                                  <span className="text-3xs font-bold uppercase text-slate-400 block">যোগাযোগ তথ্য</span>
                                  <div className="font-mono font-bold text-slate-800 text-2xs">{mem.phone}</div>
                                  <div className="font-mono text-3xs text-slate-500 truncate">{mem.email || 'ইমেইল নেই'}</div>
                                </div>

                                {/* 2. Password / Key with Copy Button */}
                                <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-3xs font-bold uppercase text-slate-400 block">লগইন পাসওয়ার্ড</span>
                                    <button
                                      type="button"
                                      onClick={() => setShowAccessKeys(prev => ({ ...prev, [mem.id]: !prev[mem.id] }))}
                                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                                      title={isMemKeyVisible ? 'লুকান' : 'দেখুন'}
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <div className="flex items-center justify-between gap-1 pt-0.5">
                                    <code className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded">
                                      {isMemKeyVisible ? mem.accessKey : '••••••••'}
                                    </code>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard?.writeText(mem.accessKey || 'admin123');
                                        triggerAlert('পাসওয়ার্ড কপি হয়েছে!');
                                      }}
                                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-3xs inline-flex items-center space-x-1 cursor-pointer transition-colors"
                                      title="পাসওয়ার্ড কপি করুন"
                                    >
                                      <Copy className="w-3 h-3" />
                                      <span>কপি</span>
                                    </button>
                                  </div>
                                </div>

                                {/* 3. Permissions Badges */}
                                <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
                                  <span className="text-3xs font-bold uppercase text-slate-400 block">অনুমোদিত পারমিশনসমূহ</span>
                                  <div className="flex flex-wrap gap-1 pt-0.5">
                                    {(mem.permissions || ['projects', 'expenses']).map((perm, idx) => (
                                      <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#006231] border border-emerald-100 text-3xs font-bold">
                                        {perm === 'projects' ? 'প্রজেক্ট' : perm === 'expenses' ? 'ব্যয়' : perm === 'clients' ? 'ক্লায়েন্ট' : perm === 'payments' ? 'কিস্তি' : perm === 'directors' ? 'পরিচালক' : perm}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Interactive Actions Bar */}
                              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-200/60">
                                <div className="flex items-center space-x-2">
                                  {/* Active / Deactive Toggle Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleOfficerStatus(mem.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center space-x-1.5 ${
                                      isActive 
                                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200' 
                                        : 'bg-emerald-50 hover:bg-emerald-100 text-[#006231] border-emerald-200'
                                    }`}
                                  >
                                    {isActive ? <UserX className="w-3.5 h-3.5 text-amber-700" /> : <UserCheck className="w-3.5 h-3.5 text-[#006231]" />}
                                    <span>{isActive ? (lang === 'bn' ? 'অ্যাকাউন্ট নিষ্ক্রিয় করুন' : 'Deactivate Account') : (lang === 'bn' ? 'অ্যাকাউন্ট সক্রিয় করুন' : 'Activate Account')}</span>
                                  </button>

                                  <a
                                    href={`tel:${mem.phone}`}
                                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 inline-flex items-center space-x-1"
                                  >
                                    <Phone className="w-3.5 h-3.5 text-[#006231]" />
                                    <span>কল দিন</span>
                                  </a>
                                </div>

                                <div className="flex items-center space-x-2">
                                  {/* Edit Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditTeam(mem)}
                                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer inline-flex items-center space-x-1 shadow-2xs"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>সম্পাদনা ও পারমিশন</span>
                                  </button>

                                  {/* Protected Delete Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTeam(mem.id, mem.name)}
                                    className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#CE2028] text-xs font-bold border border-red-200 cursor-pointer inline-flex items-center space-x-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>অপসারণ</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
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

            {/* Top KPI Metrics for Directors (Clean without cluttered badges) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-3xs sm:text-2xs font-medium tracking-wide">মোট পরিশোধিত মূলধন</span>
                  <DollarSign className="w-4 h-4 text-[#006231]" />
                </div>
                <div className="text-base sm:text-2xl font-black text-[#006231] tracking-tight">
                  {formatBDT(totalDirectorInvestment)}
                </div>
                <div className="text-3xs text-slate-400 font-medium">কোম্পানির মোট সংগৃহীত মূলধন</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-3xs sm:text-2xs font-medium tracking-wide">মোট শেয়ার বণ্টন</span>
                  <PieChart className="w-4 h-4 text-[#CE2028]" />
                </div>
                <div className="text-base sm:text-2xl font-black text-[#CE2028] tracking-tight">
                  {totalDirectorShares}%
                </div>
                <div className="text-3xs text-slate-400 font-medium">১০০% ইকুইটি মূলধনের মধ্যে</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-3xs sm:text-2xs font-medium tracking-wide">বোর্ড ডিরেক্টর সংখ্যা</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-base sm:text-2xl font-black text-slate-800 tracking-tight">
                  {directorsList.length} জন
                </div>
                <div className="text-3xs text-slate-400 font-medium">নিবন্ধিত অংশীদার পরিচালক</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-3xs sm:text-2xs font-medium tracking-wide">মোট বণ্টিত ডিভিডেন্ড</span>
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-base sm:text-2xl font-black text-purple-900 tracking-tight">
                  {formatBDT(totalDirectorDividends)}
                </div>
                <div className="text-3xs text-slate-400 font-medium">অর্জিত লভ্যাংশ বণ্টন</div>
              </div>
            </div>


            {/* Director Management: Mobile Expandable Cards + Desktop Full Table */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden mt-6">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
                    <FileSpreadsheet className="w-4 h-4 text-[#006231]" />
                    <span>পরিচালকগণের মোট বিনিয়োগ ও ১০০% শেয়ার বণ্টন তালিকা</span>
                  </h4>
                  <p className="text-2xs text-slate-500 mt-0.5">এক নজরে সকল ডিরেক্টরের বিনিয়োগকৃত টাকার অঙ্ক ও শেয়ার অনুপাত</p>
                </div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[#006231] font-black text-xs border border-emerald-200 self-start sm:self-auto">
                  <span>সর্বমোট মূলধন:</span>
                  <span className="font-mono text-sm">{formatBDT(totalDirectorInvestment)}</span>
                </div>
              </div>

              {/* 1. MOBILE-ONLY VIEW: Expandable Accordion List */}
              <div className="md:hidden divide-y divide-slate-100">
                {directorsList.map((dir) => {
                  const isExp = Boolean(expandedDirectors[dir.id]);

                  return (
                    <div key={dir.id} className="transition-colors">
                      {/* Compact Clean Header Row - Click to Toggle Expand */}
                      <div 
                        onClick={() => setExpandedDirectors(prev => ({ ...prev, [dir.id]: !prev[dir.id] }))}
                        className="py-3 px-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 active:bg-slate-100 select-none"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
                            {dir.image ? (
                              <img src={dir.image} alt={dir.name} className="w-full h-full object-cover object-top" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-xs bg-slate-100">
                                {dir.name.slice(0, 1)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 text-sm truncate leading-snug">{dir.name}</div>
                            <div className="text-xs text-[#CE2028] font-semibold truncate mt-0.5">{dir.role}</div>
                          </div>
                        </div>

                        {/* Right: Share % and Expand Arrow */}
                        <div className="shrink-0 flex items-center space-x-2">
                          <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-[#006231] font-bold border border-emerald-200 shadow-2xs">
                            {dir.sharePercentage}%
                          </span>
                          <div className={`p-1 rounded-lg bg-slate-100 text-slate-500 transition-transform duration-200 ${isExp ? 'rotate-180 text-[#006231] bg-emerald-50' : ''}`}>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Expandable Slide-Down Details on Mobile */}
                      {isExp && (
                        <div className="px-3.5 pb-3.5 pt-1 bg-slate-50/70 border-t border-slate-100 space-y-2.5 animate-fadeIn">
                          {/* Investment & Folio Row */}
                          <div className="grid grid-cols-2 gap-2 text-2xs pt-1">
                            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                              <span className="text-3xs text-slate-400 block font-bold uppercase">বিনিয়োগকৃত মূলধন</span>
                              <strong className="text-[#006231] font-mono font-bold text-xs mt-0.5 block">
                                {formatBDT(dir.investment)}
                              </strong>
                              <span className="text-3xs text-slate-500">{dir.sharePercentage}% মোট ইকুইটি শেয়ার</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                              <span className="text-3xs text-slate-400 block font-bold uppercase">শেয়ার ফোলিও ও সনদ</span>
                              <strong className="text-slate-900 font-mono font-bold text-xs mt-0.5 block">
                                {dir.folioNo}
                              </strong>
                              <span className="text-3xs text-slate-500">{dir.shareUnits?.toLocaleString('bn-BD') || '১,০০০'} টি ইউনিট</span>
                            </div>
                          </div>
                          {/* Financial & Nominee Quick Info Grid */}
                          <div className="grid grid-cols-2 gap-2 text-2xs">
                            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                              <span className="text-3xs text-slate-400 block font-bold uppercase">মোট গৃহীত লভ্যাংশ</span>
                              <strong className="text-purple-900 font-mono font-bold text-xs mt-0.5 block">
                                {formatBDT(dir.dividendEarned || 0)}
                              </strong>
                              <span className="text-3xs text-purple-600">{(dir.dividendHistory || []).length}টি কিস্তিতে প্রাপ্ত</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                              <span className="text-3xs text-slate-400 block font-bold uppercase">মনোনীত নমিনি</span>
                              <strong className="text-slate-800 truncate block mt-0.5">
                                {dir.nomineeName || 'সংরক্ষিত'}
                              </strong>
                              <span className="text-3xs text-slate-500">{dir.nomineeRelation || 'উত্তরাধিকারী'} • {dir.nomineePhone || ''}</span>
                            </div>
                          </div>

                          {/* Quick Mobile Action Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setCapitalDepositTargetDirector(dir);
                                setCapitalDepositForm({
                                  amount: '',
                                  date: new Date().toISOString().split('T')[0],
                                  method: 'ব্যাংক চেক',
                                  receiptNo: `RCPT-CAP-${Math.floor(100 + Math.random() * 900)}`,
                                  note: 'মূলধনের কিস্তি জমা'
                                });
                                setIsCapitalDepositModalOpen(true);
                              }}
                              className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#006231] border border-emerald-200 text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer active:scale-95 shadow-2xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ মূলধন জমা</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setDividendTargetDirector(dir);
                                setDividendForm({
                                  amount: '',
                                  date: new Date().toISOString().split('T')[0],
                                  method: 'ব্যাংক অ্যাকাউন্ট ট্রান্সফার',
                                  voucherNo: `VCH-DIV-${Math.floor(100 + Math.random() * 900)}`,
                                  note: 'নিয়মিত শেয়ার লভ্যাংশ বণ্টন'
                                });
                                setIsDividendModalOpen(true);
                              }}
                              className="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer active:scale-95 shadow-2xs"
                            >
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span>লভ্যাংশ পে</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedDirectorForCertificate(dir)}
                              className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer active:scale-95 shadow-2xs"
                            >
                              <Award className="w-3.5 h-3.5 text-amber-600" />
                              <span>শেয়ার সনদ</span>
                            </button>

                            {/* Full Profile Details Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDirectorForProfile(dir);
                                setDirectorProfileActiveTab('dividends');
                              }}
                              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer active:scale-95 shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5 text-emerald-400" />
                              <span>পূর্ণাঙ্গ প্রোফাইল</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 2. DESKTOP-ONLY VIEW: Full Width Spreadsheet Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-3xs">
                    <tr>
                      <th className="py-3 px-4">পরিচালকের নাম ও পদবি</th>
                      <th className="py-3 px-4">ফোলিও নং</th>
                      <th className="py-3 px-4">বিনিয়োগকৃত টাকা</th>
                      <th className="py-3 px-4">শেয়ার অংশীদারিত্ব (% Share)</th>
                      <th className="py-3 px-4 text-right">গৃহীত লভ্যাংশ (ডিভিডেন্ড)</th>
                      <th className="py-3 px-4">মনোনীত নমিনি ও মোবাইল</th>
                      <th className="py-3 px-4 text-right">কার্যক্রম ও ডিভিডেন্ড পে</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {directorsList.map((dir) => (
                      <tr key={dir.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
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
                          <div className="text-3xs text-emerald-600 font-medium">পরিশোধিত বিনিয়োগ</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="inline-flex items-center px-2.5 py-1 rounded-xl bg-red-50 text-[#CE2028] font-bold text-xs border border-red-200 shadow-2xs font-mono">
                            <span>{dir.sharePercentage}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="font-black text-sm text-purple-900 font-mono">
                            {formatBDT(dir.dividendEarned || 0)}
                          </div>
                          <div className="text-3xs text-purple-600 font-bold">
                            {(dir.dividendHistory || []).length} টি কিস্তিতে গৃহীত
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{dir.nomineeName || 'সংরক্ষিত'} ({dir.nomineeRelation || 'উত্তরাধিকারী'})</div>
                          {dir.nomineePhone && (
                            <div className="text-3xs font-mono font-bold text-[#006231] mt-0.5">{dir.nomineePhone}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center space-x-1.5 justify-end">
                            {/* 1. Quick Add Capital Installment Button */}
                            <button
                              onClick={() => {
                                setCapitalDepositTargetDirector(dir);
                                setCapitalDepositForm({
                                  amount: '',
                                  date: new Date().toISOString().split('T')[0],
                                  method: 'ব্যাংক চেক',
                                  receiptNo: `RCPT-CAP-${Math.floor(100 + Math.random() * 900)}`,
                                  note: 'মূলধনের কিস্তি জমা'
                                });
                                setIsCapitalDepositModalOpen(true);
                              }}
                              title="ভেঙে ভেঙে বা পরবর্তীতে নতুন মূলধন বিনিয়োগ যোগ করুন"
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#006231] font-bold text-2xs border border-emerald-200 cursor-pointer shadow-2xs inline-flex items-center space-x-1 transition-all active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5 text-[#006231]" />
                              <span>+ মূলধন জমা</span>
                            </button>

                            {/* 2. Quick Dividend Pay Button */}
                            <button
                              onClick={() => {
                                setDividendTargetDirector(dir);
                                setDividendForm({
                                  amount: '',
                                  date: new Date().toISOString().split('T')[0],
                                  method: 'ব্যাংক অ্যাকাউন্ট ট্রান্সফার',
                                  voucherNo: `VCH-DIV-${Math.floor(100 + Math.random() * 900)}`,
                                  note: 'নিয়মিত শেয়ার লভ্যাংশ বণ্টন'
                                });
                                setIsDividendModalOpen(true);
                              }}
                              title="লভ্যাংশ / ডিভিডেন্ড প্রদান করুন"
                              className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-2xs border border-purple-200 cursor-pointer shadow-2xs inline-flex items-center space-x-1 transition-all active:scale-95"
                            >
                              <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                              <span>লভ্যাংশ পে</span>
                            </button>

                            {/* 2. Share Certificate Button */}
                            <button
                              onClick={() => setSelectedDirectorForCertificate(dir)}
                              title="শেয়ার সনদপত্র দেখুন ও প্রিন্ট করুন"
                              className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-2xs border border-amber-200/80 cursor-pointer shadow-2xs inline-flex items-center space-x-1 transition-all active:scale-95"
                            >
                              <Award className="w-3.5 h-3.5 text-amber-600" />
                              <span className="hidden sm:inline">শেয়ার সনদ</span>
                            </button>

                            {/* 3. Full Profile & Ledgers Button */}
                            <button
                              onClick={() => {
                                setSelectedDirectorForProfile(dir);
                                setDirectorProfileActiveTab('dividends');
                              }}
                              title="লভ্যাংশ ভাউচার ও বিস্তারিত প্রোফাইল হিসাব"
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-2xs cursor-pointer shadow-2xs inline-flex items-center space-x-1 transition-all active:scale-95"
                            >
                              <Eye className="w-3.5 h-3.5 text-white/80" />
                              <span>হিসাব খাতা</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: সিস্টেম সেটিংস, ভাষা ও মাস্টার সিকিউরিটি পিন      */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn select-none">
            {/* Header Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006231] animate-pulse"></span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    সিস্টেম সেটিংস ও সিকিউরিটি কন্ট্রোল
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  ড্যাশবোর্ডের ভাষা পরিবর্তন, সিস্টেম মাস্টার পিন এবং নিরাপদ সুরক্ষা কনফিগারেশন
                </p>
              </div>

              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 text-[#006231] text-xs font-bold border border-emerald-200 self-start sm:self-auto">
                <ShieldCheck className="w-4 h-4 text-[#006231]" />
                <span>মাস্টার প্রোটেকশন সক্রিয়</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* 1. Language Preference Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#006231] flex items-center justify-center font-bold">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900">ভাষা নির্বাচন</h4>
                    <p className="text-2xs text-slate-500">আপনার পছন্দ অনুযায়ী বাংলা অথবা ইংরেজি ভাষা নির্ধারণ করুন</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (setLang) setLang('bn');
                      triggerAlert('সিস্টেম ভাষা সফলভাবে বাংলায় সেট করা হয়েছে!');
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      lang === 'bn'
                        ? 'border-[#006231] bg-emerald-50/60 shadow-sm'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">বাংলা</span>
                      {lang === 'bn' && <CheckCircle2 className="w-5 h-5 text-[#006231]" />}
                    </div>
                    <div className="mt-3">
                      <div className="font-bold text-xs text-slate-900">বাংলা ভাষা (ডিফল্ট)</div>
                      <div className="text-3xs text-slate-500 mt-0.5">সব হিসাব ও ইন্টারফেস বাংলায়</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (setLang) setLang('en');
                      triggerAlert('System language set to English!');
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      lang === 'en'
                        ? 'border-[#006231] bg-emerald-50/60 shadow-sm'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">English</span>
                      {lang === 'en' && <CheckCircle2 className="w-5 h-5 text-[#006231]" />}
                    </div>
                    <div className="mt-3">
                      <div className="font-bold text-xs text-slate-900">English Language</div>
                      <div className="text-3xs text-slate-500 mt-0.5">Global ERP interface</div>
                    </div>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-2xs text-slate-600 flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#006231] shrink-0" />
                  <span>বর্তমান সক্রিয় ভাষা: <strong className="text-slate-900 font-bold">{lang === 'bn' ? 'বাংলা (Bangla)' : 'English'}</strong></span>
                </div>
              </div>

              {/* 2. Master PIN Configuration Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#CE2028] flex items-center justify-center font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900">মাস্টার সিকিউরিটি পিন</h4>
                    <p className="text-2xs text-slate-500">প্রজেক্ট বা কোনো গুরুত্বপূর্ণ ডাটা মুছে ফেলতে এই পিন লাগবে</p>
                  </div>
                </div>

                {/* Current PIN status */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-3xs text-slate-400 font-bold uppercase tracking-wider block">বর্তমান মাস্টার পিন</span>
                    <span className="font-mono font-black text-sm text-slate-800 tracking-widest">
                      •••• (ডিফল্ট: 7788)
                    </span>
                  </div>
                  <span className="text-3xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-[#006231] border border-emerald-200 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>সুরক্ষিত</span>
                  </span>
                </div>

                {/* Change PIN Form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (pinChangeForm.oldPin.trim() !== masterPin.trim()) {
                      setPinChangeMsg('বর্তমান পিনটি সঠিক নয়!');
                      return;
                    }
                    if (!pinChangeForm.newPin || pinChangeForm.newPin.length < 4) {
                      setPinChangeMsg('নতুন পিন কমপক্ষে ৪ সংখ্যার হতে হবে!');
                      return;
                    }
                    if (pinChangeForm.newPin !== pinChangeForm.confirmPin) {
                      setPinChangeMsg('নতুন পিন এবং নিশ্চিতকরণ পিন মিলছে না!');
                      return;
                    }
                    try {
                      localStorage.setItem('alemarah_master_pin', pinChangeForm.newPin);
                    } catch {}
                    setMasterPin(pinChangeForm.newPin);
                    setPinChangeForm({ oldPin: '', newPin: '', confirmPin: '' });
                    setPinChangeMsg('মাস্টার পিন সফলভাবে পরিবর্তন করা হয়েছে!');
                    triggerAlert('মাস্টার পিন সফলভাবে আপডেট হয়েছে!');
                  }}
                  className="space-y-3 pt-1"
                >
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                      বর্তমান পিন লিখুন
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="যেমন: 7788"
                      value={pinChangeForm.oldPin}
                      onChange={(e) => {
                        setPinChangeForm({ ...pinChangeForm, oldPin: e.target.value });
                        setPinChangeMsg('');
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                        নতুন পিন (কমপক্ষে ৪ সংখ্যা)
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="নতুন পিন দিন"
                        value={pinChangeForm.newPin}
                        onChange={(e) => {
                          setPinChangeForm({ ...pinChangeForm, newPin: e.target.value });
                          setPinChangeMsg('');
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                        নতুন পিন নিশ্চিত করুন
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="পুনরায় লিখুন"
                        value={pinChangeForm.confirmPin}
                        onChange={(e) => {
                          setPinChangeForm({ ...pinChangeForm, confirmPin: e.target.value });
                          setPinChangeMsg('');
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                      />
                    </div>
                  </div>

                  {pinChangeMsg && (
                    <div className={`p-2.5 rounded-xl text-xs font-bold ${
                      pinChangeMsg.includes('সফলভাবে') ? 'bg-emerald-50 text-[#006231]' : 'bg-red-50 text-[#CE2028]'
                    }`}>
                      {pinChangeMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center space-x-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>নতুন মাস্টার পিন সংরক্ষণ করুন</span>
                  </button>
                </form>
              </div>

            </div>

            {/* Quick Policy Notice */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start space-x-3 text-xs text-amber-900">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">নিরাপত্তা ও মোছার প্রটোকল:</strong>
                <span>
                  কোনো প্রজেক্ট বা কর্মকর্তা তালিকা থেকে মুছে ফেলতে চাইলে সিস্টেমে স্বয়ংক্রিয়ভাবে পপআপ আসবে এবং মাস্টার পিন দিতে হবে। ডিফল্ট মাস্টার পিন হচ্ছে <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300">7788</strong>। আপনি চাইলে যেকোনো সময় উপরের ফর্ম থেকে আপনার নিজস্ব পিন সেট করে নিতে পারবেন।
                </span>
              </div>
            </div>

          </div>
        )}

      </main>
      </div>

      {/* ========================================================= */}
      {/* 4. BOTTOM FOOTER NAVBAR (PHONE ONLY - EDGE TO EDGE & ATTACHED TO BOTTOM) */}
      {/* ========================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-2xl border-t border-slate-200 shadow-lg">
        <div className="flex items-center justify-around py-2 px-3 max-w-lg mx-auto">
          {managementNavItems.filter(item => item.id !== 'settings').map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateToTab(item.id)}
                aria-label={item.shortLabel || item.label}
                title={item.label}
                className={`p-2 rounded-xl transition-all cursor-pointer relative ${
                  isActive 
                    ? 'bg-red-50 text-[#CE2028] scale-105 shadow-2xs font-bold' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CE2028] absolute top-1 right-1.5 animate-pulse"></span>
                )}
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            );
          })}
        </div>
      </nav>

      {/* ========================================================= */}
      {/* MASTER PIN DELETE CONFIRMATION MODAL                      */}
      {/* ========================================================= */}
      {deletePendingAction && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn select-none">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#CE2028] flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-[#CE2028]" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">
                  {deletePendingAction.title || 'ডাটা মুছে ফেলার নিশ্চিতকরণ'}
                </h3>
                <p className="text-3xs text-slate-500">অনুমোদনের জন্য মাস্টার সিকিউরিটি পিন প্রয়োজন</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              {deletePendingAction.desc}
            </p>

            <form onSubmit={handleVerifyAndExecuteDelete} className="space-y-3.5">
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  মাস্টার পিন দিন (ডিফল্ট: 7788) *
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  placeholder="৪ সংখ্যার পিন লিখুন"
                  value={inputtedPin}
                  onChange={(e) => {
                    setInputtedPin(e.target.value);
                    setPinError('');
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center text-sm font-mono font-black tracking-widest text-slate-900 outline-none focus:border-[#CE2028]"
                />
              </div>

              {pinError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-[#CE2028] text-center">
                  {pinError}
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeletePendingAction(null);
                    setInputtedPin('');
                    setPinError('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#991B1B] text-white font-bold text-xs shadow-md shadow-[#CE2028]/20 hover:opacity-95 transition-all cursor-pointer active:scale-95 flex items-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>নিশ্চিত ও ডিলিট করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD DIRECTOR                                       */}
      {/* ========================================================= */}
      {isDirectorModalOpen && (
        <div className={`fixed inset-y-0 right-0 left-0 ${isSidebarCollapsed ? "md:left-20" : "md:left-64 lg:left-72"} z-40 bg-[#F8FAFC] flex flex-col overflow-y-auto animate-fadeIn select-none`}>
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsDirectorModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center space-x-1"
                title="ফিরে যান"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-bold">ফিরে যান</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#CE2028] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">নতুন বোর্ড ডিরেক্টর এন্ট্রি</h3>
                  <p className="text-3xs text-slate-500">বোর্ড অব ডিরেক্টরস তালিকায় নতুন শেয়ারহোল্ডার যুক্ত করুন</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsDirectorModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Full Screen Body */}
          <div className="flex-1 py-6 sm:py-8 px-4 sm:px-6 flex justify-center items-start">
            <div className="w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <form onSubmit={handleAddDirector} className="space-y-4">
                {/* Director Profile Photo Upload */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group shrink-0">
                    <div className="w-20 h-24 rounded-2xl overflow-hidden bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center shadow-xs">
                      {directorForm.image ? (
                        <img 
                          src={directorForm.image} 
                          alt="Director Preview" 
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                          <Camera className="w-6 h-6 mb-1 text-slate-400" />
                          <span className="text-3xs font-bold">ছবি যুক্ত নেই</span>
                        </div>
                      )}
                    </div>
                    {directorForm.image && (
                      <button
                        type="button"
                        onClick={() => setDirectorForm({ ...directorForm, image: null })}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700 cursor-pointer"
                        title="ছবি মুছে ফেলুন"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5 text-center sm:text-left">
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider">
                      পরিচালকের অফিসিয়াল ছবি
                    </label>
                    <p className="text-3xs text-slate-500">
                      শেয়ার সনদপত্র ও ডিরেক্টর প্রোফাইলে প্রদর্শনের জন্য পাসপোর্ট সাইজ ছবি আপলোড করুন (JPG, PNG)
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <label className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer transition-all active:scale-95">
                        <Upload className="w-3.5 h-3.5" />
                        <span>ছবি আপলোড করুন</span>
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
                              setDirectorForm(prev => ({ ...prev, image: event.target.result }));
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      {directorForm.image && (
                        <span className="text-3xs font-bold text-[#006231] bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          ছবি সফলভাবে সংযুক্ত হয়েছে
                        </span>
                      )}
                    </div>
                  </div>
                </div>

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
                    <option value="পরিচালক">পরিচালক</option>
                    <option value="পরিচালক (প্রকৌশল ও কারিগরি)">পরিচালক (প্রকৌশল ও কারিগরি)</option>
                    <option value="পরিচালক (অর্থ ও নিরীক্ষা)">পরিচালক (অর্থ ও নিরীক্ষা)</option>
                    <option value="পরিচালক (আইন ও কমপ্লায়েন্স)">পরিচালক (আইন ও কমপ্লায়েন্স)</option>
                    <option value="পরিচালক (পরিকল্পনা ও উন্নয়ন)">পরিচালক (পরিকল্পনা ও উন্নয়ন)</option>
                    <option value="উপ-ব্যবস্থাপনা পরিচালক">উপ-ব্যবস্থাপনা পরিচালক</option>
                    <option value="স্বতন্ত্র পরিচালক">স্বতন্ত্র পরিচালক</option>
                  </select>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
                  <span className="text-3xs font-bold text-slate-400 uppercase">শেয়ার সার্টিফিকেট / ফোলিও নং</span>
                  <span className="font-mono text-xs font-bold text-[#006231] mt-0.5">
                    DIR-{String((data.directors || []).length + 1).padStart(3, '0')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                    বিনিয়োগকৃত মূলধন *
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
      </div>
    )}

      {/* ========================================================= */}
      {/* FULL SCREEN VIEW 1: DIRECTOR PROFILE & PAYMENT RECEIPTS   */}
      {/* ========================================================= */}
      {selectedDirectorForProfile && (() => {
        const d = selectedDirectorForProfile;
        const totalPaidCapital = (d.installments || []).reduce((acc, i) => acc + (i.amount || 0), 0) || d.investment;
        const totalDividendsReceived = (d.dividendHistory || []).reduce((acc, div) => acc + (div.amount || 0), 0) || d.dividendEarned;

        return (
          <div className={`fixed inset-y-0 right-0 left-0 ${isSidebarCollapsed ? "md:left-20" : "md:left-64 lg:left-72"} z-40 bg-[#F8FAFC] flex flex-col overflow-y-auto animate-fadeIn select-none`}>
            {/* Top Fullscreen Header Navbar */}
            <div className="sticky top-0 z-30 bg-slate-950 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-slate-800 shadow-md">
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                <button
                  type="button"
                  onClick={() => setSelectedDirectorForProfile(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center space-x-1"
                  title="ফিরে যান"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline text-xs font-bold">ফিরে যান</span>
                </button>

                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-white/20 shrink-0">
                    {d.image ? (
                      <img src={d.image} alt={d.name} className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                        <Award className="w-5 h-5 text-[#8EBF40]" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm sm:text-base font-bold text-white truncate">{d.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#8EBF40] border border-emerald-400/30 text-3xs font-bold shrink-0">
                        {d.role}
                      </span>
                    </div>
                    <div className="text-3xs text-slate-400 font-mono flex items-center space-x-2">
                      <span>ফোলিও: <strong className="text-white">{d.folioNo}</strong></span>
                      <span>•</span>
                      <span className="text-amber-300 font-bold">শেয়ার: {d.sharePercentage}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDirectorForProfile(null);
                    setSelectedDirectorForCertificate(d);
                  }}
                  className="px-3 sm:px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors cursor-pointer text-xs font-bold flex items-center space-x-1.5"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>শেয়ার সনদপত্র</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDirectorForProfile(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-red-600 text-white transition-colors cursor-pointer"
                  title="বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-Header Navigation Tabs */}
            <div className="sticky top-[58px] z-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center space-x-4 overflow-x-auto shadow-2xs">
              <button
                type="button"
                onClick={() => setDirectorProfileActiveTab('installments')}
                className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
                  directorProfileActiveTab === 'installments'
                    ? 'border-[#006231] text-[#006231]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>মূলধন জমার কিস্তি ও রসিদ ({(d.installments || []).length})</span>
              </button>

              <button
                type="button"
                onClick={() => setDirectorProfileActiveTab('dividends')}
                className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
                  directorProfileActiveTab === 'dividends'
                    ? 'border-[#CE2028] text-[#CE2028]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>লভ্যাংশ বিবরণী / ডিভিডেন্ড ({(d.dividendHistory || []).length})</span>
              </button>

              <button
                type="button"
                onClick={() => setDirectorProfileActiveTab('info')}
                className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
                  directorProfileActiveTab === 'info'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>নমিনি ও কর্পোরেট তথ্য</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full p-4 sm:p-8 lg:p-10 space-y-6">
              
              {/* Quick Summary Cards (Always Visible in Profile) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                  <div className="text-3xs font-medium text-slate-500 uppercase tracking-wide">পরিশোধিত মূলধন</div>
                  <div className="text-base sm:text-xl font-bold text-[#006231] font-mono">{formatBDT(totalPaidCapital)}</div>
                  <div className="text-3xs text-emerald-600 font-medium">১০০% ভেরিফাইড জমা</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                  <div className="text-3xs font-medium text-slate-500 uppercase tracking-wide">শেয়ার অংশীদারিত্ব</div>
                  <div className="text-base sm:text-xl font-bold text-[#CE2028] font-mono">{d.sharePercentage}%</div>
                  <div className="text-3xs text-red-600 font-medium">কোম্পানির মোট ইকুইটি</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                  <div className="text-3xs font-medium text-slate-500 uppercase tracking-wide">অর্জিত লভ্যাংশ</div>
                  <div className="text-base sm:text-xl font-bold text-purple-900 font-mono">{formatBDT(totalDividendsReceived)}</div>
                  <div className="text-3xs text-purple-600 font-medium">মোট বণ্টিত ডিভিডেন্ড</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                  <div className="text-3xs font-medium text-slate-500 uppercase tracking-wide">বোর্ড অন্তর্ভুক্তি</div>
                  <div className="text-base sm:text-sm font-bold text-slate-800">{d.joiningDate}</div>
                  <div className="text-3xs text-slate-400 font-medium font-mono">{d.folioNo}</div>
                </div>
              </div>

              {/* Tab 1: Capital Installments Statement with Individual Receipts */}
              {directorProfileActiveTab === 'installments' && (
                <div className="space-y-4">
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                          <DollarSign className="w-5 h-5 text-[#006231]" />
                          <span>কিস্তিতে মূলধন জমার অফিসিয়াল রসিদ বিবরণী</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          সম্মানিত পরিচালক কর্তৃক ভেঙে ভেঙে পরিশোধকৃত প্রতিটি কিস্তির রেকর্ড
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setCapitalDepositTargetDirector(d);
                          setCapitalDepositForm({
                            amount: '',
                            date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
                            method: 'ব্যাংক চেক',
                            receiptNo: `RCPT-CAP-${Math.floor(100 + Math.random() * 900)}`,
                            note: 'মূলধনের কিস্তি জমা'
                          });
                          setIsCapitalDepositModalOpen(true);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#006231] hover:bg-[#0A4D27] text-white font-bold text-xs shadow-md shadow-[#006231]/20 flex items-center space-x-1.5 cursor-pointer active:scale-95 transition-all self-start sm:self-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ নতুন মূলধন কিস্তি জমা দিন</span>
                      </button>
                    </div>

                    {/* Full Receipts Table */}
                    {d.installments && d.installments.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-3xs border-y border-slate-200/80">
                            <tr>
                              <th className="py-3 px-4">রসিদ নম্বর</th>
                              <th className="py-3 px-4">তারিখ</th>
                              <th className="py-3 px-4">পেমেন্ট মেথড ও মাধ্যম</th>
                              <th className="py-3 px-4">বিবরণ / নোট</th>
                              <th className="py-3 px-4 text-right">জমার পরিমাণ</th>
                              <th className="py-3 px-4 text-right">স্ট্যাটাস</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {d.installments.map((inst, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-3 px-4">
                                  <span className="font-mono text-3xs font-bold text-emerald-900 bg-emerald-100/70 px-2.5 py-1 rounded-md border border-emerald-200">
                                    {inst.receiptNo || `RCPT-0${idx + 1}`}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-slate-700">{inst.date}</td>
                                <td className="py-3 px-4 font-bold text-slate-800">{inst.method}</td>
                                <td className="py-3 px-4 text-slate-500">{inst.note || 'মূলধন জমা'}</td>
                                <td className="py-3 px-4 text-right font-mono font-bold text-sm text-[#006231]">
                                  +{formatBDT(inst.amount)}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <span className="inline-flex items-center space-x-1 text-3xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>অনুমোদিত</span>
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-sm text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/60">
                        এখনো কোনো পৃথক কিস্তির রসিদ এন্ট্রি দেওয়া হয়নি।
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Dividend Payouts Ledger */}
              {directorProfileActiveTab === 'dividends' && (
                <div className="space-y-4">
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5 text-purple-700" />
                          <span>মুনাফা ও লভ্যাংশ (ডিভিডেন্ড) বিতরণ বিবরণী</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          কোম্পানির শেয়ার মুনাফা বাবদ পরিচালককে ব্যাংক ট্রান্সফার স্টেটমেন্ট
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setDividendTargetDirector(d);
                          setDividendForm({
                            amount: '',
                            date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
                            method: 'ব্যাংক অ্যাকাউন্ট ট্রান্সফার',
                            voucherNo: `VCH-DIV-${Math.floor(100 + Math.random() * 900)}`,
                            note: 'নিয়মিত শেয়ার লভ্যাংশ বণ্টন'
                          });
                          setIsDividendModalOpen(true);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-700/20 flex items-center space-x-1.5 cursor-pointer active:scale-95 transition-all self-start sm:self-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ নতুন ডিভিডেন্ড পে করুন</span>
                      </button>
                    </div>

                    {/* Vouchers Table */}
                    {d.dividendHistory && d.dividendHistory.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-3xs border-y border-slate-200/80">
                            <tr>
                              <th className="py-3 px-4">ভাউচার নম্বর</th>
                              <th className="py-3 px-4">তারিখ</th>
                              <th className="py-3 px-4">পরিশোধের মাধ্যম</th>
                              <th className="py-3 px-4">বিবরণ / খাত</th>
                              <th className="py-3 px-4 text-right">বিতরণকৃত লভ্যাংশ</th>
                              <th className="py-3 px-4 text-right">স্ট্যাটাস</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {d.dividendHistory.map((div, vIdx) => (
                              <tr key={vIdx} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-3 px-4">
                                  <span className="font-mono text-3xs font-bold text-purple-900 bg-purple-100/70 px-2.5 py-1 rounded-md border border-purple-200">
                                    {div.voucherNo || `VCH-0${vIdx + 1}`}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-slate-700">{div.date}</td>
                                <td className="py-3 px-4 font-bold text-slate-800">{div.method}</td>
                                <td className="py-3 px-4 text-slate-500">{div.note || 'শেয়ার লভ্যাংশ পরিশোধ'}</td>
                                <td className="py-3 px-4 text-right font-mono font-bold text-sm text-purple-900">
                                  +{formatBDT(div.amount)}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <span className="inline-flex items-center space-x-1 text-3xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                                    <Sparkles className="w-3 h-3 text-purple-600" />
                                    <span>পরিশোধিত</span>
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-sm text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/60">
                        এখনো কোনো ডিভিডেন্ড পরিশোধের ভাউচার রেকর্ড করা হয়নি।
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Nominee & Corporate Information */}
              {directorProfileActiveTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
                    <h5 className="font-bold text-sm text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>মনোনীত নমিনির বিস্তারিত তথ্য</span>
                    </h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">নমিনির পূর্ণ নাম:</span>
                        <strong className="text-slate-800">{d.nomineeName || 'সংরক্ষিত'}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">পরিচালকের সাথে সম্পর্ক:</span>
                        <strong className="text-slate-800">{d.nomineeRelation || 'উত্তরাধিকারী'}</strong>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">নমিনির মোবাইল নম্বর:</span>
                        <strong className="text-[#006231] font-mono">{d.nomineePhone || 'সংরক্ষিত নেই'}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
                    <h5 className="font-bold text-sm text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span>পরিচালকের অফিসিয়াল যোগাযোগ</span>
                    </h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">মোবাইল ফোন:</span>
                        <a href={`tel:${d.phone}`} className="text-blue-600 font-mono font-bold">{d.phone}</a>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">অফিশিয়াল ইমেইল:</span>
                        <strong className="text-slate-800">{d.email}</strong>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">কোম্পানিতে স্ট্যাটাস:</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#006231] text-3xs font-bold border border-emerald-200">{d.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* FULL SCREEN VIEW 2: OFFICIAL SHARE CERTIFICATE DOSSIER    */}
      {/* ========================================================= */}
      {selectedDirectorForCertificate && (() => {
        const certDir = selectedDirectorForCertificate;

        return (
          <div className={`fixed inset-y-0 right-0 left-0 ${isSidebarCollapsed ? "md:left-20" : "md:left-64 lg:left-72"} z-40 bg-[#F4F1EA] flex flex-col overflow-y-auto animate-fadeIn select-none`}>
            {/* Top Fullscreen Header Navigation */}
            <div className="sticky top-0 z-30 bg-slate-950 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-slate-800 shadow-md no-print">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => setSelectedDirectorForCertificate(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center space-x-1"
                  title="ফিরে যান"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline text-xs font-bold">ফিরে যান</span>
                </button>

                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-sm text-white">অফিশিয়াল শেয়ার মালিকানা সনদপত্র</span>
                  <span className="text-xs text-slate-400 hidden sm:inline">({certDir.name} • {certDir.folioNo})</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>প্রিন্ট / ডাউনলোড করুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedDirectorForCertificate(null);
                    setSelectedDirectorForProfile(certDir);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs hidden sm:flex items-center space-x-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>প্রোফাইল দেখুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDirectorForCertificate(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-red-600 text-white transition-colors cursor-pointer"
                  title="বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Certificate Canvas Container */}
            <div className="flex-1 flex items-center justify-center p-3 sm:p-8 lg:p-12">
              <div className="max-w-4xl w-full relative p-6 sm:p-12 lg:p-16 rounded-[2.5rem] bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EFE0] shadow-2xl text-center space-y-6 sm:space-y-8 border-[12px] border-[#D4AF37]/50 ring-2 ring-[#8C6D23]/40 overflow-hidden printable-document">
                
                {/* Ornate Inner Double Border */}
                <div className="absolute inset-3 sm:inset-5 border-2 border-dashed border-[#B8860B]/60 rounded-3xl pointer-events-none"></div>
                <div className="absolute inset-5 sm:inset-7 border border-[#B8860B]/30 rounded-2xl pointer-events-none"></div>

                {/* Corner Guilloche Embellishments */}
                <div className="absolute top-5 left-6 text-[#996515] text-2xl font-serif select-none pointer-events-none">•</div>
                <div className="absolute top-5 right-6 text-[#996515] text-2xl font-serif select-none pointer-events-none">•</div>
                <div className="absolute bottom-5 left-6 text-[#996515] text-2xl font-serif select-none pointer-events-none">•</div>
                <div className="absolute bottom-5 right-6 text-[#996515] text-2xl font-serif select-none pointer-events-none">•</div>

                {/* Background Watermark Crest */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
                  <img src="/alemarah_logo_header.svg" alt="" className="w-96 h-96 object-contain" />
                </div>

                {/* Company Header & Insignia */}
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#B8860B]"></span>
                    <span className="text-[#8C6D23] font-cinzel text-xs tracking-[0.3em] font-semibold uppercase">Est. Bangladesh</span>
                    <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#B8860B]"></span>
                  </div>

                  <img 
                    src="/alemarah_logo_header.svg" 
                    alt="Al-Emarah Properties" 
                    className="h-14 sm:h-18 mx-auto object-contain drop-shadow-sm"
                  />
                  
                  <div className="text-3xs sm:text-2xs font-bold tracking-[0.2em] text-[#6B572A] uppercase pt-1 font-serif">
                    আল-ইমারাহ প্রপার্টিজ লিমিটেড • গণপ্রজাতন্ত্রী বাংলাদেশ সরকার নিবন্ধিত কর্পোরেট ইকুইটি
                  </div>

                  <div className="pt-2">
                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-[#3D2808] tracking-wide leading-tight drop-shadow-2xs">
                      শেয়ার মালিকানা ও অংশীদারিত্ব সনদ
                    </h2>
                    <p className="text-xs sm:text-sm font-cinzel font-bold text-[#8C6D23] tracking-[0.25em] uppercase mt-1">
                      CERTIFICATE OF SHARE OWNERSHIP & EQUITY DIRECTORSHIP
                    </p>
                  </div>
                </div>

                {/* Gold Foliage Ribbon Row: Folio, Cert ID, Date */}
                <div className="relative z-10 flex flex-wrap items-center justify-between text-xs sm:text-sm font-serif font-bold text-[#5C4316] border-y-2 border-[#D4AF37]/60 py-3 px-6 sm:px-10 bg-gradient-to-r from-[#FFF9E6]/70 via-[#FCF2D4] to-[#FFF9E6]/70 rounded-2xl max-w-2xl mx-auto shadow-inner gap-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#8C6D23] text-2xs uppercase tracking-wider font-sans">ফোলিও:</span>
                    <strong className="text-[#2D1F08] font-mono text-sm sm:text-base font-black">{certDir.folioNo}</strong>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#8C6D23] text-2xs uppercase tracking-wider font-sans">সনদ আইডি:</span>
                    <strong className="text-[#2D1F08] font-mono text-sm sm:text-base font-black">AEP-{certDir.id}</strong>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#8C6D23] text-2xs uppercase tracking-wider font-sans">নিবন্ধন তারিখ:</span>
                    <strong className="text-[#2D1F08] font-mono text-sm sm:text-base font-black">{certDir.joiningDate}</strong>
                  </div>
                </div>

                {/* Certificate Body Text */}
                <div className="relative z-10 space-y-5 text-sm sm:text-base text-slate-800 leading-relaxed font-serif max-w-3xl mx-auto">
                  <p className="text-[#5C4A28] text-xs sm:text-sm tracking-wide">
                    এই মর্মে প্রত্যয়ন করা যাইতেছে যে, কোম্পানি আইন ১৯৯৪ এবং আল-ইমারাহ প্রপার্টিজ লিমিটেড-এর সংঘস্মারক ও সংঘবিধির ক্ষমতাবলে নিম্নবর্ণিত সম্মানিত পরিচালক—
                  </p>

                  <div className="py-2 space-y-1">
                    <div className="text-2xl sm:text-4xl font-serif font-black text-[#1E293B] border-b-2 border-[#B8860B]/50 inline-block px-10 pb-2 tracking-wide shadow-2xs">
                      {certDir.name}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-[#CE2028] tracking-widest uppercase pt-1">
                      {certDir.role} • বোর্ড সদস্য
                    </div>
                  </div>

                  <p className="text-[#3D311A] leading-relaxed text-sm sm:text-base px-2">
                    কোম্পানির অনুকূলে সর্বমোট <strong className="font-extrabold text-[#006231] font-mono text-lg sm:text-xl px-1">{formatBDT(certDir.investment)}</strong> পরিশোধিত মূলধন বিনিয়োগ নিশ্চিতপূর্বক কোম্পানির সর্বমোট ১০০% শেয়ার মূলধনের বিপরীতে নিম্নোক্ত ইকুইটি অংশের বৈধ ও একক স্বত্বাধিকারী সাব্যস্ত হইলেন:
                  </p>

                  {/* Grand Gold Rosette Share Badge */}
                  <div className="relative inline-block my-2">
                    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white via-[#FFFDF8] to-[#FCF6E8] border-2 border-[#D4AF37] shadow-xl relative min-w-[240px] sm:min-w-[280px]">
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#996515] via-[#D4AF37] to-[#996515] text-white text-3xs font-cinzel font-black uppercase tracking-[0.25em] px-4 py-0.5 rounded-full shadow-xs">
                        OFFICIAL EQUITY SHARE
                      </div>
                      <div className="text-4xl sm:text-6xl font-black text-[#CE2028] font-mono tracking-tight mt-1">
                        {certDir.sharePercentage}%
                      </div>
                      <div className="text-2xs font-bold text-[#8C6D23] uppercase tracking-widest mt-1.5 font-serif">
                        বরাদ্দকৃত ইকুইটি শেয়ার অংশ
                      </div>
                      <div className="text-3xs text-slate-500 font-sans mt-0.5">
                        স্বত্বাধিকারী পরিচালক ও আজীবন অংশীদার
                      </div>
                    </div>
                  </div>

                  <p className="text-3xs sm:text-2xs text-[#786338] max-w-xl mx-auto pt-1 leading-normal italic font-serif">
                    উক্ত শেয়ারহোল্ডার কোম্পানির সকল বোর্ড মিটিংয়ে ভোটাধিকার প্রয়োগ, নীতি নির্ধারণী সিদ্ধান্ত গ্রহণ এবং অর্জিত মুনাফা ও ডিভিডেন্ড লাভের পূর্ণ আইনি অধিকারী।
                  </p>
                </div>

                {/* Signatures & Golden Corporate Wax Seal Row */}
                <div className="relative z-10 pt-8 border-t border-[#D4AF37]/50 max-w-3xl mx-auto grid grid-cols-3 items-end gap-4 sm:gap-8">
                  {/* MD Signature */}
                  <div className="text-center">
                    <div className="w-28 sm:w-44 h-12 border-b-2 border-slate-700 mx-auto flex items-end justify-center pb-1">
                      <span className="font-serif italic text-3xs sm:text-xs text-slate-400">ব্যস্থাপনা পরিচালক</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 mt-2 font-serif">ব্যবস্থাপনা পরিচালক</div>
                    <div className="text-3xs text-slate-500">আল-ইমারাহ প্রপার্টিজ লিঃ</div>
                  </div>

                  {/* Golden Corporate Rosette Seal in Center */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#996515] via-[#E6C66E] to-[#8C6D23] p-1 shadow-lg ring-4 ring-[#D4AF37]/30 flex items-center justify-center text-white">
                      <div className="w-full h-full rounded-full border-2 border-dashed border-white/80 flex flex-col items-center justify-center text-center p-1 bg-gradient-to-b from-[#8C6D23] to-[#664614]">
                        <span className="text-3xs font-serif font-black tracking-widest uppercase">AEP LTD</span>
                        <span className="text-[8px] text-amber-200">SEAL</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-[#8C6D23] mt-1 tracking-wider uppercase font-cinzel">OFFICIAL SEAL</span>
                  </div>

                  {/* Chairman Signature */}
                  <div className="text-center">
                    <div className="w-28 sm:w-44 h-12 border-b-2 border-slate-700 mx-auto flex items-end justify-center pb-1">
                      <span className="font-serif italic text-3xs sm:text-xs text-slate-400">বোর্ড চেয়ারম্যান</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 mt-2 font-serif">বোর্ড চেয়ারম্যান</div>
                    <div className="text-3xs text-slate-500">আল-ইমারাহ প্রপার্টিজ লিঃ</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* FULL SCREEN VIEW: CAPITAL INSTALLMENT DEPOSIT ENTRY       */}
      {/* ========================================================= */}
      {isCapitalDepositModalOpen && capitalDepositTargetDirector && (
        <div className={`fixed inset-y-0 right-0 left-0 ${isSidebarCollapsed ? "md:left-20" : "md:left-64 lg:left-72"} z-40 bg-[#F8FAFC] flex flex-col overflow-y-auto animate-fadeIn select-none`}>
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsCapitalDepositModalOpen(false);
                  setCapitalDepositTargetDirector(null);
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center space-x-1"
                title="ফিরে যান"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-bold">ফিরে যান</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#006231] flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">মূলধনের কিস্তি জমা এন্ট্রি</h3>
                  <p className="text-3xs text-slate-500">{capitalDepositTargetDirector.name} ({capitalDepositTargetDirector.folioNo})</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsCapitalDepositModalOpen(false);
                setCapitalDepositTargetDirector(null);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Full Screen Body */}
          <div className="flex-1 py-6 sm:py-8 px-4 sm:px-6 flex justify-center items-start">
            <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <form onSubmit={handleAddCapitalInstallment} className="space-y-4">
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                  জমার টাকার পরিমাণ *
                </label>
                <input
                  type="number"
                  required
                  placeholder="উদাঃ 1000000"
                  value={capitalDepositForm.amount}
                  onChange={(e) => setCapitalDepositForm({ ...capitalDepositForm, amount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-[#006231]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                    জমার তারিখ
                  </label>
                  <input
                    type="date"
                    value={capitalDepositForm.date}
                    onChange={(e) => setCapitalDepositForm({ ...capitalDepositForm, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#006231] cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                    রসিদ নম্বর
                  </label>
                  <input
                    type="text"
                    value={capitalDepositForm.receiptNo}
                    onChange={(e) => setCapitalDepositForm({ ...capitalDepositForm, receiptNo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 outline-none focus:border-[#006231]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                  পেমেন্ট মেথড
                </label>
                <select
                  value={capitalDepositForm.method}
                  onChange={(e) => setCapitalDepositForm({ ...capitalDepositForm, method: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#006231]"
                >
                  <option value="ব্যাংক চেক">ব্যাংক চেক</option>
                  <option value="ব্যাংক ট্রান্সফার">ব্যাংক ট্রান্সফার</option>
                  <option value="পে-অর্ডার">পে-অর্ডার</option>
                  <option value="নগদ জমা">নগদ ক্যাশ রসিদ</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                  মন্তব্য / বিবরণ
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ২য় কিস্তির পরিশোধিত মূলধন"
                  value={capitalDepositForm.note}
                  onChange={(e) => setCapitalDepositForm({ ...capitalDepositForm, note: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#006231]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCapitalDepositModalOpen(false);
                    setCapitalDepositTargetDirector(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#006231] hover:bg-[#0A4D27] text-white font-bold text-xs shadow-md shadow-[#006231]/20 active:scale-95 transition-all"
                >
                  রসিদ ইস্যু ও জমা নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}

      {/* ========================================================= */}
      {/* FULL SCREEN VIEW: DIVIDEND PAYOUT ENTRY                   */}
      {/* ========================================================= */}
      {isDividendModalOpen && dividendTargetDirector && (
        <div className={`fixed inset-y-0 right-0 left-0 ${isSidebarCollapsed ? "md:left-20" : "md:left-64 lg:left-72"} z-40 bg-[#F8FAFC] flex flex-col overflow-y-auto animate-fadeIn select-none`}>
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsDividendModalOpen(false);
                  setDividendTargetDirector(null);
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center space-x-1"
                title="ফিরে যান"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-bold">ফিরে যান</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">লভ্যাংশ / ডিভিডেন্ড প্রদান এন্ট্রি</h3>
                  <p className="text-3xs text-slate-500">{dividendTargetDirector.name} ({dividendTargetDirector.sharePercentage}% শেয়ার)</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsDividendModalOpen(false);
                setDividendTargetDirector(null);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Full Screen Body */}
          <div className="flex-1 py-6 sm:py-8 px-4 sm:px-6 flex justify-center items-start">
            <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <form onSubmit={handleAddDividendPayout} className="space-y-4">
              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                  প্রদেয় লভ্যাংশের পরিমাণ *
                </label>
                <input
                  type="number"
                  required
                  placeholder="উদাঃ 500000"
                  value={dividendForm.amount}
                  onChange={(e) => setDividendForm({ ...dividendForm, amount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                    বিতরণের তারিখ
                  </label>
                  <input
                    type="date"
                    value={dividendForm.date}
                    onChange={(e) => setDividendForm({ ...dividendForm, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                    ভাউচার নম্বর
                  </label>
                  <input
                    type="text"
                    value={dividendForm.voucherNo}
                    onChange={(e) => setDividendForm({ ...dividendForm, voucherNo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                  পরিশোধের মাধ্যম
                </label>
                <select
                  value={dividendForm.method}
                  onChange={(e) => setDividendForm({ ...dividendForm, method: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-600"
                >
                  <option value="ব্যাংক অ্যাকাউন্ট ট্রান্সফার">ব্যাংক একাউন্ট ট্রান্সফার</option>
                  <option value="ব্যাংক চেক">অ্যাকাউন্ট পেয়ী চেক</option>
                  <option value="পে-অর্ডার">পে-অর্ডার</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 uppercase mb-1">
                  বিবরণ
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ২০২৪ অর্থ-বছরের বার্ষিক ডিভিডেন্ড"
                  value={dividendForm.note}
                  onChange={(e) => setDividendForm({ ...dividendForm, note: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsDividendModalOpen(false);
                    setDividendTargetDirector(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-700/20 active:scale-95 transition-all"
                >
                  ডিভিডেন্ড ভাউচার ইস্যু করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}

      {/* ========================================================= */}
      {/* FULL SCREEN VIEW: ADD CLIENT                              */}
      {/* ========================================================= */}
      {isClientModalOpen && (
        <div className={`fixed inset-y-0 right-0 left-0 ${isSidebarCollapsed ? "md:left-20" : "md:left-64 lg:left-72"} z-40 bg-[#F8FAFC] flex flex-col overflow-y-auto animate-fadeIn select-none`}>
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsClientModalOpen(false)}
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
                  <h3 className="font-bold text-base text-slate-900">নতুন ক্লায়েন্ট / ফ্ল্যাট ক্রেতা নিবন্ধন</h3>
                  <p className="text-3xs text-slate-500">গ্রাহকের বুকিং, ফ্ল্যাট ও কিস্তির তথ্য এন্ট্রি করুন</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsClientModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Full Screen Body */}
          <div className="flex-1 py-6 sm:py-8 px-4 sm:px-6 flex justify-center items-start">
            <div className="w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <form onSubmit={handleAddClient} className="space-y-4">
              {/* Client Profile Photo Upload Option */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-bold overflow-hidden ring-2 ring-emerald-500/20 shadow-xs shrink-0">
                    {clientForm.image ? (
                      <img src={clientForm.image} alt="Client Preview" className="w-full h-full object-cover" />
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
                    <span>{clientForm.image ? 'ছবি পরিবর্তন করুন' : 'ছবি আপলোড করুন'}</span>
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
                          setClientForm(prev => ({ ...prev, image: event.target.result }));
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  {clientForm.image && (
                    <button
                      type="button"
                      onClick={() => setClientForm(prev => ({ ...prev, image: '' }))}
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
                    value={clientForm.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      const autoPrefix = val.toLowerCase().replace(/[^a-z0-9]/g, '');
                      setClientForm(prev => ({ 
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
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                    required
                  />
                </div>
              </div>

              {/* Client Portal Login Credentials (Fixed @alemarah.com & Password) */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-xs">
                    <Key className="w-4 h-4 text-amber-600" />
                    <span>গ্রাহক পোর্টাল লগইন ও অ্যাকাউন্ট ক্রেডেনশিয়ালস</span>
                  </div>
                  <span className="text-3xs text-amber-700 font-bold bg-amber-100/70 px-2 py-0.5 rounded-full">
                    সিস্টেম অ্যাকাউন্ট
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      গ্রাহক ইউজারনেম *
                    </label>
                    <div className="flex items-center rounded-xl bg-white border border-slate-200 overflow-hidden focus-within:border-[#CE2028]">
                      <input
                        type="text"
                        placeholder="যেমন: ariful"
                        value={clientForm.emailPrefix}
                        onChange={(e) => setClientForm({ ...clientForm, emailPrefix: e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, '') })}
                        className="flex-1 px-3 py-2 text-xs font-semibold text-slate-800 outline-none min-w-0"
                      />
                      <span className="px-3 py-2 bg-slate-100 text-slate-600 font-mono font-bold text-xs border-l border-slate-200 shrink-0 select-none">
                        @alemarah.com
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      গ্রাহক এই ইউজারনেম বা মোবাইল নম্বর দিয়ে লগইন করতে পারবেন
                    </span>
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      লগইন পাসওয়ার্ড *
                    </label>
                    <input
                      type="text"
                      placeholder="পাসওয়ার্ড লিখুন (ডিফল্ট: password123)"
                      value={clientForm.password}
                      onChange={(e) => setClientForm({ ...clientForm, password: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 outline-none focus:border-[#CE2028]"
                      required
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      গ্রাহককে সহায়তার জন্য এটি সংরক্ষণ করা থাকবে
                    </span>
                  </div>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider">
                      বরাদ্দকৃত ফ্ল্যাট / ইউনিট *
                    </label>
                    <span className="text-[10px] text-slate-400">ড্রপডাউন থেকে নির্বাচন করুন</span>
                  </div>
                  {(() => {
                    const selProj = data.projects.find(p => p.id === clientForm.projectId) || data.projects[0];
                    const projectUnits = selProj?.units || [];
                    const soldUnits = data.clients.filter(c => c.projectId === selProj?.id).map(c => c.flatNo);

                    return (
                      <div className="space-y-1.5">
                        <select
                          value={clientForm.flatNo}
                          onChange={(e) => setClientForm({ ...clientForm, flatNo: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                          required
                        >
                          <option value="">-- ফ্ল্যাট / ইউনিট নির্বাচন করুন --</option>
                          {projectUnits.map((u, uIdx) => {
                            const isSold = soldUnits.includes(u);
                            return (
                              <option key={uIdx} value={u} disabled={isSold}>
                                {u} {isSold ? '(বিক্রিত / বুকড)' : 'খালি'}
                              </option>
                            );
                          })}
                          <option value="custom_manual">তালিকায় নেই (ম্যানুয়ালি লিখুন)</option>
                        </select>

                        {clientForm.flatNo === 'custom_manual' && (
                          <input
                            type="text"
                            placeholder="যেমন: ৯ম তলা, ফ্ল্যাট ৯-এ (১৪৫০ বর্গফুট)"
                            onChange={(e) => setClientForm({ ...clientForm, flatNo: e.target.value })}
                            className="w-full bg-white border border-[#CE2028] rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none animate-fadeIn"
                            autoFocus
                            required
                          />
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    মোট চুক্তি মূল্য *
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
                    বুকিং মানি / প্রাথমিক জমা
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
      </div>
    )}

      {/* ========================================================= */}
      {/* FULL SCREEN VIEW: ADD PROJECT                             */}
      {/* ========================================================= */}
      {isProjectModalOpen && (
        <div className={`fixed inset-y-0 right-0 left-0 ${isSidebarCollapsed ? "md:left-20" : "md:left-64 lg:left-72"} z-40 bg-[#F8FAFC] flex flex-col overflow-y-auto animate-fadeIn select-none`}>
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center space-x-1"
                title="ফিরে যান"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-bold">ফিরে যান</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#CE2028] flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">নতুন প্রজেক্ট যোগ করুন</h3>
                  <p className="text-3xs text-slate-500">প্রজেক্টের নাম, অবস্থান, বাজেট ও ইউনিট কনফিগারেশন</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Full Screen Body */}
          <div className="flex-1 py-6 sm:py-8 px-4 sm:px-6 flex justify-center items-start">
            <div className="w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <form onSubmit={handleAddProject} className="space-y-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    মোট আনুমানিক বাজেট *
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

                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    প্রজেক্টের ধরন / টাইপ *
                  </label>
                  <select
                    value={projectForm.projectType}
                    onChange={(e) => setProjectForm({ ...projectForm, projectType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#CE2028]"
                  >
                    <option value="residential">আবাসিক ফ্ল্যাট</option>
                    <option value="share">বিনিয়োগ শেয়ার</option>
                    <option value="commercial">বাণিজ্যিক স্পেস / শপ</option>
                  </select>
                </div>
              </div>

              {projectForm.projectType === 'residential' && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                  <span className="text-3xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                    <span>অটো ফ্ল্যাট ইনভেন্টরি কনফিগারেশন</span>
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-3xs font-bold text-slate-600 uppercase mb-1">মোট তলা / ফ্লোর</label>
                      <input
                        type="number"
                        min="2"
                        max="30"
                        value={projectForm.totalFloors}
                        onChange={(e) => setProjectForm({ ...projectForm, totalFloors: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-3xs font-bold text-slate-600 uppercase mb-1">প্রতি তলায় ফ্ল্যাট</label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={projectForm.unitsPerFloor}
                        onChange={(e) => setProjectForm({ ...projectForm, unitsPerFloor: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    স্বয়ংক্রিয়ভাবে {Math.max(0, ((Number(projectForm.totalFloors) || 10) - 1) * (Number(projectForm.unitsPerFloor) || 2))}টি ফ্ল্যাট তৈরি হবে (২য় থেকে {projectForm.totalFloors || 10}ম তলা পর্যন্ত)।
                  </p>
                </div>
              )}

              {projectForm.projectType === 'share' && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <label className="block text-3xs font-bold text-slate-600 uppercase mb-1">মোট শেয়ার সংখ্যা</label>
                  <input
                    type="number"
                    placeholder="যেমন: 50 বা 100"
                    value={projectForm.totalFloors}
                    onChange={(e) => setProjectForm({ ...projectForm, totalFloors: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none"
                  />
                  <p className="text-[11px] text-emerald-700 font-medium">
                    স্বয়ংক্রিয়ভাবে {projectForm.totalFloors || 50}টি শেয়ার স্লট তৈরি হবে।
                  </p>
                </div>
              )}

              {projectForm.projectType === 'commercial' && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <label className="block text-3xs font-bold text-slate-600 uppercase mb-1">দোকান / ইউনিটের তালিকা (প্রতি লাইনে একটি)</label>
                  <textarea
                    rows="3"
                    placeholder="গ্রাউন্ড ফ্লোর, দোকান নং ০১&#10;১ম তলা, দোকান নং ১০১&#10;২য় তলা, স্পেস ২০১"
                    value={projectForm.customUnitsText}
                    onChange={(e) => setProjectForm({ ...projectForm, customUnitsText: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 outline-none"
                  />
                </div>
              )}

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
      </div>
    )}

      {/* ========================================================= */}
      {/* FULL SCREEN VIEW: ADD / EDIT TEAM MEMBER & PERMISSIONS    */}
      {/* ========================================================= */}
      {isTeamModalOpen && (
        <div className={`fixed inset-y-0 right-0 left-0 ${isSidebarCollapsed ? "md:left-20" : "md:left-64 lg:left-72"} z-40 bg-[#F8FAFC] flex flex-col overflow-y-auto animate-fadeIn select-none`}>
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsTeamModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center space-x-1"
                title="ফিরে যান"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-bold">ফিরে যান</span>
              </button>
              <div className="flex items-center space-x-2">
                {editingTeamMember?.isSuperAdmin ? (
                  <Crown className="w-5 h-5 text-amber-500" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-[#006231]" />
                )}
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingTeamMember 
                      ? (editingTeamMember.isSuperAdmin ? 'সুপার অ্যাডমিন তথ্য ও পাসওয়ার্ড সম্পাদনা' : 'কর্মকর্তার তথ্য ও পারমিশন সম্পাদনা') 
                      : 'নতুন কর্মকর্তা / সাব-অ্যাডমিন যুক্ত করুন'}
                  </h3>
                  <p className="text-3xs text-slate-500">টিম মেম্বার রোল ও অ্যাক্সেস কন্ট্রোল</p>
                </div>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setIsTeamModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Full Screen Body */}
          <div className="flex-1 py-6 sm:py-8 px-4 sm:px-6 flex justify-center items-start">
            <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <form onSubmit={handleSaveTeam} className="space-y-4">
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
      </div>
    )}

      {/* ========================================================= */}
      {/* FULL SCREEN VIEW: CLIENT PROFILE DETAILS                  */}
      {/* ========================================================= */}
      {selectedClientForProfile && (() => {
        const cl = selectedClientForProfile;
        const project = data.projects.find(p => p.id === cl.projectId);
        const due = (cl.totalPrice || 0) - (cl.totalPaid || 0);
        const percent = cl.totalPrice ? Math.round((cl.totalPaid / cl.totalPrice) * 100) : 0;

        return (
          <div className={`fixed inset-y-0 right-0 left-0 ${isSidebarCollapsed ? "md:left-20" : "md:left-64 lg:left-72"} z-40 bg-[#F8FAFC] flex flex-col overflow-y-auto animate-fadeIn select-none`}>
            {/* Clean Top Sticky Header */}
            <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md text-white px-4 sm:px-8 py-3 flex items-center justify-between border-b border-slate-800/80 shadow-md">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedClientForProfile(null)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center space-x-1.5 text-xs font-bold"
                  title="ফিরে যান"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>ফিরে যান</span>
                </button>
                <div className="h-4 w-[1px] bg-white/20"></div>
                <div className="text-xs sm:text-sm font-bold text-slate-200">
                  গ্রাহক প্রোফাইল বিবরণী
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedClientForProfile(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-500/80 text-white transition-colors cursor-pointer"
                  title="বন্ধ করুন"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Content Container */}
            <div className="flex-1 p-4 pb-36 sm:p-6 sm:pb-24 lg:p-8 lg:pb-28 w-full max-w-7xl mx-auto space-y-6">
              
              {/* 1. Header Banner & Key Financial Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Modern Crisp White & Emerald Client Profile Card */}
                {(() => {
                  const isDeactivated = cl.status === 'deactive' || cl.status === 'নিষ্ক্রিয়';
                  const accountLoginId = cl.phone || cl.id;
                  const accountPassword = cl.password || 'password123';

                  return (
                    <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-6 lg:p-7 text-slate-800 border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
                      {/* Subtle Emerald Background Ambient Glow */}
                      <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-emerald-50 via-slate-50/50 to-transparent rounded-full -mr-24 -mt-24 pointer-events-none"></div>

                      <div className="space-y-4 sm:space-y-5 relative z-10">
                        {/* Live Deactivation Status (Only shown if deactivated) */}
                        {isDeactivated && (
                          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-rose-200 bg-rose-50 text-rose-700 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            <span className="text-3xs tracking-wider font-extrabold">
                              নিষ্ক্রিয় (Deactivated)
                            </span>
                          </div>
                        )}

                        {/* Client Name & Photo Header */}
                        <div className="flex items-center space-x-3.5 sm:space-x-4">
                          <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#006231] to-[#8EBF40] text-white flex items-center justify-center font-black text-lg ring-4 ring-emerald-50 shadow-md shrink-0 overflow-hidden">
                            {cl.image ? (
                              <img src={cl.image} alt={cl.name} className="w-full h-full object-cover" />
                            ) : (
                              cl.name ? cl.name.slice(0, 2) : 'গ্রা'
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-snug break-words">
                              {cl.name}
                            </h2>
                            <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                              <Phone className="w-3.5 h-3.5 text-[#006231] shrink-0" />
                              <span className="font-mono text-slate-800 font-bold">{cl.phone}</span>
                            </div>
                          </div>
                        </div>

                        {/* Assigned Property Highlights Panel */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5 shadow-2xs">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 flex items-center space-x-2">
                              <Building2 className="w-4 h-4 text-[#006231]" />
                              <span>প্রকল্প:</span>
                            </span>
                            <strong className="text-slate-900 font-bold text-xs sm:text-sm">{cl.projectName}</strong>
                          </div>
                          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60">
                            <span className="text-slate-500 flex items-center space-x-2">
                              <Home className="w-4 h-4 text-[#006231]" />
                              <span>ফ্ল্যাট / ইউনিট নম্বর:</span>
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#006231] font-bold text-xs border border-emerald-200">
                              {cl.flatNo}
                            </span>
                          </div>
                          {project?.location && (
                            <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60">
                              <span className="text-slate-500 flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-rose-500" />
                                <span>অবস্থান:</span>
                              </span>
                              <span className="text-slate-700 font-medium truncate max-w-[200px]">{project.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Portal Credentials Drawer: Both Account ID & Password Copyable + Deactivation Toggle */}
                      <div className="mt-5 pt-4 sm:mt-6 sm:pt-5 border-t border-slate-200/80 space-y-3 relative z-10">
                        <div className="flex items-center justify-between">
                          <span className="text-3xs text-slate-500 font-extrabold uppercase tracking-wider">
                            গ্রাহক পোর্টাল অ্যাকাউন্ট ও পাসওয়ার্ড
                          </span>
                          <span className="text-3xs text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
                            সিস্টেম লগইন
                          </span>
                        </div>

                        {/* Dual Credentials Pill (Account ID + Password) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {/* Account ID / Mobile */}
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <span className="text-[10px] text-slate-400 block font-semibold">লগইন আইডি/মোবাইল</span>
                              <strong className="text-slate-900 font-mono text-xs font-bold truncate block">
                                {accountLoginId}
                              </strong>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(accountLoginId);
                                triggerAlert('লগইন অ্যাকাউন্ট আইডি কপি হয়েছে!');
                              }}
                              className="p-1.5 rounded-lg bg-white hover:bg-emerald-50 text-slate-600 hover:text-[#006231] border border-slate-200 text-3xs font-bold inline-flex items-center space-x-1 cursor-pointer transition-colors shrink-0"
                              title="অ্যাকাউন্ট আইডি কপি করুন"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>কপি</span>
                            </button>
                          </div>

                          {/* Password */}
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <span className="text-[10px] text-slate-400 block font-semibold">পাসওয়ার্ড</span>
                              <strong className="text-amber-700 font-mono text-xs font-bold truncate block">
                                {accountPassword}
                              </strong>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(accountPassword);
                                triggerAlert('পাসওয়ার্ড কপি হয়েছে!');
                              }}
                              className="p-1.5 rounded-lg bg-white hover:bg-emerald-50 text-slate-600 hover:text-[#006231] border border-slate-200 text-3xs font-bold inline-flex items-center space-x-1 cursor-pointer transition-colors shrink-0"
                              title="পাসওয়ার্ড কপি করুন"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>কপি</span>
                            </button>
                          </div>
                        </div>

                        {/* Account Actions: Deactivate / Activate Button & Booking Status with ID */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                          <button
                            type="button"
                            onClick={() => handleToggleClientStatus(cl.id)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs ${
                              isDeactivated
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {isDeactivated ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>অ্যাকাউন্ট সক্রিয় করুন (Activate)</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-3.5 h-3.5 text-rose-600" />
                                <span>অ্যাকাউন্ট ডিঅ্যাক্টিভ করুন (Deactivate)</span>
                              </>
                            )}
                          </button>

                          {/* Confirmed / Approved Badge paired with Customer ID on single line */}
                          <div className="flex items-center gap-2 flex-nowrap">
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-2xs font-bold text-[#006231] bg-emerald-50 border border-emerald-200 shadow-2xs shrink-0 whitespace-nowrap">
                              <CheckCircle2 className="w-3 h-3 text-[#006231]" />
                              <span>অনুমোদিত</span>
                            </span>
                            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-2xs font-mono font-bold shadow-2xs shrink-0 whitespace-nowrap">
                              <span>{cl.id}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard?.writeText(cl.id);
                                  triggerAlert('আইডি কপি হয়েছে!');
                                }}
                                className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 ml-0.5"
                                title="আইডি কপি করুন"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 3 Quick Financial Metric Cards */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Total Contract */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="text-3xs font-bold text-slate-400 uppercase tracking-wider pt-2">মোট ফ্ল্যাট চুক্তি মূল্য</div>
                      <div className="text-lg sm:text-xl font-black text-slate-900">{formatBDT(cl.totalPrice)}</div>
                    </div>
                    <div className="text-3xs text-slate-400 font-medium pt-3 border-t border-slate-100 flex items-center space-x-1">
                      <span>ফ্ল্যাট বরাদ্দকৃত চুক্তিপত্র অনুযায়ী</span>
                    </div>
                  </div>

                  {/* Total Paid */}
                  <div className="bg-white rounded-3xl p-5 border border-emerald-200/80 shadow-xs flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#006231] flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="text-3xs font-bold text-emerald-700 uppercase tracking-wider pt-2">পরিশোধিত মোট জমা</div>
                      <div className="text-lg sm:text-xl font-black text-[#006231]">{formatBDT(cl.totalPaid)}</div>
                    </div>
                    <div className="text-3xs text-emerald-600 font-bold pt-3 border-t border-emerald-50 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-[#006231]" />
                      <span>মোট {percent}% পরিশোধ সম্পন্ন</span>
                    </div>
                  </div>

                  {/* Due Balance */}
                  <div className="bg-white rounded-3xl p-5 border border-red-200/80 shadow-xs flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#CE2028] flex items-center justify-center">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div className="text-3xs font-bold text-[#CE2028] uppercase tracking-wider pt-2">অবশিষ্ট বকেয়া ব্যালেন্স</div>
                      <div className="text-lg sm:text-xl font-black text-[#CE2028]">{formatBDT(due)}</div>
                    </div>
                    <div className="text-3xs text-slate-500 font-medium pt-3 border-t border-red-50 flex items-center justify-between">
                      <span>বাকি: {100 - Math.min(100, percent)}%</span>
                      {due === 0 ? (
                        <span className="text-emerald-600 font-bold">পরিশোধিত </span>
                      ) : (
                        <span className="text-amber-600 font-bold">চলমান</span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar span-full */}
                  <div className="sm:col-span-3 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700 flex items-center space-x-1.5">
                        <TrendingUp className="w-4 h-4 text-[#006231]" />
                        <span>মূল্য পরিশোধের সার্বিক অগ্রগতি</span>
                      </span>
                      <span className="text-[#006231] font-black">{percent}% সম্পন্ন</span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
                      <div
                        className="bg-gradient-to-r from-[#006231] via-[#0A4D27] to-[#8EBF40] h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-3xs font-bold text-slate-400">
                      <span>প্রাথমিক জমা (বুকিং)</span>
                      <span>চলমান জমাসমূহ</span>
                      <span>হস্তান্তর ও রেজিস্ট্রি</span>
                    </div>
                  </div>
                </div>
              </div>



              {/* 3. Detailed Payment History & Receipts Table (Box-free on mobile, clean card on desktop) */}
              <div className="space-y-4 md:bg-white md:rounded-3xl md:p-6 md:border md:border-slate-200/80 md:shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-200/80">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
                      <FileSpreadsheet className="w-4 h-4 text-[#006231]" />
                      <span>পরিশোধিত জমার পূর্ণাঙ্গ হিস্টোরি ও রসিদ রেকর্ড</span>
                    </h4>
                    <p className="text-3xs text-slate-500 mt-0.5">
                      এখন পর্যন্ত মোট {cl.paymentHistory?.length || 0}টি পেমেন্ট সফলভাবে এন্ট্রি ও অনুমোদিত হয়েছে
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const targetId = cl.id;
                      setSelectedClientForProfile(null);
                      setPaymentForm({
                        ...paymentForm,
                        clientId: targetId,
                        amount: ''
                      });
                      setActiveTab('payments');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-[#006231] flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন জমা যুক্ত করুন</span>
                  </button>
                </div>

                {cl.paymentHistory && cl.paymentHistory.length > 0 ? (
                  <>
                    {/* Mobile Phone List View: Clean box-free date and amount list, tap opens detail popup */}
                    <div className="block md:hidden">
                      <div className="divide-y divide-slate-200/70">
                        {(isHistoryExpanded ? cl.paymentHistory : cl.paymentHistory.slice(0, 3)).map((trx, tIdx) => (
                          <div
                            key={tIdx}
                            onClick={() => setSelectedHistoryTrxForModal({ trx, client: cl })}
                            className="py-3 px-1 flex items-center justify-between gap-3 hover:bg-slate-100/60 active:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                              <span className="text-xs font-semibold text-slate-800 truncate">
                                {trx.date}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              <span className="text-xs font-black text-[#006231]">
                                +{formatBDT(trx.amount)}
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Expand / Collapse Button if more than 3 transactions */}
                      {cl.paymentHistory.length > 3 && (
                        <div className="pt-3 border-t border-slate-200/70 text-center">
                          <button
                            type="button"
                            onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 border border-slate-200 shadow-2xs active:scale-[0.99]"
                          >
                            <span>
                              {isHistoryExpanded 
                                ? 'সংক্ষেপ করুন (কম দেখান)' 
                                : `আরো ${cl.paymentHistory.length - 3}টি জমার রেকর্ড দেখুন (সব দেখুন)`}
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isHistoryExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Desktop Table View (>= md screens) */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/70 text-3xs font-extrabold uppercase tracking-wider text-slate-400">
                            <th className="py-3 px-4 rounded-l-xl">ট্রানজাকশন / রসিদ আইডি</th>
                            <th className="py-3 px-4">জমার তারিখ</th>
                            <th className="py-3 px-4">পেমেন্ট মাধ্যম</th>
                            <th className="py-3 px-4 text-right">জমার পরিমাণ</th>
                            <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                            <th className="py-3 px-4 text-right rounded-r-xl">অ্যাকশন</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {cl.paymentHistory.map((trx, tIdx) => (
                            <tr key={tIdx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-2xs">
                                <span className="p-1 px-2 rounded-lg bg-slate-100 border border-slate-200/60">
                                  {trx.id}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-medium text-slate-700 text-2xs">
                                {trx.date}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-3xs border border-slate-200/80">
                                  {trx.method}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right font-black text-xs text-[#006231]">
                                +{formatBDT(trx.amount)}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#006231] font-bold text-3xs border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-[#006231]" />
                                  <span>অনুমোদিত</span>
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => setSelectedReceiptForPrint({ trx, client: cl })}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#CE2028] hover:text-white text-slate-700 font-bold text-3xs border border-slate-200 hover:border-[#CE2028] transition-all cursor-pointer inline-flex items-center space-x-1"
                                  title="মানি রসিদ প্রিন্ট করুন"
                                >
                                  <Printer className="w-3 h-3" />
                                  <span>রসিদ প্রিন্ট</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <FileText className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold text-slate-600">এখনো কোনো পূর্ববর্তী জমার রেকর্ড যুক্ত করা হয়নি</p>
                    <p className="text-3xs text-slate-400">নতুন টাকা জমার মাধ্যমে ক্লায়েন্টের পেমেন্ট হিস্টোরি তৈরি করুন</p>
                  </div>
                )}
              </div>



            </div>
          </div>
        );
      })()}

      {/* POPUP MODAL: PAYMENT TRANSACTION DETAIL (PHONE & DESKTOP) */}
      {selectedHistoryTrxForModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedHistoryTrxForModal(null)}
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
                onClick={() => setSelectedHistoryTrxForModal(null)}
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
                +{formatBDT(selectedHistoryTrxForModal.trx.amount)}
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
                    {selectedHistoryTrxForModal.trx.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(selectedHistoryTrxForModal.trx.id);
                      triggerAlert('রসিদ আইডি কপি হয়েছে!');
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
                  {selectedHistoryTrxForModal.trx.date}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <span className="text-slate-500 text-2xs">পরিশোধের মাধ্যম</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-2xs border border-slate-200/60">
                  {selectedHistoryTrxForModal.trx.method}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <span className="text-slate-500 text-2xs">গ্রাহকের নাম</span>
                <span className="font-bold text-slate-800 text-2xs truncate max-w-[190px]">
                  {selectedHistoryTrxForModal.client.name}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <span className="text-slate-500 text-2xs">প্রজেক্ট ও ফ্ল্যাট</span>
                <span className="font-bold text-slate-700 text-2xs truncate max-w-[190px]">
                  {selectedHistoryTrxForModal.client.projectName || selectedHistoryTrxForModal.client.project} ({selectedHistoryTrxForModal.client.flatNo})
                </span>
              </div>

              {selectedHistoryTrxForModal.trx.note && (
                <div className="flex items-start justify-between pt-2.5">
                  <span className="text-slate-500 text-2xs">বিশেষ বিবরণ / নোট</span>
                  <span className="font-medium text-slate-700 text-2xs text-right max-w-[190px]">
                    {selectedHistoryTrxForModal.trx.note}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  const printData = { ...selectedHistoryTrxForModal };
                  setSelectedHistoryTrxForModal(null);
                  setSelectedReceiptForPrint(printData);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#006231] hover:bg-[#0A4D27] text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>রসিদ প্রিন্ট করুন</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedHistoryTrxForModal(null)}
                className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL SCREEN VIEW: OFFICIAL MONEY RECEIPT PREVIEW & PRINT  */}
      {/* ========================================================= */}
      {selectedReceiptForPrint && (() => {
        const { trx, client } = selectedReceiptForPrint;

        return (
          <div className={`fixed inset-y-0 right-0 left-0 ${isSidebarCollapsed ? "md:left-20" : "md:left-64 lg:left-72"} z-40 bg-[#F1F5F9] flex flex-col overflow-y-auto animate-fadeIn select-none`}>
            {/* Top Controls Header */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs no-print">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedReceiptForPrint(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center space-x-1"
                  title="ফিরে যান"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline text-xs font-bold">ফিরে যান</span>
                </button>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-[#006231]" />
                  <span className="font-bold text-sm text-slate-800">অফিশিয়াল মানি রিসিট ভাউচার</span>
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
                  onClick={() => setSelectedReceiptForPrint(null)}
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
                    <div className="text-3xs font-bold text-slate-600 mt-1">আদায়কারীর স্বাক্ষর</div>
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
      })()}

    </div>
  );
}
