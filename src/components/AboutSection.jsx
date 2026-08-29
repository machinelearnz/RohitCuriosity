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
  Rocket
} from 'lucide-react';

export default function AboutSection({ isDark }) {
  const [activeTab, setActiveTab] = useState('pillars');

  const pillars = [
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

  const milestones = [
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

  const skills = [
    'Market Intelligence', 'Macro Modeling', 'Autonomous AI Agents', 'React & TypeScript', 
    'Tailwind CSS', 'Vite & Next.js', 'Venture Strategy', 'Capital Allocation', 
    'Vector Embeddings', 'System Architecture', 'Zero-Code CMS Design', 'UI/UX Craft'
  ];

  return (
    <section id="about" className="py-24 relative">
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

        {/* Bio Overview & Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Avatar & Quick Info */}
          <div className={`lg:col-span-5 p-8 rounded-3xl border relative overflow-hidden ${
            isDark ? 'bg-slate-900/60 border-slate-800 shadow-card-dark' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 via-indigo-500 to-amber-500 p-0.5 shadow-glow-brand">
                <div className={`w-full h-full rounded-[14px] flex items-center justify-center font-extrabold text-2xl ${
                  isDark ? 'bg-[#0B0F17] text-brand-400' : 'bg-white text-brand-600'
                }`}>
                  RC
                </div>
              </div>
              <div>
                <h3 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Rohit Curiosity
                </h3>
                <p className="text-sm font-medium text-brand-400 font-mono">rohitcuriosity.com</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs text-emerald-400 font-medium">Available for Advisory & Projects</span>
                </div>
              </div>
            </div>

            <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              "We believe that in an era of abundant AI code generation, the primary leverage shifts to **first-principles inquiry**, **system architecture**, and **uncompromising clarity of thought**."
            </p>

            <div className="space-y-2.5 mb-8">
              {[
                'Specialized in Macro Market & Tech Synthesis',
                'Architect of Autonomous Enterprise Tools',
                'Advocate for Lean, Zero-Overhead Software'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#contact"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-400 text-white shadow-glow-brand transition-all"
              >
                <span>Connect</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => alert("Personal Brief & CV PDF is ready for download in your release package.")}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold border transition-all ${
                  isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download CV</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Tabs for Pillars vs Journey */}
          <div className="lg:col-span-7">
            {/* Tab Selector */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/40 border border-slate-800 mb-6 max-w-md">
              <button
                onClick={() => setActiveTab('pillars')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'pillars' 
                    ? 'bg-brand-500 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Core Pillars
              </button>
              <button
                onClick={() => setActiveTab('journey')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'journey' 
                    ? 'bg-brand-500 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Career Milestone Track
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'skills' 
                    ? 'bg-brand-500 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Skill Stack
              </button>
            </div>

            {/* Tab 1: Core Pillars */}
            {activeTab === 'pillars' && (
              <div className="space-y-4">
                {pillars.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-6 rounded-2xl border transition-all duration-200 hover:border-brand-500/50 ${
                        isDark ? 'bg-slate-900/50 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 flex-shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {pillar.title}
                          </h4>
                          <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {pillar.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {pillar.points.map((pt, pidx) => (
                              <span
                                key={pidx}
                                className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800/70 text-slate-300 border border-slate-700/50"
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
              <div className={`p-6 rounded-2xl border ${
                isDark ? 'bg-slate-900/50 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-800">
                  {milestones.map((m, idx) => (
                    <div key={idx} className="relative flex items-start gap-5 pl-8">
                      <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-brand-500 border-2 border-[#0B0F17] shadow-glow-brand" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-amber-400">{m.year}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs font-semibold text-brand-400">{m.role}</span>
                        </div>
                        <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {m.title}
                        </h4>
                        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {m.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Skills & Competencies */}
            {activeTab === 'skills' && (
              <div className={`p-6 rounded-2xl border ${
                isDark ? 'bg-slate-900/50 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Expertise & Core Competencies
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20 hover:bg-brand-500/20 transition-colors"
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
