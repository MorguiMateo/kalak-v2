export const PHONE_MIN_DIGITS = 6;

/** Phone: digits, spaces and hyphens only (same rule as the old site). */
export function sanitizePhone(input: string): string {
  return input.replace(/[^0-9-\s]/g, "");
}

export function isValidPhone(input: string): boolean {
  return input.replace(/\D/g, "").length >= PHONE_MIN_DIGITS;
}
