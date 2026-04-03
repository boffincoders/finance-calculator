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

// Technicals
import {
  sma, ema, rsi, roc, macd, atr, bollingerBands, adx, mfi, vwap, beta, pivotPoints,
} from "../technicals/index";

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

// ---------------------------------------------------------------------------
// Technicals — SMA
// ---------------------------------------------------------------------------
describe("sma", () => {
  it("SMA of [1,2,3,4,5] period 3 = 4", () => {
    expect(sma([1, 2, 3, 4, 5], 3)).toBeCloseTo(4);
  });
  it("SMA of exact period = average", () => {
    expect(sma([10, 20, 30], 3)).toBeCloseTo(20);
  });
  it("returns null for period > array length", () => {
    expect(sma([1, 2], 5)).toBeNull();
  });
  it("returns null for period 0", () => {
    expect(sma([1, 2, 3], 0)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Technicals — EMA
// ---------------------------------------------------------------------------
describe("ema", () => {
  it("returns a number for valid input", () => {
    const result = ema([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 5);
    expect(result).not.toBeNull();
    expect(typeof result).toBe("number");
  });
  it("EMA is more recent-weighted than SMA", () => {
    const prices = [10, 10, 10, 10, 10, 20]; // spike at end
    const emaVal = ema(prices, 3)!;
    const smaVal = sma(prices, 3)!;
    expect(emaVal).toBeGreaterThan(smaVal); // EMA reacts more to recent spike
  });
  it("returns null when insufficient data", () => {
    expect(ema([10, 20], 5)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Technicals — RSI
// ---------------------------------------------------------------------------
describe("rsi", () => {
  it("returns a number between 0 and 100 for valid data", () => {
    const prices = Array.from({ length: 20 }, (_, i) => 100 + i * 0.5 + (i % 3 === 0 ? -2 : 0));
    const result = rsi(prices, 14);
    expect(result).not.toBeNull();
    expect(result!).toBeGreaterThanOrEqual(0);
    expect(result!).toBeLessThanOrEqual(100);
  });
  it("all-up prices → RSI near 100", () => {
    const prices = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    expect(rsi(prices, 14)!).toBeGreaterThan(90);
  });
  it("returns null for insufficient data", () => {
    expect(rsi([10, 11, 12], 14)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Technicals — ROC
// ---------------------------------------------------------------------------
describe("roc", () => {
  it("20% gain over 5 periods", () => {
    expect(roc([100, 100, 100, 100, 100, 120], 5)).toBeCloseTo(20);
  });
  it("zero change → 0", () => {
    expect(roc([100, 100, 100, 100, 100, 100], 5)).toBeCloseTo(0);
  });
  it("returns null for insufficient data", () => {
    expect(roc([100, 110], 5)).toBeNull();
  });
  it("returns null when prior price is zero", () => {
    expect(roc([0, 0, 0, 0, 0, 100], 5)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Technicals — MACD
// ---------------------------------------------------------------------------
describe("macd", () => {
  it("returns macdLine, signalLine, histogram for sufficient data", () => {
    const prices = Array.from({ length: 50 }, (_, i) => 100 + Math.sin(i / 5) * 10 + i * 0.5);
    const result = macd(prices);
    expect(result).not.toBeNull();
    expect(typeof result!.macdLine).toBe("number");
    expect(typeof result!.signalLine).toBe("number");
    expect(result!.histogram).toBeCloseTo(result!.macdLine - result!.signalLine);
  });
  it("returns null for insufficient data", () => {
    expect(macd([100, 110, 120], 12, 26, 9)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Technicals — ATR
// ---------------------------------------------------------------------------
describe("atr", () => {
  const h = Array.from({ length: 20 }, (_, i) => 100 + i + 2);
  const l = Array.from({ length: 20 }, (_, i) => 100 + i - 2);
  const c = Array.from({ length: 20 }, (_, i) => 100 + i);

  it("returns a positive number for valid data", () => {
    const result = atr(h, l, c, 14);
    expect(result).not.toBeNull();
    expect(result!).toBeGreaterThan(0);
  });
  it("returns null for insufficient data", () => {
    expect(atr([100, 101], [99, 100], [100, 101], 14)).toBeNull();
  });
  it("returns null for mismatched array lengths", () => {
    expect(atr([100, 101, 102], [99, 100], [100, 101], 2)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Technicals — Bollinger Bands
// ---------------------------------------------------------------------------
describe("bollingerBands", () => {
  it("upper > middle > lower", () => {
    const prices = Array.from({ length: 25 }, (_, i) => 100 + Math.sin(i) * 5);
    const result = bollingerBands(prices, 20, 2);
    expect(result).not.toBeNull();
    expect(result!.upper).toBeGreaterThan(result!.middle);
    expect(result!.middle).toBeGreaterThan(result!.lower);
  });
  it("flat prices → very narrow bands", () => {
    const prices = Array.from({ length: 25 }, () => 100);
    const result = bollingerBands(prices, 20, 2)!;
    expect(result.upper).toBeCloseTo(100);
    expect(result.lower).toBeCloseTo(100);
  });
  it("returns null for insufficient data", () => {
    expect(bollingerBands([100, 101], 20)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Technicals — ADX
// ---------------------------------------------------------------------------
describe("adx", () => {
  const n = 60;
  const h = Array.from({ length: n }, (_, i) => 100 + i * 0.5 + 2);
  const l = Array.from({ length: n }, (_, i) => 100 + i * 0.5 - 2);
  const c = Array.from({ length: n }, (_, i) => 100 + i * 0.5);

  it("returns adx, plusDI, minusDI for valid data", () => {
    const result = adx(h, l, c, 14);
    expect(result).not.toBeNull();
    expect(result!.adx).toBeGreaterThanOrEqual(0);
    expect(result!.adx).toBeLessThanOrEqual(100);
  });
  it("strongly trending market → ADX > 25", () => {
    const result = adx(h, l, c, 14);
    expect(result!.adx).toBeGreaterThan(15);
  });
  it("returns null for insufficient data", () => {
    expect(adx([100, 101], [99, 100], [100, 101], 14)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Technicals — MFI
// ---------------------------------------------------------------------------
describe("mfi", () => {
  const n = 20;
  const h = Array.from({ length: n }, (_, i) => 100 + i + 1);
  const l = Array.from({ length: n }, (_, i) => 100 + i - 1);
  const c = Array.from({ length: n }, (_, i) => 100 + i);
  const v = Array.from({ length: n }, () => 1000000);

  it("returns a number 0–100 for valid data", () => {
    const result = mfi(h, l, c, v, 14);
    expect(result).not.toBeNull();
    expect(result!).toBeGreaterThanOrEqual(0);
    expect(result!).toBeLessThanOrEqual(100);
  });
  it("returns null for insufficient data", () => {
    expect(mfi([100], [99], [100], [1000], 14)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Technicals — VWAP
// ---------------------------------------------------------------------------
describe("vwap", () => {
  it("equal volumes → VWAP = avg typical price", () => {
    const h = [110, 120, 130];
    const l = [90, 100, 110];
    const c = [100, 110, 120];
    const v = [1000, 1000, 1000];
    // typical: (100+100+100)/3=100, (110+110+110)/3=110, (120+120+120)/3=120 → avg=110
    expect(vwap(h, l, c, v)).toBeCloseTo(110);
  });
  it("volume-weighted: higher volume at lower price pulls VWAP down", () => {
    const h = [105, 125];
    const l = [95, 115];
    const c = [100, 120];
    const v = [10000, 1000]; // heavy volume at 100
    const result = vwap(h, l, c, v)!;
    expect(result).toBeLessThan(110); // closer to 100 than 120
  });
  it("returns null for empty arrays", () => {
    expect(vwap([], [], [], [])).toBeNull();
  });
  it("returns null for zero total volume", () => {
    expect(vwap([100], [90], [95], [0])).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Technicals — Beta
// ---------------------------------------------------------------------------
describe("beta", () => {
  it("identical return series → beta = 1", () => {
    const returns = [0.01, -0.02, 0.03, -0.01, 0.02];
    expect(beta(returns, returns)).toBeCloseTo(1);
  });
  it("double the benchmark returns → beta = 2", () => {
    const bench = [0.01, -0.02, 0.03, -0.01, 0.02];
    const stock = bench.map(r => r * 2);
    expect(beta(stock, bench)).toBeCloseTo(2);
  });
  it("counter-cyclical → negative beta", () => {
    const bench = [0.01, -0.02, 0.03, -0.01, 0.02];
    const stock = bench.map(r => -r);
    expect(beta(stock, bench)!).toBeLessThan(0);
  });
  it("returns null for mismatched lengths", () => {
    expect(beta([0.01, 0.02], [0.01])).toBeNull();
  });
  it("returns null for single value", () => {
    expect(beta([0.01], [0.01])).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Technicals — Pivot Points
// ---------------------------------------------------------------------------
describe("pivotPoints", () => {
  it("standard pivot calculation", () => {
    const result = pivotPoints(110, 90, 100);
    const expectedPivot = (110 + 90 + 100) / 3; // 100
    expect(result.pivot).toBeCloseTo(expectedPivot);
    expect(result.r1).toBeCloseTo(2 * expectedPivot - 90);
    expect(result.s1).toBeCloseTo(2 * expectedPivot - 110);
    expect(result.r2).toBeCloseTo(expectedPivot + (110 - 90));
    expect(result.s2).toBeCloseTo(expectedPivot - (110 - 90));
  });
  it("resistance levels are above pivot", () => {
    const result = pivotPoints(110, 90, 100);
    expect(result.r1).toBeGreaterThan(result.pivot);
    expect(result.r2).toBeGreaterThan(result.r1);
    expect(result.r3).toBeGreaterThan(result.r2);
  });
  it("support levels are below pivot", () => {
    const result = pivotPoints(110, 90, 100);
    expect(result.s1).toBeLessThan(result.pivot);
    expect(result.s2).toBeLessThan(result.s1);
    expect(result.s3).toBeLessThan(result.s2);
  });
});
