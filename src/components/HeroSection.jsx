import React from 'react';
import { 
  ArrowRight, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  Terminal, 
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { LinkedinIcon, TwitterIcon, GithubIcon } from './SocialIcons';

export default function HeroSection({ isDark, onOpenStudio, blogCount, portfolioCount, sections = { about: true, blogs: true, portfolio: true, contact: true } }) {
  const metrics = [
    { label: 'Market Briefings', value: `${blogCount}+`, sub: 'Live Analysis', icon: TrendingUp },
    { label: 'Venture Showcases', value: `${portfolioCount}+`, sub: 'Case Studies', icon: Cpu },
    { label: 'Monitored Assets', value: '$420M+', sub: 'AUM Signal Flow', icon: ShieldCheck },
    { label: 'CMS Architecture', value: '100%', sub: 'Local Markdown', icon: Terminal },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Ambient Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-600/15 via-indigo-600/10 to-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-brand-500/10 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Top Floating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 border border-brand-500/25 text-brand-400 mb-8 shadow-sm backdrop-blur-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Rohit Curiosity • Sovereign AI • Venture Architecture</span>
          </div>

          {/* Main Headline */}
          <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Navigating Market Shifts & <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-blue-500 to-amber-400">
              Autonomous Frontiers
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-lg sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed mb-10 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Personal thinking portal, high-conviction market research, and boutique venture engineering at <span className="font-semibold text-brand-400">rohitcuriosity.com</span>. Powered by a 100% zero-code Markdown CMS.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            {sections.blogs && (
              <a
                href="#blogs"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-400 hover:to-blue-500 text-white shadow-glow-brand transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>Explore Views & Blogs</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            )}

            {sections.portfolio && (
              <a
                href="#portfolio"
                className={`flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold border transition-all duration-200 ${
                  isDark 
                    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:border-slate-600' 
                    : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 shadow-sm'
                }`}
              >
                <span>View Portfolio</span>
              </a>
            )}

            {sections.contact && (
              <a
                href="#contact"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition-all duration-200"
              >
                <span>Connect</span>
              </a>
            )}
          </div>

          {/* Social Profiles Pill Bar */}
          <div className="flex items-center justify-center gap-3 mb-16">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Connect:</span>
            {[
              { name: 'LinkedIn', icon: LinkedinIcon, href: 'https://linkedin.com' },
              { name: 'X / Twitter', icon: TwitterIcon, href: 'https://twitter.com' },
              { name: 'GitHub', icon: GithubIcon, href: 'https://github.com' },
            ].map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl border transition-all duration-200 ${
                    isDark 
                      ? 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800' 
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-white'
                  }`}
                  aria-label={social.name}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

        </div>

        {/* Live Metrics Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {metrics.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                  isDark 
                    ? 'bg-slate-900/60 border-slate-800/80 shadow-card-dark' 
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.sub}</span>
                  <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className={`text-3xl font-extrabold tracking-tight mb-1 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {item.value}
                </div>
                <div className="text-xs font-medium text-slate-400">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-12">
          <a
            href="#about"
            className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>Discover More</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>

      </div>
    </section>
  );
}
