import { describe, it, expect } from "vitest";
import { currentRatio } from "../liquidity/currentRatio";
import { quickRatio } from "../liquidity/quickRatio";
import { debtToEquity } from "../liquidity/debtToEquity";
import { interestCoverage } from "../liquidity/interestCoverage";
import { netDebt, netDebtToEbitda, debtToAssets } from "../solvency/netDebt";

describe("Current Ratio", () => {
  it("calculates correctly", () => expect(currentRatio(100000, 60000)).toBeCloseTo(1.667));
  it("returns null for zero liabilities", () => expect(currentRatio(100000, 0)).toBeNull());
});

describe("Quick Ratio", () => {
  it("calculates correctly", () => expect(quickRatio(100000, 10000, 60000)).toBeCloseTo(1.5));
  it("returns null for zero liabilities", () => expect(quickRatio(100000, 10000, 0)).toBeNull());
});

describe("Debt to Equity", () => {
  it("calculates correctly", () => expect(debtToEquity(20000, 40000)).toBeCloseTo(0.5));
  it("returns null for zero equity", () => expect(debtToEquity(20000, 0)).toBeNull());
  it("handles zero debt", () => expect(debtToEquity(0, 40000)).toBeCloseTo(0));
});

describe("Interest Coverage", () => {
  it("calculates correctly", () => expect(interestCoverage(7500, 500)).toBeCloseTo(15));
  it("returns null for zero interest expense", () => expect(interestCoverage(7500, 0)).toBeNull());
  it("handles negative EBIT (distress)", () => expect(interestCoverage(-1000, 500)).toBeCloseTo(-2));
});

describe("Net Debt", () => {
  it("is positive when debt exceeds cash", () => expect(netDebt(20000, 5000)).toBe(15000));
  it("is negative (net cash) when cash exceeds debt", () => expect(netDebt(5000, 20000)).toBe(-15000));
  it("is zero when equal", () => expect(netDebt(10000, 10000)).toBe(0));
});

describe("Net Debt to EBITDA", () => {
  it("calculates correctly", () => expect(netDebtToEbitda(20000, 5000, 10000)).toBeCloseTo(1.5));
  it("returns negative for net cash position", () => expect(netDebtToEbitda(5000, 20000, 10000)).toBeCloseTo(-1.5));
  it("returns null for zero EBITDA", () => expect(netDebtToEbitda(20000, 5000, 0)).toBeNull());
});

describe("Debt to Assets", () => {
  it("calculates correctly", () => expect(debtToAssets(20000, 100000)).toBeCloseTo(0.2));
  it("returns null for zero assets", () => expect(debtToAssets(20000, 0)).toBeNull());
  it("handles zero debt", () => expect(debtToAssets(0, 100000)).toBeCloseTo(0));
});
