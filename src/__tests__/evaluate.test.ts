import { describe, it, expect } from "vitest";
import { evaluate } from "../evaluator/evaluate";

describe("evaluate.pe", () => {
  it("Good for P/E < 15", () => expect(evaluate.pe(12).status).toBe("Good"));
  it("Neutral for P/E 15-25", () => expect(evaluate.pe(20).status).toBe("Neutral"));
  it("Bad for P/E > 25", () => expect(evaluate.pe(35).status).toBe("Bad"));
  it("N/A for null or negative", () => {
    expect(evaluate.pe(null).status).toBe("N/A");
    expect(evaluate.pe(-5).status).toBe("N/A");
  });
});

describe("evaluate.sharpe", () => {
  it("Good for Sharpe >= 1.0", () => expect(evaluate.sharpe(1.5).status).toBe("Good"));
  it("Good for Sharpe >= 2.0 (excellent)", () => expect(evaluate.sharpe(2.5).status).toBe("Good"));
  it("Neutral for Sharpe 0.5-1.0", () => expect(evaluate.sharpe(0.7).status).toBe("Neutral"));
  it("Bad for Sharpe < 0.5", () => expect(evaluate.sharpe(0.3).status).toBe("Bad"));
  it("Bad for negative Sharpe", () => expect(evaluate.sharpe(-0.5).status).toBe("Bad"));
  it("N/A for null", () => expect(evaluate.sharpe(null).status).toBe("N/A"));
});

describe("evaluate.grahamNumber", () => {
  it("Good when price is well below Graham value (> 20% margin)", () => {
    expect(evaluate.grahamNumber(100, 70).status).toBe("Good");
  });
  it("Neutral when price is slightly below Graham value", () => {
    expect(evaluate.grahamNumber(100, 95).status).toBe("Neutral");
  });
  it("Bad when price is above Graham value", () => {
    expect(evaluate.grahamNumber(100, 120).status).toBe("Bad");
  });
  it("N/A for null or zero Graham value", () => {
    expect(evaluate.grahamNumber(null, 100).status).toBe("N/A");
    expect(evaluate.grahamNumber(0, 100).status).toBe("N/A");
  });
});

describe("evaluate.dcf", () => {
  it("Good when implied price is > 15% above current", () => {
    expect(evaluate.dcf(120, 100).status).toBe("Good");
  });
  it("Neutral when implied price is close to current", () => {
    expect(evaluate.dcf(105, 100).status).toBe("Neutral");
  });
  it("Bad when implied price is > 10% below current", () => {
    expect(evaluate.dcf(80, 100).status).toBe("Bad");
  });
  it("N/A for null implied price", () => {
    expect(evaluate.dcf(null, 100).status).toBe("N/A");
  });
});

describe("evaluate.assetTurnover", () => {
  it("Good for >= 1.0", () => expect(evaluate.assetTurnover(1.2).status).toBe("Good"));
  it("Neutral for 0.5-1.0", () => expect(evaluate.assetTurnover(0.7).status).toBe("Neutral"));
  it("Bad for < 0.5", () => expect(evaluate.assetTurnover(0.3).status).toBe("Bad"));
  it("N/A for null or zero", () => {
    expect(evaluate.assetTurnover(null).status).toBe("N/A");
    expect(evaluate.assetTurnover(0).status).toBe("N/A");
  });
});

describe("evaluate.inventoryTurnover", () => {
  it("Good for >= 8", () => expect(evaluate.inventoryTurnover(10).status).toBe("Good"));
  it("Neutral for 4-8", () => expect(evaluate.inventoryTurnover(6).status).toBe("Neutral"));
  it("Bad for < 4", () => expect(evaluate.inventoryTurnover(2).status).toBe("Bad"));
});

describe("evaluate.netDebtToEbitda", () => {
  it("Good for net cash position (negative value)", () => expect(evaluate.netDebtToEbitda(-1).status).toBe("Good"));
  it("Good for < 1.5", () => expect(evaluate.netDebtToEbitda(1.0).status).toBe("Good"));
  it("Neutral for 1.5-3.0", () => expect(evaluate.netDebtToEbitda(2.0).status).toBe("Neutral"));
  it("Bad for > 3.0", () => expect(evaluate.netDebtToEbitda(4.0).status).toBe("Bad"));
});

describe("evaluate.payoutRatio", () => {
  it("Good for 0-75%", () => expect(evaluate.payoutRatio(0.5).status).toBe("Good"));
  it("Neutral for 75-100%", () => expect(evaluate.payoutRatio(0.9).status).toBe("Neutral"));
  it("Bad for > 100%", () => expect(evaluate.payoutRatio(1.2).status).toBe("Bad"));
  it("N/A for null", () => expect(evaluate.payoutRatio(null).status).toBe("N/A"));
});

describe("evaluate.cashConversionRatio", () => {
  it("Good for >= 1.0", () => expect(evaluate.cashConversionRatio(1.2).status).toBe("Good"));
  it("Neutral for 0.8-1.0", () => expect(evaluate.cashConversionRatio(0.9).status).toBe("Neutral"));
  it("Bad for < 0.8", () => expect(evaluate.cashConversionRatio(0.5).status).toBe("Bad"));
});

describe("evaluate.piotroski", () => {
  it("Good for score >= 7", () => expect(evaluate.piotroski(8, 9).status).toBe("Good"));
  it("Neutral for score 3-6", () => expect(evaluate.piotroski(5, 9).status).toBe("Neutral"));
  it("Bad for score <= 2", () => expect(evaluate.piotroski(1, 9).status).toBe("Bad"));
  it("N/A for zero maxScore", () => expect(evaluate.piotroski(0, 0).status).toBe("N/A"));
});

describe("evaluate.earningsYield", () => {
  it("Good for yield > 6.67%", () => expect(evaluate.earningsYield(0.08).status).toBe("Good"));
  it("Neutral for 4-6.67%", () => expect(evaluate.earningsYield(0.05).status).toBe("Neutral"));
  it("Bad for < 4%", () => expect(evaluate.earningsYield(0.02).status).toBe("Bad"));
});

describe("evaluate.priceToCashFlow", () => {
  it("Good for < 10", () => expect(evaluate.priceToCashFlow(8).status).toBe("Good"));
  it("Neutral for 10-20", () => expect(evaluate.priceToCashFlow(15).status).toBe("Neutral"));
  it("Bad for > 20", () => expect(evaluate.priceToCashFlow(25).status).toBe("Bad"));
});
