import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Calendar,
  Building2,
  Sparkles,
  ExternalLink,
  Navigation
} from 'lucide-react';
import { projectsData } from '../data/projectsData';

export default function ContactSection({ lang, t, preselectedProject }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    project: preselectedProject?.id || '',
    date: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        project: '',
        date: '',
        message: ''
      });
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 text-[#CE2028] text-xs font-bold uppercase tracking-wider mb-3">
            <Phone className="w-3.5 h-3.5" />
            <span>{t.contact.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#231F20] tracking-tight">
            {t.contact.title}
          </h2>
          <p className="mt-3 text-base text-gray-600">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Office Details & Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-xs space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
                {t.contact.office.title}
              </h3>

              {/* Address */}
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#CE2028] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <div className="font-bold text-gray-900">{t.contact.office.addressLine1}</div>
                  <div className="text-gray-600">{t.contact.office.addressLine2}</div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#006231] shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <div className="font-bold text-gray-900">{lang === 'en' ? 'Office Schedule' : 'অফিস সময়সূচি'}</div>
                  <div className="text-gray-600">{t.contact.office.hours}</div>
                </div>
              </div>

              {/* Hotline Numbers */}
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <div className="font-bold text-gray-900 mb-1">{lang === 'en' ? 'Direct Hotline & Sales' : 'সরাসরি হটলাইন ও সেলস'}</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:text-sm font-semibold text-gray-800">
                    <a href="tel:01816233013" className="hover:text-[#CE2028] transition-colors">
                      {lang === 'en' ? '01816-233013' : '০১৮১৬-২৩৩০১৩'}
                    </a>
                    <a href="tel:01918646575" className="hover:text-[#CE2028] transition-colors">
                      {lang === 'en' ? '01918-646575' : '০১৯১৮-৬৪৬৫৭৫'}
                    </a>
                    <a href="tel:01743926926" className="hover:text-[#CE2028] transition-colors">
                      {lang === 'en' ? '01743-926926' : '০১৭৪৩-৯২৬৯২৬'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Emails */}
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <div className="font-bold text-gray-900">{lang === 'en' ? 'Corporate Inquiries' : 'কর্পোরেট ইমেইল'}</div>
                  <div className="text-gray-600">{t.contact.office.email}</div>
                  <div className="text-gray-600">{t.contact.office.salesEmail}</div>
                </div>
              </div>

              {/* Instant Call / WhatsApp Buttons */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://wa.me/8801918646575"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#006231] hover:bg-[#004723] text-white text-xs font-bold shadow-md transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.contact.form.whatsappBtn}</span>
                </a>

                <a
                  href="tel:01816233013"
                  className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#CE2028] hover:bg-[#A9141B] text-white text-xs font-bold shadow-md transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{t.contact.form.callNowBtn}</span>
                </a>

                <a
                  href="https://www.facebook.com/AlEmarahproperties/"
                  target="_blank"
                  rel="noreferrer"
                  className="sm:col-span-2 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/20 text-xs font-bold transition-all shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>{lang === 'en' ? 'Follow on Official Facebook' : 'অফিসিয়াল ফেসবুক পেজ ফলো করুন'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Consultation & Visit Booking Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-7 sm:p-9 rounded-2xl border border-gray-200 shadow-lg shadow-black/5">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {t.contact.form.title}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {lang === 'en' 
                  ? 'Fill out this brief form and our senior relationship officer will arrange your personalized site walkthrough.' 
                  : 'নিচের ফর্মটি পূরণ করুন, আমাদের সিনিয়র রিলেশনশিপ অফিসার আপনার সাইট পরিদর্শনের সকল ব্যবস্থা গ্রহণ করবেন।'
                }
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-[#006231] text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-[#006231]">
                    {lang === 'en' ? 'Request Submitted Successfully!' : 'আবেদন সফলভাবে গৃহীত হয়েছে!'}
                  </h4>
                  <p className="text-sm text-emerald-800 max-w-md mx-auto">
                    {t.contact.form.successMsg}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-bold text-[#CE2028] hover:underline cursor-pointer"
                  >
                    {lang === 'en' ? 'Submit another request' : 'অন্য আরেকটি আবেদন জমা দিন'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        {t.contact.form.fullName} <span className="text-[#CE2028]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder={t.contact.form.fullNamePlaceholder}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028] outline-none transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        {t.contact.form.phone} <span className="text-[#CE2028]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={t.contact.form.phonePlaceholder}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        {t.contact.form.email}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t.contact.form.emailPlaceholder}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028] outline-none transition-all"
                      />
                    </div>

                    {/* Preferred Project */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        {t.contact.form.project}
                      </label>
                      <select
                        value={formData.project}
                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028] outline-none transition-all cursor-pointer"
                      >
                        <option value="">{t.contact.form.selectProject}</option>
                        {projectsData.map((p) => (
                          <option key={p.id} value={p.id}>
                            {lang === 'en' ? p.nameEn : p.nameBn} ({p.sizeSqft} sqft)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      {t.contact.form.date}
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028] outline-none transition-all cursor-pointer"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      {t.contact.form.message}
                    </label>
                    <textarea
                      rows="3"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.contact.form.messagePlaceholder}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-[#CE2028]/20 focus:border-[#CE2028] outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#CE2028] to-[#A9141B] text-white text-sm font-bold shadow-lg shadow-[#CE2028]/25 hover:opacity-95 transition-all cursor-pointer active:scale-[0.99] flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? t.contact.form.submitting : t.contact.form.submitBtn}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Google Map Section */}
        <div className="mt-14 bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-50/80 to-white">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-[#006231] text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{t.contact.map?.badge || 'Google Map'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                {t.contact.map?.title || (lang === 'en' ? 'Find Our Corporate Office on Google Maps' : 'গুগল ম্যাপে আমাদের প্রধান কার্যালয়')}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {t.contact.map?.subtitle || (lang === 'en' ? 'Sky View Henolux Center, Purana Paltan, Dhaka' : '৩/১, স্কাই ভিউ হেনোলাক্স সেন্টার, পুরানা পল্টন, ঢাকা')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Sky+View+Henolux+Center,+Purana+Paltan,+Dhaka"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#006231] hover:bg-[#004723] text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>{t.contact.map?.directionsBtn || (lang === 'en' ? 'Get Directions' : 'ডিরেকশন দেখুন')}</span>
              </a>
              <a
                href="https://maps.google.com/?q=Sky+View+Henolux+Center,+Purana+Paltan,+Dhaka"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-gray-600" />
                <span>{t.contact.map?.viewLarge || (lang === 'en' ? 'Open in Map' : 'ম্যাপ ওপেন করুন')}</span>
              </a>
            </div>
          </div>

          {/* Interactive Google Map iframe */}
          <div className="relative w-full h-[380px] sm:h-[450px] bg-gray-100">
            <iframe
              title="Al-Emarah Properties Corporate Headquarters Location Map"
              src="https://maps.google.com/maps?q=Sky+View+Henolux+Center,+Purana+Paltan,+Dhaka&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Map Footer: Landmarks & Assistance */}
          <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-700">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="font-bold text-gray-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#CE2028]" />
                {t.contact.map?.landmarksTitle || (lang === 'en' ? 'Nearby Landmarks:' : 'নিকটবর্তী ল্যান্ডমার্কসমূহ:')}
              </span>
              {(t.contact.map?.landmarks || []).map((landmark, idx) => (
                <span key={idx} className="bg-white px-2.5 py-1 rounded-md border border-gray-200 text-gray-700 font-medium shadow-2xs">
                  {landmark}
                </span>
              ))}
            </div>
            <div className="text-gray-500 font-medium flex items-center justify-center space-x-1.5">
              <MapPin className="w-4 h-4 text-[#CE2028]" />
              <span>৩/১, স্কাই ভিউ হেনোলাক্স সেন্টার, পুরানা পল্টন, ঢাকা</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
