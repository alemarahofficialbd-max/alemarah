-- ========================================================
-- AL-EMARAH PROPERTIES - COMPLETE DATABASE SCHEMA (SUPABASE)
-- ========================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMINS & TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT,
    email TEXT UNIQUE,
    phone TEXT NOT NULL,
    role TEXT NOT NULL,
    role_type TEXT DEFAULT 'officer',
    access_key TEXT NOT NULL,
    is_super_admin BOOLEAN DEFAULT FALSE,
    permissions JSONB DEFAULT '["projects", "expenses"]'::jsonb,
    status TEXT DEFAULT 'সক্রিয় (Active)',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BOARD OF DIRECTORS TABLE
CREATE TABLE IF NOT EXISTS public.directors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT,
    role TEXT NOT NULL,
    role_en TEXT,
    folio_no TEXT UNIQUE NOT NULL,
    image TEXT,
    investment NUMERIC(15, 2) DEFAULT 0,
    share_percentage NUMERIC(5, 2) DEFAULT 0,
    dividend_earned NUMERIC(15, 2) DEFAULT 0,
    phone TEXT,
    email TEXT,
    joining_date TEXT,
    status TEXT DEFAULT 'সক্রিয় (Active)',
    nominee_name TEXT,
    nominee_relation TEXT,
    nominee_phone TEXT,
    theme TEXT DEFAULT 'emerald',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT,
    location TEXT,
    progress INTEGER DEFAULT 0,
    current_stage TEXT,
    budget NUMERIC(15, 2) DEFAULT 0,
    units JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROJECT EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.project_expenses (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount NUMERIC(15, 2) DEFAULT 0,
    date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    password TEXT DEFAULT 'password123',
    project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
    project_name TEXT,
    flat_no TEXT,
    total_price NUMERIC(15, 2) DEFAULT 0,
    total_paid NUMERIC(15, 2) DEFAULT 0,
    next_due_date TEXT,
    next_due_amount NUMERIC(15, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CLIENT PAYMENTS / INSTALLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.client_payments (
    id TEXT PRIMARY KEY,
    client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    amount NUMERIC(15, 2) DEFAULT 0,
    method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.directors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_payments ENABLE ROW LEVEL SECURITY;

-- Allow anon and authenticated full access for web app management
CREATE POLICY "Allow public read/write admins" ON public.admins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write directors" ON public.directors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write project_expenses" ON public.project_expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write client_payments" ON public.client_payments FOR ALL USING (true) WITH CHECK (true);

-- ========================================================
-- INITIAL DATA SEEDING (DEFAULT AL-EMARAH DATA)
-- ========================================================

-- Seed Super Admin and Management Team
INSERT INTO public.admins (id, name, name_en, email, phone, role, role_type, access_key, is_super_admin, permissions, status)
VALUES
('SUPER-ADMIN-01', 'প্রধান নির্বাহী ও সুপার অ্যাডমিন', 'Super Administrator', 'alemarah.officialbd@gmail.com', '01816233013', 'সুপার অ্যাডমিন (Super Admin)', 'super_admin', 'admin123', TRUE, '["all"]'::jsonb, 'সক্রিয় (Active)'),
('MGT-01', 'প্রকৌশলী মহিউদ্দিন আহমেদ', 'Engr. Mohiuddin Ahmed', 'engineer@alemarahproperties.com', '01918646575', 'প্রজেক্ট ডিরেক্টর / সাইট ইনচার্জ', 'project_director', 'admin123', FALSE, '["projects", "expenses"]'::jsonb, 'সক্রিয় (Active)'),
('MGT-02', 'মুহাম্মদ আব্দুর রহমান', 'Muhammad Abdur Rahman', 'accounts@alemarahproperties.com', '01743926926', 'হেড অফ অ্যাকাউন্টস & ফাইন্যান্স', 'accounts_head', 'admin123', FALSE, '["payments", "expenses", "clients"]'::jsonb, 'সক্রিয় (Active)')
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    access_key = EXCLUDED.access_key,
    is_super_admin = EXCLUDED.is_super_admin;

-- Seed Board of Directors (100% Equity Model)
INSERT INTO public.directors (id, name, name_en, role, role_en, folio_no, image, investment, share_percentage, dividend_earned, phone, email, joining_date, status, nominee_name, nominee_relation, nominee_phone, theme)
VALUES
('DIR-01', 'শেখ ফজলুল করিম মারুফ', 'Sheikh Fazlul Karim Maroof', 'চেয়ারম্যান', 'Chairman', 'AEP-DIR-001', '/images/chairman.webp', 25000000, 35, 3650000, '01816233013', 'chairman@alemarahproperties.com', '১ জানুয়ারি, ২০২৪', 'সক্রিয় (Active)', 'আইনানুগ উত্তরসূরি', 'পরিবার', '01816-233013', 'crimson'),
('DIR-02', 'তালুকদার তারিক মাসউদ', 'Talukdar Tariq Masud', 'ব্যবস্থাপনা পরিচালক', 'Managing Director', 'AEP-DIR-002', '/images/managing_director.webp', 20000000, 30, 2920000, '01918646575', 'md@alemarahproperties.com', '১ জানুয়ারি, ২০২৪', 'সক্রিয় (Active)', 'আইনানুগ উত্তরসূরি', 'পরিবার', '01918-646575', 'emerald'),
('DIR-03', 'ইঞ্জি. এম. এ. রহমান', 'Engr. M. A. Rahman', 'পরিচালক (প্রকৌশল ও কারিগরি)', 'Director (Technical & Engineering)', 'AEP-DIR-003', NULL, 10000000, 15, 1460000, '01743926926', 'technical@alemarahproperties.com', '১৫ মার্চ, ২০২৪', 'সক্রিয় (Active)', 'মোসা. ফারহানা রহমান', 'স্ত্রী', '01711-223344', 'blue'),
('DIR-04', 'ব্যারিস্টার এস. এইচ. চৌধুরী', 'Barrister S. H. Chowdhury', 'পরিচালক (আইন ও কমপ্লায়েন্স)', 'Director (Legal & Compliance)', 'AEP-DIR-004', NULL, 7500000, 10, 1095000, '01914425073', 'legal@alemarahproperties.com', '১০ মে, ২০২৪', 'সক্রিয় (Active)', 'সাইফুল চৌধুরী', 'পুত্র', '01911-334455', 'amber'),
('DIR-05', 'তানভীর হাসান, এফসিএ', 'Tanvir Hasan, FCA', 'পরিচালক (অর্থ ও নিরীক্ষা)', 'Director (Finance & Audit)', 'AEP-DIR-005', NULL, 7500000, 10, 1095000, '01833544548', 'accounts@alemarahproperties.com', '১ জুলাই, ২০২৪', 'সক্রিয় (Active)', 'নাজমিন হাসান', 'স্ত্রী', '01811-556677', 'purple')
ON CONFLICT (id) DO UPDATE SET
    investment = EXCLUDED.investment,
    share_percentage = EXCLUDED.share_percentage;

-- Seed Signature Projects
INSERT INTO public.projects (id, name, name_en, location, progress, current_stage, budget)
VALUES
('al-quds-tower', 'আল কুদস টাওয়ার', 'Al Quds Tower', 'সাইনবোর্ড - সানারপাড়, ঢাকা', 68, '৭ম তলা ছাদ ঢালাই ও অভ্যন্তরীণ ব্রিকওয়ার্ক', 85000000),
('barakah-tower-01', 'বারাকাহ টাওয়ার ০১', 'Barakah Tower 01', 'পুরানা পল্টন, ঢাকা', 35, '৩য় তলা কলাম ও ছাদ সাটারিং', 62000000),
('alemarah-shopping-mall', 'আল ইমারাহ শপিং মল', 'Al Emarah Shopping Mall', '২২ ফুট প্রশস্ত রাস্তা সংলগ্ন, প্রাইম বাণিজ্যিক জোন', 15, 'সাইট ডেভেলপমেন্ট ও সয়েল টেস্ট সম্পন্ন', 120000000)
ON CONFLICT (id) DO UPDATE SET
    progress = EXCLUDED.progress,
    current_stage = EXCLUDED.current_stage;

-- Seed Project Expenses
INSERT INTO public.project_expenses (id, project_id, title, amount, date)
VALUES
('EXP-1', 'al-quds-tower', 'পাইলিং ও ডিপ বেসমেন্ট পাইলিং', 18000000, '১০ মার্চ ২০২৬'),
('EXP-2', 'al-quds-tower', '১ম থেকে ৫ম তলা আরসিসি ফ্রেম স্ট্রাকচার', 31000000, '১৫ মে ২০২৬'),
('EXP-3', 'al-quds-tower', '৬ষ্ঠ ও ৭ম তলা চলমান ঢালাই ও ব্রিকওয়ার্ক', 12000000, '২০ সেপ্টেম্বর ২০২৬'),
('EXP-B1', 'barakah-tower-01', 'পাইলিং ও সয়েল প্রটেকশন রিটেইনিং ওয়াল', 11500000, '১ জুন ২০২৬'),
('EXP-B2', 'barakah-tower-01', 'বেসমেন্ট ও গ্রাউন্ড ফ্লোর ঢালাই', 9500000, '১৮ আগস্ট ২০২৬'),
('EXP-M1', 'alemarah-shopping-mall', 'ভূমি উন্নয়ন, বাউন্ডারি ওয়াল ও সয়েল টেস্ট', 14000000, '৫ সেপ্টেম্বর ২০২৬')
ON CONFLICT (id) DO NOTHING;

-- Seed Clients
INSERT INTO public.clients (id, name, phone, password, project_id, project_name, flat_no, total_price, total_paid, next_due_date, next_due_amount)
VALUES
('CLI-88214', 'মোহাম্মদ আরিফুল ইসলাম', '01711223344', 'password123', 'al-quds-tower', 'আল কুদস টাওয়ার', '৭ম তলা, ফ্ল্যাট ৭-বি (১২৬৫ বর্গফুট)', 12000000, 7200000, '১৫ অক্টোবর, ২০২৬', 600000),
('CLI-99432', 'ইঞ্জিঃ রফিকুল ইসলাম', '01819988776', 'password123', 'barakah-tower-01', 'বারাকাহ টাওয়ার ০১', '৪র্থ তলা, ইউনিট ৪-এ (১৪৫০ বর্গফুট)', 9500000, 3500000, '১ নভেম্বর, ২০২৬', 500000)
ON CONFLICT (id) DO UPDATE SET
    total_paid = EXCLUDED.total_paid;

-- Seed Client Payments
INSERT INTO public.client_payments (id, client_id, date, amount, method)
VALUES
('TRX-101', 'CLI-88214', '১৫ জুলাই, ২০২৬', 2400000, 'ব্যাংক ডিপোজিট (সিটি ব্যাংক)'),
('TRX-102', 'CLI-88214', '১৫ আগস্ট, ২০২৬', 2400000, 'ব্যাংক ডিপোজিট (ইসলামী ব্যাংক)'),
('TRX-103', 'CLI-88214', '১৫ সেপ্টেম্বর, ২০২৬', 2400000, 'পে-অর্ডার'),
('TRX-201', 'CLI-99432', '১ জুন, ২০২৬', 2000000, 'বুকিং মানি ও চুক্তি'),
('TRX-202', 'CLI-99432', '১ আগস্ট, ২০২৬', 1500000, 'ব্যাংক চেক')
ON CONFLICT (id) DO NOTHING;

-- 7. CUSTOMER & INVESTOR INQUIRIES / LEADS TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    project_id TEXT,
    inquiry_type TEXT DEFAULT 'site_visit', -- 'site_visit' | 'investment'
    investment_amount TEXT,
    interested_sector TEXT,
    message TEXT,
    status TEXT DEFAULT 'নতুন (New)',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read/manage inquiries" ON public.inquiries FOR ALL USING (true);
