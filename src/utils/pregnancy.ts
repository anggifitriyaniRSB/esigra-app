import type { GestationalInfo, Trimester } from '../types/maternal';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function calculateGestationalAge(hpht: string, referenceDate: Date = new Date()): GestationalInfo {
  const start = new Date(hpht);
  const diffDays = Math.max(0, Math.floor((referenceDate.getTime() - start.getTime()) / MS_PER_DAY));
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;
  const trimester = calculateTrimester(weeks);
  const estimatedDueDate = new Date(start.getTime() + 280 * MS_PER_DAY).toISOString();
  return { weeks, days, trimester, estimatedDueDate };
}

export function calculateTrimester(weeks: number): Trimester {
  if (weeks < 13) return 1;
  if (weeks < 28) return 2;
  return 3;
}

export function gravidaParaLabel(gravida: number, para: number): string {
  return `G${gravida}P${para}`;
}

export function calculateAge(dateOfBirth: string, referenceDate: Date = new Date()): number {
  const dob = new Date(dateOfBirth);
  let age = referenceDate.getFullYear() - dob.getFullYear();
  const m = referenceDate.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && referenceDate.getDate() < dob.getDate())) age--;
  return age;
}
