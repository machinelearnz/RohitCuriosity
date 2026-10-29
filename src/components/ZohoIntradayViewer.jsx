import React, { useState } from 'react';
import { 
  ExternalLink, 
  Layers, 
  BarChart3, 
  ShieldAlert, 
  Coins, 
  Clock, 
  FileSpreadsheet, 
  Maximize2, 
  CheckCircle2,
  Info,
  ChevronRight
} from 'lucide-react';

const ZOHO_DASHBOARDS = [
  {
    id: "139442000000241658",
    title: "Cash Movement & Expectations",
    category: "Cash & Liquidity",
    url: "https://analytics.zoho.in/open-view/139442000000241658",
    sourceFile: "MUL-BAL short.xlsx & MUL-TXN short.xlsx",
    summary: "Time-series view of intraday cash movements comparing opening balances, expected credit/debit flows, and actual net balances throughout the business day.",
    keyMetrics: ["Projected vs Available Balance", "Expected vs Settled Debits", "Hourly Net Inflows/Outflows"],
    icon: BarChart3
  },
  {
    id: "139442000000241779",
    title: "IDL - Cash Movement Dashboard",
    category: "Intraday Monitoring",
    url: "https://analytics.zoho.in/open-view/139442000000241779",
    sourceFile: "MUL-BAL short.xlsx",
    summary: "Detailed 30-minute step trajectory tracking intraday base currency balances (USD) across entities (Germany, UK, Luxembourg, Americas) and key nostro accounts.",
    keyMetrics: ["BC_AVA_BAL (Available)", "BC_PRJ_BAL (Projected)", "30-min Step Trajectory"],
    icon: Clock
  },
  {
    id: "139442000000261137",
    title: "IDL - Funding Sources",
    category: "Collateral & Buffers",
    url: "https://analytics.zoho.in/open-view/139442000000261137",
    sourceFile: "MUL-IDL-FUN-SRC-SUMM.xlsx",
    summary: "Visual breakdown of multi-tiered intraday funding buffers including Cash, Committed Credit Lines, Free Collateral, and Pledged Collateral by depository location.",
    keyMetrics: ["Available Collateral ($2.36B)", "Credit Line Headroom ($1.15B)", "Cash Buffer ($405M)"],
    icon: Coins
  },
  {
    id: "139442000000239233",
    title: "Unmatched Transaction Monitor",
    category: "Reconciliation",
    url: "https://analytics.zoho.in/open-view/139442000000239233",
    sourceFile: "MUL-TXN short.xlsx",
    summary: "Real-time surveillance of unmatched debits (UMD) and credits (UMC) against completed settlements to prevent settlement bottlenecks and cutoff breaches.",
    keyMetrics: ["Unmatched Debit Volume ($1.1B+)", "Matched vs Pending Count", "Cutoff Horizon Warnings"],
    icon: CheckCircle2
  },
  {
    id: "139442000000508238",
    title: "Alerts Dashboard",
    category: "Risk & Governance",
    url: "https://analytics.zoho.in/open-view/139442000000508238",
    sourceFile: "ALERTS.xlsx",
    summary: "Real-time exception logging for Low-Balance breaches (LBAL) and High-Balance surplus traps (HBAL) across nostro accounts and correspondent legal entities.",
    keyMetrics: ["39 Active Incidents", "20 High-Severity Breaches", "Target Balance Threshold Spreads"],
    icon: ShieldAlert
  },
  {
    id: "139442000000256603",
    title: "IDL - Securities Movement Dashboard",
    category: "Securities & Custody",
    url: "https://analytics.zoho.in/open-view/139442000000256603",
    sourceFile: "MUL-SEC-BAL short.xlsx & MUL-SEC-TXN.xlsx",
    summary: "Intraday position tracking of security ISINs, settlement statuses, and market values across custodian depositories (EuroClear, BONY, ASX, TSE).",
    keyMetrics: ["ISIN Balance Trajectories", "Trade Buy/Sell Executions", "Depository Custody Balances"],
    icon: Layers
  },
  {
    id: "139442000000267241",
    title: "Pivot View - Cash Movements & Alerts",
    category: "Cross-Entity Matrix",
    url: "https://analytics.zoho.in/open-view/139442000000267241",
    sourceFile: "MUL-BAL short.xlsx & ALERTS.xlsx",
    summary: "Multi-dimensional pivot matrix aggregating cash positions, alert severities, and transaction flows grouped by jurisdiction, legal entity, and currency.",
    keyMetrics: ["Cross-Currency Matrix", "Jurisdiction Grouping", "Alert Density by Nostro"],
    icon: FileSpreadsheet
  },
  {
    id: "139442000000258352",
    title: "InterDay Projection / Stress Scenarios",
    category: "Stress Testing",
    url: "https://analytics.zoho.in/open-view/139442000000258352",
    sourceFile: "CASH-MGMT-DRCR1 short.xlsx & MUL-BAL short.xlsx",
    summary: "Scenario modeling simulating counterparty delay stress, credit line haircut scenarios, and interday forward expectations under liquidity shocks.",
    keyMetrics: ["Simulated Liquidity Deficit", "Counterparty Delay Impact", "Intraday Stress Absorption Buffer"],
    icon: BarChart3
  },
  {
    id: "139442000000255221",
    title: "Pivot View - Securities Movement",
    category: "Cross-Entity Matrix",
    url: "https://analytics.zoho.in/open-view/139442000000255221",
    sourceFile: "MUL-SEC-BAL short.xlsx",
    summary: "Custodial pivot view breaking down owned vs client-pledged securities holdings by geography, currency, and settlement timing.",
    keyMetrics: ["Client vs Owned Ownership", "Geographic Custody Split", "ISIN Settlement Values"],
    icon: FileSpreadsheet
  }
];

