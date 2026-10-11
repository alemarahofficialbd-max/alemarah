import { supabase } from '../lib/supabaseClient';

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
      type: 'residential', // 'residential' | 'share' | 'commercial'
      totalFloors: 10,
      unitsPerFloor: 2,
      units: [
        '৭ম তলা, ফ্ল্যাট ৭-এ (১২৬৫ বর্গফুট)',
        '৭ম তলা, ফ্ল্যাট ৭-বি (১২৬৫ বর্গফুট)',
        '৬ষ্ঠ তলা, ফ্ল্যাট ৬-এ (১২৬৫ বর্গফুট)',
        '৬ষ্ঠ তলা, ফ্ল্যাট ৬-বি (১২৬৫ বর্গফুট)',
        '৫ম তলা, ফ্ল্যাট ৫-এ (১২৬৫ বর্গফুট)',
        '৫ম তলা, ফ্ল্যাট ৫-বি (১২৬৫ বর্গফুট)',
        '৪র্থ তলা, ফ্ল্যাট ৪-এ (১২৬৫ বর্গফুট)',
        '৪র্থ তলা, ফ্ল্যাট ৪-বি (১২৬৫ বর্গফুট)',
        '৩য় তলা, ফ্ল্যাট ৩-এ (১২৬৫ বর্গফুট)',
        '৩য় তলা, ফ্ল্যাট ৩-বি (১২৬৫ বর্গফুট)',
        '২য় তলা, ফ্ল্যাট ২-এ (১২৬৫ বর্গফুট)',
        '২য় তলা, ফ্ল্যাট ২-বি (১২৬৫ বর্গফুট)'
      ],
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
      type: 'residential',
      totalFloors: 9,
      unitsPerFloor: 2,
      units: [
        '৮ম তলা, ইউনিট ৮-এ (১৪৫০ বর্গফুট)',
        '৮ম তলা, ইউনিট ৮-বি (১৪৫০ বর্গফুট)',
        '৭ম তলা, ইউনিট ৭-এ (১৪৫০ বর্গফুট)',
        '৭ম তলা, ইউনিট ৭-বি (১৪৫০ বর্গফুট)',
        '৬ষ্ঠ তলা, ইউনিট ৬-এ (১৪৫০ বর্গফুট)',
        '৬ষ্ঠ তলা, ইউনিট ৬-বি (১৪৫০ বর্গফুট)',
        '৫ম তলা, ইউনিট ৫-এ (১৪৫০ বর্গফুট)',
        '৫ম তলা, ইউনিট ৫-বি (১৪৫০ বর্গফুট)',
        '৪র্থ তলা, ইউনিট ৪-এ (১৪৫০ বর্গফুট)',
        '৪র্থ তলা, ইউনিট ৪-বি (১৪৫০ বর্গফুট)',
        '৩য় তলা, ইউনিট ৩-এ (১৪৫০ বর্গফুট)',
        '৩য় তলা, ইউনিট ৩-বি (১৪৫০ বর্গফুট)',
        '২য় তলা, ইউনিট ২-এ (১৪৫০ বর্গফুট)',
        '২য় তলা, ইউনিট ২-বি (১৪৫০ বর্গফুট)'
      ],
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
      type: 'commercial_share',
      totalFloors: 6,
      unitsPerFloor: 10,
      units: [
        'গ্রাউন্ড ফ্লোর, দোকান নং জি-০১ (১৮০ বর্গফুট)',
        'গ্রাউন্ড ফ্লোর, দোকান নং জি-০২ (১৮০ বর্গফুট)',
        'গ্রাউন্ড ফ্লোর, দোকান নং জি-০৩ (১৮০ বর্গফুট)',
        '১ম তলা, দোকান নং ১০১ (২২০ বর্গফুট)',
        '১ম তলা, দোকান নং ১০২ (২২০ বর্গফুট)',
        '২য় তলা, ফুডকোর্ট স্পেস এফ-০১ (৩০০ বর্গফুট)',
        '৩য় তলা, কর্পোরেট অফিস স্যুট ও-০১ (৪৫০ বর্গফুট)',
        'বাণিজ্যিক পার্টনারশিপ শেয়ার অংশ ০১ (১% ইকুইটি)',
        'বাণিজ্যিক পার্টনারশিপ শেয়ার অংশ ০২ (১% ইকুইটি)'
      ],
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
      name: 'শেখ ফজলুল করীম মারুফ',
      nameEn: 'Sheikh Fazlul Karim Maroof',
      role: 'চেয়ারম্যান',
      roleEn: 'Chairman',
      folioNo: 'DIR-001',
      image: '/images/chairman.webp',
      investment: 25000000, // ৳ ২,৫০,০০,০০০
      sharePercentage: 35, // 35%
      dividendEarned: 3650000, // ৳ ৩৬,৫০,০০০
      phone: '01816233013',
      email: 'chairman@alemarahproperties.com',
      accessKey: 'admin123',
      joiningDate: '১ জানুয়ারি, ২০২৪',
      status: 'সক্রিয় (Active)',
      nomineeName: 'আইনানুগ উত্তরসূরি',
      nomineeRelation: 'পরিবার',
      nomineePhone: '01816-233013',
      theme: 'crimson',
      installments: [
        { id: 'INS-01', date: '১৫ জানুয়ারি, ২০২৪', amount: 10000000, method: 'ব্যাংক স্থানান্তর (সিটি ব্যাংক)', receiptNo: 'RCPT-CAP-101', note: 'প্রাথমিক ইকুইটি মূলধন জমা' },
        { id: 'INS-02', date: '১০ এপ্রিল, ২০২৪', amount: 8000000, method: 'পে-অর্ডার (ইসলামী ব্যাংক)', receiptNo: 'RCPT-CAP-102', note: '২য় কিস্তির পরিশোধিত ক্যাপিটাল' },
        { id: 'INS-03', date: '০৫ অক্টোবর, ২০২৪', amount: 7000000, method: 'ব্যাংক চেক (প্রাইম ব্যাংক)', receiptNo: 'RCPT-CAP-103', note: '৩য় কিস্তি (চূড়ান্ত পরিশোধিত মূলধন)' }
      ],
      dividendHistory: [
        { id: 'DIV-01', date: '৩০ জুন, ২০২৪', amount: 1650000, method: 'ব্যাংক অ্যাকাউন্ট ট্রান্সফার', voucherNo: 'VCH-DIV-201', note: 'অর্ধবার্ষিক মুনাফা বণ্টন (H1 ২০২৪)' },
        { id: 'DIV-02', date: '৩১ ডিসেম্বর, ২০২৪', amount: 2000000, method: 'ব্যাংক অ্যাকাউন্ট ট্রান্সফার', voucherNo: 'VCH-DIV-202', note: 'বার্ষিক ডিভিডেন্ড প্রদান (FY ২০২৪)' }
      ]
    },
    {
      id: 'DIR-02',
      name: 'তালুকদার তারিক মাসউদ',
      nameEn: 'Talukdar Tariq Masud',
      role: 'ব্যবস্থাপনা পরিচালক',
      roleEn: 'Managing Director',
      folioNo: 'DIR-002',
      image: '/images/managing_director.webp',
      investment: 20000000, // ৳ ২,০০,০০,০০০
      sharePercentage: 30, // 30%
      dividendEarned: 2920000, // ৳ ২৯,২০,০০০
      phone: '01918646575',
      email: 'md@alemarahproperties.com',
      accessKey: 'admin123',
      joiningDate: '১ জানুয়ারি, ২০২৪',
      status: 'সক্রিয় (Active)',
      nomineeName: 'আইনানুগ উত্তরসূরি',
      nomineeRelation: 'পরিবার',
      nomineePhone: '01918-646575',
      theme: 'emerald',
      installments: [
        { id: 'INS-201', date: '২০ জানুয়ারি, ২০২৪', amount: 10000000, method: 'ব্যাংক ট্রান্সফার (উত্তরা ব্যাংক)', receiptNo: 'RCPT-CAP-201', note: '১ম কিস্তি প্রারম্ভিক শেয়ার মূলধন' },
        { id: 'INS-202', date: '১৫ মে, ২০২৪', amount: 10000000, method: 'পে-অর্ডার (পূবালী ব্যাংক)', receiptNo: 'RCPT-CAP-202', note: '২য় কিস্তি (সম্পূর্ণ পরিশোধিত)' }
      ],
      dividendHistory: [
        { id: 'DIV-101', date: '৩০ জুন, ২০২৪', amount: 1320000, method: 'ব্যাংক ট্রান্সফার', voucherNo: 'VCH-DIV-203', note: 'অর্ধবার্ষিক মুনাফা বণ্টন' },
        { id: 'DIV-102', date: '৩১ ডিসেম্বর, ২০২৪', amount: 1600000, method: 'ব্যাংক ট্রান্সফার', voucherNo: 'VCH-DIV-204', note: 'বার্ষিক ডিভিডেন্ড ক্লিয়ারেন্স' }
      ]
    },
    {
      id: 'DIR-03',
      name: 'আলহাজ্ব মাওলানা নূর হোসাইন',
      nameEn: 'Alhaj Mawlana Nur Hossain',
      role: 'পরিচালক',
      roleEn: 'Director',
      folioNo: 'DIR-003',
      image: '/images/alhaj_mawlana_nur_hossain.jpg',
      investment: 10000000, // ৳ ১,০০,০০,০০০
      sharePercentage: 15, // 15%
      dividendEarned: 1460000, // ৳ ১৪,৬০,০০০
      phone: '01743926926',
      email: 'nur.hossain@alemarahproperties.com',
      accessKey: 'admin123',
      joiningDate: '১৫ মার্চ, ২০২৪',
      status: 'সক্রিয় (Active)',
      nomineeName: 'আইনানুগ উত্তরসূরি',
      nomineeRelation: 'পরিবার',
      nomineePhone: '01743-926926',
      theme: 'blue',
      installments: [
        { id: 'INS-301', date: '১৫ মার্চ, ২০২৪', amount: 5000000, method: 'চেক ডিপোজিট', receiptNo: 'RCPT-CAP-301', note: '১ম কিস্তি মূলধন' },
        { id: 'INS-302', date: '১ আগস্ট, ২০২৪', amount: 5000000, method: 'ব্যাংক ট্রান্সফার', receiptNo: 'RCPT-CAP-302', note: '২য় কিস্তি মূলধন' }
      ],
      dividendHistory: [
        { id: 'DIV-301', date: '৩১ ডিসেম্বর, ২০২৪', amount: 1460000, method: 'ব্যাংক অ্যাকাউন্ট ট্রান্সফার', voucherNo: 'VCH-DIV-301', note: 'বার্ষিক শেয়ার লভ্যাংশ' }
      ]
    },
    {
      id: 'DIR-04',
      name: 'তানিম মাহফুজ',
      nameEn: 'Tanim Mahfuj',
      role: 'পরিচালক',
      roleEn: 'Director',
      folioNo: 'DIR-004',
      image: '/images/taneem_mahfuj.jpg',
      investment: 7500000, // ৳ ৭৫,০০,০০০
      sharePercentage: 10, // 10%
      dividendEarned: 1095000, // ৳ ১০,৯৫,০০০
      phone: '01914425073',
      email: 'tanim.mahfuj@alemarahproperties.com',
      accessKey: 'admin123',
      joiningDate: '১০ মে, ২০২৪',
      status: 'সক্রিয় (Active)',
      nomineeName: 'আইনানুগ উত্তরসূরি',
      nomineeRelation: 'পরিবার',
      nomineePhone: '01914-425073',
      theme: 'amber',
      installments: [
        { id: 'INS-401', date: '১০ মে, ২০২৪', amount: 4000000, method: 'পে-অর্ডার', receiptNo: 'RCPT-CAP-401', note: '১ম কিস্তি' },
        { id: 'INS-402', date: '২০ সেপ্টেম্বর, ২০২৪', amount: 3500000, method: 'ব্যাংক চেক', receiptNo: 'RCPT-CAP-402', note: '২য় কিস্তি' }
      ],
      dividendHistory: [
        { id: 'DIV-401', date: '৩১ ডিসেম্বর, ২০২৪', amount: 1095000, method: 'ব্যাংক অ্যাকাউন্ট ট্রান্সফার', voucherNo: 'VCH-DIV-401', note: 'বার্ষিক শেয়ার লভ্যাংশ' }
      ]
    },
    {
      id: 'DIR-05',
      name: 'আল আমিন হাওলাদার',
      nameEn: 'Al Amin Hawladar',
      role: 'পরিচালক',
      roleEn: 'Director',
      folioNo: 'DIR-005',
      image: '/images/al_amin_hawladar.jpg',
      investment: 7500000, // ৳ ৭৫,০০,০০০
      sharePercentage: 10, // 10%
      dividendEarned: 1095000, // ৳ ১০,৯৫,০০০
      phone: '01833544548',
      email: 'alamin.hawladar@alemarahproperties.com',
      accessKey: 'admin123',
      joiningDate: '১ জুলাই, ২০২৪',
      status: 'সক্রিয় (Active)',
      nomineeName: 'আইনানুগ উত্তরসূরি',
      nomineeRelation: 'পরিবার',
      nomineePhone: '01833-544548',
      theme: 'purple',
      installments: [
        { id: 'INS-501', date: '১ জুলাই, ২০২৪', amount: 7500000, method: 'ব্যাংক ট্রান্সফার', receiptNo: 'RCPT-CAP-501', note: 'এককালীন পরিশোধিত মূলধন' }
      ],
      dividendHistory: [
        { id: 'DIV-501', date: '৩১ ডিসেম্বর, ২০২৪', amount: 1095000, method: 'ব্যাংক অ্যাকাউন্ট ট্রান্সফার', voucherNo: 'VCH-DIV-501', note: 'বার্ষিক শেয়ার লভ্যাংশ' }
      ]
    }
  ]
};

