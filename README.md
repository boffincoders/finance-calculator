# finance-calculator-pro

[![NPM Version](https://img.shields.io/npm/v/finance-calculator-pro.svg)](https://www.npmjs.com/package/finance-calculator-pro)
[![NPM Downloads](https://img.shields.io/npm/dm/finance-calculator-pro.svg)](https://www.npmjs.com/package/finance-calculator-pro)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg)](https://www.npmjs.com/package/finance-calculator-pro?activeTab=dependencies)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

📖 **[View the Official Documentation & Live Playground →](https://boffincoders.github.io/finance-calculator/)**

![finance-calculator-pro banner](https://raw.githubusercontent.com/boffincoders/finance-calculator/refs/heads/master/.github/assets/finance-calculator-pro.png)

> **Zero-dependency financial analysis engine for JavaScript and TypeScript.**
> Calculate 70+ financial metrics — valuation ratios, profitability, liquidity, solvency, efficiency, intrinsic value, composite scoring, TTM aggregation, historical analysis, and bankruptcy risk scores — from raw financial data. No API calls. No runtime dependencies. Works in Node.js, browsers, and edge runtimes.

---

## What is finance-calculator-pro?

`finance-calculator-pro` is a modular financial metrics library that transforms raw company fundamentals (income statement, balance sheet, cash flow data) into structured analysis — complete with computed values, signal ratings (`Good` / `Bad` / `Neutral`), and human-readable insights.

Built for:
- 📊 **Stock screener** and equity research tools
- 💼 **Portfolio analysis** dashboards
- 🏦 **FinTech applications** and investment platforms
- 🔍 **Fundamental analysis** pipelines (pairs naturally with [`yahoo-finance2`](https://www.npmjs.com/package/yahoo-finance2))
- 🎓 **Financial education** tools and calculators

---

## Installation

```bash
npm install finance-calculator-pro
# or
yarn add finance-calculator-pro
# or
pnpm add finance-calculator-pro
```

Works with **Node.js ≥ 16**. Ships as **CJS + ESM + TypeScript type declarations**. Zero runtime dependencies.

---

## 🏢 Enterprise Support & FinTech Development

**finance-calculator-pro** is engineered and maintained by **[Boffin Coders](https://boffincoders.com)**, a software development agency specialising in FinTech, financial dashboards, and enterprise-grade data platforms.

Building a stock screener, neo-bank, or internal financial analysis tool? [Let's talk →](https://boffincoders.com)

---

## Metrics Reference — 70+ Functions Across 11 Categories

### Valuation Ratios
| Metric | Function | Formula |
|---|---|---|
| Price-to-Earnings (P/E) | `pe()` | `Price / EPS` |
| Price-to-Book (P/B) | `pb()` | `Price / Book Value Per Share` |
| Price-to-Sales (P/S) | `ps()` | `Price / Revenue Per Share` |
| Price/Earnings-to-Growth (PEG) | `peg()` | `P/E / Earnings Growth Rate` |
| EV/EBITDA (Enterprise Multiple) | `evEbitda()` | `Enterprise Value / EBITDA` |
| EV / Revenue | `evRevenue()` | `Enterprise Value / Revenue` |
| EV / Free Cash Flow | `evFcf()` | `Enterprise Value / FCF` |
| Price-to-Cash-Flow (P/CF) | `priceToCashFlow()` | `Market Cap / Operating Cash Flow` |
| Earnings Yield | `earningsYield()` | `EPS / Price` |
| Dividend Yield | `dividendYield()` | `Annual Dividend / Price` |
| Discounted Cash Flow (DCF) | `calculateDCF()` | Terminal value + discounted FCF streams |
| Graham Number | `grahamNumber()` | `√(22.5 × EPS × Book Value)` |
| Market Cap to Total Capital | `marketCapToDebtCap()` | `Market Cap / (Market Cap + Total Debt)` |

### Profitability Metrics
| Metric | Function | Formula |
|---|---|---|
| Return on Assets (ROA) | `roa()` | `Net Income / Total Assets` |
| Return on Equity (ROE) | `roe()` | `Net Income / Total Equity` |
| Return on Invested Capital (ROIC) | `roic()` | `NOPAT / Invested Capital` |
| Gross Margin | `grossMargin()` | `Gross Profit / Revenue` |
| Operating Margin | `operatingMargin()` | `Operating Income / Revenue` |
| Net Profit Margin | `netProfitMargin()` | `Net Income / Revenue` |
| Free Cash Flow Margin | `fcfMargin()` | `FCF / Revenue` |

### Liquidity Ratios
| Metric | Function | Formula |
|---|---|---|
| Current Ratio | `currentRatio()` | `Current Assets / Current Liabilities` |
| Quick Ratio (Acid-Test) | `quickRatio()` | `(Current Assets − Inventory) / Current Liabilities` |
| Debt-to-Equity | `debtToEquity()` | `Total Debt / Total Equity` |
| Interest Coverage Ratio | `interestCoverage()` | `EBIT / Interest Expense` |

### Solvency & Leverage Metrics
| Metric | Function | Formula |
|---|---|---|
| Net Debt | `netDebt()` | `Total Debt − Cash & Equivalents` |
| Net Debt / EBITDA | `netDebtToEbitda()` | `(Debt − Cash) / EBITDA` |
| Debt-to-Assets | `debtToAssets()` | `Total Debt / Total Assets` |

### Efficiency Metrics
| Metric | Function | Formula |
|---|---|---|
| Asset Turnover | `assetTurnover()` | `Revenue / Average Assets` |
| Inventory Turnover | `inventoryTurnover()` | `COGS / Average Inventory` |
| Receivables Turnover | `receivablesTurnover()` | `Revenue / Trade Receivables` |
| Days Sales Outstanding (DSO) | `daysSalesOutstanding()` | `365 / Receivables Turnover` |
| Payable Days (DPO) | `payableDays()` | `(Trade Payables / COGS) × 365` |
| Working Capital Days | `workingCapitalDays()` | `(Working Capital / Revenue) × 365` |
| Cash Conversion Cycle | `cashConversionCycle()` | `DSO + DIO − DPO` |

### Earnings Quality Metrics
| Metric | Function | Formula |
|---|---|---|
| Payout Ratio | `payoutRatio()` | `Annual Dividend / EPS` |
| Cash Conversion Ratio (CCR) | `cashConversionRatio()` | `Operating Cash Flow / Net Income` |

### Risk & Bankruptcy Prediction
| Metric | Function | Notes |
|---|---|---|
| Altman Z-Score | `altmanZScore()` | Z > 2.99 = safe, 1.81–2.99 = grey zone, < 1.81 = distress |
| Piotroski F-Score | `piotroski()` | 9-signal scorecard; 8–9 = strong, 0–2 = weak |
| Sharpe Ratio | `sharpe()` | Risk-adjusted return vs risk-free rate |
| Target Upside | `targetUpside()` | % gap to analyst target price |

### Intrinsic Valuation & Scoring
| Metric | Function | Notes |
|---|---|---|
| Graham Number | `grahamNumber()` | Benjamin Graham's defensive value ceiling |
| Net Current Value Per Share | `computeNCVPS()` | (Current Assets − Total Liabilities) / Shares |
| Intrinsic Value Estimate | `computeIntrinsicValue()` | Simple 5-yr EPS projection with margin of safety |
| G-Factor (Composite) | `computeGFactor()` | Quality×40% + Growth×35% + Momentum×25% |
| Quality Score | `computeQualityScore()` | Piotroski + ROE vs sector + margins + pledge + promoter |
| Growth Score | `computeGrowthScore()` | Revenue growth + profit growth + EPS growth + CFO |
| Value Score | `computeValueScore()` | P/E vs avg + P/B vs sector + PEG + historical percentile |
| Momentum Score | `computeMomentumScore()` | SMA200 + RSI + ADX + volume ratio + ROC-125 |

### Growth & Timeseries Analysis
| Function | Description |
|---|---|
| `calculateGrowthRate()` | Single-period % growth rate |
| `yoyGrowth()` | Year-over-year growth rates for a series |
| `qoqGrowth()` | Quarter-over-quarter growth rates |
| `cagr()` | Compound Annual Growth Rate |
| `medianGrowth()` | Median YoY growth rate (outlier-resistant) |

### TTM & Historical Aggregation
| Function | Description |
|---|---|
| `computeTTM()` | Trailing Twelve Months sum (last 4 quarters) |
| `computeTTMAvg()` | Trailing Twelve Months average |
| `computeNYearAverage()` | Rolling N-year average of quarterly data |
| `computeNYearSum()` | Rolling N-year sum of quarterly data |
| `computeHistoricalPoint()` | Value at exactly N quarters back |



---

## Quick Start

### The All-in-One API: `analyzeCompany()`

Pass any subset of a company's fundamentals and get structured analysis across all 7 categories at once:

```typescript
import { analyzeCompany } from 'finance-calculator-pro';

const data = {
  price: 150,
  eps: 5,
  bookValuePerShare: 20,
  marketCap: 150000,
  totalDebt: 20000,
  cashAndEquivalents: 5000,
  ebitda: 9000,
  netIncome: 5000,
  operatingCashFlow: 7500,
  totalRevenue: 50000,
  totalAssets: 100000,
  totalLiabilities: 60000,
  totalEquity: 40000,
};

// withInsights: true → returns { value, status, insight } for every metric
const analysis = analyzeCompany(data, true);

// Valuation
console.log(analysis.valuation.pe);
// { value: 30, status: "Bad", insight: "Expensive. High growth is priced in." }

console.log(analysis.valuation.evEbitda);
// { value: 18.33, status: "Bad", insight: "Expensive relative to cash earnings." }

// Solvency
console.log(analysis.solvency.netDebtToEbitda);
// { value: 1.5, status: "Good", insight: "Low leverage. Manageable debt load." }

// Earnings Quality
console.log(analysis.quality.cashConversionRatio);
// { value: 1.5, status: "Good", insight: "Cash-backed earnings. Strong quality." }

// Risk
console.log(analysis.risk.altmanZScore);
// { value: 3.71, status: "Good", insight: "Safe zone. Low bankruptcy risk." }
```

Returns 7 analysis categories: `valuation` · `profitability` · `liquidity` · `solvency` · `efficiency` · `risk` · `quality`

Every field in the input is **optional** — missing fields cause their dependent metrics to return `null` safely. The engine never throws.

---

### Categorical Analyzers

Run analysis on a single dimension — useful for dashboards, screeners, or compute-sensitive environments:

```typescript
import {
  analyzeValuation,
  analyzeProfitability,
  analyzeLiquidity,
  analyzeSolvency,
  analyzeEfficiency,
  analyzeRisk,
  analyzeQuality,
} from 'finance-calculator-pro';

const solvency = analyzeSolvency(data, true);
console.log(solvency.netDebtToEbitda);
// { value: 1.5, status: "Good", insight: "..." }

const quality = analyzeQuality(data, true);
console.log(quality.cashConversionRatio);
// { value: 1.5, status: "Good", insight: "Cash-backed earnings. Strong quality." }
```

---

### Batch Analysis — Stock Screener

Evaluate an entire watchlist in one call:

```typescript
import { analyzeBatch } from 'finance-calculator-pro';

const results = analyzeBatch([appleData, msftData, nvidiaData, tcsData], true);

// Sort by P/E ascending — cheapest first
const byPe = results
  .filter(r => r.valuation.pe?.value !== null)
  .sort((a, b) => (a.valuation.pe!.value as number) - (b.valuation.pe!.value as number));
```

---

### Timeseries & Growth Trend Analysis

Pass chronological arrays (oldest → newest) to compute growth rates and margin trends automatically:

```typescript
import { analyzeFundamentalTrends } from 'finance-calculator-pro';

const trends = analyzeFundamentalTrends({
  revenue:   [365_817, 394_328, 383_285],
  netIncome: [ 94_680,  99_803,  96_995],
}, 'annual');

console.log(trends.growth.revenueCagr);       // -0.022  (-2.2% CAGR)
console.log(trends.growth.revenueGrowth);     // [0.0777, -0.0282]
console.log(trends.margins.netProfitMargin);  // [0.259, 0.253, 0.253]
console.log(trends.quality.fcfConversion);    // FCF / Net Income per period
```

---

### Individual Math Functions

Import any function directly for lightweight single-metric use. Every function returns `number | null` — `null` means a required input was absent; the library never throws:

```typescript
import {
  // Valuation
  pe, pb, ps, peg, evEbitda, evRevenue, evFcf,
  priceToCashFlow, earningsYield, grahamNumber, calculateDCF,
  marketCapToDebtCap,

  // Profitability
  roa, roe, roic, grossMargin, operatingMargin, netProfitMargin, fcfMargin,

  // Liquidity
  currentRatio, quickRatio, debtToEquity, interestCoverage,

  // Solvency
  netDebt, netDebtToEbitda, debtToAssets,

  // Efficiency
  assetTurnover, inventoryTurnover, receivablesTurnover, daysSalesOutstanding,
  payableDays, workingCapitalDays, cashConversionCycle,

  // Quality
  payoutRatio, cashConversionRatio,

  // Risk
  altmanZScore, piotroski, sharpe, targetUpside,

  // Intrinsic Valuation
  computeNCVPS, computeGFactor, computeIntrinsicValue,

  // Composite Scoring
  computeQualityScore, computeGrowthScore, computeValueScore, computeMomentumScore,

  // Growth
  calculateGrowthRate, yoyGrowth, qoqGrowth, cagr, medianGrowth,

  // TTM
  computeTTM, computeTTMAvg,

  // Historical
  computeNYearAverage, computeNYearSum, computeHistoricalPoint,

  // Insights Engine
  evaluate,
} from 'finance-calculator-pro';

// Valuation
pe(150, 5);                               // → 30
priceToCashFlow(150_000, 7_000);          // → 21.43
earningsYield(5, 150);                    // → 0.0333 (3.33%)
grahamNumber(5, 20);                      // → 47.43
marketCapToDebtCap(150_000, 20_000);      // → 0.882 (88.2% equity financed)

// Solvency
netDebtToEbitda(20_000, 5_000, 10_000);   // → 1.5
debtToAssets(20_000, 100_000);            // → 0.20

// Efficiency
daysSalesOutstanding(50_000, 6_250);      // → 45.6 days
payableDays(30_000, 200_000);             // → 54.75 days
cashConversionCycle(45, 60, 55);          // → 50 days

// Risk
altmanZScore(15_000, 20_000, 7_500, 250_000, 50_000, 100_000, 60_000); // → 3.71
sharpe(0.12, 0.04, 0.15);                 // → 0.533

// Piotroski F-Score
const result = piotroski({
  netIncome: 5_000, totalAssets: 100_000, operatingCashFlow: 7_000,
  priorNetIncome: 4_000, priorTotalAssets: 100_000,
});
result.score;     // → 4
result.maxScore;  // → 5

// Intrinsic Valuation
computeNCVPS(500_000, 300_000, 100_000);  // → 2.00 (net current value per share)
computeIntrinsicValue(10, 0.15, 0.25);    // → 5-yr EPS projection with 25% safety margin
computeGFactor(82, 78, 67);               // → composite G-Factor score

// Composite Scoring
computeQualityScore({ piotroskiScore: 7, roeVsSector: 1.1,
  marginsImproving: true, pledgeFree: true, promoterStable: true }); // → 82
computeGrowthScore({ revenueGrowthVsSector: 1.3, profitGrowthRate: 0.20,
  epsGrowthRate: 0.18, cfoPositive: true, revenueAccelerating: true }); // → 78
computeValueScore({ peVs3yrAvg: 0.8, pbVsSector: 0.75, peg: 0.9,
  historicalPePercentile: 30 }); // → 72
computeMomentumScore({ priceVsSma200: 1.08, rsi: 58, adx: 28,
  volumeRatio: 1.2, roc125: 0.18 }); // → 67

// TTM Aggregation
const quarters = [2200, 2400, 2600, 2800]; // Q1–Q4 revenue
computeTTM(quarters);     // → 10000  (annualised TTM)
computeTTMAvg(quarters);  // → 2500   (average quarterly)

// Historical Analysis
const qData = [2000, 2200, 2400, 2600, 2800, 3000, 3200, 3400];
computeNYearAverage(qData, 2);     // → 2700  (2-year average)
computeNYearSum(qData, 1);         // → 12400 (last 4 quarters sum)
computeHistoricalPoint(qData, 4);  // → 2600  (same quarter last year)

// Growth
cagr(1000, 2000, 5);                                       // → 0.1487 (14.87%)
medianGrowth([800, 900, 1100, 1050, 1300]);                // → 0.176  (17.6%)

// Pair raw math with the Insights Engine
const ratio = pe(150, 5);  // → 30
evaluate.pe(ratio);
// { value: 30, status: "Bad", insight: "Expensive. High growth is priced in." }
```

---

### Works with any data source

`finance-calculator-pro` accepts plain numbers — no proprietary data format required. Feed it data from `yahoo-finance2`, Alpha Vantage, Financial Modeling Prep, Polygon.io, your own database, or manually entered values. If you can get the numbers, the engine handles the rest.

---

## TypeScript Support

Full type declarations included. All input fields are optional:

```typescript
import type { CompanySnapshotInput, FundamentalTimeseriesInput } from 'finance-calculator-pro';

const snapshot: CompanySnapshotInput = {
  price: 150,
  eps: 5,
  // Every field is optional — add only what you have
};
```

**`CompanySnapshotInput` fields:**

```typescript
interface CompanySnapshotInput {
  // Pricing
  price?: number;
  marketCap?: number;
  eps?: number;
  bookValuePerShare?: number;
  revenuePerShare?: number;
  annualDividendPerShare?: number;
  analystTargetPrice?: number;

  // Income Statement
  totalRevenue?: number;
  grossProfit?: number;
  operatingIncome?: number;
  netIncome?: number;
  freeCashFlow?: number;
  operatingCashFlow?: number;
  ebitda?: number;
  ebit?: number;
  costOfRevenue?: number;
  interestExpense?: number;
  expectedEarningsGrowthRate?: number;

  // Balance Sheet
  totalAssets?: number;
  totalLiabilities?: number;
  totalEquity?: number;
  totalDebt?: number;
  longTermDebt?: number;
  cashAndEquivalents?: number;
  inventory?: number;
  tradeReceivables?: number;
  workingCapital?: number;
  retainedEarnings?: number;
  sharesOutstanding?: number;
  taxRate?: number;

  // Risk / Portfolio
  returns?: number;
  riskFree?: number;
  stdDev?: number;
}
```

---

## API Summary

| Function | Category | Description |
|---|---|---|
| `analyzeCompany(data, insights?)` | All-in-one | All 7 categories at once |
| `analyzeValuation(data, insights?)` | Valuation | P/E, P/B, P/S, PEG, EV/EBITDA, Graham, P/CF, EY, EV/Rev, EV/FCF |
| `analyzeProfitability(data, insights?)` | Profitability | ROA, ROE, ROIC, all margins |
| `analyzeLiquidity(data, insights?)` | Liquidity | Current, Quick, D/E, Interest Coverage |
| `analyzeSolvency(data, insights?)` | Solvency | Net Debt, Net Debt/EBITDA, Debt/Assets |
| `analyzeEfficiency(data, insights?)` | Efficiency | Asset Turnover, Inventory, Receivables, DSO, Payable Days, WC Days, CCC |
| `analyzeRisk(data, insights?)` | Risk | Altman Z-Score, Sharpe, Piotroski F-Score |
| `analyzeQuality(data, insights?)` | Quality | Payout Ratio, Cash Conversion Ratio |
| `analyzeBatch(dataArray, insights?)` | Batch | Array of snapshots → array of analyses |
| `analyzeFundamentalTrends(data, period)` | Timeseries | YoY/QoQ growth, CAGR, margin trends |

---

## Why finance-calculator-pro?

| Feature | finance-calculator-pro |
|---|---|
| Dependencies | **Zero** |
| Bundle size | **< 50 KB** (tree-shakeable) |
| TypeScript | **Full types included** |
| Return type | `number \| null` (never throws) |
| Insights engine | **Built-in** (value + status + insight) |
| Batch processing | **Yes** |
| Timeseries / growth | **Yes** |
| Browser / Edge compatible | **Yes** |
| ESM + CJS | **Both** |

---

## License

MIT © [Boffin Coders](https://boffincoders.com)

---

## Keywords

financial ratios · stock analysis · fundamental analysis · valuation metrics · P/E ratio · price-to-earnings · price-to-book · EV/EBITDA · enterprise value · DCF · discounted cash flow · Graham number · Altman Z-Score · Piotroski F-Score · Sharpe ratio · ROE · ROA · ROIC · profit margin · liquidity ratio · debt-to-equity · solvency · current ratio · quick ratio · asset turnover · days sales outstanding · payout ratio · cash conversion ratio · earnings yield · stock screener · investment analysis · equity analysis · portfolio analysis · FinTech · financial calculator · TypeScript · JavaScript · Node.js
