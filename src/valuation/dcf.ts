/**
 * Discounted Cash Flow (DCF) Model
 * Used to estimate the value of an investment based on its expected future cash flows.
 *
 * @param projectedFCF Array of projected Free Cash Flows for N years
 * @param discountRate The required rate of return or WACC (e.g., 0.10 for 10%)
 * @param terminalGrowthRate The expected perpetual growth rate after year N (e.g., 0.025 for 2.5%)
 * @returns The total present value of the company (Enterprise Value)
 */
export const calculateDCF = (
  projectedFCF: number[],
  discountRate: number,
  terminalGrowthRate: number
): number | null => {
  if (projectedFCF.length === 0 || discountRate <= terminalGrowthRate) {
    return null;
  }

  let presentValue = 0;

  // 1. Calculate present value of projected given FCFs
  projectedFCF.forEach((fcf, index) => {
    const year = index + 1;
    presentValue += fcf / Math.pow(1 + discountRate, year);
  });

  // 2. Calculate Terminal Value
  const lastFCF = projectedFCF[projectedFCF.length - 1];
  const terminalValue = (lastFCF * (1 + terminalGrowthRate)) / (discountRate - terminalGrowthRate);

  // 3. Discount Terminal Value to present
  const presentTerminalValue = terminalValue / Math.pow(1 + discountRate, projectedFCF.length);

  return presentValue + presentTerminalValue;
};

/**
 * Implied Share Price from DCF
 *
 * @param enterpriseValue The result of calculateDCF (Total PV)
 * @param totalDebt Total outstanding debt
 * @param cashEquivalents Total cash and cash equivalents
 * @param sharesOutstanding Total number of shares outstanding
 */
export const impliedSharePrice = (
  enterpriseValue: number,
  totalDebt: number,
  cashEquivalents: number,
  sharesOutstanding: number
): number | null => {
  if (sharesOutstanding === 0) return null;
  const equityValue = enterpriseValue - totalDebt + cashEquivalents;
  return equityValue / sharesOutstanding;
};
