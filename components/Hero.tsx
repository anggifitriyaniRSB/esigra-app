import { ArrowRight, ShieldCheck, UserCheck, Lock } from "lucide-react";
import { workflowSteps } from "@/lib/data";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ivory pt-32 pb-16 md:pt-40 md:pb-20">
      <div
        className="pointer-events-none absolute -right-40 -top-24 h-[560px] w-[560px] rounded-full bg-sage-pale/60 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-content gap-16 px-6 md:grid-cols-2 md:gap-10 md:px-10">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-olive">
            DIGITAL PREVENTIVE HEALTH
          </p>
          <p className="mt-6 text-base text-charcoal-soft md:text-lg">
            Risk detection is only the beginning.
          </p>
          <h1 className="mt-2 font-serif text-[2.75rem] font-medium leading-[1.02] text-forest-deep sm:text-6xl md:text-[4rem]">
            From Risk to Action<span className="text-signal">.</span>
          </h1>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-charcoal-soft">
            e-SIGRA is a digital preventive-health platform that helps
            community health workers, cadres and primary-care teams identify
            and follow up risk among pregnant women. It connects screening,
            prioritised alerts, validation and structured follow-up into one
            accountable workflow.
          </p>
          <p className="mt-4 text-sm text-olive">
            Field-tested since 2022 — now piloting in Medan, North Sumatra to
            measure how completely detected risk turns into follow-up.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#platform"
              className="inline-flex items-center gap-2 rounded-sm bg-forest px-6 py-3.5 text-sm font-medium text-ivory transition-colors hover:bg-forest-deep"
            >
              Explore e-SIGRA
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a
              href="#pilot"
              className="inline-flex items-center gap-2 rounded-sm px-6 py-3.5 text-sm font-medium text-forest underline decoration-sage decoration-2 underline-offset-4 transition-colors hover:text-forest-deep"
            >
              See the Pilot
            </a>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <WorkflowVisual />
        </Reveal>

        <Reveal
          delay={200}
          className="border-t border-charcoal/10 pt-6 md:col-span-2"
        >
          <div className="flex flex-col gap-3 text-xs text-charcoal-soft md:flex-row md:flex-wrap md:items-center md:gap-x-10 md:gap-y-3">
            <div className="flex items-start gap-2">
              <UserCheck size={14} className="mt-0.5 shrink-0 text-forest" strokeWidth={1.75} aria-hidden="true" />
              <span>Validated by health workers, not an automated diagnosis</span>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-forest" strokeWidth={1.75} aria-hidden="true" />
              <span>Rules- and scoring-based screening</span>
            </div>
            <div className="flex items-start gap-2">
              <Lock size={14} className="mt-0.5 shrink-0 text-forest" strokeWidth={1.75} aria-hidden="true" />
              <span>Role-based access &amp; QR-code revocation</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WorkflowVisual() {
  // A vertical living-system diagram: nodes connected by a single flowing
  // signal line, rather than a generic dashboard mockup. This line/node
  // language is reused in the How-It-Works section so the two read as one
  // visual signature.
  const gap = 76;
  const startY = 30;

  return (
    <div className="relative mx-auto w-full max-w-md rounded-xl border border-charcoal/10 bg-white/70 p-6 shadow-[0_1px_0_rgba(41,39,34,0.06)] sm:p-8 md:mt-2">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-olive">
        THE RISK-TO-ACTION WORKFLOW
      </p>
      <svg
        viewBox={`0 0 320 ${startY + gap * (workflowSteps.length - 1) + 40}`}
        className="mt-5 w-full"
        role="img"
        aria-label="Workflow: Detect, Understand, Alert, Validate, Act, Monitor"
      >
        <line
          x1="30"
          y1={startY}
          x2="30"
          y2={startY + gap * (workflowSteps.length - 1)}
          stroke="#AAB99A"
          strokeWidth="1.5"
          pathLength={1}
          className="signal-line drawn"
        />
        {workflowSteps.map((step, i) => {
          const y = startY + gap * i;
          const isAlert = step.id === "alert";
          return (
            <g key={step.id}>
              <circle
                cx="30"
                cy={y}
                r={isAlert ? 7 : 5.5}
                fill={isAlert ? "#C6E24B" : "#F7F3E9"}
                stroke="#1F3B2E"
                strokeWidth="1.5"
              />
              <text
                x="54"
                y={y + 4}
                fontFamily="var(--font-manrope)"
                fontSize="14"
                fontWeight={600}
                letterSpacing="0.02em"
                fill="#292722"
              >
                {step.title.toUpperCase()}
              </text>
              <text
                x="290"
                y={y + 4}
                fontFamily="var(--font-manrope)"
                fontSize="12"
                textAnchor="end"
                fill="#4B5A38"
              >
                {step.number}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-5 border-t border-charcoal/10 pt-4 text-xs leading-relaxed text-charcoal-soft">
        A connected workflow, not a single alert — each stage hands off to the
        next until follow-up is complete.
      </p>
    </div>
  );
}
