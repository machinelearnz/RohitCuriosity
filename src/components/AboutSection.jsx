import React, { useState } from 'react';
import { 
  User, 
  Target, 
  Layers, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  ArrowUpRight,
  Code2,
  BarChart3,
  Award,
  Briefcase,
  Wrench,
  GraduationCap,
  Building2,
  TrendingUp,
  Cpu,
  BookOpen,
  ShieldCheck
} from 'lucide-react';

export default function AboutSection({ isDark, aboutData = {} }) {
  const [activeTab, setActiveTab] = useState('education');

  // Profile data
  const profileImage = aboutData.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
  const name = aboutData.name || 'Rohit Gajare';
  const roleTitle = aboutData.roleTitle || 'Product Management | Treasury, Risk & Quantitative Solutions';
  const missionTitle = aboutData.missionTitle || 'Leverage AI & Analytics to understand markets and manage risks';

  // 1. Education & Certifications
  const educationList = [
    {
      degree: 'B.E. Electronics',
      institution: 'VJTI Mumbai',
      year: '2001',
      category: 'Engineering Degree',
      highlight: 'Premier Engineering Institute'
    },
    {
      degree: 'MBA',
      institution: 'IIM Lucknow',
      year: '2006',
      category: 'Postgraduate Management',
      highlight: 'Top Tier Indian Business School'
    },
    {
      degree: 'Chartered Financial Analyst (CFA)',
      institution: 'CFA Institute',
      year: '2009',
      category: 'Global Investment Charter',
      highlight: 'Global Standard in Investment Analysis'
    },
    {
      degree: 'Financial Risk Manager (FRM)',
      institution: 'GARP (Global Association of Risk Professionals)',
      year: '2016',
      category: 'Risk Management Certification',
      highlight: 'Global Leader in Financial Risk'
    }
  ];

  // 2. Career Track
  const careerList = [
    {
      role: 'Product Management — Treasury & Risk Solutions',
      company: 'Intellect Design Arena',
      domain: 'Treasury & Risk Management Products'
    },
    {
      role: 'Assistant Fund Manager — Debt & Equity',
      company: 'UTI AMC',
      domain: 'Asset Management & Fund Strategy'
    },
    {
      role: 'Internship',
      company: 'UBS Investment Bank (Stamford CT, USA via Mountbatten Internship Program)',
      domain: 'Global Investment Banking'
    },
    {
      role: 'Fixed Income Analyst',
      company: 'Progeon (Infosys company)',
      domain: 'Fixed Income Analytics & Operations'
    },
    {
      role: 'Chip Design Engineer',
      company: 'Texas Instruments India',
      domain: 'Semiconductor VLSI & Systems Design'
    }
  ];

  // 3. Skills Stack (Technical & Domain)
  const technicalSkills = [
    'Business Analysis',
    'Business Requirement Documents',
    'Functional Specification Document',
    'Modelling',
    'Prototyping',
    'Python (Pandas, NumPy, QuantLib)',
    'MS Excel – VBA',
    'PowerPoint',
    'MS Word',
    'Visualizations',
    'Tableau',
    'Generative AI',
    'Prompt Engineering',
    'Machine Learning',
    'LLM',
    'Predictive Modelling'
  ];

  const domainSkills = [
    'Fixed Income',
    'CSGL',
    'Yield Curve Construction',
    'Liquidity Management',
    'Equity',
    'Foreign Exchange',
    'Collateral Management',
    'Security Lending',
    'RFR / ARR',
    'Investment Strategy',
    'Investment & Wealth Management',
    'Risk Management',
    'Valuation',
    'Pricing',
    'Performance & Attribution',
    'Asset Allocation',
    'Insurance Investments',
    'Decentralized Finance'
  ];

  return (
    <section id="about" className="py-24 relative">
      {/* Background Accent */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-3">
            <User className="w-3.5 h-3.5" />
            <span>Profile & Background</span>
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Background & <span className="text-brand-400">Expertise</span>
          </h2>
          <p className={`text-base sm:text-lg max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Operating at the intersection of quantitative finance, treasury risk management, and intelligent software systems.
          </p>
        </div>

        {/* 3-PART ABOUT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN (5 Cols): Left Top (Image & Identity) & Left Bottom (Mission Card) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* PART 1: LEFT TOP - Professional Image Card */}
            <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden flex flex-col justify-between ${
              isDark ? 'bg-slate-900/60 border-slate-800 shadow-card-dark' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden mb-6 group border border-slate-800">
                <img
                  src={profileImage}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-black/70 text-brand-400 backdrop-blur-md border border-brand-500/30">
                    rohitcuriosity.com
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/90 text-white backdrop-blur-md">
                    Verified Profile
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {name}
                  </h3>
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-xs font-semibold text-brand-400 font-mono">{roleTitle}</p>
              </div>
            </div>

            {/* PART 2: LEFT BOTTOM - Mission or Goal Statement Card */}
            <div className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between flex-1 relative overflow-hidden ${
              isDark ? 'bg-slate-900/60 border-slate-800 shadow-card-dark' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-4">
                  <Target className="w-3.5 h-3.5" />
                  <span>Mission & Vision Statement</span>
                </div>

                <h4 className={`text-xl font-bold tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {missionTitle}
                </h4>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">Core Directive</span>
                <a
                  href="/#contact"
                  className="flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors"
                >
                  <span>Connect Directly</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (7 Cols) - Education & Certifications / Career / Skills */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* Tab Controls */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6">
              {[
                { id: 'education', label: 'Education & Certifications', icon: GraduationCap },
                { id: 'career', label: 'Career', icon: Briefcase },
                { id: 'skills', label: 'Skills', icon: Wrench },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-500 text-white shadow-glow-brand'
                        : isDark
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Education & Certifications */}
            {activeTab === 'education' && (
              <div className="space-y-4 flex-1">
                {educationList.map((edu, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-3xl border transition-all duration-200 hover:border-brand-500/50 ${
                      isDark ? 'bg-slate-900/60 border-slate-800/90 shadow-card-dark' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 flex-shrink-0 border border-brand-500/20">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {edu.degree}
                          </h4>
                          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                            {edu.year}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-brand-400 mb-1">
                          {edu.institution}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {edu.category} • {edu.highlight}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Career Track */}
            {activeTab === 'career' && (
              <div className={`p-6 sm:p-8 rounded-3xl border flex-1 ${
                isDark ? 'bg-slate-900/60 border-slate-800/90 shadow-card-dark' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h4 className="text-xs font-extrabold uppercase tracking-wider mb-6 text-brand-400 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Professional Experience & Leadership</span>
                </h4>
                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
                  {careerList.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-5 pl-10">
                      <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-brand-500 border-2 border-[#0B0F17] shadow-glow-brand" />
                      <div className="flex-1">
                        <h5 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {item.role}
                        </h5>
                        <p className="text-xs sm:text-sm font-semibold text-brand-400 mb-1">
                          {item.company}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {item.domain}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Skills (Technical & Domain) */}
            {activeTab === 'skills' && (
              <div className={`p-6 sm:p-8 rounded-3xl border flex-1 space-y-8 ${
                isDark ? 'bg-slate-900/60 border-slate-800/90 shadow-card-dark' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                
                {/* 1. Technical Skills */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider mb-4 text-brand-400 flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    <span>Technical & Analytical Expertise</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {technicalSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20 hover:bg-brand-500/20 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. Domain Skills */}
                <div className="pt-6 border-t border-slate-800">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider mb-4 text-amber-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Financial Markets & Domain Expertise</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {domainSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
