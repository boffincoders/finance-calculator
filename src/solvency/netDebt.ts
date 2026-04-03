import { safeDivide } from "../core/safeDivide";

/**
 * Net Debt
 * Total debt minus cash and cash equivalents.
 * A negative result means the company holds more cash than debt (net cash position).
 *
 * @param totalDebt Total debt (short-term + long-term)
 * @param cashAndEquivalents Cash and cash equivalents
 * @returns Net debt (can be negative for net cash companies)
 */
export const netDebt = (
  totalDebt: number,
  cashAndEquivalents: number
): number => totalDebt - cashAndEquivalents;

/**
 * Net Debt to EBITDA
 * Key leverage ratio used widely by analysts and credit agencies.
 * Indicates how many years of EBITDA it would take to repay all debt.
 *
 * @param totalDebt Total debt
 * @param cashAndEquivalents Cash and equivalents
 * @param ebitda Earnings before interest, taxes, depreciation, and amortisation
 * @returns Ratio or null if EBITDA is zero/negative
 */
export const netDebtToEbitda = (
  totalDebt: number,
  cashAndEquivalents: number,
  ebitda: number
): number | null => {
  const nd = netDebt(totalDebt, cashAndEquivalents);
  return safeDivide(nd, ebitda);
};

/**
 * Debt to Assets Ratio
 * Shows what proportion of a company's assets are financed by debt.
 *
 * @param totalDebt Total debt
 * @param totalAssets Total assets
 * @returns Ratio (0-1 range) or null
 */
export const debtToAssets = (
  totalDebt: number,
  totalAssets: number
): number | null => safeDivide(totalDebt, totalAssets);
