import { riskToActionStages, secondaryMetrics } from "@/lib/data";
import Reveal from "./Reveal";

export default function Metrics() {
  return (
    <section id="measurement" className="border-t border-charcoal/10 bg-forest-deep py-20 text-ivory md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <Reveal>
          <h2 className="max-w-xl font-serif text-3xl leading-tight md:text-4xl">
            We measure before we claim.
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-14 rounded-lg border border-white/15 bg-white/[0.04] p-8 md:p-10">
            <p className="text-xs tracking-wide text-sage">Hero metric</p>
            <p className="mt-1.5 font-serif text-2xl">Risk-to-Action Completion Rate</p>
            <div className="mt-8 flex flex-col gap-0 sm:flex-row sm:items-center">
              {riskToActionStages.map((stage, i) => (
                <div key={stage} className="flex flex-col items-center sm:flex-row">
                  <div className="w-full rounded-sm border border-white/20 px-5 py-3 text-center text-sm sm:w-auto sm:text-left">
                    {stage}
                  </div>
                  {i < riskToActionStages.length - 1 && (
                    <span
                      className="my-1.5 text-sage/60 sm:mx-3 sm:my-0"
                      aria-hidden="true"
                    >
                      <span className="inline-block rotate-90 sm:rotate-0">→</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-10">
            <p className="text-xs tracking-wide text-sage">Secondary metrics</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {secondaryMetrics.map((metric) => (
                <span
                  key={metric}
                  className="rounded-full border border-white/15 px-4 py-2 text-xs text-sage-light"
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <p className="mt-12 max-w-2xl border-t border-white/15 pt-8 text-sm leading-relaxed text-sage-light">
            Current metrics are designed to test workflow performance and
            readiness. Future economic evaluation may examine potential cost
            avoidance.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
