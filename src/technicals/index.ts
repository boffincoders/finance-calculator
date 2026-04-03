/**
 * Technical Indicators
 *
 * All indicators are implemented natively with zero external dependencies.
 * Input arrays are expected in chronological order: oldest first, most recent last.
 * Functions return null when insufficient data is provided.
 */

// ---------------------------------------------------------------------------
// Moving Averages
// ---------------------------------------------------------------------------

/**
 * Simple Moving Average (SMA)
 * Returns the average of the last `period` values.
 * Returns null if fewer values than `period` are provided.
 */
export const sma = (prices: number[], period: number): number | null => {
  if (!prices || prices.length < period || period <= 0) return null;
  const slice = prices.slice(-period);
  return slice.reduce((sum, p) => sum + p, 0) / period;
};

/**
 * Exponential Moving Average (EMA)
 * Uses the standard smoothing factor k = 2 / (period + 1).
 * Seed: SMA of first `period` values, then EMA forward.
 * Returns null if fewer values than `period` are provided.
 */
export const ema = (prices: number[], period: number): number | null => {
  if (!prices || prices.length < period || period <= 0) return null;

  const k = 2 / (period + 1);
  let currentEma = prices.slice(0, period).reduce((s, p) => s + p, 0) / period;

  for (let i = period; i < prices.length; i++) {
    currentEma = prices[i] * k + currentEma * (1 - k);
  }
  return currentEma;
};

/**
 * EMA Series — returns the full array of EMA values (one per price after the seed period).
 * Useful internally for MACD and other multi-EMA indicators.
 */
const emaSeries = (prices: number[], period: number): number[] => {
  if (!prices || prices.length < period || period <= 0) return [];

  const k = 2 / (period + 1);
  let currentEma = prices.slice(0, period).reduce((s, p) => s + p, 0) / period;
  const result: number[] = [currentEma];

  for (let i = period; i < prices.length; i++) {
    currentEma = prices[i] * k + currentEma * (1 - k);
    result.push(currentEma);
  }
  return result;
};

// ---------------------------------------------------------------------------
// Momentum & Oscillators
// ---------------------------------------------------------------------------

/**
 * Relative Strength Index (RSI)
 * Uses Wilder's Smoothed Moving Average (SMMA) — standard RSI formula.
 * Requires at least `period + 1` data points.
 * @param prices  Closing prices, oldest first.
 * @param period  Default 14.
 * Returns null if insufficient data.
 */
