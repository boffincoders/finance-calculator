import { safeDivide } from "../core/safeDivide";

/**
 * Payable Days (Days Payable Outstanding — DPO)
 * Formula: (Trade Payables / COGS) × 365
 * Interpretation:
 * - How many days on average it takes the company to pay its suppliers.
 * - Higher DPO can indicate strong bargaining power, but excessively high values
 *   may signal liquidity stress or strained supplier relationships.
 */
export const payableDays = (tradePayables: number, cogs: number): number | null =>
  safeDivide(tradePayables * 365, cogs);
