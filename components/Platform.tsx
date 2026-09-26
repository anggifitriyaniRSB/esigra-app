import { platformCards } from "@/lib/data";
import Reveal from "./Reveal";

export default function Platform() {
  return (
    <section id="platform" className="border-t border-charcoal/10 bg-ivory py-20 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-olive">WHAT IS e-SIGRA?</p>
          <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight text-forest-deep md:text-4xl">
            A closed-loop preventive health platform.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-charcoal/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-4">
          {platformCards.map((card, i) => (
            <Reveal key={card.number} delay={i * 70}>
              <div className="h-full bg-ivory p-8">
                <span className="font-serif text-sm text-olive">{card.number}</span>
                <h3 className="mt-3 font-serif text-xl text-forest-deep">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-soft">
                  {card.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