export const rsi = (prices: number[], period = 14): number | null => {
  if (!prices || prices.length < period + 1) return null;

  const changes = prices.slice(1).map((p, i) => p - prices[i]);
  const gains   = changes.map(c => Math.max(c, 0));
  const losses  = changes.map(c => Math.max(-c, 0));

  // Seed: simple average of first `period` values
  let avgGain = gains.slice(0, period).reduce((s, v) => s + v, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((s, v) => s + v, 0) / period;

  // Wilder's smoothing for subsequent values
  for (let i = period; i < changes.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
};

/**
 * Rate of Change (ROC)
 * Formula: ((current - priorN) / priorN) × 100
 * Returns the percentage change over `period` bars.
 * Returns null if fewer than `period + 1` values are provided.
 */
export const roc = (prices: number[], period = 14): number | null => {
  if (!prices || prices.length < period + 1 || period <= 0) return null;
  const current = prices[prices.length - 1];
  const prior   = prices[prices.length - 1 - period];
  if (prior === 0) return null;
  return ((current - prior) / prior) * 100;
};

// ---------------------------------------------------------------------------
// MACD
// ---------------------------------------------------------------------------

export interface MACDResult {
  /** MACD line = EMA(fast) - EMA(slow) */
  macdLine: number;
  /** Signal line = EMA(macdLine, signal) */
  signalLine: number;
  /** Histogram = macdLine - signalLine */
  histogram: number;
}

/**
 * MACD (Moving Average Convergence/Divergence)
 * Default: fast=12, slow=26, signal=9
 * Returns null if insufficient data.
 */
export const macd = (
  prices: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): MACDResult | null => {
  if (!prices || prices.length < slowPeriod + signalPeriod) return null;

  const fastSeries = emaSeries(prices, fastPeriod);
  const slowSeries = emaSeries(prices, slowPeriod);

  // Align: fast has more values, trim to match slow
  const offset      = fastSeries.length - slowSeries.length;
  const macdSeries  = slowSeries.map((slow, i) => fastSeries[i + offset] - slow);

  if (macdSeries.length < signalPeriod) return null;

  const sigSeries   = emaSeries(macdSeries, signalPeriod);
  if (sigSeries.length === 0) return null;

  const macdLine    = macdSeries[macdSeries.length - 1];
  const signalLine  = sigSeries[sigSeries.length - 1];

  return {
    macdLine,
    signalLine,
    histogram: macdLine - signalLine,
  };
};

// ---------------------------------------------------------------------------
// Volatility
// ---------------------------------------------------------------------------

/**
 * Average True Range (ATR)
 * Measures volatility by averaging the True Range over `period` bars.
 * True Range = max(high-low, |high-prevClose|, |low-prevClose|)
 * Uses Wilder's smoothing (same as RSI).
 * @param highs   Array of high prices, chronological.
 * @param lows    Array of low prices, chronological.
 * @param closes  Array of close prices, chronological.
 * @param period  Default 14.
 */
export const atr = (
  highs: number[],
  lows: number[],
  closes: number[],
  period = 14
): number | null => {
  if (
    !highs || !lows || !closes ||
    highs.length < period + 1 ||
    highs.length !== lows.length || highs.length !== closes.length
  ) return null;

  const trueRanges: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    const hl   = highs[i] - lows[i];
    const hc   = Math.abs(highs[i] - closes[i - 1]);
    const lc   = Math.abs(lows[i] - closes[i - 1]);
    trueRanges.push(Math.max(hl, hc, lc));
  }

  let currentAtr = trueRanges.slice(0, period).reduce((s, v) => s + v, 0) / period;
  for (let i = period; i < trueRanges.length; i++) {
    currentAtr = (currentAtr * (period - 1) + trueRanges[i]) / period;
  }
  return currentAtr;
};

export interface BollingerBandsResult {
  upper: number;
  middle: number;
  lower: number;
  /** Bandwidth: (upper - lower) / middle */
  bandwidth: number;
}

/**
 * Bollinger Bands
 * Middle = SMA(period), Upper = SMA + (stdDev × multiplier), Lower = SMA - (stdDev × multiplier)
 * @param prices    Closing prices, chronological.
 * @param period    Default 20.
 * @param multiplier Default 2.
 */
export const bollingerBands = (
  prices: number[],
  period = 20,
  multiplier = 2
): BollingerBandsResult | null => {
  if (!prices || prices.length < period || period <= 0) return null;

  const slice  = prices.slice(-period);
  const middle = slice.reduce((s, p) => s + p, 0) / period;
  const variance = slice.reduce((s, p) => s + Math.pow(p - middle, 2), 0) / period;
  const stdDev = Math.sqrt(variance);

  const upper = middle + multiplier * stdDev;
  const lower = middle - multiplier * stdDev;

  return {
    upper,
    middle,
    lower,
    bandwidth: middle !== 0 ? (upper - lower) / middle : 0,
  };
};

// ---------------------------------------------------------------------------
// Trend Strength
// ---------------------------------------------------------------------------

export interface ADXResult {
  /** ADX: trend strength 0–100. > 25 = trending, < 20 = ranging */
  adx: number;
  /** +DI: positive directional indicator */
  plusDI: number;
  /** -DI: negative directional indicator */
  minusDI: number;
}

/**
 * ADX (Average Directional Index) with +DI and -DI
 * Uses Wilder's smoothing (same period as ATR).
 * @param period Default 14.
 */
export const adx = (
  highs: number[],
  lows: number[],
  closes: number[],
  period = 14
): ADXResult | null => {
  if (
    !highs || highs.length < period * 2 + 1 ||
    highs.length !== lows.length || highs.length !== closes.length
  ) return null;

  const plusDMs: number[]  = [];
  const minusDMs: number[] = [];
  const trs: number[]      = [];

  for (let i = 1; i < closes.length; i++) {
    const upMove   = highs[i] - highs[i - 1];
    const downMove = lows[i - 1] - lows[i];

    plusDMs.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDMs.push(downMove > upMove && downMove > 0 ? downMove : 0);

    const tr = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    );
    trs.push(tr);
  }

  // Wilder smooth
  const wilderSmooth = (arr: number[], p: number): number[] => {
    let val = arr.slice(0, p).reduce((s, v) => s + v, 0);
    const out = [val];
    for (let i = p; i < arr.length; i++) {
      val = val - val / p + arr[i];
      out.push(val);
    }
    return out;
  };

  const smoothedTR      = wilderSmooth(trs, period);
  const smoothedPlusDM  = wilderSmooth(plusDMs, period);
  const smoothedMinusDM = wilderSmooth(minusDMs, period);

  const dxValues: number[] = [];
  for (let i = 0; i < smoothedTR.length; i++) {
    const tr = smoothedTR[i];
    if (tr === 0) { dxValues.push(0); continue; }
    const pdi    = (smoothedPlusDM[i] / tr) * 100;
    const mdi    = (smoothedMinusDM[i] / tr) * 100;
    const diSum  = pdi + mdi;
    const dx     = diSum === 0 ? 0 : (Math.abs(pdi - mdi) / diSum) * 100;
    dxValues.push(dx);
  }

  // ADX = Wilder-smoothed DX
  let adxVal = dxValues.slice(0, period).reduce((s, v) => s + v, 0) / period;
  for (let i = period; i < dxValues.length; i++) {
    adxVal = (adxVal * (period - 1) + dxValues[i]) / period;
  }

  // Final DI values
  const last = smoothedTR.length - 1;
  const finalTR  = smoothedTR[last];
  const plusDI   = finalTR !== 0 ? (smoothedPlusDM[last] / finalTR) * 100 : 0;
  const minusDI  = finalTR !== 0 ? (smoothedMinusDM[last] / finalTR) * 100 : 0;

  return { adx: adxVal, plusDI, minusDI };
};

