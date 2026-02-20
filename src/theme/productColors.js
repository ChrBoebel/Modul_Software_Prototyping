/**
 * Product Color Palette - SWK Corporate Design
 *
 * Colors are organized by technology family using SWK brand colors:
 * - FTTH (Glasfaser): SWK Blue tones - Premium/fastest technology
 * - KABEL: SWK Red tones - Main brand technology
 * - DSL: Slate/Gray tones - Legacy technology
 *
 * Within each family: Darker = faster speeds, Lighter = slower speeds
 */
import { designTokens } from './designTokens';

export const TECHNOLOGY_COLORS = designTokens.productPalette;

// Direct mapping from product ID to color
export const PRODUCT_COLORS = {
  'glasfaser-1000': TECHNOLOGY_COLORS.FTTH.shades[0],
  'glasfaser-500': TECHNOLOGY_COLORS.FTTH.shades[1],
  'glasfaser-250': TECHNOLOGY_COLORS.FTTH.shades[2],
  'glasfaser-100': TECHNOLOGY_COLORS.FTTH.shades[3],
  'glasfaser-50': TECHNOLOGY_COLORS.FTTH.shades[4],
  'kabel-1000': TECHNOLOGY_COLORS.KABEL.shades[0],
  'kabel-500': TECHNOLOGY_COLORS.KABEL.shades[1],
  'kabel-400': TECHNOLOGY_COLORS.KABEL.shades[2],
  'kabel-250': TECHNOLOGY_COLORS.KABEL.shades[3],
  'kabel-200': TECHNOLOGY_COLORS.KABEL.shades[4],
  'dsl-100': TECHNOLOGY_COLORS.DSL.shades[0],
  'dsl-50': TECHNOLOGY_COLORS.DSL.shades[1],
  'dsl-16': TECHNOLOGY_COLORS.DSL.shades[2],
};

/**
 * Get color for a product ID
 * @param {string} productId - Product ID (e.g., 'glasfaser-1000')
 * @returns {string} Hex color code
 */
export const getProductColor = (productId) => {
  return PRODUCT_COLORS[productId] || designTokens.colors.slate400;
};

/**
 * Get technology type from product ID
 * @param {string} productId - Product ID
 * @returns {string|null} Technology key (FTTH, KABEL, DSL) or null
 */
export const getTechnologyFromProductId = (productId) => {
  if (!productId) return null;
  if (productId.startsWith('glasfaser')) return 'FTTH';
  if (productId.startsWith('kabel')) return 'KABEL';
  if (productId.startsWith('dsl')) return 'DSL';
  return null;
};

/**
 * Get technology display name
 * @param {string} techKey - Technology key (FTTH, KABEL, DSL)
 * @returns {string} Display name
 */
export const getTechnologyName = (techKey) => {
  return TECHNOLOGY_COLORS[techKey]?.name || techKey;
};
