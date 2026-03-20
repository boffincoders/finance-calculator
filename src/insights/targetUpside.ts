import { safeDivide } from "../core/safeDivide";

/**
 * Analyst Target Upside / Downside
 * Formula: (Target Price - Current Price) / Current Price
 * Interpretation:
 * - Positive percentage → Upside potential (expected to grow)
 * - Negative percentage → Downside risk (expected to drop)
 */
export const targetUpside = (currentPrice: number, targetPrice: number): number | null => {
  const diff = targetPrice - currentPrice;
  return safeDivide(diff, currentPrice);
};