export default function ZohoIntradayViewer({ isDark }) {
  const [activeDashboardId, setActiveDashboardId] = useState(ZOHO_DASHBOARDS[0].id);
  const [embedMode, setEmbedMode] = useState(true);

  const selectedDashboard = ZOHO_DASHBOARDS.find(d => d.id === activeDashboardId) || ZOHO_DASHBOARDS[0];
  const embedUrl = `${selectedDashboard.url}?STANDALONE=true&INCLUDETITLE=false&INCLUDEDESC=false`;

  return (
    <div className="space-y-8 my-6">
      
      {/* Top Banner Alert */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Zoho Analytics Production Dashboards (9 Interactive Views)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any dashboard below to view its functional description, underlying Excel dataset, and explore the embedded live report.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={selectedDashboard.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-400 hover:to-blue-500 text-white shadow-glow-brand transition-all"
          >
            <span>Open in Zoho Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 9-Dashboard Grid Selector */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-brand-400" />
          <span>Select Dashboard View:</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ZOHO_DASHBOARDS.map((dash, idx) => {
            const isSelected = dash.id === activeDashboardId;
            const Icon = dash.icon;
            return (
              <button
                key={dash.id}
                onClick={() => setActiveDashboardId(dash.id)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 group ${
                  isSelected
                    ? 'bg-brand-500/15 border-brand-500/60 shadow-glow-brand ring-1 ring-brand-500/30'
                    : isDark
                      ? 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-slate-800/80 text-brand-300 border border-slate-700/50">
                      {dash.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                  </div>

                  <h5 className={`text-xs font-bold line-clamp-1 group-hover:text-brand-400 transition-colors ${
                    isSelected ? 'text-brand-300' : isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {dash.title}
                  </h5>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {dash.summary}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono text-slate-500 truncate max-w-[170px]">{dash.sourceFile}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-brand-400 translate-x-0.5' : 'text-slate-600'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Dashboard Detail Card */}
      <div className={`p-6 rounded-3xl border ${
        isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                Active View
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {selectedDashboard.id}</span>
            </div>
            <h3 className={`text-lg sm:text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {selectedDashboard.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {selectedDashboard.summary}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEmbedMode(!embedMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                embedMode
                  ? 'bg-brand-500/20 border-brand-500/50 text-brand-300'
                  : 'border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{embedMode ? 'Hide Embedded Frame' : 'Show Embedded Frame'}</span>
            </button>

            <a
              href={selectedDashboard.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-400 text-white shadow-glow-brand"
            >
              <span>Direct Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Dashboard Metadata Pill Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Underlying Data Source</span>
            <span className="font-mono text-brand-300 font-semibold mt-0.5 block">{selectedDashboard.sourceFile}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Core Liquidity Concepts</span>
            <span className="text-slate-300 font-medium mt-0.5 block">{selectedDashboard.keyMetrics.join(' • ')}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Compliance Alignment</span>
            <span className="text-emerald-400 font-medium mt-0.5 block">BCBS 248 Intraday Monitoring</span>
          </div>
        </div>

        {/* Live Iframe Embed Viewport */}
        {embedMode && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-slate-800 bg-white shadow-2xl relative">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="truncate max-w-sm sm:max-w-md">{embedUrl}</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Zoho Embed
              </span>
            </div>
            
            <iframe
              key={selectedDashboard.id}
              src={embedUrl}
              title={selectedDashboard.title}
              width="100%"
              height="650"
              frameBorder="0"
              loading="lazy"
              className="w-full min-h-[600px] border-0"
              allowFullScreen
            />
          </div>
        )}
      </div>

    </div>
  );
}
