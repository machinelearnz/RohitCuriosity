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
  };

  const handleSelectProject = (project) => {
    setSelectedReaderItem(project);
    setReaderType('portfolio');
  };

  const handleCloseReader = () => {
    setSelectedReaderItem(null);
  };

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
      />

      {/* Main Content Sections */}
      <main>
        <HeroSection 
          isDark={isDark} 
          onOpenStudio={() => setIsStudioOpen(true)}
          blogCount={blogs.length}
          portfolioCount={portfolio.length}
        />
        
        <AboutSection 
          isDark={isDark} 
        />
        
        <BlogSection 
          blogs={blogs} 
          onSelectBlog={handleSelectBlog} 
          onOpenStudio={() => setIsStudioOpen(true)}
          isDark={isDark} 
        />
        
        <PortfolioSection 
          portfolio={portfolio} 
          onSelectProject={handleSelectProject} 
          onOpenStudio={() => setIsStudioOpen(true)}
          isDark={isDark} 
        />
        
        <ContactSection 
          isDark={isDark} 
        />
      </main>

      {/* Global Footer */}
      <Footer 
        isDark={isDark} 
        onOpenStudio={() => setIsStudioOpen(true)} 
      />

      {/* Full-Screen Reading Modal for Blog & Portfolio Markdown */}
      {selectedReaderItem && (
        <ContentModalReader 
          item={selectedReaderItem} 
          type={readerType} 
          onClose={handleCloseReader} 
          isDark={isDark} 
        />
      )}

      {/* Interactive Web CMS & Content Creator Studio (Admin Protected) */}
      {isStudioOpen && (
        <ContentStudioModal 
          isOpen={isStudioOpen} 
          onClose={() => setIsStudioOpen(false)} 
          isDark={isDark}
          onAdminStatusChange={setIsAdmin}
        />
      )}

    </div>
  );
}
