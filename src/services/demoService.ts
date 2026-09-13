import type { RiskLevel, SuspectMatch } from '../types/screening';
import { calculateScore, classifyRisk, detectSuspectConditions } from '../domain/screeningRules';
import { DEMO_PATIENT, DEMO_SYMPTOMS, DEMO_NAKES } from '../domain/demo/demoData';
import { nextDemoState, type DemoState } from '../domain/demo/demoStateMachine';

const DEMO_KEY = 'esigra:demo:v1:state';

export interface DemoRecord {
  state: DemoState;
  score: number;
  riskLevel: RiskLevel;
  suspectConditions: SuspectMatch[];
  screeningCreatedAt: string | null;
  validatedAt: string | null;
  followUpCreatedAt: string | null;
  followUpCompletedAt: string | null;
}

function initialRecord(): DemoRecord {
  return {
    state: 'DEMO_INITIAL',
    score: 0,
    riskLevel: 'RENDAH',
    suspectConditions: [],
    screeningCreatedAt: null,
    validatedAt: null,
    followUpCreatedAt: null,
    followUpCompletedAt: null,
  };
}

function read(): DemoRecord {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (!raw) return initialRecord();
    return JSON.parse(raw) as DemoRecord;
  } catch {
    return initialRecord();
  }
}

function write(record: DemoRecord): void {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(record));
  } catch {
    // demo storage unavailable — the demo simply won't persist across reloads
  }
}

/**
 * The /demo layer is entirely separate from the real app's services and
 * repositories (screeningService, followUpService, etc.). It never reads
 * or writes the real e-SIGRA data set — this guarantees a live grant
 * presentation can never leak into, or be disrupted by, real app state,
 * and vice versa.
 */
export const demoService = {
  getState(): DemoRecord {
    return read();
  },

  /** Step 1: run the real screening domain engine on the fixed demo symptoms. */
  runScreening(): DemoRecord {
    const symptomCodes = [...DEMO_SYMPTOMS.utama, ...DEMO_SYMPTOMS.penyerta];
    const score = calculateScore(symptomCodes);
    const riskLevel = classifyRisk(score, symptomCodes);
    const suspectConditions = detectSuspectConditions(symptomCodes);
    const record: DemoRecord = {
      ...initialRecord(),
      state: 'SCREENING_COMPLETED',
      score,
      riskLevel,
      suspectConditions,
      screeningCreatedAt: new Date().toISOString(),
    };
    write(record);
    return record;
  },

  advance(): DemoRecord {
    const current = read();
    const next = nextDemoState(current.state);
    const updated: DemoRecord = { ...current, state: next };

    if (next === 'VALIDATED') updated.validatedAt = new Date().toISOString();
    if (next === 'FOLLOW_UP_ACTIVE') updated.followUpCreatedAt = new Date().toISOString();
    if (next === 'FOLLOW_UP_COMPLETED') updated.followUpCompletedAt = new Date().toISOString();

    write(updated);
    return updated;
  },

  /** "Reset Demo" — restores DEMO_INITIAL deterministically, every time. */
  reset(): DemoRecord {
    const record = initialRecord();
    write(record);
    return record;
  },

  patient: DEMO_PATIENT,
  nakes: DEMO_NAKES,
  symptoms: DEMO_SYMPTOMS,
};
