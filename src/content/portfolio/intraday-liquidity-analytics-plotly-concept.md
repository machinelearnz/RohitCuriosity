---
title: "Intraday Liquidity Analytics with Plotly Concept"
date: "2026-10-30"
category: "Quantitative Analytics & ML"
client: "Curiosity Research & Institutional Treasury"
role: "Lead Financial Systems Architect"
featured: true
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
technologies: ["Plotly.js", "React", "Dynamic JSON", "BCBS 248", "Tailwind CSS", "Time-Series Analytics"]
demoUrl: "#portfolio/intraday-liquidity-analytics-plotly-concept"
githubUrl: ""
summary: "A native, high-performance intraday liquidity cockpit engineered with Plotly.js and React. Features dynamic 30-min balance trajectories, stacked hourly cashflow velocity, multi-tier funding headroom, and customizable as-of date flexibility."
---

# Intraday Liquidity Analytics with Plotly Concept

While enterprise BI suites like Zoho Analytics enable rapid reporting, institutional treasury desks require **ultra-low latency, responsive interactivity, dark-mode native aesthetics, and bespoke financial modeling**.

This proof-of-work recreates the multi-entity intraday liquidity suite as a native web cockpit using **Plotly.js**, **React**, and **Tailwind CSS**. It runs completely client-side with zero external iframe dependencies, sub-150ms render latency, and full responsiveness across mobile, tablet, and ultra-wide trading monitors.

---

## ⚡ Architectural Enhancements over Traditional BI

```mermaid
graph LR
    subgraph Data Pipeline
        Excel["Raw Excel Transaction Feeds"] -->|Python ETL| JSON["Date-Flexible Normalized JSON"]
    end
    
    subgraph Client Application
        JSON --> State["React Filter & Date State Engine"]
        State -->|Dynamic 30-min Trajectory| Chart1["Plotly Balance Curve"]
        State -->|Matched vs Unmatched Flows| Chart2["Plotly Stacked Flow Velocity"]
        State -->|Buffer Headroom Waterfall| Chart3["Plotly Collateral Stack"]
        State -->|LBAL / HBAL Alerts| Chart4["Plotly Incident Matrix"]
    end
```

### 1. Flexible Date Architecture & Maintainability
A central challenge in intraday financial visualization is date flexibility. Static BI dashboards frequently hardcode reporting dates (such as `2026-04-02`), causing reports to break or require extensive schema changes when new value dates are introduced.

Our Plotly implementation solves this with a **Date-Agnostic JSON Schema**:
- **Normalized Time Steps:** Every trajectory point is indexed by normalized intraday time intervals (`00:00`, `00:30`, ..., `23:30`) and minute offsets.
- **Dynamic As-Of Date Binding:** The top cockpit header features an interactive **As-Of Date Selector**. Modifying the date dynamically rebinds all timestamps, hover cards, and axis labels across every chart in real time.
- **Automated Python Exporter:** An included automated ETL script (`scripts/export_idl_json.py --date YYYY-MM-DD`) allows re-indexing any incoming daily Excel feed with a single command:
  ```bash
  python scripts/export_idl_json.py --date 2026-05-15
  ```

---

## 📊 Core Analytical Cockpits

### 1. Intraday Cash Balance Trajectory (30-Minute Resolution)
- **Available Balance (`BC_AVA_BAL`):** Cyan trajectory tracking confirmed, settled cash across nostro accounts.
- **Projected Balance (`BC_PRJ_BAL`):** Amber forecast trajectory incorporating expected incoming/outgoing payments.
- **Overdraft Zone Shading:** Dynamic visual fill when net balance dips below zero, highlighting acute peak overdraft exposure at **13:30** (overdraft of **-$14.2M**).

### 2. Hourly Cash Movements & Settlement Velocity
- **Stacked Inflows:** Matched Credits (`BC_MC`) and Unmatched Credits (`BC_UMC`) displayed above the zero axis.
- **Stacked Outflows:** Matched Debits (`BC_MD`) and Unmatched Debits (`BC_UMD`) stacked below.
- **Net Flow Curve:** Electric blue line showing net hourly liquidity delta, capturing the heavy noon settlement surge.

### 3. Intraday Funding Buffers & Headroom Waterfall
- **$3.92 Billion Total Buffer:** Structured across **BoD Cash Buffer ($405M)**, **Committed Credit Lines ($1.15B)**, and **Free Eligible Collateral ($2.36B)**.
- Confirms zero structural liquidity risk as the buffer exceeds peak intraday negative gap by more than **270x**.

### 4. Interactive Stress Scenario Simulation
- The built-in **Outflow Shock Slider** enables risk officers to simulate unexpected counterparty settlement delays (0% to +50% outflow surge), dynamically recalculating the projected balance trajectory in the browser.

---

## 🛠️ Performance & Footprint Comparison

| Dimension | Legacy BI Embed (Zoho) | Curiosity Plotly Concept |
|---|---|---|
| **Network Payload** | 6.5 MB – 8.0 MB (Vendor JS + Iframes) | **~142 KB (Pre-compiled JSON Data)** |
| **First Contentful Paint** | 2,800ms – 4,200ms | **< 180ms** |
| **Dark Theme Coherence** | White iframe borders, mismatched chrome | **100% Native Tailwind Theme (`#0B0F17`)** |
| **Mobile Responsiveness** | Fixed desktop aspect ratio, double scrollbars | **Fluid Flexbox & SVG auto-resizing** |
| **Hosting Cost** | Paid BI subscription tier per user | **100% Free on Static Hosting** |

---

## 🚀 Experience the Live Dashboard

Interact with the real-time Plotly charts, entity filters, and stress sliders directly in the cockpit embedded at the top of this view!
