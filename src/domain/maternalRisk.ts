import type { Screening, RiskLevel } from '../types/screening';
import { RISK_WEIGHT } from './enums';

/**
 * Returns the highest-priority (weighted) risk among a mother's screenings,
 * used to summarize her current status on dashboards and priority queues.
 */
export function currentRiskFromHistory(screenings: Screening[]): RiskLevel | null {
  if (screenings.length === 0) return null;
  const sorted = [...screenings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return sorted[0].riskLevel;
}

export function isPendingValidation(s: Screening): boolean {
  return s.validationStatus === 'BELUM_DIVALIDASI';
}

export function isHighPriority(s: Screening): boolean {
  return s.riskLevel === 'TINGGI' && isPendingValidation(s);
}

export function sortByPriority(screenings: Screening[]): Screening[] {
  return [...screenings].sort((a, b) => {
    const weightDiff = RISK_WEIGHT[b.riskLevel] - RISK_WEIGHT[a.riskLevel];
    if (weightDiff !== 0) return weightDiff;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

export function hoursSince(dateIso: string): number {
  return (Date.now() - new Date(dateIso).getTime()) / (1000 * 60 * 60);
}
