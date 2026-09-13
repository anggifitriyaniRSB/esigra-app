import { describe, it, expect } from 'vitest';
import { calculateScore, classifyRisk, detectSuspectConditions } from '../domain/screeningRules';

describe('calculateScore', () => {
  it('matches the prototype example: sakit_kepala_berat + penglihatan_kabur + tekanan_darah_140_90 = 22', () => {
    const score = calculateScore(['sakit_kepala_berat', 'penglihatan_kabur', 'tekanan_darah_140_90']);
    expect(score).toBe(22);
  });

  it('returns 0 for no symptoms', () => {
    expect(calculateScore([])).toBe(0);
  });

  it('ignores unknown symptom codes', () => {
    expect(calculateScore(['not_a_real_symptom'])).toBe(0);
  });
});

describe('classifyRisk', () => {
  it('classifies score >= 20 as TINGGI', () => {
    expect(classifyRisk(22)).toBe('TINGGI');
    expect(classifyRisk(20)).toBe('TINGGI');
  });

  it('classifies 15 <= score < 20 as SEDANG', () => {
    expect(classifyRisk(15)).toBe('SEDANG');
    expect(classifyRisk(19)).toBe('SEDANG');
  });

  it('classifies score < 15 as RENDAH', () => {
    expect(classifyRisk(14)).toBe('RENDAH');
    expect(classifyRisk(0)).toBe('RENDAH');
  });
});

describe('detectSuspectConditions', () => {
  it('detects Preeklamsia Berat suspect from bengkak + sakit kepala berat', () => {
    const matches = detectSuspectConditions(['bengkak_wajah_tangan', 'sakit_kepala_berat']);
    expect(matches.some((m) => m.label === 'Preeklamsia Berat / Suspect')).toBe(true);
  });

  it('detects HELLP Syndrome suspect from nyeri ulu hati + muntah berlebihan', () => {
    const matches = detectSuspectConditions(['nyeri_uluhati', 'muntah_berlebihan']);
    expect(matches.some((m) => m.label === 'HELLP Syndrome / Suspect')).toBe(true);
  });

  it('returns no matches when no combination is satisfied', () => {
    expect(detectSuspectConditions(['pusing_berat'])).toHaveLength(0);
  });
});
