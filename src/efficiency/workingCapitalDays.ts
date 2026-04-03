import { safeDivide } from "../core/safeDivide";

/**
 * Working Capital Days
 * Formula: (Working Capital / Revenue) × 365
 * Where Working Capital = Current Assets - Current Liabilities
 * Interpretation:
 * - Measures how many days of revenue are tied up in working capital.
 * - Lower is generally better (capital is not locked in operations).
 * - Negative values indicate current liabilities exceed current assets.
 */
export const workingCapitalDays = (workingCapital: number, revenue: number): number | null =>
  safeDivide(workingCapital * 365, revenue);
