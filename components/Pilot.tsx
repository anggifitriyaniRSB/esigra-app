import type { ReactNode } from "react";
import {
  pilotMetricCards,
  pilotOverview,
  pilotPhases,
  adoptionLadder
} from "@/lib/data";
import CountUp from "./CountUp";
import Reveal from "./Reveal";

export default function Pilot() {
  const [why, objective, who, deliverables] = pilotOverview;

  return (
    <section id="pilot" className="border-t border-charcoal/10 bg-sage-pale/40 py-20 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-olive">PILOT</p>
          <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight text-forest-deep md:text-4xl">
            e-SIGRA Pilot — Medan
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {pilotMetricCards.map((card, i) => (
            <Reveal key={card.label} delay={i * 80}>
              <div className="rounded-lg border border-charcoal/10 bg-white/70 p-7">
                <p className="font-serif text-4xl text-forest-deep md:text-5xl">
                  {"isMonths" in card && card.isMonths ? (
                    <>
                      <CountUp value={card.value} />
                      <span className="ml-2 text-xl text-olive">months</span>
                    </>
                  ) : (
                    <CountUp value={card.value} suffix={card.suffix} />
                  )}
                </p>
                <p className="mt-2 text-sm text-charcoal-soft">{card.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-xs font-medium text-charcoal-soft">
          Pilot targets — not achieved results.
        </p>

        <Reveal delay={100}>
          <div className="mt-14 divide-y divide-charcoal/10 rounded-lg border border-charcoal/10 bg-white/70">
            <OverviewRow label={why.label} body={why.body} />
            <OverviewRow label={objective.label} body={objective.body} />
            <OverviewRow label={who.label} body={who.body} />

            <OverviewRow label="What we measure">
              <p className="text-sm leading-relaxed text-charcoal-soft">
                The pilot will track whether identified risks move through
                review, validation and follow-up, using{" "}
                <span className="font-medium text-forest-deep">
                  Risk-to-Action Completion Rate
                </span>{" "}
                as the primary process metric.{" "}
                <a href="#measurement" className="underline underline-offset-4 hover:text-forest-deep">
                  Full measurement framework
                </a>
                .
              </p>
            </OverviewRow>

            <OverviewRow label="Timeline">
              <p className="text-sm leading-relaxed text-charcoal-soft">
                6 months, run in six phases: {pilotPhases.map((p) => p.title).join(" → ")}.
              </p>
            </OverviewRow>

            <OverviewRow label={deliverables.label} body={deliverables.body} />

            <OverviewRow label="Scale-up pathway">
              <p className="text-sm leading-relaxed text-charcoal-soft">
                Contingent on validated pilot evidence: {adoptionLadder.join(" → ")}.
              </p>
            </OverviewRow>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function OverviewRow({
  label,
  body,
  children
}: {
  label: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-2 p-6 sm:grid-cols-[180px_1fr] sm:gap-8 sm:p-7">
      <h3 className="font-serif text-lg text-forest-deep">{label}</h3>
      <div>{body ? <p className="text-sm leading-relaxed text-charcoal-soft">{body}</p> : children}</div>
    </div>
  );
}
