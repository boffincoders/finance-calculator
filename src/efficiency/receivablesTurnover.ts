import { safeDivide } from "../core/safeDivide";

/**
 * Receivables Turnover
 * How many times a company collects its average accounts receivable in a period.
 * Higher is better — indicates faster collection and less credit risk.
 *
 * @param totalRevenue Total revenue
 * @param tradeReceivables Trade receivables (accounts receivable)
 * @returns Receivables turnover ratio or null
 */
export const receivablesTurnover = (
  totalRevenue: number,
  tradeReceivables: number
): number | null => safeDivide(totalRevenue, tradeReceivables);

/**
 * Days Sales Outstanding (DSO)
 * The average number of days it takes to collect payment after a sale.
 * Lower is better — under 45 days is generally healthy.
 *
 * @param totalRevenue Total revenue
 * @param tradeReceivables Trade receivables
 * @returns DSO in days or null
 */
export const daysSalesOutstanding = (
  totalRevenue: number,
  tradeReceivables: number
): number | null => {
  const rt = receivablesTurnover(totalRevenue, tradeReceivables);
  return rt !== null ? safeDivide(365, rt) : null;
};
