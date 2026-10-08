// Central Store for Al-Emarah Management & Client Data with LocalStorage Persistence

const STORAGE_KEY = 'alemarah_management_store_v1';

export const initialManagementData = {
  projects: [
    {
      id: 'al-quds-tower',
      name: 'আল কুদস টাওয়ার',
      nameEn: 'Al Quds Tower',
      location: 'সাইনবোর্ড - সানারপাড়, ঢাকা',
      progress: 68,
      currentStage: '৭ম তলা ছাদ ঢালাই ও অভ্যন্তরীণ ব্রিকওয়ার্ক',
      budget: 85000000, // ৳ ৮,৫০,০০,০০০
      expenses: [
        { id: 'EXP-1', title: 'পাইলিং ও ডিপ বেসমেন্ট পাইলিং', amount: 18000000, date: '১০ মার্চ ২০২৬' },
        { id: 'EXP-2', title: '১ম থেকে ৫ম তলা আরসিসি ফ্রেম স্ট্রাকচার', amount: 31000000, date: '১৫ মে ২০২৬' },
        { id: 'EXP-3', title: '৬ষ্ঠ ও ৭ম তলা চলমান ঢালাই ও ব্রিকওয়ার্ক', amount: 12000000, date: '২০ সেপ্টেম্বর ২০২৬' }
      ]
    },
    {
      id: 'barakah-tower-01',
      name: 'বারাকাহ টাওয়ার ০১',
      nameEn: 'Barakah Tower 01',
      location: 'পুরানা পল্টন, ঢাকা',
      progress: 35,
      currentStage: '৩য় তলা কলাম ও ছাদ সাটারিং',
      budget: 62000000, // ৳ ৬,২০,০০,০০০
      expenses: [
        { id: 'EXP-B1', title: 'পাইলিং ও সয়েল প্রটেকশন রিটেইনিং ওয়াল', amount: 11500000, date: '১ জুন ২০২৬' },
        { id: 'EXP-B2', title: 'বেসমেন্ট ও গ্রাউন্ড ফ্লোর ঢালাই', amount: 9500000, date: '১৮ আগস্ট ২০২৬' }
      ]
    },
    {
      id: 'alemarah-shopping-mall',
      name: 'আল ইমারাহ শপিং মল',
      nameEn: 'Al Emarah Shopping Mall',
      location: '২২ ফুট প্রশস্ত রাস্তা সংলগ্ন, প্রাইম বাণিজ্যিক জোন',
      progress: 15,
      currentStage: 'সাইট ডেভেলপমেন্ট ও সয়েল টেস্ট সম্পন্ন',
      budget: 120000000, // ৳ ১২,০০,০০,০০০
      expenses: [
        { id: 'EXP-M1', title: 'ভূমি উন্নয়ন, বাউন্ডারি ওয়াল ও সয়েল টেস্ট', amount: 14000000, date: '৫ সেপ্টেম্বর ২০২৬' }
      ]
    }
  ],
  clients: [
    {
      id: 'CLI-88214',
      name: 'মোহাম্মদ আরিফুল ইসলাম',
      phone: '01711223344',
      password: 'password123',
      projectId: 'al-quds-tower',
      projectName: 'আল কুদস টাওয়ার',
      flatNo: '৭ম তলা, ফ্ল্যাট ৭-বি (১২৬৫ বর্গফুট)',
      totalPrice: 12000000, // ৳ ১,২০,০০,০০০
      totalPaid: 7200000,   // ৳ ৭২,০০,০০০
      nextDueDate: '১৫ অক্টোবর, ২০২৬',
      nextDueAmount: 600000,
      paymentHistory: [
        { id: 'TRX-101', date: '১৫ জুলাই, ২০২৬', amount: 2400000, method: 'ব্যাংক ডিপোজিট (সিটি ব্যাংক)' },
        { id: 'TRX-102', date: '১৫ আগস্ট, ২০২৬', amount: 2400000, method: 'ব্যাংক ডিপোজিট (ইসলামী ব্যাংক)' },
        { id: 'TRX-103', date: '১৫ সেপ্টেম্বর, ২০২৬', amount: 2400000, method: 'পে-অর্ডার' }
      ]
    },
    {
      id: 'CLI-99432',
      name: 'ইঞ্জিঃ রফিকুল ইসলাম',
      phone: '01819988776',
      password: 'password123',
      projectId: 'barakah-tower-01',
      projectName: 'বারাকাহ টাওয়ার ০১',
      flatNo: '৪র্থ তলা, ইউনিট ৪-এ (১৪৫০ বর্গফুট)',
      totalPrice: 9500000, // ৳ ৯৫,০০,০০০
      totalPaid: 3500000,  // ৳ ৩৫,০০,০০০
      nextDueDate: '১ নভেম্বর, ২০২৬',
      nextDueAmount: 500000,
      paymentHistory: [
        { id: 'TRX-201', date: '১ জুন, ২০২৬', amount: 2000000, method: 'বুকিং মানি ও চুক্তি' },
        { id: 'TRX-202', date: '১ আগস্ট, ২০২৬', amount: 1500000, method: 'ব্যাংক চেক' }
      ]
    }
  ],
  superAdmin: {
    id: 'SUPER-ADMIN-01',
    name: 'প্রধান নির্বাহী ও সুপার অ্যাডমিন',
    nameEn: 'Super Administrator',
    email: 'alemarah.officialbd@gmail.com',
    phone: '01816233013',
    role: 'সুপার অ্যাডমিন (Super Admin)',
    roleType: 'super_admin',
    accessKey: 'admin123',
    isSuperAdmin: true,
    permissions: ['all'],
    status: 'সক্রিয় (Active)'
  },
  managementTeam: [
    {
      id: 'SUPER-ADMIN-01',
      name: 'প্রধান নির্বাহী ও সুপার অ্যাডমিন',
      nameEn: 'Super Administrator',
      email: 'alemarah.officialbd@gmail.com',
      phone: '01816233013',
      role: 'সুপার অ্যাডমিন (Super Admin)',
      roleType: 'super_admin',
      accessKey: 'admin123',
      isSuperAdmin: true,
      permissions: ['all'],
      status: 'সক্রিয় (Active)'
    },
    {
      id: 'MGT-01',
      name: 'প্রকৌশলী মহিউদ্দিন আহমেদ',
      email: 'engineer@alemarahproperties.com',
      phone: '01918646575',
      role: 'প্রজেক্ট ডিরেক্টর / সাইট ইনচার্জ',
      roleType: 'project_director',
      accessKey: 'admin123',
      isSuperAdmin: false,
      permissions: ['projects', 'expenses'],
      status: 'সক্রিয় (Active)'
    },
    {
      id: 'MGT-02',
      name: 'মুহাম্মদ আব্দুর রহমান',
      email: 'accounts@alemarahproperties.com',
      phone: '01743926926',
      role: 'হেড অফ অ্যাকাউন্টস & ফাইন্যান্স',
      roleType: 'accounts_head',
      accessKey: 'admin123',
      isSuperAdmin: false,
      permissions: ['payments', 'expenses', 'clients'],
      status: 'সক্রিয় (Active)'
    }
  ],
  directors: [
    {
      id: 'DIR-01',
      name: 'শেখ ফজলুল করিম মারুফ',
      nameEn: 'Sheikh Fazlul Karim Maroof',
      role: 'চেয়ারম্যান',
      roleEn: 'Chairman',
      folioNo: 'AEP-DIR-001',
      image: '/images/chairman.webp',
      investment: 25000000, // ৳ ২,৫০,০০,০০০
      sharePercentage: 35, // 35%
      dividendEarned: 3650000, // ৳ ৩৬,৫০,০০০
      phone: '01816233013',
      email: 'chairman@alemarahproperties.com',
      joiningDate: '১ জানুয়ারি, ২০২৪',
      status: 'সক্রিয় (Active)',
      nomineeName: 'আইনানুগ উত্তরসূরি',
      nomineeRelation: 'পরিবার',
      nomineePhone: '01816-233013',
      theme: 'crimson'
    },
    {
      id: 'DIR-02',
      name: 'তালুকদার তারিক মাসউদ',
      nameEn: 'Talukdar Tariq Masud',
      role: 'ব্যবস্থাপনা পরিচালক',
      roleEn: 'Managing Director',
      folioNo: 'AEP-DIR-002',
      image: '/images/managing_director.webp',
      investment: 20000000, // ৳ ২,০০,০০,০০০
      sharePercentage: 30, // 30%
      dividendEarned: 2920000, // ৳ ২৯,২০,০০০
      phone: '01918646575',
      email: 'md@alemarahproperties.com',
      joiningDate: '১ জানুয়ারি, ২০২৪',
      status: 'সক্রিয় (Active)',
      nomineeName: 'আইনানুগ উত্তরসূরি',
      nomineeRelation: 'পরিবার',
      nomineePhone: '01918-646575',
      theme: 'emerald'
    },
    {
      id: 'DIR-03',
      name: 'ইঞ্জি. এম. এ. রহমান',
      nameEn: 'Engr. M. A. Rahman',
      role: 'পরিচালক (প্রকৌশল ও কারিগরি)',
      roleEn: 'Director (Technical & Engineering)',
      folioNo: 'AEP-DIR-003',
      image: null,
      investment: 10000000, // ৳ ১,০০,০০,০০০
      sharePercentage: 15, // 15%
      dividendEarned: 1460000, // ৳ ১৪,৬০,০০০
      phone: '01743926926',
      email: 'technical@alemarahproperties.com',
      joiningDate: '১৫ মার্চ, ২০২৪',
      status: 'সক্রিয় (Active)',
      nomineeName: 'মোসা. ফারহানা রহমান',
      nomineeRelation: 'স্ত্রী',
      nomineePhone: '01711-223344',
      theme: 'blue'
    },
    {
      id: 'DIR-04',
      name: 'ব্যারিস্টার এস. এইচ. চৌধুরী',
      nameEn: 'Barrister S. H. Chowdhury',
      role: 'পরিচালক (আইন ও কমপ্লায়েন্স)',
      roleEn: 'Director (Legal & Compliance)',
      folioNo: 'AEP-DIR-004',
      image: null,
      investment: 7500000, // ৳ ৭৫,০০,০০০
      sharePercentage: 10, // 10%
      dividendEarned: 1095000, // ৳ ১০,৯৫,০০০
      phone: '01914425073',
      email: 'legal@alemarahproperties.com',
      joiningDate: '১০ মে, ২০২৪',
      status: 'সক্রিয় (Active)',
      nomineeName: 'সাইফুল চৌধুরী',
      nomineeRelation: 'পুত্র',
      nomineePhone: '01911-334455',
      theme: 'amber'
    },
    {
      id: 'DIR-05',
      name: 'তানভীর হাসান, এফসিএ',
      nameEn: 'Tanvir Hasan, FCA',
      role: 'পরিচালক (অর্থ ও নিরীক্ষা)',
      roleEn: 'Director (Finance & Audit)',
      folioNo: 'AEP-DIR-005',
      image: null,
      investment: 7500000, // ৳ ৭৫,০০,০০০
      sharePercentage: 10, // 10%
      dividendEarned: 1095000, // ৳ ১০,৯৫,০০০
      phone: '01833544548',
      email: 'accounts@alemarahproperties.com',
      joiningDate: '১ জুলাই, ২০২৪',
      status: 'সক্রিয় (Active)',
      nomineeName: 'নাজমিন হাসান',
      nomineeRelation: 'স্ত্রী',
      nomineePhone: '01811-556677',
      theme: 'purple'
    }
  ]
};

