---
title: "Intraday Liquidity Analytics with Plotly Concept"
date: "2026-10-30"
category: "Quantitative Analytics & ML"
client: "Curiosity Research & Institutional Treasury"
role: "Lead Financial Systems Architect"
featured: true
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
technologies: ["Plotly.js", "React", "Dynamic JSON", "BCBS 248", "Tailwind CSS", "Time-Series Analytics"]
demoUrl: ""
githubUrl: ""
summary: "An enterprise-grade, high-performance intraday liquidity suite engineered with Plotly.js and React. Recreates all 9 institutional dashboards with native dark-mode aesthetics, sub-100ms reactive filters, 30-min step trajectories, multi-tier funding waterfalls, and real-time stress testing."
---

# Intraday Liquidity Analytics with Plotly Concept

While traditional enterprise BI platforms (such as Zoho Analytics, Tableau, or PowerBI) offer quick cloud charts, modern institutional treasury desks require **ultra-low latency, fluid client-side responsiveness, dark-mode native aesthetics, and bespoke financial modeling**.

This proof-of-work recreates the entire multi-entity intraday liquidity suite as a native, high-velocity web cockpit using **Plotly.js**, **React**, and **Tailwind CSS**. It delivers **9 dedicated, full-width dashboards** powered by a single normalized JSON data stream, providing instant multi-dimensional filtering, interactive stress scenario testing, and 100% theme coherence without external iframes.

---

## ⚡ Why Native Plotly Outperforms Traditional BI

```mermaid
graph TD
    subgraph Data Pipeline
        Feeds["Core Banking & Nostro MT940 Feeds"] -->|Python ETL| JSON["Normalized Intraday JSON (~142 KB)"]
    end
    
    subgraph Native Plotly Cockpit
        JSON --> StateEngine["React Reactive Filter & Parameter Engine"]
        StateEngine --> Module1["1. Cash Movement & Expectations"]
        StateEngine --> Module2["2. 30-Min Step Balance Trajectories"]
        StateEngine --> Module3["3. Funding Buffers & Waterfall"]
        StateEngine --> Module4["4. Unmatched Transaction Monitor"]
        StateEngine --> Module5["5. Alerts & Incident Timeline"]
        StateEngine --> Module6["6. Securities Movement & ISIN Holdings"]
        StateEngine --> Module7["7. Cross-Entity Pivot Heatmap"]
        StateEngine --> Module8["8. Dynamic Stress Scenario Engine"]
        StateEngine --> Module9["9. Custodial Segregation Matrix"]
    end
```

### Technical & Operational Advantages

| Dimension | Cloud BI Suites (Zoho / Tableau) | Curiosity Plotly Architecture |
|---|---|---|
| **Render Latency** | 2,800ms – 4,500ms (Heavy JS bundle + iframe handshake) | **< 80ms (Instant SVG/Canvas render)** |
| **Payload Footprint** | 6.5 MB – 8.2 MB per embedded report | **~142 KB (Pre-compiled, compressed JSON)** |
| **Interactive Stress Testing** | Static reports or slow round-trip server queries | **Real-time client-side calculation as user drags shock sliders** |
| **Visual Coherence** | Mismatched white borders, scrollbars, and fonts | **100% Obsidian Dark Theme (`#0B0F17`) with neon accents** |
| **Filter Synchronization** | Fragmented per-report iframe state | **Unified React state syncing Legal Entity, Currency & Date** |
| **Infrastructure Cost** | Per-user recurring monthly cloud license | **Zero hosting cost (Pure static JAMStack deployment)** |

---

## 🏛️ Comprehensive Directory of the 9 Recreated Dashboards

Each module has been meticulously rebuilt with full subject-matter depth, bespoke KPI strips, interactive filter toolbars, primary high-resolution charts, and secondary analytical breakdowns:

### 1. Cash Movement & Expectations
- **Operational Data Stream:** Nostro Statements (MT940) & Scheduled Payment Feeds
- **Core Functionality:** Tracks the intraday cash trajectory by juxtaposing opening balances, anticipated receipts/payments, and actual settled flows.
- **Visual Engines:** Dual-mode visualization featuring cumulative net curves and hourly expected vs settled variance delta bars.
- **Key Metrics:** Expected Gross Inflows ($3.2B), Expected Outflows ($3.1B), Net Settled Balance ($402.8M).

### 2. IDL - Cash Movement Dashboard
- **Operational Data Stream:** Multi-Entity Intraday Nostro Balance Feeds
- **Core Functionality:** 30-minute step trajectory tracking **Available Balances** (`BC_AVA_BAL`) and **Projected Balances** (`BC_PRJ_BAL`) converted to Base Currency (USD).
- **Interactive Modes:** Switch seamlessly between **Consolidated Step Trajectory**, **4-Entity Comparative Overlay** (UK, Germany, Americas, Luxembourg), and **Currency Bucket Trajectories**.
- **Key Metrics:** Highlights the acute 11:30–13:30 liquidity trough with callout annotation at peak overdraft (**-$14.2M**).

