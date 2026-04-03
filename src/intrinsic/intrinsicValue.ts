/**
 * Simplified Intrinsic Value Estimate
 * Formula: EPS × (1 + growthRate) ^ years / (1 + discountRate) ^ years
 *          applied over a default 5-year horizon, then divided by (1 - safetyMargin)
 *
 * A lightweight DCF approximation for quick screening:
 *   intrinsicValue = (EPS × (1 + growthRate)^5) / (1 - safetyMargin)
 *
 * Parameters:
 * @param eps           Earnings Per Share (current or TTM)
 * @param growthRate    Expected annual EPS growth rate as a decimal (e.g. 0.15 for 15%)
 * @param safetyMargin  Margin of safety as a decimal (e.g. 0.25 for 25% discount)
 *
 * Interpretation:
 * - If market price < intrinsicValue → potential undervaluation
 * - safetyMargin of 0.25–0.35 is conventional for conservative investing
 *
 * Returns null for non-positive EPS or invalid inputs.
 */
export const computeIntrinsicValue = (
  eps: number,
  growthRate: number,
  safetyMargin: number
): number | null => {
  if (eps == null || eps <= 0) return null;
  if (growthRate < -1) return null;
  if (safetyMargin < 0 || safetyMargin >= 1) return null;

  const futureEps = eps * Math.pow(1 + growthRate, 5);
  return futureEps / (1 - safetyMargin);
};
