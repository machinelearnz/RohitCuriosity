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
    dataStream: "Nostro Statements (MT940) & Scheduled Payment Feeds",
    summary: "Time-series view of intraday cash movements comparing opening balances, expected credit/debit flows, and actual net balances throughout the business day.",
    keyMetrics: ["Projected vs Available Balance", "Expected vs Settled Debits", "Hourly Net Inflows/Outflows"],
    icon: BarChart3
  },
  {
    id: "139442000000241779",
    title: "IDL - Cash Movement Dashboard",
    category: "Intraday Monitoring",
    url: "https://analytics.zoho.in/open-view/139442000000241779",
    dataStream: "Multi-Entity Intraday Nostro Balance Feeds",
    summary: "Detailed 30-minute step trajectory tracking intraday base currency balances (USD) across entities (Germany, UK, Luxembourg, Americas) and key nostro accounts.",
    keyMetrics: ["BC_AVA_BAL (Available)", "BC_PRJ_BAL (Projected)", "30-min Step Trajectory"],
    icon: Clock
  },
  {
    id: "139442000000261137",
    title: "IDL - Funding Sources",
    category: "Collateral & Buffers",
    url: "https://analytics.zoho.in/open-view/139442000000261137",
    dataStream: "Central Bank Facilities & Depository Collateral Feeds",
    summary: "Visual breakdown of multi-tiered intraday funding buffers including Cash, Committed Credit Lines, Free Collateral, and Pledged Collateral by depository location.",
    keyMetrics: ["Available Collateral ($2.36B)", "Credit Line Headroom ($1.15B)", "Cash Buffer ($405M)"],
    icon: Coins
  },
  {
    id: "139442000000239233",
    title: "Unmatched Transaction Monitor",
    category: "Reconciliation",
    url: "https://analytics.zoho.in/open-view/139442000000239233",
    dataStream: "RTGS Clearing & Real-Time Settlement Queue Feeds",
    summary: "Real-time surveillance of unmatched debits (UMD) and credits (UMC) against completed settlements to prevent settlement bottlenecks and cutoff breaches.",
    keyMetrics: ["Unmatched Debit Volume ($1.1B+)", "Matched vs Pending Count", "Cutoff Horizon Warnings"],
    icon: CheckCircle2
  },
  {
    id: "139442000000508238",
    title: "Alerts Dashboard",
    category: "Risk & Governance",
    url: "https://analytics.zoho.in/open-view/139442000000508238",
    dataStream: "Nostro Threshold Monitoring & Exception Feeds",
    summary: "Real-time exception logging for Low-Balance breaches (LBAL) and High-Balance surplus traps (HBAL) across nostro accounts and correspondent legal entities.",
    keyMetrics: ["39 Active Incidents", "20 High-Severity Breaches", "Target Balance Threshold Spreads"],
    icon: ShieldAlert
  },
  {
    id: "139442000000256603",
    title: "IDL - Securities Movement Dashboard",
    category: "Securities & Custody",
    url: "https://analytics.zoho.in/open-view/139442000000256603",
    dataStream: "Custodial Securities Ledgers & ISIN Settlement Feeds",
    summary: "Intraday position tracking of security ISINs, settlement statuses, and market values across custodian depositories (EuroClear, BONY, ASX, TSE).",
    keyMetrics: ["ISIN Balance Trajectories", "Trade Buy/Sell Executions", "Depository Custody Balances"],
    icon: Layers
  },
  {
    id: "139442000000267241",
    title: "Pivot View - Cash Movements & Alerts",
    category: "Cross-Entity Matrix",
    url: "https://analytics.zoho.in/open-view/139442000000267241",
    dataStream: "Consolidated Multi-Jurisdiction Nostro Matrix",
    summary: "Multi-dimensional pivot matrix aggregating cash positions, alert severities, and transaction flows grouped by jurisdiction, legal entity, and currency.",
    keyMetrics: ["Cross-Currency Matrix", "Jurisdiction Grouping", "Alert Density by Nostro"],
    icon: FileSpreadsheet
  },
  {
    id: "139442000000258352",
    title: "InterDay Projection / Stress Scenarios",
    category: "Stress Testing",
    url: "https://analytics.zoho.in/open-view/139442000000258352",
    dataStream: "Counterparty Delay Profiles & Forward Liquidity Shocks",
    summary: "Scenario modeling simulating counterparty delay stress, credit line haircut scenarios, and interday forward expectations under liquidity shocks.",
    keyMetrics: ["Simulated Liquidity Deficit", "Counterparty Delay Impact", "Intraday Stress Absorption Buffer"],
    icon: BarChart3
  },
  {
    id: "139442000000255221",
    title: "Pivot View - Securities Movement",
    category: "Cross-Entity Matrix",
    url: "https://analytics.zoho.in/open-view/139442000000255221",
    dataStream: "Custodial Segregation & Depository Allocation Feeds",
    summary: "Custodial pivot view breaking down owned vs client-pledged securities holdings by geography, currency, and settlement timing.",
    keyMetrics: ["Client vs Owned Ownership", "Geographic Custody Split", "ISIN Settlement Values"],
    icon: FileSpreadsheet
  }
];

export default function ZohoIntradayViewer({ isDark }) {
  const [activeDashboardId, setActiveDashboardId] = useState(ZOHO_DASHBOARDS[0].id);

  const selectedDashboard = ZOHO_DASHBOARDS.find(d => d.id === activeDashboardId) || ZOHO_DASHBOARDS[0];

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
              Select any dashboard below to view its functional description, key liquidity dimensions, and open the direct live report in Zoho Analytics.
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

                <div className="mt-3 pt-2 border-t border-slate-800/40 flex items-center justify-end text-[11px]">
                  <span className={`text-[10px] font-medium flex items-center gap-1 ${
                    isSelected ? 'text-brand-400 font-bold' : 'text-slate-500 group-hover:text-slate-300'
                  }`}>
                    <span>{isSelected ? 'Active' : 'Details'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-brand-400 translate-x-0.5' : 'text-slate-600 group-hover:translate-x-0.5'}`} />
                  </span>
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

          <a
            href={selectedDashboard.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-400 hover:to-blue-500 text-white shadow-glow-brand transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            <span>Launch in Zoho Analytics</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Dashboard Metadata Pill Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Operational Data Stream</span>
            <span className="text-slate-200 font-semibold mt-0.5 block">{selectedDashboard.dataStream}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Core Liquidity Concepts</span>
            <span className="text-slate-300 font-medium mt-0.5 block">{selectedDashboard.keyMetrics.join(' • ')}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Compliance Alignment</span>
            <span className="text-emerald-400 font-medium mt-0.5 block">BCBS 248 Intraday Monitoring</span>
          </div>
        </div>

        {/* Direct Link Cloud Access Notice */}
        <div className="mt-2 p-4 rounded-2xl bg-brand-500/5 border border-brand-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive multi-currency dashboard hosted live on Zoho Analytics cloud with full native filtering and table drill-down.</span>
          </div>
          <a
            href={selectedDashboard.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 hover:text-brand-300 font-bold inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>Direct Link ↗</span>
          </a>
        </div>
      </div>

    </div>
  );
}
