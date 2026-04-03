import { safeDivide } from "../core/safeDivide";

/**
 * Cash Conversion Ratio (CCR)
 * Measures the quality of reported earnings by comparing operating cash flow
 * to net income. A ratio > 1 means earnings are well-supported by actual cash.
 * Low or negative CCR is a red flag for earnings quality.
 *
 * @param operatingCashFlow Cash flow from operations
 * @param netIncome Net income (profit after tax)
 * @returns CCR ratio or null
 */
export const cashConversionRatio = (
  operatingCashFlow: number,
  netIncome: number
): number | null => safeDivide(operatingCashFlow, netIncome);
