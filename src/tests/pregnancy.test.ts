import { describe, it, expect } from 'vitest';
import { calculateGestationalAge, calculateTrimester } from '../utils/pregnancy';

describe('calculateTrimester', () => {
  it('classifies weeks < 13 as trimester 1', () => {
    expect(calculateTrimester(0)).toBe(1);
    expect(calculateTrimester(12)).toBe(1);
  });

  it('classifies 13-27 weeks as trimester 2', () => {
    expect(calculateTrimester(13)).toBe(2);
    expect(calculateTrimester(27)).toBe(2);
  });

  it('classifies 28+ weeks as trimester 3', () => {
    expect(calculateTrimester(28)).toBe(3);
    expect(calculateTrimester(40)).toBe(3);
  });
});

describe('calculateGestationalAge', () => {
  it('computes weeks elapsed since HPHT', () => {
    const hpht = '2026-01-01';
    const reference = new Date('2026-08-20'); // 231 days later = 33 weeks
    const result = calculateGestationalAge(hpht, reference);
    expect(result.weeks).toBe(33);
    expect(result.trimester).toBe(3);
  });
});
