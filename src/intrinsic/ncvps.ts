import { safeDivide } from "../core/safeDivide";

/**
 * Net Current Value Per Share (NCVPS)
 * Formula: (Current Assets - Total Liabilities) / Shares Outstanding
 * Interpretation:
 * - A conservative "liquidation value" per share, inspired by Benjamin Graham's
 *   net-net working capital criterion.
 * - If NCVPS > market price, the stock may be trading below liquidation value —
 *   a deep value signal (but also common in distressed or declining businesses).
 * - Positive NCVPS means current assets alone cover all liabilities.
 */
export const computeNCVPS = (
  currentAssets: number,
  totalLiabilities: number,
  sharesOutstanding: number
): number | null => safeDivide(currentAssets - totalLiabilities, sharesOutstanding);
