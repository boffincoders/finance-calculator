import { safeDivide } from "../core/safeDivide";

/**
 * Debt to Equity Ratio
 * Formula: Total Debt / Total Equity
 * Interpretation:
 * - Evaluates financial leverage.
 * - > 2.0 → High leverage, potentially high risk (industry dependent).
 */
export const debtToEquity = (totalDebt: number, totalEquity: number): number | null =>
  safeDivide(totalDebt, totalEquity);
