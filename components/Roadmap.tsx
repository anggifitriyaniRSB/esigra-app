import { adoptionLadder, roadmapYears } from "@/lib/data";
import Reveal from "./Reveal";

export default function Roadmap() {
  return (
    <section id="roadmap" className="border-t border-charcoal/10 bg-sand/40 py-20 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-olive">ROADMAP</p>
          <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight text-forest-deep md:text-4xl">
            Designed to scale in stages.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {roadmapYears.map((item, i) => (
            <Reveal key={item.year} delay={i * 80}>
              <div className="h-full rounded-lg border border-charcoal/10 bg-white/70 p-7">
                <p className="text-xs tracking-wide text-olive">{item.year}</p>
                <h3 className="mt-2 font-serif text-2xl text-forest-deep">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-soft">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-14">
            <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
              Proposed adoption ladder
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              {adoptionLadder.map((stage, i) => (
                <div key={stage} className="flex items-center gap-2.5">
                  <span className="rounded-full border border-forest/25 bg-ivory px-4 py-2 text-sm text-forest-deep">
                    {stage}
                  </span>
                  {i < adoptionLadder.length - 1 && (
                    <span className="text-charcoal/30" aria-hidden="true">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-charcoal-soft">
              Interoperability with relevant health-system infrastructure
              (such as SATUSEHAT or Puskesmas information systems) is a
              future scale-up consideration; the current pilot focuses on
              validating the risk-to-action workflow itself.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
