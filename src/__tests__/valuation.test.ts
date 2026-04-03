import { describe, it, expect } from "vitest";
import { pb as pbFn, pbFromMarketCap } from "../valuation/pb";
import { pe as peFn } from "../valuation/pe";
import { ps as psFn, psFromMarketCap } from "../valuation/ps";
import { peg as pegFn } from "../valuation/peg";
import { evEbitda, calculateEnterpriseValue } from "../valuation/evEbitda";
import { dividendYield } from "../valuation/dividendYield";
import { calculateDCF, impliedSharePrice } from "../valuation/dcf";
import { grahamNumber } from "../intrinsic/graham";
import { priceToCashFlow, priceToCashFlowPerShare } from "../valuation/priceToCashFlow";
import { earningsYield } from "../valuation/earningsYield";
import { evRevenue } from "../valuation/evRevenue";
import { evFcf } from "../valuation/evFcf";

describe("P/E Ratio", () => {
  it("calculates correctly", () => expect(peFn(150, 5)).toBeCloseTo(30));
  it("returns null for zero EPS", () => expect(peFn(150, 0)).toBeNull());
  it("handles negative EPS", () => expect(peFn(150, -5)).toBeCloseTo(-30));
});

describe("P/B Ratio", () => {
  it("calculates correctly", () => expect(pbFn(150, 20)).toBeCloseTo(7.5));
  it("returns null for zero book value", () => expect(pbFn(150, 0)).toBeNull());
  it("calculates from market cap", () => expect(pbFromMarketCap(150000, 40000)).toBeCloseTo(3.75));
});

describe("P/S Ratio", () => {
  it("calculates correctly", () => expect(psFn(150, 50)).toBeCloseTo(3));
  it("returns null for zero revenue per share", () => expect(psFn(150, 0)).toBeNull());
  it("calculates from market cap", () => expect(psFromMarketCap(150000, 50000)).toBeCloseTo(3));
});

describe("PEG Ratio", () => {
  it("calculates correctly", () => expect(pegFn(30, 0.15)).toBeCloseTo(200));
  it("returns null for zero growth rate", () => expect(pegFn(30, 0)).toBeNull());
});

describe("Enterprise Value & EV/EBITDA", () => {
  it("calculates enterprise value", () => expect(calculateEnterpriseValue(150000, 20000, 5000)).toBe(165000));
  it("handles net cash (EV < market cap)", () => expect(calculateEnterpriseValue(100000, 5000, 20000)).toBe(85000));
  it("calculates EV/EBITDA", () => expect(evEbitda(165000, 10000)).toBeCloseTo(16.5));
  it("returns null for zero EBITDA", () => expect(evEbitda(165000, 0)).toBeNull());
});

describe("Dividend Yield", () => {
  it("calculates correctly", () => expect(dividendYield(1.5, 150)).toBeCloseTo(0.01));
  it("returns null for zero price", () => expect(dividendYield(1.5, 0)).toBeNull());
});

describe("DCF Model", () => {
  it("returns a positive enterprise value", () => {
    const result = calculateDCF([3000, 3500, 4000, 4500, 5000], 0.10, 0.025);
    expect(result).not.toBeNull();
    expect(result!).toBeGreaterThan(0);
  });

  it("returns null when discount rate <= terminal growth rate", () => {
    expect(calculateDCF([1000], 0.02, 0.03)).toBeNull();
  });

  it("returns null for empty FCF array", () => {
    expect(calculateDCF([], 0.10, 0.025)).toBeNull();
  });

  it("calculates implied share price", () => {
    const ev = calculateDCF([3000, 3500, 4000], 0.10, 0.025)!;
    const price = impliedSharePrice(ev, 20000, 5000, 1000);
    expect(price).not.toBeNull();
    expect(price!).toBeGreaterThan(0);
  });

  it("returns null for zero shares outstanding", () => {
    expect(impliedSharePrice(100000, 20000, 5000, 0)).toBeNull();
  });
});

describe("Graham Number", () => {
  it("calculates correctly", () => {
    expect(grahamNumber(5, 20)).toBeCloseTo(Math.sqrt(22.5 * 5 * 20));
  });
  it("returns null for negative EPS", () => expect(grahamNumber(-5, 20)).toBeNull());
  it("returns null for negative book value", () => expect(grahamNumber(5, -20)).toBeNull());
  it("returns null for zero values", () => expect(grahamNumber(0, 20)).toBeNull());
});

describe("Price-to-Cash-Flow", () => {
  it("calculates from market cap", () => expect(priceToCashFlow(150000, 10000)).toBeCloseTo(15));
  it("calculates per-share variant", () => expect(priceToCashFlowPerShare(150, 10000, 1000)).toBeCloseTo(15));
  it("returns null for zero cash flow", () => expect(priceToCashFlow(150000, 0)).toBeNull());
  it("returns null for zero shares in per-share variant", () => expect(priceToCashFlowPerShare(150, 10000, 0)).toBeNull());
});

describe("Earnings Yield", () => {
  it("calculates correctly (inverse of P/E)", () => {
    const ey = earningsYield(5, 150);
    expect(ey).toBeCloseTo(1 / 30);
  });
  it("returns null for zero price", () => expect(earningsYield(5, 0)).toBeNull());
});

describe("EV/Revenue", () => {
  it("calculates correctly", () => expect(evRevenue(165000, 50000)).toBeCloseTo(3.3));
  it("returns null for zero revenue", () => expect(evRevenue(165000, 0)).toBeNull());
});

describe("EV/FCF", () => {
  it("calculates correctly", () => expect(evFcf(165000, 10000)).toBeCloseTo(16.5));
  it("returns null for zero FCF", () => expect(evFcf(165000, 0)).toBeNull());
});
