import React, { useState, useMemo, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Calendar, 
  GraduationCap, 
  DollarSign, 
  Users, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  Users2, 
  FileText, 
  ExternalLink, 
  X, 
  Check, 
  PhoneCall, 
  AlertCircle,
  Copy,
  FolderOpen,
  FileSpreadsheet,
  Megaphone,
  Globe,
  FolderCheck,
  HeartHandshake,
  Presentation,
  Award,
  MessageSquare,
  Languages,
  Laptop,
  Mail,
  Gift,
  UploadCloud,
  FileCheck,
  Trash2,
  Paperclip,
  Eye,
  Download,
  Share2
} from 'lucide-react';

// Dynamic Icon Resolvers for Job Details Sections
const getJobResponsibilityIcon = (jobId, index) => {
  if (jobId === 'job-accounts-admin-officer') {
    const icons = [FileSpreadsheet, Megaphone, Globe, TrendingUp, FolderCheck];
    return icons[index] || CheckCircle2;
  }
  if (jobId === 'job-public-relations-officer') {
    const icons = [HeartHandshake, Megaphone, Presentation, Award, MessageSquare];
    return icons[index] || CheckCircle2;
  }
  const fallbackIcons = [FileSpreadsheet, Megaphone, Globe, TrendingUp, FolderCheck, HeartHandshake, Presentation, Award];
  return fallbackIcons[index % fallbackIcons.length] || CheckCircle2;
};

const getJobRequirementIcon = (jobId, index) => {
  if (jobId === 'job-accounts-admin-officer') {
    const icons = [GraduationCap, FileSpreadsheet, Globe, Laptop, Mail, ShieldCheck];
    return icons[index] || Check;
  }
  if (jobId === 'job-public-relations-officer') {
    const icons = [GraduationCap, Languages, Laptop, Briefcase, Sparkles];
    return icons[index] || Check;
  }
  const fallbackIcons = [GraduationCap, Languages, Laptop, Mail, ShieldCheck, Briefcase, Sparkles];
  return fallbackIcons[index % fallbackIcons.length] || Check;
};

const getJobBenefitIcon = (jobId, index) => {
  if (jobId === 'job-accounts-admin-officer') {
    const icons = [DollarSign, Gift, PhoneCall, HeartHandshake, TrendingUp];
    return icons[index] || Sparkles;
  }
  if (jobId === 'job-public-relations-officer') {
    const icons = [DollarSign, Gift, Building2, PhoneCall, TrendingUp];
    return icons[index] || Sparkles;
  }
  const fallbackIcons = [DollarSign, Gift, PhoneCall, HeartHandshake, TrendingUp, Building2];
  return fallbackIcons[index % fallbackIcons.length] || Sparkles;
};
import { jobsData, careerPillars } from '../data/jobsData';
import { saveJobApplication, findJobApplication, fetchJobApplicationsFromSupabase, getManagementData, generateNextJobId } from '../data/managementStore';
import { supabase, uploadResumeToStorage } from '../lib/supabaseClient';

