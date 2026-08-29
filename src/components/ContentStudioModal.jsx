import React, { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ContentStudioModal({ isOpen, onClose, isDark, onAdminStatusChange }) {
  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('rohit_admin_session') === 'true';
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [newPasscodeInput, setNewPasscodeInput] = useState('');
  const [passcodeSuccess, setPasscodeSuccess] = useState('');

  // Studio State
  const [contentType, setContentType] = useState('blog'); // 'blog' or 'portfolio'
  const [activeTab, setActiveTab] = useState('editor'); // 'editor', 'preview', 'guide', 'security'
  const [copied, setCopied] = useState(false);

  // Form State
  const [title, setTitle] = useState('Sovereign Compute & The New Capital Moats');
  const [category, setCategory] = useState('Market Views');
  const [author, setAuthor] = useState('Rohit Curiosity');
  const [readTime, setReadTime] = useState('5 min read');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');
  const [tags, setTags] = useState('Macroeconomics, Sovereign AI, Venture Strategy');
  const [excerpt, setExcerpt] = useState('A concise exploration of how energy availability and sovereign clusters dictate enterprise valuation models.');
  
  // Portfolio specific
  const [client, setClient] = useState('Institutional Desk');
  const [role, setRole] = useState('Lead Architect');
  const [statMetric, setStatMetric] = useState('AUM Monitored');
  const [statValue, setStatValue] = useState('$250M+');
  const [demoUrl, setDemoUrl] = useState('https://example.com/demo');

  // Markdown Body
  const [body, setBody] = useState(`## Executive Thesis

In this briefing, we explore the fundamental shift occurring across capital markets and autonomous compute architectures.

### 1. Key Structural Shifts
- **Constraint Transition:** Moving from token speed to raw power availability.
- **Valuation Dynamics:** Vertical outcome-based billing replacing seat-based SaaS.

> "The true moat of modern technology is first-principles insight combined with deterministic execution."

### 2. Actionable Takeaways
1. Prioritize energy co-located infrastructure.
2. Build verified autonomous agent pipelines.`);

  // Handle passkey verification
  const handleVerifyPasskey = (e) => {
    e.preventDefault();
    const storedPasscode = localStorage.getItem('rohit_admin_passcode') || 'rohit2026';
    
    if (passkeyInput.trim() === storedPasscode) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('rohit_admin_session', 'true');
      setAuthError('');
      setPasskeyInput('');
      if (onAdminStatusChange) onAdminStatusChange(true);
    } else {
      setAuthError('Invalid Admin Passkey. Access is strictly restricted to Rohit Curiosity administrators.');
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
  const dateStr = new Date().toISOString().split('T')[0];

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

  const handleDownload = () => {
    const blob = new Blob([fullMarkdown], { type: 'text/markdown;charset=utf-8' });
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
    navigator.clipboard.writeText(fullMarkdown);
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
              <span>Admin Protected Area</span>
            </div>

            <h3 className={`text-2xl font-extrabold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Content Studio Authorization
            </h3>
            
            <p className={`text-xs leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Creating and modifying markdown content is strictly restricted to the administrator of <span className="font-semibold text-brand-400">rohitcuriosity.com</span>.
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
                  placeholder="Enter Admin Passkey..."
                  className={`w-full pl-4 pr-11 py-3 rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-brand-400 ${
                    isDark ? 'bg-slate-900 border border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-400 hover:to-blue-500 text-white shadow-glow-brand transition-all"
              >
                <Unlock className="w-4 h-4" />
                <span>Verify & Unlock Studio</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800/80 w-full text-center">
              <p className="text-[11px] text-slate-500">
                Default Master Passkey: <code className="text-amber-400 font-mono">rohit2026</code>
              </p>
            </div>

          </div>
        </div>
      ) : (
        /* Authenticated Admin Studio View */
        <div className={`relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border overflow-hidden shadow-2xl ${
          isDark ? 'bg-[#0B0F17] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          
          {/* Header Bar */}
          <div className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? 'bg-[#0B0F17]/90 border-slate-800' : 'bg-white/90 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500 to-amber-500 text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Content Studio & Markdown CMS
                  </h3>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Admin Verified</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400">Create, preview, and export articles with zero coding required.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLogoutAdmin}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors"
                title="Lock studio and log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock Studio</span>
              </button>

              <button
                onClick={onClose}
                className={`p-2 rounded-xl border transition-colors ${
                  isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader: Content Type & View Tabs */}
          <div className={`flex flex-wrap items-center justify-between px-6 py-3 border-b gap-3 ${
            isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
          }`}>
            {/* Switch Content Type */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/30 border border-slate-800">
              <button
                onClick={() => {
                  setContentType('blog');
                  setCategory('Market Views');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  contentType === 'blog' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Blog Article</span>
              </button>
              <button
                onClick={() => {
                  setContentType('portfolio');
                  setCategory('Fintech & Data');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  contentType === 'portfolio' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Portfolio Case Study</span>
              </button>
            </div>

            {/* View Modes */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-black/30 border border-slate-800">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    activeTab === 'editor' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Form Editor</span>
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    activeTab === 'preview' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Preview</span>
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    activeTab === 'guide' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Workflow</span>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    activeTab === 'security' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Security</span>
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
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
            
            {/* TAB 1: Editor Form */}
            {activeTab === 'editor' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Metadata Fields Column */}
                <div className="lg:col-span-6 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400">
                    1. Frontmatter Metadata
                  </h4>

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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Market Views, Tech, Strategy..."
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
                          placeholder="e.g. AUM Monitored, Users"
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
                          placeholder="e.g. $420M+, +200%"
                          className={`w-full px-3.5 py-2 rounded-xl text-xs ${
                            isDark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Cover Image URL</label>
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
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
                <div className="lg:col-span-6 flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400">
                      2. Article Body (Markdown)
                    </h4>
                    <span className="text-[11px] text-slate-500">Supports full GitHub Markdown</span>
                  </div>

                  <textarea
                    rows={14}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className={`w-full flex-1 p-4 rounded-2xl text-xs sm:text-sm font-mono leading-relaxed resize-none ${
                      isDark ? 'bg-slate-950 border border-slate-800 text-slate-200' : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  />

                  <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-slate-300 flex items-center justify-between">
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
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <span className="px-2.5 py-0.5 rounded bg-brand-500/20 text-brand-400 font-bold uppercase">{category}</span>
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
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {body}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* TAB 3: Workflow Guide */}
            {activeTab === 'guide' && (
              <div className="space-y-6 max-w-3xl mx-auto py-4">
                <div className="p-6 rounded-2xl bg-brand-500/10 border border-brand-500/30">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-brand-400" />
                    Admin Markdown Content Flow
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    As an authenticated admin, you can write and export posts directly to your repository folder.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center mb-3">
                      1
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">Create or Edit</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Use the Form Editor to compose your article and metadata.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mb-3">
                      2
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">Download & Save</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Click Download and drop into:
                      <br /><code className="text-[11px] text-brand-400">{targetFolder}</code>
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mb-3">
                      3
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">Instant Sync</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The site automatically updates the article feed on rohitcuriosity.com!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Security & Custom Passkey */}
            {activeTab === 'security' && (
              <div className="max-w-xl mx-auto py-6 space-y-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    Change Admin Passkey
                  </h4>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Set a custom master passcode to secure your Content Studio. This replaces the default <code className="text-amber-400">rohit2026</code>.
                  </p>

                  {passcodeSuccess && (
                    <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
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

    </div>
  );
}
