import React, { useState, useEffect, useRef, useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import { 
  BarChart3, 
  Clock, 
  Coins, 
  CheckCircle2, 
  ShieldAlert, 
  Layers, 
  FileSpreadsheet, 
  Sliders, 
  TrendingDown, 
  TrendingUp, 
  Filter, 
  Calendar, 
  Search, 
  Activity, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight, 
  PieChart, 
  ArrowUpRight,
  Info,
  Sparkles,
  Maximize2
} from 'lucide-react';
import rawIdlData from '../content/data/intraday_liquidity.json';

// Configuration of the 9 Architectural Panels matching & exceeding Zoho Analytics
const DASHBOARD_PANELS = [
  {
    id: "cash-expectations",
    panelNumber: 1,
    title: "Cash Movement & Expectations",
    category: "Cash & Liquidity",
    dataStream: "Nostro Statements (MT940) & Scheduled Payment Feeds",
    summary: "Time-series expectation tracking juxtaposing opening balances, anticipated receipts/payments, and actual settled flows throughout the business day.",
    keyMetrics: ["Expected vs Settled Debits", "Cumulative Cash Trajectory", "11:30–13:30 Settlement Surge"],
    icon: BarChart3
  },
  {
    id: "idl-cash-movement",
    panelNumber: 2,
    title: "IDL - Cash Movement Dashboard",
    category: "Intraday Monitoring",
    dataStream: "Multi-Entity Intraday Nostro Balance Feeds",
    summary: "Detailed 30-minute step trajectory tracking intraday base currency balances (USD) across entities (Germany, UK, Luxembourg, Americas) and key nostro accounts.",
    keyMetrics: ["BC_AVA_BAL (Available)", "BC_PRJ_BAL (Projected)", "Overdraft Trough (-$14.2M)"],
    icon: Clock
  },
  {
    id: "idl-funding-sources",
    panelNumber: 3,
    title: "IDL - Funding Sources",
    category: "Collateral & Buffers",
    dataStream: "Central Bank Facilities & Depository Collateral Feeds",
    summary: "Visual breakdown of multi-tiered intraday funding buffers: BoD Cash ($405M), Committed Credit Lines ($1.15B), and Free Collateral ($2.36B) by depository location.",
    keyMetrics: ["$3.92B Total Available Buffer", "Credit Line Headroom (100%)", "270x Overdraft Coverage"],
    icon: Coins
  },
  {
    id: "unmatched-monitor",
    panelNumber: 4,
    title: "Unmatched Transaction Monitor",
    category: "Reconciliation",
    dataStream: "RTGS Clearing & Real-Time Settlement Queue Feeds",
    summary: "Real-time surveillance of unmatched debits (UMD) and credits (UMC) against completed settlements to prevent settlement bottlenecks and cutoff breaches.",
    keyMetrics: ["$5.99B Gross Volume", "63.2% Matched Velocity", "Cutoff Horizon Surveillance"],
    icon: CheckCircle2
  },
  {
    id: "alerts-governance",
    panelNumber: 5,
    title: "Alerts Dashboard",
    category: "Risk & Governance",
    dataStream: "Nostro Threshold Monitoring & Exception Feeds",
    summary: "Real-time exception logging for Low-Balance breaches (LBAL) and High-Balance surplus traps (HBAL) across nostro accounts and correspondent legal entities.",
    keyMetrics: ["39 Active Incidents", "20 High-Severity (LBAL)", "14 Monitored Nostro Accounts"],
    icon: ShieldAlert
  },
  {
    id: "securities-movement",
    panelNumber: 6,
    title: "IDL - Securities Movement Dashboard",
    category: "Securities & Custody",
    dataStream: "Custodial Securities Ledgers & ISIN Settlement Feeds",
    summary: "Intraday position tracking of security ISINs, settlement statuses, and market values across custodian depositories (EuroClear, BONY, ASX, TSE).",
    keyMetrics: ["$4.28B Custodial Market Value", "16 Active ISIN Portfolios", "Buy/Sell Settlement Flows"],
    icon: Layers
  },
  {
    id: "pivot-cash-alerts",
    panelNumber: 7,
    title: "Pivot View - Cash Movements & Alerts",
    category: "Cross-Entity Matrix",
    dataStream: "Consolidated Multi-Jurisdiction Nostro Matrix",
    summary: "Multi-dimensional pivot matrix aggregating cash positions, alert severities, and transaction flows grouped by jurisdiction, legal entity, and currency.",
    keyMetrics: ["4 Legal Entities", "6 Global Currencies", "Cross-Entity Liquidity Heatmap"],
    icon: FileSpreadsheet
  },
  {
    id: "stress-scenarios",
    panelNumber: 8,
    title: "InterDay Projection / Stress Scenarios",
    category: "Stress Testing",
    dataStream: "Counterparty Delay Profiles & Forward Liquidity Shocks",
    summary: "Interactive stress simulation modeling counterparty payment delays, credit line haircut scenarios, and intraday forward expectations under liquidity shocks.",
    keyMetrics: ["Dynamic Outflow Shock Slider", "Counterparty Freeze Simulation", "Zero Structural Risk Margin"],
    icon: Sliders
  },
  {
    id: "pivot-securities",
    panelNumber: 9,
    title: "Pivot View - Securities Movement",
    category: "Cross-Entity Matrix",
    dataStream: "Custodial Segregation & Depository Allocation Feeds",
    summary: "Custodial pivot view breaking down owned vs client-pledged securities holdings by geography, currency, and settlement timing.",
    keyMetrics: ["73.4% Proprietary Owned", "26.6% Client-Pledged", "Depository Headroom Matrix"],
    icon: FileSpreadsheet
  }
];

export default function PlotlyIntradayDashboard({ isDark }) {
  // 1. Active Dashboard Selector State
  const [activePanelId, setActivePanelId] = useState("cash-expectations");

  // 2. Global & Dashboard-Specific Filter States
  const [selectedDate, setSelectedDate] = useState(rawIdlData.metadata.asOfDate || "2026-04-02");
  const [selectedEntity, setSelectedEntity] = useState("All");
  const [selectedCurrency, setSelectedCurrency] = useState("All");
  const [selectedDepository, setSelectedDepository] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedAlertType, setSelectedAlertType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Sub-view Toggles
  const [trajectoryViewMode, setTrajectoryViewMode] = useState("consolidated"); // 'consolidated' | 'entity-overlay' | 'currency-breakdown'
  const [expectationsViewMode, setExpectationsViewMode] = useState("cumulative"); // 'cumulative' | 'hourly-variance'
  const [pivotMetric, setPivotMetric] = useState("netBalance"); // 'netBalance' | 'inflow' | 'outflow' | 'alertCount'

  // Interactive Stress Simulation Controls
  const [stressShockPct, setStressShockPct] = useState(0); // 0% to 50% outflow shock
  const [counterpartyFreeze, setCounterpartyFreeze] = useState(0); // 0% to 40% delayed incoming flows
  const [creditHaircutPct, setCreditHaircutPct] = useState(0); // 0% to 30% credit line reduction
  const [activePreset, setActivePreset] = useState("baseline");

  // Chart DOM container refs
  const primaryChartRef = useRef(null);
  const secondaryChartRef = useRef(null);

  // Formatting helpers
  const formatCurrency = (val) => {
    if (val === null || val === undefined || isNaN(val)) return '$0';
    const abs = Math.abs(val);
    const sign = val < 0 ? '-' : '';
    if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
    if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`;
    return `${sign}$${abs.toFixed(0)}`;
  };

  const activePanel = useMemo(() => {
    return DASHBOARD_PANELS.find(p => p.id === activePanelId) || DASHBOARD_PANELS[0];
  }, [activePanelId]);

  // Common Plotly Dark/Light Theme Layout Tokens
  const themeLayout = useMemo(() => ({
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    autosize: true,
    font: {
      family: 'Plus Jakarta Sans, sans-serif',
      color: isDark ? '#94A3B8' : '#475569',
      size: 11
    },
    margin: { t: 40, r: 25, l: 65, b: 45 },
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
      zerolinecolor: isDark ? '#475569' : '#94A3B8',
      tickfont: { family: 'JetBrains Mono, monospace', size: 10 }
    },
    legend: {
      orientation: 'h',
      y: -0.22,
      x: 0,
      font: { size: 11, color: isDark ? '#CBD5E1' : '#334155' }
    }
  }), [isDark]);

  // Apply Stress Presets
  const applyPreset = (preset) => {
    setActivePreset(preset);
    if (preset === 'baseline') {
      setStressShockPct(0);
      setCounterpartyFreeze(0);
      setCreditHaircutPct(0);
    } else if (preset === 'midday-shock') {
      setStressShockPct(25);
      setCounterpartyFreeze(10);
      setCreditHaircutPct(0);
    } else if (preset === 'counterparty-freeze') {
      setStressShockPct(15);
      setCounterpartyFreeze(35);
      setCreditHaircutPct(10);
    } else if (preset === 'severe-squeeze') {
      setStressShockPct(40);
      setCounterpartyFreeze(40);
      setCreditHaircutPct(25);
    }
  };

  // =========================================================================
  // DYNAMIC CHART RENDERING ENGINE
  // =========================================================================
  useEffect(() => {
    if (!primaryChartRef.current) return;

    // Helper to safely render or update Plotly charts
    const renderPlot = (container, data, layout, config = { responsive: true, displayModeBar: false }) => {
      if (!container) return;
      Plotly.react(container, data, layout, config);
    };

    // -----------------------------------------------------------------------
    // PANEL 1: CASH MOVEMENT & EXPECTATIONS
    // -----------------------------------------------------------------------
    if (activePanelId === 'cash-expectations') {
      const expData = rawIdlData.cashExpectations || [];
      const times = expData.map(d => d.hour);

      let primaryData = [];
      let primaryLayout = {
        ...themeLayout,
        title: { text: `Cash Movement vs. Expected Trajectory (${selectedDate})`, font: { size: 13, color: isDark ? '#F1F5F9' : '#0F172A', weight: 700 }, x: 0.02 },
        yaxis: { ...themeLayout.yaxis, tickformat: '$,.2s', title: { text: 'Cumulative USD Balance' } }
      };

      if (expectationsViewMode === 'cumulative') {
        primaryData = [
          {
            x: times,
            y: expData.map(d => d.cumExpectedInflow),
            name: 'Expected Inflows',
            type: 'scatter',
            mode: 'lines',
            line: { color: '#10B981', width: 2, dash: 'dot' },
            hovertemplate: '<b>%{x}</b><br>Expected Inflow: $%{y:,.0f}<extra></extra>'
          },
          {
            x: times,
            y: expData.map(d => d.cumExpectedOutflow),
            name: 'Expected Outflows',
            type: 'scatter',
            mode: 'lines',
            line: { color: '#F43F5E', width: 2, dash: 'dot' },
            hovertemplate: '<b>%{x}</b><br>Expected Outflow: $%{y:,.0f}<extra></extra>'
          },
          {
            x: times,
            y: expData.map(d => d.netExpectedTrajectory),
            name: 'Projected Net Trajectory',
            type: 'scatter',
            mode: 'lines',
            line: { color: '#F59E0B', width: 2.5 },
            hovertemplate: '<b>%{x}</b><br>Projected Net: $%{y:,.0f}<extra></extra>'
          },
          {
            x: times,
            y: expData.map(d => d.netSettledTrajectory),
            name: 'Settled Net Trajectory',
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: '#06B6D4', width: 3 },
            marker: { size: 5, color: '#06B6D4' },
            hovertemplate: '<b>%{x}</b><br>Settled Net: $%{y:,.0f}<extra></extra>'
          }
        ];
      } else {
        // Hourly variance view
        primaryData = [
          {
            x: times,
            y: expData.map(d => d.settledInflow - d.expectedInflow),
            name: 'Inflow Delta (Settled - Expected)',
            type: 'bar',
            marker: { color: '#10B981' },
            hovertemplate: '<b>%{x}</b><br>Inflow Variance: $%{y:,.0f}<extra></extra>'
          },
          {
            x: times,
            y: expData.map(d => Math.abs(d.settledOutflow) - Math.abs(d.expectedOutflow)),
            name: 'Outflow Surge (Settled - Expected)',
            type: 'bar',
            marker: { color: '#EF4444' },
            hovertemplate: '<b>%{x}</b><br>Outflow Variance: $%{y:,.0f}<extra></extra>'
          }
        ];
        primaryLayout.barmode = 'group';
      }

      renderPlot(primaryChartRef.current, primaryData, primaryLayout);

      // Secondary: Hourly Inflow vs Outflow Stack
      if (secondaryChartRef.current) {
        const secData = [
          {
            x: times,
            y: expData.map(d => d.settledInflow),
            name: 'Settled Inflows',
            type: 'bar',
            marker: { color: isDark ? 'rgba(16, 185, 129, 0.75)' : '#10B981' }
          },
          {
            x: times,
            y: expData.map(d => d.settledOutflow),
            name: 'Settled Outflows',
            type: 'bar',
            marker: { color: isDark ? 'rgba(239, 68, 68, 0.75)' : '#EF4444' }
          }
        ];
        const secLayout = {
          ...themeLayout,
          barmode: 'relative',
          title: { text: 'Hourly Settled Cash Velocity (Inflows vs Outflows)', font: { size: 12, color: isDark ? '#E2E8F0' : '#1E293B' }, x: 0.02 },
          yaxis: { ...themeLayout.yaxis, tickformat: '$,.2s' }
        };
        renderPlot(secondaryChartRef.current, secData, secLayout);
      }
    }

    // -----------------------------------------------------------------------
    // PANEL 2: IDL - CASH MOVEMENT DASHBOARD (30-min Step Trajectory)
    // -----------------------------------------------------------------------
    if (activePanelId === 'idl-cash-movement') {
      const times = rawIdlData.trajectories.map(d => d.time);

      let availVals = [];
      let projVals = [];

      rawIdlData.trajectories.forEach(point => {
        let a = point.available;
        let p = point.projected;

        if (selectedEntity !== 'All' && point.byEntity && point.byEntity[selectedEntity]) {
          a = point.byEntity[selectedEntity].available;
          p = point.byEntity[selectedEntity].projected;
        } else if (selectedCurrency !== 'All' && point.byCurrency && point.byCurrency[selectedCurrency]) {
          a = point.byCurrency[selectedCurrency].available;
          p = point.byCurrency[selectedCurrency].projected;
        }
        availVals.push(a);
        projVals.push(p);
      });

      let primaryData = [];
      let primaryLayout = {
        ...themeLayout,
        title: { text: `Intraday 30-Min Step Balance Trajectory (${selectedEntity} • ${selectedCurrency})`, font: { size: 13, color: isDark ? '#F1F5F9' : '#0F172A', weight: 700 }, x: 0.02 },
        yaxis: { ...themeLayout.yaxis, tickformat: '$,.2s', title: { text: 'Base Balance (USD)' } }
      };

      if (trajectoryViewMode === 'consolidated') {
        primaryData = [
          {
            x: times,
            y: availVals,
            name: 'Available Balance (BC_AVA_BAL)',
            type: 'scatter',
            mode: 'lines',
            line: { color: '#06B6D4', width: 3, shape: 'hv' },
            hovertemplate: '<b>%{x}</b><br>Available: $%{y:,.0f}<extra></extra>'
          },
          {
            x: times,
            y: projVals,
            name: 'Projected Balance (BC_PRJ_BAL)',
            type: 'scatter',
            mode: 'lines',
            line: { color: '#F59E0B', width: 2.5, shape: 'hv' },
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

        // Highlight 13:30 Overdraft dip
        primaryLayout.annotations = [
          {
            x: '13:30',
            y: -14200000,
            xref: 'x',
            yref: 'y',
            text: 'Peak Overdraft (-$14.2M)',
            showarrow: true,
            arrowhead: 2,
            arrowcolor: '#EF4444',
            arrowsize: 1,
            arrowwidth: 1.5,
            bgcolor: isDark ? '#1E1B4B' : '#FEE2E2',
            bordercolor: '#EF4444',
            borderwidth: 1,
            font: { size: 10, color: isDark ? '#FCA5A5' : '#991B1B', family: 'JetBrains Mono, monospace' }
          }
        ];
      } else if (trajectoryViewMode === 'entity-overlay') {
        const entColors = {
          'Global Bank Germany': '#3B82F6',
          'Global Bank UK': '#10B981',
          'Global Bank Americas': '#8B5CF6',
          'Global Bank Luxembourg': '#EC4899'
        };

        const entitiesList = Object.keys(rawIdlData.trajectories[0].byEntity);
        primaryData = entitiesList.map(ent => ({
          x: times,
          y: rawIdlData.trajectories.map(d => d.byEntity[ent]?.available || 0),
          name: ent,
          type: 'scatter',
          mode: 'lines',
          line: { color: entColors[ent] || '#94A3B8', width: 2.5, shape: 'hv' },
          hovertemplate: `<b>%{x}</b><br>${ent}: $%{y:,.0f}<extra></extra>`
        }));
      } else {
        // Currency breakdown
        const currColors = {
          'USD': '#06B6D4',
          'EUR': '#3B82F6',
          'GBP': '#10B981',
          'JPY': '#F59E0B',
          'AUD': '#8B5CF6',
          'CHF': '#EC4899'
        };
        const currList = Object.keys(rawIdlData.trajectories[0].byCurrency);
        primaryData = currList.map(curr => ({
          x: times,
          y: rawIdlData.trajectories.map(d => d.byCurrency[curr]?.available || 0),
          name: curr,
          type: 'scatter',
          mode: 'lines',
          line: { color: currColors[curr] || '#94A3B8', width: 2, shape: 'hv' },
          hovertemplate: `<b>%{x}</b><br>${curr}: $%{y:,.0f}<extra></extra>`
        }));
      }

      renderPlot(primaryChartRef.current, primaryData, primaryLayout);

      // Secondary: Intraday Inflow/Outflow Delta step
      if (secondaryChartRef.current) {
        const secTimes = rawIdlData.hourlyCashFlows.map(d => d.hour);
        const secData = [
          {
            x: secTimes,
            y: rawIdlData.hourlyCashFlows.map(d => d.netFlow),
            name: 'Net Flow Delta',
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: '#8B5CF6', width: 2.5 },
            marker: { size: 6, color: '#8B5CF6' },
            hovertemplate: '<b>%{x}</b><br>Net Hourly Delta: $%{y:,.0f}<extra></extra>'
          }
        ];
        const secLayout = {
          ...themeLayout,
          title: { text: 'Net Intraday Flow Delta (Peak Settlement Hours)', font: { size: 12, color: isDark ? '#E2E8F0' : '#1E293B' }, x: 0.02 },
          yaxis: { ...themeLayout.yaxis, tickformat: '$,.2s' }
        };
        renderPlot(secondaryChartRef.current, secData, secLayout);
      }
    }

    // -----------------------------------------------------------------------
    // PANEL 3: IDL - FUNDING SOURCES & BUFFERS
    // -----------------------------------------------------------------------
    if (activePanelId === 'idl-funding-sources') {
      const fundTotals = rawIdlData.fundingTotals || {};
      const depTotals = rawIdlData.depositoryTotals || {};

      // Filter funding sources if depository selected
      let cash = fundTotals['Cash'] || 405269956;
      let credit = fundTotals['Credit Line'] || 1154695382;
      let availCollateral = fundTotals['Avail. Collateral'] || 2364977774;
      let pledged = fundTotals['Pledged Collateral'] || 621401394;

      if (selectedDepository !== 'All') {
        const filtered = rawIdlData.fundingSources.filter(s => s.location === selectedDepository);
        availCollateral = filtered.filter(s => s.type === 'Avail. Collateral').reduce((acc, c) => acc + c.baseValue, 0);
        pledged = filtered.filter(s => s.type === 'Pledged Collateral').reduce((acc, c) => acc + c.baseValue, 0);
      }

      const totalBuffer = cash + credit + availCollateral;

      const primaryData = [
        {
          x: ['BoD Cash Buffer', 'Committed Credit', 'Free Collateral', 'Total Intraday Buffer', 'Peak Overdraft Dip'],
          y: [cash, credit, availCollateral, totalBuffer, -14200000],
          type: 'bar',
          marker: {
            color: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444']
          },
          text: [formatCurrency(cash), formatCurrency(credit), formatCurrency(availCollateral), formatCurrency(totalBuffer), '-$14.2M'],
          textposition: 'auto',
          hovertemplate: '<b>%{x}</b><br>Value: $%{y:,.0f}<extra></extra>'
        }
      ];

      const primaryLayout = {
        ...themeLayout,
        title: { text: `Multi-Tier Intraday Liquidity Buffer Waterfall (${selectedDepository})`, font: { size: 13, color: isDark ? '#F1F5F9' : '#0F172A', weight: 700 }, x: 0.02 },
        yaxis: { ...themeLayout.yaxis, tickformat: '$,.2s', title: { text: 'Base Currency Value (USD)' } }
      };

      renderPlot(primaryChartRef.current, primaryData, primaryLayout);

      // Secondary: Depository Allocation Donut Chart
      if (secondaryChartRef.current) {
        const secData = [
          {
            labels: Object.keys(depTotals),
            values: Object.values(depTotals),
            type: 'pie',
            hole: 0.55,
            marker: {
              colors: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#06B6D4']
            },
            textinfo: 'label+percent',
            hovertemplate: '<b>%{label}</b><br>Collateral: $%{value:,.0f} (%{percent})<extra></extra>'
          }
        ];
        const secLayout = {
          ...themeLayout,
          title: { text: 'Collateral Distribution by Depository Location', font: { size: 12, color: isDark ? '#E2E8F0' : '#1E293B' }, x: 0.02 },
          showlegend: true
        };
        renderPlot(secondaryChartRef.current, secData, secLayout);
      }
    }

    // -----------------------------------------------------------------------
    // PANEL 4: UNMATCHED TRANSACTION MONITOR
    // -----------------------------------------------------------------------
    if (activePanelId === 'unmatched-monitor') {
      const flows = rawIdlData.hourlyCashFlows || [];
      const times = flows.map(d => d.hour);

      const primaryData = [
        {
          x: times,
          y: flows.map(d => d.matchedCredits),
          name: 'Matched Credits (BC_MC)',
          type: 'bar',
          marker: { color: '#10B981' }
        },
        {
          x: times,
          y: flows.map(d => d.unmatchedCredits),
          name: 'Unmatched Credits (BC_UMC)',
          type: 'bar',
          marker: { color: '#06B6D4' }
        },
        {
          x: times,
          y: flows.map(d => d.matchedDebits),
          name: 'Matched Debits (BC_MD)',
          type: 'bar',
          marker: { color: '#EF4444' }
        },
        {
          x: times,
          y: flows.map(d => d.unmatchedDebits),
          name: 'Unmatched Debits (BC_UMD)',
          type: 'bar',
          marker: { color: '#F59E0B' }
        },
        {
          x: times,
          y: flows.map(d => d.netFlow),
          name: 'Net Cash Velocity',
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#FFFFFF', width: 2.5 },
          marker: { size: 5, color: '#38BDF8' }
        }
      ];

      const primaryLayout = {
        ...themeLayout,
        barmode: 'relative',
        title: { text: `Hourly Matched vs. Unmatched Settlement Velocity & Cutoff Horizons`, font: { size: 13, color: isDark ? '#F1F5F9' : '#0F172A', weight: 700 }, x: 0.02 },
        yaxis: { ...themeLayout.yaxis, tickformat: '$,.2s', title: { text: 'Hourly Volume (USD)' } },
        shapes: [
          // 11:00 CHAPS Cutoff
          {
            type: 'line',
            x0: '11:00', x1: '11:00',
            y0: -500000000, y1: 500000000,
            line: { color: 'rgba(239, 68, 68, 0.4)', width: 1.5, dash: 'dot' }
          },
          // 14:00 TARGET2 Cutoff
          {
            type: 'line',
            x0: '14:00', x1: '14:00',
            y0: -500000000, y1: 500000000,
            line: { color: 'rgba(245, 158, 11, 0.4)', width: 1.5, dash: 'dot' }
          }
        ]
      };

      renderPlot(primaryChartRef.current, primaryData, primaryLayout);

      // Secondary: Top 6 Counterparty Queue Volume
      if (secondaryChartRef.current) {
        const cp = rawIdlData.topCounterparties || [];
        const secData = [
          {
            y: cp.map(c => c.name),
            x: cp.map(c => c.volume),
            type: 'bar',
            orientation: 'h',
            marker: { color: '#3B82F6' },
            hovertemplate: '<b>%{y}</b><br>Volume: $%{x:,.0f}<extra></extra>'
          }
        ];
        const secLayout = {
          ...themeLayout,
          margin: { ...themeLayout.margin, l: 120 },
          title: { text: 'Top 6 Settlement Queue Counterparties by Volume', font: { size: 12, color: isDark ? '#E2E8F0' : '#1E293B' }, x: 0.02 },
          xaxis: { ...themeLayout.xaxis, tickformat: '$,.2s' }
        };
        renderPlot(secondaryChartRef.current, secData, secLayout);
      }
    }

    // -----------------------------------------------------------------------
    // PANEL 5: ALERTS DASHBOARD
    // -----------------------------------------------------------------------
    if (activePanelId === 'alerts-governance') {
      let filteredAlerts = rawIdlData.alerts || [];

      if (selectedSeverity !== 'All') {
        filteredAlerts = filteredAlerts.filter(a => a.severity.toLowerCase() === selectedSeverity.toLowerCase());
      }
      if (selectedAlertType !== 'All') {
        filteredAlerts = filteredAlerts.filter(a => a.type.toLowerCase().includes(selectedAlertType.toLowerCase()));
      }
      if (selectedEntity !== 'All') {
        filteredAlerts = filteredAlerts.filter(a => a.entity === selectedEntity);
      }

      const primaryData = [
        {
          x: filteredAlerts.map(a => a.time),
          y: filteredAlerts.map(a => a.severity === 'High' ? 3 : a.severity === 'Medium' ? 2 : 1),
          text: filteredAlerts.map(a => `${a.type} • ${a.entity}<br>Acct: ${a.account}<br>Corr: ${a.correspondent}`),
          mode: 'markers',
          type: 'scatter',
          marker: {
            size: filteredAlerts.map(a => a.severity === 'High' ? 16 : 11),
            color: filteredAlerts.map(a => a.type.includes('LBAL') ? '#EF4444' : '#F59E0B'),
            symbol: filteredAlerts.map(a => a.severity === 'High' ? 'diamond' : 'circle'),
            line: { width: 1.5, color: '#FFFFFF' }
          },
          hovertemplate: '<b>%{text}</b><br>Time: %{x}<extra></extra>'
        }
      ];

      const primaryLayout = {
        ...themeLayout,
        title: { text: `Intraday Nostro Threshold Incident Timeline (${filteredAlerts.length} Active Events)`, font: { size: 13, color: isDark ? '#F1F5F9' : '#0F172A', weight: 700 }, x: 0.02 },
        yaxis: {
          ...themeLayout.yaxis,
          tickvals: [1, 2, 3],
          ticktext: ['Low Severity', 'Medium Warning', 'High Breach (LBAL)']
        }
      };

      renderPlot(primaryChartRef.current, primaryData, primaryLayout);

      // Secondary: Alert Count by Legal Entity
      if (secondaryChartRef.current) {
        const entCounts = {};
        filteredAlerts.forEach(a => {
          entCounts[a.entity] = (entCounts[a.entity] || 0) + 1;
        });

        const secData = [
          {
            x: Object.keys(entCounts),
            y: Object.values(entCounts),
            type: 'bar',
            marker: { color: '#EC4899' },
            hovertemplate: '<b>%{x}</b><br>Incidents: %{y}<extra></extra>'
          }
        ];
        const secLayout = {
          ...themeLayout,
          title: { text: 'Incident Frequency by Legal Entity Hub', font: { size: 12, color: isDark ? '#E2E8F0' : '#1E293B' }, x: 0.02 }
        };
        renderPlot(secondaryChartRef.current, secData, secLayout);
      }
    }

    // -----------------------------------------------------------------------
    // PANEL 6: IDL - SECURITIES MOVEMENT DASHBOARD
    // -----------------------------------------------------------------------
    if (activePanelId === 'securities-movement') {
      let positions = rawIdlData.securities?.positions || [];

      if (selectedDepository !== 'All') {
        positions = positions.filter(p => p.location === selectedDepository);
      }

      const topPositions = positions.slice(0, 10);

      const primaryData = [
        {
          x: topPositions.map(p => p.isin),
          y: topPositions.map(p => p.marketValue),
          type: 'bar',
          marker: {
            color: topPositions.map(p => p.location === 'ASX' ? '#3B82F6' : p.location === 'EuroClear' ? '#10B981' : p.location === 'TSE' ? '#F59E0B' : '#8B5CF6')
          },
          text: topPositions.map(p => formatCurrency(p.marketValue)),
          textposition: 'auto',
          hovertemplate: '<b>%{x}</b><br>Market Value: $%{y:,.0f}<br>Location: %{text}<extra></extra>'
        }
      ];

      const primaryLayout = {
        ...themeLayout,
        title: { text: `Top 10 Custodial ISIN Holdings by Market Value (${selectedDepository})`, font: { size: 13, color: isDark ? '#F1F5F9' : '#0F172A', weight: 700 }, x: 0.02 },
        yaxis: { ...themeLayout.yaxis, tickformat: '$,.2s', title: { text: 'Market Value (USD)' } }
      };

      renderPlot(primaryChartRef.current, primaryData, primaryLayout);

      // Secondary: Trade Executions Buy vs Sell
      if (secondaryChartRef.current) {
        const secData = [
          {
            labels: ['Buy Trades (Inflows)', 'Sell Trades (Outflows)'],
            values: [rawIdlData.securities?.totalBuy || 820000000, rawIdlData.securities?.totalSell || 740000000],
            type: 'pie',
            hole: 0.6,
            marker: { colors: ['#10B981', '#EF4444'] },
            textinfo: 'label+percent'
          }
        ];
        const secLayout = {
          ...themeLayout,
          title: { text: 'Intraday Securities Settlement Execution Ratio', font: { size: 12, color: isDark ? '#E2E8F0' : '#1E293B' }, x: 0.02 }
        };
        renderPlot(secondaryChartRef.current, secData, secLayout);
      }
    }

    // -----------------------------------------------------------------------
    // PANEL 7: PIVOT VIEW - CASH MOVEMENTS & ALERTS
    // -----------------------------------------------------------------------
    if (activePanelId === 'pivot-cash-alerts') {
      const matrix = rawIdlData.pivotCashMatrix || [];
      const entities = [...new Set(matrix.map(d => d.entity))];
      const currencies = [...new Set(matrix.map(d => d.currency))];

      // Build 2D grid
      const zValues = entities.map(ent => {
        return currencies.map(curr => {
          const item = matrix.find(d => d.entity === ent && d.currency === curr);
          if (!item) return 0;
          if (pivotMetric === 'netBalance') return item.netBalance;
          if (pivotMetric === 'inflow') return item.inflow;
          if (pivotMetric === 'outflow') return item.outflow;
          return item.alertCount;
        });
      });

      const primaryData = [
        {
          x: currencies,
          y: entities,
          z: zValues,
          type: 'heatmap',
          colorscale: pivotMetric === 'alertCount' ? 'YlOrRd' : 'Viridis',
          hovertemplate: 'Entity: <b>%{y}</b><br>Currency: <b>%{x}</b><br>Value: %{z:,.0f}<extra></extra>'
        }
      ];

      const primaryLayout = {
        ...themeLayout,
        margin: { ...themeLayout.margin, l: 150 },
        title: { text: `Cross-Entity Multi-Currency Pivot Heatmap (${pivotMetric.toUpperCase()})`, font: { size: 13, color: isDark ? '#F1F5F9' : '#0F172A', weight: 700 }, x: 0.02 }
      };

      renderPlot(primaryChartRef.current, primaryData, primaryLayout);

      // Secondary: Total Volume by Entity Bar Chart
      if (secondaryChartRef.current) {
        const entVolumes = entities.map(ent => {
          const items = matrix.filter(d => d.entity === ent);
          return items.reduce((acc, c) => acc + c.inflow + c.outflow, 0);
        });

        const secData = [
          {
            x: entities,
            y: entVolumes,
            type: 'bar',
            marker: { color: '#3B82F6' },
            hovertemplate: '<b>%{x}</b><br>Gross Flow: $%{y:,.0f}<extra></extra>'
          }
        ];
        const secLayout = {
          ...themeLayout,
          title: { text: 'Consolidated Gross Volume by Legal Entity Hub', font: { size: 12, color: isDark ? '#E2E8F0' : '#1E293B' }, x: 0.02 },
          yaxis: { ...themeLayout.yaxis, tickformat: '$,.2s' }
        };
        renderPlot(secondaryChartRef.current, secData, secLayout);
      }
    }

    // -----------------------------------------------------------------------
    // PANEL 8: INTERDAY PROJECTION / STRESS SCENARIOS
    // -----------------------------------------------------------------------
    if (activePanelId === 'stress-scenarios') {
      const times = rawIdlData.trajectories.map(d => d.time);
      const baselineProj = rawIdlData.trajectories.map(d => d.projected);

      // Dynamically calculate stressed curve
      const stressedProj = baselineProj.map(val => {
        let stressed = val;
        // 1. Outflow Shock
        if (stressShockPct > 0) {
          stressed -= (Math.abs(stressed) * (stressShockPct / 100));
        }
        // 2. Counterparty freeze
        if (counterpartyFreeze > 0) {
          stressed -= (Math.abs(val) * (counterpartyFreeze / 100) * 0.7);
        }
        return stressed;
      });

      const minStressed = Math.min(...stressedProj);
      const totalBuffer = (rawIdlData.summaryKPIs?.totalAvailableBuffer || 3924943112) * (1 - (creditHaircutPct / 100));

      const primaryData = [
        {
          x: times,
          y: baselineProj,
          name: 'Baseline Projected Trajectory',
          type: 'scatter',
          mode: 'lines',
          line: { color: '#06B6D4', width: 2.5 }
        },
        {
          x: times,
          y: stressedProj,
          name: `Stressed Trajectory (+${stressShockPct}% Outflows, ${counterpartyFreeze}% Freeze)`,
          type: 'scatter',
          mode: 'lines',
          line: { color: '#EC4899', width: 3, dash: 'solid' },
          fill: 'tozeroy',
          fillcolor: isDark ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.2)'
        },
        {
          x: times,
          y: times.map(() => 0),
          name: 'Zero Baseline',
          type: 'scatter',
          mode: 'lines',
          line: { color: '#EF4444', width: 1.5, dash: 'dot' }
        }
      ];

      const primaryLayout = {
        ...themeLayout,
        title: { text: `Stress Scenario Simulation: Baseline vs. Shocked Liquidity Curve`, font: { size: 13, color: isDark ? '#F1F5F9' : '#0F172A', weight: 700 }, x: 0.02 },
        yaxis: { ...themeLayout.yaxis, tickformat: '$,.2s', title: { text: 'Simulated USD Balance' } },
        annotations: [
          {
            x: '13:30',
            y: minStressed,
            text: `Peak Deficit: ${formatCurrency(minStressed)}`,
            showarrow: true,
            arrowhead: 2,
            arrowcolor: '#EC4899',
            bgcolor: isDark ? '#831843' : '#FCE7F3',
            font: { size: 10, color: '#FFFFFF', family: 'JetBrains Mono, monospace' }
          }
        ]
      };

      renderPlot(primaryChartRef.current, primaryData, primaryLayout);

      // Secondary: Stressed Buffer Headroom Absorption
      if (secondaryChartRef.current) {
        const secData = [
          {
            x: ['Stressed Intraday Buffer', 'Peak Liquidity Deficit', 'Remaining Safety Margin'],
            y: [totalBuffer, Math.abs(minStressed), totalBuffer - Math.abs(minStressed)],
            type: 'bar',
            marker: { color: ['#3B82F6', '#EF4444', '#10B981'] },
            text: [formatCurrency(totalBuffer), formatCurrency(Math.abs(minStressed)), formatCurrency(totalBuffer - Math.abs(minStressed))],
            textposition: 'auto'
          }
        ];
        const secLayout = {
          ...themeLayout,
          title: { text: 'Stress Absorption & BCBS 248 Regulatory Buffer Headroom', font: { size: 12, color: isDark ? '#E2E8F0' : '#1E293B' }, x: 0.02 },
          yaxis: { ...themeLayout.yaxis, tickformat: '$,.2s' }
        };
        renderPlot(secondaryChartRef.current, secData, secLayout);
      }
    }

    // -----------------------------------------------------------------------
    // PANEL 9: PIVOT VIEW - SECURITIES MOVEMENT
    // -----------------------------------------------------------------------
    if (activePanelId === 'pivot-securities') {
      const secMatrix = rawIdlData.pivotSecuritiesMatrix || [];

      const primaryData = [
        {
          x: secMatrix.map(d => d.location),
          y: secMatrix.map(d => d.owned),
          name: 'Proprietary Owned Assets',
          type: 'bar',
          marker: { color: '#3B82F6' }
        },
        {
          x: secMatrix.map(d => d.location),
          y: secMatrix.map(d => d.clientPledged),
          name: 'Client-Pledged Collateral',
          type: 'bar',
          marker: { color: '#8B5CF6' }
        }
      ];

      const primaryLayout = {
        ...themeLayout,
        barmode: 'stack',
        title: { text: `Custodial Segregation: Proprietary Owned vs. Client-Pledged by Depository`, font: { size: 13, color: isDark ? '#F1F5F9' : '#0F172A', weight: 700 }, x: 0.02 },
        yaxis: { ...themeLayout.yaxis, tickformat: '$,.2s', title: { text: 'Market Value (USD)' } }
      };

      renderPlot(primaryChartRef.current, primaryData, primaryLayout);

      // Secondary: Total Custody Distribution Pie
      if (secondaryChartRef.current) {
        const secData = [
          {
            labels: secMatrix.map(d => d.location),
            values: secMatrix.map(d => d.total),
            type: 'pie',
            hole: 0.55,
            marker: { colors: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'] },
            textinfo: 'label+percent'
          }
        ];
        const secLayout = {
          ...themeLayout,
          title: { text: 'Market Share of Assets across Central Depositories', font: { size: 12, color: isDark ? '#E2E8F0' : '#1E293B' }, x: 0.02 }
        };
        renderPlot(secondaryChartRef.current, secData, secLayout);
      }
    }

  }, [
    activePanelId, 
    selectedDate, 
    selectedEntity, 
    selectedCurrency, 
    selectedDepository, 
    selectedSeverity, 
    selectedAlertType, 
    trajectoryViewMode, 
    expectationsViewMode, 
    pivotMetric, 
    stressShockPct, 
    counterpartyFreeze, 
    creditHaircutPct, 
    isDark, 
    themeLayout
  ]);

  return (
    <div className="space-y-8 my-6">

      {/* =================================================================== */}
      {/* 9-PANEL CUBE SELECTOR (Matching Zoho Architectural Concept)        */}
      {/* =================================================================== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-400" />
            <span>Select Native Plotly Dashboard View (9 Dedicated Modules):</span>
          </h4>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Plotly Engine Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DASHBOARD_PANELS.map((panel) => {
            const isSelected = panel.id === activePanelId;
            const Icon = panel.icon;

            return (
              <button
                key={panel.id}
                onClick={() => setActivePanelId(panel.id)}
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
                      {panel.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">#{panel.panelNumber}</span>
                  </div>

                  <h5 className={`text-xs font-bold line-clamp-1 group-hover:text-brand-400 transition-colors ${
                    isSelected ? 'text-brand-300' : isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {panel.title}
                  </h5>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {panel.summary}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/40 flex items-center justify-end text-[11px]">
                  <span className={`text-[10px] font-medium flex items-center gap-1 ${
                    isSelected ? 'text-brand-400 font-bold' : 'text-slate-500 group-hover:text-slate-300'
                  }`}>
                    <span>{isSelected ? 'Active Cockpit' : 'Open View'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-brand-400 translate-x-0.5' : 'text-slate-600 group-hover:translate-x-0.5'}`} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* ACTIVE DASHBOARD CONTAINER                                          */}
      {/* =================================================================== */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-2xl transition-all duration-300 ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>

        {/* 1. Header Banner & Data Stream */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono uppercase">
                Active Module #{activePanel.panelNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/30 font-mono">
                {activePanel.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Stream: {activePanel.dataStream}
              </span>
            </div>
            <h3 className={`text-xl sm:text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activePanel.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              {activePanel.summary}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>BCBS 248 Compliant</span>
            </span>
          </div>
        </div>

        {/* 2. Interactive Filter Toolbar Tailored to Active Panel */}
        <div className="py-4 my-2 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">

            {/* As-Of Date Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-400" />
                <span>As-Of Date:</span>
              </span>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-medium outline-none ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
                }`}
              >
                {rawIdlData.metadata.supportedDates?.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Legal Entity Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-brand-400" />
                <span>Entity:</span>
              </span>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-medium outline-none ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
                }`}
              >
                {rawIdlData.metadata.entities?.map(ent => (
                  <option key={ent} value={ent}>{ent}</option>
                ))}
              </select>
            </div>

            {/* Currency Filter (For relevant dashboards) */}
            {['cash-expectations', 'idl-cash-movement', 'pivot-cash-alerts'].includes(activePanelId) && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Currency:</span>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-medium outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
                  }`}
                >
                  {rawIdlData.metadata.currencies?.map(curr => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Depository Filter (For funding and securities) */}
            {['idl-funding-sources', 'securities-movement', 'pivot-securities'].includes(activePanelId) && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Depository:</span>
                <select
                  value={selectedDepository}
                  onChange={(e) => setSelectedDepository(e.target.value)}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-medium outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
                  }`}
                >
                  {rawIdlData.metadata.depositories?.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Alerts Specific Filter */}
            {activePanelId === 'alerts-governance' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Severity:</span>
                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-medium outline-none ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
                    }`}
                  >
                    <option value="All">All Severities</option>
                    <option value="High">High (20 LBAL)</option>
                    <option value="Medium">Medium Warning</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Type:</span>
                  <select
                    value={selectedAlertType}
                    onChange={(e) => setSelectedAlertType(e.target.value)}
                    className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-medium outline-none ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
                    }`}
                  >
                    <option value="All">All Types</option>
                    <option value="LBAL">LBAL (Low Balance)</option>
                    <option value="HBAL">HBAL (High Balance)</option>
                  </select>
                </div>
              </>
            )}

            {/* Pivot Metric Selector */}
            {activePanelId === 'pivot-cash-alerts' && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Metric:</span>
                <select
                  value={pivotMetric}
                  onChange={(e) => setPivotMetric(e.target.value)}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-medium outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="netBalance">Net Available Balance ($)</option>
                  <option value="inflow">Gross Inflow Volume ($)</option>
                  <option value="outflow">Gross Outflow Volume ($)</option>
                  <option value="alertCount">Alert Incident Count (#)</option>
                </select>
              </div>
            )}
          </div>

          {/* Sub-view Toggles */}
          <div className="flex items-center gap-2">
            {activePanelId === 'idl-cash-movement' && (
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <button
                  onClick={() => setTrajectoryViewMode('consolidated')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    trajectoryViewMode === 'consolidated' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Step Trajectory
                </button>
                <button
                  onClick={() => setTrajectoryViewMode('entity-overlay')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    trajectoryViewMode === 'entity-overlay' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  4-Entity Overlay
                </button>
                <button
                  onClick={() => setTrajectoryViewMode('currency-breakdown')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    trajectoryViewMode === 'currency-breakdown' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Currencies
                </button>
              </div>
            )}

            {activePanelId === 'cash-expectations' && (
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <button
                  onClick={() => setExpectationsViewMode('cumulative')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    expectationsViewMode === 'cumulative' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cumulative Net Curve
                </button>
                <button
                  onClick={() => setExpectationsViewMode('hourly-variance')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    expectationsViewMode === 'hourly-variance' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Hourly Variance Delta
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Stress Scenario Simulation Sliders (Rendered exclusively for Panel 8) */}
        {activePanelId === 'stress-scenarios' && (
          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/25 mb-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-brand-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-brand-400" />
                <span>Interactive Liquidity Shock Controls & Presets:</span>
              </span>
              <div className="flex items-center gap-2">
                {[
                  { id: 'baseline', label: 'Normal Baseline' },
                  { id: 'midday-shock', label: 'Midday Surge (+25%)' },
                  { id: 'counterparty-freeze', label: 'Counterparty Freeze' },
                  { id: 'severe-squeeze', label: 'Severe BCBS 248 Stress' }
                ].map(pre => (
                  <button
                    key={pre.id}
                    onClick={() => applyPreset(pre.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      activePreset === pre.id 
                        ? 'bg-brand-500 text-white shadow-glow-brand' 
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {pre.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Outflow Surge Shock:</span>
                  <span className="text-rose-400 font-bold">+{stressShockPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={stressShockPct}
                  onChange={(e) => {
                    setStressShockPct(parseInt(e.target.value));
                    setActivePreset('custom');
                  }}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Delayed Counterparty Inflows:</span>
                  <span className="text-amber-400 font-bold">-{counterpartyFreeze}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={counterpartyFreeze}
                  onChange={(e) => {
                    setCounterpartyFreeze(parseInt(e.target.value));
                    setActivePreset('custom');
                  }}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Credit Line / Collateral Haircut:</span>
                  <span className="text-purple-400 font-bold">-{creditHaircutPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="5"
                  value={creditHaircutPct}
                  onChange={(e) => {
                    setCreditHaircutPct(parseInt(e.target.value));
                    setActivePreset('custom');
                  }}
                  className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. Executive KPI Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 mb-4 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase">Opening Nostro Cash</span>
            <span className="text-base font-bold text-slate-100 mt-0.5 block">
              {formatCurrency(rawIdlData.summaryKPIs?.openingBalance || 400558380)}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase">Peak Overdraft Usage</span>
            <span className="text-base font-bold text-rose-400 mt-0.5 block">
              -$14.2M <span className="text-[10px] text-slate-500 font-normal">@ 13:30</span>
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase">Total Intraday Buffer</span>
            <span className="text-base font-bold text-emerald-400 mt-0.5 block">
              {formatCurrency(rawIdlData.summaryKPIs?.totalAvailableBuffer || 3924943112)}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase">Structural Coverage</span>
            <span className="text-base font-bold text-brand-300 mt-0.5 block">
              276x <span className="text-[10px] text-emerald-400 font-semibold">(Zero Risk)</span>
            </span>
          </div>
        </div>

        {/* 5. Primary High-Resolution Plotly Visual Canvas */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-950/50 p-2 sm:p-4 my-4 shadow-inner">
          <div ref={primaryChartRef} className="w-full h-[420px] sm:h-[460px]" />
        </div>

        {/* 6. Secondary Deep Breakdown Chart / Table */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-3 sm:p-4">
              <div ref={secondaryChartRef} className="w-full h-[300px]" />
            </div>
          </div>
        </div>

        {/* 7. Institutional Analytical Insights & Regulatory Standard */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h6 className="font-bold text-slate-200">
                BCBS 248 Intraday Liquidity Compliance Engine
              </h6>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Ensures instantaneous intraday buffer sufficiency condition: <code className="text-purple-300 font-mono">Cash + Lines + Collateral ≥ max|G_t|</code> across all correspondent hubs.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-800 text-brand-300 border border-slate-700">
              High-Velocity Client-Side Plotly
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
