---
title: "The Domain Expert as Architect: Rethinking Buy vs. Build in the Age of GenAI"
date: "2026-11-03"
category: "Market Views"
author: "Rohit Gajare"
readTime: "6 min read"
featured: false
coverImage: "/images/img_1793715714691_smeinparadise.jpg"
tags: ["Capital Markets", "Generative AI", "Treasury Technology", "Risk Management", "Responsible AI"]
excerpt: "GenAI lets the people who understand the problem build the solution. Two of my own projects show how fast that now happens, and why the Sandbox and Castle model is what makes it safe for a bank."
---

For decades, treasury and risk desks faced a binary choice: **Buy** an off-the-shelf vendor platform and compromise on bespoke needs, or **Build** internally and absorb the engineering overhead, slow release cycles, and maintenance burden that come with it.

Generative AI changes that trade-off.

By narrowing the gap between domain expertise and working software, AI makes room for a new kind of practitioner: the domain expert who can conceptualise, architect, and ship a serious analytical application themselves.

The bigger story is not faster coding. It is that development capability is spreading across the enterprise, to the people closest to the problem. But spreading the ability to build also spreads the risk. The real question is how to keep that agility auditable, secure, and institutionally resilient.

---

### 1. The Economic Shift: The Bilingual Architect

Traditional software delivery carries a lot of friction. Business teams write long requirement documents, hand them to developers who may not know the financial nuance, and wait months for a system that needs rework on day one.

Generative AI enables the **"Bilingual Architect"**: a practitioner fluent in both institutional finance and software design. When the subject-matter expert can turn requirements directly into working code, prototyping cycles shrink from quarters to days.

Writing code is becoming cheap. Owning it (security, maintenance, controls, audit) is not. So the advantage shifts away from writing software and toward framing the right problem, designing the logic, and governing how it runs.

This does not make core enterprise vendors obsolete. Transaction processing, clearing, and regulatory reporting still demand institutional scale and hardened platforms. The model is shifting instead to **Buy, Build, and Compose**:

* **Buy** foundational infrastructure that requires institutional scale.
* **Build** proprietary, differentiating analytical modules.
* **Compose** connected workflows using vendor APIs, open-source libraries, and AI tooling.

---

### 2. Practical Precedent: Two Projects from My Own Sandbox

I have tested this on two of my own projects. Both were built with **Google Antigravity**, an AI-assisted development environment, running on the **Gemini 3.8 Flash** model.

* **Reviving Investaide (Equity Analytics):**

A personal project that had stalled for three to four years under maintenance overhead.

![Equity Analytics : https://investaide.rohitcuriosity.com](/images/img_1793714433055_investaideimage.png)

In roughly **two to three working days**, I ported the codebase and extended it with new features. The AI handled the mechanics of refactoring and debugging. I owned the analytical design: which metrics matter, how they are calculated, and whether the output made sense.

* **Decoupling Intraday Liquidity Analytics:**

Originally prototyped on a third-party BI platform (Zoho Analytics), the dashboards soon hit visual and architectural limits.

![Intraday Liquidity Dashboard : https://idl.rohitcuriosity.com](/images/img_1793713904476_idlimage.png)

I migrated the solution to an independent Python stack (Plotly/Dash) deployed on Render in roughly **one to two working days**. The starting input was simply screenshots of the existing Zoho dashboards. From there, it was iterative guidance: reviewing each version, correcting the liquidity logic and presentation, and steering the next round.

That iterative loop is the real lesson. The AI writes the code quickly, but it has no view on whether an intraday liquidity metric is defined correctly. **The domain expert is the specification, the reviewer, and the quality gate.**

To be clear about what these are: **both projects are Sandbox builds**, in the sense of the framework I describe below. They are personal prototypes, built outside any institutional control framework and hosted on a commercial cloud platform.

Taking either one into a bank's production environment would still require what I call the Castle: architecture and security review, data-privacy controls, independent model validation, and operational ownership.

What has changed is how quickly a domain expert can reach a working, testable prototype, and how much better the hand-off to engineering and validation teams becomes when the prototype already exists.

---

### 3. Historical Precedent: Spreadsheets and Shadow IT

Putting computing power in more hands has always accelerated innovation, and it has always created new vulnerabilities.

![On the other hand ...](/images/img_1793714909372_yinyang2.jpg)

In the 1980s and 1990s, spreadsheets (VisiCalc, Lotus 1-2-3, Excel) bypassed IT mainframes and brought modelling to the desk. They also brought a wave of undocumented, unversioned, business-critical files that sat outside any control framework, the problem that came to be called **Shadow IT**.

The industry did not ban spreadsheets. It introduced **End-User Computing (EUC)** policies and formalised **Model Risk Management (MRM)** standards, such as the Federal Reserve's SR 11-7 guidance.

The lesson still holds: putting powerful tools in more hands does not remove the need for governance. It makes governance essential.

---

### 4. Governance in the Age of GenAI: The Responsible AI Imperative

When every analyst can build a Python application, stand up a RAG pipeline, or delegate tasks to an autonomous agent, traditional IT approval queues cannot keep up. Ungoverned AI is simply operational risk running at machine speed.

Drawing on the **GARP Risk and AI (RAI™)** curriculum, I would frame safe adoption around four pillars:

* **Transparency & Provenance:** Pricing engines and liquidity forecasts must be reproducible, auditable, and explainable.
* **Tiered Model Risk:** Validation, conceptual-soundness checks, and ongoing monitoring should be proportionate to how material the application is.
* **Data Sovereignty:** Proprietary trade flows, counterparty exposures, and portfolio data must stay within defined security perimeters.
* **Delegated Authority Controls:** Clear guardrails are needed as workflows move from retrieving information to taking action, such as triggering payments or changing risk limits.

---

### 5. The Framework: The Sandbox and the Castle

To get domain-led agility without compromising institutional safety, I propose an operating model I call **"The Sandbox and the Castle"**:

![Agility & Governance](/images/img_1793715777709_sandboxcastle.jpg)

* **The Sandbox (Agility & Experimentation):** A controlled environment where domain experts can use AI tools, explore open-source frameworks, and prototype solutions without waiting on six-month procurement cycles, using synthetic or approved data only.
* **The Castle (Governance & Resilience):** The production perimeter. A prototype enters the Castle only after it passes defined gates.

The two environments depend on each other. A Sandbox without a Castle produces fragile tools in production. A Castle without a Sandbox slows innovation to the pace of the procurement cycle.

---

### Conclusion: The Domain Expert as the New Architect

Generative AI's biggest impact may be organisational rather than technical: it lowers the wall between domain insight and technical execution.

The institutions that benefit most will not simply be those with the largest IT budgets or the most vendor contracts. They will be those that combine the right platforms with a clear path for business experts to build in the Sandbox and graduate their best ideas into the Castle.

The question is no longer just Buy or Build. It is whether an institution can let its domain experts innovate while keeping the governance that keeps financial systems sound.

*I work at the intersection of capital markets, risk, and AI, and I enjoy turning domain problems into working products. If you are building in this space, especially around product, risk analytics, or AI governance, I would be glad to connect.*