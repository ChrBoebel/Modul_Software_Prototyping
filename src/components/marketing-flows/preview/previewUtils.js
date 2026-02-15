/**
 * Calculate a normalized lead score on a 0-100 scale.
 * Base score is 50, adjusted by the total raw score multiplied by 5.
 *
 * @param {number} totalScore - Sum of raw scores from collected answers
 * @returns {number} Normalized score clamped to [0, 100]
 */
export const calculateNormalizedScore = (totalScore) =>
  Math.min(100, Math.max(0, 50 + totalScore * 5));
