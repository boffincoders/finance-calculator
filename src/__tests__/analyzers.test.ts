import { describe, it, expect } from "vitest";
import { analyzeCompany, analyzeBatch } from "../analyzer/analyzeCompany";
import {
  analyzeValuation,
  analyzeProfitability,
  analyzeLiquidity,
  analyzeSolvency,
  analyzeEfficiency,
  analyzeRisk,
  analyzeQuality,
} from "../analyzer/categorical";

const fullSnapshot = {
  price: 150,
  marketCap: 150000,
  eps: 5,
  bookValuePerShare: 20,
  revenuePerShare: 50,
  totalRevenue: 50000,
  grossProfit: 30000,
  costOfRevenue: 20000,
  operatingIncome: 7000,
  netIncome: 5000,
  freeCashFlow: 3000,
  operatingCashFlow: 7000,
  ebitda: 10000,
  ebit: 7500,
  totalAssets: 100000,
  totalLiabilities: 60000,
  totalEquity: 40000,
  totalDebt: 20000,
  longTermDebt: 15000,
  cashAndEquivalents: 5000,
  inventory: 10000,
  tradeReceivables: 6250,
  interestExpense: 500,
  annualDividendPerShare: 2,
  expectedEarningsGrowthRate: 0.15,
  workingCapital: 15000,
  retainedEarnings: 20000,
  taxRate: 0.25,
  sharesOutstanding: 1000,
  returns: 0.12,
  riskFree: 0.04,
  stdDev: 0.15,
  analystTargetPrice: 180,
};

describe("analyzeCompany (raw values)", () => {
  const result = analyzeCompany(fullSnapshot);

  it("returns all 7 categories", () => {
    expect(result).toHaveProperty("valuation");
    expect(result).toHaveProperty("profitability");
    expect(result).toHaveProperty("liquidity");
    expect(result).toHaveProperty("solvency");
    expect(result).toHaveProperty("efficiency");
    expect(result).toHaveProperty("risk");
    expect(result).toHaveProperty("quality");
  });

  it("valuation contains all new metrics", () => {
    expect(result.valuation).toHaveProperty("pe");
    expect(result.valuation).toHaveProperty("grahamNumber");
    expect(result.valuation).toHaveProperty("priceToCashFlow");
    expect(result.valuation).toHaveProperty("earningsYield");
    expect(result.valuation).toHaveProperty("evRevenue");
    expect(result.valuation).toHaveProperty("evFcf");
  });

  it("solvency contains netDebt and netDebtToEbitda", () => {
    expect(result.solvency).toHaveProperty("netDebt");
    expect(result.solvency).toHaveProperty("netDebtToEbitda");
    expect(result.solvency).toHaveProperty("debtToAssets");
  });

  it("efficiency now includes receivables and DSO", () => {
    expect(result.efficiency).toHaveProperty("receivablesTurnover");
    expect(result.efficiency).toHaveProperty("daysSalesOutstanding");
  });

  it("risk includes sharpe and piotroski", () => {
    expect(result.risk).toHaveProperty("sharpe");
    expect(result.risk).toHaveProperty("piotroski");
    expect(result.risk.piotroski).not.toBeNull();
  });

  it("quality contains payout ratio and CCR", () => {
    expect(result.quality).toHaveProperty("payoutRatio");
    expect(result.quality).toHaveProperty("cashConversionRatio");
    expect(result.quality).toHaveProperty("targetUpside");
  });

  it("handles all-null snapshot gracefully", () => {
    const empty = analyzeCompany({});
    expect(empty.valuation.pe).toBeNull();
    expect(empty.profitability.roa).toBeNull();
    expect(empty.risk.piotroski).toBeNull();
  });
});

describe("analyzeCompany (withInsights = true)", () => {
  const result = analyzeCompany(fullSnapshot, true);

  it("returns EvaluatedMetric objects with status and insight", () => {
    const pe = result.valuation.pe as any;
    expect(pe).toHaveProperty("value");
    expect(pe).toHaveProperty("status");
    expect(pe).toHaveProperty("insight");
    expect(["Good", "Neutral", "Bad", "N/A"]).toContain(pe.status);
  });

  it("piotroski insight references score and maxScore", () => {
    const p = result.risk.piotroski as any;
    expect(p.insight).toMatch(/\d+\/\d+/);
  });
});

describe("analyzeSolvency", () => {
  it("net debt is correct (debt - cash)", () => {
    const result = analyzeSolvency({ totalDebt: 20000, cashAndEquivalents: 5000 });
    expect(result.netDebt).toBe(15000);
  });

  it("net cash company has negative netDebt", () => {
    const result = analyzeSolvency({ totalDebt: 5000, cashAndEquivalents: 20000 });
    expect(result.netDebt).toBe(-15000);
  });
});

describe("analyzeBatch", () => {
  it("processes multiple companies", () => {
    const results = analyzeBatch([fullSnapshot, { price: 50, eps: 10 }]);
    expect(results).toHaveLength(2);
    expect(results[0].valuation.pe).toBeCloseTo(30);
    expect(results[1].valuation.pe).toBeCloseTo(5);
  });
});
