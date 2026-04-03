/**
 * G-Factor (Composite Fundamental Score)
 * Formula: (Quality × 0.40) + (Growth × 0.35) + (Momentum × 0.25)
 * Inputs should be scores in the range [0, 100].
 * Output is a weighted composite in the range [0, 100].
 *
 * Interpretation:
 * - G-Factor > 70  → Strong composite fundamentals
 * - G-Factor 40–70 → Average
 * - G-Factor < 40  → Weak
 *
 * Weights are based on typical quantitative equity-factor research priorities:
 * Quality is the most predictive of long-term returns; Growth drives near-term
 * re-rating; Momentum captures market confirmation of the thesis.
 */
export const computeGFactor = (
  qualityScore: number,
  growthScore: number,
  momentumScore: number
): number => qualityScore * 0.4 + growthScore * 0.35 + momentumScore * 0.25;
