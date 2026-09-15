import { baseValueForDuration, calculatePrice } from './pricing.js';

/**
 * Tests for the pricing rules (docs/reglas_de_negocio.md).
 * Pure functions with no database, so they're fast and easy to trust.
 * If someone later changes a rule by accident, these tests catch it.
 */
describe('baseValueForDuration', () => {
  it('charges 50,000 for a 1-hour session', () => {
    expect(baseValueForDuration(1)).toBe(50_000);
  });

  it('charges 80,000 for a 2-hour session', () => {
    expect(baseValueForDuration(2)).toBe(80_000);
  });

  it('treats sub-hour sessions at the 1-hour rate', () => {
    expect(baseValueForDuration(0.5)).toBe(50_000);
  });

  it('adds the 1-hour rate for time beyond 2 hours', () => {
    expect(baseValueForDuration(3)).toBe(130_000); // 80k + 50k
  });
});

describe('calculatePrice', () => {
  it('individual 1h, returning student: no discounts', () => {
    const p = calculatePrice({
      durationHours: 1,
      studentCount: 1,
      firstTimeCount: 0,
    });
    expect(p.baseValue).toBe(50_000);
    expect(p.groupDiscount).toBe(0);
    expect(p.firstTimeDiscount).toBe(0);
    expect(p.totalValue).toBe(50_000);
    expect(p.isSpecial).toBe(false);
  });

  it('individual 1h, FIRST class: 10,000 off', () => {
    const p = calculatePrice({
      durationHours: 1,
      studentCount: 1,
      firstTimeCount: 1,
    });
    expect(p.firstTimeDiscount).toBe(10_000);
    expect(p.totalValue).toBe(40_000);
  });

  it('group of 3 (1h), none first-time: group discount applies', () => {
    const p = calculatePrice({
      durationHours: 1,
      studentCount: 3,
      firstTimeCount: 0,
    });
    // base = 50k * 3 = 150k; group discount = 10k * 3 = 30k
    expect(p.baseValue).toBe(150_000);
    expect(p.groupDiscount).toBe(30_000);
    expect(p.totalValue).toBe(120_000);
  });

  it('group of 3 (1h), 2 first-timers: both discounts stack', () => {
    const p = calculatePrice({
      durationHours: 1,
      studentCount: 3,
      firstTimeCount: 2,
    });
    // 150k - 30k(group) - 20k(first-time x2) = 100k
    expect(p.groupDiscount).toBe(30_000);
    expect(p.firstTimeDiscount).toBe(20_000);
    expect(p.totalValue).toBe(100_000);
  });

  it('applies a manual discount on top', () => {
    const p = calculatePrice({
      durationHours: 1,
      studentCount: 1,
      firstTimeCount: 0,
      manualDiscount: 5_000,
    });
    expect(p.manualDiscount).toBe(5_000);
    expect(p.totalValue).toBe(45_000);
  });

  it('never returns a negative total', () => {
    const p = calculatePrice({
      durationHours: 1,
      studentCount: 1,
      firstTimeCount: 1,
      manualDiscount: 999_999,
    });
    expect(p.totalValue).toBe(0);
  });

  it('more than 4 students => SPECIAL, uses the manual total', () => {
    const p = calculatePrice({
      durationHours: 2,
      studentCount: 5,
      firstTimeCount: 0,
      manualTotal: 200_000,
    });
    expect(p.isSpecial).toBe(true);
    expect(p.totalValue).toBe(200_000);
    expect(p.groupDiscount).toBe(0);
  });

  it('a solo student is NOT a group (no group discount)', () => {
    const p = calculatePrice({
      durationHours: 1,
      studentCount: 1,
      firstTimeCount: 0,
    });
    expect(p.groupDiscount).toBe(0);
  });
});
