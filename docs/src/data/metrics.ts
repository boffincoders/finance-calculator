import {
  pe, pb, ps, peg, evEbitda, dividendYield, calculateDCF, grahamNumber,
  priceToCashFlow, earningsYield, evRevenue, evFcf,
  roa, roe, roic, grossMargin, operatingMargin, netProfitMargin, fcfMargin,
  currentRatio, quickRatio, debtToEquity, interestCoverage,
  netDebt, netDebtToEbitda, debtToAssets,
  assetTurnover, inventoryTurnover, receivablesTurnover, daysSalesOutstanding,
  payoutRatio, cashConversionRatio,
  altmanZScore, sharpe, targetUpside, piotroski,
  evaluate
} from 'finance-calculator-pro';

export interface MetricDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  history: string;
  formula: string;
  benchmark?: string;
  inputs: { key: string; label: string; min: number; max: number; step: number; default: number; prefix?: string }[];
  calculate: (inputs: any) => number | null | any;
  evaluateInsight: (val: number | null | any) => any;
}

export const metricsData: Record<string, MetricDefinition> = {
  // --- VALUATION ---
  'pe': {
    id: 'pe', name: 'Price-to-Earnings (P/E)', category: 'Valuation',
    description: 'Measures a company\'s current share price relative to its per-share earnings.',
    history: 'Popularized by Benjamin Graham, the P/E ratio is the most widely used valuation metric. It tells investors how much they are paying for $1 of earnings.',
    formula: 'P/E = Price / EPS',
    benchmark: '< 15 = value territory · 15–25 = fairly priced · > 25 = growth premium. High-growth sectors (tech, biotech) routinely trade at 40–60×.',
    inputs: [
      { key: 'price', label: 'Share Price', min: 1, max: 10000, step: 1, default: 150, prefix: '$' },
      { key: 'eps', label: 'Earnings Per Share (EPS)', min: -100, max: 1000, step: 0.1, default: 5, prefix: '$' }
    ],
    calculate: (inputs) => pe(inputs.price, inputs.eps),
    evaluateInsight: evaluate.pe
  },
  'pb': {
    id: 'pb', name: 'Price-to-Book (P/B)', category: 'Valuation',
    description: 'Compares a firm\'s market capitalization to its book value.',
    history: 'Essential for value investors, it shows how much equity investors are paying for the net assets of a company. A P/B under 1 often signifies deep value.',
    formula: 'P/B = Price / Book Value Per Share',
    benchmark: '< 1.0 often signals deep value — you\'re buying assets below replacement cost. Graham recommended ≤ 1.5 for defensive investing. Asset-light businesses (software, services) naturally trade at 5–20×.',
    inputs: [
        { key: 'price', label: 'Share Price', min: 1, max: 10000, step: 1, default: 150, prefix: '$' },
        { key: 'bookValuePerShare', label: 'Book Value Per Share', min: -50, max: 500, step: 0.1, default: 20, prefix: '$' }
    ],
    calculate: (inputs) => pb(inputs.price, inputs.bookValuePerShare),
    evaluateInsight: evaluate.pb
  },
  'ps': {
    id: 'ps', name: 'Price-to-Sales (P/S)', category: 'Valuation',
    description: 'Compares a company\'s stock price to its revenues.',
    history: 'Crucial for evaluating young, high-growth companies that are not yet profitable but have strong top-line revenue growth.',
    formula: 'P/S = Price / Revenue Per Share',
    inputs: [
        { key: 'price', label: 'Share Price', min: 1, max: 10000, step: 1, default: 150, prefix: '$' },
        { key: 'revenuePerShare', label: 'Revenue Per Share', min: 0, max: 1000, step: 1, default: 50, prefix: '$' }
    ],
    calculate: (inputs) => ps(inputs.price, inputs.revenuePerShare),
    evaluateInsight: evaluate.ps
  },
  'peg': {
    id: 'peg', name: 'PEG Ratio', category: 'Valuation',
    description: 'The P/E ratio adjusted for earnings growth.',
    history: 'Popularized by Peter Lynch, the PEG ratio improves on the P/E ratio by factoring in the expected growth rate.',
    formula: 'PEG = PE Ratio / Earnings Growth Rate',
    inputs: [
        { key: 'peRatio', label: 'PE Ratio', min: 1, max: 500, step: 1, default: 25 },
        { key: 'earningsGrowthRate', label: 'Earnings Growth Rate (Decimal)', min: -0.5, max: 2, step: 0.01, default: 0.15 }
    ],
    calculate: (inputs) => peg(inputs.peRatio, inputs.earningsGrowthRate),
    evaluateInsight: evaluate.peg
  },
  'ev-ebitda': {
    id: 'ev-ebitda', name: 'EV/EBITDA', category: 'Valuation',
    description: 'Compares a company\'s total value to its cash earnings minus non-cash expenses.',
    history: 'Heavily used in private equity and mergers/acquisitions to value a business regardless of its capital structure.',
    formula: 'EV/EBITDA = Enterprise Value / EBITDA',
    benchmark: '< 10× is cheap; 10–15× is fairly valued for most industries; > 20× implies a strong growth or scarcity premium. Common M&A deal multiple for mature companies: 8–12×.',
    inputs: [
        { key: 'enterpriseValue', label: 'Enterprise Value', min: 1000, max: 5000000, step: 1000, default: 165000, prefix: '$' },
        { key: 'ebitda', label: 'EBITDA', min: -10000, max: 500000, step: 1000, default: 10000, prefix: '$' }
    ],
    calculate: (inputs) => evEbitda(inputs.enterpriseValue, inputs.ebitda),
    evaluateInsight: evaluate.evEbitda
  },
  'dcf': {
    id: 'dcf', name: 'Discounted Cash Flow (DCF)', category: 'Valuation',
    description: 'Estimates the value of an investment based on its expected future cash flows.',
    history: 'The gold standard of theoretical intrinsic valuation, computing the present value of all future cash generation.',
    formula: 'DCF = Sum(FCF / (1 + r)^t) + Terminal Value',
    inputs: [
        { key: 'fcf1', label: 'FCF Year 1', min: 0, max: 500000, step: 100, default: 3000, prefix: '$' },
        { key: 'fcf2', label: 'FCF Year 2', min: 0, max: 500000, step: 100, default: 3500, prefix: '$' },
        { key: 'fcf3', label: 'FCF Year 3', min: 0, max: 500000, step: 100, default: 4000, prefix: '$' },
        { key: 'discountRate', label: 'Discount Rate (WACC)', min: 0.01, max: 0.5, step: 0.01, default: 0.10 },
        { key: 'terminalGrowthRate', label: 'Terminal Growth Rate', min: 0.01, max: 0.1, step: 0.005, default: 0.025 }
    ],
    calculate: (inputs) => calculateDCF([inputs.fcf1, inputs.fcf2, inputs.fcf3], inputs.discountRate, inputs.terminalGrowthRate),
    evaluateInsight: (val) => ({ value: val, status: 'Neutral', insight: 'Intrinsic Enterprise Value. Compare strictly against current Market Cap + Debt to find upside.' })
  },
  'graham': {
    id: 'graham', name: 'Graham Number', category: 'Valuation',
    description: 'Identifies the max price a defensive investor should pay for a stock.',
    history: 'Created by Benjamin Graham ("the father of value investing" & Warren Buffett\'s mentor), it assumes a P/E under 15 and P/B under 1.5 is safe.',
    formula: '√(22.5 × EPS × Book Value Per Share)',
    inputs: [
        { key: 'eps', label: 'EPS', min: -10, max: 500, step: 1, default: 5, prefix: '$' },
        { key: 'bookValuePerShare', label: 'Book Value Per Share', min: -50, max: 500, step: 0.1, default: 20, prefix: '$' }
    ],
    calculate: (inputs) => grahamNumber(inputs.eps, inputs.bookValuePerShare),
    evaluateInsight: (val) => ({ value: val, status: 'Neutral', insight: 'Defensive Value limit. Do not pay more than this if you are a strict value investor.' })
  },
  'dividend': {
    id: 'dividend', name: 'Dividend Yield', category: 'Valuation',
    description: 'Shows how much a company pays out in dividends each year relative to its stock price.',
    history: 'A critical metric for income investors seeking cash flow directly from their equity holdings.',
    formula: 'Dividend Yield = Annual Dividend Per Share / Price',
    inputs: [
        { key: 'annualDividendPerShare', label: 'Annual Dividend', min: 0, max: 50, step: 0.1, default: 1.5, prefix: '$' },
        { key: 'price', label: 'Share Price', min: 1, max: 10000, step: 1, default: 150, prefix: '$' }
    ],
    calculate: (inputs) => dividendYield(inputs.annualDividendPerShare, inputs.price),
    evaluateInsight: evaluate.dividendYield
  },
  
  // --- PROFITABILITY ---
  'roa': {
    id: 'roa', name: 'Return on Assets (ROA)', category: 'Profitability',
    description: 'Indicator of how profitable a company is relative to its total assets.',
    history: 'A foundational metric created by DuPont in the 1920s to evaluate management efficiency in deploying assets to generate income.',
    formula: 'ROA = Net Income / Total Assets',
    benchmark: '> 5% is solid · > 10% is excellent. Capital-intensive sectors (banks, utilities) operate at 1–3% by design. Compare only within the same industry.',
    inputs: [
        { key: 'netIncome', label: 'Net Income', min: -100000, max: 1000000, step: 1000, default: 5000 },
        { key: 'totalAssets', label: 'Total Assets', min: 1000, max: 5000000, step: 1000, default: 100000 }
    ],
    calculate: (inputs) => roa(inputs.netIncome, inputs.totalAssets),
    evaluateInsight: evaluate.roa
  },
  'roe': {
    id: 'roe', name: 'Return on Equity (ROE)', category: 'Profitability',
    description: 'Measure of the profitability of a business in relation to the equity.',
    history: 'Loved by Warren Buffett, ROE specifically isolates how much profit management generates using the shareholders\' deployed capital.',
    formula: 'ROE = Net Income / Total Equity',
    benchmark: '> 15% is strong · > 20% is exceptional and Buffett\'s typical threshold for quality businesses. ROE inflated by high leverage (D/E > 2) should be discounted.',
    inputs: [
        { key: 'netIncome', label: 'Net Income', min: -100000, max: 1000000, step: 1000, default: 5000 },
        { key: 'totalEquity', label: 'Total Equity', min: 1000, max: 5000000, step: 1000, default: 40000 }
    ],
    calculate: (inputs) => roe(inputs.netIncome, inputs.totalEquity),
    evaluateInsight: evaluate.roe
  },
  'roic': {
    id: 'roic', name: 'Return on Invested Capital (ROIC)', category: 'Profitability',
    description: 'Assesses a company\'s efficiency at allocating the capital under its control to profitable investments.',
    history: 'Widely considered the ultimate metric of capital allocation strength, famously touted by Charlie Munger.',
    formula: 'ROIC = NOPAT / Invested Capital',
    inputs: [
        { key: 'operatingIncome', label: 'Operating Income', min: -50000, max: 500000, step: 1000, default: 7000 },
        { key: 'taxRate', label: 'Tax Rate', min: 0, max: 0.5, step: 0.01, default: 0.21 },
        { key: 'totalDebt', label: 'Total Debt', min: 0, max: 500000, step: 1000, default: 20000 },
        { key: 'totalEquity', label: 'Total Equity', min: 1000, max: 500000, step: 1000, default: 40000 },
        { key: 'cashAndEquivalents', label: 'Cash & Equivalents', min: 0, max: 500000, step: 1000, default: 5000 }
    ],
    calculate: (inputs) => roic(inputs.operatingIncome, inputs.taxRate, inputs.totalDebt, inputs.totalEquity, inputs.cashAndEquivalents),
    evaluateInsight: evaluate.roic
  },
  'gross-margin': {
    id: 'gross-margin', name: 'Gross Margin', category: 'Profitability',
    description: 'The percent of total sales revenue that the company retains after incurring the direct costs associated with producing the goods and services it sells.',
    history: 'The fundamental start of the income statement analysis indicating pricing power against core production costs.',
    formula: 'Gross Margin = (Revenue - Cost of Revenue) / Revenue',
    inputs: [
        { key: 'revenue', label: 'Total Revenue', min: 1000, max: 1000000, step: 1000, default: 50000 },
        { key: 'costOfRevenue', label: 'Cost of Revenue', min: 0, max: 1000000, step: 1000, default: 20000 }
    ],
    calculate: (inputs) => grossMargin(inputs.revenue, inputs.costOfRevenue),
    evaluateInsight: (val) => evaluate.margin(val, 'Gross Margin')
  },
  'operating-margin': {
    id: 'operating-margin', name: 'Operating Margin', category: 'Profitability',
    description: 'Measures how much profit a company makes on a dollar of sales after paying for variable costs of production.',
    history: 'A prime indicator of operational efficiency, excluding taxes and interest to focus purely on the core business.',
    formula: 'Operating Margin = Operating Income / Revenue',
    inputs: [
        { key: 'operatingIncome', label: 'Operating Income', min: -50000, max: 500000, step: 1000, default: 7000 },
        { key: 'revenue', label: 'Total Revenue', min: 1000, max: 1000000, step: 1000, default: 50000 }
    ],
    calculate: (inputs) => operatingMargin(inputs.operatingIncome, inputs.revenue),
    evaluateInsight: (val) => evaluate.margin(val, 'Operating Margin')
  },
  'net-margin': {
    id: 'net-margin', name: 'Net Profit Margin', category: 'Profitability',
    description: 'The percentage of revenue left after all expenses have been deducted from sales.',
    formula: 'Net Margin = Net Income / Total Revenue',
    history: 'The ultimate bottom-line metric indicating the overall efficiency of a company\'s cost structure.',
    inputs: [
        { key: 'netIncome', label: 'Net Income', min: -10000, max: 100000, step: 1000, default: 5000 },
        { key: 'revenue', label: 'Revenue', min: 1000, max: 500000, step: 1000, default: 50000 }
    ],
    calculate: (inputs) => netProfitMargin(inputs.netIncome, inputs.revenue),
    evaluateInsight: (val) => evaluate.margin(val, 'Net Margin')
  },
  'fcf-margin': {
    id: 'fcf-margin', name: 'Free Cash Flow Margin', category: 'Profitability',
    description: 'Measures what percentage of revenue is converted into free cash flow.',
    formula: 'FCF Margin = Free Cash Flow / Revenue',
    history: 'Preferred by institutional investors who believe "cash is king" and earnings can be manipulated.',
    inputs: [
        { key: 'freeCashFlow', label: 'Free Cash Flow', min: -10000, max: 100000, step: 1000, default: 3000 },
        { key: 'revenue', label: 'Revenue', min: 1000, max: 500000, step: 1000, default: 50000 }
    ],
    calculate: (inputs) => fcfMargin(inputs.freeCashFlow, inputs.revenue),
    evaluateInsight: (val) => evaluate.margin(val, 'FCF Margin')
  },

  // --- LIQUIDITY ---
  'current-ratio': {
    id: 'current-ratio', name: 'Current Ratio', category: 'Liquidity',
    description: 'Measures a company\'s ability to pay short-term obligations.',
    history: 'A classic bank-loan liquidity test to ensure the company has enough assets to cover liabilities over the next 12 months.',
    formula: 'Current Ratio = Total Assets / Total Liabilities',
    benchmark: '1.5–3.0 is the healthy range. Below 1.0 means current liabilities exceed current assets — a near-term liquidity warning. Above 3.0 may suggest underutilised assets.',
    inputs: [
        { key: 'totalAssets', label: 'Current Assets', min: 1000, max: 500000, step: 1000, default: 100000 },
        { key: 'totalLiabilities', label: 'Current Liabs', min: 1000, max: 500000, step: 1000, default: 60000 }
    ],
    calculate: (inputs) => currentRatio(inputs.totalAssets, inputs.totalLiabilities),
    evaluateInsight: evaluate.currentRatio
  },
  'quick-ratio': {
    id: 'quick-ratio', name: 'Quick Ratio', category: 'Liquidity',
    description: 'Also known as the Acid-Test Ratio, this tightens short-term liquidity evaluation by removing inventory.',
    history: 'A more stringent version of the Current Ratio used because inventory is often difficult to liquidate immediately in a crisis.',
    formula: 'Quick Ratio = (Current Assets - Inventory) / Current Liabilities',
    inputs: [
        { key: 'currentAssets', label: 'Current Assets', min: 1000, max: 500000, step: 1000, default: 100000 },
        { key: 'inventory', label: 'Inventory', min: 0, max: 200000, step: 1000, default: 10000 },
        { key: 'currentLiabilities', label: 'Current Liabs', min: 1000, max: 500000, step: 1000, default: 60000 }
    ],
    calculate: (inputs) => quickRatio(inputs.currentAssets, inputs.inventory, inputs.currentLiabilities),
    evaluateInsight: evaluate.quickRatio
  },
  'debt-to-equity': {
    id: 'debt-to-equity', name: 'Debt-to-Equity', category: 'Liquidity',
    description: 'Evaluates a company\'s financial leverage by dividing total liabilities by shareholder equity.',
    history: 'Crucial for understanding how a company is financing its operations—whether heavily reliant on debt or equity.',
    formula: 'D/E = Total Debt / Total Equity',
    benchmark: '< 1.0 is conservative · 1–2 is moderate · > 2 signals elevated financial risk. Capital-intensive industries (industrials, utilities) routinely operate at 2–4×.',
    inputs: [
        { key: 'totalDebt', label: 'Total Debt', min: 0, max: 1000000, step: 1000, default: 20000 },
        { key: 'totalEquity', label: 'Total Equity', min: 1000, max: 1000000, step: 1000, default: 40000 },
    ],
    calculate: (inputs) => debtToEquity(inputs.totalDebt, inputs.totalEquity),
    evaluateInsight: evaluate.debtToEquity
  },
  'interest-coverage': {
    id: 'interest-coverage', name: 'Interest Coverage Ratio', category: 'Liquidity',
    description: 'Measures how easily a company can pay interest on its outstanding debt.',
    history: 'Bondholders and lenders heavily scrutinize this to identify companies at risk of defaulting on coupon payments.',
    formula: 'Interest Coverage = EBIT / Interest Expense',
    inputs: [
        { key: 'ebit', label: 'EBIT', min: -10000, max: 500000, step: 1000, default: 7500 },
        { key: 'interestExpense', label: 'Interest Expense', min: 0, max: 100000, step: 500, default: 500 },
    ],
    calculate: (inputs) => interestCoverage(inputs.ebit, inputs.interestExpense),
    evaluateInsight: evaluate.interestCoverage
  },

  // --- EFFICIENCY ---
  'asset-turnover': {
    id: 'asset-turnover', name: 'Asset Turnover', category: 'Efficiency',
    description: 'Measures the value of a company\'s sales or revenues generated relative to the value of its assets.',
    history: 'Often used comparatively within the same industry to see which management team extracts the most value from their property and equipment.',
    formula: 'Asset Turnover = Total Revenue / Average Assets',
    inputs: [
        { key: 'revenue', label: 'Total Revenue', min: 1000, max: 1000000, step: 1000, default: 50000 },
        { key: 'averageTotalAssets', label: 'Avg Total Assets', min: 1000, max: 1000000, step: 1000, default: 100000 },
    ],
    calculate: (inputs) => assetTurnover(inputs.revenue, inputs.averageTotalAssets),
    evaluateInsight: (val) => ({ value: val, status: 'Neutral', insight: 'Higher indicates more efficiency. Heavily industry specific.' })
  },
  'inventory-turnover': {
    id: 'inventory-turnover', name: 'Inventory Turnover', category: 'Efficiency',
    description: 'Shows how many times a company has sold and replaced inventory during a given period.',
    history: 'Critical for retail and manufacturing. A low turnover implies weak sales or excess inventory.',
    formula: 'Inventory Turnover = COGS / Average Inventory',
    inputs: [
        { key: 'costOfRevenue', label: 'COGS', min: 1000, max: 1000000, step: 1000, default: 20000 },
        { key: 'averageInventory', label: 'Avg Inventory', min: 1000, max: 500000, step: 1000, default: 10000 },
    ],
    calculate: (inputs) => inventoryTurnover(inputs.costOfRevenue, inputs.averageInventory),
    evaluateInsight: evaluate.inventoryTurnover,
  },
  'receivables-turnover': {
    id: 'receivables-turnover', name: 'Receivables Turnover', category: 'Efficiency',
    description: 'How many times a company collects its average accounts receivable per year. Higher = faster collections.',
    history: 'Tracks the effectiveness of a company\'s credit and collection policies. A deteriorating ratio is often an early warning of cash flow problems or overly aggressive revenue recognition.',
    formula: 'Receivables Turnover = Revenue / Trade Receivables',
    inputs: [
      { key: 'revenue', label: 'Total Revenue', min: 1000, max: 1000000, step: 1000, default: 50000, prefix: '$' },
      { key: 'tradeReceivables', label: 'Trade Receivables', min: 100, max: 200000, step: 500, default: 6250, prefix: '$' },
    ],
    calculate: (inputs) => receivablesTurnover(inputs.revenue, inputs.tradeReceivables),
    evaluateInsight: evaluate.receivablesTurnover,
  },
  'days-sales-outstanding': {
    id: 'days-sales-outstanding', name: 'Days Sales Outstanding (DSO)', category: 'Efficiency',
    description: 'Average number of days to collect payment after a sale. Lower DSO means faster cash conversion.',
    history: 'A key working capital metric tracked by CFOs and credit analysts. A rising DSO trend often precedes write-offs and signals that customers are struggling to pay.',
    formula: 'DSO = 365 / Receivables Turnover',
    inputs: [
      { key: 'revenue', label: 'Total Revenue', min: 1000, max: 1000000, step: 1000, default: 50000, prefix: '$' },
      { key: 'tradeReceivables', label: 'Trade Receivables', min: 100, max: 200000, step: 500, default: 6250, prefix: '$' },
    ],
    calculate: (inputs) => daysSalesOutstanding(inputs.revenue, inputs.tradeReceivables),
    evaluateInsight: evaluate.daysSalesOutstanding,
  },

  // --- QUALITY ---
  'payout-ratio': {
    id: 'payout-ratio', name: 'Payout Ratio', category: 'Quality',
    description: 'Fraction of earnings distributed as dividends. Signals dividend sustainability and capital allocation discipline.',
    history: 'A critical input for dividend sustainability analysis. A ratio above 100% means dividends are paid from borrowings or reserves, not earnings — a major red flag for income investors.',
    formula: 'Payout Ratio = Annual Dividend Per Share / EPS',
    inputs: [
      { key: 'annualDividendPerShare', label: 'Annual Dividend Per Share', min: 0, max: 50, step: 0.1, default: 2, prefix: '$' },
      { key: 'eps', label: 'Earnings Per Share (EPS)', min: 0.01, max: 500, step: 0.1, default: 5, prefix: '$' },
    ],
    calculate: (inputs) => payoutRatio(inputs.annualDividendPerShare, inputs.eps),
    evaluateInsight: evaluate.payoutRatio,
  },
  'cash-conversion-ratio': {
    id: 'cash-conversion-ratio', name: 'Cash Conversion Ratio (CCR)', category: 'Quality',
    description: 'Ratio of operating cash flow to net income. Values > 1 indicate high earnings quality backed by real cash.',
    history: 'Used by forensic accountants and short sellers to detect earnings manipulation. Companies with consistently low CCR (income >> cash flow) often face eventual earnings restatements.',
    formula: 'CCR = Operating Cash Flow / Net Income',
    benchmark: '> 1.0 = cash-backed earnings (strong quality) · 0.8–1.0 = acceptable · < 0.8 warrants scrutiny. A consistently low CCR is an early forensic accounting warning sign.',
    inputs: [
      { key: 'operatingCashFlow', label: 'Operating Cash Flow', min: -50000, max: 500000, step: 1000, default: 7000, prefix: '$' },
      { key: 'netIncome', label: 'Net Income', min: -50000, max: 500000, step: 1000, default: 5000, prefix: '$' },
    ],
    calculate: (inputs) => cashConversionRatio(inputs.operatingCashFlow, inputs.netIncome),
    evaluateInsight: evaluate.cashConversionRatio,
  },

  // --- VALUATION (new) ---
  'price-to-cash-flow': {
    id: 'price-to-cash-flow', name: 'Price-to-Cash-Flow (P/CF)', category: 'Valuation',
    description: 'Compares a company\'s market cap to its operating cash flow — harder to manipulate than earnings.',
    history: 'Preferred over P/E by analysts who believe cash flow is a more reliable indicator of value than accounting earnings, which can be adjusted by management.',
    formula: 'P/CF = Market Cap / Operating Cash Flow',
    inputs: [
      { key: 'marketCap', label: 'Market Cap', min: 1000, max: 5000000, step: 1000, default: 150000, prefix: '$' },
      { key: 'operatingCashFlow', label: 'Operating Cash Flow', min: -50000, max: 500000, step: 1000, default: 7000, prefix: '$' },
    ],
    calculate: (inputs) => priceToCashFlow(inputs.marketCap, inputs.operatingCashFlow),
    evaluateInsight: evaluate.priceToCashFlow,
  },
  'earnings-yield': {
    id: 'earnings-yield', name: 'Earnings Yield', category: 'Valuation',
    description: 'The inverse of P/E ratio — shows EPS as a percentage of share price. Useful for comparing stocks to bonds.',
    history: 'Championed by Joel Greenblatt in his "Magic Formula" investing strategy, the earnings yield can be directly compared against bond yields to determine relative equity attractiveness.',
    formula: 'Earnings Yield = EPS / Price',
    inputs: [
      { key: 'eps', label: 'Earnings Per Share', min: -100, max: 500, step: 0.1, default: 5, prefix: '$' },
      { key: 'price', label: 'Share Price', min: 1, max: 10000, step: 1, default: 150, prefix: '$' },
    ],
    calculate: (inputs) => earningsYield(inputs.eps, inputs.price),
    evaluateInsight: evaluate.earningsYield,
  },
  'ev-revenue': {
    id: 'ev-revenue', name: 'EV / Revenue', category: 'Valuation',
    description: 'Enterprise value relative to total revenue — a capital-structure-neutral version of P/S.',
    history: 'Used heavily for early-stage or unprofitable companies where EBITDA is negative but revenue is growing rapidly. Common in SaaS and tech sector analysis.',
    formula: 'EV/Revenue = Enterprise Value / Total Revenue',
    inputs: [
      { key: 'enterpriseValue', label: 'Enterprise Value', min: 1000, max: 5000000, step: 1000, default: 165000, prefix: '$' },
      { key: 'totalRevenue', label: 'Total Revenue', min: 1000, max: 1000000, step: 1000, default: 50000, prefix: '$' },
    ],
    calculate: (inputs) => evRevenue(inputs.enterpriseValue, inputs.totalRevenue),
    evaluateInsight: evaluate.evRevenue,
  },
  'ev-fcf': {
    id: 'ev-fcf', name: 'EV / Free Cash Flow', category: 'Valuation',
    description: 'Enterprise value divided by free cash flow — shows how expensive a company is relative to cash it actually generates.',
    history: 'Preferred by free-cash-flow-focused investors like Bill Ackman and Terry Smith, who view FCF as the purest measure of corporate value creation.',
    formula: 'EV/FCF = Enterprise Value / Free Cash Flow',
    inputs: [
      { key: 'enterpriseValue', label: 'Enterprise Value', min: 1000, max: 5000000, step: 1000, default: 165000, prefix: '$' },
      { key: 'freeCashFlow', label: 'Free Cash Flow', min: -50000, max: 500000, step: 1000, default: 3000, prefix: '$' },
    ],
    calculate: (inputs) => evFcf(inputs.enterpriseValue, inputs.freeCashFlow),
    evaluateInsight: evaluate.evFcf,
  },

  // --- SOLVENCY ---
  'net-debt': {
    id: 'net-debt', name: 'Net Debt', category: 'Solvency',
    description: 'Total debt minus cash and equivalents. Negative means the company is in a net cash position.',
    history: 'Used by credit analysts and fixed-income investors as the true measure of financial obligation, since cash on hand offsets gross debt immediately if needed.',
    formula: 'Net Debt = Total Debt − Cash & Equivalents',
    inputs: [
      { key: 'totalDebt', label: 'Total Debt', min: 0, max: 500000, step: 1000, default: 20000, prefix: '$' },
      { key: 'cash', label: 'Cash & Equivalents', min: 0, max: 500000, step: 1000, default: 5000, prefix: '$' },
    ],
    calculate: (inputs) => netDebt(inputs.totalDebt, inputs.cash),
    evaluateInsight: (val) => ({ value: val, status: val < 0 ? 'Good' : 'Neutral', insight: val < 0 ? 'Net cash position — stronger than zero debt.' : 'Company carries net debt obligations.' }),
  },
  'net-debt-to-ebitda': {
    id: 'net-debt-to-ebitda', name: 'Net Debt / EBITDA', category: 'Solvency',
    description: 'Shows how many years of EBITDA it would take to repay all net debt — the primary leverage metric used by lenders.',
    history: 'The standard leverage covenant in leveraged buyouts and corporate credit agreements. Ratios above 4× typically trigger credit downgrades or covenant breaches.',
    formula: 'Net Debt / EBITDA = (Total Debt − Cash) / EBITDA',
    benchmark: '< 2× is comfortable · 2–4× is moderate leverage · > 4× typically triggers credit rating concerns or loan covenant breaches. Investment-grade companies aim to stay below 3×.',
    inputs: [
      { key: 'totalDebt', label: 'Total Debt', min: 0, max: 500000, step: 1000, default: 20000, prefix: '$' },
      { key: 'cash', label: 'Cash & Equivalents', min: 0, max: 500000, step: 1000, default: 5000, prefix: '$' },
      { key: 'ebitda', label: 'EBITDA', min: 1, max: 500000, step: 1000, default: 10000, prefix: '$' },
    ],
    calculate: (inputs) => netDebtToEbitda(inputs.totalDebt, inputs.cash, inputs.ebitda),
    evaluateInsight: evaluate.netDebtToEbitda,
  },
  'debt-to-assets': {
    id: 'debt-to-assets', name: 'Debt-to-Assets', category: 'Solvency',
    description: 'Percentage of company assets financed by debt. A higher ratio signals greater financial risk.',
    history: 'One of the oldest solvency ratios used in commercial banking to assess whether total assets provide sufficient collateral for outstanding debt obligations.',
    formula: 'Debt-to-Assets = Total Debt / Total Assets',
    inputs: [
      { key: 'totalDebt', label: 'Total Debt', min: 0, max: 500000, step: 1000, default: 20000, prefix: '$' },
      { key: 'totalAssets', label: 'Total Assets', min: 1000, max: 500000, step: 1000, default: 100000, prefix: '$' },
    ],
    calculate: (inputs) => debtToAssets(inputs.totalDebt, inputs.totalAssets),
    evaluateInsight: evaluate.debtToAssets,
  },

  // --- RISK ---
  'z-score': {
    id: 'z-score', name: 'Altman Z-Score', category: 'Risk',
    description: 'Predicts the probability that a firm will go into bankruptcy within two years.',
    history: 'Developed by Edward Altman in 1968. At its inception, the model correctly predicted 72% of bankruptcies two years prior to the event.',
    formula: 'Z = 1.2X₁ + 1.4X₂ + 3.3X₃ + 0.6X₄ + 1.0X₅',
    benchmark: 'Z > 2.99 = Safe Zone (unlikely bankruptcy) · 1.81–2.99 = Grey Zone (uncertain) · Z < 1.81 = Distress Zone (high bankruptcy risk within 2 years).',
    inputs: [
        { key: 'workingCapital', label: 'Working Capital', min: -50000, max: 100000, step: 1000, default: 15000 },
        { key: 'retainedEarnings', label: 'Retained Earnings', min: -50000, max: 100000, step: 1000, default: 20000 },
        { key: 'ebit', label: 'EBIT', min: -50000, max: 100000, step: 1000, default: 7500 },
        { key: 'marketCap', label: 'Market Cap', min: 1000, max: 500000, step: 1000, default: 150000 },
        { key: 'totalRevenue', label: 'Total Revenue', min: 1000, max: 500000, step: 1000, default: 50000 },
        { key: 'totalAssets', label: 'Total Assets', min: 1000, max: 500000, step: 1000, default: 100000 },
        { key: 'totalLiabilities', label: 'Total Liabilities', min: 1000, max: 500000, step: 1000, default: 60000 }
    ],
    calculate: (inputs) => altmanZScore(inputs.workingCapital, inputs.retainedEarnings, inputs.ebit, inputs.marketCap, inputs.totalRevenue, inputs.totalAssets, inputs.totalLiabilities),
    evaluateInsight: evaluate.altmanZScore
  },
  'sharpe': {
    id: 'sharpe', name: 'Sharpe Ratio', category: 'Risk',
    description: 'Helps investors understand the return of an investment compared to its risk.',
    history: 'Created by Nobel laureate William F. Sharpe in 1966. It adjusts a portfolio\'s performance for the excess risk that was taken by the investor.',
    formula: 'Sharpe = (Rx - Rf) / StdDev(Rx)',
    benchmark: '< 1.0 is suboptimal · 1.0–2.0 is adequate · > 2.0 is very good · > 3.0 is exceptional. Most actively managed funds average 0.5–1.2 over the long run.',
    inputs: [
        { key: 'returnVal', label: 'Portfolio Return', min: -0.5, max: 1.0, step: 0.01, default: 0.12 },
        { key: 'riskFree', label: 'Risk-Free Rate', min: 0, max: 0.2, step: 0.01, default: 0.04 },
        { key: 'stdDev', label: 'Std Deviation (Risk)', min: 0.01, max: 1.0, step: 0.01, default: 0.15 },
    ],
    calculate: (inputs) => sharpe(inputs.returnVal, inputs.riskFree, inputs.stdDev),
    evaluateInsight: evaluate.sharpe,
  },
  'piotroski': {
    id: 'piotroski', name: 'Piotroski F-Score', category: 'Risk',
    description: 'A 9-point scorecard separating fundamentally strong companies from deteriorating ones across profitability, leverage, and efficiency signals.',
    history: 'Developed by accounting professor Joseph Piotroski in 2000. His original paper showed that buying high-score stocks and shorting low-score stocks generated 23% annual returns over 20 years.',
    formula: 'F1 ROA>0 | F2 CFO>0 | F3 ROA↑ | F4 CFO>ROA | F5 Leverage↓ | F6 Liquidity↑ | F7 No Dilution | F8 Gross Margin↑ | F9 Asset Turnover↑',
    benchmark: '8–9 = fundamentally strong (consider long) · 5–7 = neutral · 0–2 = fundamentally weak (avoid or consider short). Piotroski\'s original paper used ≥ 8 as the long threshold.',
    inputs: [
      { key: 'netIncome', label: 'Net Income', min: -50000, max: 100000, step: 1000, default: 5000, prefix: '$' },
      { key: 'totalAssets', label: 'Total Assets', min: 1000, max: 500000, step: 1000, default: 100000, prefix: '$' },
      { key: 'operatingCashFlow', label: 'Operating Cash Flow', min: -50000, max: 100000, step: 1000, default: 7000, prefix: '$' },
    ],
    calculate: (inputs) => {
      const result = piotroski({ netIncome: inputs.netIncome, totalAssets: inputs.totalAssets, operatingCashFlow: inputs.operatingCashFlow });
      return result.score;
    },
    evaluateInsight: (val) => evaluate.piotroski(val, 9),
  },
  'target-upside': {
    id: 'target-upside', name: 'Target Upside', category: 'Risk',
    description: 'Calculates the potential upside (or downside) percentage to reach an analyst target price.',
    history: 'A foundational calculation used constantly in equity research reports to instantly summarize a stock\'s opportunity.',
    formula: '(Target Price - Current Price) / Current Price',
    inputs: [
        { key: 'currentPrice', label: 'Current Price', min: 1, max: 10000, step: 1, default: 150, prefix: '$' },
        { key: 'targetPrice', label: 'Analyst Target Price', min: 1, max: 10000, step: 1, default: 180, prefix: '$' },
    ],
    calculate: (inputs) => targetUpside(inputs.currentPrice, inputs.targetPrice),
    evaluateInsight: evaluate.targetUpside
  }
};
