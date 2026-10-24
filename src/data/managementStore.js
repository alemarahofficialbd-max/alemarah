import { supabase } from '../lib/supabaseClient';

const STORAGE_KEY = 'alemarah_management_store_v4';

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
      expenses: []
    }
  ],
  clients: [],
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
    }
  ],
  directors: [],
  inquiries: [],
  // Customer identity (phone + password + status) is canonical here.
  // A customer can own multiple units — see `clients`, each unit record
  // carries a `customerId` pointing back to this array.
  customers: []
};

// Build a stable customer id from a phone number so repeated migrations
// of the same phone always resolve to the same customer record.
const customerIdFromPhone = (phone) => {
  const digits = (phone || '').replace(/[^0-9]/g, '');
  return digits ? `CUS-${digits}` : `CUS-${Date.now().toString(36).toUpperCase()}`;
};

// Ensure every client/unit row has a customerId, and that a matching
// customer identity record exists in `customers`. Multiple unit rows
// sharing the same phone number collapse onto a single customer.
const migrateClientsToCustomers = (data) => {
  const clients = data.clients || [];
  const customers = data.customers ? [...data.customers] : [];
  const findCustomerByPhone = (phone) => {
    const digits = (phone || '').replace(/[^0-9]/g, '');
    return digits ? customers.find(c => (c.phone || '').replace(/[^0-9]/g, '') === digits) : null;
  };

  const migratedClients = clients.map(client => {
    if (client.customerId && customers.some(c => c.id === client.customerId)) {
      return client;
    }
    let customer = findCustomerByPhone(client.phone);
    if (!customer) {
      customer = {
        id: customerIdFromPhone(client.phone),
        name: client.name || '',
        phone: client.phone || '',
        password: client.password || 'password123',
        status: client.status || 'সক্রিয় (Active)',
        createdAt: client.createdAt || new Date().toISOString()
      };
      customers.push(customer);
    }
    return { ...client, customerId: customer.id };
  });

  return { ...data, clients: migratedClients, customers };
};

// All unit/purchase records belonging to one customer (phone-linked identity).
export const getCustomerUnits = (data, customerId) =>
  (data.clients || []).filter(c => c.customerId === customerId);

// Find a customer identity by phone or by any of their unit record ids.
export const findCustomerByIdentifier = (data, identifier) => {
  const cleanPhone = (identifier || '').replace(/[^0-9]/g, '');
  const trimmed = (identifier || '').trim().toLowerCase();
  return (data.customers || []).find(cust =>
    (cleanPhone && cust.phone && cust.phone.replace(/[^0-9]/g, '') === cleanPhone) ||
    (cust.id && cust.id.toLowerCase() === trimmed)
  ) || null;
};