export default function CareerPage({ lang = 'bn', t, onNavigate = () => {} }) {
  const isEn = lang === 'en';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  // Application Form State
  const [formData, setFormData] = useState({
    jobId: '',
    jobTitle: '',
    applicantName: '',
    phone: '',
    email: '',
    district: '',
    education: '',
    experienceYears: '',
    currentCompany: '',
    expectedSalary: '',
    rawFile: null,
    cvFile: null,
    cvLink: '',
    coverNote: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackQuery, setTrackQuery] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackHasSearched, setTrackHasSearched] = useState(false);

  // Job Sharing & Unique URL State
  const [shareJob, setShareJob] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);

  // Sync URL hash for direct job linking & deep linking
  useEffect(() => {
    const parseJobFromUrl = () => {
      try {
        const hash = window.location.hash || '';
        let targetId = null;
        if (hash.includes('job=')) {
          const match = hash.match(/job=([^&]+)/);
          if (match) targetId = match[1];
        } else if (hash.includes('job-')) {
          const match = hash.match(/job-[a-z0-9-]+/i);
          if (match) targetId = match[0];
        }

        if (targetId) {
          const found = jobsData.find(j => j.id === targetId);
          if (found) {
            setSelectedJobForDetails(found);
          }
        }
      } catch (_) {}
    };

    parseJobFromUrl();
    window.addEventListener('hashchange', parseJobFromUrl);
    return () => window.removeEventListener('hashchange', parseJobFromUrl);
  }, []);

  const handleOpenJobDetails = (job) => {
    setSelectedJobForDetails(job);
    try {
      const newHash = `#careers?job=${job.id}`;
      window.history.pushState({ page: 'careers', job: job.id }, '', `${window.location.pathname}${newHash}`);
    } catch (_) {}
  };

  const handleCloseJobDetails = () => {
    setSelectedJobForDetails(null);
    try {
      window.history.pushState({ page: 'careers' }, '', `${window.location.pathname}#careers`);
    } catch (_) {}
  };

  const getJobShareUrl = (jobId) => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}${window.location.pathname}#careers?job=${jobId}`;
  };

  const handleShareJob = (job) => {
    setShareCopied(false);
    setShareJob(job);
  };

  const handleCopyShareUrl = (jobId) => {
    const url = getJobShareUrl(jobId);
    if (!url) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url);
      } else {
        const t = document.createElement('textarea');
        t.value = url;
        document.body.appendChild(t);
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
      }
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch (_) {}
  };

  // Departments List
  const departments = useMemo(() => {
    const list = [
      { id: 'all', labelBn: 'সকল বিভাগ (০২)', labelEn: 'All Departments (02)' },
      { id: 'PR', labelBn: 'জনসংযোগ ও পিআর', labelEn: 'Public Relations (PR)' },
      { id: 'Administration', labelBn: 'হিসাব ও প্রশাসন', labelEn: 'Accounts & Administration' },
      { id: 'Sales', labelBn: 'মার্কেটিং ও সেলস', labelEn: 'Marketing & Sales' }
    ];
    return list;
  }, []);

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    return jobsData.filter(job => {
      // Dept filter
      if (selectedDepartment !== 'all') {
        const dLower = selectedDepartment.toLowerCase();
        const matchesDept = 
          job.departmentEn.toLowerCase().includes(dLower) ||
          job.departmentBn.includes(selectedDepartment) ||
          (selectedDepartment === 'PR' && (job.departmentEn.toLowerCase().includes('public relations') || job.departmentBn.includes('জনসংযোগ')));
        if (!matchesDept) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = 
          job.titleBn.toLowerCase().includes(q) ||
          job.titleEn.toLowerCase().includes(q) ||
          job.locationBn.toLowerCase().includes(q) ||
          job.locationEn.toLowerCase().includes(q) ||
          job.experienceBn.toLowerCase().includes(q) ||
          job.educationBn.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      return true;
    });
  }, [selectedDepartment, searchQuery]);

  // Open Apply Modal
  const handleOpenApplyModal = (job = null) => {
    setSelectedJobForDetails(null);
    if (job) {
      setSelectedJobForApply(job);
      setFormData(prev => ({
        ...prev,
        jobId: job.id,
        jobTitle: isEn ? job.titleEn : job.titleBn
      }));
    } else {
      setSelectedJobForApply({
        id: 'general-drop-cv',
        titleBn: 'সাধারণ / স্বতঃস্ফূর্ত আবেদন (Drop CV)',
        titleEn: 'General / Spontaneous Application (Drop CV)'
      });
      setFormData(prev => ({
        ...prev,
        jobId: 'general-drop-cv',
        jobTitle: isEn ? 'General Application (Drop CV)' : 'সাধারণ আবেদন (Drop CV)'
      }));
    }
    setFormErrors({});
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.applicantName.trim()) {
      errors.applicantName = isEn ? 'Full name is required' : 'আবেদনকারীর নাম লিখুন';
    }
    const cleanPhone = formData.phone.trim().replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      errors.phone = isEn ? 'Valid 11-digit mobile number required' : 'সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন';
    }
    if (!formData.education.trim()) {
      errors.education = isEn ? 'Highest qualification is required' : 'সর্বোচ্চ শিক্ষাগত যোগ্যতা লিখুন';
    }
    if (!formData.district.trim()) {
      errors.district = isEn ? 'District / address required' : 'বর্তমান জেলা বা ঠিকানা লিখুন';
    }
    if (!formData.cvFile && !formData.cvLink.trim()) {
      errors.cv = isEn ? 'Please upload your CV file or provide a Drive link' : 'আপনার সিভি ফাইল সরাসরি আপলোড করুন অথবা ড্রাইভ লিঙ্ক প্রদান করুন';
    } else if (formData.cvLink.trim() && !formData.cvLink.startsWith('http://') && !formData.cvLink.startsWith('https://')) {
      errors.cv = isEn ? 'Please provide a valid URL starting with https://' : 'সঠিক লিঙ্ক দিন (যেমন: https://drive.google.com/...)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Application (Cloud Synced to Supabase)
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const currentStore = getManagementData();
    const cleanId = generateNextJobId(currentStore?.jobApplications || []);
    
    // Attempt Direct Supabase Storage Bucket Upload (Cloud CDN)
    let finalCvFile = formData.cvFile;
    if (formData.rawFile) {
      try {
        const fileExt = (formData.rawFile.name || 'cv.pdf').split('.').pop();
        const safeName = `cv_${cleanId}_${Date.now()}.${fileExt}`;
        const filePath = `candidates/${safeName}`;

        const cdnUrl = await uploadResumeToStorage(formData.rawFile, cleanId);
        if (cdnUrl) {
          // Blazing-fast CDN URL: store lightweight object without heavy base64!
          finalCvFile = {
            name: formData.rawFile.name,
            size: formData.rawFile.size,
            type: formData.rawFile.type || 'application/pdf',
            url: cdnUrl
          };
        }
      } catch (storageErr) {
        console.warn('Storage bucket upload fallback:', storageErr);
      }
    }

    const { rawFile, ...cleanedFormData } = formData;
    const payload = {
      ...cleanedFormData,
      cvFile: finalCvFile,
      id: cleanId,
      submittedPosition: formData.jobTitle || 'হিসাব ও প্রশাসন কর্মকর্তা',
      status: 'নতুন আবেদন',
      appliedDateBn: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      interviewDate: '',
      interviewTime: '',
      interviewLocation: 'আল-ইমারাহ হেড অফিস, পুরানা পল্টন, ঢাকা',
      requiredDocuments: 'মূল শিক্ষাগত সনদপত্র, ২ কপি ছবি ও এনআইডি কপি, হালনাগাদ জীবনবৃত্তান্ত (CV)',
      adminNotes: ''
    };
    
    // Save locally and push to Supabase cloud
    const saved = await saveJobApplication(payload);
    
    setIsSubmitting(false);
    setSelectedJobForApply(null);
    setSubmittedApplication(saved || payload);

    // Reset form
    setFormData({
      jobId: '',
      jobTitle: '',
      applicantName: '',
      phone: '',
      email: '',
      district: '',
      education: '',
      experienceYears: '',
      currentCompany: '',
      expectedSalary: '',
      cvFile: null,
      cvLink: '',
      coverNote: ''
    });
  };

  const handleCopyId = (id) => {
    if (!id) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(id);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = id;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="bg-[#FAFBF9] min-h-screen pb-24 text-[#231F20] font-sans antialiased">
      {/* ========================================================= */}
      {/* HERO SECTION (Clean White Executive Theme)                 */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-white text-[#231F20] pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-gray-100 shadow-2xs">
        {/* Subtle Ambient Light Glows */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          {/* Top Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#006231] text-xs sm:text-sm font-bold tracking-wide shadow-2xs">
            <Briefcase className="w-4 h-4 text-[#006231]" />
            <span>{isEn ? 'Career Opportunities at Al-Emarah' : 'ক্যারিয়ার সুযোগ ও নিয়োগ বিজ্ঞপ্তি'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#006231] animate-pulse"></span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto text-gray-900">
            <span>{isEn ? 'Build Your Rewarding Career with ' : 'আল-ইমারাহ পরিবারে গড়ে তুলুন '}</span>
            <span className="text-[#006231]">
              {isEn ? 'Al-Emarah Properties' : 'আপনার উজ্জ্বল ক্যারিয়ার'}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
            {isEn 
              ? 'Join our mission of planned, Shariah-compliant real estate development. We welcome committed professionals, accountants, and proactive officers.'
              : 'পরিকল্পিত ও হালাল আবাসন বিনির্মাণে আমাদের সাথে যুক্ত হোন। আমরা সৎ, দক্ষ ও পেশাদার প্রতিভাদের স্বাগত জানাই—একটি মর্যাদাশীল ও অগ্রসর কর্মপরিবেশে।'}
          </p>

          {/* Quick CTA Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a 
              href="#openings" 
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-[#006231] to-[#0A4D27] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#006231]/25 hover:opacity-95 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <span>{isEn ? 'Explore Open Positions' : 'বর্তমান পদসমূহ দেখুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => handleOpenApplyModal(null)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 shadow-2xs"
            >
              <FileText className="w-4 h-4 text-[#006231]" />
              <span>{isEn ? 'Drop Your CV (General)' : 'যেকোনো পদে সিভি জমা দিন'}</span>
            </button>

            <button
              onClick={() => {
                setShowTrackModal(true);
                setTrackQuery('');
                setTrackResult(null);
                setTrackHasSearched(false);
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#006231] font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 shadow-2xs"
            >
              <Search className="w-4 h-4 text-[#006231]" />
              <span>{isEn ? 'Track Application Status' : 'আবেদনের অগ্রগতি ট্র্যাক করুন'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4 CORE CAREER PILLARS (Mobile: 2 cols x 2 rows, compact)  */}
      {/* ========================================================= */}
      <section className="pt-6 sm:pt-14 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {careerPillars.map((pillar, idx) => {
            const icons = {
              ShieldCheck: ShieldCheck,
              TrendingUp: TrendingUp,
              GraduationCap: GraduationCap,
              Users2: Users2
            };
            const IconComponent = icons[pillar.icon] || ShieldCheck;

            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 border border-gray-200/90 shadow-2xs sm:shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-2 sm:space-y-3"
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-[#006231] border border-emerald-100 flex items-center justify-center shrink-0">
                  <IconComponent className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-lg font-black text-gray-900 leading-snug">
                    {isEn ? pillar.titleEn : pillar.titleBn}
                  </h3>
                  <p className="text-3xs sm:text-sm text-gray-600 mt-1 sm:mt-1.5 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {isEn ? pillar.descEn : pillar.descBn}
                  </p>
                </div>
                <div className="pt-1.5 sm:pt-2 border-t border-gray-100 flex items-center text-[10px] sm:text-2xs font-bold text-[#006231]">
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-emerald-600 shrink-0" />
                  <span className="truncate">{isEn ? 'Al-Emarah Standard' : 'প্রাতিষ্ঠানিক প্রতিশ্রুতি'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* CURRENT OPEN POSITIONS SECTION                            */}
      {/* ========================================================= */}
      <section id="openings" className="pt-16 sm:pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-[#006231] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'Active Vacancies' : 'চলমান নিয়োগ বিজ্ঞপ্তি'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              {isEn ? 'Current Job Openings' : 'বর্তমান চাকরির বিজ্ঞাপনসমূহ'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              {isEn 
                ? `Showing ${filteredJobs.length} active opportunities. Find your matching role and apply online.`
                : `বর্তমানে ${filteredJobs.length}টি সক্রিয় পদে নিয়োগ বিজ্ঞপ্তি চলমান রয়েছে। আপনার পছন্দের পদে আবেদন করুন।`}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Search by title, skill, location...' : 'পদের নাম, যোগ্যতা বা পদবি খুঁজুন...'}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006231]/20 focus:border-[#006231] transition-all shadow-2xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Department Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {departments.map((dept) => {
            const isActive = selectedDepartment === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#006231] text-white shadow-md shadow-[#006231]/20' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {isEn ? dept.labelEn : dept.labelBn}
              </button>
            );
          })}
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                {isEn ? 'No Matching Vacancies Found' : 'কোনো পদ পাওয়া যায়নি'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {isEn 
                  ? 'Try searching with different keywords or drop your CV spontaneously for future openings.'
                  : 'ভিন্ন শব্দ দিয়ে খুঁজুন অথবা ভবিষ্যতে সুযোগের জন্য নিচে আপনার সিভি ড্রপ করে রাখুন।'}
              </p>
            </div>
            <button
              onClick={() => { setSearchQuery(''); setSelectedDepartment('all'); }}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all"
            >
              {isEn ? 'Reset Filters' : 'ফিল্টার রিসেট করুন'}
            </button>
          </div>
        ) : (
          <div className={filteredJobs.length === 1 ? "max-w-3xl mx-auto w-full" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}>
            {filteredJobs.map((job) => {
              return (
                <div 
                  key={job.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Decorative corner glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 opacity-60 group-hover:scale-110 transition-transform"></div>

                  <div className="relative z-10 space-y-4">
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#006231] font-bold text-3xs uppercase tracking-wide border border-emerald-200">
                          {isEn ? job.departmentEn : job.departmentBn}
                        </span>
                        {job.badgeBn && (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#CE2028] font-black text-3xs border border-red-200/80">
                            {isEn ? job.badgeEn : job.badgeBn}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{isEn ? `Deadline: ${job.deadlineEn}` : `শেষ সময়: ${job.deadlineBn}`}</span>
                      </div>
                    </div>

                    {/* Job Title */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-[#006231] transition-colors leading-snug">
                        {isEn ? job.titleEn : job.titleBn}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed line-clamp-2">
                        {isEn ? job.overviewEn : job.overviewBn}
                      </p>
                    </div>

                    {/* Key Attributes Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="flex items-start space-x-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-[#CE2028] shrink-0 mt-0.5" />
                        <span className="leading-tight">{isEn ? job.locationEn : job.locationBn}</span>
                      </div>
                      <div className="flex items-start space-x-2 text-gray-700">
                        <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{isEn ? job.employmentTypeEn : job.employmentTypeBn}</span>
                      </div>
                      <div className="flex items-start space-x-2 text-gray-700">
                        <GraduationCap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span className="leading-tight truncate">{isEn ? job.educationEn : job.educationBn}</span>
                      </div>
                      <div className="flex items-start space-x-2 text-gray-700">
                        <DollarSign className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <span className="leading-tight font-bold text-gray-900">{isEn ? job.salaryEn : job.salaryBn}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="relative z-10 pt-5 mt-5 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenJobDetails(job)}
                        className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <span>{isEn ? 'View Details' : 'বিস্তারিত বিবরণ'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShareJob(job)}
                        className="p-2.5 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-[#006231] transition-all cursor-pointer border border-gray-200"
                        title={isEn ? 'Share Job' : 'শেয়ার করুন'}
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenApplyModal(job)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#006231] to-[#0A4D27] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#006231]/20 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Apply Online' : 'আবেদন করুন'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================= */}
        {/* DROP YOUR CV / SPONTANEOUS APPLICATION CALLOUT           */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1C1819] via-[#241F21] to-[#121011] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left max-w-xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>{isEn ? 'Talent Pool & General Application' : 'ট্যালেন্ট পুল ও সাধারণ আবেদন'}</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-white">
                {isEn ? 'Didn’t find the exact role for you?' : 'আপনার উপযুক্ত পদটি খুঁজে পাচ্ছেন না?'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                {isEn 
                  ? 'Drop your CV and portfolio directly with us. When new positions open in site engineering, corporate sales, or accounts, our recruitment team will reach out to you.'
                  : 'আপনার সিভি ও পোর্টফোলিও আমাদের ট্যালেন্ট পুলে জমা রাখুন। ভবিষ্যতে নতুন কোনো পদ সৃষ্টি হলে আমাদের এইচআর টিম আপনার সাথে যোগাযোগ করবে।'}
              </p>
            </div>

            <button
              onClick={() => handleOpenApplyModal(null)}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-[#006231] text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center space-x-2 cursor-pointer shrink-0 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>{isEn ? 'Submit Your CV Now' : 'সিভি জমা দিন (Drop CV)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FULL SCREEN JOB DETAILS VIEW                              */}
      {/* ========================================================= */}
      {selectedJobForDetails && (
        <div className="fixed inset-0 z-50 bg-[#FAFBF9] flex flex-col overflow-y-auto animate-fadeIn text-[#231F20]">
          {/* Top Sticky Navigation Bar */}
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleCloseJobDetails}
                className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isEn ? 'Back to Listings' : 'ফিরে যান'}</span>
              </button>

              <div className="hidden sm:block h-5 w-px bg-gray-200"></div>

              <div className="hidden sm:flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#006231] text-3xs font-bold uppercase tracking-wider border border-emerald-200">
                  {isEn ? selectedJobForDetails.departmentEn : selectedJobForDetails.departmentBn}
                </span>
                <span className="text-xs font-bold text-gray-700 truncate max-w-xs md:max-w-md">
                  {isEn ? selectedJobForDetails.titleEn : selectedJobForDetails.titleBn}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={() => handleShareJob(selectedJobForDetails)}
                className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-[#006231] font-bold text-xs flex items-center space-x-1.5 border border-gray-200 transition-all cursor-pointer"
                title={isEn ? 'Share Job' : 'শেয়ার করুন'}
              >
                <Share2 className="w-3.5 h-3.5 text-[#006231]" />
                <span className="hidden sm:inline">{isEn ? 'Share' : 'শেয়ার করুন'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenApplyModal(selectedJobForDetails)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#006231] to-[#0A4D27] text-white font-bold text-xs shadow-md shadow-[#006231]/20 hover:opacity-95 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isEn ? 'Apply for this Job' : 'এই পদে আবেদন করুন'}</span>
              </button>

              <button
                type="button"
                onClick={handleCloseJobDetails}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                title={isEn ? 'Close' : 'বন্ধ করুন'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Body: Responsive Wide Layout */}
          <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
            {/* Header Banner Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-bl-full -z-0 opacity-70 pointer-events-none"></div>

              <div className="relative z-10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#006231] font-bold text-xs uppercase tracking-wide border border-emerald-200">
                      {isEn ? selectedJobForDetails.departmentEn : selectedJobForDetails.departmentBn}
                    </span>
                    {selectedJobForDetails.badgeBn && (
                      <span className="px-3 py-1 rounded-full bg-red-50 text-[#CE2028] font-black text-xs border border-red-200">
                        {isEn ? selectedJobForDetails.badgeEn : selectedJobForDetails.badgeBn}
                      </span>
                    )}
                  </div>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-snug">
                  {isEn ? selectedJobForDetails.titleEn : selectedJobForDetails.titleBn}
                </h1>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal max-w-3xl">
                  {isEn ? selectedJobForDetails.overviewEn : selectedJobForDetails.overviewBn}
                </p>

                {/* Slogan pill */}
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-[#006231]">
                  <span>{selectedJobForDetails.mottoBn || 'বিশ্বস্ততা • স্বচ্ছতা • অংশীদারিত্ব'}</span>
                </div>
              </div>

              {/* 6-Metric Highlights Grid */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-gray-100 text-xs">
                <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200/80">
                  <span className="text-3xs text-gray-400 block uppercase font-bold mb-1 flex items-center space-x-1">
                    <Users className="w-3 h-3 text-[#006231]" />
                    <span>{isEn ? 'Vacancy' : 'পদসংখ্যা'}</span>
                  </span>
                  <span className="font-black text-gray-900 text-sm">{isEn ? selectedJobForDetails.vacancyEn : selectedJobForDetails.vacancyBn}</span>
                </div>

                <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200/80">
                  <span className="text-3xs text-gray-400 block uppercase font-bold mb-1 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>{isEn ? 'Job Type' : 'চাকরির ধরন'}</span>
                  </span>
                  <span className="font-bold text-gray-900">{isEn ? selectedJobForDetails.employmentTypeEn : selectedJobForDetails.employmentTypeBn}</span>
                </div>

                <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200/80">
                  <span className="text-3xs text-gray-400 block uppercase font-bold mb-1 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-[#CE2028]" />
                    <span>{isEn ? 'Location' : 'কর্মস্থল'}</span>
                  </span>
                  <span className="font-bold text-gray-900">{isEn ? selectedJobForDetails.locationEn : selectedJobForDetails.locationBn}</span>
                </div>

                <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200/80">
                  <span className="text-3xs text-gray-400 block uppercase font-bold mb-1 flex items-center space-x-1">
                    <GraduationCap className="w-3 h-3 text-blue-600" />
                    <span>{isEn ? 'Experience' : 'অভিজ্ঞতা'}</span>
                  </span>
                  <span className="font-bold text-gray-900">{isEn ? selectedJobForDetails.experienceEn : selectedJobForDetails.experienceBn}</span>
                </div>

                <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200/80">
                  <span className="text-3xs text-gray-400 block uppercase font-bold mb-1 flex items-center space-x-1">
                    <DollarSign className="w-3 h-3 text-purple-600" />
                    <span>{isEn ? 'Salary' : 'মাসিক বেতন'}</span>
                  </span>
                  <span className="font-black text-[#006231]">{isEn ? selectedJobForDetails.salaryEn : selectedJobForDetails.salaryBn}</span>
                </div>

                <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200/80">
                  <span className="text-3xs text-gray-400 block uppercase font-bold mb-1 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-amber-600" />
                    <span>{isEn ? 'Deadline' : 'আবেদনের শেষ সময়'}</span>
                  </span>
                  <span className="font-bold text-red-600">{isEn ? selectedJobForDetails.deadlineEn : selectedJobForDetails.deadlineBn}</span>
                </div>
              </div>
            </div>

            {/* 2-Column Details Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column (2 Cols): Details & Scope */}
              <div className="lg:col-span-2 space-y-8">
                {/* 1. Responsibilities */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2.5 pb-3 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#006231] flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-[#006231]" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-gray-900">
                        {isEn ? 'Key Responsibilities' : 'প্রধান দায়িত্বসমূহ'}
                      </h3>
                      <p className="text-xs text-gray-500">দায়িত্ব ও প্রাতিষ্ঠানিক কাজের পরিধি</p>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                    {(isEn ? selectedJobForDetails.responsibilitiesEn : selectedJobForDetails.responsibilitiesBn).map((resp, i) => {
                      const RespIcon = getJobResponsibilityIcon(selectedJobForDetails.id, i);
                      return (
                        <li key={i} className="flex items-start space-x-3.5 p-3 rounded-2xl bg-gray-50/70 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-200/80 transition-all group">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100/90 text-[#006231] group-hover:bg-[#006231] group-hover:text-white flex items-center justify-center shrink-0 mt-0.5 transition-colors shadow-2xs">
                            <RespIcon className="w-4 h-4" />
                          </div>
                          <span className="leading-relaxed text-gray-800 font-medium pt-1">{resp}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* 2. Educational Qualification & Skills */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2.5 pb-3 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-gray-900">
                        {isEn ? 'Qualifications & Requirements' : 'শিক্ষাগত যোগ্যতা ও প্রয়োজনীয় দক্ষতা'}
                      </h3>
                      <p className="text-xs text-gray-500">আবেদনকারীর কাঙ্ক্ষিত শিক্ষাগত মান ও অভিজ্ঞতা</p>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-xs sm:text-sm text-blue-950 font-bold flex items-center space-x-2.5">
                    <GraduationCap className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>{isEn ? selectedJobForDetails.educationEn : selectedJobForDetails.educationBn}</span>
                  </div>

                  <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                    {(isEn ? selectedJobForDetails.requirementsEn : selectedJobForDetails.requirementsBn).map((req, i) => {
                      const ReqIcon = getJobRequirementIcon(selectedJobForDetails.id, i);
                      return (
                        <li key={i} className="flex items-start space-x-3.5 p-3 rounded-2xl bg-gray-50/70 hover:bg-blue-50/50 border border-gray-100 hover:border-blue-200/80 transition-all group">
                          <div className="w-8 h-8 rounded-xl bg-blue-100/90 text-blue-700 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center shrink-0 mt-0.5 transition-colors shadow-2xs">
                            <ReqIcon className="w-4 h-4" />
                          </div>
                          <span className="leading-relaxed text-gray-800 font-medium pt-1">{req}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* 3. Compensation & Perks */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2.5 pb-3 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-gray-900">
                        {isEn ? 'Compensation & Benefits' : 'বেতন ও অন্যান্য সুযোগ-সুবিধা'}
                      </h3>
                      <p className="text-xs text-gray-500">আকর্ষণীয় সুযোগ ও প্রাতিষ্ঠানিক সুবিধা</p>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                    {(isEn ? selectedJobForDetails.benefitsEn : selectedJobForDetails.benefitsBn).map((ben, i) => {
                      const BenIcon = getJobBenefitIcon(selectedJobForDetails.id, i);
                      return (
                        <li key={i} className="flex items-start space-x-3.5 p-3 rounded-2xl bg-gray-50/70 hover:bg-purple-50/50 border border-gray-100 hover:border-purple-200/80 transition-all group">
                          <div className="w-8 h-8 rounded-xl bg-purple-100/90 text-purple-700 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center shrink-0 mt-0.5 transition-colors shadow-2xs">
                            <BenIcon className="w-4 h-4" />
                          </div>
                          <span className="leading-relaxed text-gray-800 font-medium pt-1">{ben}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Right Sidebar (1 Col): Apply & Contact */}
              <div className="space-y-6">
                {/* Apply Action Card */}
                <div className="bg-gradient-to-br from-[#006231] to-[#0A4D27] text-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-[#006231]/20 space-y-5">
                  <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-3xs font-bold uppercase tracking-wider">
                    {isEn ? 'Direct Application' : 'সরাসরি আবেদন'}
                  </div>
                  <div>
                    <h4 className="text-xl font-black">আবেদন করতে চান?</h4>
                    <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                      অনলাইন আবেদন ফরম পূরণ করে আপনার সিভি বা বায়োডাটার ড্রাইভ লিঙ্ক জমা দিন।
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenApplyModal(selectedJobForDetails)}
                    className="w-full py-3.5 px-4 rounded-xl bg-white text-[#006231] font-black text-xs hover:bg-emerald-50 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isEn ? 'Apply Online Now' : 'অনলাইনে এখনই আবেদন করুন'}</span>
                  </button>

                  <div className="pt-3 border-t border-white/15 text-3xs text-emerald-200 text-center">
                    শেষ তারিখ: <strong>{isEn ? selectedJobForDetails.deadlineEn : selectedJobForDetails.deadlineBn}</strong>
                  </div>
                </div>

                {/* Direct Contact Card */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                    {isEn ? 'Recruitment Support' : 'যোগাযোগ ও আবেদন পদ্ধতি'}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    আগ্রহী প্রার্থীদের হালনাগাদ CV সরাসরি অনলাইনে সাবমিট করার জন্য অথবা আমাদের অফিসিয়াল ই-মেইল ঠিকানায় পাঠানোর জন্য অনুরোধ করা হচ্ছে।
                  </p>

                  <div className="space-y-3 pt-2 text-xs">
                    <a
                      href={`mailto:${selectedJobForDetails.contactEmail || 'alemarah.officialbd@gmail.com'}`}
                      className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-800 hover:text-[#006231] transition-all border border-gray-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#006231] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-3xs text-gray-400 block font-bold">ই-মেইল</span>
                        <span className="font-bold font-mono text-xs truncate block">{selectedJobForDetails.contactEmail || 'alemarah.officialbd@gmail.com'}</span>
                      </div>
                    </a>

                    <a
                      href="tel:01816233013"
                      className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-800 hover:text-[#006231] transition-all border border-gray-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#006231] flex items-center justify-center shrink-0">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-3xs text-gray-400 block font-bold">হটলাইন / যোগাযোগ</span>
                        <span className="font-bold font-mono text-xs">{selectedJobForDetails.contactPhone || '01816-233013 / 01918-646575'}</span>
                      </div>
                    </a>

                    <a
                      href="https://wa.me/8801816233013"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-3 p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] transition-all border border-[#25D366]/30"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0">
                        <Send className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-3xs text-gray-500 block font-bold">WhatsApp যোগাযোগ</span>
                        <span className="font-bold font-mono text-xs">+880 1816-233013</span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Company Values */}
                <div className="bg-emerald-50/60 rounded-3xl p-6 border border-emerald-200/70 text-center space-y-2.5">
                  <img 
                    src="/alemarah_logo_header.svg" 
                    alt="Al-Emarah Properties Limited" 
                    className="h-12 sm:h-14 w-auto mx-auto object-contain drop-shadow-2xs"
                  />
                  <div className="text-xs text-[#006231] font-black tracking-wide pt-1">
                    {selectedJobForDetails.mottoBn || 'বিশ্বস্ততা • স্বচ্ছতা • অংশীদারিত্ব'}
                  </div>
                  <div className="text-3xs text-gray-600 font-medium">
                    {selectedJobForDetails.locationBn || 'পুরানা পল্টন, ঢাকা'}
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Sticky Bottom Bar */}
          <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
            <button
              type="button"
              onClick={handleCloseJobDetails}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-100 cursor-pointer"
            >
              {isEn ? 'Close & Return' : 'ফিরে যান'}
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleShareJob(selectedJobForDetails)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-emerald-50 text-gray-700 hover:text-[#006231] font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#006231]" />
                <span>{isEn ? 'Share Job' : 'শেয়ার করুন'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenApplyModal(selectedJobForDetails)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#006231] to-[#0A4D27] text-white font-bold text-xs shadow-md shadow-[#006231]/20 hover:opacity-95 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isEn ? 'Apply for this Job' : 'এই পদে আবেদন করুন'}</span>
              </button>
            </div>
          </footer>
        </div>
      )}

                  {/* ========================================================= */}
      {/* MODAL: JOB SHARE MODAL (UNIQUE URL & 1-CLICK SHARING)     */}
      {/* ========================================================= */}
      {shareJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-emerald-100">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-3.5">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#006231] flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-[#006231]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    {isEn ? 'Share Job Opening' : 'নিয়োগ বিজ্ঞপ্তি শেয়ার করুন'}
                  </h3>
                  <p className="text-3xs text-gray-500">
                    {isEn ? 'Direct link to this specific circular' : 'এই চাকরির সরাসরি লিংক ও সোশ্যাল শেয়ারিং'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShareJob(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Job Summary Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
              <span className="text-3xs font-bold text-[#006231] uppercase tracking-wide">
                {isEn ? shareJob.departmentEn : shareJob.departmentBn}
              </span>
              <h4 className="text-sm font-black text-gray-900">
                {isEn ? shareJob.titleEn : shareJob.titleBn}
              </h4>
              <p className="text-3xs text-gray-500">
                {shareJob.companyName || 'Al-Imarah Properties'} • {isEn ? shareJob.locationEn : shareJob.locationBn}
              </p>
            </div>

            {/* Direct Copy Link Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                {isEn ? 'Direct Shareable URL' : 'চাকরির সরাসরি ইউনিক লিংক'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getJobShareUrl(shareJob.id)}
                  className="flex-1 px-3 py-2 text-xs font-mono bg-gray-50 border border-gray-200 rounded-xl text-gray-700 select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopyShareUrl(shareJob.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer shrink-0 ${
                    shareCopied 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-[#006231] hover:bg-[#0A4D27] text-white shadow-xs'
                  }`}
                >
                  {shareCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Copied!' : 'কপি হয়েছে'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Copy' : 'কপি'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 1-Click Social Share Buttons */}
            <div className="space-y-2 pt-2">
              <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider block">
                {isEn ? 'Quick Share To' : 'এক ক্লিকে সোশ্যাল শেয়ার করুন'}
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `💼 আল-ইমারাহ প্রোপার্টিজ লিমিটেডে নতুন নিয়োগ বিজ্ঞপ্তি!

📌 পদ: ${isEn ? shareJob.titleEn : shareJob.titleBn}
🏢 প্রতিষ্ঠান: ${shareJob.companyName || 'আল-ইমারাহ প্রোপার্টিজ'}
📍 কর্মস্থল: ${isEn ? shareJob.locationEn : shareJob.locationBn}
⏰ শেষ সময়: ${isEn ? shareJob.deadlineEn : shareJob.deadlineBn}

বিস্তারিত দেখুন ও সরাসরি অনলাইনে আবেদন করুন:
${getJobShareUrl(shareJob.id)}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-xs flex items-center justify-center space-x-1.5 border border-[#25D366]/30 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getJobShareUrl(shareJob.id))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center space-x-1.5 border border-blue-200 transition-all cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Facebook</span>
                </a>
              </div>

              {/* Native Device Share (Mobile support) */}
              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.share({
                      title: isEn ? shareJob.titleEn : shareJob.titleBn,
                      text: `আল-ইমারাহ প্রোপার্টিজে ক্যারিয়ার সুযোগ: ${isEn ? shareJob.titleEn : shareJob.titleBn}`,
                      url: getJobShareUrl(shareJob.id)
                    }).catch(() => {});
                  }}
                  className="w-full mt-1.5 py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isEn ? 'More Sharing Options' : 'ডিভাইসের অন্যান্য অ্যাপে শেয়ার করুন'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: APPLY ONLINE FORM MODAL                          */}
      {/* ========================================================= */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col justify-between">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-start justify-between z-10">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-[#006231] text-3xs font-bold uppercase tracking-wider mb-1">
                  <Send className="w-3 h-3" />
                  <span>{isEn ? 'Online Job Application' : 'অনলাইন চাকরির আবেদন'}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900">
                  {formData.jobTitle || (isEn ? 'Apply Now' : 'আবেদন ফরম')}
                </h3>
              </div>

              <button
                onClick={() => setSelectedJobForApply(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitApplication} className="p-6 space-y-4 text-xs sm:text-sm">
              {/* Position Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isEn ? 'Applying For Position *' : 'আবেদনের পদ *'}
                </label>
                <select
                  value={formData.jobId}
                  onChange={(e) => {
                    const found = jobsData.find(j => j.id === e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      jobId: e.target.value,
                      jobTitle: found ? (isEn ? found.titleEn : found.titleBn) : 'সাধারণ আবেদন (Drop CV)'
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#006231]/20 focus:border-[#006231]"
                >
                  {jobsData.map(j => (
                    <option key={j.id} value={j.id}>
                      {isEn ? j.titleEn : j.titleBn}
                    </option>
                  ))}
                  <option value="general-drop-cv">
                    {isEn ? 'General / Spontaneous Application (Drop CV)' : 'সাধারণ / স্বতঃস্ফূর্ত আবেদন (Drop CV)'}
                  </option>
                </select>
              </div>

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? 'Applicant Full Name *' : 'আবেদনকারীর পূর্ণ নাম *'}
                  </label>
                  <input
                    type="text"
                    value={formData.applicantName}
                    onChange={(e) => setFormData(prev => ({ ...prev, applicantName: e.target.value }))}
                    placeholder={isEn ? 'e.g. Engr. Arifur Rahman' : 'যেমন: আরিফুল ইসলাম'}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${formErrors.applicantName ? 'border-red-500 bg-red-50/30' : 'border-gray-200 bg-gray-50'} text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006231]/20 focus:border-[#006231]`}
                  />
                  {formErrors.applicantName && <p className="text-3xs text-red-600 mt-0.5">{formErrors.applicantName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? 'Mobile Phone *' : 'মোবাইল নম্বর *'}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="017XXXXXXXX"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${formErrors.phone ? 'border-red-500 bg-red-50/30' : 'border-gray-200 bg-gray-50'} text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006231]/20 focus:border-[#006231]`}
                  />
                  {formErrors.phone && <p className="text-3xs text-red-600 mt-0.5">{formErrors.phone}</p>}
                </div>
              </div>

              {/* Email & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? 'Email Address' : 'ইমেইল অ্যাড্রেস (যদি থাকে)'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006231]/20 focus:border-[#006231]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? 'Present District / Address *' : 'বর্তমান জেলা / ঠিকানা *'}
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                    placeholder={isEn ? 'e.g. Demra, Dhaka' : 'যেমন: সানারপাড় / ডেমরা, ঢাকা'}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${formErrors.district ? 'border-red-500 bg-red-50/30' : 'border-gray-200 bg-gray-50'} text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006231]/20 focus:border-[#006231]`}
                  />
                  {formErrors.district && <p className="text-3xs text-red-600 mt-0.5">{formErrors.district}</p>}
                </div>
              </div>

              {/* Education & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? 'Highest Qualification *' : 'সর্বোচ্চ শিক্ষাগত যোগ্যতা *'}
                  </label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                    placeholder={isEn ? 'e.g. B.Sc in Civil / BBA' : 'যেমন: ডিপ্লোমা ইন সিভিল / BBA'}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${formErrors.education ? 'border-red-500 bg-red-50/30' : 'border-gray-200 bg-gray-50'} text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006231]/20 focus:border-[#006231]`}
                  />
                  {formErrors.education && <p className="text-3xs text-red-600 mt-0.5">{formErrors.education}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? 'Total Experience (Years)' : 'কাজের মোট অভিজ্ঞতা (বছর)'}
                  </label>
                  <input
                    type="text"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: e.target.value }))}
                    placeholder={isEn ? 'e.g. 3.5 Years' : 'যেমন: ৩ বছর'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006231]/20 focus:border-[#006231]"
                  />
                </div>
              </div>

              {/* Current Company & Expected Salary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? 'Current / Last Organization' : 'বর্তমান / সর্বশেষ প্রতিষ্ঠান'}
                  </label>
                  <input
                    type="text"
                    value={formData.currentCompany}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentCompany: e.target.value }))}
                    placeholder={isEn ? 'e.g. ABC Developers Ltd' : 'প্রতিষ্ঠানের নাম'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006231]/20 focus:border-[#006231]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? 'Expected Monthly Salary (BDT)' : 'প্রত্যাশিত মাসিক বেতন (টাকা)'}
                  </label>
                  <input
                    type="text"
                    value={formData.expectedSalary}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedSalary: e.target.value }))}
                    placeholder={isEn ? 'e.g. 35,000' : 'যেমন: ৩৫,০০০ (বা আলোচনা সাপেক্ষে)'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006231]/20 focus:border-[#006231]"
                  />
                </div>
              </div>

              {/* Direct CV File Upload / Drive Link */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#006231]" />
                    <span>{isEn ? 'Upload CV / Resume (Direct File) *' : 'সিভি / জীবনবৃত্তান্ত জমা দিন (সরাসরি ফাইল আপলোড) *'}</span>
                  </span>
                  <span className="text-3xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                    {isEn ? 'PDF, DOCX, Image' : 'PDF, DOCX বা ছবি'}
                  </span>
                </label>

                {formData.cvFile ? (
                  /* Uploaded File Pill Card */
                  <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-[#006231] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-gray-900 truncate">
                          {formData.cvFile.name}
                        </p>
                        <p className="text-3xs text-gray-500 flex items-center space-x-1.5 mt-0.5">
                          <span>{(formData.cvFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                          <span>•</span>
                          <span className="text-[#006231] font-bold">সফলভাবে সংযুক্ত হয়েছে</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, cvFile: null, rawFile: null }))}
                      className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                      title={isEn ? 'Remove File' : 'ফাইলটি বাদ দিন'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* File Dropzone / Picker */
                  <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/60 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024) {
                          alert(isEn ? 'File size must be under 5 MB' : 'ফাইলের সাইজ সর্বোচ্চ ৫ মেগাবাইট (5 MB) হতে হবে।');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setFormData(prev => ({
                            ...prev,
                            rawFile: file,
                            cvFile: {
                              name: file.name,
                              size: file.size,
                              type: file.type || 'application/pdf',
                              dataUrl: event.target.result
                            }
                          }));
                          if (formErrors.cv) {
                            setFormErrors(prev => ({ ...prev, cv: '' }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    <div className="w-11 h-11 rounded-2xl bg-white group-hover:scale-105 text-[#006231] shadow-2xs flex items-center justify-center mb-2 transition-transform">
                      <UploadCloud className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-xs font-black text-gray-800">
                      {isEn ? 'Click to select or upload CV from device' : 'এখানে ক্লিক করে ডিভাইস থেকে সরাসরি সিভি ফাইল আপলোড করুন'}
                    </span>
                    <span className="text-3xs text-gray-500 mt-1">
                      {isEn ? 'Supported: PDF, Word (DOCX) or Image (Max 5MB)' : 'সাপোর্টেড ফরম্যাট: PDF, Word (DOCX) বা ছবি (সর্বোচ্চ ৫ মেগাবাইট)'}
                    </span>
                  </label>
                )}

                {/* Alternative Drive Link toggle/input */}
                <div className="pt-1">
                  <div className="flex items-center space-x-2 text-3xs text-gray-400 mb-1.5">
                    <span className="h-px bg-gray-200 flex-1"></span>
                    <span>{isEn ? 'OR paste Google Drive / Dropbox link (Alternative)' : 'অথবা গুগল ড্রাইভ / ড্রপবক্স লিঙ্ক দিন (বিকল্প)'}</span>
                    <span className="h-px bg-gray-200 flex-1"></span>
                  </div>
                  <div className="relative">
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="url"
                      value={formData.cvLink}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, cvLink: e.target.value }));
                        if (formErrors.cv) setFormErrors(prev => ({ ...prev, cv: '' }));
                      }}
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006231]/20 focus:border-[#006231]"
                    />
                  </div>
                </div>

                {formErrors.cv && <p className="text-3xs text-red-600 mt-0.5">{formErrors.cv}</p>}
              </div>

              {/* Cover Note */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isEn ? 'Brief Cover Note / Why You (Optional)' : 'সংক্ষিপ্ত বক্তব্য / কেন আপনি এই পদের জন্য উপযুক্ত (ঐচ্ছিক)'}
                </label>
                <textarea
                  rows={2}
                  value={formData.coverNote}
                  onChange={(e) => setFormData(prev => ({ ...prev, coverNote: e.target.value }))}
                  placeholder={isEn ? 'Write a short message to our HR panel...' : 'আপনার বিশেষ দক্ষতা বা বক্তব্য সংক্ষেপে লিখুন...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006231]/20 focus:border-[#006231]"
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJobForApply(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-100 cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'বাতিল'}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#006231] to-[#0A4D27] text-white font-bold text-xs shadow-md shadow-[#006231]/20 hover:opacity-95 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? (
                    <span>{isEn ? 'Submitting...' : 'জমা হচ্ছে...'}</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Submit Application' : 'আবেদন জমা দিন'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: APPLICATION SUCCESS RECEIPT MODAL                */}
      {/* ========================================================= */}
      {submittedApplication && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl border border-emerald-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#006231] mx-auto flex items-center justify-center shadow-inner">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-[#006231] text-3xs font-bold uppercase tracking-wider">
                {isEn ? 'Application Received' : 'আবেদন সফলভাবে গৃহীত হয়েছে'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                {isEn ? 'Thank You for Applying!' : 'ধন্যবাদ! আপনার আবেদন জমা হয়েছে'}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isEn 
                  ? `Your application for "${submittedApplication.submittedPosition}" has reached our HR department.`
                  : `"${submittedApplication.submittedPosition}" পদে আপনার আবেদন আল-ইমারাহ রিক্রুটমেন্ট প্যানেলে সংরক্ষিত হয়েছে।`}
              </p>
            </div>

            {/* Tracking ID (Clean, compact & without outer box) */}
            <div className="py-1 space-y-1.5 text-center">
              <div className="inline-flex items-center justify-center gap-2 flex-wrap">
                <span className="text-xs text-gray-600 font-medium">
                  {isEn ? 'Tracking No:' : 'ট্র্যাকিং নম্বর:'}
                </span>
                <span className="font-mono text-sm sm:text-base font-black text-[#006231] tracking-wider select-all bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  {submittedApplication.id || 'AL-JOB-2026-1001'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyId(submittedApplication.id || 'AL-JOB-2026-1001')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-[#006231] text-xs font-bold cursor-pointer transition-all active:scale-95 border border-gray-200/80"
                  title="কপি করুন"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 text-3xs font-black">কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#006231]" />
                      <span className="text-3xs font-bold text-[#006231]">কপি</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-3xs text-gray-400">
                {isEn
                  ? 'Keep this tracking number for future interview and status updates.'
                  : 'পরবর্তীতে ইন্টারভিউ শিডিউল ও স্ট্যাটাস ট্র্যাক করতে নম্বরটি সংরক্ষণ করুন।'}
              </p>
            </div>

            <div className="text-3xs text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
              {isEn 
                ? 'Shortlisted candidates will be contacted via mobile phone or email for a preliminary interview.'
                : 'বাছাইকৃত প্রার্থীদের মোবাইল বা ইমেইলের মাধ্যমে প্রাথমিক সাক্ষাৎকারের জন্য ডাকা হবে।'}
            </div>

            {/* Direct Instant Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <a
                href={`https://wa.me/8801816233013?text=${encodeURIComponent(`আসসালামু আলাইকুম। আমি আল-ইমারাহ প্রপার্টিজের "${submittedApplication.submittedPosition || submittedApplication.jobTitle || 'Accounts & Admin'}" পদে আবেদন করেছি। আমার ট্র্যাকিং আইডি: ${submittedApplication.id}। আমার মোবাইল: ${submittedApplication.phone}।`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm"
              >
                <span>হোয়াটসঅ্যাপে সিভি ফরোয়ার্ড করুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`mailto:alemarah.officialbd@gmail.com?subject=${encodeURIComponent(`Job Application - ${submittedApplication.submittedPosition || submittedApplication.jobTitle} - ${submittedApplication.id}`)}&body=${encodeURIComponent(`আবেদনকারীর নাম: ${submittedApplication.applicantName || ''}\nমোবাইল: ${submittedApplication.phone || ''}\nট্র্যাকিং আইডি: ${submittedApplication.id}\nসিভি ড্রাইভ লিঙ্ক: ${submittedApplication.cvLink || ''}\n`)}`}
                className="w-full py-2.5 px-4 rounded-xl bg-[#006231] hover:bg-[#0A4D27] text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm"
              >
                <span>ইমেইলে পাঠান</span>
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>

            <button
              type="button"
              onClick={() => setSubmittedApplication(null)}
              className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-all cursor-pointer border border-gray-200"
            >
              {isEn ? 'Close Window' : 'ঠিক আছে, সম্পন্ন করুন'}
            </button>
          </div>
        </div>
      )}
      {/* ========================================================= */}
      {/* MODAL 4: TRACK APPLICATION STATUS & INTERVIEW LETTER      */}
      {/* ========================================================= */}
      {showTrackModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-[#006231] text-3xs font-bold uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3 h-3 text-[#006231]" />
                  <span>{isEn ? 'Career Portal' : 'ক্যারিয়ার পোর্টাল ট্র্যাকিং'}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900">
                  {isEn ? 'Track Application Status' : 'আবেদনের স্ট্যাটাস ও ইন্টারভিউ শিডিউল'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isEn ? 'Enter your Tracking ID or Mobile number' : 'আপনার ট্র্যাকিং নম্বর (যেমন: AL-JOB-2026-...) বা মোবাইল নম্বর দিন'}
                </p>
              </div>
              <button
                onClick={() => setShowTrackModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Box */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!trackQuery.trim()) return;
                let res = findJobApplication(trackQuery.trim());
                if (!res) {
                  // Fallback: fetch directly from Supabase Cloud
                  const remoteApps = await fetchJobApplicationsFromSupabase();
                  const q = trackQuery.trim().toLowerCase();
                  const digits = q.replace(/[^0-9]/g, '');
                  res = remoteApps.find(a => {
                    const matchId = a.id && a.id.toLowerCase() === q;
                    const cleanPhone = (a.phone || '').replace(/[^0-9]/g, '');
                    const matchPhone = digits.length >= 8 && cleanPhone.includes(digits);
                    return matchId || matchPhone;
                  }) || null;
                }
                setTrackResult(res);
                setTrackHasSearched(true);
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder={isEn ? 'Tracking ID or Phone Number...' : 'যেমন: AL-JOB-2026-XXXX বা মোবাইল নম্বর'}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006231]/20 focus:border-[#006231]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#006231] hover:bg-[#0A4D27] text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0 active:scale-95"
              >
                {isEn ? 'Check Status' : 'খুঁজুন'}
              </button>
            </form>

            {/* Results */}
            {trackHasSearched && (
              <div className="space-y-4 pt-1">
                {trackResult ? (
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4 animate-fadeIn">
                    {/* Applicant Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
                      <div>
                        <span className="text-3xs text-gray-400 uppercase font-bold block">আবেদনকারী</span>
                        <h4 className="text-base font-black text-gray-900">{trackResult.applicantName}</h4>
                        <p className="text-xs text-gray-600 font-medium">{trackResult.jobTitle || trackResult.submittedPosition}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xs text-gray-400 uppercase font-bold block">আবেদনের তারিখ</span>
                        <span className="text-xs font-mono font-bold text-gray-700">{trackResult.date || trackResult.appliedDateBn}</span>
                      </div>
                    </div>

                    {/* Tracking ID with Copy */}
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200">
                      <div>
                        <span className="text-3xs text-gray-400 uppercase font-bold block">ট্র্যাকিং নম্বর</span>
                        <span className="font-mono text-sm font-black text-[#006231]">{trackResult.id}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyId(trackResult.id)}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center space-x-1 cursor-pointer transition-all"
                      >
                        {copiedId ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-black">কপি হয়েছে! ✓</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>কপি</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Status Display */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200">
                        <span className="text-xs font-bold text-gray-700">বর্তমান স্ট্যাটাস:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${
                          (trackResult.status || '').includes('ইন্টারভিউ') || (trackResult.status || '').includes('নির্বাচিত')
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : (trackResult.status || '').includes('দুঃখিত')
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {trackResult.status || 'নতুন আবেদন (Under Review)'}
                        </span>
                      </div>

                      {/* If Interview Scheduled */}
                      {(trackResult.interviewDate || (trackResult.status || '').includes('ইন্টারভিউ')) ? (
                        <div className="bg-emerald-50/80 rounded-2xl p-4 sm:p-5 border border-emerald-200 space-y-3">
                          <div className="flex items-center space-x-2 text-[#006231] font-black text-sm border-b border-emerald-200 pb-2">
                            <Calendar className="w-4 h-4 text-[#006231]" />
                            <span>অফিসিয়াল সাক্ষাৎকার / ইন্টারভিউ নোটিশ</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="bg-white p-3 rounded-xl border border-emerald-100">
                              <span className="text-3xs text-gray-400 uppercase font-bold block">তারিখ ও সময়</span>
                              <span className="font-black text-gray-900 text-sm">
                                {trackResult.interviewDate} {trackResult.interviewTime ? `— ${trackResult.interviewTime}` : ''}
                              </span>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-emerald-100">
                              <span className="text-3xs text-gray-400 uppercase font-bold block">স্থান / ঠিকানা</span>
                              <span className="font-bold text-gray-900 leading-snug">
                                {trackResult.interviewLocation || 'আল-ইমারাহ হেড অফিস, পুরানা পল্টন, ঢাকা'}
                              </span>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs space-y-1">
                            <span className="text-3xs text-emerald-700 uppercase font-bold block">যা যা সাথে আনতে হবে:</span>
                            <p className="text-gray-800 font-medium">
                              {trackResult.requiredDocuments || 'মূল শিক্ষাগত সনদপত্র, ২ কপি ছবি ও এনআইডি কপি, হালনাগাদ জীবনবৃত্তান্ত'}
                            </p>
                          </div>

                          {trackResult.adminNotes && (
                            <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs space-y-0.5">
                              <span className="text-3xs text-amber-800 uppercase font-bold block">এইচআর নির্দেশনা / নোট:</span>
                              <p className="text-gray-800">{trackResult.adminNotes}</p>
                            </div>
                          )}

                          <div className="pt-1 flex flex-wrap items-center gap-2">
                            <a
                              href="https://wa.me/8801816233013"
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-2xs"
                            >
                              <span>WhatsApp যোগাযোগ</span>
                            </a>
                            <a
                              href="tel:01816233013"
                              className="flex-1 py-2 px-3 rounded-xl bg-[#006231] hover:bg-[#0A4D27] text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-2xs"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>অফিসে কল</span>
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed space-y-1">
                          <p className="font-bold flex items-center space-x-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>আবেদন বর্তমানে পর্যালোচনাধীন রয়েছে</span>
                          </p>
                          <p className="text-amber-800 text-3xs">
                            আপনার আবেদনটি আমাদের রিক্রুটমেন্ট প্যানেল দ্বারা পর্যালোচনা করা হচ্ছে। প্রাথমিক বাছাইয়ে নির্বাচিত হলে আপনার মোবাইল নম্বর অথবা হোয়াটসঅ্যাপে সরাসরি ইন্টারভিউয়ের তারিখ ও সময় জানানো হবে।
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-200 text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
                    <h4 className="text-sm font-black text-red-800">কোনো তথ্য পাওয়া যায়নি</h4>
                    <p className="text-xs text-red-600">
                      আপনার ট্র্যাকিং নম্বর (যেমন: AL-JOB-2026-XXXX) বা আবেদনকালে দেওয়া মোবাইল নম্বরটি সঠিকভাবে প্রদান করুন।
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
