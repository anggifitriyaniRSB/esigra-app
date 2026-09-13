import { describe, it, expect } from 'vitest';
import { calculateDentalScore, classifyDentalStatus } from '../domain/dentalRules';
import type { DentalProblems } from '../types/dental';

const base: DentalProblems = {
  karies: null,
  gingivitis: null,
  gigiBerlubang: false,
  gigiGoyang: false,
  abses: false,
};

describe('calculateDentalScore', () => {
  it('sums karies severity score', () => {
    expect(calculateDentalScore({ ...base, karies: 'BERAT' })).toBe(6);
  });

  it('sums multiple problems', () => {
    expect(calculateDentalScore({ ...base, karies: 'RINGAN', gigiBerlubang: true, abses: true })).toBe(
      2 + 4 + 8
    );
  });

  it('returns 0 when no problems found', () => {
    expect(calculateDentalScore(base)).toBe(0);
  });
});

describe('classifyDentalStatus', () => {
  it('classifies SEHAT when no problems', () => {
    expect(classifyDentalStatus(base)).toBe('SEHAT');
  });

  it('classifies GINGIVITIS when gingivitis present', () => {
    expect(classifyDentalStatus({ ...base, gingivitis: 'RINGAN' })).toBe('GINGIVITIS');
  });

  it('classifies KARIES_BERAT for severe karies', () => {
    expect(classifyDentalStatus({ ...base, karies: 'BERAT' })).toBe('KARIES_BERAT');
  });
});
