# finance-calculator

A highly modular, fully independent fundamental financial calculation engine. Whether you're building a stock screener or tracking your portfolio, this library calculates the metrics tracking a company's valuation, profitability, liquidity, efficiency, and risk flawlessly.

It accepts raw numeric data—no dependency on heavy financial APIs. It pairs amazingly well with normalized data structures (like those from `yahoo-finance2`), or simply your own math.

## Installation

```bash
npm install finance-calculator
```

---

## Complete List of Available Metrics

The engine can calculate the following metrics natively from basic fundamental variables:

### 🏦 Valuation
- **Price-to-Earnings (P/E)**: `price / eps`
- **Price-to-Book (P/B)**: `price / bookValuePerShare`
- **Price-to-Sales (P/S)**: `price / revenuePerShare`
- **Price/Earnings-to-Growth (PEG)**: `pe / expectedEarningsGrowthRate`
- **Enterprise Multiple (EV/EBITDA)**: `enterpriseValue / ebitda`
- **Dividend Yield**: `annualDividendPerShare / price`
- **Discounted Cash Flow (DCF)**: Calculates Enterprise Present Value from terminal rates and sequential FCFs.
- **Graham Number**: `sqrt(22.5 * eps * bookValuePerShare)`

### 📈 Profitability
- **Return on Assets (ROA)**: `netIncome / totalAssets`
- **Return on Equity (ROE)**: `netIncome / totalEquity`
- **Return on Invested Capital (ROIC)**: `nopat / investedCapital`
- **Gross Margin**: `grossProfit / revenue`
- **Operating Margin**: `operatingIncome / revenue`
- **Net Profit Margin**: `netIncome / revenue`
- **Free Cash Flow Margin**: `fcf / revenue`

### 💧 Liquidity & Solvency
- **Current Ratio**: `totalAssets / totalLiabilities` (Using broader snapshot)
- **Quick Ratio**: `(totalAssets - inventory) / totalLiabilities`
- **Debt-to-Equity**: `totalDebt / totalEquity`
- **Interest Coverage**: `ebit / interestExpense`

### ⚙️ Efficiency
- **Asset Turnover**: `revenue / totalAssets`
- **Inventory Turnover**: `costOfRevenue / inventory`

### ⚠️ Risk & Insights
- **Altman Z-Score**: Fundamental bankruptcy risk predictor combining 5 variables.
- **Sharpe Ratio**: ROI vs Risk-free rate adjusted for standard deviation.
- **Target Upside**: `%` potential from current `price` to `analystTargetPrice`.

### 📊 Growth (Timeseries)
- **YoY / QoQ Growth Rates**: Automatically tracks sequential growth of Revenue, Net Income, EPS, and Cash Flows.
- **CAGR**: Compound Annual Growth Rate over multi-period arrays.

---

## 🏗 Data Inputs: What the API Accepts

To use the massive aggregator functions (like `analyzeCompany` or `analyzeValuation`), you just pass an object of shape `CompanySnapshotInput`. 

**EVERY FIELD IS OPTIONAL**. If you omit a field, the engine simply skips the metric that calculates it and safely returns `null` for that metric!

### `CompanySnapshotInput` (Used for Snapshot Analyzers)
```typescript
interface CompanySnapshotInput {
  price?: number;
  marketCap?: number;
  totalRevenue?: number;
  grossProfit?: number;
  operatingIncome?: number;
  netIncome?: number;
  freeCashFlow?: number;
  eps?: number;
  bookValuePerShare?: number;
  revenuePerShare?: number;
  totalAssets?: number;
  totalLiabilities?: number;
  totalEquity?: number;
  totalDebt?: number;
  cashAndEquivalents?: number;
  inventory?: number;
  interestExpense?: number;
  costOfRevenue?: number;
  annualDividendPerShare?: number;
  expectedEarningsGrowthRate?: number;
  ebitda?: number;
  workingCapital?: number;
  retainedEarnings?: number;
  ebit?: number;
  taxRate?: number;
  returns?: number; // for sharpe
  riskFree?: number; // for sharpe
  stdDev?: number; // for sharpe
  analystTargetPrice?: number;
}
```

### `FundamentalTimeseriesInput` (Used for Trend Analyzers)
These metrics look at arrays chronologically from **oldest** to **newest**.
```typescript
interface FundamentalTimeseriesInput {
  revenue: number[];
  netIncome: number[];
  costOfRevenue?: number[];
  operatingIncome?: number[];
  freeCashFlow?: number[];
  eps?: number[];
}
```

