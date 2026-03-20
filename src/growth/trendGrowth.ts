import { safeDivide } from "../core/safeDivide";

/**
 * Calculate basic growth rate given current and previous values.
 * Useful for building out mapping functions natively in the analyzer.
 */
export const calculateGrowthRate = (currentValue: number, previousValue: number): number | null => {
  if (previousValue === 0) return null; // Prevent infinity or nonsense returns

  // If both are negative and current is "less negative", it's growth, but math requires care
  // We generally use pure absolute change over previous absolute if previous was negative
  // to avoid confusing results. But the standard financial formula:
  return safeDivide(currentValue - previousValue, Math.abs(previousValue));
};

/**
 * Calculates Year-over-Year (YoY) growth rates for a chronological array of annual data points.
 * Expects oldest data first, newest data last. [2021, 2022, 2023]
 */
export const yoyGrowth = (dataPoints: number[]): number[] => {
  const growthRates: number[] = [];

  for (let i = 1; i < dataPoints.length; i++) {
    const prev = dataPoints[i - 1];
    const curr = dataPoints[i];

    const rate = calculateGrowthRate(curr, prev);
    growthRates.push(rate === null ? 0 : rate);
  }

  return growthRates; // Returns array of length (N - 1)
};

/**
 * Calculates Quarter-over-Quarter (QoQ) trailing growth rates for an array of quarterly data.
 * Usually QoQ means Q2 vs Q1. This assumes [Q1, Q2, Q3, Q4] in chronological order.
 */
export const qoqGrowth = (dataPoints: number[]): number[] => yoyGrowth(dataPoints);

/**
 * Compound Annual Growth Rate (CAGR)
 * Formula: (Ending Value / Beginning Value) ^ (1 / Years) - 1
 */
export const cagr = (beginningValue: number, endingValue: number, periods: number): number | null => {
  if (periods <= 0 || beginningValue <= 0 || endingValue < 0) return null;
  return Math.pow(endingValue / beginningValue, 1 / periods) - 1;
};
