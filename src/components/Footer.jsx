import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUp,
  Download
} from 'lucide-react';

export default function Footer({ lang, setLang, t, onNavigate = () => {}, onOpenInstallApp, isLoggedIn = false }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (href) => {
    let page = 'home';
    if (href === '#projects') page = 'projects';
    else if (href === '#investment') page = 'investment';
    else if (href === '#about') page = 'about';
    else if (href === '#why-us') page = 'why-us';
    else if (href === '#contact') page = 'contact';
    else if (href === '#login') page = isLoggedIn ? 'dashboard' : 'login';
    
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#161516] text-gray-300 py-12 sm:pt-16 sm:pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <button 
              onClick={() => handleLinkClick('#home')} 
              className="inline-block cursor-pointer text-left transition-opacity hover:opacity-90"
            >
              <img 
                src="/alemarah_logo_footer.svg" 
                alt="Al-Emarah Properties Limited" 
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </button>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>

            {/* Social Media Channels */}
            <div className="pt-1 space-y-2.5">
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {lang === 'en' ? 'Follow & Connect With Us:' : 'সোশ্যাল মিডিয়ায় আমরা:'}
              </span>
              <div className="flex items-center space-x-2.5">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/AlEmarahproperties/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#1877F2] text-gray-300 hover:text-white flex items-center justify-center transition-all border border-white/10 hover:border-transparent hover:scale-110 shadow-xs"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/8801918646575"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#25D366] text-gray-300 hover:text-white flex items-center justify-center transition-all border border-white/10 hover:border-transparent hover:scale-110 shadow-xs"
                  title="WhatsApp"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 0C5.396 0 .029 5.367.029 11.987c0 2.115.552 4.178 1.599 5.992L0 24l6.197-1.625a11.96 11.96 0 0 0 5.833 1.51h.005c6.632 0 12-5.368 12-11.989 0-3.204-1.248-6.216-3.513-8.482A11.927 11.927 0 0 0 12.031 0zm-.005 21.937a9.92 9.92 0 0 1-5.06-1.385l-.363-.215-3.758.986.999-3.664-.236-.376A9.927 9.927 0 0 1 2.05 11.988C2.05 6.485 6.524 2.012 12.029 2.012c2.667 0 5.172 1.038 7.054 2.923 1.883 1.884 2.92 4.39 2.92 7.056 0 5.504-4.475 9.946-9.977 9.946zm5.464-7.464c-.299-.15-1.772-.874-2.046-.974-.275-.1-.475-.15-.674.15-.199.3-.773.974-.948 1.173-.175.2-.349.225-.648.075-.299-.15-1.263-.465-2.406-1.485-.889-.793-1.49-1.773-1.665-2.073-.175-.3-.019-.462.13-.611.135-.134.299-.349.449-.524.15-.175.2-.299.3-.499.1-.2.05-.374-.025-.524-.075-.15-.674-1.623-.923-2.221-.242-.582-.488-.503-.672-.512l-.573-.01c-.199 0-.524.075-.798.374s-1.047 1.023-1.047 2.495c0 1.472 1.072 2.893 1.222 3.093.15.2 2.11 3.221 5.112 4.519.714.309 1.272.493 1.707.631.718.228 1.371.196 1.888.119.577-.086 1.772-.724 2.021-1.423.249-.699.249-1.298.175-1.423-.075-.125-.274-.2-.573-.35z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#FF0000] text-gray-300 hover:text-white flex items-center justify-center transition-all border border-white/10 hover:border-transparent hover:scale-110 shadow-xs"
                  title="YouTube"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#0A66C2] text-gray-300 hover:text-white flex items-center justify-center transition-all border border-white/10 hover:border-transparent hover:scale-110 shadow-xs"
                  title="LinkedIn"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] text-gray-300 hover:text-white flex items-center justify-center transition-all border border-white/10 hover:border-transparent hover:scale-110 shadow-xs"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
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
                    {lang === 'en' ? 'Open in Google Maps' : 'গুগল ম্যাপে দেখুন'}
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
            <span className="text-xs text-gray-400">
              {lang === 'en' ? 'Design & Development: ' : 'ডিজাইন ও ডেভেলপমেন্ট : '}
              <a
                href="https://wa.me/8801969343158"
                target="_blank"
                rel="noreferrer"
                className="text-[#8EBF40] hover:text-white font-bold transition-colors underline hover:no-underline"
              >
                CodeHive Studio
              </a>
            </span>

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
