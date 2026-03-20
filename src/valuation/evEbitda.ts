import { safeDivide } from "../core/safeDivide";

/**
 * Enterprise Value to EBITDA (EV/EBITDA)
 * Formula: Enterprise Value / EBITDA
 * Interpretation:
 * - < 10 → Generally considered healthy/undervalued
 * - > 15 → Often considered expensive
 */
export const evEbitda = (enterpriseValue: number, ebitda: number): number | null =>
  safeDivide(enterpriseValue, ebitda);

/**
 * Calculates Enterprise Value (EV) from its basic components
 * Formula: Market Cap + Total Debt - Cash & Cash Equivalents
 */
export const calculateEnterpriseValue = (
  marketCap: number,
  totalDebt: number,
  cashAndEquivalents: number
): number => {
  return marketCap + totalDebt - cashAndEquivalents;
};
