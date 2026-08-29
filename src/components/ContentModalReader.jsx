import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Bookmark, 
  Check, 
  Tag, 
  ExternalLink,
  ChevronLeft,
  BookOpen,
  Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import confetti from 'canvas-confetti';

export default function ContentModalReader({ item, type, onClose, isDark }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!item) return;

    // Only disable background body scroll while modal is genuinely open with an active item
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow || 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - clientHeight > 0) {
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(progress);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    if (!bookmarked) {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.3 }
        });
      } catch (e) {}
    }
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border overflow-hidden shadow-2xl ${
        isDark ? 'bg-[#0B0F17] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Top Reading Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 z-30">
          <div 
            className="h-full bg-gradient-to-r from-brand-500 via-blue-400 to-amber-400 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Modal Top Bar Navigation */}
        <div className={`flex items-center justify-between px-6 py-4 border-b z-20 ${
          isDark ? 'bg-[#0B0F17]/90 border-slate-800' : 'bg-white/90 border-slate-200'
        }`}>
          <button
            onClick={onClose}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to rohitcuriosity.com</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Bookmark button */}
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-xl border transition-all ${
                bookmarked
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Bookmark / Save"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Share / Copy Link button */}
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                copied
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                  : isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>

            {/* Close Modal button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors ${
                isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader Body */}
        <div 
          onScroll={handleScroll}
          className="overflow-y-auto p-6 sm:p-10 lg:p-12 space-y-8"
        >
          {/* Cover Hero Banner */}
          {item.coverImage && (
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between flex-wrap gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-500 text-white backdrop-blur-md">
                  {item.category}
                </span>
                {item.stats && item.stats.value && (
                  <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-black/70 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                    {item.stats.metric}: {item.stats.value}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Article Header Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {item.formattedDate || item.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-brand-400" />
                {item.author || item.client || 'Rohit Curiosity'}
              </span>
              {item.readTime && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {item.readTime}
                  </span>
                </>
              )}
            </div>

            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {item.title}
            </h1>

            {/* Tags / Tech Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(item.tags || item.technologies || []).map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20"
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Live Demo or Links for Projects */}
            {item.demoUrl && item.demoUrl !== '#' && (
              <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-xs font-bold text-brand-300 uppercase tracking-wider">Live System Deployment</h4>
                  <p className="text-xs text-slate-300">Access the interactive application or live showcase.</p>
                </div>
                <a
                  href={item.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-400 text-white shadow-glow-brand"
                >
                  <span>Launch Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          <hr className="border-slate-800" />

          {/* Markdown Body Content Rendered */}
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {item.content || item.summary || 'No additional content provided.'}
            </ReactMarkdown>
          </div>

          {/* Reader Footer Author Card */}
          <div className={`p-6 rounded-2xl border mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-amber-500 p-0.5">
                <div className={`w-full h-full rounded-[10px] flex items-center justify-center font-bold text-sm ${
                  isDark ? 'bg-[#0B0F17] text-white' : 'bg-white text-slate-900'
                }`}>
                  RC
                </div>
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Rohit Curiosity Intelligence Briefing
                </h4>
                <p className="text-xs text-slate-400">Written and edited in local plain-text Markdown.</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-500 text-white shadow-glow-brand"
            >
              Close Reader
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
