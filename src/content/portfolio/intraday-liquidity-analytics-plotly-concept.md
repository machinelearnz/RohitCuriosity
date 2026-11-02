---
title: "Intraday Liquidity Analytics with Plotly Concept"
date: "2026-10-30"
category: "Quantitative Analytics & ML"
client: "Curiosity Research & Institutional Treasury"
role: "Lead Financial Systems Architect & Quantitative Engineer"
featured: true
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
technologies: ["Python", "Streamlit", "Plotly", "BCBS 248", "Pandas", "Intraday Liquidity"]
demoUrl: "https://idl.rohitcuriosity.com"
githubUrl: "https://github.com/machinelearnz/Curiosity-Intraday-Liquidity"
summary: "An institutional-grade Intraday Liquidity surveillance platform built in Python and Streamlit, architected in full alignment with the Basel BCBS 248 framework to monitor Nostro balances, credit facilities, and settlement velocity in real time."
---

### 🎯 Executive Problem Statement & BCBS 248 Context

In high-velocity global settlement networks (such as Fedwire, CHAPS, TARGET2, and Lynx), liquidity is not static; it fluctuates continuously throughout the business day as payments, securities trades, and central bank intraday credit facilities evolve.

Regulatory compliance under the **Basel Committee on Banking Supervision (BCBS 248)** mandates that commercial and investment banks actively monitor, control, and forecast their intraday liquidity positions across currencies, settlement entities, and clearing depositories.

Without real-time intraday surveillance, institutions face acute structural risks: unexpected midday overdrafts, settlement cutoff queues, penalty charges, and regulatory non-compliance. Curiosity IDL was designed to replace slow, batch-oriented reporting with instant, interactive surveillance.

---

### 1. Real-Time Surveillance & Trajectory Forecasting
Tracks 30-minute interval step trajectories for **Available Balances** (`BC_AVA_BAL`) and **Projected Balances** (`BC_PRJ_BAL`) across global operating entities (Germany, UK, Americas, Luxembourg):
- Highlights the acute midday settlement trough (e.g., peak overdraft dip at 13:30) with dynamic baseline alerts.
- Provides time-of-day snapshot views (**BoD 08:00**, **MoD 15:00**, **EoD 23:00**) with dimmed post-cutoff projections.
- Allows interactive drill-down on any trajectory point to inspect underlying Nostro balances and executing transactions.

### 2. Multi-Tier Funding Buffers & Collateral Headroom
Sizes unencumbered cash reserves, committed credit lines, and depository collateral against peak intraday requirements:
- Real-time waterfall sizing across central depositories (**EuroClear**, **BONY**, **ASX**, **TSE**).
- Ownership segregation distinguishing proprietary bank-owned securities from client-pledged collateral.
- Confirms zero structural liquidity risk under BCBS 248 buffer sufficiency conditions:
  $$\text{Cash Buffer} + \text{Committed Credit Line} + \text{Free Collateral} \ge \max_{t} |G_t^-|$$

### 3. Settlement Velocity & Cutoff Queue Management
Surveillance of unmatched debits (`UMD`) and unmatched credits (`UMC`) against completed settlements (`MD`, `MC`):
- Monitors high-value payment bottlenecks against RTGS cutoff milestones (11:00 CHAPS, 14:00 TARGET2, 16:30 Fedwire).
- Analyzes top counterparty exposures and settlement delay impact.

### 4. Risk Governance & Interactive Stress Simulation
- **Exception Logging:** Instant threshold alerts for Low-Balance breaches (`LBAL`) and High-Balance surplus traps (`HBAL`).
- **Dynamic Stress Profiles:** Simulates counterparty payment freezes, deposit runoff, and facility haircuts to calculate stressed absorption margins in real time.

---

## 💡 System Architecture & Technical Stack

Curiosity IDL was architected as a dedicated, high-performance financial surveillance application built in Python and Plotly, designed to run with ultra-low computational overhead and seamless responsiveness:

* **Backend & Data Processing:** Built on **Python 3.12** utilizing **Pandas** and **OpenPyXL** for multi-currency balance aggregation, MT940 statement parsing, and normalized time-series ledger processing.
* **Interactive Visualization:** Dynamic, hardware-accelerated **Plotly Graph Objects** with custom dark-theme obsidian aesthetics (`#0B0F17` canvas, `#0D131F` card surfaces), cross-hair hover cards, and tabular `JetBrains Mono` figure formatting.
* **Application Framework:** Engineered in **Streamlit** with a single-page reactive dashboard architecture, floating sticky filter pane (`As-of Date`, `Legal Entity`, `Currency`, `Nostro Account`), and point-selection drill-down.
* **Production Deployment:** Deployed and publicly accessible at [**idl.rohitcuriosity.com**](https://idl.rohitcuriosity.com).
* **Open Source Repository:** Maintained on GitHub at [**github.com/machinelearnz/Curiosity-Intraday-Liquidity**](https://github.com/machinelearnz/Curiosity-Intraday-Liquidity).

---

## 🚀 Key Results & Institutional Impact

* **Instant Visibility:** Real-time visibility into multi-entity Nostro balances, eliminating end-of-day reconciliation surprises.
* **Zero Structural Overdrafts:** Continuous monitoring of buffer sufficiency guarantees zero unbacked overdraft reliance.
* **Regulatory Compliance:** Out-of-the-box alignment with BCBS 248 intraday monitoring metrics and supervisory reporting.
