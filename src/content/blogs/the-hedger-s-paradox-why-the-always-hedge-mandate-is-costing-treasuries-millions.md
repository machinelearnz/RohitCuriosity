---
title: "The Hedger’s Paradox: Why the 'Always Hedge' Mandate is Costing Treasuries Millions"
date: "2026-09-17"
category: "Market Views"
author: "Rohit Gajare"
readTime: "4 min read"
featured: false
coverImage: "/images/img_1789655406259_Cost_of_Hedge_header.png"
tags: ["Macroeconomics", "Hedging", "Decision Making", "Analytics", "Corporate Treasury"]
excerpt: "Challenging the conventional \"always hedge\" treasury mandate. A 6-year empirical backtest of USD/INR forwards against theoretical CIP, highlighting the asymmetric trade-offs between carry drag, tail-risk protection, and dynamic curve positioning."
---

In my previous article exploring External Commercial Borrowings (ECBs) and FX risk, we concluded that conservatively hedging currency exposure is the prudent move. But at what true cost?

Is FX hedging always a net benefit, or can it become a hidden tax on corporate margins? To answer this, I ran a 6-year empirical backtest (2020–2026) on USD/INR forwards against theoretical Covered Interest Parity (CIP). The results challenge standard corporate treasury playbooks.

## The CIP Illusion

Textbook finance dictates that forward premiums should equal the interest rate differential between two currencies.

The data reveals a stark reality: CIP fundamentally breaks down for USD/INR. The market forward premium persistently trades at a premium over what is justified by theoretical interest rate differentials (Term SOFR vs. MIBOR OIS).



![*Chart 1: CIP Overview / Historical Basis*](/images/img_1789654834754_empirical-cip-breakdown-macro-regimes-us.png)

This structural cross-currency basis is driven by capital account restrictions, structural onshore dollar demand, and central bank liquidity management. In theory, this persistent "overpricing" should systematically disadvantage Importers (who pay the premium) and reward Exporters (who receive it).

![*Chart 2: Histogram Distribution*](/images/img_1789654921915_Hedging_PnL_Distribution.png)


However, aggregate averages mask the true cyclical reality. Hedging is not a static risk-reduction exercise; it is an active macro-regime trade. When we partition the timeline into distinct liquidity cycles, the "winner" of the hedge completely flips:



![*Chart 3: Regime-Based Hedging Performance*](/images/img_1789654966430_Regime_Hedging_Performance.png)



*   **The Exporter’s Carry Trade (2020–2021 Surplus):** During abundant domestic liquidity, forward premia were bloated (~4.3–4.5%), while spot depreciation remained subdued. Exporters won ~76% of the time, harvesting the premium as pure carry, while hedged Importers suffered consistent drag (-61 paise average loss per 6M contract).
*   **The Tail Risk Shock (2022 Fed Hikes):** As global rates surged, the Rupee depreciated sharply. The forward curve severely underestimated this shock. Importers who hedged won overwhelmingly (76%+), saving substantial capital, while hedged Exporters suffered deep opportunity losses.
*   **The Efficient Market (2023–2024 Consolidation):** Spot and forward curves aligned. Win rates converged to a near 50/50 coin toss, proving pricing was remarkably efficient.
*   **The Dollar Squeeze (2025–2026):** Depreciation accelerated again, severely penalizing unhedged Importers (who won over 90% of hedged 6M contracts, saving ~279 paise on average).

## The Tactical Treasury Playbook

What does this mean for CFOs, Treasurers, and Risk Committees?



![*Chart4: Historical Basis Distribution*](/images/img_1789655001796_Basis_Distribution_Analysis.png)



Look at the current market reality in Chart 4: the 6M CIP basis currently sits at the 88th percentile. We are paying historically peak premiums for forward cover. When the "cost of insurance" is this expensive, blindly paying it is a massive drain on margins.

This is why modern treasuries must evolve:

*   **Embrace Probabilistic Forecasting:** Anticipating FX movements is notoriously difficult, but it is no longer optional. By combining historical basis distributions with Machine Learning (ML) models, treasuries can shift from reactive hedging to probabilistic forecasting—dynamically predicting when spot depreciation will actually outpace the forward premium.
*   **Abolish Static Hedge Mandates:** Rigid rules (e.g., "always hedge 50% across all exposures") destroy value. Hedge ratios must be dynamic, scaling up or down based on ML-driven price expectations and the prevailing liquidity regime.
*   **Liquidity & Flow Awareness is Critical:** Monitoring central bank intervention trends, systemic interbank liquidity, and cross-currency basis shifts is essential to determine whether forward points represent fair value or an expensive carry trap.

As we navigate the current dollar liquidity cycle, leaving import payables unhedged carries acute, asymmetric tail risk—but overpaying for that hedge damages the bottom line.

Over to you: How is your treasury committee adapting its hedging policy to current liquidity conditions? Are you exploring data-driven forecasting models, or still operating on static percentage rules?