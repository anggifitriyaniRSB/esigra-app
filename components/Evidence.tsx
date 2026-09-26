import { evidenceTimeline, evidenceAtAGlance, readinessEvidence } from "@/lib/data";
import Reveal from "./Reveal";

export default function Evidence() {
  return (
    <section id="evidence" className="border-t border-charcoal/10 bg-ivory py-20 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-olive">EVIDENCE</p>
          <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight text-forest-deep md:text-4xl">
            Built from the field. Evolving through evidence.
          </h2>
        </Reveal>

        <Reveal delay={60}>
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-charcoal/10 bg-charcoal/10 sm:grid-cols-4 lg:grid-cols-7">
            {evidenceAtAGlance.map((item) => (
              <div key={item.label} className="bg-ivory p-4">
                <p className="text-[11px] uppercase tracking-wide text-olive">{item.label}</p>
                <p className="mt-1 text-sm font-medium leading-snug text-forest-deep">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col md:flex-row md:gap-16">
          <div className="flex-1">
            <ol className="relative border-l border-charcoal/15 pl-8">
              {evidenceTimeline.map((item, i) => (
                <Reveal key={item.year} delay={i * 70}>
                  <li className="relative pb-10 last:pb-0">
                    <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-forest bg-ivory" />
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="font-serif text-lg text-olive">{item.year}</span>
                      <span className="text-[11px] uppercase tracking-wide text-charcoal-soft">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="mt-1 font-serif text-xl text-forest-deep">{item.title}</h3>
                    <p className="mt-1.5 max-w-md text-sm leading-relaxed text-charcoal-soft">
                      {item.description}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal delay={120} className="mt-14 w-full shrink-0 md:mt-0 md:w-72">
            <div className="rounded-lg border border-charcoal/10 bg-forest-deep p-7 text-ivory">
              <p className="text-xs tracking-wide text-sage">Development / readiness evidence</p>
              <div className="mt-5 flex flex-col gap-5">
                {readinessEvidence.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-serif text-4xl">{stat.value}</p>
                    <p className="mt-1 text-sm text-sage-light">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 border-t border-white/15 pt-4 text-xs leading-relaxed text-sage-light">
                Software-readiness indicators, not clinical outcome evidence.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
