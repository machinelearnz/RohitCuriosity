---
title: "Tokenized Money Market Funds: Same Assets, New Plumbing"
date: "2026-11-11"
category: "Market Views"
author: "Rohit Gajare"
readTime: "6 min read"
featured: false
coverImage: "/images/tokenized-mmf-claims-to-ledger.png"
tags: ["Tokenization", "Money Market Funds", "Treasury", "Market Infrastructure", "Liquidity Management", "Institutional Finance"]
excerpt: "Money market funds are an important asset class. Over the past two years BlackRock, J.P. Morgan Asset Management and Amundi have launched tokenized funds, joining early movers such as Franklin Templeton. Here is what tokenization changes, how the market works today, and what it means for market infrastructure."
---

## Why this matters

* Money market funds (MMFs) are an important asset class. Companies and individuals use them as a proxy for bank balances or deposits, and rely on them as a “safe” place to park temporary or strategic liquidity.
* The market is large: US MMF assets alone were about USD 7.98 trillion in September 2026, per the Investment Company Institute.
* A gradual change is now visible in this asset class: the growth of tokenized MMFs (tMMFs). Over the past two years BlackRock (2024), J.P. Morgan Asset Management (2025–26) and Amundi (2026) have launched tokenized funds or share classes, joining early movers such as Franklin Templeton. The segment is still small, at about USD 15 billion in assets.
* Citi Institute’s base case expects this to reach about USD 600 billion by 2030, roughly 40 times today’s size in four to five years.

![Estimating tokenization market size by 2030 ($ trillion)](/images/tokenized-mmf-citi-market-size-2030.png)

Let’s explore what tokenization actually means, and how it affects asset managers, market infrastructure and, of course, investors.

---

## 1. How the market works today

A mutual fund, MMF or otherwise, relies on a small set of entities to manage and administer the investments:

* **Investor:** the beneficial owner of the units.
* **Asset manager:** markets the fund and manages the underlying investments as per the mandate.
* **Custodian:** holds the fund’s securities on behalf of the asset manager, takes part in settlement, processes corporate actions (income, dividends) and supports regulatory reporting and monitoring.
* **Bank account:** usually managed by the custodian; holds the cash associated with the fund.
* **Registrar & Transfer Agent (RTA):** maintains holding records at investor level. Every subscription and redemption must reach the RTA to be honoured, and its register is the golden copy of holdings.
* **Fund accountant:** measures daily income, gains and valuation, and calculates the fund’s net asset value (NAV), which represents the value of each unit held.

Trust structures, offshore vehicles and UCITS add local and regulatory detail, but these roles are what make the funds industry work.

![Today, only cash moves between investors; units stay on the RTA register](/images/tokenized-mmf-traditional-fund-plumbing.png)

The investing lifecycle is equally simple. An investor subscribes by sending an application and cash to the RTA, which allocates units according to the cut-off time. On redemption, units are cancelled and cash is paid out, again by cut-off.

What today’s process does not support is moving units from investor A to investor B in day-to-day operations. If A needs to pay B, A redeems units, receives cash and transfers that cash to B, who then uses it as they see fit.

---

## 2. What tokenization changes, and what it doesn’t

**What doesn’t change:** the fund’s assets. The securities held by the custodian and the fund’s bank balances, and the way they are held, are not directly affected.

![How tokenised money market funds move off-chain claims to the ledger](/images/tokenized-mmf-claims-to-ledger.png)

**What changes:**

* The investor needs a digital wallet in which tMMF holdings are recorded.
* The golden copy moves (at least partly) on-chain. Holding records are no longer maintained solely in the RTA’s database; they live on a blockchain or programmable ledger. The first impact is therefore on the RTA, which must run its register on-chain, alongside or instead of its standard records.
* Units become transferable. Units can move between investors without redeeming the fund. That makes tMMFs attractive for near-instant collateral and margin settlement (see section 6).
* Yield can become intraday. Funds that support intraday transactions, rather than end-of-day cut-offs, can pay interest for the exact time a unit is held (see section 5).

---

## 3. The tokenized market: ~USD 15 billion across three structures

Tokenized Treasury and money market products held about USD 14.9 billion in early October 2026. That is about 0.2% of US MMF assets, but it has grown several-fold in two years.

