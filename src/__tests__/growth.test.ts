import { describe, it, expect } from "vitest";
import { calculateGrowthRate, yoyGrowth, qoqGrowth, cagr } from "../growth/trendGrowth";
import { targetUpside } from "../insights/targetUpside";
import { analyzeFundamentalTrends } from "../analyzer/analyzeFundamentalTrends";

describe("calculateGrowthRate", () => {
  it("calculates 25% growth correctly", () => expect(calculateGrowthRate(50000, 40000)).toBeCloseTo(0.25));
  it("calculates negative growth", () => expect(calculateGrowthRate(40000, 50000)).toBeCloseTo(-0.2));
  it("returns null for zero previous value", () => expect(calculateGrowthRate(50000, 0)).toBeNull());
});

describe("yoyGrowth", () => {
  it("returns array of length N-1", () => {
    const result = yoyGrowth([40000, 45000, 50000]);
    expect(result).toHaveLength(2);
  });
  it("calculates correct growth rates", () => {
    const result = yoyGrowth([40000, 45000, 50000]);
    expect(result[0]).toBeCloseTo(0.125);
    expect(result[1]).toBeCloseTo(0.1111);
  });
  it("returns empty array for single element", () => {
    expect(yoyGrowth([40000])).toHaveLength(0);
  });
});

describe("qoqGrowth", () => {
  it("calculates quarter-over-quarter growth", () => {
    const result = qoqGrowth([10000, 10500, 12000, 11000]);
    expect(result).toHaveLength(3);
    expect(result[0]).toBeCloseTo(0.05);
    expect(result[2]).toBeCloseTo(-0.0833);
  });
});

describe("CAGR", () => {
  it("calculates 2-year CAGR correctly", () => {
    expect(cagr(40000, 50000, 2)).toBeCloseTo(Math.pow(50000 / 40000, 1 / 2) - 1);
  });
  it("returns null for zero periods", () => expect(cagr(40000, 50000, 0)).toBeNull());
  it("returns null for zero beginning value", () => expect(cagr(0, 50000, 2)).toBeNull());
  it("handles declining CAGR", () => expect(cagr(50000, 40000, 2)!).toBeLessThan(0));
});

describe("Target Upside", () => {
  it("calculates 20% upside", () => expect(targetUpside(150, 180)).toBeCloseTo(0.2));
  it("calculates downside as negative", () => expect(targetUpside(180, 150)).toBeCloseTo(-0.1667));
  it("returns null for zero current price", () => expect(targetUpside(0, 180)).toBeNull());
});

describe("analyzeFundamentalTrends", () => {
  const data = {
    revenue: [40000, 45000, 50000],
    netIncome: [3500, 4200, 5000],
    costOfRevenue: [18000, 19500, 21000],
    operatingIncome: [7000, 8000, 9000],
    freeCashFlow: [2500, 3000, 3500],
    eps: [3.5, 4.2, 5.0],
  };

  it("returns correct period type", () => {
    expect(analyzeFundamentalTrends(data, "annual").periodType).toBe("annual");
    expect(analyzeFundamentalTrends(data, "quarterly").periodType).toBe("quarterly");
  });

  it("revenue growth has length N-1", () => {
    const result = analyzeFundamentalTrends(data, "annual");
    expect(result.growth.revenueGrowth).toHaveLength(2);
  });

  it("computes revenue CAGR for annual", () => {
    const result = analyzeFundamentalTrends(data, "annual");
    expect(result.growth.revenueCagr).not.toBeNull();
    expect(result.growth.revenueCagr!).toBeGreaterThan(0);
  });

  it("does not compute CAGR for quarterly", () => {
    const result = analyzeFundamentalTrends(data, "quarterly");
    expect(result.growth.revenueCagr).toBeNull();
  });

  it("computes gross margins array", () => {
    const result = analyzeFundamentalTrends(data, "annual");
    expect(result.margins.grossMargins).toHaveLength(3);
    expect(result.margins.grossMargins![0]).toBeCloseTo((40000 - 18000) / 40000);
  });

  it("computes net margins array", () => {
    const result = analyzeFundamentalTrends(data, "annual");
    expect(result.margins.netMargins).toHaveLength(3);
    expect(result.margins.netMargins[2]).toBeCloseTo(5000 / 50000);
  });

  it("computes EPS growth", () => {
    const result = analyzeFundamentalTrends(data, "annual");
    expect(result.growth.epsGrowth).not.toBeNull();
    expect(result.growth.epsGrowth).toHaveLength(2);
  });
});
