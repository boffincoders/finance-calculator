import { safeDivide } from "../core/safeDivide";

/**
 * Price to Book Ratio (P/B)
 * Formula: Price / Book Value Per Share
 * OR: Market Cap / Total Equity
 * Interpretation:
 * - < 1 → potentially undervalued (or company is in trouble)
 * - 1–3 → healthy/fair
 * - > 3 → expensive (growth expected)
 */
export const pb = (price: number, bookValuePerShare: number): number | null =>
  safeDivide(price, bookValuePerShare);

export const pbFromMarketCap = (marketCap: number, totalEquity: number): number | null =>
  safeDivide(marketCap, totalEquity);
