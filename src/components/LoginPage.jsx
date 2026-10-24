import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Eye, 
  EyeOff, 
  Sparkles, 
  PhoneCall, 
  ShieldCheck,
  Building2,
  CheckCircle2,
  HardHat,
  Key,
  Crown,
  Shield
} from 'lucide-react';
import { getManagementData } from '../data/managementStore';

export default function LoginPage({ 
  lang, 
  t, 
  onLoginSuccess, 
  onManagementLoginSuccess,
  onNavigateHome 
}) {
  const [loginRole, setLoginRole] = useState('customer'); // 'customer' or 'management'
  const [showPassword, setShowPassword] = useState(false);
  const [identifierInput, setIdentifierInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEn = lang === 'en';

  const handleLogin = (e) => {
    e.preventDefault();
    if (!identifierInput || !passwordInput) {
      setIsSuccess(false);
      setStatusMessage(isEn ? 'Please enter your login ID/Phone and Password.' : 'অনুগ্রহ করে আইডি/ফোন এবং পাসওয়ার্ড লিখুন।');
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);
    setStatusMessage(isEn ? 'Verifying credentials...' : 'তথ্য যাচাই করা হচ্ছে...');

    const store = getManagementData();

    setTimeout(() => {
      setIsSubmitting(false);

      if (loginRole === 'customer') {
        const cleanPhone = identifierInput.replace(/[^0-9]/g, '');
        const trimmedInput = identifierInput.trim().toLowerCase();
        const trimmedPass = passwordInput.trim();

        // Find matching client by ID or Phone
        const matchedClient = (store.clients || []).find(
          c => (
            (c.id && c.id.toLowerCase() === trimmedInput) || 
            (c.phone && c.phone.trim() === identifierInput.trim()) ||
            (cleanPhone && c.phone && c.phone.replace(/[^0-9]/g, '') === cleanPhone)
          )
        );

        if (!matchedClient) {
          setIsSuccess(false);
          setStatusMessage(isEn ? 'Customer ID or mobile number not found!' : 'গ্রাহক ফাইল আইডি অথবা মোবাইল নম্বর খুঁজে পাওয়া যায়নি!');
          return;
        }

        const validPass = matchedClient.password || 'password123';
        if (trimmedPass !== validPass) {
          setIsSuccess(false);
          setStatusMessage(isEn ? 'Incorrect customer password! Please check and try again.' : 'ভুল পাসওয়ার্ড! গ্রাহকের সঠিক পাসওয়ার্ড প্রদান করুন।');
          return;
        }

        setIsSuccess(true);
        setStatusMessage(isEn ? `Welcome ${matchedClient.name}! Redirecting...` : `স্বাগতম ${matchedClient.name}! ক্লায়েন্ট ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...`);
        setTimeout(() => {
          onLoginSuccess(matchedClient);
        }, 400);
      } else {
        // Management login: strictly distinguish Super Admin, Director, and Staff Officer
        const trimmedInput = identifierInput.trim().toLowerCase();
        const trimmedPass = passwordInput.trim();
        const superAdmin = store.superAdmin || store.managementTeam.find(m => m.isSuperAdmin);
        
        // 1. Check Super Admin (Strict check: alemarah.officialbd@gmail.com, SUPER-ADMIN-01, or superadmin)
        const isSuperAdminMatch = 
          trimmedInput === 'alemarah.officialbd@gmail.com' ||
          trimmedInput === (superAdmin?.email || '').toLowerCase() ||
          trimmedInput === 'superadmin' ||
          trimmedInput === (superAdmin?.id || '').toLowerCase();

        // 2. Check Board of Directors (matches phone, email, id, or folioNo)
        const cleanPhone = identifierInput.replace(/[^0-9]/g, '');
        const matchedDirector = !isSuperAdminMatch ? (store.directors || []).find(
          d => (
            (cleanPhone && d.phone && d.phone.replace(/[^0-9]/g, '') === cleanPhone) ||
            (d.email && d.email.toLowerCase() === trimmedInput) ||
            (d.id && d.id.toLowerCase() === trimmedInput) ||
            (d.folioNo && d.folioNo.toLowerCase() === trimmedInput)
          )
        ) : null;

        // 3. Check Staff Officer / Team member (e.g. Accountant, Site Engineer)
        const matchedOfficer = (!isSuperAdminMatch && !matchedDirector) ? (store.managementTeam || []).find(
          m => (
            !m.isSuperAdmin && (
              (cleanPhone && m.phone && m.phone.replace(/[^0-9]/g, '') === cleanPhone) ||
              (m.email && m.email.toLowerCase() === trimmedInput) ||
              (m.id && m.id.toLowerCase() === trimmedInput)
            )
          )
        ) : null;

        let matchedAdmin = null;

        if (isSuperAdminMatch) {
          const validPass = superAdmin?.accessKey || 'admin123';
          if (trimmedPass !== validPass) {
            setIsSuccess(false);
            setStatusMessage(isEn ? 'Incorrect Super Admin password!' : 'ভুল পাসওয়ার্ড! সুপার অ্যাডমিন পাসওয়ার্ড সঠিক নয়।');
            return;
          }

          matchedAdmin = {
            ...(superAdmin || store.managementTeam[0]),
            id: 'SUPER-ADMIN-01',
            roleType: 'super_admin',
            isSuperAdmin: true,
            isDirector: false,
            role: 'প্রধান নির্বাহী ও সুপার অ্যাডমিন (Super Admin)',
            email: 'alemarah.officialbd@gmail.com',
            permissions: ['all']
          };
          setIsSuccess(true);
          setStatusMessage(isEn ? 'Super Admin Master Access Granted!' : 'সুপার অ্যাডমিন মাস্টার এক্সেস অনুমোদিত!');

        } else if (matchedDirector) {
          const validPass = matchedDirector.accessKey || 'admin123';
          if (trimmedPass !== validPass) {
            setIsSuccess(false);
            setStatusMessage(isEn ? 'Incorrect Director password!' : 'ভুল পাসওয়ার্ড! পরিচালকের পাসওয়ার্ড সঠিক নয়।');
            return;
          }

          const directorInTeam = (store.managementTeam || []).find(m => 
            (m.directorId && m.directorId === matchedDirector.id) ||
            (m.phone && cleanPhone && m.phone.replace(/[^0-9]/g, '') === cleanPhone) ||
            (m.email && m.email.toLowerCase() === trimmedInput)
          );
          const directorPerms = directorInTeam && Array.isArray(directorInTeam.permissions)
            ? directorInTeam.permissions
            : (Array.isArray(matchedDirector.permissions) ? matchedDirector.permissions : []);

          matchedAdmin = {
            id: matchedDirector.id,
            name: matchedDirector.name,
            nameEn: matchedDirector.nameEn,
            role: matchedDirector.role,
            roleType: 'director',
            folioNo: matchedDirector.folioNo,
            email: matchedDirector.email,
            phone: matchedDirector.phone,
            image: matchedDirector.image,
            investment: matchedDirector.investment,
            sharePercentage: matchedDirector.sharePercentage,
            dividendEarned: matchedDirector.dividendEarned,
            isDirector: true,
            isSuperAdmin: false,
            accessKey: matchedDirector.accessKey || 'admin123',
            permissions: directorPerms,
            status: matchedDirector.status || 'সক্রিয় (Active)'
          };
          setIsSuccess(true);
          setStatusMessage(isEn ? `Welcome Director: ${matchedDirector.name}` : `বোর্ড পরিচালক মহোদয় স্বাগতম: ${matchedDirector.name}`);

        } else if (matchedOfficer) {
          const validPass = matchedOfficer.accessKey || 'admin123';
          if (trimmedPass !== validPass) {
            setIsSuccess(false);
            setStatusMessage(isEn ? 'Incorrect officer password!' : 'ভুল পাসওয়ার্ড! কর্মকর্তার পাসওয়ার্ড সঠিক নয়।');
            return;
          }

          matchedAdmin = {
            ...matchedOfficer,
            isSuperAdmin: false,
            isDirector: false,
            roleType: matchedOfficer.roleType || 'staff',
            permissions: Array.isArray(matchedOfficer.permissions) ? matchedOfficer.permissions : []
          };
          setIsSuccess(true);
          setStatusMessage(isEn ? `Welcome: ${matchedOfficer.name} (${matchedOfficer.role})` : `স্বাগতম: ${matchedOfficer.name} (${matchedOfficer.role})`);

        } else {
          setIsSuccess(false);
          setStatusMessage(isEn ? 'User ID or phone number not found in system!' : 'ব্যবহারকারীর তথ্য পাওয়া যায়নি। অনুগ্রহ করে সঠিক আইডি/মোবাইল প্রদান করুন।');
          return;
        }

        setTimeout(() => {
          onManagementLoginSuccess(matchedAdmin);
        }, 400);
      }
    }, 600);
  };

  const handleDemoFill = (type = 'default') => {
    const store = getManagementData();
    if (loginRole === 'customer') {
      const demoClient = store.clients[0];
      setIdentifierInput(demoClient?.phone || '01711223344');
      setPasswordInput(demoClient?.password || 'password123');
      setIsSuccess(true);
      setStatusMessage(isEn ? 'Demo Customer credentials filled. Click "Sign In".' : 'ডেমো কাস্টমার আইডি ও পাসওয়ার্ড বসানো হয়েছে।');
    } else if (type === 'superadmin') {
      const superAdmin = store.superAdmin || store.managementTeam.find(m => m.isSuperAdmin);
      setIdentifierInput(superAdmin?.email || 'alemarah.officialbd@gmail.com');
      setPasswordInput(superAdmin?.accessKey || 'admin123');
      setIsSuccess(true);
      setStatusMessage(isEn ? 'Super Admin credentials filled. Click "Access Portal".' : 'সুপার অ্যাডমিন ইমেইল ও পাসওয়ার্ড বসানো হয়েছে।');
    } else if (type === 'director') {
      const director = store.directors?.[0] || { name: 'শেখ ফজলুল করীম মারুফ', phone: '01816233013', accessKey: 'admin123' };
      setIdentifierInput(director?.phone || '01816233013');
      setPasswordInput(director?.accessKey || 'admin123');
      setIsSuccess(true);
      setStatusMessage(isEn ? `Director credentials filled: ${director.name}` : `বোর্ড পরিচালক আইডি ও পাসওয়ার্ড বসানো হয়েছে (${director.name})।`);
    } else {
      // Find Accountant or first staff officer
      const staffAdmin = store.managementTeam.find(m => m.roleType === 'accounts_head' || m.role?.includes('অ্যাকাউন্টস')) || store.managementTeam.find(m => !m.isSuperAdmin) || store.managementTeam[1];
      setIdentifierInput(staffAdmin?.phone || '01743926926');
      setPasswordInput(staffAdmin?.accessKey || 'admin123');
      setIsSuccess(true);
      setStatusMessage(isEn ? `Officer (${staffAdmin?.role || 'Staff'}) credentials filled. Click "Access Portal".` : `কর্মকর্তা আইডি ও পাসওয়ার্ড বসানো হয়েছে (${staffAdmin?.name || 'অফিসার'})।`);
    }
  };

  return (
    <div className="min-h-screen py-10 md:py-16 bg-gradient-to-b from-[#F8F9FA] via-white to-gray-50 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-lg">
        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/5 border border-gray-100 relative">
          {/* Quick Back Button */}
          <button
            type="button"
            onClick={onNavigateHome}
            className="absolute top-5 left-5 p-2 rounded-xl text-gray-400 hover:text-[#CE2028] hover:bg-red-50 transition-colors cursor-pointer"
            title="হোমপেজে ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Official Brand Logo and Title */}
          <div className="text-center mb-6">
            <button 
              type="button" 
              onClick={onNavigateHome} 
              className="inline-block cursor-pointer group"
              title="Al-Emarah Properties"
            >
              <img 
                src="/alemarah_logo_header.svg" 
                alt="Al-Emarah Logo" 
                className="h-11 sm:h-12 w-auto object-contain mx-auto mb-3 transition-transform group-hover:scale-105"
              />
            </button>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231F20]">
              {loginRole === 'customer' 
                ? (isEn ? 'Client Portal Sign In' : 'গ্রাহক পোর্টাল লগইন')
                : (isEn ? 'Management Admin Sign In' : 'ম্যানেজমেন্ট প্যানেল লগইন')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
              {loginRole === 'customer'
                ? (isEn ? 'View your flat details, payments, and live construction updates.' : 'আপনার ফ্ল্যাটের তথ্য, কিস্তির হিসাব ও কাজের অগ্রগতি দেখতে লগইন করুন।')
                : (isEn ? 'Authorized personnel access for client & project control.' : 'ক্লায়েন্ট ম্যানেজমেন্ট, টাকা জমা এন্ট্রি ও প্রজেক্ট খরচের জন্য লগইন করুন।')}
            </p>
          </div>

          {/* Role Switcher Tabs (Customer vs Management) */}
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-gray-100 mb-6 gap-1">
            <button
              type="button"
              onClick={() => {
                setLoginRole('customer');
                setIdentifierInput('');
                setPasswordInput('');
                setStatusMessage('');
              }}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                loginRole === 'customer'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 text-[#CE2028]" />
              <span>{isEn ? 'Customer' : '১. গ্রাহক লগইন'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginRole('management');
                setIdentifierInput('');
                setPasswordInput('');
                setStatusMessage('');
              }}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                loginRole === 'management'
                  ? 'bg-gradient-to-r from-[#CE2028] to-[#A9141B] text-white shadow-md shadow-[#CE2028]/25'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>{isEn ? 'Management' : '২. ম্যানেজমেন্ট লগইন'}</span>
            </button>
          </div>

          {/* Demo Credentials Quick-Fill Bar (dev-only: never exposes real credentials in production) */}
          {import.meta.env.DEV && (
          <div className="mb-6 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center space-x-2 text-xs text-[#006231] font-semibold">
                <Sparkles className="w-4 h-4 text-[#8EBF40] shrink-0" />
                <span className="truncate">
                  {loginRole === 'customer' 
                    ? 'টেস্টিং: ০১৭১১-২২৩৩৪৪ (পাসওয়ার্ড: password123)' 
                    : 'লগইন: সুপার অ্যাডমিন, ডিরেক্টর বা অফিসার ক্রেডেনশিয়াল'}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 shrink-0 flex-wrap gap-y-1">
                {loginRole === 'customer' ? (
                  <button
                    type="button"
                    onClick={() => handleDemoFill('default')}
                    className="px-2.5 py-1 rounded-lg bg-white text-[#006231] text-xs font-bold border border-emerald-200 shadow-2xs hover:bg-[#006231] hover:text-white transition-colors cursor-pointer"
                  >
                    ১-ক্লিক ডেমো
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDemoFill('superadmin')}
                      className="px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-red-600 text-white text-xs font-bold shadow-2xs hover:opacity-90 transition-opacity cursor-pointer flex items-center space-x-1"
                      title="সুপার অ্যাডমিন ডেমো ফিল করুন"
                    >
                      <Crown className="w-3 h-3" />
                      <span>সুপার অ্যাডমিন</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoFill('director')}
                      className="px-2 py-1 rounded-lg bg-white text-[#006231] text-xs font-bold border border-emerald-200 shadow-2xs hover:bg-[#006231] hover:text-white transition-colors cursor-pointer flex items-center space-x-1"
                      title="বোর্ড ডিরেক্টর ডেমো ফিল করুন"
                    >
                      <Shield className="w-3 h-3 text-[#006231]" />
                      <span>বোর্ড ডিরেক্টর</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoFill('staff')}
                      className="px-2 py-1 rounded-lg bg-white text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer"
                      title="স্টাফ অ্যাডমিন ডেমো ফিল করুন"
                    >
                      অফিসার
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Identifier input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                {loginRole === 'management' ? (
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <User className="w-3.5 h-3.5 text-[#CE2028]" />
                )}
                <span>
                  {loginRole === 'customer' 
                    ? (isEn ? 'Customer ID or Mobile Number' : 'কাস্টমার আইডি বা মোবাইল নম্বর') 
                    : (isEn ? 'Super Admin / Director / Officer Mobile or ID' : 'সুপার অ্যাডমিন / ডিরেক্টর / কর্মকর্তার মোবাইল বা আইডি')}
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifierInput}
                  onChange={(e) => setIdentifierInput(e.target.value)}
                  placeholder={loginRole === 'customer' ? '01711223344 বা CLI-88214' : 'alemarah.officialbd@gmail.com বা ০১৭১১...'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 font-medium placeholder-gray-400 focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028] outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-[#006231]" />
                  <span>{loginRole === 'customer' ? 'পাসওয়ার্ড' : 'সিকিউরিটি অ্যাক্সেস কী'}</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={loginRole === 'customer' ? 'পাসওয়ার্ড লিখুন' : 'অ্যাক্সেস কী লিখুন'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 font-medium placeholder-gray-400 focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028] outline-none transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Status message */}
            {statusMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                isSuccess 
                  ? 'bg-emerald-50 text-[#006231] border border-emerald-200' 
                  : 'bg-red-50 text-[#CE2028] border border-red-200'
              }`}>
                {isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Lock className="w-4 h-4 shrink-0" />}
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#A9141B] text-white text-sm font-bold shadow-lg shadow-[#CE2028]/25 hover:opacity-95 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <span>যাচাই করা হচ্ছে...</span>
              ) : (
                <>
                  <span>{loginRole === 'customer' ? 'গ্রাহক ড্যাশবোর্ডে প্রবেশ করুন' : 'ম্যানেজমেন্ট প্যানেলে প্রবেশ করুন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer security note */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center space-x-2 text-2xs text-gray-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#8EBF40]" />
            <span>২৫৬-বিট এসএসএল এনক্রিপ্টেড সুরক্ষিত কর্পোরেট পোর্টাল</span>
          </div>
        </div>
      </div>
    </div>
  );
}
