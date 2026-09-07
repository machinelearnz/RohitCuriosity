import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Copy,
  Globe,
  Maximize2,
  ZoomIn,
  CheckCircle2,
  Code2,
  PieChart as ChartIcon,
  HelpCircle,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { LinkedinIcon } from './SocialIcons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from 'mermaid';
import confetti from 'canvas-confetti';
import { resolveMediaUrl, compileMarkdownWithMedia } from '../utils/mediaStore';

/**
 * Robust Markdown Image component with Error Handling & Fallback
 */
function MarkdownImage({ src, alt, onZoom }) {
  const [hasError, setHasError] = useState(false);
  const resolvedUrl = resolveMediaUrl(src);

  useEffect(() => {
    setHasError(false);
  }, [src, resolvedUrl]);

  const handleImageError = () => {
    setHasError(true);
  };

  const isUnresolvedMedia = typeof src === 'string' && src.startsWith('media:') && (!resolvedUrl || resolvedUrl === src);

  if (hasError || !resolvedUrl || isUnresolvedMedia) {
    return (
      <div className="my-6 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center shadow-lg">
        <ImageIcon className="w-8 h-8 text-brand-400 mb-2" />
        <span className="text-xs font-bold text-slate-200">{alt || 'Article Visual'}</span>
        <span className="text-[11px] text-slate-500 mt-1">Image URL invalid or file link broken. Upload photo in Content Studio to embed.</span>
      </div>
    );
  }

  return (
    <figure className="markdown-image-wrapper my-6 flex flex-col items-center">
      <img
        src={resolvedUrl}
        alt={alt || 'Blog illustration'}
        onError={handleImageError}
        onClick={() => onZoom && onZoom({ src: resolvedUrl, caption: alt })}
        className="max-w-full max-h-[500px] object-contain rounded-2xl border border-slate-800 shadow-xl cursor-pointer transition-transform hover:scale-[1.01]"
        loading="lazy"
      />
      {alt && (
        <figcaption className="markdown-image-caption mt-2 text-center text-xs text-slate-400 font-medium italic flex items-center justify-center gap-1.5">
          <ZoomIn className="w-3 h-3 text-brand-400" />
          <span>{alt} — (click image to zoom)</span>
        </figcaption>
      )}
    </figure>
  );
}

// Initialize Mermaid config
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Plus Jakarta Sans, sans-serif'
});

/**
 * Mermaid Diagram Component for Markdown ```mermaid blocks
 */
