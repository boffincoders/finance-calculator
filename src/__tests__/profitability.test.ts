import { describe, it, expect } from "vitest";
import { roa } from "../profitability/roa";
import { roe } from "../profitability/roe";
import { roic } from "../profitability/roic";
import { grossMargin, operatingMargin, netProfitMargin, fcfMargin } from "../profitability/margins";

describe("ROA", () => {
  it("calculates correctly", () => expect(roa(5000, 100000)).toBeCloseTo(0.05));
  it("returns negative for negative income", () => expect(roa(-2000, 100000)).toBeCloseTo(-0.02));
  it("returns null for zero assets", () => expect(roa(5000, 0)).toBeNull());
});

describe("ROE", () => {
  it("calculates correctly", () => expect(roe(5000, 40000)).toBeCloseTo(0.125));
  it("returns null for zero equity", () => expect(roe(5000, 0)).toBeNull());
});

describe("ROIC", () => {
  it("calculates a positive value for profitable companies", () => {
    const result = roic(7000, 0.20, 20000, 40000, 5000);
    expect(result).not.toBeNull();
    expect(result!).toBeGreaterThan(0);
  });
  it("returns null for zero invested capital", () => {
    expect(roic(7000, 0.20, 0, 0, 0)).toBeNull();
  });
});

describe("Margins", () => {
  it("gross margin calculates correctly", () => expect(grossMargin(50000, 20000)).toBeCloseTo(0.6));
  it("operating margin calculates correctly", () => expect(operatingMargin(7000, 50000)).toBeCloseTo(0.14));
  it("net profit margin calculates correctly", () => expect(netProfitMargin(5000, 50000)).toBeCloseTo(0.10));
  it("FCF margin calculates correctly", () => expect(fcfMargin(3000, 50000)).toBeCloseTo(0.06));

  it("returns null when revenue is zero", () => {
    expect(grossMargin(0, 0)).toBeNull();
    expect(operatingMargin(7000, 0)).toBeNull();
    expect(netProfitMargin(5000, 0)).toBeNull();
    expect(fcfMargin(3000, 0)).toBeNull();
  });

  it("handles negative margins", () => expect(netProfitMargin(-1000, 50000)).toBeCloseTo(-0.02));
});
