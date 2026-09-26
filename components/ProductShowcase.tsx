import Image from "next/image";
import { productScreens } from "@/lib/data";
import Reveal from "./Reveal";

export default function ProductShowcase() {
  return (
    <section className="border-t border-charcoal/10 bg-ivory py-20 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <Reveal>
          <h2 className="max-w-xl font-serif text-3xl leading-tight text-forest-deep md:text-4xl">
            Designed for the field, not just the dashboard.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {productScreens.map((screen, i) => (
            <Reveal key={screen.id} delay={i * 80}>
              <ScreenCard screen={screen} />
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-xs text-charcoal-soft">
          Actual screenshots from the e-SIGRA prototype. Names and figures
          shown are demo data, not real patients.
        </p>
      </div>
    </section>
  );
}

function ScreenCard({
  screen
}: {
  screen: (typeof productScreens)[number];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-charcoal/10 bg-white">
      <div className="border-b border-charcoal/10 bg-sage-pale/50 px-5 py-3">
        <p className="text-[11px] font-semibold tracking-wide text-olive">{screen.label}</p>
      </div>
      <div className="relative aspect-[1040/576] w-full bg-ivory">
        <Image
          src={screen.image}
          alt={`${screen.title} screen in the e-SIGRA prototype`}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover object-top"
        />
      </div>
      <div className="border-t border-charcoal/10 px-5 py-4">
        <h3 className="font-serif text-lg text-forest-deep">{screen.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{screen.description}</p>
        {"note" in screen && screen.note && (
          <p className="mt-3 border-t border-charcoal/10 pt-3 text-xs leading-relaxed text-olive">
            {screen.note}
          </p>
        )}
      </div>
    </div>
  );
}
