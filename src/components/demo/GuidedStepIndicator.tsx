import { GUIDED_STEPS, demoStateIndex, type DemoState } from '../../domain/demo/demoStateMachine';
import clsx from 'clsx';

export function GuidedStepIndicator({ current }: { current: DemoState }) {
  const currentIdx = demoStateIndex(current);
  return (
    <ol className="flex flex-wrap items-center gap-1.5">
      {GUIDED_STEPS.map((step) => {
        const stepIdx = demoStateIndex(step.state);
        const done = currentIdx >= stepIdx;
        return (
          <li key={step.step} className="flex items-center gap-1.5">
            <span
              className={clsx(
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                done ? 'bg-[var(--color-deep)] text-white' : 'bg-[var(--color-canvas-sunk)] text-[var(--color-ink)]/40'
              )}
            >
              {step.step}
            </span>
            {step.step < GUIDED_STEPS.length && <span className="h-px w-4 bg-[var(--color-sage-line)]" />}
          </li>
        );
      })}
    </ol>
  );
}
