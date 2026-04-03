/**
 * Composite Scoring Engine
 *
 * Four domain scores — Quality, Growth, Value, Momentum — each in range [0, 100].
 * Each score is a weighted sum of normalised sub-signals (also 0-100 or boolean).
 *
 * These scores feed into computeGFactor for the overall composite.
 */

// ---------------------------------------------------------------------------
// Quality Score
// ---------------------------------------------------------------------------

export interface QualityScoreInput {
  /** Piotroski F-Score (0–9) */
  piotroskiScore: number;
  /**
   * ROE vs. sector median — percentage of sector ROE this company achieves.
   * e.g. if company ROE is 18% and sector median is 15%, pass 18/15 = 1.2.
   * Capped at 1.0 (100 points if >= sector median).
   */
  roeVsSector: number;
  /** Whether operating margins are improving YoY (boolean) */
  marginsImproving: boolean;
  /** Promoter pledge percentage is 0 or negligible (boolean) */
  pledgeFree: boolean;
  /** Promoter holding is stable or increasing YoY (boolean) */
  promoterStable: boolean;
}

/**
 * Quality Score (0–100)
 * Weights:
 *   Piotroski (0–9 → 0–100): 30 %
 *   ROE vs Sector (capped at 1.0 multiplier): 20 %
 *   Margins improving: 20 %
 *   Pledge-free: 15 %
 *   Promoter stable: 15 %
 */
export const computeQualityScore = (input: QualityScoreInput): number => {
  const { piotroskiScore, roeVsSector, marginsImproving, pledgeFree, promoterStable } = input;

  const piotroskiNorm = Math.min(piotroskiScore / 9, 1) * 100;
  const roeNorm       = Math.min(roeVsSector, 1) * 100;
  const marginsScore  = marginsImproving ? 100 : 0;
  const pledgeScore   = pledgeFree ? 100 : 0;
  const promoterScore = promoterStable ? 100 : 0;

  return (
    piotroskiNorm * 0.30 +
    roeNorm       * 0.20 +
    marginsScore  * 0.20 +
    pledgeScore   * 0.15 +
    promoterScore * 0.15
  );
};

// ---------------------------------------------------------------------------
// Growth Score
// ---------------------------------------------------------------------------

export interface GrowthScoreInput {
  /**
   * Revenue growth rate relative to sector.
   * e.g. if company revenue grew 20% and sector average is 12%, pass 20/12 = 1.67.
   * Capped at 1.0 (100 points if >= sector growth).
   */
  revenueGrowthVsSector: number;
  /**
   * Profit (net income) growth rate as decimal (e.g. 0.20 for 20% growth).
   * Capped at 30% for full score (0.30 → 100).
   */
  profitGrowthRate: number;
  /**
   * EPS growth rate as decimal. Capped at 25% for full score (0.25 → 100).
   */
  epsGrowthRate: number;
  /** Operating cash flow is positive this period (boolean) */
  cfoPositive: boolean;
  /** Revenue acceleration: current year growth > prior year growth (boolean) */
  revenueAccelerating: boolean;
}

/**
 * Growth Score (0–100)
 * Weights:
 *   Revenue growth vs sector: 25 %
 *   Profit growth rate: 25 %
 *   EPS growth rate: 20 %
 *   CFO positive: 15 %
 *   Revenue accelerating: 15 %
 */
export const computeGrowthScore = (input: GrowthScoreInput): number => {
  const { revenueGrowthVsSector, profitGrowthRate, epsGrowthRate, cfoPositive, revenueAccelerating } = input;

  const revVsSectorNorm = Math.min(Math.max(revenueGrowthVsSector, 0), 1) * 100;
  const profitNorm      = Math.min(Math.max(profitGrowthRate / 0.30, 0), 1) * 100;
  const epsNorm         = Math.min(Math.max(epsGrowthRate / 0.25, 0), 1) * 100;
  const cfoScore        = cfoPositive ? 100 : 0;
  const accelScore      = revenueAccelerating ? 100 : 0;

  return (
    revVsSectorNorm * 0.25 +
    profitNorm      * 0.25 +
    epsNorm         * 0.20 +
    cfoScore        * 0.15 +
    accelScore      * 0.15
  );
};

// ---------------------------------------------------------------------------
// Value Score
// ---------------------------------------------------------------------------

