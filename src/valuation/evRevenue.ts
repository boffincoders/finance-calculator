import { safeDivide } from "../core/safeDivide";

/**
 * EV/Revenue (Enterprise Value to Revenue)
 * A valuation multiple useful when earnings are negative or volatile.
 * Common in early-stage and high-growth company analysis.
 *
 * @param enterpriseValue Enterprise value (market cap + debt - cash)
 * @param totalRevenue Total revenue (trailing twelve months)
 * @returns EV/Revenue ratio or null
 */
export const evRevenue = (
  enterpriseValue: number,
  totalRevenue: number
): number | null => safeDivide(enterpriseValue, totalRevenue);
