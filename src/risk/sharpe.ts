
import { safeDivide } from "../core/safeDivide";

/**
 * Sharpe Ratio
 * Formula: (Return - Risk Free Rate) / Std Dev
 * Interpretation:
 * - > 1 → good
 * - > 2 → very good
 * - < 1 → risky
 */
export const sharpe = (
  returnVal: number,
  riskFree: number,
  stdDev: number
): number | null => safeDivide(returnVal - riskFree, stdDev);
