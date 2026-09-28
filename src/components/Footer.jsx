import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowUp, 
  Globe 
} from 'lucide-react';

export default function Footer({ lang, setLang, t, onNavigate = () => {}, isLoggedIn = false }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (href) => {
    let page = 'home';
    if (href === '#projects') page = 'projects';
    else if (href === '#about') page = 'about';
    else if (href === '#why-us') page = 'why-us';
    else if (href === '#contact') page = 'contact';
    else if (href === '#login') page = isLoggedIn ? 'dashboard' : 'login';
    
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#161516] text-gray-300 pt-16 pb-24 lg:pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <button 
              onClick={() => handleLinkClick('#home')} 
              className="inline-block bg-white p-2.5 rounded-xl shadow-xs cursor-pointer text-left"
            >
              <img 
                src="/alemarah_logo_header.svg" 
                alt="Al-Emarah Properties Limited" 
                className="h-10 w-auto object-contain"
              />
            </button>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>

            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-[#8EBF40]" />
              <span>{t.footer.rajukMember}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {t.footer.links.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Approvals */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.legalLinks}
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              {t.footer.legal.map((item, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8EBF40] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.contactInfo}
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-gray-400">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Sky+View+Henolux+Center,+Purana+Paltan,+Dhaka" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-start space-x-2.5 hover:text-white group transition-colors"
                title={lang === 'en' ? 'View on Google Maps' : 'গুগল ম্যাপে দেখুন'}
              >
                <MapPin className="w-4 h-4 text-[#CE2028] mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <span>
                  {t.contact.office.addressLine1}, {t.contact.office.addressLine2}
                  <span className="block text-[11px] text-[#8EBF40] underline mt-0.5">
                    {lang === 'en' ? 'Open in Google Maps ↗' : 'গুগল ম্যাপে দেখুন ↗'}
                  </span>
                </span>
              </a>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#8EBF40] shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:01918646575" className="hover:text-white transition-colors">{lang === 'en' ? '01918-646575, 01743-926926' : '০১৯১৮-৬৪৬৫৭৫, ০১৭৪৩-৯২৬৯২৬'}</a>
                  <a href="tel:01914425073" className="hover:text-white transition-colors">{lang === 'en' ? '01914-425073, 01833-544548' : '০১৯১৪-৪২৫০৭৩, ০১৮৩৩-৫৪৪৫৪৮'}</a>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:info@alemarahproperties.com" className="hover:text-white transition-colors">info@alemarahproperties.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} AL EMARAH Properties Limited. {t.footer.allRights}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="flex items-center space-x-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#8EBF40]" />
              <span>{lang === 'en' ? 'বাংলা ভার্সন' : 'English Version'}</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