export interface ValueScoreInput {
  /**
   * Current P/E divided by the stock's own 3-year average P/E.
   * e.g. currentPE = 15, avgPE = 20 → ratio = 15/20 = 0.75 (trading below avg → higher score).
   * Score is higher when ratio < 1 (currently cheaper than historical average).
   */
  peVs3yrAvg: number;
  /**
   * Current P/B vs sector median P/B. Score is higher when < 1.
   * e.g. company PB = 2, sector median PB = 3 → ratio = 2/3 ≈ 0.67
   */
  pbVsSector: number;
  /**
   * PEG ratio (P/E ÷ Growth Rate). Lower is better; 1.0 = fair, < 1 = undervalued.
   * Capped at 0 for negative PEG; capped at full score for PEG ≤ 0.5.
   */
  peg: number;
  /**
   * Current P/E percentile over the stock's own 5-year history (0–100).
   * Lower percentile = cheaper vs history = higher score.
   * Pass 0–100 directly.
   */
  historicalPePercentile: number;
}

/**
 * Value Score (0–100)
 * Weights:
 *   P/E vs 3yr avg: 30 %
 *   P/B vs sector: 25 %
 *   PEG: 25 %
 *   Historical P/E percentile: 20 %
 */
export const computeValueScore = (input: ValueScoreInput): number => {
  const { peVs3yrAvg, pbVsSector, peg, historicalPePercentile } = input;

  // Cheaper than historical → ratio < 1 → higher score
  const peAvgScore = Math.min(Math.max((1 - peVs3yrAvg + 1) * 50, 0), 100); // maps 0→100, 1→50, 2→0
  const pbScore    = Math.min(Math.max((1 - pbVsSector + 1) * 50, 0), 100);
  // PEG: ≤0.5 → 100, 1.0 → 50, ≥2.0 → 0
  const pegScore   = peg <= 0 ? 0 : Math.min(Math.max((2 - peg) / 1.5 * 100, 0), 100);
  // Lower percentile = better value: invert
  const histScore  = Math.max(0, 100 - historicalPePercentile);

  return (
    peAvgScore * 0.30 +
    pbScore    * 0.25 +
    pegScore   * 0.25 +
    histScore  * 0.20
  );
};

// ---------------------------------------------------------------------------
// Momentum Score
// ---------------------------------------------------------------------------

export interface MomentumScoreInput {
  /**
   * Current price vs its 200-day SMA ratio.
   * e.g. price = 105, SMA200 = 100 → ratio = 1.05 (above SMA → bullish).
   * Score peaks at ratio ≥ 1.10 (10% above SMA).
   */
  priceVsSma200: number;
  /**
   * RSI (14-period). Range 0–100.
   * Score peaks at RSI 50–65 (trending without being overbought).
   */
  rsi: number;
  /**
   * ADX (Average Directional Index). Range 0–100.
   * ADX > 25 indicates a strong trend; ADX < 20 is trendless.
   * Score peaks at ADX ≥ 30.
   */
  adx: number;
  /**
   * Volume ratio: current 20-day avg volume / 90-day avg volume.
   * > 1.0 = rising volume (confirming move). Score caps at 1.5x.
   */
  volumeRatio: number;
  /**
   * Rate of Change over 125 trading days (6 months), as a decimal.
   * e.g. 0.20 = 20% return over 6 months. Capped at 40% for full score.
   */
  roc125: number;
}

/**
 * Momentum Score (0–100)
 * Weights:
 *   Price vs SMA200: 25 %
 *   RSI: 20 %
 *   ADX: 20 %
 *   Volume ratio: 20 %
 *   ROC-125: 15 %
 */
export const computeMomentumScore = (input: MomentumScoreInput): number => {
  const { priceVsSma200, rsi, adx, volumeRatio, roc125 } = input;

  // Price vs SMA200: 1.0 → 50, ≥1.10 → 100, <1.0 → decreasing
  const smaScore = Math.min(Math.max((priceVsSma200 - 0.9) / 0.2 * 100, 0), 100);

  // RSI: optimal 50–65, 30 → ~25, 70 → ~75, extremes penalised
  const rsiScore = rsi <= 0 || rsi >= 100
    ? 0
    : Math.max(0, 100 - Math.abs(rsi - 57.5) * 2.5);

  // ADX: 0 → 0, 25 → ~83, ≥30 → 100
  const adxScore = Math.min(Math.max(adx / 30 * 100, 0), 100);

  // Volume ratio: 1.0 → 50, ≥1.5 → 100, <1 → lower
  const volScore = Math.min(Math.max((volumeRatio - 0.5) / 1.0 * 100, 0), 100);

  // ROC125: 0 → 0, 0.20 → 50, ≥0.40 → 100
  const rocScore = Math.min(Math.max(roc125 / 0.40 * 100, 0), 100);

  return (
    smaScore * 0.25 +
    rsiScore * 0.20 +
    adxScore * 0.20 +
    volScore * 0.20 +
    rocScore * 0.15
  );
};
