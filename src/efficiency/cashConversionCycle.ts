/**
 * Cash Conversion Cycle (CCC)
 * Formula: Debtor Days + Inventory Days - Payable Days
 * Interpretation:
 * - Measures the number of days it takes to convert inventory/payables into cash.
 * - Lower (or negative) is better — negative CCC means the company collects cash
 *   before it pays its suppliers (e.g. e-commerce, supermarkets).
 * - High positive CCC indicates capital is tied up in operations for longer.
 */
export const cashConversionCycle = (
  debtorDays: number,
  inventoryDays: number,
  payableDays: number
): number => debtorDays + inventoryDays - payableDays;
