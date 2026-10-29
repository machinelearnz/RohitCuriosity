import React, { useState, useEffect, useRef, useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import { 
  Calendar, 
  Filter, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Coins, 
  Sliders, 
  RefreshCw, 
  Zap, 
  FileText,
  Activity,
  Layers
} from 'lucide-react';
import rawIdlData from '../content/data/intraday_liquidity.json';

export default function PlotlyIntradayDashboard({ isDark }) {
  // Configurable Date state for Requirement 3 (Date Flexibility & Maintainability)
  const [selectedDate, setSelectedDate] = useState(rawIdlData.metadata.asOfDate || '2026-04-02');
  const [selectedEntity, setSelectedEntity] = useState('All');
  const [selectedCurrency, setSelectedCurrency] = useState('All');
  const [stressShockPct, setStressShockPct] = useState(0); // 0 to 50% simulated shock

  // Chart DOM container refs
  const balanceChartRef = useRef(null);
  const flowsChartRef = useRef(null);
  const fundingChartRef = useRef(null);
  const alertsChartRef = useRef(null);

  // Formatting helpers
  const formatMillions = (val) => {
    if (Math.abs(val) >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (Math.abs(val) >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
    if (Math.abs(val) >= 1e3) return `$${(val / 1e3).toFixed(0)}K`;
    return `$${val.toFixed(0)}`;
  };

  // 1. Process Time-Series Balance Data based on Filters & Stress Scenario
  const trajectoryData = useMemo(() => {
    return rawIdlData.trajectories.map(point => {
      let avail = point.available;
      let proj = point.projected;

      if (selectedEntity !== 'All' && point.byEntity && point.byEntity[selectedEntity]) {
        avail = point.byEntity[selectedEntity].available;
        proj = point.byEntity[selectedEntity].projected;
      } else if (selectedCurrency !== 'All' && point.byCurrency && point.byCurrency[selectedCurrency]) {
        avail = point.byCurrency[selectedCurrency].available;
        proj = point.byCurrency[selectedCurrency].projected;
      }

      // Apply stress shock to projected curve (simulates unexpected payment acceleration or delay)
      if (stressShockPct > 0) {
        proj = proj - (Math.abs(proj) * (stressShockPct / 100));
      }

      // Dynamically combine with current selectedDate
      const fullTimestamp = `${selectedDate} ${point.time}:00`;

      return {
        time: point.time,
        fullTimestamp,
        available: avail,
        projected: proj
      };
    });
  }, [selectedEntity, selectedCurrency, stressShockPct, selectedDate]);

  // Derived KPI calculations
  const openingBalance = trajectoryData.length > 0 ? trajectoryData[0].available : 0;
  const minProjectedBalance = useMemo(() => {
    return Math.min(...trajectoryData.map(d => d.projected));
  }, [trajectoryData]);
  const minProjectedPoint = useMemo(() => {
    return trajectoryData.find(d => d.projected === minProjectedBalance) || { time: '13:30' };
  }, [trajectoryData, minProjectedBalance]);

  // Common Plotly Dark/Light Theme Layout Tokens
  const themeLayout = useMemo(() => ({
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: {
      family: 'Plus Jakarta Sans, sans-serif',
      color: isDark ? '#94A3B8' : '#475569',
      size: 11
    },
    margin: { t: 35, r: 25, l: 55, b: 40 },
    hoverlabel: {
      bgcolor: isDark ? '#0F172A' : '#FFFFFF',
      bordercolor: isDark ? '#334155' : '#CBD5E1',
      font: { family: 'JetBrains Mono, monospace', size: 12, color: isDark ? '#F8FAFC' : '#0F172A' }
    },
    xaxis: {
      gridcolor: isDark ? '#1E293B' : '#E2E8F0',
      zerolinecolor: isDark ? '#334155' : '#94A3B8',
      tickfont: { family: 'JetBrains Mono, monospace', size: 10 }
    },
    yaxis: {
      gridcolor: isDark ? '#1E293B' : '#E2E8F0',
      zerolinecolor: isDark ? '#475569' : '#64748B',
      tickfont: { family: 'JetBrains Mono, monospace', size: 10 }
    }
  }), [isDark]);

  const PlotlyInstance = useMemo(() => {
    if (typeof window !== 'undefined' && window.Plotly) return window.Plotly;
    if (Plotly && Plotly.newPlot) return Plotly;
    if (Plotly && Plotly.default && Plotly.default.newPlot) return Plotly.default;
    return Plotly;
  }, []);

  // Render Plotly Charts
  useEffect(() => {
    if (!PlotlyInstance || !PlotlyInstance.newPlot) return;
    const plotConfig = { responsive: true, displayModeBar: false };

    // --- CHART 1: Intraday Balance Trajectory (30-min Step) ---
    if (balanceChartRef.current) {
      const times = trajectoryData.map(d => d.time);
      const availVals = trajectoryData.map(d => d.available);
      const projVals = trajectoryData.map(d => d.projected);

      const traces = [
        {
          x: times,
          y: availVals,
          name: 'Available Balance (Settled)',
          type: 'scatter',
          mode: 'lines',
          line: { color: '#06B6D4', width: 2.5 },
          hovertemplate: '<b>%{x}</b><br>Available: $%{y:,.0f}<extra></extra>'
        },
        {
          x: times,
          y: projVals,
          name: 'Projected Balance',
          type: 'scatter',
          mode: 'lines',
          line: { color: '#F59E0B', width: 2.5, dash: 'solid' },
          fill: 'tozeroy',
          fillcolor: isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.15)',
          hovertemplate: '<b>%{x}</b><br>Projected: $%{y:,.0f}<extra></extra>'
        },
        {
          x: times,
          y: times.map(() => 0),
          name: 'Zero Baseline / Overdraft Threshold',
          type: 'scatter',
          mode: 'lines',
          line: { color: '#EF4444', width: 1.5, dash: 'dot' },
          hoverinfo: 'none'
        }
      ];

      const layout = {
        ...themeLayout,
        title: { text: `Intraday Liquidity Trajectory (${selectedDate})`, font: { size: 13, color: isDark ? '#F1F5F9' : '#0F172A', weight: 700 }, x: 0.02 },
        yaxis: { ...themeLayout.yaxis, tickformat: '$.2s' },
        legend: { orientation: 'h', y: 1.15, x: 0.02, font: { size: 11 } }
      };

      PlotlyInstance.newPlot(balanceChartRef.current, traces, layout, plotConfig);
    }

    // --- CHART 2: Hourly Stacked Cash Flows (Matched vs Unmatched) ---
    if (flowsChartRef.current) {
      const hours = rawIdlData.hourlyCashFlows.map(d => d.hour);
      const mc = rawIdlData.hourlyCashFlows.map(d => d.matchedCredits);
      const umc = rawIdlData.hourlyCashFlows.map(d => d.unmatchedCredits);
      const md = rawIdlData.hourlyCashFlows.map(d => d.matchedDebits);
      const umd = rawIdlData.hourlyCashFlows.map(d => d.unmatchedDebits);
      const net = rawIdlData.hourlyCashFlows.map(d => d.netFlow);

      const flowTraces = [
        {
          x: hours,
          y: mc,
          name: 'Matched Credit (+)',
          type: 'bar',
          marker: { color: '#10B981' },
          hovertemplate: 'Hour %{x}<br>Matched Cr: $%{y:,.0f}<extra></extra>'
        },
        {
          x: hours,
          y: umc,
          name: 'Unmatched Credit (+)',
          type: 'bar',
          marker: { color: '#34D399' },
          hovertemplate: 'Hour %{x}<br>Unmatched Cr: $%{y:,.0f}<extra></extra>'
        },
        {
          x: hours,
          y: md,
          name: 'Matched Debit (-)',
          type: 'bar',
          marker: { color: '#EF4444' },
          hovertemplate: 'Hour %{x}<br>Matched Dr: $%{y:,.0f}<extra></extra>'
        },
        {
          x: hours,
          y: umd,
          name: 'Unmatched Debit (-)',
          type: 'bar',
          marker: { color: '#F87171' },
          hovertemplate: 'Hour %{x}<br>Unmatched Dr: $%{y:,.0f}<extra></extra>'
        },
        {
          x: hours,
          y: net,
          name: 'Net Flow',
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#38BDF8', width: 2 },
          marker: { size: 5 },
          hovertemplate: 'Net Flow: $%{y:,.0f}<extra></extra>'
        }
      ];

      const flowLayout = {
        ...themeLayout,
        barmode: 'relative',
        title: { text: `Hourly Cash Movements (Credits vs Debits)`, font: { size: 13, color: isDark ? '#F1F5F9' : '#0F172A', weight: 700 }, x: 0.02 },
        yaxis: { ...themeLayout.yaxis, tickformat: '$.2s' },
        legend: { orientation: 'h', y: 1.15, x: 0.02, font: { size: 10 } }
      };

      PlotlyInstance.newPlot(flowsChartRef.current, flowTraces, flowLayout, plotConfig);
    }

    // --- CHART 3: Funding Sources & Headroom Waterfall ---
    if (fundingChartRef.current) {
      const types = ['Cash Buffer', 'Credit Lines', 'Avail. Collateral', 'Pledged Collateral'];
      const values = [
        rawIdlData.summaryKPIs.cashBuffer,
        rawIdlData.summaryKPIs.creditLineHeadroom,
        rawIdlData.summaryKPIs.availableCollateral,
        rawIdlData.summaryKPIs.pledgedCollateral
      ];

      const fundingTrace = [{
        x: types,
        y: values,
        type: 'bar',
        marker: {
          color: ['#10B981', '#3B82F6', '#8B5CF6', '#64748B']
        },
        hovertemplate: '<b>%{x}</b><br>Total Buffer: $%{y:,.0f}<extra></extra>'
      }];

      const fundingLayout = {
        ...themeLayout,
        title: { text: 'Intraday Liquidity Buffers ($3.92B Total)', font: { size: 13, color: isDark ? '#F1F5F9' : '#0F172A', weight: 700 }, x: 0.02 },
        yaxis: { ...themeLayout.yaxis, tickformat: '$.2s' }
      };

      PlotlyInstance.newPlot(fundingChartRef.current, fundingTrace, fundingLayout, plotConfig);
    }

    // --- CHART 4: Alerts & Anomaly Monitor Timeline ---
    if (alertsChartRef.current) {
      const highAlerts = rawIdlData.alerts.filter(a => a.severity.toLowerCase() === 'high');
      const lowAlerts = rawIdlData.alerts.filter(a => a.severity.toLowerCase() !== 'high');

      const alertTraces = [
        {
          x: highAlerts.map(a => a.time),
          y: highAlerts.map(a => a.entity.replace('Global Bank ', '')),
          name: 'High Severity (LBAL Breach)',
          mode: 'markers',
          type: 'scatter',
          marker: { color: '#EF4444', size: 10, symbol: 'diamond' },
          text: highAlerts.map(a => `${a.type} | Acct: ${a.account} (${a.currency})<br>${a.correspondent}`),
          hovertemplate: '<b>%{x} - %{y}</b><br>%{text}<extra></extra>'
        },
        {
          x: lowAlerts.map(a => a.time),
          y: lowAlerts.map(a => a.entity.replace('Global Bank ', '')),
          name: 'Low Severity (HBAL Buffer)',
          mode: 'markers',
          type: 'scatter',
          marker: { color: '#F59E0B', size: 8, symbol: 'circle' },
          text: lowAlerts.map(a => `${a.type} | Acct: ${a.account} (${a.currency})<br>${a.correspondent}`),
          hovertemplate: '<b>%{x} - %{y}</b><br>%{text}<extra></extra>'
        }
      ];

      const alertLayout = {
        ...themeLayout,
        title: { text: 'Intraday Risk Alerts Timeline', font: { size: 13, color: isDark ? '#F1F5F9' : '#0F172A', weight: 700 }, x: 0.02 },
        xaxis: { ...themeLayout.xaxis, title: 'Execution Time' },
        legend: { orientation: 'h', y: 1.15, x: 0.02, font: { size: 10 } }
      };

      PlotlyInstance.newPlot(alertsChartRef.current, alertTraces, alertLayout, plotConfig);
    }

    const handleResize = () => {
      if (balanceChartRef.current) PlotlyInstance.Plots.resize(balanceChartRef.current);
      if (flowsChartRef.current) PlotlyInstance.Plots.resize(flowsChartRef.current);
      if (fundingChartRef.current) PlotlyInstance.Plots.resize(fundingChartRef.current);
      if (alertsChartRef.current) PlotlyInstance.Plots.resize(alertsChartRef.current);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [trajectoryData, themeLayout, selectedDate, isDark]);

  return (
    <div className="space-y-8 my-6">

      {/* Top Cockpit Header & Date/Filter Controls */}
      <div className={`p-6 rounded-3xl border shadow-xl ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-400 border border-brand-500/25">
                <Activity className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
                <span>Plotly.js Reactive Engine</span>
              </span>
              <span className="text-xs font-mono text-slate-500">BCBS 248 Compliant</span>
            </div>
            <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Intraday Liquidity Cockpit & Trajectory
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Real-time multi-entity cash trajectory, hourly settlement throughput, and funding headroom analytics.
            </p>
          </div>

          {/* Interactive Date Picker & Controls (Requirement 3: Date Maintainability) */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-950/60 text-xs">
              <Calendar className="w-4 h-4 text-brand-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-mono">As-Of Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-xs font-mono font-bold text-slate-200 focus:outline-none"
                  title="Update As-Of Date (Analytics adjust automatically)"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedDate(rawIdlData.metadata.asOfDate);
                setSelectedEntity('All');
                setSelectedCurrency('All');
                setStressShockPct(0);
              }}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-all"
              title="Reset Filters to Default"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar & Stress Slider */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          
          {/* Entity Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-brand-400" />
              <span>Banking Entity:</span>
            </label>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-200 focus:border-brand-500 focus:outline-none"
            >
              {rawIdlData.metadata.entities.map(ent => (
                <option key={ent} value={ent}>{ent}</option>
              ))}
            </select>
          </div>

          {/* Currency Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Currency Denomination:</span>
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-200 focus:border-brand-500 focus:outline-none"
            >
              {rawIdlData.metadata.currencies.map(curr => (
                <option key={curr} value={curr}>{curr === 'All' ? 'All Currencies (USD Base)' : curr}</option>
              ))}
            </select>
          </div>

          {/* Stress Scenario Outflow Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-rose-400" />
                <span>Simulate Outflow Shock:</span>
              </span>
              <span className="font-mono text-rose-400 font-bold">+{stressShockPct}% Outflow</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={stressShockPct}
              onChange={(e) => setStressShockPct(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 mt-2"
            />
          </div>

        </div>
      </div>

      {/* KPI Headline Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">BoD Opening Balance</span>
          <span className="text-xl font-black text-cyan-400 font-mono mt-1 block">{formatMillions(openingBalance)}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">00:00 GMT Baseline</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Peak Usage / Low Point</span>
          <span className={`text-xl font-black font-mono mt-1 block ${minProjectedBalance < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
            {formatMillions(minProjectedBalance)}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Reached @ {minProjectedPoint.time}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Liquidity Buffer</span>
          <span className="text-xl font-black text-purple-400 font-mono mt-1 block">
            {formatMillions(rawIdlData.summaryKPIs.totalAvailableBuffer)}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Cash + Lines + Collateral</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Settlement Throughput</span>
          <span className="text-xl font-black text-emerald-400 font-mono mt-1 block">
            {rawIdlData.summaryKPIs.matchedRate}%
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Matched / Settled Txns</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md col-span-2 lg:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Alerts</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl font-black text-rose-400 font-mono">
              {rawIdlData.summaryKPIs.highAlertCount}
            </span>
            <span className="text-xs text-rose-400 font-semibold">High (LBAL)</span>
            <span className="text-xs text-slate-500 font-mono">/ 39 Total</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Low Balance Breaches</span>
        </div>
      </div>

      {/* Main Plotly Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Intraday Trajectory */}
        <div className={`p-4 sm:p-5 rounded-3xl border shadow-xl ${
          isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div ref={balanceChartRef} className="w-full h-[360px]" />
          <div className="px-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Notice: Balance contracts sharply between 11:30 and 13:30</span>
            <span className="font-mono text-amber-400">BCBS 248 Metric 1</span>
          </div>
        </div>

        {/* Chart 2: Hourly Stacked Inflows vs Outflows */}
        <div className={`p-4 sm:p-5 rounded-3xl border shadow-xl ${
          isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div ref={flowsChartRef} className="w-full h-[360px]" />
          <div className="px-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Stacked Matched vs Unmatched Volume by Cutoff Window</span>
            <span className="font-mono text-emerald-400">Throughput Velocity</span>
          </div>
        </div>

        {/* Chart 3: Funding Buffers Waterfall */}
        <div className={`p-4 sm:p-5 rounded-3xl border shadow-xl ${
          isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div ref={fundingChartRef} className="w-full h-[320px]" />
          <div className="px-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Multi-Tier Intraday Headroom (Cash + Credit Line + Collateral)</span>
            <span className="font-mono text-purple-400">Intellect IDL Model</span>
          </div>
        </div>

        {/* Chart 4: Alerts Timeline */}
        <div className={`p-4 sm:p-5 rounded-3xl border shadow-xl ${
          isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div ref={alertsChartRef} className="w-full h-[320px]" />
          <div className="px-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Exception Logging: 20 LBAL (Low Balance) Breaches</span>
            <span className="font-mono text-rose-400">Risk Surveillance</span>
          </div>
        </div>

      </div>

      {/* Top Settlement Counterparties Row */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-brand-400" />
          <span>Top Intraday Settlement Flow Drivers & Counterparties:</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {rawIdlData.topCounterparties.map((cp, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/70">
              <span className="text-[11px] font-bold text-slate-200 truncate block">{cp.name}</span>
              <span className="text-xs font-mono font-black text-brand-300 mt-0.5 block">{formatMillions(cp.volume)}</span>
              <span className="text-[10px] text-slate-500 block">Gross In/Out Flow</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
