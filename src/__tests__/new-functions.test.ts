import { describe, it, expect } from "vitest";

// Efficiency — new
import { payableDays } from "../efficiency/payableDays";
import { workingCapitalDays } from "../efficiency/workingCapitalDays";
import { cashConversionCycle } from "../efficiency/cashConversionCycle";

// Valuation — new
import { marketCapToDebtCap } from "../valuation/marketCapToDebtCap";

// TTM
import { computeTTM, computeTTMAvg } from "../ttm/index";

// Growth — new
import { medianGrowth } from "../growth/trendGrowth";

// Historical
import { computeNYearAverage, computeNYearSum, computeHistoricalPoint } from "../historical/index";

// Intrinsic — new
import { computeNCVPS } from "../intrinsic/ncvps";
import { computeGFactor } from "../intrinsic/gfactor";
import { computeIntrinsicValue } from "../intrinsic/intrinsicValue";

// Scoring
import {
  computeQualityScore,
  computeGrowthScore,
  computeValueScore,
  computeMomentumScore,
} from "../scoring/index";



// ---------------------------------------------------------------------------
// Efficiency — Payable Days
// ---------------------------------------------------------------------------
describe("payableDays", () => {
  it("calculates correctly (50000 payables, 200000 cogs → 91.25 days)", () => {
    expect(payableDays(50000, 200000)).toBeCloseTo((50000 / 200000) * 365);
  });
  it("returns null for zero COGS", () => {
    expect(payableDays(50000, 0)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Efficiency — Working Capital Days
// ---------------------------------------------------------------------------
describe("workingCapitalDays", () => {
  it("calculates correctly", () => {
    expect(workingCapitalDays(30000, 300000)).toBeCloseTo((30000 / 300000) * 365);
  });
  it("handles negative working capital", () => {
    expect(workingCapitalDays(-10000, 300000)).toBeCloseTo((-10000 / 300000) * 365);
  });
  it("returns null for zero revenue", () => {
    expect(workingCapitalDays(30000, 0)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Efficiency — Cash Conversion Cycle
// ---------------------------------------------------------------------------
describe("cashConversionCycle", () => {
  it("CCC = debtorDays + inventoryDays - payableDays", () => {
    expect(cashConversionCycle(45, 60, 30)).toBe(75);
  });
  it("can be negative (collect before paying suppliers)", () => {
    expect(cashConversionCycle(5, 10, 60)).toBe(-45);
  });
  it("zero case", () => {
    expect(cashConversionCycle(0, 0, 0)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Valuation — Market Cap to Debt Cap
// ---------------------------------------------------------------------------
describe("marketCapToDebtCap", () => {
  it("50% equity financed", () => {
    expect(marketCapToDebtCap(500, 500)).toBeCloseTo(0.5);
  });
  it("100% equity financed (no debt)", () => {
    expect(marketCapToDebtCap(1000, 0)).toBeCloseTo(1.0);
  });
  it("returns null when both are zero", () => {
    expect(marketCapToDebtCap(0, 0)).toBeNull();
  });
  it("heavily debt-financed → ratio close to 0", () => {
    expect(marketCapToDebtCap(100, 900)).toBeCloseTo(0.1);
  });
});

// ---------------------------------------------------------------------------
// TTM
// ---------------------------------------------------------------------------
describe("computeTTM", () => {
  it("sums last 4 of an array with more than 4", () => {
    expect(computeTTM([10, 20, 30, 40, 50, 60, 70])).toBe(40 + 50 + 60 + 70);
  });
  it("sums all when exactly 4 values", () => {
    expect(computeTTM([10, 20, 30, 40])).toBe(100);
  });
  it("sums all when fewer than 4 values", () => {
    expect(computeTTM([15, 25])).toBe(40);
  });
  it("returns null for empty array", () => {
    expect(computeTTM([])).toBeNull();
  });
});

describe("computeTTMAvg", () => {
  it("averages last 4 values", () => {
    expect(computeTTMAvg([5, 10, 15, 20, 25])).toBeCloseTo((10 + 15 + 20 + 25) / 4);
  });
  it("averages all when fewer than 4", () => {
    expect(computeTTMAvg([8, 12])).toBeCloseTo(10);
  });
  it("returns null for empty array", () => {
    expect(computeTTMAvg([])).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Growth — Median Growth
// ---------------------------------------------------------------------------
describe("medianGrowth", () => {
  it("returns median of growth rates", () => {
    // values: 100, 110, 120, 180 → rates: 10%, 9.09%, 50% → sorted: 0.0909, 0.1, 0.5 → median = 0.1
    const rates = medianGrowth([100, 110, 120, 180]);
    expect(rates).toBeCloseTo(0.1, 1);
  });
  it("returns null for single value", () => {
    expect(medianGrowth([100])).toBeNull();
  });
  it("returns null for empty array", () => {
    expect(medianGrowth([])).toBeNull();
  });
  it("even number of growth rates uses average of middle two", () => {
    // [100, 200, 300, 400] → rates: 1.0, 0.5, 0.333 → sorted: 0.333, 0.5, 1.0 → median = 0.5
    const result = medianGrowth([100, 200, 300, 400]);
    expect(result).toBeCloseTo(0.5, 1);
  });
});

// ---------------------------------------------------------------------------
// Historical
// ---------------------------------------------------------------------------
describe("computeNYearAverage", () => {
  const data = [10, 20, 30, 40, 50, 60, 70, 80]; // 8 quarters = 2 years

  it("1-year average = avg of last 4 quarters", () => {
    expect(computeNYearAverage(data, 1)).toBeCloseTo((50 + 60 + 70 + 80) / 4);
  });
  it("2-year average = avg of last 8 quarters", () => {
    expect(computeNYearAverage(data, 2)).toBeCloseTo((10 + 20 + 30 + 40 + 50 + 60 + 70 + 80) / 8);
  });
  it("returns null for empty array", () => {
    expect(computeNYearAverage([], 1)).toBeNull();
  });
  it("returns null for zero years", () => {
    expect(computeNYearAverage(data, 0)).toBeNull();
  });
});

describe("computeNYearSum", () => {
  const data = [10, 20, 30, 40, 50, 60, 70, 80];

  it("1-year sum = sum of last 4 quarters", () => {
    expect(computeNYearSum(data, 1)).toBe(50 + 60 + 70 + 80);
  });
  it("2-year sum = sum of all 8 quarters", () => {
    expect(computeNYearSum(data, 2)).toBe(360);
  });
  it("returns null for empty array", () => {
    expect(computeNYearSum([], 1)).toBeNull();
  });
});

describe("computeHistoricalPoint", () => {
  const data = [10, 20, 30, 40, 50];

  it("quartersBack = 0 → most recent value (50)", () => {
    expect(computeHistoricalPoint(data, 0)).toBe(50);
  });
  it("quartersBack = 4 → value from 1 year ago (10)", () => {
    expect(computeHistoricalPoint(data, 4)).toBe(10);
  });
  it("returns null if quartersBack exceeds array length", () => {
    expect(computeHistoricalPoint(data, 10)).toBeNull();
  });
  it("returns null for empty array", () => {
    expect(computeHistoricalPoint([], 0)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Intrinsic — NCVPS
// ---------------------------------------------------------------------------
describe("computeNCVPS", () => {
  it("positive: current assets > liabilities", () => {
    expect(computeNCVPS(500, 300, 100)).toBeCloseTo(2); // (500-300)/100
  });
  it("negative: current assets < liabilities", () => {
    expect(computeNCVPS(200, 500, 100)).toBeCloseTo(-3);
  });
  it("returns null for zero shares", () => {
    expect(computeNCVPS(500, 300, 0)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Intrinsic — G-Factor
// ---------------------------------------------------------------------------
describe("computeGFactor", () => {
  it("all 100 → 100", () => {
    expect(computeGFactor(100, 100, 100)).toBeCloseTo(100);
  });
  it("all 0 → 0", () => {
    expect(computeGFactor(0, 0, 0)).toBeCloseTo(0);
  });
  it("weighted correctly: quality=80, growth=60, momentum=40", () => {
    expect(computeGFactor(80, 60, 40)).toBeCloseTo(80 * 0.4 + 60 * 0.35 + 40 * 0.25);
  });
});

// ---------------------------------------------------------------------------
// Intrinsic — computeIntrinsicValue
// ---------------------------------------------------------------------------
describe("computeIntrinsicValue", () => {
  it("positive EPS with 15% growth, 25% margin of safety", () => {
    const result = computeIntrinsicValue(10, 0.15, 0.25);
    const futureEps = 10 * Math.pow(1.15, 5);
    expect(result).toBeCloseTo(futureEps / 0.75);
  });
  it("returns null for zero EPS", () => {
    expect(computeIntrinsicValue(0, 0.15, 0.25)).toBeNull();
  });
  it("returns null for negative EPS", () => {
    expect(computeIntrinsicValue(-5, 0.15, 0.25)).toBeNull();
  });
  it("returns null for safetyMargin >= 1", () => {
    expect(computeIntrinsicValue(10, 0.15, 1)).toBeNull();
  });
  it("returns null for negative safetyMargin", () => {
    expect(computeIntrinsicValue(10, 0.15, -0.1)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------
describe("computeQualityScore", () => {
  it("perfect inputs → 100", () => {
    const score = computeQualityScore({
      piotroskiScore: 9,
      roeVsSector: 1.0,
      marginsImproving: true,
      pledgeFree: true,
      promoterStable: true,
    });
    expect(score).toBeCloseTo(100);
  });
  it("all zero/false → 0", () => {
    const score = computeQualityScore({
      piotroskiScore: 0,
      roeVsSector: 0,
      marginsImproving: false,
      pledgeFree: false,
      promoterStable: false,
    });
    expect(score).toBeCloseTo(0);
  });
  it("output is within 0–100", () => {
    const score = computeQualityScore({
      piotroskiScore: 5,
      roeVsSector: 0.8,
      marginsImproving: true,
      pledgeFree: false,
      promoterStable: true,
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe("computeGrowthScore", () => {
  it("all maxed out → 100", () => {
    const score = computeGrowthScore({
      revenueGrowthVsSector: 1.0,
      profitGrowthRate: 0.30,
      epsGrowthRate: 0.25,
      cfoPositive: true,
      revenueAccelerating: true,
    });
    expect(score).toBeCloseTo(100);
  });
  it("all zero/false → 0", () => {
    const score = computeGrowthScore({
      revenueGrowthVsSector: 0,
      profitGrowthRate: 0,
      epsGrowthRate: 0,
      cfoPositive: false,
      revenueAccelerating: false,
    });
    expect(score).toBeCloseTo(0);
  });
});

describe("computeValueScore", () => {
  it("output is within 0–100", () => {
    const score = computeValueScore({
      peVs3yrAvg: 0.8,
      pbVsSector: 0.7,
      peg: 0.9,
      historicalPePercentile: 30,
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
  it("high P/E vs average penalises the score", () => {
    const cheap = computeValueScore({ peVs3yrAvg: 0.5, pbVsSector: 0.5, peg: 0.5, historicalPePercentile: 10 });
    const expensive = computeValueScore({ peVs3yrAvg: 1.8, pbVsSector: 1.8, peg: 2.5, historicalPePercentile: 90 });
    expect(cheap).toBeGreaterThan(expensive);
  });
});

describe("computeMomentumScore", () => {
  it("strong momentum → high score", () => {
    const score = computeMomentumScore({
      priceVsSma200: 1.10,
      rsi: 57,
      adx: 35,
      volumeRatio: 1.5,
      roc125: 0.30,
    });
    expect(score).toBeGreaterThan(60);
  });
  it("output is within 0–100", () => {
    const score = computeMomentumScore({
      priceVsSma200: 0.95,
      rsi: 45,
      adx: 20,
      volumeRatio: 0.8,
      roc125: -0.05,
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

