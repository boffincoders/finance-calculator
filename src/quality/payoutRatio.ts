import { safeDivide } from "../core/safeDivide";

/**
 * Dividend Payout Ratio
 * The proportion of earnings paid to shareholders as dividends.
 * Helps assess dividend sustainability. A ratio > 1 means dividends
 * exceed earnings, which may not be sustainable long-term.
 *
 * @param annualDividendPerShare Total dividends paid per share
 * @param eps Earnings per share (trailing twelve months)
 * @returns Payout ratio as a decimal (e.g., 0.40 = 40%) or null
 */
export const payoutRatio = (
  annualDividendPerShare: number,
  eps: number
): number | null => safeDivide(annualDividendPerShare, eps);
