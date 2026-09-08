import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
// import HeroSection from './components/HeroSection'; // Temporarily removed – landing page disabled
import AboutSection from './components/AboutSection';
import BlogSection from './components/BlogSection';
import PortfolioSection from './components/PortfolioSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ContentModalReader from './components/ContentModalReader';
import ContentStudioModal from './components/ContentStudioModal';
import { getAllBlogs, getAllPortfolio } from './utils/contentLoader';
import { SITE_CONFIG } from './config/siteConfig';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState(true);

  // Section & Menu Visibility state
  // In production: always use SITE_CONFIG (committed to repo)
  // In dev: localStorage override is allowed for live preview via admin toggle
  const isDev = import.meta.env.DEV;
  const [sections, setSections] = useState(() => {
    if (isDev) {
      try {
        const saved = localStorage.getItem('rohit_section_config');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return { ...SITE_CONFIG.sections };
  });

  // Content data state (synchronous initial load)
  const [blogs, setBlogs] = useState(() => {
    try {
      return getAllBlogs();
    } catch (e) {
      console.warn('Initial blog load error:', e);
      return [];
    }
  });

  const [portfolio, setPortfolio] = useState(() => {
    try {
      return getAllPortfolio();
    } catch (e) {
      console.warn('Initial portfolio load error:', e);
      return [];
    }
  });
  
  // Modal & Reader states
  const [selectedReaderItem, setSelectedReaderItem] = useState(null);
  const [readerType, setReaderType] = useState('blog'); // 'blog' or 'portfolio'
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Admin authorization state
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem('rohit_admin_session') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Path & Hash Routing listener (/blogs/:slug, /portfolio/:slug, /admin, legacy #blogs/:slug, Ctrl+Shift+A)
  useEffect(() => {
    const handleRouting = () => {
      const hash = window.location.hash || '';
      const pathname = window.location.pathname || '/';

      // 1. Backward Compatibility: Migrate legacy hash URLs to clean paths seamlessly
      if (hash.startsWith('#blogs/')) {
        const slug = hash.replace('#blogs/', '').trim();
        if (slug) {
          window.history.replaceState(null, '', `/blogs/${slug}`);
          const found = blogs.find(b => b.slug === slug);
          if (found) {
            setSelectedReaderItem(found);
            setReaderType('blog');
          }
          return;
        }
      } else if (hash.startsWith('#portfolio/')) {
        const slug = hash.replace('#portfolio/', '').trim();
        if (slug) {
          window.history.replaceState(null, '', `/portfolio/${slug}`);
          const found = portfolio.find(p => p.slug === slug);
          if (found) {
            setSelectedReaderItem(found);
            setReaderType('portfolio');
          }
          return;
        }
      } else if (hash === '#admin') {
        window.history.replaceState(null, '', '/admin');
        setIsStudioOpen(true);
        return;
      }

      // 2. Standard Path-based routing (/blogs/:slug, /portfolio/:slug, /admin)
      const blogMatch = pathname.match(/^\/blogs\/([^/]+)/);
      const portfolioMatch = pathname.match(/^\/portfolio\/([^/]+)/);

      if (blogMatch) {
        const slug = blogMatch[1];
        const found = blogs.find(b => b.slug === slug);
        if (found) {
          setSelectedReaderItem(found);
          setReaderType('blog');
        }
      } else if (portfolioMatch) {
        const slug = portfolioMatch[1];
        const found = portfolio.find(p => p.slug === slug);
        if (found) {
          setSelectedReaderItem(found);
          setReaderType('portfolio');
        }
      } else if (pathname === '/admin') {
        setIsStudioOpen(true);
      } else {
        // Section anchors or root
        setSelectedReaderItem(null);
        setIsStudioOpen(false);
      }
    };

    handleRouting();
    window.addEventListener('popstate', handleRouting);
    window.addEventListener('hashchange', handleRouting);

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsStudioOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleRouting);
      window.removeEventListener('hashchange', handleRouting);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [blogs, portfolio]);

  // Sync document title with active article or home
  useEffect(() => {
    if (selectedReaderItem) {
      document.title = `${selectedReaderItem.title} | Rohit Curiosity`;
    } else {
      document.title = "Rohit Curiosity | rohitcuriosity.com — Market Views, Tech Frontiers & Venture Architecture";
    }
  }, [selectedReaderItem]);

  // Sync theme with HTML root class
  useEffect(() => {
    try {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDark]);

  const handleSelectBlog = (blog) => {
    setSelectedReaderItem(blog);
    setReaderType('blog');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/blogs/${blog.slug}`);
    }
  };

  const handleSelectProject = (project) => {
    setSelectedReaderItem(project);
    setReaderType('portfolio');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/portfolio/${project.slug}`);
    }
  };

  const handleCloseReader = () => {
    setSelectedReaderItem(null);
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/blogs/') || window.location.pathname.startsWith('/portfolio/')) {
        window.history.pushState(null, '', readerType === 'blog' ? '/#blogs' : '/#portfolio');
      }
    }
  };

  // About Section customizable data (persisted in localStorage)
  const [aboutData, setAboutData] = useState(() => {
    try {
      const saved = localStorage.getItem('rohit_about_config');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-[#0B0F17] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Sticky Navbar */}
      <Navbar 
        isDark={isDark} 
        setIsDark={setIsDark} 
        onOpenStudio={() => setIsStudioOpen(true)}
        isAdmin={isAdmin}
        sections={sections}
      />

      {/* Main Content Sections */}
      <main>

        {sections.blogs && (
          <BlogSection 
            blogs={blogs} 
            onSelectBlog={handleSelectBlog} 
            onOpenStudio={() => setIsStudioOpen(true)}
            isDark={isDark} 
          />
        )}
        
        {sections.portfolio && (
          <PortfolioSection 
            portfolio={portfolio} 
            onSelectProject={handleSelectProject} 
            onOpenStudio={() => setIsStudioOpen(true)}
            isDark={isDark} 
            isAdmin={isAdmin}
          />
        )}

        {sections.about && (
          <AboutSection 
            isDark={isDark} 
            aboutData={aboutData}
          />
        )}
        
        {sections.contact && (
          <ContactSection 
            isDark={isDark} 
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer 
        isDark={isDark} 
        onOpenStudio={() => setIsStudioOpen(true)} 
        isAdmin={isAdmin}
        sections={sections}
      />

      {/* Full-Screen Reading Modal for Blog & Portfolio Markdown */}
      {selectedReaderItem && (
        <ContentModalReader 
          item={selectedReaderItem} 
          type={readerType} 
          onClose={handleCloseReader} 
          isDark={isDark} 
          isAdmin={isAdmin}
        />
      )}

      {/* Interactive Web CMS & Content Creator Studio (Admin Protected) */}
      {isStudioOpen && (
        <ContentStudioModal 
          isOpen={isStudioOpen} 
          onClose={() => {
            setIsStudioOpen(false);
            if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
              window.history.pushState(null, '', '/');
            }
          }} 
          isDark={isDark}
          onAdminStatusChange={setIsAdmin}
          onSectionsChange={setSections}
          onAboutDataChange={setAboutData}
        />
      )}

    </div>
  );
}