// ---------------------------------------------------------------------------
// Volume-Based
// ---------------------------------------------------------------------------

/**
 * Money Flow Index (MFI)
 * Volume-weighted RSI. Uses typical price = (high + low + close) / 3.
 * @param period Default 14.
 */
export const mfi = (
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[],
  period = 14
): number | null => {
  if (
    !highs || highs.length < period + 1 ||
    highs.length !== lows.length ||
    highs.length !== closes.length ||
    highs.length !== volumes.length
  ) return null;

  const typicalPrices = highs.map((h, i) => (h + lows[i] + closes[i]) / 3);
  const moneyFlows    = typicalPrices.map((tp, i) => tp * volumes[i]);

  const slice      = typicalPrices.slice(-period - 1);
  const mfSlice    = moneyFlows.slice(-period - 1);

  let posFlow = 0;
  let negFlow = 0;

  for (let i = 1; i <= period; i++) {
    if (slice[i] > slice[i - 1]) {
      posFlow += mfSlice[i];
    } else {
      negFlow += mfSlice[i];
    }
  }

  if (negFlow === 0) return 100;
  const mfr = posFlow / negFlow;
  return 100 - 100 / (1 + mfr);
};

/**
 * VWAP (Volume-Weighted Average Price)
 * Typically computed intraday (resets each session), but useful as a rolling
 * VWAP over the provided data window.
 * Formula: sum(typicalPrice × volume) / sum(volume)
 */
export const vwap = (
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[]
): number | null => {
  if (
    !highs || highs.length === 0 ||
    highs.length !== lows.length ||
    highs.length !== closes.length ||
    highs.length !== volumes.length
  ) return null;

  let tpvSum   = 0;
  let volSum   = 0;

  for (let i = 0; i < highs.length; i++) {
    const tp = (highs[i] + lows[i] + closes[i]) / 3;
    tpvSum += tp * volumes[i];
    volSum += volumes[i];
  }

  return volSum === 0 ? null : tpvSum / volSum;
};

// ---------------------------------------------------------------------------
// Statistical
// ---------------------------------------------------------------------------

/**
 * Beta
 * Measures the stock's return volatility relative to a benchmark (e.g. index).
 * Beta = Covariance(stock, benchmark) / Variance(benchmark)
 * @param stockReturns     Array of periodic returns for the stock.
 * @param benchmarkReturns Array of periodic returns for the benchmark.
 *                         Must be the same length as stockReturns.
 * Returns null if inputs are invalid or benchmark has zero variance.
 */
export const beta = (stockReturns: number[], benchmarkReturns: number[]): number | null => {
  if (
    !stockReturns || !benchmarkReturns ||
    stockReturns.length < 2 ||
    stockReturns.length !== benchmarkReturns.length
  ) return null;

  const n       = stockReturns.length;
  const avgS    = stockReturns.reduce((s, v) => s + v, 0) / n;
  const avgB    = benchmarkReturns.reduce((s, v) => s + v, 0) / n;

  let covar    = 0;
  let varB     = 0;

  for (let i = 0; i < n; i++) {
    const ds = stockReturns[i] - avgS;
    const db = benchmarkReturns[i] - avgB;
    covar += ds * db;
    varB  += db * db;
  }

  if (varB === 0) return null;
  return covar / varB;
};

// ---------------------------------------------------------------------------
// Pivot Points
// ---------------------------------------------------------------------------

export interface PivotPointsResult {
  /** Central pivot point */
  pivot: number;
  /** Resistance levels */
  r1: number;
  r2: number;
  r3: number;
  /** Support levels */
  s1: number;
  s2: number;
  s3: number;
}

/**
 * Classic Pivot Points
 * Computed from the prior session's high, low, and close.
 *   Pivot   = (high + low + close) / 3
 *   R1 = 2×Pivot − low
 *   S1 = 2×Pivot − high
 *   R2 = Pivot + (high − low)
 *   S2 = Pivot − (high − low)
 *   R3 = high + 2×(Pivot − low)
 *   S3 = low − 2×(high − Pivot)
 */
export const pivotPoints = (
  high: number,
  low: number,
  close: number
): PivotPointsResult => {
  const pivot = (high + low + close) / 3;
  const range = high - low;

  return {
    pivot,
    r1: 2 * pivot - low,
    r2: pivot + range,
    r3: high + 2 * (pivot - low),
    s1: 2 * pivot - high,
    s2: pivot - range,
    s3: low - 2 * (high - pivot),
  };
};
