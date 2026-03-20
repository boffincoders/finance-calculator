import { safeDivide } from "../core/safeDivide";

/**
 * Return on Invested Capital (ROIC)
 * Formula: NOPAT / Invested Capital
 * NOPAT = Operating Income * (1 - Tax Rate)
 * Invested Capital = Total Debt + Total Equity - Cash & Equivalents
 * Interpretation:
 * - > 2% over WACC is generally considered wealth-creating.
 * - Shows how well a company allocates capital to generate returns.
 */
export const roic = (
  operatingIncome: number,
  taxRate: number,
  totalDebt: number,
  totalEquity: number,
  cashAndEquivalents: number
): number | null => {
  const nopat = operatingIncome * (1 - taxRate);
  const investedCapital = totalDebt + totalEquity - cashAndEquivalents;
  return safeDivide(nopat, investedCapital);
};