“Tokenized MMF” covers three legally different structures, and the difference matters for who can buy, how they are regulated, and what the holder actually owns:

* **Registered (public) money market funds.** Regulated in the US under the Investment Company Act of 1940 and Rule 2a-7, with the same liquidity, maturity and disclosure rules as any MMF. Some are open to retail investors. The token is simply a new way to record the shares. Examples: Franklin Templeton FOBXX (BENJI), WisdomTree WTGXX, J.P. Morgan JLTXX.
* **Private or offshore liquidity funds.** Usually domiciled in the BVI or Cayman, or offered privately in the US under Regulation D, and sold only to qualified or accredited investors with high minimums (USD 1 million for MONY). They invest in similar T-bills and repo but are not Rule 2a-7 funds, which gives issuers more freedom to design 24/7 features. Examples: BlackRock BUIDL, Franklin iBENJI, Circle USYC, Superstate USTB, J.P. Morgan MONY.
* **Tokenized notes.** Not a fund at all: the holder owns a debt obligation of an issuing vehicle backed by Treasuries and bank deposits, so the holder is a creditor rather than a fund shareholder. These are typically offered to non-US investors. Example: Ondo USDY.

| Product | Issuer | Structure | Approx. AUM |
| :--- | :--- | :--- | :--- |
| **USYC** | Circle (ex-Hashnote) | Private offshore fund | USD 2.4bn |
| **USDY** | Ondo | Tokenized note (not a fund) | ~USD 2.4bn |
| **BUIDL** | BlackRock / Securitize | Private BVI fund, qualified purchasers; stable USD 1 NAV | USD 2.25bn |
| **iBENJI** | Franklin Templeton | Private BVI fund, Reg D, institutional | USD 1.7bn |
| **WTGXX** | WisdomTree | Registered ’40 Act MMF | ~USD 1.0bn |
| **BENJI / FOBXX** | Franklin Templeton | Registered ’40 Act MMF, open to retail, multichain | USD 0.7–0.8bn |
| **JLTXX** | J.P. Morgan AM | Registered MMF aimed at GENIUS Act stablecoin reserves | ~USD 0.7bn |
| **USTB** | Superstate | Private fund | ~USD 0.6bn |
| **MONY** | J.P. Morgan AM | Private 506(c) fund on public Ethereum (Kinexys) | ~USD 0.1bn seed |



Sizes are September–October 2026 snapshots and differ across trackers.

---

## 4. Lifecycle: traditional vs tokenized

Each stage gets faster or more portable, but the off-chain roles remain.

| Stage | Today | Tokenized | Key message |
| :--- | :--- | :--- | :--- |
| **Subscribe** | Order before cut-off; cash by wire | Fiat or stablecoin in; tokens minted to a wallet | Same fund, faster on-ramp |
| **Register** | RTA database is the golden copy | Blockchain holds the record, alone or mirrored | The RTA stays and runs the allow-list |
| **NAV** | Struck daily by the fund accountant | Same NAV, published on-chain | Accounting now feeds the chain |
| **Transfer** | Redeem, move cash, re-subscribe | Wallet to wallet, 24/7 | Units start to behave like money |
| **Redeem** | Before cut-off; cash T+0 or T+1 | Tokens burned; cash in bank hours or via a stablecoin facility | The cash leg sets the speed limit |



![Tokens move 24/7; redemption cash still runs on bank hours](/images/img_1794413057906_tokenized-mmf-24-7-redemption-lifecycle.png)



Everything right of the green line runs around the clock; a redemption only completes when cash moves on the left, usually in banking hours.

---

## 5. Differences in tMMF architectures

### A. Yield: end-of-day vs intraday

* **End-of-day record (e.g. BlackRock BUIDL).** Stable USD 1.00 per token. Dividends accrue daily to whoever holds the token at the daily snapshot and are paid monthly as new tokens. It is simple, but a token transferred mid-day earns the seller nothing for that day: the full day’s yield goes to the holder at the snapshot.
* **Intraday, second-by-second (e.g. Franklin Templeton BENJI).** Since June 2025, Franklin’s Intraday Yield splits interest by holding time, down to the second, whenever shares change hands, and pays yield every calendar day, weekends included.

