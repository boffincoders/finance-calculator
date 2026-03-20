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

  altmanZScore: (value: number | null): EvaluatedMetric => {
    if (value === null) return { value, status: "N/A", insight: "Data unavailable." };
    if (value >= 2.99) return { value, status: "Good", insight: "Safe Zone. Very low risk of bankruptcy." };
    if (value >= 1.81) return { value, status: "Neutral", insight: "Grey Zone. Exercise caution." };
    return { value, status: "Bad", insight: "Distress Zone. High risk of bankruptcy." };
  },

  targetUpside: (value: number | null): EvaluatedMetric => {
    if (value === null) return { value, status: "N/A", insight: "No analyst targets available." };
    if (value > 0.10) return { value, status: "Good", insight: `Analysts predict a ${Math.round(value * 100)}% upside.` };
    if (value > -0.05) return { value, status: "Neutral", insight: "Trading near analyst fair value." };
    return { value, status: "Bad", insight: `Analysts predict a ${Math.round(value * 100)}% downside.` };
  }
};
