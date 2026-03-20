
import { safeDivide } from "../core/safeDivide";

/**
 * Price to Earnings Ratio (PE)
 * Formula: Price / EPS
 * Interpretation:
 * - < 15 → potentially undervalued
 * - 15–25 → fair
 * - > 25 → expensive (growth expected)
 */
export const pe = (price: number, eps: number): number | null =>
  safeDivide(price, eps);
