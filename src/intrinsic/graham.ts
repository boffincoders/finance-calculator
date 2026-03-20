
/**
 * Graham Number
 * Formula: sqrt(22.5 * EPS * Book Value)
 * Interpretation:
 * - Price < Graham → undervalued
 * - Price > Graham → overvalued
 */
export const grahamNumber = (eps: number, book: number): number =>
  Math.sqrt(22.5 * eps * book);
