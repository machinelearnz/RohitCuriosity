import React, { useState, useMemo } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  ArrowRight, 
  BarChart2, 
  Cpu, 
  Sparkles,
  Layers,
  PlusCircle
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';

export default function PortfolioSection({ portfolio, onSelectProject, onOpenStudio, isDark, isAdmin }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract all categories
  const categories = useMemo(() => {
    const set = new Set(portfolio.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [portfolio]);

  // Filtered portfolio items
  const filteredPortfolio = useMemo(() => {
    return portfolio.filter(item => {
      return selectedCategory === 'All' || item.category === selectedCategory;
    });
  }, [portfolio, selectedCategory]);

  return (
    <section id="portfolio" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Showcase & Case Studies</span>
            </div>
            <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Architected <span className="text-brand-400">Ventures & Systems</span>
            </h2>
            <p className={`text-sm sm:text-base mt-2 max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Selected production systems, institutional dashboards, and algorithmic models built by CuriosityInc.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={onOpenStudio}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                isDark 
                  ? 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-brand-500 hover:text-white' 
                  : 'bg-white border-slate-300 text-slate-700 hover:border-brand-500 hover:text-slate-900 shadow-sm'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-brand-400" />
              <span>Add Showcase Item</span>
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-brand-500 to-blue-600 text-white shadow-glow-brand'
                  : isDark
                    ? 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredPortfolio.map((item) => (
            <div
              key={item.slug}
              className={`group rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${
                isDark 
                  ? 'bg-slate-900/60 border-slate-800/90 hover:border-brand-500/50 shadow-card-dark' 
                  : 'bg-white border-slate-200 hover:border-brand-400 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Project Cover & Overlay */}
              <div>
                <div className="relative h-52 overflow-hidden bg-slate-950">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/30 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-black/60 text-brand-300 border border-brand-500/30 backdrop-blur-md">
                      {item.category}
                    </span>
                  </div>

                  {/* Highlight Stat Pill */}
                  {item.stats && item.stats.value && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md flex items-center justify-between shadow-lg">
                        <span className="text-[11px] text-slate-400 font-medium">{item.stats.metric}</span>
                        <span className="text-xs font-extrabold text-amber-400 font-mono">{item.stats.value}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <span className="text-brand-400 font-medium">{item.role}</span>
                    <span>•</span>
                    <span>{item.client}</span>
                  </div>

                  <h3 className={`text-xl font-bold tracking-tight mb-2 transition-colors group-hover:text-brand-400 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {item.title}
                  </h3>

                  <p className={`text-xs sm:text-sm leading-relaxed line-clamp-3 mb-6 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {item.summary}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {item.technologies.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/40"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                <button
                  onClick={() => onSelectProject(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-400 text-white shadow-glow-brand transition-all"
                >
                  <span>Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {item.demoUrl && item.demoUrl !== '#' && (
                  <a
                    href={item.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Live Demo"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {item.githubUrl && (
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Source Repository"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