---

## 🛠 Complete Usage Guide

### 1. The Super Analyzer: `analyzeCompany`
Pass your raw snapshot of a company, and let the engine derive everything at once. Setting `withInsights = true` will automatically translate numbers into human-readable recommendations ("Good", "Bad", "Neutral").

```typescript
import { analyzeCompany } from 'finance-calculator';

// You ONLY need to provide the fields you care about!
const rawData = {
  price: 150,
  eps: 5, 
  bookValuePerShare: 20,
  marketCap: 150000,
  totalDebt: 20000,
  cashAndEquivalents: 5000,
  netIncome: 5000,
  totalAssets: 100000,
  totalLiabilities: 60000,
  totalEquity: 40000,
};

// With Insights (Best for Beginners & UI)
const insightAnalysis = analyzeCompany(rawData, true);

console.log(JSON.stringify(insightAnalysis.valuation, null, 2)); 
/* 
{
  "pe": {
    "value": 30,
    "status": "Bad",
    "insight": "Expensive. High growth is priced in."
  },
  "pb": {
    "value": 7.5,
    "status": "Bad",
    "insight": "Trading at a high premium to book value."
  },
  "ps": {
    "value": null,
    "status": "N/A",
    "insight": "Sales data unavailable."
  }
}
*/
```

### 2. Categorical Evaluation
If you only want to process a specific category instead of all metrics at once, you can explicitly call categorical analyzers! They accept the exact same `CompanySnapshotInput`.

Available Categorical Analyzers:
- `analyzeValuation(data, withInsights?)`
- `analyzeProfitability(data, withInsights?)`
- `analyzeLiquidity(data, withInsights?)`
- `analyzeEfficiency(data, withInsights?)`
- `analyzeRisk(data, withInsights?)`

```typescript
import { analyzeProfitability } from 'finance-calculator';

const profitabilityMetrics = analyzeProfitability(rawData, true);
console.log(profitabilityMetrics.roe.insight); // "Strong return on shareholder equity."
```

### 3. Individual Metric Insights
If you only need to calculate and evaluate a **single metric** (like P/E), you can combine the pure math modules directly with the `evaluate` engine to get insights without building a full company snapshot!

```typescript
import { pe, evaluate } from 'finance-calculator';

// 1. Calculate the raw numerical value
const ratio = pe(150 /* price */, 5 /* eps */); // -> 30

// 2. Pass it natively to the Evaluator for automated context
const insight = evaluate.pe(ratio);

console.log(JSON.stringify(insight, null, 2));
/*
{
  "value": 30,
  "status": "Bad",
  "insight": "Expensive. High growth is priced in."
}
*/
```

### 4. Batch Analysis (Screening)
Evaluate hundreds of companies seamlessly in a single line.

```typescript
import { analyzeBatch } from 'finance-calculator';

const multipleCompanies = [ company1, company2, company3 ];
const batchResults = analyzeBatch(multipleCompanies, true);
```

### 5. Timeseries / Trend Analysis
Pass arrays of data (oldest to newest) to get automated sequential growth rates and historical margins over time.

```typescript
import { analyzeFundamentalTrends } from 'finance-calculator';

const timeseriesData = {
  revenue: [40000, 45000, 50000],
  netIncome: [4000, 5000, 6000]
};

// Pass "annual" or "quarterly" depending on data density
const trends = analyzeFundamentalTrends(timeseriesData, "annual");

console.log(JSON.stringify(trends, null, 2)); 
/*
{
  "periodType": "annual",
  "growth": {
    "revenueGrowth": [0.125, 0.111111],
    "netIncomeGrowth": [0.25, 0.20],
    "revenueCagr": 0.118,
    "netIncomeCagr": 0.224
  },
  "margins": {
    "netMargins": [0.1, 0.111, 0.12]
  }
}
*/
```

### 6. Individual Mathematical Metrics (API Reference)
Because this is fundamentally a generic node package, if you only need a single lightweight calculation without any object-mapping overhead, you can import and execute the mathematical functions directly.

Every function returns a `number | null` (returning `null` implicitly if any division goes to zero or infinity, guaranteeing runtime safety).

