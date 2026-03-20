import { safeDivide } from "../core/safeDivide";

/**
 * Price to Sales Ratio (P/S)
 * Formula: Price / Revenue Per Share
 * OR: Market Cap / Total Revenue
 * Interpretation:
 * - < 1 → Excellent value
 * - 1–2 → Good value
 * - > 4 → Expensive
 */
export const ps = (price: number, revenuePerShare: number): number | null =>
  safeDivide(price, revenuePerShare);

export const psFromMarketCap = (marketCap: number, totalRevenue: number): number | null =>
  safeDivide(marketCap, totalRevenue);
