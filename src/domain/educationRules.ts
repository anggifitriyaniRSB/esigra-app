import type { EducationContent } from '../types/education';
import type { Trimester } from '../types/maternal';

export function relevantForTrimester(content: EducationContent[], trimester: Trimester): EducationContent[] {
  return content.filter((c) => c.trimester === 'SEMUA' || c.trimester.includes(trimester));
}

export function relevantForSymptoms(content: EducationContent[], symptomCodes: string[]): EducationContent[] {
  if (symptomCodes.length === 0) return [];
  return content.filter((c) =>
    c.relatedSymptomCodes?.some((code) => symptomCodes.includes(code))
  );
}
