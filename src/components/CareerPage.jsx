import React, { useState, useMemo } from 'react';
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
  FolderOpen
} from 'lucide-react';
import { jobsData, careerPillars } from '../data/jobsData';
import { saveJobApplication } from '../data/managementStore';

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
    cvLink: '',
    coverNote: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Departments List
  const departments = useMemo(() => {
    const list = [
      { id: 'all', labelBn: 'সকল বিভাগ', labelEn: 'All Departments' },
      { id: 'Administration', labelBn: 'প্রশাসন ও মানবসম্পদ', labelEn: 'Administration & HR' },
      { id: 'Engineering', labelBn: 'প্রকৌশল ও নির্মাণ', labelEn: 'Engineering & Construction' },
      { id: 'Sales', labelBn: 'সেলস ও মার্কেটিং', labelEn: 'Sales & Marketing' },
      { id: 'Accounts', labelBn: 'হিসাব ও অর্থায়ন', labelEn: 'Accounts & Finance' },
      { id: 'Branding', labelBn: 'ব্র্যান্ডিং ও মিডিয়া', labelEn: 'Branding & Media' }
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
          job.departmentBn.includes(selectedDepartment);
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
    if (!formData.cvLink.trim()) {
      errors.cvLink = isEn ? 'CV / Resume link is required' : 'সিভি বা বায়োডাটার লিঙ্ক (Google Drive / Dropbox) প্রদান করুন';
    } else if (!formData.cvLink.startsWith('http://') && !formData.cvLink.startsWith('https://')) {
      errors.cvLink = isEn ? 'Please provide a valid URL starting with https://' : 'সঠিক লিঙ্ক দিন (যেমন: https://drive.google.com/...)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Application
  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const payload = {
        ...formData,
        submittedPosition: formData.jobTitle || 'General Application',
        status: 'নতুন আবেদন (Under Review)',
        appliedDateBn: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
      };
      const saved = saveJobApplication(payload);
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
        cvLink: '',
        coverNote: ''
      });
    }, 700);
  };

  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard?.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="bg-[#FAFBF9] min-h-screen pb-24 text-[#231F20] font-sans antialiased">
      {/* ========================================================= */}
      {/* HERO SECTION                                              */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C1819] via-[#241F21] to-[#1C1819] text-white pt-16 pb-20 sm:pt-20 sm:pb-28">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#CE2028]/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#006231]/25 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          {/* Top Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-emerald-400 text-xs sm:text-sm font-bold tracking-wide backdrop-blur-md">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>{isEn ? 'Career Opportunities at Al-Emarah' : 'ক্যারিয়ার সুযোগ ও নিয়োগ বিজ্ঞপ্তি'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            <span>{isEn ? 'Build Your Rewarding Career with ' : 'আল-ইমারাহ পরিবারে গড়ে তুলুন '}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-[#8EBF40]">
              {isEn ? 'Al-Emarah Properties' : 'আপনার উজ্জ্বল ক্যারিয়ার'}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {isEn 
              ? 'Join our mission of planned, Shariah-compliant real estate development. We welcome committed professionals, visionary engineers, and proactive sales leaders.'
              : 'পরিকল্পিত ও হালাল আবাসন বিনির্মাণে আমাদের সাথে যুক্ত হোন। আমরা সৎ, দক্ষ ও পেশাদার প্রতিভাদের স্বাগত জানাই—একটি মর্যাদাশীল ও অগ্রসর কর্মপরিবেশে।'}
          </p>

          {/* Quick CTA Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a 
              href="#openings" 
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#006231] to-[#0A4D27] text-white font-bold text-sm shadow-lg shadow-[#006231]/30 hover:opacity-95 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <span>{isEn ? 'Explore Open Positions' : 'বর্তমান পদসমূহ দেখুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => handleOpenApplyModal(null)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{isEn ? 'Drop Your CV (General)' : 'যেকোনো পদে সিভি জমা দিন'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4 CORE CAREER PILLARS                                     */}
      {/* ========================================================= */}
      <section className="-mt-10 sm:-mt-14 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-md shadow-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006231] border border-emerald-100 flex items-center justify-center shrink-0">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 leading-snug">
                    {isEn ? pillar.titleEn : pillar.titleBn}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1.5 leading-relaxed">
                    {isEn ? pillar.descEn : pillar.descBn}
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-100 flex items-center text-3xs sm:text-2xs font-bold text-[#006231]">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  <span>{isEn ? 'Al-Emarah Standard' : 'প্রাতিষ্ঠানিক প্রতিশ্রুতি'}</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <button
                      type="button"
                      onClick={() => setSelectedJobForDetails(job)}
                      className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <span>{isEn ? 'View Details' : 'বিস্তারিত বিবরণ'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

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
      {/* MODAL 1: JOB DETAILS MODAL                                */}
      {/* ========================================================= */}
      {selectedJobForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col justify-between">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-start justify-between z-10">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-[#006231] text-3xs font-bold uppercase tracking-wider mb-2">
                  {isEn ? selectedJobForDetails.departmentEn : selectedJobForDetails.departmentBn}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  {isEn ? selectedJobForDetails.titleEn : selectedJobForDetails.titleBn}
                </h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-[#CE2028]" />
                  <span>{isEn ? selectedJobForDetails.locationEn : selectedJobForDetails.locationBn}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedJobForDetails(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs sm:text-sm text-gray-700">
              {/* Quick Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div>
                  <span className="text-3xs text-gray-400 block uppercase font-bold">{isEn ? 'Vacancy' : 'পদসংখ্যা'}</span>
                  <span className="font-bold text-gray-900">{isEn ? selectedJobForDetails.vacancyEn : selectedJobForDetails.vacancyBn}</span>
                </div>
                <div>
                  <span className="text-3xs text-gray-400 block uppercase font-bold">{isEn ? 'Type' : 'চাকরির ধরন'}</span>
                  <span className="font-bold text-gray-900">{isEn ? selectedJobForDetails.employmentTypeEn : selectedJobForDetails.employmentTypeBn}</span>
                </div>
                <div>
                  <span className="text-3xs text-gray-400 block uppercase font-bold">{isEn ? 'Experience' : 'অভিজ্ঞতা'}</span>
                  <span className="font-bold text-gray-900">{isEn ? selectedJobForDetails.experienceEn : selectedJobForDetails.experienceBn}</span>
                </div>
                <div>
                  <span className="text-3xs text-gray-400 block uppercase font-bold">{isEn ? 'Deadline' : 'আবেদনের শেষ সময়'}</span>
                  <span className="font-bold text-emerald-700">{isEn ? selectedJobForDetails.deadlineEn : selectedJobForDetails.deadlineBn}</span>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="space-y-2">
                <h4 className="font-black text-gray-900 text-sm uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006231]" />
                  <span>{isEn ? 'Key Responsibilities' : 'প্রধান দায়িত্বসমূহ'}</span>
                </h4>
                <ul className="space-y-1.5 list-disc pl-5 text-gray-600">
                  {(isEn ? selectedJobForDetails.responsibilitiesEn : selectedJobForDetails.responsibilitiesBn).map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <h4 className="font-black text-gray-900 text-sm uppercase tracking-wider flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>{isEn ? 'Qualifications & Requirements' : 'শিক্ষাগত যোগ্যতা ও অভিজ্ঞতা'}</span>
                </h4>
                <ul className="space-y-1.5 list-disc pl-5 text-gray-600">
                  {(isEn ? selectedJobForDetails.requirementsEn : selectedJobForDetails.requirementsBn).map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Compensation & Benefits */}
              <div className="space-y-2">
                <h4 className="font-black text-gray-900 text-sm uppercase tracking-wider flex items-center space-x-1.5">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                  <span>{isEn ? 'Compensation & Benefits' : 'বেতন ও অন্যান্য সুযোগ-সুবিধা'}</span>
                </h4>
                <ul className="space-y-1.5 list-disc pl-5 text-gray-600">
                  {(isEn ? selectedJobForDetails.benefitsEn : selectedJobForDetails.benefitsBn).map((ben, i) => (
                    <li key={i}>{ben}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedJobForDetails(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-100 cursor-pointer"
              >
                {isEn ? 'Close' : 'বন্ধ করুন'}
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

              {/* Resume / CV Link */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span>{isEn ? 'Google Drive / Dropbox CV Link *' : 'সিভি / বায়োডাটার ড্রাইভ লিঙ্ক *'}</span>
                  <span className="text-3xs text-slate-500 font-normal">{isEn ? 'Must be public viewable' : 'শেয়ারিং পারমিশন "Anyone with link" রাখুন'}</span>
                </label>
                <div className="relative">
                  <ExternalLink className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    value={formData.cvLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, cvLink: e.target.value }))}
                    placeholder="https://drive.google.com/file/d/..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${formErrors.cvLink ? 'border-red-500 bg-red-50/30' : 'border-gray-200 bg-gray-50'} text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006231]/20 focus:border-[#006231]`}
                  />
                </div>
                {formErrors.cvLink && <p className="text-3xs text-red-600 mt-0.5">{formErrors.cvLink}</p>}
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

            {/* Tracking ID Box */}
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-center space-y-1">
              <span className="text-3xs text-gray-500 uppercase font-bold block">
                {isEn ? 'Application Tracking Number' : 'আবেদন ট্র্যাকিং নম্বর'}
              </span>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-mono text-base font-black text-[#006231]">
                  {submittedApplication.id}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyId(submittedApplication.id)}
                  className="p-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                  title="কপি করুন"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="text-3xs text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
              {isEn 
                ? 'Shortlisted candidates will be contacted via mobile phone or email for a preliminary interview.'
                : 'বাছাইকৃত প্রার্থীদের মোবাইল বা ইমেইলের মাধ্যমে প্রাথমিক সাক্ষাৎকারের জন্য ডাকা হবে।'}
            </div>

            <button
              type="button"
              onClick={() => setSubmittedApplication(null)}
              className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs transition-all cursor-pointer shadow-md"
            >
              {isEn ? 'Close Window' : 'ঠিক আছে, সম্পন্ন করুন'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
