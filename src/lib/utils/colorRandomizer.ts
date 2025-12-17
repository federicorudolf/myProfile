/**
 * Color randomization utility for consistent brand color usage across the application
 */

export const BRAND_COLORS = {
  red: '#E2211C',
  white: '#FFF'
} as const;

export const brandColorsArray = Object.values(BRAND_COLORS);

/**
 * Get a random brand color
 */
export function getRandomBrandColor(): string {
  return brandColorsArray[Math.floor(Math.random() * brandColorsArray.length)];
}

/**
 * Get the opposite brand color
 */
export function getOppositeBrandColor(color: string): string {
  return color === BRAND_COLORS.red ? BRAND_COLORS.white : BRAND_COLORS.red;
}

/**
 * Generate random colors for a list of items
 * Returns a Record mapping item keys to random colors
 */
export function generateRandomColors<T extends string>(items: readonly T[] | T[]): Record<T, string> {
  const colors = {} as Record<T, string>;
  items.forEach(item => {
    colors[item] = getRandomBrandColor();
  });
  return colors;
}

/**
 * Generate random colors with a key for additional items
 */
export function generateRandomColorsWithExtras<T extends string>(
  items: readonly T[] | T[],
  extraKeys: string[]
): Record<string, string> {
  const colors: Record<string, string> = {};

  items.forEach(item => {
    colors[item] = getRandomBrandColor();
  });

  extraKeys.forEach(key => {
    colors[key] = getRandomBrandColor();
  });

  return colors;
}
