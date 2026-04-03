/**
 * Historical Aggregation Utilities
 *
 * Functions for computing averages, sums, and point lookups over
 * rolling windows of quarterly (or annual) data.
 * All functions expect chronological order: oldest first, most recent last.
 */

/**
 * N-Year Average
 * Returns the average of the last (years × 4) quarterly values.
 * e.g. computeNYearAverage(data, 3) → average of last 12 quarters.
 * If fewer values are available than requested, averages all available values.
 */
export const computeNYearAverage = (quarterlyValues: number[], years: number): number | null => {
  if (!quarterlyValues || quarterlyValues.length === 0 || years <= 0) return null;
  const window = quarterlyValues.slice(-(years * 4));
  return window.reduce((sum, v) => sum + v, 0) / window.length;
};

/**
 * N-Year Sum
 * Returns the sum of the last (years × 4) quarterly values.
 * If fewer values are available, sums all available values.
 */
export const computeNYearSum = (quarterlyValues: number[], years: number): number | null => {
  if (!quarterlyValues || quarterlyValues.length === 0 || years <= 0) return null;
  const window = quarterlyValues.slice(-(years * 4));
  return window.reduce((sum, v) => sum + v, 0);
};

/**
 * Historical Point Lookup
 * Returns the value at exactly `quartersBack` quarters from the most recent value.
 * quartersBack = 0 → most recent value
 * quartersBack = 4 → value from 1 year ago (same quarter last year)
 * Returns null if the index is out of bounds.
 */
export const computeHistoricalPoint = (
  quarterlyValues: number[],
  quartersBack: number
): number | null => {
  if (!quarterlyValues || quarterlyValues.length === 0 || quartersBack < 0) return null;
  const idx = quarterlyValues.length - 1 - quartersBack;
  if (idx < 0) return null;
  return quarterlyValues[idx];
};
