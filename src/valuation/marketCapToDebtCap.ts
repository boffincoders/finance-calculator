import { safeDivide } from "../core/safeDivide";

/**
 * Market Cap to Total Capitalization Ratio (Market Cap / (Market Cap + Debt))
 * Also known as the equity-to-total-capital ratio.
 * Formula: Market Cap / (Market Cap + Total Debt)
 * Interpretation:
 * - Ranges from 0 to 1.
 * - Higher ratio → company is predominantly equity-financed (lower financial risk).
 * - Lower ratio → company is more debt-heavy relative to its total capital.
 * - Useful for comparing capital structure across companies.
 */
export const marketCapToDebtCap = (marketCap: number, totalDebt: number): number | null =>
  safeDivide(marketCap, marketCap + totalDebt);
