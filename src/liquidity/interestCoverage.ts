import { safeDivide } from "../core/safeDivide";

/**
 * Interest Coverage Ratio
 * Formula: EBIT (Operating Income) / Interest Expense
 * Interpretation:
 * - < 1.5 → Questionable ability to handle debt interest
 * - > 3.0 → Strong ability to meet interest obligations
 */
export const interestCoverage = (ebit: number, interestExpense: number): number | null =>
  safeDivide(ebit, interestExpense);
