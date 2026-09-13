import { LocalStorageRepository } from './repository';
import type { DentalRecord, DentalProblems } from '../types/dental';
import { mockDentalRecords } from '../data/mockDental';
import { generateId } from '../utils/security';
import { nowIso } from '../utils/date';
import { calculateDentalScore, classifyDentalStatus, recommendDentalAction } from '../domain/dentalRules';

const repo = new LocalStorageRepository<DentalRecord>('dental_records');
repo.seedIfEmpty(mockDentalRecords);

export const dentalService = {
  listByMother(motherId: string): DentalRecord[] {
    return repo
      .getAll()
      .filter((d) => d.motherId === motherId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  latestForMother(motherId: string): DentalRecord | undefined {
    return this.listByMother(motherId)[0];
  },

  submit(motherId: string, problems: DentalProblems): DentalRecord {
    const score = calculateDentalScore(problems);
    const status = classifyDentalStatus(problems);
    const record: DentalRecord = {
      id: generateId('dental'),
      motherId,
      problems,
      score,
      status,
      recommendation: recommendDentalAction(status, problems),
      createdAt: nowIso(),
    };
    repo.create(record);
    return record;
  },
};
