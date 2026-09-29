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
  ]
};

// Load saved data or return default
export const getManagementData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
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
  } catch (e) {
    console.error('Error saving management data to localStorage:', e);
  }
};

// Currency formatter utility
export const formatBDT = (num) => {
  if (num === undefined || num === null) return '৳ ০';
  const val = Number(num) || 0;
  return '৳ ' + val.toLocaleString('bn-BD');
};
