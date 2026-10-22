---
title: "InvestAide: Investment Analysis Concept"
date: "2026-10-22"
category: "Quantitative Analytics & ML"
client: "Proprietary Quantitative Research"
role: "Quantitative Architect & Full-Stack Engineer"
featured: false
coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"
technologies: ["Analytics", "Time Series", "Relative Value", "Long Term Investment", "Python", "Django"]
demoUrl: "https://investaide.rohitcuriosity.com"
githubUrl: ""
summary: "InvestAide helps analyze equity price movements - standalone, relative to market across periods of time. Intent is to understand price movements , correlate to business fundamentals and identify opportunities & risks."
---

### 🎯 Executive Problem Statement

A picture says a thousand words, in the same way looking at price charts offers key insights while analyzing investment opportunities.

This is not about technical analysis, but about using charts, analytics to bring out relationship between - fundamentals, market events, earnings with price movemements.

With the insight that to identify investment opportunities and risks when there is divergence between the two elements. Leveraging ML & Analytics can help identify risks and oppourtunities faster.

---

### 1. Relative Value 
Relative value module visualizes the stock performance - standalone and also vs. a Benchmark Index. Offers views based on key market movements (bull/bear cycles) or standard periods (calendar year, quarter, fiscal year etc.)

This will further get extended to include - news, financial or valuation ratios, multiples to drive confidence & insights.

### 2. Coffee Can Compounding Engine
Inspired by the long-term investment philosophy of Robert Kirby and Saurabh Mukherjea, this module backtests using the Coffee Can concept.

It answers - how the historical (theoretical) performance would have been, had you never made additional trades (buys/sells) ?

---

## 💡 System Architecture & Technical Stack

InvestAide was architected from the ground up for modularity, low computational overhead, and cohesive aesthetic alignment with the **rohitcuriosity.com** obsidian design system:

* **Backend & Numerical Computation:** Built in **Python 3.12** utilizing **Django** for secure session and route management, alongside `statsmodels`, `scipy`, `pandas`, and `numpy` for linear algebra and time-series econometrics.
* **Interactive Visualization:** Dynamic, hardware-accelerated **Plotly** charts with transparent backdrops, custom obsidian palettes (`#0B0F17` canvas, `#0D131F` card surfaces), and tabular `JetBrains Mono` financial figure formatting.
* **Production Deployment:** Containerized and served via **Gunicorn WSGI** behind high-performance reverse proxies, with public availability hosted at [**investaide.rohitcuriosity.com**](https://investaide.rohitcuriosity.com).
* **Open Source Repository:** Modular architecture maintained on GitHub at [**github.com/machinelearnz**](https://github.com/machinelearnz).

---

## 🚀 Key Results & Institutional Impact

* **Clarify & Confidence:** Gain clarity and confidence in your investment decision making. 