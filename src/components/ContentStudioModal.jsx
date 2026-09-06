import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  FolderGit2, 
  Eye, 
  EyeOff,
  Edit3, 
  HelpCircle,
  Terminal,
  Layers,
  ArrowRight,
  Lock,
  Unlock,
  ShieldCheck,
  KeyRound,
  LogOut,
  AlertCircle,
  Code2,
  Image as ImageIcon,
  Calculator,
  Sliders,
  CheckSquare,
  Square,
  User,
  Upload,
  FileUp,
  Calendar,
  Mail,
  Trash2,
  Inbox,
  Search,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { saveMediaItem, saveMediaItemAsync, uploadImageToServer, resolveMediaUrl, compileMarkdownWithMedia } from '../utils/mediaStore';
import { SITE_CONFIG } from '../config/siteConfig';
import { parseMarkdown, calculateReadTime } from '../utils/contentLoader';

function CodeBlock({ language, value }) {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(value);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-2xl border border-slate-800 overflow-hidden bg-[#0D131F] shadow-xl group">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
        <span className="font-mono font-semibold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-slate-500" />
          {language || 'code'}
        </span>
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>
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

function MarkdownImage({ src, alt }) {
  const [hasError, setHasError] = useState(false);
  const resolvedUrl = resolveMediaUrl(src);

  useEffect(() => {
    setHasError(false);
  }, [src, resolvedUrl]);

  const handleImageError = () => {
    setHasError(true);
  };

  // If src starts with media: and resolvedUrl is empty or unchanged, return fallback card
  const isUnresolvedMedia = typeof src === 'string' && src.startsWith('media:') && (!resolvedUrl || resolvedUrl === src);

  if (hasError || !resolvedUrl || isUnresolvedMedia) {
    return (
      <div className="my-6 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center shadow-lg">
        <ImageIcon className="w-8 h-8 text-brand-400 mb-2" />
        <span className="text-xs font-bold text-slate-200">{alt || 'Article Visual'}</span>
        <span className="text-[11px] text-slate-500 mt-1">Image URL invalid or local file link broken. Upload photo to embed.</span>
      </div>
    );
  }

  return (
    <figure className="markdown-image-wrapper my-6 flex flex-col items-center">
      <img
        src={resolvedUrl}
        alt={alt || 'Blog illustration'}
        onError={handleImageError}
        className="max-w-full max-h-[480px] object-contain rounded-2xl border border-slate-800 shadow-xl"
        loading="lazy"
      />
      {alt && (
        <figcaption className="markdown-image-caption mt-2 text-center text-xs text-slate-400 font-medium italic">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}

export default function ContentStudioModal({ isOpen, onClose, isDark, onAdminStatusChange, onSectionsChange, onAboutDataChange }) {
  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('rohit_admin_session') === 'true';
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [newPasscodeInput, setNewPasscodeInput] = useState('');
  const [passcodeSuccess, setPasscodeSuccess] = useState('');

  // Menu / Section Controls State
  const [sectionConfig, setSectionConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('rohit_section_config');
      return saved ? JSON.parse(saved) : { ...SITE_CONFIG.sections };
    } catch (e) {
      return { ...SITE_CONFIG.sections };
    }
  });

  // About Section Data State
  const [aboutConfig, setAboutConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('rohit_about_config');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const handleUpdateAboutField = (field, value) => {
    const updated = { ...aboutConfig, [field]: value };
    setAboutConfig(updated);
    localStorage.setItem('rohit_about_config', JSON.stringify(updated));
    if (onAboutDataChange) onAboutDataChange(updated);
  };

  // Image Upload Handlers (converts local image files to Data URL for instant rendering)
  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result;
      if (dataUrl) {
        handleUpdateAboutField('imageUrl', dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const serverPath = await saveMediaItemAsync(file);
    if (serverPath) {
      setCoverImage(serverPath);
    }
  };

  const handleBodyImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const caption = prompt('Enter a caption for this uploaded image:', file.name.replace(/\.[^/.]+$/, '')) || 'Uploaded article visual';
    const mediaRef = await saveMediaItemAsync(file);
    if (mediaRef) {
      insertTemplate(`![${caption}](${mediaRef})`);
    }
  };

  // Studio State
  const [contentType, setContentType] = useState('blog'); // 'blog' or 'portfolio'
  const [activeTab, setActiveTab] = useState('editor'); // 'editor', 'preview', 'inbox', 'guide', 'security'
  const [copied, setCopied] = useState(false);

  // Contact Messages Inbox state
  const [contactMessages, setContactMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('rohit_contact_messages');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [inboxSearch, setInboxSearch] = useState('');
  const [inboxFilter, setInboxFilter] = useState('all'); // 'all', 'unread', 'read'

  // Refresh inbox messages when tab opens or localStorage changes
  useEffect(() => {
    const loadInbox = () => {
      try {
        const saved = localStorage.getItem('rohit_contact_messages');
        if (saved) setContactMessages(JSON.parse(saved));
      } catch (e) {}
    };
    loadInbox();
    window.addEventListener('storage', loadInbox);
    return () => window.removeEventListener('storage', loadInbox);
  }, [activeTab]);

  const handleToggleMessageRead = (msgId) => {
    const updated = contactMessages.map(m => {
      if (m.id === msgId) {
        return { ...m, status: m.status === 'read' ? 'unread' : 'read' };
      }
      return m;
    });
    setContactMessages(updated);
    localStorage.setItem('rohit_contact_messages', JSON.stringify(updated));
  };

  const handleDeleteMessage = (msgId) => {
    if (!confirm('Are you sure you want to delete this transmission message?')) return;
    const updated = contactMessages.filter(m => m.id !== msgId);
    setContactMessages(updated);
    localStorage.setItem('rohit_contact_messages', JSON.stringify(updated));
  };

  const handleClearAllMessages = () => {
    if (!confirm('Are you sure you want to clear ALL incoming transmissions?')) return;
    setContactMessages([]);
    localStorage.setItem('rohit_contact_messages', JSON.stringify([]));
  };

  const handleExportMessages = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contactMessages, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `transmissions_inbox_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const unreadCount = contactMessages.filter(m => m.status === 'unread').length;

  const filteredMessages = contactMessages.filter(m => {
    if (inboxFilter === 'unread' && m.status !== 'unread') return false;
    if (inboxFilter === 'read' && m.status !== 'read') return false;
    if (inboxSearch.trim()) {
      const q = inboxSearch.toLowerCase();
      const matchName = (m.name || '').toLowerCase().includes(q);
      const matchEmail = (m.email || '').toLowerCase().includes(q);
      const matchTx = (m.txId || '').toLowerCase().includes(q);
      const matchBody = (m.message || '').toLowerCase().includes(q);
      const matchScope = (m.inquiryType || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchTx || matchBody || matchScope;
    }
    return true;
  });

  // Body Textarea Ref & Image Inserter Modal state
  const bodyTextareaRef = useRef(null);
  const [showImageEmbedModal, setShowImageEmbedModal] = useState(false);
  const [embedImageUrl, setEmbedImageUrl] = useState('');
  const [embedImageCaption, setEmbedImageCaption] = useState('');

  // Store the raw File so we can POST it to the server on insert
  const [embedImageFile, setEmbedImageFile] = useState(null);

  const handleEmbedModalFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEmbedImageFile(file);
    // Generate a local preview URL for the modal thumbnail
    const previewUrl = URL.createObjectURL(file);
    setEmbedImageUrl(previewUrl);
    if (!embedImageCaption) {
      setEmbedImageCaption(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleInsertEmbeddedImage = async () => {
    if (!embedImageFile && !embedImageUrl.trim()) return;
    const caption = embedImageCaption.trim() || 'Article visual';

    // Upload file to server, get clean static path
    let mediaRef;
    if (embedImageFile) {
      mediaRef = await saveMediaItemAsync(embedImageFile);
    } else {
      // Fallback for pasted URLs (not Base64)
      mediaRef = embedImageUrl.trim();
    }

    const imageMarkdown = `![${caption}](${mediaRef})`;

    const textarea = bodyTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart ?? body.length;
      const end = textarea.selectionEnd ?? body.length;

      const before = body.substring(0, start);
      const after = body.substring(end);

      const formattedInsert = `\n\n${imageMarkdown}\n\n`;
      const newBody = before + formattedInsert + after;
      setBody(newBody);

      setTimeout(() => {
        textarea.focus();
        const nextPos = start + formattedInsert.length;
        textarea.setSelectionRange(nextPos, nextPos);
      }, 50);
    } else {
      setBody(prev => prev + `\n\n${imageMarkdown}\n\n`);
    }

    // Revoke the object URL to free memory
    if (embedImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(embedImageUrl);
    }

    setShowImageEmbedModal(false);
    setEmbedImageUrl('');
    setEmbedImageCaption('');
    setEmbedImageFile(null);
  };

  // Form State
  const [title, setTitle] = useState('Sovereign Compute & The New Capital Moats');
  const [category, setCategory] = useState('Market Views');
  const [author, setAuthor] = useState('Rohit Curiosity');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [readTime, setReadTime] = useState('5 min read');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');
  const [tags, setTags] = useState('Macroeconomics, Sovereign AI, Venture Strategy');
  const [excerpt, setExcerpt] = useState('A concise exploration of how energy availability and sovereign clusters dictate enterprise valuation models.');
  const [importMessage, setImportMessage] = useState(null);

  // Portfolio specific
  const [client, setClient] = useState('Institutional Desk');
  const [role, setRole] = useState('Lead Architect');
  const [statMetric, setStatMetric] = useState('AUM Monitored');
  const [statValue, setStatValue] = useState('$250M+');
  const [demoUrl, setDemoUrl] = useState('https://example.com/demo');

  // Markdown File Upload / Importer Handler
  const handleMarkdownFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const rawText = evt.target?.result;
        if (!rawText || typeof rawText !== 'string') return;

        const { frontmatter, content } = parseMarkdown(rawText);

        // Auto-detect content type
        if (frontmatter.role || frontmatter.client || frontmatter.technologies || frontmatter.demoUrl || frontmatter.stats) {
          setContentType('portfolio');
        } else {
          setContentType('blog');
        }

        // Populate Title
        if (frontmatter.title) {
          setTitle(frontmatter.title);
        } else {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
          setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }

        // Populate Date
        if (frontmatter.date) {
          try {
            const parsedDate = new Date(frontmatter.date);
            if (!isNaN(parsedDate.getTime())) {
              setDate(parsedDate.toISOString().split('T')[0]);
            } else {
              setDate(String(frontmatter.date));
            }
          } catch {
            setDate(String(frontmatter.date));
          }
        }

        // Populate Author
        if (frontmatter.author) {
          setAuthor(frontmatter.author);
        }

        // Populate Category
        if (frontmatter.category) {
          setCategory(frontmatter.category);
        }

        // Populate Read Time
        if (frontmatter.readTime) {
          setReadTime(frontmatter.readTime);
        } else if (content) {
          setReadTime(calculateReadTime(content));
        }

        // Populate Cover Image
        if (frontmatter.coverImage) {
          setCoverImage(frontmatter.coverImage);
        }

        // Populate Tags / Technologies
        if (Array.isArray(frontmatter.tags)) {
          setTags(frontmatter.tags.join(', '));
        } else if (typeof frontmatter.tags === 'string') {
          setTags(frontmatter.tags);
        } else if (Array.isArray(frontmatter.technologies)) {
          setTags(frontmatter.technologies.join(', '));
        } else if (typeof frontmatter.technologies === 'string') {
          setTags(frontmatter.technologies);
        }

        // Populate Excerpt / Summary
        if (frontmatter.excerpt) {
          setExcerpt(frontmatter.excerpt);
        } else if (frontmatter.summary) {
          setExcerpt(frontmatter.summary);
        }

        // Populate Portfolio fields
        if (frontmatter.client) setClient(frontmatter.client);
        if (frontmatter.role) setRole(frontmatter.role);
        if (frontmatter.demoUrl) setDemoUrl(frontmatter.demoUrl);
        if (frontmatter.stats) {
          if (frontmatter.stats.metric) setStatMetric(frontmatter.stats.metric);
          if (frontmatter.stats.value) setStatValue(frontmatter.stats.value);
        }

        // Clean body content: strip leading top level "# Title" if present
        let cleanBody = content || '';
        const titleHeadingRegex = /^#\s+[^\r\n]+(?:\r?\n)+/;
        if (titleHeadingRegex.test(cleanBody)) {
          cleanBody = cleanBody.replace(titleHeadingRegex, '');
        }
        setBody(cleanBody);

        setImportMessage({
          type: 'success',
          text: `Loaded "${file.name}". All frontmatter fields & markdown body are populated and ready to edit.`
        });
        setTimeout(() => setImportMessage(null), 6000);
      } catch (err) {
        console.error('Error importing markdown file:', err);
        setImportMessage({
          type: 'error',
          text: `Failed to parse markdown file: ${err.message}`
        });
        setTimeout(() => setImportMessage(null), 6000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Markdown Body
  const [body, setBody] = useState(`## Executive Thesis

In this briefing, we explore the fundamental shift occurring across capital markets and autonomous compute architectures. As demonstrated by energy math $E = mc^2$, baseline power conversion dictates model economics.

> [!NOTE]
> The true moat of modern artificial intelligence is no longer token generation speed, but reliable baseload power interconnects.

### 1. Key Structural Shifts & Yield Equation

We define the Net Economic Yield $Y_{node}$ as:

$$\\displaystyle Y_{node} = \\sum_{t=1}^{T} \\frac{\\alpha \\cdot \\text{FLOPs}_t - \\beta \\cdot P_{\\grid}(t)}{(1 + r)^t}$$

### 2. Infrastructure Colocation Setup

![High-density sovereign GPU compute data center colocation](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80)

### 3. Telemetry Script (Python)

\`\`\`python
# Short Python Hello World & Compute Telemetry Snippet
def main():
    print("Hello World! Welcome to Rohit Curiosity Intelligence Engine.")

if __name__ == "__main__":
    main()
\`\`\`

### 4. Actionable Takeaways
1. Prioritize energy co-located infrastructure.
2. Build verified autonomous agent pipelines.`);

  // Handle section visibility toggle
  const handleToggleSection = (key) => {
    const updated = { ...sectionConfig, [key]: !sectionConfig[key] };
    setSectionConfig(updated);
    localStorage.setItem('rohit_section_config', JSON.stringify(updated));
    if (onSectionsChange) onSectionsChange(updated);
  };

  // Quick Template Inserters into Body Textarea
  const insertTemplate = (snippet) => {
    setBody(prev => prev + '\n\n' + snippet);
  };

  // Handle passkey verification
  const storedPasscode = localStorage.getItem('rohit_admin_passcode');
  const isFirstTimeSetup = !storedPasscode;

  const handleVerifyPasskey = (e) => {
    e.preventDefault();
    
    if (isFirstTimeSetup) {
      // First-time setup: save the entered passkey as the new admin password
      if (passkeyInput.trim().length < 4) {
        setAuthError('Passkey must be at least 4 characters long.');
        return;
      }
      localStorage.setItem('rohit_admin_passcode', passkeyInput.trim());
      setIsAdminAuthenticated(true);
      localStorage.setItem('rohit_admin_session', 'true');
      setAuthError('');
      setPasskeyInput('');
      if (onAdminStatusChange) onAdminStatusChange(true);
      return;
    }

    if (passkeyInput.trim() === storedPasscode) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('rohit_admin_session', 'true');
      setAuthError('');
      setPasskeyInput('');
      if (onAdminStatusChange) onAdminStatusChange(true);
    } else {
      setAuthError('Invalid Admin Passkey. Access is strictly restricted to authorized administrators.');
    }
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('rohit_admin_session');
    if (onAdminStatusChange) onAdminStatusChange(false);
  };

  const handleChangePasscode = (e) => {
    e.preventDefault();
    if (newPasscodeInput.trim().length < 4) {
      setAuthError('New passkey must be at least 4 characters long.');
      return;
    }
    localStorage.setItem('rohit_admin_passcode', newPasscodeInput.trim());
    setNewPasscodeInput('');
    setPasscodeSuccess('Admin passkey successfully updated!');
    setTimeout(() => setPasscodeSuccess(''), 3000);
  };

  if (!isOpen) return null;

  // Generate File Slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'new-content';

  // Construct complete Markdown with Frontmatter
  const formattedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
  const dateStr = date || new Date().toISOString().split('T')[0];

  let fullMarkdown = '';
  if (contentType === 'blog') {
    fullMarkdown = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${dateStr}"
category: "${category}"
author: "${author}"
readTime: "${readTime}"
featured: false
coverImage: "${coverImage}"
tags: [${formattedTags.map(t => `"${t}"`).join(', ')}]
excerpt: "${excerpt.replace(/"/g, '\\"')}"
---

# ${title}

${body}`;
  } else {
    fullMarkdown = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${dateStr}"
category: "${category}"
client: "${client}"
role: "${role}"
featured: false
coverImage: "${coverImage}"
technologies: [${formattedTags.map(t => `"${t}"`).join(', ')}]
demoUrl: "${demoUrl}"
githubUrl: ""
stats:
  metric: "${statMetric}"
  value: "${statValue}"
summary: "${excerpt.replace(/"/g, '\\"')}"
---

# ${title}

${body}`;
  }

  const getCompiledMarkdown = () => {
    return compileMarkdownWithMedia(fullMarkdown);
  };

  const handleDownload = () => {
    const markdownToExport = getCompiledMarkdown();

    // Auto-save to localStorage custom posts so website immediately updates with full image data
    try {
      const savedCustom = localStorage.getItem('rohit_custom_blogs');
      const customPosts = savedCustom ? JSON.parse(savedCustom) : [];
      const compiledBody = compileMarkdownWithMedia(body);
      const compiledCover = resolveMediaUrl(coverImage);

      const newPostObj = {
        slug,
        title,
        date: dateStr,
        formattedDate: dateStr,
        category,
        author,
        readTime,
        coverImage: compiledCover,
        tags: formattedTags,
        excerpt,
        content: compiledBody
      };
      const idx = customPosts.findIndex(p => p.slug === slug);
      if (idx >= 0) {
        customPosts[idx] = newPostObj;
      } else {
        customPosts.unshift(newPostObj);
      }
      localStorage.setItem('rohit_custom_blogs', JSON.stringify(customPosts));
    } catch (e) {
      console.warn('LocalStorage auto-save warning:', e);
    }

    const blob = new Blob([markdownToExport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slug}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const markdownToExport = getCompiledMarkdown();
    navigator.clipboard.writeText(markdownToExport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const targetFolder = contentType === 'blog' ? '/src/content/blogs/' : '/src/content/portfolio/';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      {/* If NOT Authenticated: Show Admin Gatekeeper Screen */}
      {!isAdminAuthenticated ? (
        <div className={`relative w-full max-w-md p-8 sm:p-10 rounded-3xl border overflow-hidden shadow-2xl ${
          isDark ? 'bg-[#0B0F17] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-xl border transition-colors ${
              isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-brand-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 shadow-glow-amber">
              <Lock className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Protected Portal</span>
            </div>

            <h3 className={`text-2xl font-extrabold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isFirstTimeSetup ? 'Set Up Admin Access' : 'Content Studio Authorization'}
            </h3>
            
            <p className={`text-xs leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isFirstTimeSetup 
                ? 'No admin passkey has been set yet. Create a passkey (minimum 4 characters) to secure your Content Studio.'
                : <>Creating and modifying content is restricted to the administrator of <span className="font-semibold text-brand-400">rohitcuriosity.com</span>.</>
              }
            </p>

            {authError && (
              <div className="w-full p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyPasskey} className="w-full space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passkeyInput}
                  onChange={(e) => {
                    setPasskeyInput(e.target.value);
                    setAuthError('');
                  }}
                  placeholder={isFirstTimeSetup ? 'Create a new Admin Passkey...' : 'Enter Admin Passkey...'}
                  className={`w-full pl-4 pr-11 py-3 rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-brand-400 ${
                    isDark ? 'bg-slate-900 border border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold bg-brand-500 hover:bg-brand-400 text-white shadow-glow-brand transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>{isFirstTimeSetup ? 'Set Passkey & Unlock Studio' : 'Authorize & Unlock Studio'}</span>
              </button>
            </form>

            <p className="text-[11px] text-slate-500 mt-4">
              Tip: Passkey is stored securely in your browser's local state.
            </p>
          </div>
        </div>
      ) : (
        /* If Authenticated: Show Full Studio UI */
        <div className={`relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border overflow-hidden shadow-2xl ${
          isDark ? 'bg-[#0B0F17] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          
          {/* Studio Modal Header */}
          <div className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? 'bg-[#0B0F17] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-base sm:text-lg font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Rohit Curiosity Content Studio
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Admin Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Markdown publishing engine & site menu section management.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLogoutAdmin}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                title="Lock Studio session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock Studio</span>
              </button>

              <button
                onClick={onClose}
                className={`p-2 rounded-xl border transition-colors ${
                  isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Top Control Toolbar (Content Type + Mode Tabs) */}
          <div className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-4 ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {/* Content Type Selector */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950/60 border border-slate-800">
              <button
                onClick={() => setContentType('blog')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  contentType === 'blog'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Blog Briefing</span>
              </button>

              <button
                onClick={() => setContentType('portfolio')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  contentType === 'portfolio'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Portfolio Project</span>
              </button>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'editor'
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Form Editor</span>
              </button>

              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>

              <button
                onClick={() => setActiveTab('inbox')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
                  activeTab === 'inbox'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Inbox</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'guide'
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Body Examples</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'security'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Edit About & Settings</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <label 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-brand-500/30 bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 hover:text-brand-200 transition-all cursor-pointer shadow-sm"
                title="Upload an existing .md file to edit and download"
              >
                <FileUp className="w-3.5 h-3.5 text-brand-400" />
                <span>Upload .md</span>
                <input
                  type="file"
                  accept=".md,.markdown,text/markdown,text/plain"
                  onChange={handleMarkdownFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-all"
                title="Copies raw Markdown with frontmatter to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Raw'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-400 text-white shadow-glow-brand transition-all"
                title="Downloads ready .md file to your computer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {slug}.md</span>
              </button>
            </div>
          </div>

          {/* Studio Content Body */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* Import Notification Banner */}
            {importMessage && (
              <div className={`mb-6 p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all ${
                importMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium">{importMessage.text}</span>
                </div>
                <button onClick={() => setImportMessage(null)} className="p-1 hover:opacity-75">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* TAB 1: Editor Form */}
            {activeTab === 'editor' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Metadata Fields Column */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400">
                      1. Frontmatter Metadata
                    </h4>
                    <label className="text-[11px] font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 cursor-pointer">
                      <FileUp className="w-3 h-3" />
                      <span>Upload .md file</span>
                      <input
                        type="file"
                        accept=".md,.markdown,text/markdown,text/plain"
                        onChange={handleMarkdownFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm ${
                        isDark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">File will save as: <code className="text-brand-400">{slug}.md</code></span>
                  </div>

                  {/* Explicit Author & Date Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Author</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          placeholder="e.g. Rohit Curiosity"
                          className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs ${
                            isDark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                          }`}
                        />
                        <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Publication Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs ${
                            isDark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                          }`}
                        />
                        <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Market Views, Tech..."
                        className={`w-full px-3.5 py-2 rounded-xl text-xs ${
                          isDark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        {contentType === 'blog' ? 'Read Time' : 'Client / Org'}
                      </label>
                      <input
                        type="text"
                        value={contentType === 'blog' ? readTime : client}
                        onChange={(e) => contentType === 'blog' ? setReadTime(e.target.value) : setClient(e.target.value)}
                        className={`w-full px-3.5 py-2 rounded-xl text-xs ${
                          isDark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  {contentType === 'portfolio' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Highlight Metric Name</label>
                        <input
                          type="text"
                          value={statMetric}
                          onChange={(e) => setStatMetric(e.target.value)}
                          placeholder="e.g. AUM Monitored"
                          className={`w-full px-3.5 py-2 rounded-xl text-xs ${
                            isDark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Metric Value</label>
                        <input
                          type="text"
                          value={statValue}
                          onChange={(e) => setStatValue(e.target.value)}
                          placeholder="e.g. $420M+"
                          className={`w-full px-3.5 py-2 rounded-xl text-xs ${
                            isDark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-400">Cover Image URL</label>
                      <label className="text-[11px] font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 cursor-pointer">
                        <Upload className="w-3 h-3" />
                        <span>Upload File</span>
                        <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="Paste image URL or click Upload File..."
                      className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono ${
                        isDark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="AI, Venture, Markets"
                      className={`w-full px-3.5 py-2 rounded-xl text-xs ${
                        isDark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Excerpt / Card Summary</label>
                    <textarea
                      rows={2}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs leading-relaxed ${
                        isDark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Markdown Content Column */}
                <div className="lg:col-span-7 flex flex-col space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400">
                      2. Article Body (Markdown)
                    </h4>

                    {/* Clean Image Embed Button */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowImageEmbedModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/40 hover:bg-brand-500/30 transition-all flex items-center gap-1.5 shadow-sm text-xs font-semibold"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-brand-400" />
                        <span>+ Embed Image at Cursor</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    ref={bodyTextareaRef}
                    rows={15}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your article in Markdown. Place cursor anywhere in text and click '+ Embed Image at Cursor'..."
                    className={`w-full flex-1 p-4 rounded-2xl text-xs sm:text-sm font-mono leading-relaxed resize-none ${
                      isDark ? 'bg-slate-950 border border-slate-800 text-slate-200' : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  />

                  <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-slate-300 flex items-center justify-between">
                    <span>Target placement folder: <code className="text-brand-400 font-bold">{targetFolder}</code></span>
                    <button
                      onClick={handleDownload}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-brand-500 text-white"
                    >
                      Download File
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: Live Preview */}
            {activeTab === 'preview' && (
              <div className={`p-8 rounded-3xl border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                {/* Header Cover Image */}
                {coverImage && (
                  <div className="relative h-64 sm:h-80 mb-6 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
                    <img
                      src={resolveMediaUrl(coverImage)}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-80 pointer-events-none" />
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
                    <span className="px-2.5 py-0.5 rounded bg-brand-500/20 text-brand-400 font-bold uppercase">{category}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-300">{author}</span>
                    <span>•</span>
                    <span>{dateStr}</span>
                    <span>•</span>
                    <span>{readTime}</span>
                  </div>
                  <h1 className={`text-3xl font-extrabold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h1>
                  <p className="text-sm text-slate-400 italic mb-4">{excerpt}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {formattedTags.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <hr className="border-slate-800" />
                </div>

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
                      img: ({ node, src, alt, ...props }) => (
                        <MarkdownImage src={src} alt={alt} />
                      ),
                      code: ({ node, inline, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';
                        const value = String(children).replace(/\n$/, '');
                        if (!inline && (language || value.includes('\n'))) {
                          return <CodeBlock language={language} value={value} />;
                        }
                        return <code className={className} {...props}>{children}</code>;
                      }
                    }}
                  >
                    {body}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* TAB: Incoming Transmissions Inbox */}
            {activeTab === 'inbox' && (
              <div className="space-y-6 max-w-5xl mx-auto py-2">
                
                {/* Inbox Control Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Inbox className="w-5 h-5 text-emerald-400" />
                        Transmission Inbox
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {contactMessages.length} Messages ({unreadCount} unread)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Direct inquiries submitted through rohitcuriosity.com contact portal.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {contactMessages.length > 0 && (
                      <>
                        <button
                          onClick={handleExportMessages}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export JSON</span>
                        </button>

                        <button
                          onClick={handleClearAllMessages}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear Inbox</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <button
                      onClick={() => setInboxFilter('all')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                        inboxFilter === 'all' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All ({contactMessages.length})
                    </button>
                    <button
                      onClick={() => setInboxFilter('unread')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                        inboxFilter === 'unread' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Unread ({unreadCount})
                    </button>
                    <button
                      onClick={() => setInboxFilter('read')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                        inboxFilter === 'read' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Read ({contactMessages.length - unreadCount})
                    </button>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={inboxSearch}
                      onChange={(e) => setInboxSearch(e.target.value)}
                      placeholder="Search sender, email, scope..."
                      className={`w-full pl-9 pr-3.5 py-1.5 rounded-xl text-xs outline-none ${
                        isDark ? 'bg-slate-950 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Message Cards List */}
                {filteredMessages.length === 0 ? (
                  <div className="py-16 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
                    <Mail className="w-10 h-10 text-slate-600 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-300">No Messages in Inbox</h4>
                    <p className="text-xs text-slate-500">
                      {inboxSearch ? 'No transmissions match your search query.' : 'Incoming contact form submissions will appear here.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMessages.map((msg) => {
                      const isUnread = msg.status === 'unread';
                      const replyMailto = `mailto:${msg.email}?subject=${encodeURIComponent(`Re: [${msg.txId || 'Transmission'}] ${msg.inquiryType || 'Inquiry'}`)}&body=${encodeURIComponent(`Hi ${msg.name},\n\nThank you for reaching out regarding your ${msg.inquiryType} briefing.\n\n---\nOriginal Message from ${msg.name} (${msg.email}):\n"${msg.message}"`)}`;

                      return (
                        <div
                          key={msg.id}
                          className={`p-5 rounded-2xl border transition-all space-y-3 ${
                            isUnread
                              ? 'bg-slate-900 border-brand-500/40 shadow-md'
                              : 'bg-slate-950/80 border-slate-800/80 opacity-90'
                          }`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800/60 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${isUnread ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                  {msg.name}
                                </h4>
                                <span className="text-xs text-brand-400 font-mono">&lt;{msg.email}&gt;</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                                <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-medium">
                                  {msg.inquiryType || 'General Inquiry'}
                                </span>
                                {msg.budget && (
                                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
                                    Tier: {msg.budget}
                                  </span>
                                )}
                                <span>•</span>
                                <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 'Recent'}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {msg.txId && (
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                                  {msg.txId}
                                </span>
                              )}
                              <button
                                onClick={() => handleToggleMessageRead(msg.id)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                                  isUnread
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                                }`}
                              >
                                {isUnread ? 'Mark Read' : 'Mark Unread'}
                              </button>
                            </div>
                          </div>

                          {/* Message Body */}
                          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                            {msg.message}
                          </div>

                          {/* Message Action Footer */}
                          <div className="flex items-center justify-between pt-1 text-xs">
                            <a
                              href={replyMailto}
                              className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold transition-all flex items-center gap-1.5 shadow-sm"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Reply via Email</span>
                            </a>

                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                              title="Delete message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: Workflow & Body Examples Guide */}
            {activeTab === 'guide' && (
              <div className="space-y-6 max-w-4xl mx-auto py-2">
                <div className="p-5 rounded-2xl bg-brand-500/10 border border-brand-500/30">
                  <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-brand-400" />
                    Rich Media Markdown Examples & Syntax Guide
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Copy and paste these exact syntax patterns into your article body to render math equations, inline images with captions, Python scripts, and architecture diagrams.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Example 1: Math Formula */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <Calculator className="w-4 h-4" /> 1. KaTeX Math Notation
                    </div>
                    <p className="text-[11px] text-slate-400">Inline ($E = mc^2$) or Display Block Equation ($$\\dots$$):</p>
                    <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`Inline formula: $E = mc^2$

Display equation block:
$$\\displaystyle Y_{node} = \\sum_{t=1}^{T} \\frac{\\alpha \\cdot \\text{FLOPs}_t - \\beta \\cdot P_{\\grid}(t)}{(1 + r)^t}$$`}
                    </pre>
                  </div>

                  {/* Example 2: Inline Image with Caption */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                      <ImageIcon className="w-4 h-4" /> 2. Body Image with Lightbox
                    </div>
                    <p className="text-[11px] text-slate-400">Standard markdown image syntax with custom caption:</p>
                    <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`![High-density sovereign GPU compute data center colocation](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80)`}
                    </pre>
                  </div>

                  {/* Example 3: Python Script */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <Code2 className="w-4 h-4" /> 3. Python Script Snippet
                    </div>
                    <p className="text-[11px] text-slate-400">Code block with syntax highlighting & Copy button:</p>
                    <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`\`\`\`python
# Short Python Hello World & Compute Telemetry Snippet
def main():
    print("Hello World! Welcome to Rohit Curiosity Intelligence Engine.")

if __name__ == "__main__":
    main()
\`\`\``}
                    </pre>
                  </div>

                  {/* Example 4: Mermaid Diagram */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                      <Layers className="w-4 h-4" /> 4. Mermaid Architecture Diagram
                    </div>
                    <p className="text-[11px] text-slate-400">Renders live interactive SVG diagrams:</p>
                    <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`\`\`\`mermaid
graph TD
    A[Global Telemetry] --> B(Ingestion Mesh)
    B --> C[GPU Compute Cluster]
\`\`\``}
                    </pre>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 4: Site Menu Control & Security Passkey */}
            {activeTab === 'security' && (
              <div className="max-w-2xl mx-auto py-4 space-y-6">
                
                {/* SECTION CONTROL SETTINGS */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-brand-400" />
                        Main Menu & Website Section Visibility Controls
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Gradually enable or disable sections displayed on your public website.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    
                    {/* About Section Toggle */}
                    <div 
                      onClick={() => handleToggleSection('about')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        sectionConfig.about 
                          ? 'bg-brand-500/10 border-brand-500/30 text-white' 
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">About Me Section</div>
                        <div className="text-[10px] text-slate-400">Pillars, Journey & Photo</div>
                      </div>
                      {sectionConfig.about ? <CheckSquare className="w-5 h-5 text-brand-400" /> : <Square className="w-5 h-5 text-slate-600" />}
                    </div>

                    {/* Views & Blogs Section Toggle */}
                    <div 
                      onClick={() => handleToggleSection('blogs')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        sectionConfig.blogs 
                          ? 'bg-brand-500/10 border-brand-500/30 text-white' 
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">Views & Blogs Section</div>
                        <div className="text-[10px] text-slate-400">Market Briefs & Articles</div>
                      </div>
                      {sectionConfig.blogs ? <CheckSquare className="w-5 h-5 text-brand-400" /> : <Square className="w-5 h-5 text-slate-600" />}
                    </div>

                    {/* Portfolio Section Toggle */}
                    <div 
                      onClick={() => handleToggleSection('portfolio')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        sectionConfig.portfolio 
                          ? 'bg-brand-500/10 border-brand-500/30 text-white' 
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">Portfolio Section</div>
                        <div className="text-[10px] text-slate-400">Venture Cases</div>
                      </div>
                      {sectionConfig.portfolio ? <CheckSquare className="w-5 h-5 text-brand-400" /> : <Square className="w-5 h-5 text-slate-600" />}
                    </div>

                  </div>
                </div>

                {/* EDIT ABOUT SECTION CONFIGURATION CARD */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-brand-400" />
                        Edit About Section Content & 3-Part Layout
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Customize professional photo, mission statement, and profile info displayed on the website.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-semibold text-slate-400">
                            Professional Photo (Left Top)
                          </label>
                          <label className="text-[11px] font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 cursor-pointer">
                            <Upload className="w-3 h-3" />
                            <span>Upload Image</span>
                            <input type="file" accept="image/*" onChange={handleProfileImageUpload} className="hidden" />
                          </label>
                        </div>
                        <input
                          type="text"
                          value={aboutConfig.imageUrl || ''}
                          onChange={(e) => handleUpdateAboutField('imageUrl', e.target.value)}
                          placeholder="Paste image URL or click Upload Image..."
                          className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono ${
                            isDark ? 'bg-slate-950 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">
                          Full Name & Title
                        </label>
                        <input
                          type="text"
                          value={aboutConfig.name || ''}
                          onChange={(e) => handleUpdateAboutField('name', e.target.value)}
                          placeholder="Rohit Curiosity"
                          className={`w-full px-3.5 py-2 rounded-xl text-xs ${
                            isDark ? 'bg-slate-950 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Role Title / Headline
                      </label>
                      <input
                        type="text"
                        value={aboutConfig.roleTitle || ''}
                        onChange={(e) => handleUpdateAboutField('roleTitle', e.target.value)}
                        placeholder="Founder & Principal Architect"
                        className={`w-full px-3.5 py-2 rounded-xl text-xs ${
                          isDark ? 'bg-slate-950 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Mission Title (Left Bottom Card)
                      </label>
                      <input
                        type="text"
                        value={aboutConfig.missionTitle || ''}
                        onChange={(e) => handleUpdateAboutField('missionTitle', e.target.value)}
                        placeholder="Curiosity as a Competitive Moat"
                        className={`w-full px-3.5 py-2 rounded-xl text-xs ${
                          isDark ? 'bg-slate-950 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Mission & Goal Statement Text (Left Bottom Card)
                      </label>
                      <textarea
                        rows={3}
                        value={aboutConfig.missionText || ''}
                        onChange={(e) => handleUpdateAboutField('missionText', e.target.value)}
                        placeholder="Enter your mission statement paragraph..."
                        className={`w-full px-3.5 py-2 rounded-xl text-xs leading-relaxed ${
                          isDark ? 'bg-slate-950 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* PASSKEY CHANGE FORM */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    Change Admin Master Passkey
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Set a custom master passcode to secure your Content Studio.
                  </p>

                  {passcodeSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>{passcodeSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePasscode} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        New Master Passcode
                      </label>
                      <input
                        type="password"
                        required
                        value={newPasscodeInput}
                        onChange={(e) => setNewPasscodeInput(e.target.value)}
                        placeholder="Enter minimum 4 characters..."
                        className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm ${
                          isDark ? 'bg-slate-950 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-400 text-white shadow-glow-brand"
                    >
                      Update Passkey
                    </button>
                  </form>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* EMBED IMAGE SUB-MODAL */}
      {showImageEmbedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`relative w-full max-w-lg p-6 rounded-3xl border shadow-2xl ${
            isDark ? 'bg-[#0B0F17] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-400" />
                Embed Image at Cursor Position
              </h3>
              <button 
                type="button" 
                onClick={() => setShowImageEmbedModal(false)} 
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  1. Select Photo File from Device OR Paste URL
                </label>
                <div className="flex items-center gap-2">
                  <label className="px-3.5 py-2 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/40 hover:bg-brand-500/30 text-xs font-bold cursor-pointer flex items-center gap-1.5 flex-shrink-0">
                    <Upload className="w-4 h-4 text-brand-400" />
                    <span>Upload File</span>
                    <input type="file" accept="image/*" onChange={handleEmbedModalFileUpload} className="hidden" />
                  </label>
                  <input
                    type="text"
                    value={embedImageUrl}
                    onChange={(e) => setEmbedImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className={`flex-1 px-3.5 py-2 rounded-xl text-xs font-mono ${
                      isDark ? 'bg-slate-950 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  2. Image Caption / Subtitle
                </label>
                <input
                  type="text"
                  value={embedImageCaption}
                  onChange={(e) => setEmbedImageCaption(e.target.value)}
                  placeholder="e.g. Figure 1: High-density GPU cluster interconnect"
                  className={`w-full px-3.5 py-2 rounded-xl text-xs ${
                    isDark ? 'bg-slate-950 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Live Preview Box */}
              {embedImageUrl && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold text-brand-400 mb-2">Live Image Preview</span>
                  <img src={embedImageUrl} alt="Preview" className="max-h-48 object-contain rounded-xl border border-slate-800" />
                  {embedImageCaption && <span className="text-[11px] text-slate-400 italic mt-2 text-center">{embedImageCaption}</span>}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowImageEmbedModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertEmbeddedImage}
                  disabled={!embedImageUrl.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-400 text-white shadow-glow-brand disabled:opacity-50"
                >
                  Insert Image at Cursor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
