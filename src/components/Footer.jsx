import React, { useState } from 'react';
import { 
  Compass, 
  ArrowUp, 
  Mail, 
  Check, 
  Sparkles,
  Heart
} from 'lucide-react';
import { LinkedinIcon, TwitterIcon, GithubIcon } from './SocialIcons';

export default function Footer({ isDark, onOpenStudio, sections = { about: true, blogs: true, portfolio: true, contact: true } }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`border-t relative overflow-hidden ${
      isDark ? 'bg-[#070A10] border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">
          
          {/* Brand Col */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-amber-500 p-0.5">
                <div className={`w-full h-full rounded-[10px] flex items-center justify-center font-black text-xs ${
                  isDark ? 'bg-[#0B0F17] text-brand-400' : 'bg-white text-brand-600'
                }`}>
                  RC
                </div>
              </div>
              <span className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Rohit <span className="text-brand-400">Curiosity</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed max-w-md">
              Navigating macroeconomic shifts, sovereign compute frontiers, and venture systems at <span className="text-slate-200 font-mono">rohitcuriosity.com</span>.
            </p>

          </div>

          {/* Quick Links */}
          <div className="lg:col-span-5 space-y-3 lg:pl-12">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {sections.about && <li><a href="#about" className="hover:text-brand-400 transition-colors">About & Core Pillars</a></li>}
              {sections.blogs && <li><a href="#blogs" className="hover:text-brand-400 transition-colors">Market Views & Insights</a></li>}
              {sections.portfolio && <li><a href="#portfolio" className="hover:text-brand-400 transition-colors">Portfolio & Ventures</a></li>}
              {sections.contact && <li><a href="#contact" className="hover:text-brand-400 transition-colors">Direct Inquiries</a></li>}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Rohit Curiosity (rohitcuriosity.com). All Rights Reserved.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 ${
                isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
