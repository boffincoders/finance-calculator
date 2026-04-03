/**
 * Piotroski F-Score
 *
 * A 9-point accounting-based scoring system that separates fundamentally strong
 * companies from weak ones. Originally designed by Joseph Piotroski (2000).
 *
 * Score interpretation:
 *   0–2  → Weak  — fundamentally deteriorating, potential value trap
 *   3–6  → Average — mixed signals
 *   7–9  → Strong — solid fundamentals across profitability, leverage, and efficiency
 *
 * The 9 binary signals (1 point each if met):
 *
 * PROFITABILITY (4 signals)
 *   F1: ROA > 0               — currently profitable
 *   F2: Operating CF > 0      — generating real cash
 *   F3: ROA improving YoY     — profitability trend is positive (requires prior year)
 *   F4: Accrual quality       — operating CF / assets > ROA (cash-backed earnings)
 *
 * LEVERAGE & LIQUIDITY (3 signals)
 *   F5: Long-term debt ratio falling YoY  (requires prior year)
 *   F6: Current ratio improving YoY       (requires prior year)
 *   F7: No new shares issued YoY          (requires prior year)
 *
 * OPERATING EFFICIENCY (2 signals)
 *   F8: Gross margin improving YoY        (requires prior year)
 *   F9: Asset turnover improving YoY      (requires prior year)
 */

export interface PiotroskiInput {
  // Current period — required
  netIncome: number;
  totalAssets: number;
  operatingCashFlow: number;

  // Prior period — enables signals F3, F5–F9
  priorNetIncome?: number;
  priorTotalAssets?: number;

  // For F5: Leverage change (long-term debt / total assets)
  longTermDebt?: number;
  priorLongTermDebt?: number;

  // For F6: Liquidity change (pre-calculated current ratio, or raw CA/CL)
  currentRatioValue?: number;
  priorCurrentRatioValue?: number;

  // For F7: Share dilution check
  sharesOutstanding?: number;
  priorSharesOutstanding?: number;

  // For F8: Gross margin change (pre-calculated or raw)
  grossMarginValue?: number;
  priorGrossMarginValue?: number;

  // For F9: Asset turnover change (pre-calculated or raw via revenue)
  assetTurnoverValue?: number;
  priorAssetTurnoverValue?: number;
}

export interface PiotroskiSignals {
  /** F1: ROA positive this period */
  f1_positiveROA: boolean;
  /** F2: Operating cash flow positive */
  f2_positiveCFO: boolean;
  /** F3: ROA higher than prior year (null if prior data missing) */
  f3_improvingROA: boolean | null;
  /** F4: Cash-backed earnings — CFO/Assets > ROA */
  f4_accrualQuality: boolean;
  /** F5: Long-term leverage ratio falling (null if prior data missing) */
  f5_fallingLeverage: boolean | null;
  /** F6: Current ratio improving YoY (null if prior data missing) */
  f6_improvingLiquidity: boolean | null;
  /** F7: No new shares issued (null if prior data missing) */
  f7_noDilution: boolean | null;
  /** F8: Gross margin improving YoY (null if prior data missing) */
  f8_improvingGrossMargin: boolean | null;
  /** F9: Asset turnover improving YoY (null if prior data missing) */
  f9_improvingAssetTurnover: boolean | null;
}

export interface PiotroskiResult {
  /** Total score out of 9 (null signals treated as 0 — not scored) */
  score: number;
  /** Maximum possible score given available data (1 per non-null signal) */
  maxScore: number;
  signals: PiotroskiSignals;
}

/**
 * Calculates the Piotroski F-Score.
 * Only provide prior-year fields if you have historical data — missing prior-year
 * data causes those signals to be `null` and excluded from the score.
 */
export const piotroski = (input: PiotroskiInput): PiotroskiResult => {
  const {
    netIncome,
    totalAssets,
    operatingCashFlow,
    priorNetIncome,
    priorTotalAssets,
    longTermDebt,
    priorLongTermDebt,
    currentRatioValue,
    priorCurrentRatioValue,
    sharesOutstanding,
    priorSharesOutstanding,
    grossMarginValue,
    priorGrossMarginValue,
    assetTurnoverValue,
    priorAssetTurnoverValue,
  } = input;

  const roa = totalAssets > 0 ? netIncome / totalAssets : 0;
  const cfToAssets = totalAssets > 0 ? operatingCashFlow / totalAssets : 0;

  // F1: ROA > 0
  const f1 = roa > 0;

  // F2: Operating CF > 0
  const f2 = operatingCashFlow > 0;

  // F3: Improving ROA (requires prior year)
  let f3: boolean | null = null;
  if (priorNetIncome !== undefined && priorTotalAssets !== undefined && priorTotalAssets > 0) {
    const priorRoa = priorNetIncome / priorTotalAssets;
    f3 = roa > priorRoa;
  }

  // F4: Accrual quality — CFO > 0 AND CFO / assets > ROA (negative CFO is always a fail)
  const f4 = operatingCashFlow > 0 && cfToAssets > roa;

  // F5: Falling long-term leverage (requires prior year)
  let f5: boolean | null = null;
  if (
    longTermDebt !== undefined &&
    priorLongTermDebt !== undefined &&
    priorTotalAssets !== undefined &&
    priorTotalAssets > 0
  ) {
    const currentLeverage = totalAssets > 0 ? longTermDebt / totalAssets : 0;
    const priorLeverage = priorLongTermDebt / priorTotalAssets;
    f5 = currentLeverage < priorLeverage;
  }

  // F6: Improving current ratio (requires prior year)
  let f6: boolean | null = null;
  if (currentRatioValue !== undefined && priorCurrentRatioValue !== undefined) {
    f6 = currentRatioValue > priorCurrentRatioValue;
  }

  // F7: No new shares issued (requires prior year)
  let f7: boolean | null = null;
  if (sharesOutstanding !== undefined && priorSharesOutstanding !== undefined) {
    f7 = sharesOutstanding <= priorSharesOutstanding;
  }

  // F8: Improving gross margin (requires prior year)
  let f8: boolean | null = null;
  if (grossMarginValue !== undefined && priorGrossMarginValue !== undefined) {
    f8 = grossMarginValue > priorGrossMarginValue;
  }

  // F9: Improving asset turnover (requires prior year)
  let f9: boolean | null = null;
  if (assetTurnoverValue !== undefined && priorAssetTurnoverValue !== undefined) {
    f9 = assetTurnoverValue > priorAssetTurnoverValue;
  }

  const signals: PiotroskiSignals = {
    f1_positiveROA:           f1,
    f2_positiveCFO:           f2,
    f3_improvingROA:          f3,
    f4_accrualQuality:        f4,
    f5_fallingLeverage:       f5,
    f6_improvingLiquidity:    f6,
    f7_noDilution:            f7,
    f8_improvingGrossMargin:  f8,
    f9_improvingAssetTurnover: f9,
  };

  const allSignals = [f1, f2, f3, f4, f5, f6, f7, f8, f9];
  const score    = allSignals.filter(s => s === true).length;
  const maxScore = allSignals.filter(s => s !== null).length;

  return { score, maxScore, signals };
};
