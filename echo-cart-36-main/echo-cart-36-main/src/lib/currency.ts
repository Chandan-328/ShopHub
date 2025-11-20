/**
 * Currency utility functions
 * Handles Indian Rupee (₹) formatting and conversion
 */

const USD_TO_INR_RATE = 83.0; // Approximate conversion rate

/**
 * Convert USD price to INR
 */
export function convertToINR(usdPrice: number): number {
  return Math.round(usdPrice * USD_TO_INR_RATE);
}

/**
 * Format price as Indian Rupees
 */
export function formatPrice(price: number): string {
  // Price is already in INR, just format it
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format price with ₹ symbol (simpler version)
 * Formats numbers in Indian style (e.g., ₹1,99,999 for 199999)
 */
export function formatPriceSimple(price: number): string {
  // Use Indian number formatting (lakhs and crores style)
  return `₹${price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(): string {
  return '₹';
}

