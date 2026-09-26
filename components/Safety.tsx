import { ShieldCheck, UserCheck, Lock } from "lucide-react";
import { safetyPillars } from "@/lib/data";
import Reveal from "./Reveal";

const icons = { "shield-check": ShieldCheck, "user-check": UserCheck, lock: Lock } as const;

export default function Safety() {
  return (
    <section className="border-t border-charcoal/10 bg-sand/50 py-20 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <Reveal>
          <span className="inline-block rounded-full bg-forest/10 px-3.5 py-1 text-xs font-medium text-forest">
            Responsible digital health
          </span>
          <h2 className="mt-5 max-w-xl font-serif text-3xl leading-tight text-forest-deep md:text-4xl">
            Built to assist care, not replace clinical judgement.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {safetyPillars.map((pillar, i) => {
            const Icon = icons[pillar.icon as keyof typeof icons];
            return (
              <Reveal key={pillar.title} delay={i * 80}>
                <div className="flex flex-col">
                  <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-forest/25 text-forest">
                    <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-serif text-xl text-forest-deep">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-soft">
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