// Load saved data or return default
export const getManagementData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      const canonicalDirs = initialManagementData.directors || [];
      if (!parsed.directors) {
        parsed.directors = [];
      } else {
        // Ensure canonical directors preserve existing edits and serial order
        parsed.directors = canonicalDirs.map(defaultDir => {
          const existing = parsed.directors.find(x => x.id === defaultDir.id);
          if (!existing) return defaultDir;
          const cleanedFolioNo = existing.folioNo ? existing.folioNo.replace(/^AEP-/, '') : defaultDir.folioNo;
          return {
            ...defaultDir,
            ...existing,
            name: existing.name || defaultDir.name,
            nameEn: existing.nameEn || defaultDir.nameEn,
            role: existing.role || defaultDir.role,
            roleEn: existing.roleEn || defaultDir.roleEn,
            image: existing.image || defaultDir.image,
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
      if (!parsed.inquiries) {
        parsed.inquiries = [];
      }
      if (!parsed.customers) {
        parsed.customers = [];
      }
      return migrateClientsToCustomers(parsed);
    }
  } catch (e) {
    console.error('Error loading management data from localStorage:', e);
  }
  return migrateClientsToCustomers(initialManagementData);
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
        budget: Number(p.budget) || 0,
        units: p.units || []
      }));
      await supabase.from('projects').upsert(projRows, { onConflict: 'id' });

      // 3b. Sync Project Expenses
      const allExpenses = [];
      data.projects.forEach(p => {
        if (p.expenses && p.expenses.length > 0) {
          p.expenses.forEach(exp => {
            allExpenses.push({
              id: exp.id,
              project_id: p.id,
              title: exp.title || '',
              amount: Number(exp.amount) || 0,
              date: exp.date || ''
            });
          });
        }
      });
      if (allExpenses.length > 0) {
        await supabase.from('project_expenses').upsert(allExpenses, { onConflict: 'id' });
      }
    }

    // 4. Sync Customers (login identity, shared across a customer's units)
    if (data.customers && data.customers.length > 0) {
      const customerRows = data.customers.map(cust => ({
        id: cust.id,
        name: cust.name || '',
        phone: cust.phone || '',
        password: cust.password || 'password123',
        status: cust.status || 'সক্রিয় (Active)'
      }));
      await supabase.from('customers').upsert(customerRows, { onConflict: 'id' });
    }

    // 4b. Sync Client Units & Payment History
    if (data.clients && data.clients.length > 0) {
      const clientRows = data.clients.map(c => ({
        id: c.id,
        customer_id: c.customerId || null,
        name: c.name,
        phone: c.phone || '',
        password: c.password || 'password123',
        project_id: c.projectId || null,
        project_name: c.projectName || '',
        flat_no: c.flatNo || '',
        total_price: Number(c.totalPrice) || 0,
        total_paid: Number(c.totalPaid) || 0,
        next_due_date: c.nextDueDate || '',
        next_due_amount: Number(c.nextDueAmount) || 0
      }));
      await supabase.from('clients').upsert(clientRows, { onConflict: 'id' });

      // 4c. Sync Payments
      const allPayments = [];
      data.clients.forEach(c => {
        if (c.paymentHistory && c.paymentHistory.length > 0) {
          c.paymentHistory.forEach(pay => {
            allPayments.push({
              id: pay.id,
              client_id: c.id,
              date: pay.date || '',
              amount: Number(pay.amount) || 0,
              method: pay.method || ''
            });
          });
        }
      });
      if (allPayments.length > 0) {
        await supabase.from('client_payments').upsert(allPayments, { onConflict: 'id' });
      }
    }
  } catch (err) {
    console.log('Supabase sync notice (offline or pending tables):', err?.message || err);
  }
};

