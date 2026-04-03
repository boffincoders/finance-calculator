import { describe, it, expect } from "vitest";
import { assetTurnover } from "../efficiency/assetTurnover";
import { inventoryTurnover } from "../efficiency/inventoryTurnover";
import { receivablesTurnover, daysSalesOutstanding } from "../efficiency/receivablesTurnover";
import { payoutRatio } from "../quality/payoutRatio";
import { cashConversionRatio } from "../quality/cashConversionRatio";

describe("Asset Turnover", () => {
  it("calculates correctly", () => expect(assetTurnover(50000, 100000)).toBeCloseTo(0.5));
  it("returns null for zero assets", () => expect(assetTurnover(50000, 0)).toBeNull());
});

describe("Inventory Turnover", () => {
  it("calculates correctly", () => expect(inventoryTurnover(20000, 10000)).toBeCloseTo(2));
  it("returns null for zero inventory", () => expect(inventoryTurnover(20000, 0)).toBeNull());
});

describe("Receivables Turnover", () => {
  it("calculates correctly", () => expect(receivablesTurnover(50000, 6250)).toBeCloseTo(8));
  it("returns null for zero receivables", () => expect(receivablesTurnover(50000, 0)).toBeNull());
});

describe("Days Sales Outstanding", () => {
  it("calculates correctly from receivables turnover of 8", () => {
    expect(daysSalesOutstanding(50000, 6250)).toBeCloseTo(365 / 8);
  });
  it("returns null for zero receivables", () => expect(daysSalesOutstanding(50000, 0)).toBeNull());
  it("is inversely correlated with receivables turnover", () => {
    const dso1 = daysSalesOutstanding(50000, 5000)!;
    const dso2 = daysSalesOutstanding(50000, 10000)!;
    expect(dso2).toBeGreaterThan(dso1);
  });
});

describe("Payout Ratio", () => {
  it("calculates correctly", () => expect(payoutRatio(2, 5)).toBeCloseTo(0.4));
  it("returns null for zero EPS", () => expect(payoutRatio(2, 0)).toBeNull());
  it("can exceed 1.0 (unsustainable dividend)", () => expect(payoutRatio(8, 5)).toBeCloseTo(1.6));
  it("is zero for zero dividend", () => expect(payoutRatio(0, 5)).toBeCloseTo(0));
});

describe("Cash Conversion Ratio", () => {
  it("returns > 1 when cash flow exceeds income", () => {
    expect(cashConversionRatio(6000, 5000)).toBeCloseTo(1.2);
  });
  it("returns < 1 when income exceeds cash flow", () => {
    expect(cashConversionRatio(4000, 5000)).toBeCloseTo(0.8);
  });
  it("returns null for zero net income", () => expect(cashConversionRatio(5000, 0)).toBeNull());
  it("handles negative cash flow", () => expect(cashConversionRatio(-1000, 5000)).toBeCloseTo(-0.2));
});
