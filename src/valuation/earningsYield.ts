import { safeDivide } from "../core/safeDivide";

/**
 * Earnings Yield
 * The inverse of the P/E ratio, expressed as a percentage.
 * Useful for comparing stock returns to bond yields.
 *
 * @param eps Earnings per share (trailing twelve months)
 * @param price Current share price
 * @returns Earnings yield as a decimal (e.g., 0.05 = 5%) or null
 */
export const earningsYield = (
  eps: number,
  price: number
): number | null => safeDivide(eps, price);
