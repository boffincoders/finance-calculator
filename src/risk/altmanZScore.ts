import { safeDivide } from "../core/safeDivide";

/**
 * Altman Z-Score Model
 * Formula: 1.2A + 1.4B + 3.3C + 0.6D + 1.0E
 * Where:
 * A = Working Capital / Total Assets
 * B = Retained Earnings / Total Assets
 * C = EBIT / Total Assets
 * D = Market Value of Equity / Total Liabilities
 * E = Sales / Total Assets
 *
 * Interpretation:
 * - > 2.99 → "Safe" Zone
 * - 1.81 to 2.99 → "Grey" Zone
 * - < 1.81 → "Distress" Zone (High probability of bankruptcy)
 */
export const altmanZScore = (
  workingCapital: number,
  retainedEarnings: number,
  ebit: number,
  marketValueEquity: number,
  sales: number,
  totalAssets: number,
  totalLiabilities: number
): number | null => {
  if (totalAssets === 0 || totalLiabilities === 0) return null;

  const A = safeDivide(workingCapital, totalAssets) || 0;
  const B = safeDivide(retainedEarnings, totalAssets) || 0;
  const C = safeDivide(ebit, totalAssets) || 0;
  const D = safeDivide(marketValueEquity, totalLiabilities) || 0;
  const E = safeDivide(sales, totalAssets) || 0;

  return 1.2 * A + 1.4 * B + 3.3 * C + 0.6 * D + 1.0 * E;
};
