import { safeDivide } from "../core/safeDivide";

/**
 * Price/Earnings-to-Growth (PEG) Ratio
 * Formula: PE Ratio / Expected Earnings Growth Rate
 * Interpretation:
 * - < 1 → Undervalued relative to growth
 * - 1 → Fairly valued
 * - > 1 → Overvalued relative to growth
 */
export const peg = (peRatio: number, earningsGrowthRate: number): number | null =>
  safeDivide(peRatio, earningsGrowthRate);
