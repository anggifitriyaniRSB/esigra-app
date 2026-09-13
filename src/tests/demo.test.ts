import { describe, it, expect, beforeEach } from 'vitest';
import { nextDemoState, demoStateIndex, GUIDED_STEPS, type DemoState } from '../domain/demo/demoStateMachine';

describe('demo state machine (deterministic, never random)', () => {
  it('advances through the full sequence in a fixed order', () => {
    const sequence: DemoState[] = [];
    let state: DemoState = 'DEMO_INITIAL';
    for (let i = 0; i < 10; i++) {
      sequence.push(state);
      state = nextDemoState(state);
    }
    expect(sequence).toEqual([
      'DEMO_INITIAL',
      'SCREENING_COMPLETED',
      'HIGH_PRIORITY_DETECTED',
      'NAKES_NOTIFIED',
      'VALIDATION_PENDING',
      'VALIDATED',
      'FOLLOW_UP_ACTIVE',
      'FOLLOW_UP_COMPLETED',
      'FOLLOW_UP_COMPLETED', // stays put — no transition past the terminal state
      'FOLLOW_UP_COMPLETED',
    ]);
  });

  it('is idempotent when called repeatedly with the same input', () => {
    const results = new Set<DemoState>();
    for (let i = 0; i < 5; i++) results.add(nextDemoState('VALIDATION_PENDING'));
    expect(results.size).toBe(1);
    expect([...results][0]).toBe('VALIDATED');
  });

  it('demoStateIndex is monotonically increasing along the sequence', () => {
    const states: DemoState[] = [
      'DEMO_INITIAL',
      'SCREENING_COMPLETED',
      'HIGH_PRIORITY_DETECTED',
      'NAKES_NOTIFIED',
      'VALIDATION_PENDING',
      'VALIDATED',
      'FOLLOW_UP_ACTIVE',
      'FOLLOW_UP_COMPLETED',
    ];
    const indices = states.map(demoStateIndex);
    for (let i = 1; i < indices.length; i++) {
      expect(indices[i]).toBeGreaterThan(indices[i - 1]);
    }
  });

  it('exposes exactly the 7 guided steps described in the demo spec', () => {
    expect(GUIDED_STEPS).toHaveLength(7);
    expect(GUIDED_STEPS.map((s) => s.step)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    GUIDED_STEPS.forEach((s) => {
      expect(s.whatHappened.length).toBeGreaterThan(0);
      expect(s.whyItMatters.length).toBeGreaterThan(0);
      expect(s.whatHappensNext.length).toBeGreaterThan(0);
    });
  });
});

describe('demoService (isolated from the real app data)', () => {
  beforeEach(() => localStorage.clear());

  it('runScreening on the fixed demo symptoms produces a TINGGI result with a suspect indication', async () => {
    const { demoService } = await import('../services/demoService');
    const record = demoService.runScreening();
    expect(record.riskLevel).toBe('TINGGI');
    expect(record.suspectConditions.length).toBeGreaterThan(0);
    expect(record.state).toBe('SCREENING_COMPLETED');
  });

  it('reset() always returns to DEMO_INITIAL regardless of prior state', async () => {
    const { demoService } = await import('../services/demoService');
    demoService.runScreening();
    demoService.advance();
    demoService.advance();
    const reset = demoService.reset();
    expect(reset.state).toBe('DEMO_INITIAL');
    expect(reset.score).toBe(0);
  });

  it('never touches the real app screening repository', async () => {
    const { demoService } = await import('../services/demoService');
    const { screeningService } = await import('../services/screeningService');
    const before = screeningService.listAll().length;
    demoService.runScreening();
    demoService.advance();
    const after = screeningService.listAll().length;
    expect(after).toBe(before);
  });
});