### 3. IDL - Funding Sources
- **Operational Data Stream:** Central Bank Facilities & Depository Collateral Feeds
- **Core Functionality:** Visual breakdown of the bank's multi-tiered intraday liquidity buffer.
- **Visual Engines:** High-impact Buffer Waterfall Chart juxtaposing Start-of-Day Cash ($405M), Committed Credit Lines ($1.15B), and Free Eligible Collateral ($2.36B) against peak overdraft reliance (-$14.2M).
- **Secondary Breakdown:** Depository allocation donut chart (EuroClear $1.42B, BONY $1.18B, ASX $720M, TSE $604M).

### 4. Unmatched Transaction Monitor
- **Operational Data Stream:** RTGS Clearing & Real-Time Settlement Queue Feeds
- **Core Functionality:** Real-time surveillance of unmatched debits (`UMD`) and unmatched credits (`UMC`) against settled volumes (`MD`, `MC`).
- **Visual Engines:** Stacked velocity bars with vertical cutoff horizon markers for RTGS clearing windows (11:00 CHAPS, 14:00 TARGET2, 16:30 Fedwire).
- **Secondary Breakdown:** Horizontal volume ranking of the top 6 settlement queue counterparties (Bank of America, JPMorgan, BNP Paribas, Deutsche Bank, HSBC, Barclays).

### 5. Alerts Dashboard
- **Operational Data Stream:** Nostro Threshold Monitoring & Exception Feeds
- **Core Functionality:** Real-time exception governance monitoring 39 active threshold events, including 20 High-Severity Low-Balance (`LBAL`) warnings and 19 High-Balance (`HBAL`) surplus notifications.
- **Visual Engines:** Time-of-day incident scatter timeline with severity-coded marker sizing and alert type color coding.
- **Interactive Filters:** Filter instantly by Severity (`High`, `Medium`), Alert Type (`LBAL`, `HBAL`), Legal Entity, or Correspondent Bank.

### 6. IDL - Securities Movement Dashboard
- **Operational Data Stream:** Custodial Securities Ledgers & ISIN Settlement Feeds
- **Core Functionality:** Intraday position tracking of security ISINs, settlement statuses, and market values across custodian depositories.
- **Visual Engines:** Top 10 ISIN holdings bar chart color-coded by depository location (ASX, EuroClear, TSE, BONY).
- **Secondary Breakdown:** Intraday trade execution ratio donut comparing Buy trade volume ($820M) vs Sell trade volume ($740M).

### 7. Pivot View - Cash Movements & Alerts
- **Operational Data Stream:** Consolidated Multi-Jurisdiction Nostro Matrix
- **Core Functionality:** Cross-entity multi-currency pivot matrix aggregating cash positions, alert severities, and transaction flows grouped by jurisdiction, legal entity, and currency.
- **Visual Engines:** Interactive 2D Heatmap matrix with dynamic colorscales (Viridis for liquidity balances, YlOrRd for alert incident density).
- **Secondary Breakdown:** Consolidated gross volume bars across legal entity operating hubs.

### 8. InterDay Projection / Stress Scenarios
- **Operational Data Stream:** Counterparty Delay Profiles & Forward Liquidity Shocks
- **Core Functionality:** Interactive simulation engine evaluating how liquidity shocks impact net intraday funding needs.
- **Interactive Controls:**
  - **Scenario Presets:** `Normal Baseline`, `Midday Outflow Surge (+25%)`, `Counterparty Payment Freeze`, `Severe BCBS 248 Stress`.
  - **Dynamic Sliders:** Outflow Surge Shock (0% to +50%), Counterparty Payment Delay (0% to 40%), and Credit Line Haircut (0% to 30%).
- **Visual Engines:** Dynamic dual curves comparing baseline vs stressed trajectories in real time, with instant calculation of peak deficit and regulatory buffer absorption headroom.

### 9. Pivot View - Securities Movement
- **Operational Data Stream:** Custodial Segregation & Depository Allocation Feeds
- **Core Functionality:** Custodial segregation matrix breaking down proprietary (**Owned: $3.14B / 73.4%**) versus **Client-Pledged ($1.14B / 26.6%)** assets across clearing depositories.
- **Visual Engines:** Stacked depository segregation bars (ASX, TSE, EuroClear, BONY) and market share distribution donut.

---

## 📐 Mathematical Compliance Framework (BCBS 248)

The application models the two foundational Basel liquidity equations directly in client-side code:

1. **Intraday Cumulative Net Liquidity Gap ($G_{t}$):**
   $$G_t = \text{Opening Balance} + \sum_{\tau=0}^{t} \left(\text{Credits}_\tau - \text{Debits}_\tau\right)$$
   Where a negative $G_t$ signifies intraday overdraft reliance.

2. **Buffer Sufficiency Condition:**
   $$\text{Cash Buffer} + \text{Committed Credit Line} + \text{Free Collateral} \ge \max_{t} |G_t^-|$$
   With an available buffer of **\$3.92 Billion** against a peak overdraft dip of **-\$14.2 Million**, the institution maintains a **276x coverage ratio**, satisfying regulatory zero structural liquidity risk requirements.

---

## 🚀 Live Interactive Cockpit

Explore all 9 panels using the interactive selector cube above. Test the entity filters, currency selectors, and real-time stress sliders to experience the responsiveness of native client-side financial analytics!
