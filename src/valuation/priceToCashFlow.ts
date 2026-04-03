import { safeDivide } from "../core/safeDivide";

/**
 * Price-to-Cash-Flow (P/CF)
 * A valuation multiple using operating cash flow instead of reported earnings.
 * More resistant to earnings manipulation than P/E.
 *
 * @param marketCap Total market capitalisation
 * @param operatingCashFlow Operating cash flow (from cash flow statement)
 * @returns P/CF ratio or null
 */
export const priceToCashFlow = (
  marketCap: number,
  operatingCashFlow: number
): number | null => safeDivide(marketCap, operatingCashFlow);

/**
 * Price-to-Cash-Flow from per-share data.
 *
 * @param price Current share price
 * @param operatingCashFlow Total operating cash flow
 * @param sharesOutstanding Total shares outstanding
 * @returns P/CF ratio or null
 */
export const priceToCashFlowPerShare = (
  price: number,
  operatingCashFlow: number,
  sharesOutstanding: number
): number | null => {
  const cfPerShare = safeDivide(operatingCashFlow, sharesOutstanding);
  if (cfPerShare === null) return null;
  return safeDivide(price, cfPerShare);
};
