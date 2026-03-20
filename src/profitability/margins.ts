import { safeDivide } from "../core/safeDivide";

/**
 * Gross Margin
 * Formula: (Total Revenue - Cost of Revenue) / Total Revenue
 */
export const grossMargin = (revenue: number, costOfRevenue: number): number | null => {
  const grossProfit = revenue - costOfRevenue;
  return safeDivide(grossProfit, revenue);
};

/**
 * Operating Margin
 * Formula: Operating Income / Total Revenue
 */
export const operatingMargin = (operatingIncome: number, revenue: number): number | null =>
  safeDivide(operatingIncome, revenue);

/**
 * Net Profit Margin
 * Formula: Net Income / Total Revenue
 */
export const netProfitMargin = (netIncome: number, revenue: number): number | null =>
  safeDivide(netIncome, revenue);

/**
 * Free Cash Flow (FCF) Margin
 * Formula: Free Cash Flow / Total Revenue
 */
export const fcfMargin = (freeCashFlow: number, revenue: number): number | null =>
  safeDivide(freeCashFlow, revenue);
