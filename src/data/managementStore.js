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
  managementTeam: [
    {
      id: 'MGT-01',
      name: 'প্রকৌশলী মহিউদ্দিন আহমেদ',
      phone: '01918646575',
      role: 'প্রজেক্ট ডিরেক্টর / সাইট ইনচার্জ',
      accessKey: 'admin123'
    },
    {
      id: 'MGT-02',
      name: 'মুহাম্মদ আব্দুর রহমান',
      phone: '01743926926',
      role: 'হেড অফ অ্যাকাউন্টস & ফাইন্যান্স',
      accessKey: 'admin123'
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
      totalShares: 35000,
      shareFaceValue: 1000,
      dividendEarned: 3650000, // ৳ ৩৬,৫০,০০০
      education: 'স্নাতক, লোক প্রশাসন, ঢাকা বিশ্ববিদ্যালয়',
      phone: '01816233013',
      email: 'chairman@alemarahproperties.com',
      joiningDate: '১ জানুয়ারি, ২০২৪',
      status: 'সক্রিয় (Active)',
      allocatedProjects: ['আল কুদস টাওয়ার', 'বারাকাহ টাওয়ার ০১', 'আল ইমারাহ এগ্রো'],
      nomineeName: 'পারিবারিক ট্রাস্ট / আইনানুগ উত্তরসূরি',
      nomineeRelation: 'উত্তরাধিকারী',
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
      totalShares: 30000,
      shareFaceValue: 1000,
      dividendEarned: 2920000, // ৳ ২৯,২০,০০০
      education: 'BSS রাষ্ট্রবিজ্ঞান, সরকারি তিতুমীর কলেজ',
      phone: '01918646575',
      email: 'md@alemarahproperties.com',
      joiningDate: '১ জানুয়ারি, ২০২৪',
      status: 'সক্রিয় (Active)',
      allocatedProjects: ['আল কুদস টাওয়ার', 'বারাকাহ টাওয়ার ০১', 'আল ইমারাহ শপিং মল'],
      nomineeName: 'পারিবারিক ট্রাস্ট / আইনানুগ উত্তরসূরি',
      nomineeRelation: 'উত্তরাধিকারী',
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
      totalShares: 15000,
      shareFaceValue: 1000,
      dividendEarned: 1460000, // ৳ ১৪,৬০,০০০
      education: 'বিএসসি ইন সিভিল ইঞ্জিনিয়ারিং, বুয়েট',
      phone: '01743926926',
      email: 'technical@alemarahproperties.com',
      joiningDate: '১৫ মার্চ, ২০২৪',
      status: 'সক্রিয় (Active)',
      allocatedProjects: ['আল কুদস টাওয়ার'],
      nomineeName: 'মোসা. ফারহানা রহমান',
      nomineeRelation: 'স্ত্রী',
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
      totalShares: 7500,
      shareFaceValue: 1000,
      dividendEarned: 1095000, // ৳ ১০,৯৫,০০০
      education: 'এলএলবি (অনার্স), এলএলএম, ঢাকা বিশ্ববিদ্যালয়',
      phone: '01914425073',
      email: 'legal@alemarahproperties.com',
      joiningDate: '১০ মে, ২০২৪',
      status: 'সক্রিয় (Active)',
      allocatedProjects: ['আল ইমারাহ শপিং মল'],
      nomineeName: 'সাইফুল চৌধুরী',
      nomineeRelation: 'পুত্র',
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
      totalShares: 7500,
      shareFaceValue: 1000,
      dividendEarned: 1095000, // ৳ ১০,৯৫,০০০
      education: 'চার্টার্ড অ্যাকাউন্ট্যান্ট (আইসিএবি)',
      phone: '01833544548',
      email: 'accounts@alemarahproperties.com',
      joiningDate: '১ জুলাই, ২০২৪',
      status: 'সক্রিয় (Active)',
      allocatedProjects: ['আল কুদস টাওয়ার', 'বারাকাহ টাওয়ার ০১'],
      nomineeName: 'নাজমিন হাসান',
      nomineeRelation: 'স্ত্রী',
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
