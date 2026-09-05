import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  FileText,
  PlusCircle,
  Filter,
  Layers,
  ChevronDown
} from 'lucide-react';
import { getYearMonthHierarchy } from '../utils/contentLoader';

export default function BlogSection({ blogs = [], onSelectBlog, onOpenStudio, isDark }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');

  // Year > Month hierarchy structure
  const yearMonthHierarchy = useMemo(() => {
    return getYearMonthHierarchy(blogs);
  }, [blogs]);

  // Available Years
  const availableYears = useMemo(() => {
    return ['All', ...Object.keys(yearMonthHierarchy).sort((a, b) => b - a)];
  }, [yearMonthHierarchy]);

  // Available Months for selected Year
  const availableMonths = useMemo(() => {
    if (selectedYear === 'All' || !yearMonthHierarchy[selectedYear]) {
      return ['All'];
    }
    return ['All', ...Object.keys(yearMonthHierarchy[selectedYear].months)];
  }, [selectedYear, yearMonthHierarchy]);

  // Distinct Categories
  const categories = useMemo(() => {
    const set = new Set(blogs.map(b => b.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [blogs]);

  // Chronologically sorted & filtered blogs (Latest First default)
  const filteredBlogs = useMemo(() => {
    // Sort latest first
    const sorted = [...blogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return sorted.filter(blog => {
      // Category filter
      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      
      // Date filter (Year > Month)
      let matchesDate = true;
      if (selectedYear !== 'All') {
        const blogDate = new Date(blog.date);
        if (!isNaN(blogDate.getTime())) {
          const blogYear = blogDate.getFullYear().toString();
          const blogMonth = blogDate.toLocaleDateString('en-US', { month: 'Long' });
          matchesDate = (blogYear === selectedYear) && (selectedMonth === 'All' || blogMonth === selectedMonth);
        }
      }

      // Search Query filter
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query || 
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        (blog.tags && blog.tags.some(t => t.toLowerCase().includes(query)));

      return matchesCategory && matchesDate && matchesQuery;
    });
  }, [blogs, selectedCategory, selectedYear, selectedMonth, searchQuery]);

  return (
    <section id="blogs" className="py-24 relative">
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Publishing & Intelligence Studio</span>
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Perspectives from the <span className="text-brand-400">Frontier</span>
          </h2>

        </div>

        {/* Search & Category / Date Filter Toolbar */}
        <div className="space-y-4 mb-10 pb-6 border-b border-slate-800/80">
          
          {/* Top Bar: Categories & Search */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Topic:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-brand-500 text-white shadow-glow-brand'
                      : isDark
                        ? 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                        : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input Box */}
            <div className="relative min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, tag, math, code..."
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm transition-all outline-none focus:ring-2 focus:ring-brand-400 ${
                  isDark 
                    ? 'bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500' 
                    : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                }`}
              />
            </div>
          </div>

          {/* Sub Bar: Chronological Year > Month Filter */}
          <div className="flex items-center flex-wrap gap-3 pt-2 text-xs">
            <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Archive Timeline:
            </span>

            {/* Year Selector Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {availableYears.map(yr => (
                <button
                  key={yr}
                  onClick={() => {
                    setSelectedYear(yr);
                    setSelectedMonth('All');
                  }}
                  className={`px-3 py-1 rounded-lg font-mono font-semibold transition-all ${
                    selectedYear === yr
                      ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
                      : isDark ? 'bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 border border-slate-200 text-slate-600'
                  }`}
                >
                  {yr === 'All' ? 'All Years' : yr}
                </button>
              ))}
            </div>

            {/* Month Selector Pills (visible if specific Year selected) */}
            {selectedYear !== 'All' && availableMonths.length > 1 && (
              <div className="flex items-center gap-1.5 flex-wrap pl-2 border-l border-slate-800">
                <span className="text-slate-500 text-[11px]">Month:</span>
                {availableMonths.map(mn => (
                  <button
                    key={mn}
                    onClick={() => setSelectedMonth(mn)}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                      selectedMonth === mn
                        ? 'bg-brand-500/20 border border-brand-500/40 text-brand-400'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mn}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Blog Cards Grid */}
        {filteredBlogs.length === 0 ? (
          <div className={`p-12 text-center rounded-3xl border ${
            isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              No Briefings Match Filters
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              No articles found for selected topic or date criteria. Reset filters or create a new post using the Content Studio.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedYear('All');
                setSelectedMonth('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-500 text-white shadow-glow-brand"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.slug}
                onClick={() => onSelectBlog(blog)}
                className={`group cursor-pointer rounded-3xl border overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col ${
                  isDark 
                    ? 'bg-slate-900/60 border-slate-800/90 hover:border-brand-500/50 shadow-card-dark' 
                    : 'bg-white border-slate-200 hover:border-brand-400 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Cover Image Container */}
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-80" />
                  
                  {/* Category Pill on Image */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-brand-500/90 text-white backdrop-blur-md shadow-sm">
                      {blog.category}
                    </span>
                  </div>

                  {/* Read Time Pill on Image */}
                  <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-black/60 text-slate-200 backdrop-blur-md border border-white/10">
                      <Clock className="w-3 h-3 text-brand-400" />
                      <span>{blog.readTime}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Date & Author */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {blog.formattedDate}
                      </span>
                      <span>•</span>
                      <span className="text-brand-400 font-medium">{blog.author}</span>
                    </div>

                    {/* Title */}
                    <h3 className={`text-xl font-bold tracking-tight mb-3 line-clamp-2 transition-colors group-hover:text-brand-400 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    <p className={`text-xs sm:text-sm leading-relaxed line-clamp-3 mb-6 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {blog.excerpt}
                    </p>
                  </div>

                  {/* Footer: Tags & Read CTA */}
                  <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5 max-w-[70%] overflow-hidden">
                      {(blog.tags || []).slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-brand-400 group-hover:translate-x-1 transition-transform">
                      <span>Read Briefing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
