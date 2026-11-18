/**
 * Helper utilities for date manipulations and formatting
 */

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Format date object or string into "MMM DD, YYYY" (e.g., "Mar 10, 2026")
 */
export function formatDate(dateInput) {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;

  const month = MONTH_NAMES[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
}

/**
 * Parse standard date string "Mar 10, 2026" or ISO into Date object
 */
export function parseDate(str) {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Shift a date by X days forward or backward
 * @param {string|Date} dateInput
 * @param {number} days - Positive or negative integer
 */
export function shiftDate(dateInput, days) {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;

  const shifted = new Date(d);
  shifted.setDate(shifted.getDate() + days);
  return shifted;
}