#### Valuation
```typescript
import { pe, pb, ps, peg, evEbitda, calculateEnterpriseValue, dividendYield, calculateDCF } from 'finance-calculator';

pe(150 /* price */, 5 /* eps */); // -> 30
pb(150 /* price */, 20 /* bookValuePerShare */); // -> 7.5
ps(150 /* price */, 50 /* revenuePerShare */); // -> 3
peg(30 /* peRatio */, 0.15 /* earningsGrowthRate */); // -> 200
calculateEnterpriseValue(150000 /* marketCap */, 20000 /* debt */, 5000 /* cash */); // -> 165000
evEbitda(165000 /* enterpriseValue */, 10000 /* ebitda */); // -> 16.5
dividendYield(1.5 /* annualDividendPerShare */, 150 /* price */); // -> 0.01 (1%)

// DCF Example
calculateDCF(
  [3000, 3500, 4000, 4500, 5000] /* projectedFCF */, 
  0.10 /* discountRateWACC */, 
  0.025 /* terminalGrowthRate */
); 
```

#### Profitability
```typescript
import { roa, roe, roic, grossMargin, operatingMargin, netProfitMargin, fcfMargin } from 'finance-calculator';

roa(5000 /* netIncome */, 100000 /* totalAssets */); // -> 0.05
roe(5000 /* netIncome */, 40000 /* totalEquity */); // -> 0.125
roic(7000 /* operatingIncome */, 0.2 /* taxRate */, 20000 /* debt */, 40000 /* equity */, 5000 /* cash */); // -> 0.1018

// Margins
grossMargin(50000 /* revenue */, 20000 /* costOfRevenue */); // -> 0.60
operatingMargin(7000 /* operatingIncome */, 50000 /* revenue */); // -> 0.14
netProfitMargin(5000 /* netIncome */, 50000 /* revenue */); // -> 0.10
fcfMargin(3000 /* freeCashFlow */, 50000 /* revenue */); // -> 0.06
```

#### Liquidity
```typescript
import { currentRatio, quickRatio, debtToEquity, interestCoverage } from 'finance-calculator';

currentRatio(100000 /* currentAssets */, 60000 /* currentLiabilities */); // -> 1.66
quickRatio(100000 /* currentAssets */, 10000 /* inventory */, 60000 /* currentLiabilities */); // -> 1.5
debtToEquity(20000 /* totalDebt */, 40000 /* totalEquity */); // -> 0.5
interestCoverage(7500 /* ebit */, 500 /* interestExpense */); // -> 15
```

#### Efficiency
```typescript
import { assetTurnover, inventoryTurnover } from 'finance-calculator';

assetTurnover(50000 /* revenue */, 100000 /* averageTotalAssets */); // -> 0.5
inventoryTurnover(20000 /* costOfRevenue */, 10000 /* averageInventory */); // -> 2.0
```

#### Risk & Insights
```typescript
import { altmanZScore, sharpe, targetUpside, grahamNumber } from 'finance-calculator';

// Altman Z-Score
altmanZScore(
  15000  /* workingCapital */, 
  20000  /* retainedEarnings */, 
  7500   /* ebit */, 
  150000 /* marketValueEquity */, 
  50000  /* sales */, 
  100000 /* totalAssets */, 
  60000  /* totalLiabilities */
); // -> 2.707

sharpe(0.12 /* return */, 0.04 /* riskFree */, 0.15 /* stdDev */); // -> 0.533
targetUpside(150 /* currentPrice */, 180 /* targetPrice */); // -> 0.20 (20% upside)
grahamNumber(5 /* eps */, 20 /* bookValuePerShare */); // -> 47.43
```

#### Timeseries / Growth Trends
The growth modules return chronological arrays representing growth from the previous period. For $N$ inputs, they return an array of length $N-1$.

```typescript
import { calculateGrowthRate, yoyGrowth, qoqGrowth, cagr } from 'finance-calculator';

// Base YoY historical array mapping
yoyGrowth([40000, 45000, 50000] /* chronologicalDataPoints */); // -> [0.125, 0.1111]

// Base QoQ trailing historical array mapping
qoqGrowth([10000, 10500, 12000, 11000] /* chronologicalDataPoints */); // -> [0.05, 0.1428, -0.0833]

// CAGR (Beginning Value, Ending Value, Periods)
cagr(40000 /* beginningValue */, 50000 /* endingValue */, 2 /* periods */); // -> 0.118 (11.8%)
```
