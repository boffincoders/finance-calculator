import { analyzeCompany, analyzeFundamentalTrends } from "./src";

const mockSnapshot = {
  price: 150,
  eps: 5,
  bookValuePerShare: 20,
  revenuePerShare: 50,
  marketCap: 150000,
  totalRevenue: 50000,
  totalDebt: 20000,
  cashAndEquivalents: 5000,
  netIncome: 5000,
  totalAssets: 100000,
  totalLiabilities: 60000,
  totalEquity: 40000,
  operatingIncome: 7000,
  taxRate: 0.2,
  costOfRevenue: 20000,
  freeCashFlow: 3000,
  inventory: 10000,
  interestExpense: 500,
  ebit: 7500,
  workingCapital: 15000,
  retainedEarnings: 20000,
  analystTargetPrice: 180,
  expectedEarningsGrowthRate: 0.15,
  ebitda: 10000,
  annualDividendPerShare: 1.5,
};

const mockTimeseries = {
  revenue: [40000, 45000, 50000],
  netIncome: [3500, 4200, 5000],
  eps: [3.5, 4.2, 5],
  freeCashFlow: [2000, 2500, 3000],
  costOfRevenue: [18000, 19000, 20000],
  operatingIncome: [5000, 6000, 7000],
};

console.log("=== Testing analyzeCompany (Snapshot Data) ===");
const companyAnalysis = analyzeCompany(mockSnapshot);
console.log(JSON.stringify(companyAnalysis, null, 2));

console.log("\n=== Testing analyzeFundamentalTrends (Timeseries Data) ===");
const trendsAnalysis = analyzeFundamentalTrends(mockTimeseries, "annual");
console.log(JSON.stringify(trendsAnalysis, null, 2));

console.log("\nVerification complete!");