// Background sync from Supabase
export const syncFromSupabase = async () => {
  try {
    const [adminsRes, directorsRes, projectsRes, clientsRes, inquiriesRes, customersRes] = await Promise.all([
      supabase.from('admins').select('*'),
      supabase.from('directors').select('*'),
      supabase.from('projects').select('*, expenses:project_expenses(*)'),
      supabase.from('clients').select('*, paymentHistory:client_payments(*)'),
      supabase.from('inquiries').select('*'),
      supabase.from('customers').select('*')
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
      const remoteDirs = directorsRes.data.map(d => {
        const localDir = (current.directors || []).find(x => x.id === d.id);
        return {
          id: d.id,
          name: d.name,
          nameEn: d.name_en,
          role: d.role,
          roleEn: d.role_en,
          folioNo: d.folio_no,
          image: d.image || localDir?.image || null,
          investment: Number(d.investment) || localDir?.investment || 0,
          sharePercentage: Number(d.share_percentage) || localDir?.sharePercentage || 0,
          dividendEarned: Number(d.dividend_earned) || localDir?.dividendEarned || 0,
          phone: d.phone || localDir?.phone || '',
          email: d.email || localDir?.email || '',
          accessKey: localDir?.accessKey || 'admin123',
          joiningDate: d.joining_date || localDir?.joiningDate || '',
          status: d.status || localDir?.status || 'সক্রিয় (Active)',
          nomineeName: d.nominee_name || localDir?.nomineeName || '',
          nomineeRelation: d.nominee_relation || localDir?.nomineeRelation || '',
          nomineePhone: d.nominee_phone || localDir?.nomineePhone || '',
          theme: d.theme || localDir?.theme || 'emerald',
          installments: localDir?.installments || [],
          dividendHistory: localDir?.dividendHistory || []
        };
      });
      // Retain any locally added directors that aren't yet in Supabase
      const extraLocalDirs = (current.directors || []).filter(ld => !directorsRes.data.some(d => d.id === ld.id));
      updated.directors = [...remoteDirs, ...extraLocalDirs];
    }

    if (projectsRes.data && projectsRes.data.length > 0) {
      const remoteProjects = projectsRes.data.map(p => {
        const localProj = (current.projects || []).find(x => x.id === p.id);
        const expensesFromRemote = (p.expenses || []).map(e => ({
          id: e.id,
          title: e.title,
          amount: Number(e.amount) || 0,
          date: e.date
        }));
        return {
          id: p.id,
          name: p.name,
          nameEn: p.name_en,
          location: p.location,
          progress: p.progress,
          currentStage: p.current_stage,
          budget: Number(p.budget) || 0,
          type: localProj?.type || 'residential',
          totalFloors: localProj?.totalFloors || 10,
          unitsPerFloor: localProj?.unitsPerFloor || 2,
          handoverDate: localProj?.handoverDate || 'ডিসেম্বর ২০২৮',
          units: (p.units && Array.isArray(p.units) && p.units.length > 0) ? p.units : (localProj?.units || []),
          expenses: expensesFromRemote.length > 0 ? expensesFromRemote : (localProj?.expenses || [])
        };
      });
      const extraLocalProjects = (current.projects || []).filter(lp => !projectsRes.data.some(p => p.id === lp.id));
      updated.projects = [...remoteProjects, ...extraLocalProjects];
    }

    if (clientsRes.data && clientsRes.data.length > 0) {
      const remoteClients = clientsRes.data.map(c => {
        const localClient = (current.clients || []).find(x => x.id === c.id);
        const paymentsFromRemote = (c.paymentHistory || []).map(pay => ({
          id: pay.id,
          date: pay.date,
          amount: Number(pay.amount) || 0,
          method: pay.method
        }));
        return {
          id: c.id,
          customerId: c.customer_id || localClient?.customerId,
          name: c.name,
          phone: c.phone,
          password: c.password || localClient?.password || 'password123',
          projectId: c.project_id || localClient?.projectId,
          projectName: c.project_name || localClient?.projectName,
          flatNo: c.flat_no || localClient?.flatNo,
          totalPrice: Number(c.total_price) || 0,
          totalPaid: Number(c.total_paid) || 0,
          nextDueDate: c.next_due_date || localClient?.nextDueDate,
          nextDueAmount: Number(c.next_due_amount) || 0,
          paymentHistory: paymentsFromRemote.length > 0 ? paymentsFromRemote : (localClient?.paymentHistory || [])
        };
      });
      // Retain any locally added clients that aren't yet in Supabase
      const extraLocalClients = (current.clients || []).filter(lc => !clientsRes.data.some(c => c.id === lc.id));
      updated.clients = [...remoteClients, ...extraLocalClients];
    }

    if (customersRes && customersRes.data && customersRes.data.length > 0) {
      const remoteCustomers = customersRes.data.map(cust => ({
        id: cust.id,
        name: cust.name,
        phone: cust.phone,
        password: cust.password,
        status: cust.status
      }));
      const extraLocalCustomers = (current.customers || []).filter(lc => !customersRes.data.some(c => c.id === lc.id));
      updated.customers = [...remoteCustomers, ...extraLocalCustomers];
    }

    if (inquiriesRes && inquiriesRes.data && inquiriesRes.data.length > 0) {
      const remoteInquiries = inquiriesRes.data.map(inq => ({
        id: inq.id,
        type: inq.type,
        name: inq.name,
        phone: inq.phone,
        email: inq.email,
        message: inq.message,
        projectName: inq.project_name,
        investmentAmount: inq.investment_amount,
        status: inq.status || 'নতুন ইনকোয়ারি',
        date: inq.created_at ? new Date(inq.created_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : (inq.date || '')
      }));
      const extraLocalInquiries = (current.inquiries || []).filter(li => !inquiriesRes.data.some(r => r.id === li.id));
      updated.inquiries = [...remoteInquiries, ...extraLocalInquiries];
    }

    const migrated = migrateClientsToCustomers(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    window.dispatchEvent(new CustomEvent('alemarah_store_updated', { detail: migrated }));
  } catch (err) {
    console.log('Supabase sync notice:', err);
  }
};

// Save customer or investor inquiries from the public website
export const saveInquiry = (inquiry) => {
  try {
    const current = getManagementData();
    const newInquiry = {
      id: `INQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      timestamp: new Date().toISOString(),
      status: 'নতুন (New)',
      ...inquiry
    };
    const updated = {
      ...current,
      inquiries: [newInquiry, ...(current.inquiries || [])]
    };
    saveManagementData(updated);
    return newInquiry;
  } catch (e) {
    console.error('Error saving inquiry:', e);
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

// Atomic state updater universally available
export const updateStore = (updater) => {
  const current = getManagementData();
  const nextData = typeof updater === 'function' ? updater(current) : updater;
  saveManagementData(nextData);
  return nextData;
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
