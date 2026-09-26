import Reveal from "./Reveal";

const gapSteps = ["Risk Detected", "?", "Review", "Validation", "Follow-up"];

export default function Problem() {
  return (
    <section className="border-t border-charcoal/10 bg-sage-pale/40 py-20 md:py-32">
      <div className="mx-auto grid max-w-content gap-14 px-6 md:grid-cols-[1fr,1.1fr] md:gap-16 md:px-10">
        <Reveal>
          <h2 className="font-serif text-3xl leading-tight text-forest-deep md:text-4xl">
            A risk signal means little if action comes too late.
          </h2>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-charcoal-soft">
            Screening tools are good at finding risk. What happens after a
            case is flagged is where preventive health often loses its
            momentum. Without a shared record of who was flagged and what
            happened next, a case can quietly go unfollowed — not because no
            one cared, but because no one owned it. e-SIGRA focuses on that
            operational gap between detection and follow-through.
          </p>
          <p className="mt-6 font-serif text-xl italic text-olive">
            &ldquo;The gap is not only detection. It is follow-through.&rdquo;
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex flex-col gap-0 rounded-lg border border-charcoal/10 bg-white/70 p-8">
            {gapSteps.map((step, i) => {
              const isGap = step === "?";
              const isLast = i === gapSteps.length - 1;
              return (
                <div key={`${step}-${i}`}>
                  <div
                    className={`flex items-center gap-4 rounded-sm px-4 py-3.5 ${
                      isGap
                        ? "border border-dashed border-charcoal/30 bg-transparent"
                        : "bg-forest/[0.04]"
                    }`}
                  >
                    <span
                      className={`font-serif text-lg ${
                        isGap ? "text-charcoal-soft" : "text-forest"
                      }`}
                    >
                      {isGap ? "?" : step}
                    </span>
                    {isGap && (
                      <span className="text-xs text-charcoal-soft">
                        Where risk-to-action commonly stalls
                      </span>
                    )}
                  </div>
                  {!isLast && (
                    <div className="ml-8 h-5 w-px bg-charcoal/20" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
