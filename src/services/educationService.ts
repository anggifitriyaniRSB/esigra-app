import { LocalStorageRepository } from './repository';
import type { EducationContent } from '../types/education';
import { mockEducation } from '../data/mockEducation';
import { relevantForTrimester, relevantForSymptoms } from '../domain/educationRules';
import type { Trimester } from '../types/maternal';
import { auditService } from './auditService';

const repo = new LocalStorageRepository<EducationContent>('education');
repo.seedIfEmpty(mockEducation);

export const educationService = {
  listAll(): EducationContent[] {
    return repo.getAll();
  },

  getById(id: string): EducationContent | undefined {
    return repo.getById(id);
  },

  recommendedForTrimester(trimester: Trimester): EducationContent[] {
    return relevantForTrimester(repo.getAll(), trimester);
  },

  recommendedForSymptoms(symptomCodes: string[]): EducationContent[] {
    return relevantForSymptoms(repo.getAll(), symptomCodes);
  },

  view(id: string, actorId: string, actorRole: string): void {
    auditService.log({
      actorId,
      actorRole,
      action: 'EDUCATION_VIEWED',
      resourceType: 'EducationContent',
      resourceId: id,
    });
  },
};
