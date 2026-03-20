import { safeDivide } from "../core/safeDivide";

/**
 * Quick Ratio (Acid-Test Ratio)
 * Formula: (Current Assets - Inventory) / Current Liabilities
 * Or more strictly: (Cash + Short-term Investments + Accounts Receivable) / Current Liabilities
 * Interpretation:
 * - < 1 → Cannot fully pay back its current liabilities right now
 * - > 1 → Considered to be in a good liquidity position
 */
export const quickRatio = (
  currentAssets: number,
  inventory: number,
  currentLiabilities: number
): number | null => {
  const liquidAssets = currentAssets - inventory;
  return safeDivide(liquidAssets, currentLiabilities);
};
