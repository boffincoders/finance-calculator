export interface CompanySnapshotInput {
  price?: number;
  marketCap?: number;
  totalRevenue?: number;
  grossProfit?: number;
  operatingIncome?: number;
  netIncome?: number;
  freeCashFlow?: number;
  operatingCashFlow?: number;    // for P/CF, CCR, Piotroski F2/F4
  eps?: number;
  bookValuePerShare?: number;
  revenuePerShare?: number;
  totalAssets?: number;
  totalLiabilities?: number;
  totalEquity?: number;
  totalDebt?: number;
  longTermDebt?: number;         // for Piotroski F5
  cashAndEquivalents?: number;
  inventory?: number;
  tradeReceivables?: number;     // for receivables turnover / DSO
  interestExpense?: number;
  costOfRevenue?: number;
  annualDividendPerShare?: number;
  expectedEarningsGrowthRate?: number;
  ebitda?: number;
  workingCapital?: number;
  retainedEarnings?: number;
  ebit?: number;
  taxRate?: number;
  sharesOutstanding?: number;    // for P/CF per-share, Piotroski F7
  returns?: number;              // for sharpe
  riskFree?: number;             // for sharpe
  stdDev?: number;               // for sharpe
  analystTargetPrice?: number;
}