### B. Register: native on-chain vs mirrored

| | Native on-chain register | Mirrored register (digital twin) |
| :--- | :--- | :--- |
| **Example** | Franklin Templeton FOBXX / BENJI | BlackRock BUIDL (Securitize as TA); J.P. Morgan MONY |
| **Legal record** | The blockchain is the official share register | The TA’s off-chain books stay the legal record; tokens mirror them |
| **Strength** | One source of truth, fewer reconciliations, lower cost | Full legal certainty under existing fund law |
| **Constraint** | Depends on chain resilience and regulatory recognition | Two records to reconcile; on-chain and legal finality can briefly differ |

**My assessment:** mirrored registers lead the first wave because legal teams sign them off faster. Native registers win on cost once regulators treat on-chain records as official books and records.

---

## 6. Benefits and costs

### Benefits

* **Near-immediate liquidity for investors,** without working around cut-offs and end-of-day cycles.
* **Transfer without redemption.** Moving units directly to counterparties removes operational steps and cuts manual processing and reconciliation.
* **Yield stays on while collateral is posted.** Instead of moving cash to meet a margin call, the investor pledges units that keep earning. This matters most where the alternative earns little, such as stablecoin margin (see below).
* **Less redemption pressure on the fund.** Today a payment triggers a redemption (and possibly a sale of securities), followed by a subscription elsewhere (and a purchase). Transferring units avoids both legs. For a government MMF holding T-bills, trading costs are already tiny, so the bigger gain is avoiding forced redemptions in stress, which is BlackRock’s stated rationale for tokenized collateral.

### Testing the hype: where tMMFs add value, and where they don’t

A tMMF does not yield more than a traditional MMF; after fees it may yield slightly less. Its value depends on what it replaces:

* **Against stablecoin margin (0% yield),** the pickup is close to the full T-bill rate. This is why crypto venues adopted tMMF collateral first.
* **Against cash margin under an ISDA CSA,** which typically earns an overnight rate such as SOFR, the yield pickup is roughly nil, and haircuts on non-cash collateral can make it negative. The case rests on segregation (less counterparty exposure), avoiding forced asset sales in stress, and operational simplicity.
* **For corporate treasurers,** the gain is smaller cash buffers held for after-hours and weekend needs. It is worth the spread between MMF and deposit rates on that buffer, not the full MMF yield.
* **For payments,** the benefit is speed and 24/7 settlement, not yield: the money leaves the payer either way.

A higher fee only pays off in the first and third cases, so tMMF pricing will need to converge with traditional MMFs for broad institutional adoption.

### Costs and open questions

* Running the on-chain register, wallet allow-lists and oracle feeds alongside existing systems; for mirrored registers, the cost of reconciling two records.
* Continuous (intraday) NAV and yield calculation, and the controls around it.
* Smart-contract, oracle and custody risk, plus allow-list fragmentation across chains.
* A liquidity mismatch: tokens move 24/7, but most cash redemptions still settle in banking hours.

---

## 7. What this means for market infrastructure

* **Transfer agents become infrastructure operators.** Their job expands to managing wallet allow-lists, authorizing mints and burns, and keeping on-chain and legal records in sync.
* **The cash leg sets the speed.** Tokens cannot settle faster than the cash they convert into. Banks offering 24/7 tokenized deposits and institutional on/off-ramps will capture this flow.
* **Fund accounting becomes continuous.** Intraday yield needs ongoing accrual tracking and reliable pricing feeds to the chain.
* **Collateral drives adoption.** Margin eligibility, first on crypto venues and now via ISDA and CFTC work, pulls cash from non-yielding stablecoins into yield-bearing government paper.
* **Core platforms need native hooks.** Wallet allow-listing, on-chain event processing and atomic delivery-versus-payment become baseline requirements rather than innovation projects.

---

## Conclusion

The main change in tokenized money market funds is not in portfolio construction but in operations: same assets, new plumbing.

The advantage will go to institutions that connect real-time blockchain execution with existing balance-sheet governance, turning static cash into programmable collateral.

For custodians, asset managers and corporate treasurers, the question is no longer whether funds will tokenize, but which register model will anchor institutional liquidity at scale. Which do you think wins: native on-chain or mirrored?