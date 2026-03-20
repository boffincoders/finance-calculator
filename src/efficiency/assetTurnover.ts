import { safeDivide } from "../core/safeDivide";

/**
 * Asset Turnover Ratio
 * Formula: Total Revenue / Average Total Assets
 * Interpretation:
 * - Measures the efficiency of a company's use of its assets in generating sales revenue.
 * - Higher is generally better, though heavily industry-dependent.
 */
export const assetTurnover = (revenue: number, averageTotalAssets: number): number | null =>
  safeDivide(revenue, averageTotalAssets);
