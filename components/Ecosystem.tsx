import { ecosystemFlow, futureEvaluationChain } from "@/lib/data";
import Reveal from "./Reveal";

export default function Ecosystem() {
  return (
    <section className="border-t border-charcoal/10 bg-ivory py-20 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <Reveal>
          <h2 className="max-w-xl font-serif text-3xl leading-tight text-forest-deep md:text-4xl">
            Better risk management starts upstream.
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-14 flex flex-col items-center gap-0 rounded-lg border border-charcoal/10 bg-sage-pale/30 p-8 md:p-12">
            {ecosystemFlow.map((node, i) => (
              <div key={node} className="flex w-full max-w-sm flex-col items-center">
                <div
                  className={`w-full rounded-sm px-5 py-3.5 text-center text-sm ${
                    node === "e-SIGRA"
                      ? "border border-forest bg-forest font-medium text-ivory"
                      : "border border-charcoal/15 bg-white text-charcoal"
                  }`}
                >
                  {node}
                </div>
                {i < ecosystemFlow.length - 1 && (
                  <span className="my-2 h-6 w-px bg-charcoal/20" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-14 rounded-lg border border-dashed border-olive/40 bg-sand/30 p-7">
            <p className="text-xs font-medium uppercase tracking-wide text-olive">
              Future evaluation opportunity
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {futureEvaluationChain.map((item, i) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="rounded-full border border-olive/30 bg-white px-4 py-1.5 text-sm text-charcoal-soft">
                    {item}
                  </span>
                  {i < futureEvaluationChain.length - 1 && (
                    <span className="text-charcoal/30" aria-hidden="true">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-charcoal-soft">
              Future work may evaluate the relationship between improved
              risk-to-action performance, appropriate referral pathways,
              healthcare utilisation, and potential cost avoidance.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
