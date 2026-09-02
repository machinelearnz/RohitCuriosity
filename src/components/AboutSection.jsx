import React, { useState } from 'react';
import { 
  User, 
  Lightbulb, 
  Target, 
  Layers, 
  Download, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  ArrowUpRight,
  Brain,
  Code2,
  BarChart3,
  Rocket,
  ShieldCheck,
  Award,
  Briefcase,
  Wrench
} from 'lucide-react';

export default function AboutSection({ isDark, aboutData = {} }) {
  const [activeTab, setActiveTab] = useState('pillars');

  // Default Fallbacks for About Section Data
  const profileImage = aboutData.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
  const name = aboutData.name || 'Rohit Curiosity';
  const roleTitle = aboutData.roleTitle || 'Founder & Principal Architect';
  const missionTitle = aboutData.missionTitle || 'Curiosity as a Competitive Moat';
  const missionText = aboutData.missionText || 'We believe that in an era of abundant AI code generation, the primary leverage shifts to first-principles inquiry, resilient system architecture, and uncompromising clarity of thought.';
  
  const pillars = aboutData.pillars || [
    {
      title: 'High-Conviction Market Analysis',
      icon: BarChart3,
      description: 'Dissecting structural shifts across sovereign compute, energy grid economics, and enterprise software valuation models.',
      points: ['Quantitative Liquidity Tracking', 'Macro Valuation Modeling', 'Sovereign AI Infrastructure Analysis']
    },
    {
      title: 'Autonomous System Architectures',
      icon: Brain,
      description: 'Designing deterministic agentic pipelines, tool-routing execution loops, and automated intelligence engines.',
      points: ['Multi-Agent Coordination', 'Stateful Action Execution', 'Vector Knowledge Synthesis']
    },
    {
      title: 'Boutique Venture Engineering',
      icon: Rocket,
      description: 'Prototyping zero-to-one digital products and financial modeling software with capital discipline and rapid iteration cycles.',
      points: ['Rapid 72-Hour Prototyping', 'Monte Carlo Fund Simulators', 'Lean Markdown Headless Systems']
    }
  ];

  const milestones = aboutData.milestones || [
    {
      year: '2026',
      title: 'Rohit Curiosity Research & Venture Studio',
      role: 'Founder & Principal Architect',
      description: 'Publishing market intelligence briefs at rohitcuriosity.com and architecting bespoke decision terminals for institutional family offices.'
    },
    {
      year: '2024 - 2025',
      title: 'Autonomous Systems & Fintech Lead',
      role: 'Senior Product & System Strategist',
      description: 'Directed real-time order-book analytics engines and led agentic workflow adoption across distributed operations.'
    },
    {
      year: '2022 - 2024',
      title: 'Quantitative Research & Product Engineering',
      role: 'Lead Quantitative Developer',
      description: 'Engineered Monte Carlo simulation tools for venture fund portfolios and modeled asset allocation heuristics.'
    }
  ];

  const skills = aboutData.skills || [
    'Market Intelligence', 'Macro Modeling', 'Autonomous AI Agents', 'React & TypeScript', 
    'Tailwind CSS', 'Vite & Next.js', 'Venture Strategy', 'Capital Allocation', 
    'Vector Embeddings', 'System Architecture', 'Zero-Code CMS Design', 'UI/UX Craft'
  ];

  return (
    <section id="about" className="py-24 relative">
      {/* Background Accent */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            <User className="w-3.5 h-3.5" />
            <span>Profile & Manifesto</span>
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Curiosity as a <span className="text-brand-400">Competitive Moat</span>
          </h2>
          <p className={`text-base sm:text-lg max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Operating at the intersection of deep analytical curiosity, software architecture, and venture building.
          </p>
        </div>

        {/* 3-PART ABOUT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN (5 Cols): Left Top (Image) & Left Bottom (Mission) */}
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
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-black/70 text-amber-400 backdrop-blur-md border border-amber-500/30">
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
                <p className="text-xs font-semibold text-brand-400 font-mono mb-3">{roleTitle}</p>
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Available for Advisory, Compute & Venture Strategy</span>
                </div>
              </div>
            </div>

            {/* PART 2: LEFT BOTTOM - Mission or Goal Statement Card */}
            <div className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between flex-1 relative overflow-hidden ${
              isDark ? 'bg-slate-900/60 border-slate-800 shadow-card-dark' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
                  <Target className="w-3.5 h-3.5" />
                  <span>Mission & Vision Statement</span>
                </div>

                <h4 className={`text-xl font-bold tracking-tight mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {missionTitle}
                </h4>

                <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  "{missionText}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">Core Directive</span>
                <a
                  href="#contact"
                  className="flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors"
                >
                  <span>Connect Directly</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* PART 3: RIGHT COLUMN (7 Cols) - Core Pillars / Milestones / Skill Stack */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* Tab Controls */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6">
              {[
                { id: 'pillars', label: 'Core Pillars', icon: BarChart3 },
                { id: 'journey', label: 'Career Milestones', icon: Briefcase },
                { id: 'skills', label: 'Skill Stack', icon: Wrench },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-500 text-white shadow-glow-brand'
                        : isDark
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Core Pillars */}
            {activeTab === 'pillars' && (
              <div className="space-y-4 flex-1">
                {pillars.map((pillar, idx) => {
                  const Icon = pillar.icon || BarChart3;
                  return (
                    <div
                      key={idx}
                      className={`p-6 rounded-3xl border transition-all duration-200 hover:border-brand-500/50 ${
                        isDark ? 'bg-slate-900/60 border-slate-800/90 shadow-card-dark' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 flex-shrink-0 border border-brand-500/20">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className={`text-base font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {pillar.title}
                          </h4>
                          <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {pillar.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(pillar.points || []).map((pt, pidx) => (
                              <span
                                key={pidx}
                                className="px-3 py-1 rounded-lg text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50"
                              >
                                {pt}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Career Milestones */}
            {activeTab === 'journey' && (
              <div className={`p-8 rounded-3xl border flex-1 ${
                isDark ? 'bg-slate-900/60 border-slate-800/90 shadow-card-dark' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h4 className={`text-sm font-extrabold uppercase tracking-wider mb-6 text-brand-400`}>
                  Executive Career Timeline & Track Record
                </h4>
                <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
                  {milestones.map((m, idx) => (
                    <div key={idx} className="relative flex items-start gap-6 pl-10">
                      <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-brand-500 border-2 border-[#0B0F17] shadow-glow-brand" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{m.year}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs font-semibold text-brand-400">{m.role}</span>
                        </div>
                        <h5 className={`text-base font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {m.title}
                        </h5>
                        <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {m.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Skills & Core Competencies */}
            {activeTab === 'skills' && (
              <div className={`p-8 rounded-3xl border flex-1 ${
                isDark ? 'bg-slate-900/60 border-slate-800/90 shadow-card-dark' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h4 className={`text-sm font-extrabold uppercase tracking-wider mb-6 text-brand-400`}>
                  Technical Stack & Domain Expertise
                </h4>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20 hover:bg-brand-500/20 transition-colors shadow-sm"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