function MermaidDiagram({ chart }) {
  const containerRef = useRef(null);
  const [svgCode, setSvgCode] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
    
    mermaid.render(uniqueId, chart)
      .then((res) => {
        if (isMounted) {
          setSvgCode(res.svg);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Mermaid rendering error:', err);
          setError(err.message || 'Diagram syntax error');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 my-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs overflow-x-auto">
        <div className="text-amber-400 font-bold mb-1">Mermaid Diagram Source</div>
        <pre className="text-slate-300">{chart}</pre>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="my-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex justify-center items-center overflow-x-auto shadow-lg"
      dangerouslySetInnerHTML={{ __html: svgCode }}
    />
  );
}

/**
 * Custom Code Block Component with Syntax Highlighting and Copy Button
 */
function CodeBlock({ language, value }) {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(value);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (language === 'mermaid') {
    return <MermaidDiagram chart={value} />;
  }

  return (
    <div className="relative my-6 rounded-2xl border border-slate-800 overflow-hidden bg-[#0D131F] shadow-xl group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
        <span className="font-mono font-semibold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-slate-500" />
          {language || 'code'}
        </span>

        <button
          onClick={handleCopyCode}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
            copiedCode
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              : 'border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Copy code snippet to clipboard"
        >
          {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>

      {/* Syntax Highlighted Code */}
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.25rem 1rem',
          fontSize: '0.875rem',
          lineHeight: '1.6',
          backgroundColor: 'transparent',
          fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace'
        }}
        showLineNumbers={true}
        lineNumberStyle={{
          minWidth: '2.5rem',
          paddingRight: '1rem',
          marginRight: '1rem',
          color: '#64748B',
          textAlign: 'right',
          borderRight: '1px solid #1E293B',
          userSelect: 'none'
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

export default function ContentModalReader({ item, type, onClose, isDark, isAdmin }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMedium, setCopiedMedium] = useState(false);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://rohitcuriosity.com';
  const canonicalUrl = `${originUrl}/#blogs/${item?.slug || 'post'}`;

  // Canonical Link Injection in <head>
  useEffect(() => {
    if (!item) return;

    // Body scroll lock
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Inject <link rel="canonical"> tag
    let linkTag = document.querySelector("link[rel='canonical']");
    if (!linkTag) {
      linkTag = document.createElement('link');
      linkTag.setAttribute('rel', 'canonical');
      document.head.appendChild(linkTag);
    }
    linkTag.setAttribute('href', canonicalUrl);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxImage) setLightboxImage(null);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow || 'auto';
      window.removeEventListener('keydown', handleKeyDown);
      if (linkTag) {
        linkTag.setAttribute('href', originUrl);
      }
    };
  }, [item, canonicalUrl, lightboxImage, onClose]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - clientHeight > 0) {
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(progress);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Medium Import Helper Action
  const handleCopyMediumUrl = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopiedMedium(true);
    setTimeout(() => setCopiedMedium(false), 2500);
  };

  // LinkedIn Executive Summary Copy Helper Action
  const handleCopyLinkedInSummary = () => {
    const title = item.title || 'Technical Briefing';
    const excerpt = item.excerpt || item.summary || '';
    const tagsStr = (item.tags || item.technologies || []).map(t => `#${t}`).join(' ');

    const linkedinText = `🚀 ${title}

📌 Executive Briefing:
${excerpt}

${tagsStr ? `Key Focus Areas: ${tagsStr}\n` : ''}
Link to full technical post, math derivations, and code in comments below 👇
${canonicalUrl}`;

    navigator.clipboard.writeText(linkedinText);
    setCopiedLinkedIn(true);
    setTimeout(() => setCopiedLinkedIn(false), 2500);
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

  // Sanitize content to strip duplicate top H1 header if present in raw markdown
  const cleanContent = React.useMemo(() => {
    const raw = item?.content || (item?.summary && !item?.excerpt ? '' : item?.summary) || '';
    if (!raw) return '';
    return raw.replace(/^#\s+[^\r\n]+(?:\r?\n)*/, '').trimStart();
  }, [item?.content, item?.summary, item?.excerpt]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      {/* Main Reader Modal Container */}
      <div className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border overflow-hidden shadow-2xl ${
        isDark ? 'bg-[#0B0F17] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Reading Progress Indicator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 z-30">
          <div 
            className="h-full bg-gradient-to-r from-brand-500 via-blue-400 to-amber-400 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Modal Header Navigation & Controls */}
        <div className={`flex items-center justify-between px-6 py-4 border-b z-20 flex-wrap gap-3 ${
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

          <div className="flex items-center gap-2 flex-wrap">
            {/* Bookmark Button */}
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-xl border transition-all ${
                bookmarked
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Bookmark Article"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Share / Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                copiedLink
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                  : isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors ${
                isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTHOR UTILITY BAR (Syndication & Distribution Tools - Strictly Admin Only) */}
        {isAdmin && (
          <div className={`px-6 py-2.5 border-b text-xs flex items-center justify-between flex-wrap gap-2 ${
            isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Author Utility Bar:
              </span>
              <span className="hidden sm:inline text-slate-500">• Cross-Posting Tools (Admin Active)</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Medium Import Helper Button */}
              <button
                onClick={handleCopyMediumUrl}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium border transition-all ${
                  copiedMedium
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : 'bg-black/40 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                }`}
                title="Copy canonical URL formatted for Medium Story Import tool"
              >
                {copiedMedium ? <Check className="w-3 h-3 text-emerald-400" /> : <FileText className="w-3 h-3 text-brand-400" />}
                <span>{copiedMedium ? 'Medium URL Copied!' : 'Medium Import Link'}</span>
              </button>

              {/* LinkedIn Executive Summary Copy Button */}
              <button
                onClick={handleCopyLinkedInSummary}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium border transition-all ${
                  copiedLinkedIn
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : 'bg-blue-600/20 border-blue-500/40 text-blue-300 hover:bg-blue-600/30 hover:text-white'
                }`}
                title="Copy formatted LinkedIn post with Executive Summary and comment link prompt"
              >
                {copiedLinkedIn ? <Check className="w-3 h-3 text-emerald-400" /> : <LinkedinIcon className="w-3 h-3 text-blue-400" />}
                <span>{copiedLinkedIn ? 'LinkedIn Summary Copied!' : 'LinkedIn Summary'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Reader Body */}
        <div 
          onScroll={handleScroll}
          className="overflow-y-auto p-6 sm:p-10 lg:p-12 space-y-8"
        >
          {/* Header Cover Image */}
          {item.coverImage && (
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg group">
              <img
                src={resolveMediaUrl(item.coverImage)}
                alt={item.title}
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-105"
                onClick={() => setLightboxImage({ src: resolveMediaUrl(item.coverImage), caption: item.title })}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-80 pointer-events-none" />
              
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setLightboxImage({ src: item.coverImage, caption: item.title })}
                  className="p-2 rounded-xl bg-black/60 text-white backdrop-blur-md border border-white/20 hover:bg-black/80 transition-all"
                  title="Click to expand cover image"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between flex-wrap gap-2 pointer-events-none">
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

          {/* Article Header & Metadata */}
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

            {(item.excerpt || item.summary) && (
              <p className="text-sm sm:text-base text-slate-400 italic mb-4 leading-relaxed">
                {item.excerpt || item.summary}
              </p>
            )}

            {/* Tags / Pills */}
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

          {/* Markdown Body Content Rendered with Rich Media Engines */}
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              urlTransform={(url) => {
                // Allow data:image/ URIs, standard protocols, and relative paths
                if (url.startsWith('data:image/')) return url;
                if (url.startsWith('/')) return url;
                if (url.startsWith('http://') || url.startsWith('https://')) return url;
                return url;
              }}
              components={{
                // Custom Image component with Responsive Sizing, Error Fallback, Lightbox, and Subtle Caption
                img: ({ node, src, alt, ...props }) => (
                  <MarkdownImage src={src} alt={alt} onZoom={setLightboxImage} />
                ),

                // Custom Code Block component with Syntax Highlighting, Mermaid, and Copy Button
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const value = String(children).replace(/\n$/, '');

                  if (!inline && (language || value.includes('\n'))) {
                    return <CodeBlock language={language} value={value} />;
                  }

                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },

                // Custom Callout Box rendering for Blockquotes
                blockquote: ({ node, children, ...props }) => {
                  let calloutClass = '';
                  const childrenText = String(children?.[0]?.props?.children || '');

                  if (childrenText.includes('[!NOTE]')) {
                    calloutClass = 'callout-note';
                  } else if (childrenText.includes('[!TIP]')) {
                    calloutClass = 'callout-tip';
                  } else if (childrenText.includes('[!WARNING]')) {
                    calloutClass = 'callout-warning';
                  }

                  return (
                    <blockquote className={calloutClass} {...props}>
                      {children}
                    </blockquote>
                  );
                }
              }}
            >
              {cleanContent || 'No additional content provided.'}
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
                <p className="text-xs text-slate-400">Written and edited in plain-text Markdown for rohitcuriosity.com.</p>
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

      {/* LIGHTBOX IMAGE EXPAND MODAL */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-all border border-slate-700 shadow-xl"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-5xl max-h-[85vh] p-2 flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImage.src}
              alt={lightboxImage.caption || 'Expanded image preview'}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-slate-800"
            />
            {lightboxImage.caption && (
              <p className="mt-4 text-slate-300 text-sm font-medium text-center bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
                {lightboxImage.caption}
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
