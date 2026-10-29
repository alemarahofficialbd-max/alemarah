import { supabase } from '../lib/supabaseClient';

const STORAGE_KEY = 'alemarah_management_store_v5';

// -------------------------------------------------------------
// Password hashing (Web Crypto PBKDF2-SHA256) — runs entirely in the
// browser since this app has no backend server of its own. Stored as
// "pbkdf2$<iterations>$<saltHex>$<hashHex>" so the format is
// self-describing; a value that doesn't match this shape is treated as
// a legacy plaintext password and verified by direct comparison, then
// upgraded to a hash the next time it's used (see verifyPassword).
// -------------------------------------------------------------
const PBKDF2_ITERATIONS = 100000;

const bufToHex = (buf) => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
const hexToBuf = (hex) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
};

const deriveBits = async (plainText, salt, iterations) => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(plainText), { name: 'PBKDF2' }, false, ['deriveBits']
  );
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    256
  );
};

export const isHashedPassword = (value) => typeof value === 'string' && value.startsWith('pbkdf2$');

export const hashPassword = async (plainText) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const bits = await deriveBits(plainText, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${bufToHex(salt)}$${bufToHex(bits)}`;
};

// Returns true/false. If `stored` is legacy plaintext and it matches,
// the caller should persist a fresh hash via hashPassword + its own save.
export const verifyPassword = async (plainText, stored) => {
  if (!stored) return false;
  if (!isHashedPassword(stored)) {
    return plainText === stored;
  }
  const [, iterStr, saltHex, hashHex] = stored.split('$');
  const bits = await deriveBits(plainText, hexToBuf(saltHex), Number(iterStr));
  return bufToHex(bits) === hashHex;
};

export const initialManagementData = {
  projects: [],
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
  customers: [],
  investmentOffers: [],
  investors: [],
  jobApplications: []
};

// Build a stable customer id from a phone number so repeated migrations
// of the same phone always resolve to the same customer record.
export const customerIdFromPhone = (phone) => {
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
      if (!parsed.jobApplications) {
        parsed.jobApplications = [];
      }
      if (!parsed.investmentOffers) {
        parsed.investmentOffers = [];
      }
      if (!parsed.investors) {
        parsed.investors = [];
      }
      return migrateClientsToCustomers(parsed);
    }
  } catch (e) {
    console.error('Error loading management data from localStorage:', e);
  }
  return migrateClientsToCustomers(initialManagementData);
};

// Sync job applications to Supabase Cloud Central Storage
export const syncJobApplicationsToSupabase = async (jobApplications) => {
  try {
    if (!jobApplications || !Array.isArray(jobApplications)) return;
    await supabase.from('admins').upsert({
      id: 'JOB-APPLICATIONS-STORE',
      name: 'Career Applications Central Store',
      email: 'career-store@alemarahproperties.com',
      phone: '01816233013',
      role: 'system_storage',
      role_type: 'system_storage',
      access_key: 'system_storage',
      is_super_admin: false,
      permissions: jobApplications,
      status: 'সক্রিয়'
    }, { onConflict: 'id' });
  } catch (err) {
    console.error('Error syncing job applications to Supabase cloud:', err);
  }
};

// Fetch job applications directly from Supabase Cloud
export const fetchJobApplicationsFromSupabase = async () => {
  try {
    const { data, error } = await supabase.from('admins').select('permissions').eq('id', 'JOB-APPLICATIONS-STORE').single();
    if (data && Array.isArray(data.permissions)) {
      return data.permissions;
    }
  } catch (err) {
    console.log('Notice fetching job applications:', err);
  }
  return [];
};

// Background async sync to Supabase
export const syncToSupabase = async (data) => {
  const failedTables = [];
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
      const { error: dirErr } = await supabase.from('directors').upsert(dirRows, { onConflict: 'id' });
      if (dirErr) { console.error('Cloud sync failed: directors', dirErr); failedTables.push('directors'); }
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
      const { error: adminErr } = await supabase.from('admins').upsert(adminRows, { onConflict: 'id' });
      if (adminErr) { console.error('Cloud sync failed: admins', adminErr); failedTables.push('admins'); }
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
        price_per_sqft: Number(p.pricePerSqft) || 0,
        pricing_mode: p.pricingMode || 'both',
        units: p.units || []
      }));
      const { error: projErr } = await supabase.from('projects').upsert(projRows, { onConflict: 'id' });
      if (projErr) { console.error('Cloud sync failed: projects', projErr); failedTables.push('projects'); }

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
        const { error: expErr } = await supabase.from('project_expenses').upsert(allExpenses, { onConflict: 'id' });
        if (expErr) { console.error('Cloud sync failed: project_expenses', expErr); failedTables.push('project_expenses'); }
      }
    }

    // 4. Sync Customers (login identity - saved locally and via clients table)

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
        next_due_amount: Number(c.nextDueAmount) || 0,
        pricing_mode: c.pricingMode || 'package',
        land_price: Number(c.landPrice) || 0,
        construction_price: Number(c.constructionPrice) || 0,
        size_sqft: Number(c.sizeSqft) || 0
      }));
      const { error: clientErr } = await supabase.from('clients').upsert(clientRows, { onConflict: 'id' });
      if (clientErr) { console.error('Cloud sync failed: clients', clientErr); failedTables.push('clients'); }

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
        const { error: payErr } = await supabase.from('client_payments').upsert(allPayments, { onConflict: 'id' });
        if (payErr) { console.error('Cloud sync failed: client_payments', payErr); failedTables.push('client_payments'); }
      }
    }

    // 5. Cloud Sync Job Applications
    if (data.jobApplications && Array.isArray(data.jobApplications)) {
      await syncJobApplicationsToSupabase(data.jobApplications);
    }

    // 6. Sync Investment Offers (e.g. Agro) & Investors
    if (data.investmentOffers && data.investmentOffers.length > 0) {
      const offerRows = data.investmentOffers.map(o => ({
        id: o.id,
        name: o.name,
        location: o.location || '',
        description: o.description || '',
        min_investment: Number(o.minInvestment) || 0,
        max_investment: Number(o.maxInvestment) || 0,
        tenure_years: Number(o.tenureYears) || 0,
        net_profit_percent: Number(o.netProfitPercent) || 0,
        director_tier_min_investment: Number(o.directorTierMinInvestment) || 0,
        director_tier_recurring: Boolean(o.directorTierRecurring)
      }));
      const { error: offerErr } = await supabase.from('investment_offers').upsert(offerRows, { onConflict: 'id' });
      if (offerErr) { console.error('Cloud sync failed: investment_offers', offerErr); failedTables.push('investment_offers'); }
    }
    if (data.investors && data.investors.length > 0) {
      const investorRows = data.investors.map(inv => ({
        id: inv.id,
        name: inv.name,
        phone: inv.phone || '',
        offer_id: inv.offerId,
        tier: inv.tier || 'general',
        invested_amount: Number(inv.investedAmount) || 0,
        investment_date: inv.investmentDate || '',
        cycle_end_date: inv.cycleEndDate || '',
        status: inv.status || 'সক্রিয় (Active)',
        total_paid: Number(inv.totalPaid) || 0,
        payout_history: inv.payoutHistory || [],
        address: inv.address || '',
        nominee_name: inv.nomineeName || '',
        nominee_relation: inv.nomineeRelation || '',
        nominee_phone: inv.nomineePhone || ''
      }));
      const { error: investorErr } = await supabase.from('investors').upsert(investorRows, { onConflict: 'id' });
      if (investorErr) { console.error('Cloud sync failed: investors', investorErr); failedTables.push('investors'); }
    }

    // 7. Sync Customer identities (phone+password shared across their units)
    if (data.customers && data.customers.length > 0) {
      const customerRows = data.customers.map(cust => ({
        id: cust.id,
        name: cust.name || '',
        phone: cust.phone || '',
        password: cust.password || 'password123',
        status: cust.status || 'সক্রিয় (Active)'
      }));
      const { error: custErr } = await supabase.from('customers').upsert(customerRows, { onConflict: 'id' });
      if (custErr) { console.error('Cloud sync failed: customers', custErr); failedTables.push('customers'); }
    }

    // 8. Sync public-site inquiries/leads
    if (data.inquiries && data.inquiries.length > 0) {
      const inquiryRows = data.inquiries.map(inq => ({
        id: inq.id,
        name: inq.name || '',
        phone: inq.phone || '',
        email: inq.email || '',
        project_id: inq.projectId || null,
        inquiry_type: inq.type || inq.inquiryType || 'site_visit',
        investment_amount: inq.investmentAmount || '',
        interested_sector: inq.interestedSector || '',
        message: inq.message || '',
        status: inq.status || 'নতুন (New)'
      }));
      const { error: inqErr } = await supabase.from('inquiries').upsert(inquiryRows, { onConflict: 'id' });
      if (inqErr) { console.error('Cloud sync failed: inquiries', inqErr); failedTables.push('inquiries'); }
    }

    if (failedTables.length > 0 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('alemarah_sync_failed', { detail: { tables: failedTables } }));
    }
  } catch (err) {
    console.log('Supabase sync notice (offline or pending tables):', err?.message || err);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('alemarah_sync_failed', { detail: { tables: ['unknown'], error: err?.message || String(err) } }));
    }
  }
};

// Background sync from Supabase
export const syncFromSupabase = async () => {
  try {
    const [adminsRes, directorsRes, projectsRes, clientsRes, customersRes, inquiriesRes, offersRes, investorsRes] = await Promise.all([
      supabase.from('admins').select('*'),
      supabase.from('directors').select('*'),
      supabase.from('projects').select('*, expenses:project_expenses(*)'),
      supabase.from('clients').select('*, paymentHistory:client_payments(*)'),
      supabase.from('customers').select('*'),
      supabase.from('inquiries').select('*'),
      supabase.from('investment_offers').select('*'),
      supabase.from('investors').select('*')
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
      // Filter out system storage from management team display
      updated.managementTeam = adminsRes.data
        .filter(a => a.id !== 'JOB-APPLICATIONS-STORE')
        .map(a => ({
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

      // Cloud Sync: Retrieve authoritative job applications from Supabase Cloud
      const jobStoreRow = adminsRes.data.find(a => a.id === 'JOB-APPLICATIONS-STORE');
      if (jobStoreRow && Array.isArray(jobStoreRow.permissions)) {
        updated.jobApplications = jobStoreRow.permissions;
      }
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

    if (projectsRes.data) {
      updated.projects = projectsRes.data.map(p => {
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
          pricePerSqft: Number(p.price_per_sqft) || localProj?.pricePerSqft || 0,
          pricingMode: p.pricing_mode || localProj?.pricingMode || 'both',
          units: (p.units && p.units.length > 0) ? p.units : (localProj?.units || []),
          expenses: expensesFromRemote.length > 0 ? expensesFromRemote : (localProj?.expenses || [])
        };
      });
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
          pricingMode: c.pricing_mode || localClient?.pricingMode || 'package',
          landPrice: Number(c.land_price) || localClient?.landPrice || 0,
          constructionPrice: Number(c.construction_price) || localClient?.constructionPrice || 0,
          sizeSqft: Number(c.size_sqft) || localClient?.sizeSqft || 0,
          paymentHistory: paymentsFromRemote.length > 0 ? paymentsFromRemote : (localClient?.paymentHistory || [])
        };
      });
      // Retain any locally added clients that aren't yet in Supabase
      const extraLocalClients = (current.clients || []).filter(lc => !clientsRes.data.some(c => c.id === lc.id));
      updated.clients = [...remoteClients, ...extraLocalClients];
    }

    if (customersRes?.data && customersRes.data.length > 0) {
      const remoteCustomers = customersRes.data.map(cust => {
        const localCust = (current.customers || []).find(x => x.id === cust.id);
        return {
          id: cust.id,
          name: cust.name || localCust?.name || '',
          phone: cust.phone || localCust?.phone || '',
          password: cust.password || localCust?.password || 'password123',
          status: cust.status || localCust?.status || 'সক্রিয় (Active)',
          createdAt: localCust?.createdAt || new Date().toISOString()
        };
      });
      const extraLocalCustomers = (current.customers || []).filter(lc => !customersRes.data.some(c => c.id === lc.id));
      updated.customers = [...remoteCustomers, ...extraLocalCustomers];
    }

    if (inquiriesRes?.data && inquiriesRes.data.length > 0) {
      updated.inquiries = inquiriesRes.data.map(inq => ({
        id: inq.id,
        name: inq.name,
        phone: inq.phone,
        email: inq.email,
        projectId: inq.project_id,
        inquiryType: inq.inquiry_type,
        investmentAmount: inq.investment_amount,
        interestedSector: inq.interested_sector,
        message: inq.message,
        status: inq.status,
        date: inq.created_at ? new Date(inq.created_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
        timestamp: inq.created_at
      }));
    }

    if (offersRes?.data && offersRes.data.length > 0) {
      updated.investmentOffers = offersRes.data.map(o => ({
        id: o.id,
        name: o.name,
        location: o.location || '',
        description: o.description || '',
        minInvestment: Number(o.min_investment) || 0,
        maxInvestment: Number(o.max_investment) || 0,
        tenureYears: Number(o.tenure_years) || 0,
        netProfitPercent: Number(o.net_profit_percent) || 0,
        directorTierMinInvestment: Number(o.director_tier_min_investment) || 0,
        directorTierRecurring: Boolean(o.director_tier_recurring)
      }));
    }

    if (investorsRes?.data && investorsRes.data.length > 0) {
      updated.investors = investorsRes.data.map(inv => ({
        id: inv.id,
        name: inv.name,
        phone: inv.phone || '',
        offerId: inv.offer_id,
        tier: inv.tier || 'general',
        investedAmount: Number(inv.invested_amount) || 0,
        investmentDate: inv.investment_date || '',
        cycleEndDate: inv.cycle_end_date || '',
        status: inv.status || 'সক্রিয় (Active)',
        totalPaid: Number(inv.total_paid) || 0,
        payoutHistory: Array.isArray(inv.payout_history) ? inv.payout_history : [],
        address: inv.address || '',
        nomineeName: inv.nominee_name || '',
        nomineeRelation: inv.nominee_relation || '',
        nomineePhone: inv.nominee_phone || ''
      }));
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


// Generate clean sequential job application ID starting from AL-JOB-YYYY-1001
export const generateNextJobId = (existingApps = []) => {
  const currentYear = new Date().getFullYear();
  const prefix = `AL-JOB-${currentYear}-`;
  let maxSeq = 1000;

  (existingApps || []).forEach(app => {
    if (app && app.id && typeof app.id === 'string' && app.id.startsWith(prefix)) {
      const numPart = parseInt(app.id.replace(prefix, ''), 10);
      if (!isNaN(numPart) && numPart >= 1000 && numPart < 90000) {
        if (numPart > maxSeq) {
          maxSeq = numPart;
        }
      }
    }
  });

  return `${prefix}${maxSeq + 1}`;
};

// Save career job application from the public website (Local + Supabase Cloud)
export const saveJobApplication = async (application) => {
  try {
    const current = getManagementData();

    // 1. First, fetch latest remote applications from Supabase Cloud
    let remoteApps = [];
    try {
      const { data } = await supabase.from('admins').select('permissions').eq('id', 'JOB-APPLICATIONS-STORE').single();
      if (data && Array.isArray(data.permissions)) {
        remoteApps = data.permissions;
      }
    } catch (_) {}

    // 2. Base existing applications on authoritative cloud store
    const baseList = remoteApps.length > 0 ? remoteApps : (current.jobApplications || []);
    const cleanId = generateNextJobId(baseList);

    const newApp = {
      date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      timestamp: new Date().toISOString(),
      status: 'নতুন আবেদন (Under Review)',
      interviewDate: '',
      interviewTime: '',
      interviewLocation: 'আল-ইমারাহ হেড অফিস, পুরানা পল্টন, ঢাকা',
      requiredDocuments: 'মূল শিক্ষাগত সনদপত্র, ২ কপি ছবি ও এনআইডি কপি, হালনাগাদ জীবনবৃত্তান্ত (CV)',
      adminNotes: '',
      ...application,
      id: cleanId
    };

    const mergedList = [newApp, ...baseList.filter(a => a && a.id !== newApp.id)];
    const updated = {
      ...current,
      jobApplications: mergedList
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('alemarah_store_updated', { detail: updated }));
    } catch (_) {}

    // Direct sync to Supabase cloud store
    await syncJobApplicationsToSupabase(mergedList);

    return newApp;
  } catch (e) {
    console.error('Error saving job application:', e);
  }
};


// Delete team member from local store and Supabase Cloud
export const deleteTeamMember = async (id) => {
  try {
    const current = getManagementData();
    const updatedTeam = (current.managementTeam || []).filter(m => m.id !== id);
    const updated = {
      ...current,
      managementTeam: updatedTeam
    };
    saveManagementData(updated);
    await supabase.from('admins').delete().eq('id', id);
    return true;
  } catch (err) {
    console.error('Error deleting admin from Supabase:', err);
    return false;
  }
};

// Delete job application from management (Local + Supabase Cloud)
export const deleteJobApplication = async (appId) => {
  try {
    // 1. Fetch live remote list from Supabase Cloud
    let cloudList = [];
    try {
      const { data } = await supabase
        .from('admins')
        .select('permissions')
        .eq('id', 'JOB-APPLICATIONS-STORE')
        .single();
      if (data && Array.isArray(data.permissions)) {
        cloudList = data.permissions;
      }
    } catch (fetchErr) {
      console.warn('Could not fetch cloud list during delete, using local:', fetchErr);
    }

    const current = getManagementData();
    const sourceList = cloudList.length > 0 ? cloudList : (current.jobApplications || []);
    const updatedList = sourceList.filter(a => a && a.id !== appId);

    // 2. Direct atomic upsert to Supabase Cloud
    await syncJobApplicationsToSupabase(updatedList);

    // 3. Update localStorage directly with the authoritative list
    const updated = {
      ...current,
      jobApplications: updatedList
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}

    window.dispatchEvent(new CustomEvent('alemarah_store_updated', { detail: updated }));
    return updated;
  } catch (e) {
    console.error('Error deleting job application:', e);
    const current = getManagementData();
    const fallbackList = (current.jobApplications || []).filter(a => a && a.id !== appId);
    const updated = { ...current, jobApplications: fallbackList };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('alemarah_store_updated', { detail: updated }));
    } catch (_) {}
    return updated;
  }
};

// Update job application review status
export const updateJobApplicationStatus = async (appId, newStatus) => {
  try {
    const current = getManagementData();
    const updatedList = (current.jobApplications || []).map(a => 
      a.id === appId ? { ...a, status: newStatus } : a
    );
    const updated = {
      ...current,
      jobApplications: updatedList
    };
    saveManagementData(updated);
    await syncJobApplicationsToSupabase(updatedList);
    return updated;
  } catch (e) {
    console.error('Error updating job application status:', e);
  }
};

// Full update for job application (status, interview schedule, venue, required docs, admin notes)
export const updateJobApplication = async (appId, updates) => {
  try {
    // 1. Fetch live remote list from Supabase Cloud
    let cloudList = [];
    try {
      const { data } = await supabase
        .from('admins')
        .select('permissions')
        .eq('id', 'JOB-APPLICATIONS-STORE')
        .single();
      if (data && Array.isArray(data.permissions)) {
        cloudList = data.permissions;
      }
    } catch (_) {}

    const current = getManagementData();
    const sourceList = cloudList.length > 0 ? cloudList : (current.jobApplications || []);
    const updatedList = sourceList.map(a => 
      a && a.id === appId ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
    );

    // 2. Direct atomic upsert to Supabase Cloud
    await syncJobApplicationsToSupabase(updatedList);

    // 3. Update localStorage directly
    const updated = {
      ...current,
      jobApplications: updatedList
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}

    window.dispatchEvent(new CustomEvent('alemarah_store_updated', { detail: updated }));
    return updated;
  } catch (e) {
    console.error('Error updating job application:', e);
    const current = getManagementData();
    const updatedList = (current.jobApplications || []).map(a => 
      a && a.id === appId ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
    );
    const updated = { ...current, jobApplications: updatedList };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('alemarah_store_updated', { detail: updated }));
    } catch (_) {}
    return updated;
  }
};

// Search / lookup application by tracking ID or phone number
export const findJobApplication = (query) => {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  const digits = q.replace(/[^0-9]/g, '');
  const current = getManagementData();
  const list = current.jobApplications || [];
  return list.find(a => {
    const matchId = a.id && a.id.toLowerCase() === q;
    const cleanPhone = (a.phone || '').replace(/[^0-9]/g, '');
    const matchPhone = digits.length >= 8 && cleanPhone.includes(digits);
    return matchId || matchPhone;
  }) || null;
};

// Auto sync on app load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    syncFromSupabase();
  }, 1200);

  // Live cross-device sync: whenever any change lands in Supabase (from any
  // browser/device), re-pull so everyone sees it without a manual refresh.
  // Debounced since one save can touch several tables at once.
  let realtimeRefreshTimer = null;
  const scheduleRealtimeRefresh = () => {
    clearTimeout(realtimeRefreshTimer);
    realtimeRefreshTimer = setTimeout(() => {
      syncFromSupabase();
    }, 800);
  };

  const REALTIME_TABLES = [
    'admins', 'directors', 'projects', 'project_expenses',
    'clients', 'client_payments', 'customers', 'inquiries',
    'investment_offers', 'investors'
  ];
  const realtimeChannel = supabase.channel('alemarah_live_sync');
  REALTIME_TABLES.forEach((table) => {
    realtimeChannel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      scheduleRealtimeRefresh
    );
  });
  realtimeChannel.subscribe();

  // If a save's cloud push failed (offline, dropped connection, etc.) the
  // change is still safe in localStorage, but push it to Supabase again as
  // soon as the browser is back online instead of waiting for the next edit.
  window.addEventListener('online', () => {
    syncToSupabase(getManagementData());
  });
}

// Save data to localStorage and sync to Supabase (Resilient to file size quotas)
export const saveManagementData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage quota warning, trimming heavy base64 files for local cache:', e);
    try {
      const trimmed = {
        ...data,
        jobApplications: (data.jobApplications || []).map(a => {
          if (a.cvFile && a.cvFile.dataUrl && a.cvFile.dataUrl.length > 300000) {
            return { ...a, cvFile: { ...a.cvFile, dataUrl: '' } };
          }
          return a;
        })
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (_) {}
  }

  try {
    window.dispatchEvent(new CustomEvent('alemarah_store_updated', { detail: data }));
    // Background cloud sync with FULL data including complete CV files
    syncToSupabase(data);
  } catch (e) {
    console.error('Error syncing management data:', e);
  }
};

// Atomic state updater universally available
export const updateStore = (updater) => {
  const current = getManagementData();
  const nextData = typeof updater === 'function' ? updater(current) : updater;
  saveManagementData(nextData);
  return nextData;
};

// Silently upgrades a legacy plaintext credential to a PBKDF2 hash once it
// has been verified correct at login — used by LoginPage so every account
// gets hashed the next time its owner signs in, with no action needed from
// anyone and the user's password itself never changing.
export const upgradeCredentialHash = (kind, id, hashedValue) => {
  updateStore((prev) => {
    if (kind === 'customer') {
      return { ...prev, customers: (prev.customers || []).map(c => c.id === id ? { ...c, password: hashedValue } : c) };
    }
    if (kind === 'superAdmin') {
      return {
        ...prev,
        superAdmin: prev.superAdmin ? { ...prev.superAdmin, accessKey: hashedValue } : prev.superAdmin,
        managementTeam: (prev.managementTeam || []).map(m => m.isSuperAdmin ? { ...m, accessKey: hashedValue } : m)
      };
    }
    if (kind === 'director') {
      return { ...prev, directors: (prev.directors || []).map(d => d.id === id ? { ...d, accessKey: hashedValue } : d) };
    }
    if (kind === 'officer') {
      return { ...prev, managementTeam: (prev.managementTeam || []).map(m => m.id === id ? { ...m, accessKey: hashedValue } : m) };
    }
    return prev;
  });
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

// Delete a project and its expenses from Supabase Cloud
export const deleteProjectFromSupabase = async (projId) => {
  try {
    if (!projId) return;
    await supabase.from('project_expenses').delete().eq('project_id', projId);
    await supabase.from('projects').delete().eq('id', projId);
  } catch (err) {
    console.error('Error deleting project from Supabase:', err);
  }
};

// A locally-deleted expense that was never removed from Supabase comes
// back the next time this device (or any other) pulls remote data, since
// the remote row still exists. Delete it there too, not just locally.
export const deleteExpenseFromSupabase = async (expId) => {
  try {
    if (!expId) return;
    await supabase.from('project_expenses').delete().eq('id', expId);
  } catch (err) {
    console.error('Error deleting expense from Supabase:', err);
  }
};

export const deleteInvestmentOfferFromSupabase = async (offerId) => {
  try {
    if (!offerId) return;
    await supabase.from('investors').delete().eq('offer_id', offerId);
    await supabase.from('investment_offers').delete().eq('id', offerId);
  } catch (err) {
    console.error('Error deleting investment offer from Supabase:', err);
  }
};
