import { safeDivide } from "../core/safeDivide";

/**
 * Current Ratio
 * Formula: Current Assets / Current Liabilities
 * Interpretation:
 * - < 1 → May have trouble paying short-term obligations
 * - 1.2 to 2 → Generally considered healthy
 * - > 2 → May not be using its short-term assets efficiently
 */
export const currentRatio = (
  currentAssets: number,
  currentLiabilities: number
): number | null => safeDivide(currentAssets, currentLiabilities);
