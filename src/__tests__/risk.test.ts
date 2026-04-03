import { describe, it, expect } from "vitest";
import { altmanZScore } from "../risk/altmanZScore";
import { sharpe } from "../risk/sharpe";
import { piotroski } from "../risk/piotroski";

describe("Altman Z-Score", () => {
  it("returns a value in safe zone for healthy company", () => {
    // X1=0.15 X2=0.20 X3=0.075 X4=250000/60000=4.17 X5=0.5 → Z ≈ 3.71
    const z = altmanZScore(15000, 20000, 7500, 250000, 50000, 100000, 60000);
    expect(z).not.toBeNull();
    expect(z!).toBeGreaterThanOrEqual(2.99);
  });

  it("returns null when total assets or liabilities are zero", () => {
    expect(altmanZScore(15000, 20000, 7500, 150000, 50000, 0, 60000)).toBeNull();
    expect(altmanZScore(15000, 20000, 7500, 150000, 50000, 100000, 0)).toBeNull();
  });

  it("returns a low score for a distressed company", () => {
    // Very high liabilities, low assets, negative earnings
    const z = altmanZScore(-5000, -10000, -2000, 10000, 5000, 20000, 80000);
    expect(z!).toBeLessThan(1.81);
  });
});

describe("Sharpe Ratio", () => {
  it("calculates correctly", () => {
    expect(sharpe(0.12, 0.04, 0.15)).toBeCloseTo((0.12 - 0.04) / 0.15);
  });
  it("returns null for zero standard deviation", () => {
    expect(sharpe(0.12, 0.04, 0)).toBeNull();
  });
  it("is negative when return is below risk-free rate", () => {
    expect(sharpe(0.02, 0.05, 0.15)!).toBeLessThan(0);
  });
});

describe("Piotroski F-Score", () => {
  it("scores 4/4 on profitability signals with strong current data", () => {
    const result = piotroski({
      netIncome: 5000,
      totalAssets: 100000,
      operatingCashFlow: 7000,
      // F3 not possible (no prior), F4: CFO/Assets (0.07) > ROA (0.05) → true
    });
    expect(result.signals.f1_positiveROA).toBe(true);
    expect(result.signals.f2_positiveCFO).toBe(true);
    expect(result.signals.f3_improvingROA).toBeNull();
    expect(result.signals.f4_accrualQuality).toBe(true);
    expect(result.score).toBe(3);
    expect(result.maxScore).toBe(3); // F3 is null (no prior), so only F1+F2+F4 counted
  });

  it("F3: detects improving ROA year-over-year", () => {
    const result = piotroski({
      netIncome: 6000,
      totalAssets: 100000,
      operatingCashFlow: 7000,
      priorNetIncome: 4000,
      priorTotalAssets: 100000,
    });
    expect(result.signals.f3_improvingROA).toBe(true);
  });

  it("F3: detects deteriorating ROA", () => {
    const result = piotroski({
      netIncome: 3000,
      totalAssets: 100000,
      operatingCashFlow: 7000,
      priorNetIncome: 6000,
      priorTotalAssets: 100000,
    });
    expect(result.signals.f3_improvingROA).toBe(false);
  });

  it("F4: fails accrual quality when income > cash flow (earnings inflation)", () => {
    const result = piotroski({
      netIncome: 8000,
      totalAssets: 100000,
      operatingCashFlow: 3000, // CFO/Assets (0.03) < ROA (0.08) → bad quality
    });
    expect(result.signals.f4_accrualQuality).toBe(false);
  });

  it("F5: detects falling long-term leverage", () => {
    const result = piotroski({
      netIncome: 5000,
      totalAssets: 100000,
      operatingCashFlow: 7000,
      longTermDebt: 15000,
      priorLongTermDebt: 25000,
      priorTotalAssets: 100000,
    });
    expect(result.signals.f5_fallingLeverage).toBe(true);
  });

  it("F7: detects no share dilution", () => {
    const result = piotroski({
      netIncome: 5000,
      totalAssets: 100000,
      operatingCashFlow: 7000,
      sharesOutstanding: 1000,
      priorSharesOutstanding: 1000,
    });
    expect(result.signals.f7_noDilution).toBe(true);
  });

  it("F7: detects dilution", () => {
    const result = piotroski({
      netIncome: 5000,
      totalAssets: 100000,
      operatingCashFlow: 7000,
      sharesOutstanding: 1200,
      priorSharesOutstanding: 1000,
    });
    expect(result.signals.f7_noDilution).toBe(false);
  });

  it("scores 0 for a distressed company with negative cash flow", () => {
    const result = piotroski({
      netIncome: -2000,
      totalAssets: 100000,
      operatingCashFlow: -500,
      priorNetIncome: -1000,
      priorTotalAssets: 100000,
      sharesOutstanding: 1500,
      priorSharesOutstanding: 1000,
      longTermDebt: 50000,
      priorLongTermDebt: 40000,
    });
    expect(result.score).toBe(0);
  });

  it("maxScore increases with each additional prior-year field", () => {
    const minimal = piotroski({ netIncome: 5000, totalAssets: 100000, operatingCashFlow: 7000 });
    const withPrior = piotroski({ netIncome: 5000, totalAssets: 100000, operatingCashFlow: 7000, priorNetIncome: 3000, priorTotalAssets: 100000 });
    expect(withPrior.maxScore).toBeGreaterThan(minimal.maxScore);
  });
});
