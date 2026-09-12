/**
 * PyTutor pricing rules (from docs/reglas_de_negocio.md).
 *
 * Kept in its own file so the business logic is easy to read, change, and test
 * in one place — independent of the database or HTTP layers. All amounts are in
 * Colombian pesos (whole numbers).
 *
 * Rules:
 *  - Individual 1 hour  = 50,000
 *  - Individual 2 hours = 80,000
 *  - Groups of 2–4: charged per person using the per-duration base.
 *  - Group discount: 10,000 off per student (groups of 2–4).
 *  - First-time discount: 10,000 off per student taking their first class.
 *  - More than 4 students => SPECIAL session, value agreed manually.
 *  - A manual discount can always be subtracted on top.
 */

export const GROUP_DISCOUNT_PER_STUDENT = 10_000;
export const FIRST_TIME_DISCOUNT_PER_STUDENT = 10_000;
export const MAX_GROUP_SIZE = 4;

/** Base price for ONE student for a given duration (in hours). */
export function baseValueForDuration(durationHours: number): number {
  if (durationHours <= 1) return 50_000;
  if (durationHours <= 2) return 80_000;
  // Beyond 2 hours we extrapolate at the 1-hour rate for the extra time.
  // (Adjust later if you set a different long-session rate.)
  const extraHours = durationHours - 2;
  return 80_000 + Math.ceil(extraHours) * 50_000;
}

export interface PriceInput {
  durationHours: number;
  studentCount: number;
  firstTimeCount: number; // how many attendees are taking their first class
  manualDiscount?: number;
  /** For SPECIAL sessions (>4 students) the tutor sets the total directly. */
  manualTotal?: number;
}

export interface PriceBreakdown {
  isSpecial: boolean;
  baseValue: number;
  groupDiscount: number;
  firstTimeDiscount: number;
  manualDiscount: number;
  totalValue: number;
}

/**
 * Compute the full price breakdown for a class. Returns each component so the
 * UI can show "base − discounts = total", not just a final number.
 */
export function calculatePrice(input: PriceInput): PriceBreakdown {
  const {
    durationHours,
    studentCount,
    firstTimeCount,
    manualDiscount = 0,
    manualTotal,
  } = input;

  // SPECIAL session: more than 4 students => value is set manually.
  if (studentCount > MAX_GROUP_SIZE) {
    const total = Math.max(0, (manualTotal ?? 0) - manualDiscount);
    return {
      isSpecial: true,
      baseValue: manualTotal ?? 0,
      groupDiscount: 0,
      firstTimeDiscount: 0,
      manualDiscount,
      totalValue: total,
    };
  }

  const perStudentBase = baseValueForDuration(durationHours);
  const baseValue = perStudentBase * studentCount;

  // Group discount only applies to real groups (2–4 students).
  const isGroup = studentCount >= 2 && studentCount <= MAX_GROUP_SIZE;
  const groupDiscount = isGroup
    ? GROUP_DISCOUNT_PER_STUDENT * studentCount
    : 0;

  const firstTimeDiscount = FIRST_TIME_DISCOUNT_PER_STUDENT * firstTimeCount;

  const totalValue = Math.max(
    0,
    baseValue - groupDiscount - firstTimeDiscount - manualDiscount,
  );

  return {
    isSpecial: false,
    baseValue,
    groupDiscount,
    firstTimeDiscount,
    manualDiscount,
    totalValue,
  };
}
