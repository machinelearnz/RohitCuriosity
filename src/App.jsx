import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import BlogSection from './components/BlogSection';
import PortfolioSection from './components/PortfolioSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ContentModalReader from './components/ContentModalReader';
import ContentStudioModal from './components/ContentStudioModal';
import { getAllBlogs, getAllPortfolio } from './utils/contentLoader';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState(true);

  // Section & Menu Visibility state (persisted in localStorage)
  const [sections, setSections] = useState(() => {
    try {
      const saved = localStorage.getItem('rohit_section_config');
      return saved ? JSON.parse(saved) : { about: true, blogs: true, portfolio: true, contact: true };
    } catch (e) {
      return { about: true, blogs: true, portfolio: true, contact: true };
    }
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

  // Deep Link & Hash Routing listener (#blogs/:slug, #portfolio/:slug, #admin, Ctrl+Shift+A)
  useEffect(() => {
    const handleHashRouting = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#blogs/')) {
        const slug = hash.replace('#blogs/', '').trim();
        const found = blogs.find(b => b.slug === slug);
        if (found) {
          setSelectedReaderItem(found);
          setReaderType('blog');
        }
      } else if (hash.startsWith('#portfolio/')) {
        const slug = hash.replace('#portfolio/', '').trim();
        const found = portfolio.find(p => p.slug === slug);
        if (found) {
          setSelectedReaderItem(found);
          setReaderType('portfolio');
        }
      } else if (hash === '#admin' || window.location.pathname === '/admin') {
        setIsStudioOpen(true);
      }
    };

    handleHashRouting();
    window.addEventListener('hashchange', handleHashRouting);

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsStudioOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHashRouting);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [blogs, portfolio]);

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
      window.location.hash = `#blogs/${blog.slug}`;
    }
  };

  const handleSelectProject = (project) => {
    setSelectedReaderItem(project);
    setReaderType('portfolio');
    if (typeof window !== 'undefined') {
      window.location.hash = `#portfolio/${project.slug}`;
    }
  };

  const handleCloseReader = () => {
    setSelectedReaderItem(null);
    if (typeof window !== 'undefined' && (window.location.hash.startsWith('#blogs/') || window.location.hash.startsWith('#portfolio/'))) {
      window.location.hash = readerType === 'blog' ? '#blogs' : '#portfolio';
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
        <HeroSection 
          isDark={isDark} 
          onOpenStudio={() => setIsStudioOpen(true)}
          blogCount={blogs.length}
          portfolioCount={portfolio.length}
          sections={sections}
        />
        
        {sections.about && (
          <AboutSection 
            isDark={isDark} 
            aboutData={aboutData}
          />
        )}
        
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
          onClose={() => setIsStudioOpen(false)} 
          isDark={isDark}
          onAdminStatusChange={setIsAdmin}
          onSectionsChange={setSections}
          onAboutDataChange={setAboutData}
        />
      )}

    </div>
  );
}
