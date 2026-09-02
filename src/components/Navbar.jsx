import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ArrowUpRight, 
  Compass,
  BookOpen,
  FolderGit2,
  Mail,
  User,
  PlusCircle,
  Lock,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ isDark, setIsDark, onOpenStudio, isAdmin, sections = { about: true, blogs: true, portfolio: true, contact: true } }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Scroll detection & Active Section Spy
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section positions
      const sectionList = [
        { id: 'hero', element: document.querySelector('main') },
        { id: 'about', element: document.getElementById('about') },
        { id: 'blogs', element: document.getElementById('blogs') },
        { id: 'portfolio', element: document.getElementById('portfolio') },
        { id: 'contact', element: document.getElementById('contact') }
      ];

      const scrollPosition = window.scrollY + 200;

      for (let i = sectionList.length - 1; i >= 0; i--) {
        const section = sectionList[i];
        if (section.element && typeof section.element.offsetTop === 'number') {
          const top = section.element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Primary content sections filtered dynamically by section settings (About, Views & Blogs, Portfolio)
  const navLinks = [
    sections.about && { name: 'About', id: 'about', href: '#about', icon: User },
    sections.blogs && { name: 'Views & Blogs', id: 'blogs', href: '#blogs', icon: BookOpen },
    sections.portfolio && { name: 'Portfolio', id: 'portfolio', href: '#portfolio', icon: FolderGit2 },
  ].filter(Boolean);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? isDark 
            ? 'bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/30' 
            : 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-md shadow-slate-200/50'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Monogram */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-blue-600 to-amber-500 p-0.5 shadow-glow-brand transition-transform group-hover:scale-105">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center font-black text-sm tracking-tighter ${
                isDark ? 'bg-[#0B0F17] text-brand-400' : 'bg-white text-brand-600'
              }`}>
                RC
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Rohit <span className="text-brand-400">Curiosity</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-400 tracking-wide font-mono font-medium">
                rohitcuriosity.com
              </span>
            </div>
          </a>

          {/* Center Navigation Links with Active Scroll Indicator */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/30 border border-slate-800/60 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40 shadow-sm'
                      : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shadow-glow-brand animate-pulse" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Content Studio Trigger (Only Visible when Admin is Logged In) */}
            {isAdmin && (
              <button
                onClick={onOpenStudio}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200"
                title="Admin Mode Active - Open Studio"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Content Studio</span>
                <span className="px-1 py-0.2 text-[10px] rounded font-mono bg-emerald-500/20 text-emerald-300">
                  ADMIN
                </span>
              </button>
            )}

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isDark 
                  ? 'border-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-800/60' 
                  : 'border-slate-200 text-slate-600 hover:text-amber-600 hover:bg-slate-100'
              }`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Connect CTA with Live Availability Status */}
            <a
              href="#contact"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 transform hover:-translate-y-0.5 ${
                activeSection === 'contact'
                  ? 'bg-amber-500 text-slate-950 shadow-glow-amber'
                  : 'bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-400 hover:to-blue-500 text-white shadow-glow-brand'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Connect</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg border ${
                isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg border ${
                isDark ? 'border-slate-800 text-slate-300 bg-slate-900' : 'border-slate-200 text-slate-700 bg-white'
              }`}
              aria-label="Open Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`sm:hidden border-b px-4 pt-3 pb-6 space-y-3 ${
          isDark ? 'bg-[#0B0F17] border-slate-800' : 'bg-white border-slate-200 shadow-xl'
        }`}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                    : isDark ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-brand-400" />
                  <span>{link.name}</span>
                </div>
                {isActive && <span className="w-2 h-2 rounded-full bg-brand-400" />}
              </a>
            );
          })}

          <div className="pt-3 border-t border-slate-800/60 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStudio();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Launch Content Studio (Admin Protected)</span>
            </button>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-brand-500 text-white shadow-glow-brand"
            >
              <span>Connect</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
