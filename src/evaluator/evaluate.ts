export type MetricStatus = "Good" | "Neutral" | "Bad" | "N/A";

export interface EvaluatedMetric {
  value: number | null;
  status: MetricStatus;
  insight: string;
}

/**
 * The Evaluator centralizes interpretation of all financial metrics.
 * It provides newbie-friendly insights.
 * Note: These are generic rules of thumb and vary heavily by industry.
 */
export const evaluate = {
  // ── Valuation ─────────────────────────────────────────────────────────────

  pe: (value: number | null): EvaluatedMetric => {
    if (value === null || value <= 0) return { value, status: "N/A", insight: "Earnings are negative or unavailable." };
    if (value < 15) return { value, status: "Good", insight: "Potentially undervalued or a value stock." };
    if (value <= 25) return { value, status: "Neutral", insight: "Fairly valued for most markets." };
    return { value, status: "Bad", insight: "Expensive. High growth is priced in." };
  },

  pb: (value: number | null): EvaluatedMetric => {
    if (value === null || value <= 0) return { value, status: "N/A", insight: "Book value negative or unavailable." };
    if (value < 1) return { value, status: "Good", insight: "Trading below book value (undervalued)." };
    if (value <= 3) return { value, status: "Neutral", insight: "Healthy evaluation." };
    return { value, status: "Bad", insight: "Trading at a high premium to book value." };
  },

  ps: (value: number | null): EvaluatedMetric => {
    if (value === null || value <= 0) return { value, status: "N/A", insight: "Sales data unavailable." };
    if (value < 1) return { value, status: "Good", insight: "Excellent value per dollar of sales." };
    if (value <= 2) return { value, status: "Neutral", insight: "Average pricing for sales." };
    return { value, status: "Bad", insight: "High correlation to sales, could mean overvalued." };
  },

  peg: (value: number | null): EvaluatedMetric => {
    if (value === null || value <= 0) return { value, status: "N/A", insight: "Cannot calculate PEG meaningfully." };
    if (value < 1) return { value, status: "Good", insight: "Undervalued relative to expected growth." };
    if (value <= 1.5) return { value, status: "Neutral", insight: "Fairly valued relative to growth." };
    return { value, status: "Bad", insight: "Overvalued relative to growth expectations." };
  },

  evEbitda: (value: number | null): EvaluatedMetric => {
    if (value === null || value <= 0) return { value, status: "N/A", insight: "Negative EBITDA or unavailable." };
    if (value < 10) return { value, status: "Good", insight: "Generally considered healthy and cheap." };
    if (value <= 15) return { value, status: "Neutral", insight: "Fairly valued." };
    return { value, status: "Bad", insight: "Expensive relative to cash earnings." };
  },

  dividendYield: (value: number | null): EvaluatedMetric => {
    if (value === null) return { value, status: "N/A", insight: "Dividend data not available." };
    if (value > 0.02 && value < 0.06) return { value, status: "Good", insight: "Healthy and sustainable dividend." };
    if (value >= 0.06) return { value, status: "Neutral", insight: "High dividend, ensure it's not a value trap." };
    if (value > 0) return { value, status: "Neutral", insight: "Small dividend payout." };
    return { value: 0, status: "N/A", insight: "No dividend paid." };
  },

  /**
   * Price-to-Cash-Flow
   * Cash flow is harder to manipulate than earnings, making this a more
   * conservative valuation check.
   */
  priceToCashFlow: (value: number | null): EvaluatedMetric => {
    if (value === null || value <= 0) return { value, status: "N/A", insight: "Negative or unavailable cash flow." };
    if (value < 10) return { value, status: "Good", insight: "Attractive valuation relative to cash flow." };
    if (value <= 20) return { value, status: "Neutral", insight: "Fairly valued on a cash flow basis." };
    return { value, status: "Bad", insight: "Expensive relative to cash generated." };
  },

  /**
   * Earnings Yield (inverse of P/E, expressed as a decimal)
   * Comparable to bond yields — helps assess opportunity cost.
   */
  earningsYield: (value: number | null): EvaluatedMetric => {
    if (value === null || value <= 0) return { value, status: "N/A", insight: "Negative earnings or unavailable." };
    const pct = Math.round(value * 10000) / 100; // e.g. 0.0667 → 6.67%
    if (value > 0.0667) return { value, status: "Good", insight: `Strong ${pct}% earnings yield — better than average bond rate.` };
    if (value >= 0.04) return { value, status: "Neutral", insight: `Moderate ${pct}% earnings yield.` };
    return { value, status: "Bad", insight: `Low ${pct}% earnings yield — stock may be expensive vs bonds.` };
  },

  /**
   * EV/Revenue — especially relevant for pre-profit or high-growth companies.
   */
  evRevenue: (value: number | null): EvaluatedMetric => {
    if (value === null || value <= 0) return { value, status: "N/A", insight: "Revenue data unavailable." };
    if (value < 1) return { value, status: "Good", insight: "Very cheap relative to revenue." };
    if (value <= 3) return { value, status: "Neutral", insight: "Reasonable revenue multiple." };
    return { value, status: "Bad", insight: "High revenue multiple — growth must justify the premium." };
  },

  /**
   * EV/FCF — one of the most reliable valuation multiples for mature businesses.
   */
  evFcf: (value: number | null): EvaluatedMetric => {
    if (value === null || value <= 0) return { value, status: "N/A", insight: "Negative FCF or unavailable." };
    if (value < 15) return { value, status: "Good", insight: "Attractively priced on a free cash flow basis." };
    if (value <= 25) return { value, status: "Neutral", insight: "Fairly valued on a free cash flow basis." };
    return { value, status: "Bad", insight: "Expensive on a free cash flow basis." };
  },

  /**
   * Graham Number Margin of Safety
   * Compares the Graham intrinsic value to the current price.
   * A positive margin means the stock trades below its Graham value.
   *
   * @param grahamValue Result of grahamNumber(eps, bookValuePerShare)
   * @param currentPrice Current market price
   */
  grahamNumber: (grahamValue: number | null, currentPrice: number): EvaluatedMetric => {
    if (grahamValue === null || grahamValue <= 0) return { value: null, status: "N/A", insight: "Graham Number unavailable (negative EPS or book value)." };
    const margin = (grahamValue - currentPrice) / grahamValue;
    const pct = Math.round(margin * 100);
    if (margin >= 0.20) return { value: grahamValue, status: "Good", insight: `${pct}% margin of safety — trading well below Graham intrinsic value.` };
    if (margin >= 0) return { value: grahamValue, status: "Neutral", insight: `Modest ${pct}% margin of safety vs Graham Number.` };
    return { value: grahamValue, status: "Bad", insight: `Trading ${Math.abs(pct)}% above Graham intrinsic value.` };
  },

  /**
   * DCF Implied Price vs Current Price
   * Compares the DCF model's implied share price to the current market price.
   *
   * @param impliedPrice Result of impliedSharePrice()
   * @param currentPrice Current market price
   */
  dcf: (impliedPrice: number | null, currentPrice: number): EvaluatedMetric => {
    if (impliedPrice === null || impliedPrice <= 0) return { value: null, status: "N/A", insight: "DCF model could not produce a valid implied price." };
    const upside = (impliedPrice - currentPrice) / currentPrice;
    const pct = Math.round(upside * 100);
    if (upside >= 0.15) return { value: impliedPrice, status: "Good", insight: `DCF implies ${pct}% upside — potentially undervalued.` };
    if (upside >= -0.10) return { value: impliedPrice, status: "Neutral", insight: `DCF implied price is close to market (${pct >= 0 ? '+' : ''}${pct}%).` };
    return { value: impliedPrice, status: "Bad", insight: `DCF implies ${Math.abs(pct)}% downside — market may be overpricing the stock.` };
  },

  // ── Profitability ──────────────────────────────────────────────────────────

  roa: (value: number | null): EvaluatedMetric => {
    if (value === null) return { value, status: "N/A", insight: "Assets or Income unavailable." };
    if (value >= 0.05) return { value, status: "Good", insight: "Efficiently using assets to generate profit." };
    if (value > 0) return { value, status: "Neutral", insight: "Positive but low asset efficiency." };
    return { value, status: "Bad", insight: "Losing money on its assets." };
  },

  roe: (value: number | null): EvaluatedMetric => {
    if (value === null) return { value, status: "N/A", insight: "Equity or Income unavailable." };
    if (value >= 0.15) return { value, status: "Good", insight: "Strong return on shareholder equity." };
    if (value >= 0.10) return { value, status: "Neutral", insight: "Average return on equity." };
    return { value, status: "Bad", insight: "Weak or negative return on equity." };
  },

  roic: (value: number | null): EvaluatedMetric => {
    if (value === null) return { value, status: "N/A", insight: "Capital or NOPAT unavailable." };
    if (value >= 0.10) return { value, status: "Good", insight: "Excellent capital allocator." };
    if (value > 0.02) return { value, status: "Neutral", insight: "Average capital allocator." };
    return { value, status: "Bad", insight: "Destroying shareholder wealth (returns less than typical WACC)." };
  },

  margin: (value: number | null, name: string): EvaluatedMetric => {
    if (value === null) return { value, status: "N/A", insight: "Margin data unavailable." };
    if (value > 0.20) return { value, status: "Good", insight: `Very strong ${name} margin.` };
    if (value > 0.05) return { value, status: "Neutral", insight: `Healthy ${name} margin.` };
    if (value > 0) return { value, status: "Bad", insight: `Very tight ${name} margin.` };
    return { value, status: "Bad", insight: "Losing money (Negative margin)." };
  },

  // ── Liquidity & Solvency ───────────────────────────────────────────────────

  currentRatio: (value: number | null): EvaluatedMetric => {
    if (value === null) return { value, status: "N/A", insight: "Liquidity data unavailable." };
    if (value >= 1.2 && value <= 2) return { value, status: "Good", insight: "Healthy short-term liquidity." };
    if (value > 2) return { value, status: "Neutral", insight: "Highly liquid, possibly inefficient use of assets." };
    return { value, status: "Bad", insight: "Struggling to cover short-term liabilities (< 1.2)." };
  },

  quickRatio: (value: number | null): EvaluatedMetric => {
    if (value === null) return { value, status: "N/A", insight: "Liquidity data unavailable." };
    if (value >= 1.0) return { value, status: "Good", insight: "Can cover short term liabilities without selling inventory." };
    return { value, status: "Bad", insight: "Cannot cover liabilities immediately without inventory sales." };
  },

  debtToEquity: (value: number | null): EvaluatedMetric => {
    if (value === null) return { value, status: "N/A", insight: "Debt data unavailable." };
    if (value < 1.0) return { value, status: "Good", insight: "Funded mostly by equity. Low debt risk." };
    if (value <= 2.0) return { value, status: "Neutral", insight: "Average leverage." };
    return { value, status: "Bad", insight: "High financial leverage. High risk." };
  },

  interestCoverage: (value: number | null): EvaluatedMetric => {
    if (value === null || value <= 0) return { value, status: "N/A", insight: "No debt, or no earnings to cover debt." };
    if (value >= 3.0) return { value, status: "Good", insight: "Easily pays interest on outstanding debt." };
    if (value >= 1.5) return { value, status: "Neutral", insight: "Can pay interest, but margin of safety is narrow." };
    return { value, status: "Bad", insight: "High risk of default on debt interest." };
  },

  /**
   * Net Debt to EBITDA — key leverage metric used by credit analysts.
   * Negative values indicate a net cash position (always Good).
   */
  netDebtToEbitda: (value: number | null): EvaluatedMetric => {
    if (value === null) return { value, status: "N/A", insight: "EBITDA or debt data unavailable." };
    if (value < 0) return { value, status: "Good", insight: "Net cash position — more cash than debt on the balance sheet." };
    if (value < 1.5) return { value, status: "Good", insight: "Low leverage. Debt is very manageable." };
    if (value <= 3.0) return { value, status: "Neutral", insight: "Moderate leverage. Within acceptable range for most industries." };
    return { value, status: "Bad", insight: "High leverage. Could be restrictive if earnings deteriorate." };
  },

  /**
   * Debt to Assets — proportion of assets financed by debt.
   */
  debtToAssets: (value: number | null): EvaluatedMetric => {
    if (value === null) return { value, status: "N/A", insight: "Asset data unavailable." };
    if (value < 0.3) return { value, status: "Good", insight: "Conservatively financed — low debt relative to assets." };
    if (value <= 0.6) return { value, status: "Neutral", insight: "Moderate reliance on debt financing." };
    return { value, status: "Bad", insight: "Heavily debt-financed. Higher insolvency risk." };
  },

  // ── Efficiency ────────────────────────────────────────────────────────────

  /**
   * Asset Turnover — how efficiently revenue is generated from assets.
   * Varies significantly by industry (e.g., retail is high, utilities are low).
   */
  assetTurnover: (value: number | null): EvaluatedMetric => {
    if (value === null || value <= 0) return { value, status: "N/A", insight: "Asset turnover data unavailable." };
    if (value >= 1.0) return { value, status: "Good", insight: "Efficiently generating revenue from its asset base." };
    if (value >= 0.5) return { value, status: "Neutral", insight: "Moderate asset efficiency — compare to sector peers." };
    return { value, status: "Bad", insight: "Low asset utilisation. Possible overcapacity or capital inefficiency." };
  },

  /**
   * Inventory Turnover — how many times inventory is sold per period.
   * High turnover generally means strong demand and lean operations.
   */
  inventoryTurnover: (value: number | null): EvaluatedMetric => {
    if (value === null || value <= 0) return { value, status: "N/A", insight: "Inventory data unavailable." };
    if (value >= 8) return { value, status: "Good", insight: "Fast-moving inventory — strong demand or efficient stock management." };
    if (value >= 4) return { value, status: "Neutral", insight: "Average inventory turnover." };
    return { value, status: "Bad", insight: "Slow-moving inventory. Risk of obsolescence or weak demand." };
  },

  /**
   * Receivables Turnover — how quickly customers pay their invoices.
   */
  receivablesTurnover: (value: number | null): EvaluatedMetric => {
    if (value === null || value <= 0) return { value, status: "N/A", insight: "Receivables data unavailable." };
    if (value >= 8) return { value, status: "Good", insight: "Customers pay quickly (DSO < 46 days). Strong collections." };
    if (value >= 4) return { value, status: "Neutral", insight: "Average collection speed (DSO 46–90 days)." };
    return { value, status: "Bad", insight: "Slow collections (DSO > 90 days). Risk of bad debts." };
  },

  /**
   * Days Sales Outstanding (DSO) — average collection period in days.
   * Lower is better.
   */
  daysSalesOutstanding: (value: number | null): EvaluatedMetric => {
    if (value === null || value <= 0) return { value, status: "N/A", insight: "DSO data unavailable." };
    if (value <= 45) return { value, status: "Good", insight: `${Math.round(value)} days DSO — customers pay promptly.` };
    if (value <= 90) return { value, status: "Neutral", insight: `${Math.round(value)} days DSO — average collection speed.` };
    return { value, status: "Bad", insight: `${Math.round(value)} days DSO — slow collections, elevated credit risk.` };
  },

  // ── Quality of Earnings ───────────────────────────────────────────────────

  /**
   * Dividend Payout Ratio — sustainability check for dividend investors.
   */
  payoutRatio: (value: number | null): EvaluatedMetric => {
    if (value === null || value < 0) return { value, status: "N/A", insight: "Earnings or dividend data unavailable." };
    if (value > 0 && value <= 0.75) return { value, status: "Good", insight: "Sustainable payout — retaining enough earnings for growth." };
    if (value <= 1.0) return { value, status: "Neutral", insight: "Paying out most earnings as dividends. Watch for sustainability." };
    return { value, status: "Bad", insight: "Dividends exceed earnings. Not sustainable without external financing." };
  },

  /**
   * Cash Conversion Ratio — quality of earnings check.
   * A ratio > 1 means cash earnings exceed accounting earnings (high quality).
   */
  cashConversionRatio: (value: number | null): EvaluatedMetric => {
    if (value === null) return { value, status: "N/A", insight: "Cash flow or income data unavailable." };
    if (value >= 1.0) return { value, status: "Good", insight: "Earnings are well-supported by real cash flow. High earnings quality." };
    if (value >= 0.8) return { value, status: "Neutral", insight: "Earnings moderately supported by cash. Monitor accruals." };
    return { value, status: "Bad", insight: "Earnings outpace cash flow. Potential accrual-based inflation of profits." };
  },

  // ── Risk ──────────────────────────────────────────────────────────────────

  altmanZScore: (value: number | null): EvaluatedMetric => {
    if (value === null) return { value, status: "N/A", insight: "Data unavailable." };
    if (value >= 2.99) return { value, status: "Good", insight: "Safe Zone. Very low risk of bankruptcy." };
    if (value >= 1.81) return { value, status: "Neutral", insight: "Grey Zone. Exercise caution." };
    return { value, status: "Bad", insight: "Distress Zone. High risk of bankruptcy." };
  },

  /**
   * Sharpe Ratio — risk-adjusted return.
   * > 2 is excellent, 1–2 is good, 0.5–1 is acceptable.
   */
  sharpe: (value: number | null): EvaluatedMetric => {
    if (value === null) return { value, status: "N/A", insight: "Return or volatility data unavailable." };
    if (value >= 2.0) return { value, status: "Good", insight: "Excellent risk-adjusted return." };
    if (value >= 1.0) return { value, status: "Good", insight: "Good risk-adjusted return." };
    if (value >= 0.5) return { value, status: "Neutral", insight: "Acceptable risk-adjusted return." };
    if (value > 0) return { value, status: "Bad", insight: "Poor risk-adjusted return — not compensating adequately for risk." };
    return { value, status: "Bad", insight: "Negative risk-adjusted return." };
  },

  /**
   * Piotroski F-Score — 9-point financial health scorecard.
   */
  piotroski: (score: number, maxScore: number): EvaluatedMetric => {
    const value = score;
    if (maxScore === 0) return { value, status: "N/A", insight: "Insufficient data for Piotroski scoring." };
    if (score >= 7) return { value, status: "Good", insight: `Strong fundamentals (${score}/${maxScore}). Profitable, low-leverage, improving efficiency.` };
    if (score >= 3) return { value, status: "Neutral", insight: `Mixed signals (${score}/${maxScore}). Some positives but not across the board.` };
    return { value, status: "Bad", insight: `Weak fundamentals (${score}/${maxScore}). Multiple financial health signals are negative.` };
  },

  // ── Analyst Targets ───────────────────────────────────────────────────────

  targetUpside: (value: number | null): EvaluatedMetric => {
    if (value === null) return { value, status: "N/A", insight: "No analyst targets available." };
    if (value > 0.10) return { value, status: "Good", insight: `Analysts predict a ${Math.round(value * 100)}% upside.` };
    if (value > -0.05) return { value, status: "Neutral", insight: "Trading near analyst fair value." };
    return { value, status: "Bad", insight: `Analysts predict a ${Math.round(value * 100)}% downside.` };
  },
};