// Load saved data or return default
export const getManagementData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (!parsed.directors || parsed.directors.length === 0) {
        parsed.directors = initialManagementData.directors;
      }
      if (!parsed.superAdmin) {
        parsed.superAdmin = initialManagementData.superAdmin;
      }
      if (!parsed.managementTeam || parsed.managementTeam.length === 0) {
        parsed.managementTeam = initialManagementData.managementTeam;
      } else if (!parsed.managementTeam.some(m => m.isSuperAdmin || m.email === 'alemarah.officialbd@gmail.com')) {
        parsed.managementTeam = [initialManagementData.superAdmin, ...parsed.managementTeam];
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error loading management data from localStorage:', e);
  }
  return initialManagementData;
};

// Save data to localStorage
export const saveManagementData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('alemarah_store_updated', { detail: data }));
  } catch (e) {
    console.error('Error saving management data to localStorage:', e);
  }
};

// Subscription listener for real-time sync across components
export const subscribeToManagementData = (callback) => {
  const handler = (e) => {
    callback(e.detail || getManagementData());
  };
  const storageHandler = (e) => {
    if (e.key === STORAGE_KEY) {
      callback(getManagementData());
    }
  };
  window.addEventListener('alemarah_store_updated', handler);
  window.addEventListener('storage', storageHandler);
  return () => {
    window.removeEventListener('alemarah_store_updated', handler);
    window.removeEventListener('storage', storageHandler);
  };
};

// Currency formatter utility
export const formatBDT = (num) => {
  if (num === undefined || num === null) return '৳ ০';
  const val = Number(num) || 0;
  return '৳ ' + val.toLocaleString('bn-BD');
};
