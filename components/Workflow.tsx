"use client";

import { useState } from "react";
import { workflowSteps } from "@/lib/data";
import Reveal from "./Reveal";

export default function Workflow() {
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="border-t border-charcoal/10 bg-forest-deep py-20 text-ivory md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-sage">HOW IT WORKS</p>
          <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight md:text-4xl">
            Six stages, one accountable loop.
          </h2>
        </Reveal>

        {/* Desktop: interactive horizontal process */}
        <div className="mt-16 hidden md:block">
          <div className="grid grid-cols-6 gap-3">
            {workflowSteps.map((step, i) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={`group rounded-md border px-4 py-5 text-left transition-colors ${
                  active === i
                    ? "border-signal bg-white/[0.06]"
                    : "border-white/15 hover:border-white/30"
                }`}
                aria-pressed={active === i}
              >
                <span className={`text-xs ${active === i ? "text-signal" : "text-sage"}`}>
                  {step.number}
                </span>
                <p className="mt-2 font-serif text-lg">{step.title}</p>
              </button>
            ))}
          </div>
          <div className="relative mt-3">
            <div
              className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/15"
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-6 gap-3">
              {workflowSteps.map((step, i) => (
                <div key={step.id} className="flex justify-start pl-4">
                  <span
                    className={`h-2.5 w-2.5 rounded-full border-2 transition-colors ${
                      active === i ? "border-signal bg-signal" : "border-white/40 bg-forest-deep"
                    }`}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 max-w-xl">
            <p className="text-[1.05rem] leading-relaxed text-sage-light">
              {workflowSteps[active].description}
            </p>
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="mt-12 flex flex-col md:hidden">
          {workflowSteps.map((step, i) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/30 text-xs text-sage">
                  {step.number}
                </span>
                {i < workflowSteps.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-white/15" aria-hidden="true" />
                )}
              </div>
              <div className="pb-8">
                <p className="font-serif text-lg">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-sage-light">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
