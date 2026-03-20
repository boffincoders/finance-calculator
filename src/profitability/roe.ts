
import { safeDivide } from "../core/safeDivide";

/**
 * Return on Equity (ROE)
 * Formula: Net Income / Equity
 * Interpretation:
 * - > 15% → strong
 * - 10–15% → average
 * - < 10% → weak
 */
export const roe = (netIncome: number, equity: number): number | null =>
  safeDivide(netIncome, equity);