// Load saved data or return default
export const getManagementData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      const canonicalDirs = initialManagementData.directors;
      if (!parsed.directors || parsed.directors.length === 0) {
        parsed.directors = canonicalDirs;
      } else {
        // Ensure the 5 canonical directors are preserved in the exact 1-5 serial order
        parsed.directors = canonicalDirs.map(defaultDir => {
          const existing = parsed.directors.find(x => x.id === defaultDir.id);
          if (!existing) return defaultDir;
          const cleanedFolioNo = existing.folioNo ? existing.folioNo.replace(/^AEP-/, '') : defaultDir.folioNo;
          return {
            ...defaultDir,
            ...existing,
            name: defaultDir.name,
            nameEn: defaultDir.nameEn,
            role: defaultDir.role,
            roleEn: defaultDir.roleEn,
            image: defaultDir.image,
            folioNo: cleanedFolioNo,
            accessKey: existing.accessKey || defaultDir.accessKey || 'admin123',
            installments: existing.installments && existing.installments.length > 0 
              ? existing.installments 
              : defaultDir.installments,
            dividendHistory: existing.dividendHistory && existing.dividendHistory.length > 0
              ? existing.dividendHistory
              : defaultDir.dividendHistory
          };
        }).concat(
          parsed.directors.filter(d => !canonicalDirs.some(c => c.id === d.id))
        );
      }
      if (!parsed.projects || parsed.projects.length === 0) {
        parsed.projects = initialManagementData.projects;
      } else {
        parsed.projects = parsed.projects.map(p => {
          const initP = initialManagementData.projects.find(x => x.id === p.id);
          return {
            ...p,
            type: p.type || initP?.type || 'residential',
            totalFloors: p.totalFloors || initP?.totalFloors || 10,
            unitsPerFloor: p.unitsPerFloor || initP?.unitsPerFloor || 2,
            units: p.units && p.units.length > 0 ? p.units : (initP?.units || [
              '২য় তলা, ফ্ল্যাট ২-এ', '২য় তলা, ফ্ল্যাট ২-বি',
              '৩য় তলা, ফ্ল্যাট ৩-এ', '৩য় তলা, ফ্ল্যাট ৩-বি',
              '৪র্থ তলা, ফ্ল্যাট ৪-এ', '৪র্থ তলা, ফ্ল্যাট ৪-বি',
              '৫ম তলা, ফ্ল্যাট ৫-এ', '৫ম তলা, ফ্ল্যাট ৫-বি'
            ])
          };
        });
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

// Background async sync to Supabase
export const syncToSupabase = async (data) => {
  try {
    if (!data) return;

    // 1. Sync Directors
    if (data.directors && data.directors.length > 0) {
      const dirRows = data.directors.map(d => ({
        id: d.id,
        name: d.name,
        name_en: d.nameEn || '',
        role: d.role,
        role_en: d.roleEn || '',
        folio_no: d.folioNo,
        image: d.image || null,
        investment: Number(d.investment) || 0,
        share_percentage: Number(d.sharePercentage) || 0,
        dividend_earned: Number(d.dividendEarned) || 0,
        phone: d.phone || '',
        email: d.email || '',
        joining_date: d.joiningDate || '',
        status: d.status || 'সক্রিয় (Active)',
        nominee_name: d.nomineeName || '',
        nominee_relation: d.nomineeRelation || '',
        nominee_phone: d.nomineePhone || '',
        theme: d.theme || 'emerald'
      }));
      await supabase.from('directors').upsert(dirRows, { onConflict: 'id' });
    }

    // 2. Sync Admins & Team
    if (data.managementTeam && data.managementTeam.length > 0) {
      const adminRows = data.managementTeam.map(a => ({
        id: a.id,
        name: a.name,
        name_en: a.nameEn || '',
        email: a.email || '',
        phone: a.phone || '',
        role: a.role || '',
        role_type: a.roleType || 'officer',
        access_key: a.accessKey || 'admin123',
        is_super_admin: Boolean(a.isSuperAdmin),
        permissions: a.permissions || ['all'],
        status: a.status || 'সক্রিয় (Active)'
      }));
      await supabase.from('admins').upsert(adminRows, { onConflict: 'id' });
    }

    // 3. Sync Projects
    if (data.projects && data.projects.length > 0) {
      const projRows = data.projects.map(p => ({
        id: p.id,
        name: p.name,
        name_en: p.nameEn || '',
        location: p.location || '',
        progress: Number(p.progress) || 0,
        current_stage: p.currentStage || '',
        budget: Number(p.budget) || 0
      }));
      await supabase.from('projects').upsert(projRows, { onConflict: 'id' });
    }
  } catch (err) {
    console.log('Supabase sync notice (offline or pending tables):', err?.message || err);
  }
};

// Background sync from Supabase
export const syncFromSupabase = async () => {
  try {
    const [adminsRes, directorsRes, projectsRes, clientsRes] = await Promise.all([
      supabase.from('admins').select('*'),
      supabase.from('directors').select('*'),
      supabase.from('projects').select('*, expenses:project_expenses(*)'),
      supabase.from('clients').select('*, paymentHistory:client_payments(*)')
    ]);

    // If tables do not exist yet, return gracefully
    if (adminsRes.error && directorsRes.error) {
      return;
    }

    const current = getManagementData();
    const updated = { ...current };

    if (adminsRes.data && adminsRes.data.length > 0) {
      const superAdminRow = adminsRes.data.find(a => a.is_super_admin || a.email === 'alemarah.officialbd@gmail.com');
      if (superAdminRow) {
        updated.superAdmin = {
          id: superAdminRow.id,
          name: superAdminRow.name,
          nameEn: superAdminRow.name_en,
          email: superAdminRow.email,
          phone: superAdminRow.phone,
          role: superAdminRow.role,
          roleType: superAdminRow.role_type,
          accessKey: superAdminRow.access_key,
          isSuperAdmin: true,
          permissions: superAdminRow.permissions || ['all'],
          status: superAdminRow.status
        };
      }
      updated.managementTeam = adminsRes.data.map(a => ({
        id: a.id,
        name: a.name,
        nameEn: a.name_en,
        email: a.email,
        phone: a.phone,
        role: a.role,
        roleType: a.role_type,
        accessKey: a.access_key,
        isSuperAdmin: Boolean(a.is_super_admin),
        permissions: a.permissions || ['projects', 'expenses'],
        status: a.status
      }));
    }

    if (directorsRes.data && directorsRes.data.length > 0) {
      updated.directors = directorsRes.data.map(d => ({
        id: d.id,
        name: d.name,
        nameEn: d.name_en,
        role: d.role,
        roleEn: d.role_en,
        folioNo: d.folio_no,
        image: d.image,
        investment: Number(d.investment) || 0,
        sharePercentage: Number(d.share_percentage) || 0,
        dividendEarned: Number(d.dividend_earned) || 0,
        phone: d.phone,
        email: d.email,
        joiningDate: d.joining_date,
        status: d.status,
        nomineeName: d.nominee_name,
        nomineeRelation: d.nominee_relation,
        nomineePhone: d.nominee_phone,
        theme: d.theme
      }));
    }

    if (projectsRes.data && projectsRes.data.length > 0) {
      updated.projects = projectsRes.data.map(p => ({
        id: p.id,
        name: p.name,
        nameEn: p.name_en,
        location: p.location,
        progress: p.progress,
        currentStage: p.current_stage,
        budget: Number(p.budget) || 0,
        expenses: (p.expenses || []).map(e => ({
          id: e.id,
          title: e.title,
          amount: Number(e.amount) || 0,
          date: e.date
        }))
      }));
    }

    if (clientsRes.data && clientsRes.data.length > 0) {
      updated.clients = clientsRes.data.map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        password: c.password,
        projectId: c.project_id,
        projectName: c.project_name,
        flatNo: c.flat_no,
        totalPrice: Number(c.total_price) || 0,
        totalPaid: Number(c.total_paid) || 0,
        nextDueDate: c.next_due_date,
        nextDueAmount: Number(c.next_due_amount) || 0,
        paymentHistory: (c.paymentHistory || []).map(pay => ({
          id: pay.id,
          date: pay.date,
          amount: Number(pay.amount) || 0,
          method: pay.method
        }))
      }));
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('alemarah_store_updated', { detail: updated }));
  } catch (err) {
    console.log('Supabase sync notice:', err);
  }
};

// Auto sync on app load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    syncFromSupabase();
  }, 1200);
}

// Save data to localStorage and sync to Supabase
export const saveManagementData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('alemarah_store_updated', { detail: data }));
    
    // Background cloud sync
    syncToSupabase(data);
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
