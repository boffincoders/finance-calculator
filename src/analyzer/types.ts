export interface CompanySnapshotInput {
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
