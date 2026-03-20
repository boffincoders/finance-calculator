import { safeDivide } from "../core/safeDivide";

/**
 * Dividend Yield
 * Formula: Annual Dividend Per Share / Price
 * Interpretation:
 * - Shows the return on investment from dividends alone (percentage).
 */
export const dividendYield = (annualDividendPerShare: number, price: number): number | null =>
  safeDivide(annualDividendPerShare, price);
