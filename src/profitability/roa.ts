import { safeDivide } from "../core/safeDivide";

/**
 * Return on Assets (ROA)
 * Formula: Net Income / Total Assets
 * Interpretation:
 * - Shows how efficiently a company uses its assets to generate profit.
 * - > 5% → Generally good, heavily depends on industry.
 */
export const roa = (netIncome: number, totalAssets: number): number | null =>
  safeDivide(netIncome, totalAssets);
