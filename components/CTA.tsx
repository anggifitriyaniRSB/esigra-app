import { contactEmail, partnerTracks } from "@/lib/data";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section id="contact" className="border-t border-charcoal/10 bg-forest py-20 text-ivory md:py-28">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <Reveal className="text-center">
          <h2 className="mx-auto max-w-2xl font-serif text-3xl leading-tight md:text-4xl">
            Build the next phase with us.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[1.05rem] leading-relaxed text-sage-light">
            Whether you run a facility, shape system-level policy, or bring
            technology and research capacity — there&rsquo;s a role in
            e-SIGRA&rsquo;s next phase.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {partnerTracks.map((track, i) => (
            <Reveal key={track.title} delay={i * 80}>
              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent(track.subject)}`}
                className="group flex h-full flex-col rounded-lg border border-white/15 bg-white/5 p-6 text-left transition-colors hover:border-signal/60 hover:bg-white/10"
              >
                <span className="text-3xl" aria-hidden="true">
                  {track.emoji}
                </span>
                <h3 className="mt-4 font-serif text-lg text-ivory">{track.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-sage">{track.focus}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-sage-light">
                  {track.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-signal">
                  Get in touch
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={240} className="mt-10 text-center">
          <a
            href="#pilot"
            className="text-sm font-medium text-ivory underline decoration-sage/60 decoration-2 underline-offset-4 hover:decoration-signal"
          >
            Or explore the pilot first
          </a>
          <p className="mt-6 text-sm text-sage-light">
            Prefer email directly?{" "}
            <a href={`mailto:${contactEmail}`} className="underline underline-offset-4">
              {contactEmail}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
