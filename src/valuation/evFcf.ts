import { safeDivide } from "../core/safeDivide";

/**
 * EV/FCF (Enterprise Value to Free Cash Flow)
 * One of the most reliable valuation multiples for mature companies.
 * Uses actual cash generation rather than accounting earnings.
 *
 * @param enterpriseValue Enterprise value (market cap + debt - cash)
 * @param freeCashFlow Free cash flow (operating CF - capex)
 * @returns EV/FCF ratio or null
 */
export const evFcf = (
  enterpriseValue: number,
  freeCashFlow: number
): number | null => safeDivide(enterpriseValue, freeCashFlow);
