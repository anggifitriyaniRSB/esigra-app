import Image from "next/image";
import { teamGroups } from "@/lib/data";
import Reveal from "./Reveal";

export default function Team() {
  return (
    <section className="border-t border-charcoal/10 bg-ivory py-20 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <Reveal>
          <h2 className="max-w-xl font-serif text-3xl leading-tight text-forest-deep md:text-4xl">
            Clinical insight meets digital execution.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {teamGroups.map((group, i) => (
            <Reveal key={group.title} delay={i * 80}>
              <div className="border-t border-charcoal/15 pt-5">
                {"name" in group && group.name && (
                  <div className="mb-4 flex items-center gap-3">
                    {"photo" in group && group.photo && (
                      <Image
                        src={group.photo}
                        alt={group.name}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-full object-cover object-[50%_30%]"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-forest-deep">{group.name}</p>
                      {"credential" in group && group.credential && (
                        <p className="text-xs text-charcoal-soft">{group.credential}</p>
                      )}
                    </div>
                  </div>
                )}
                <h3 className="font-serif text-xl text-forest-deep">{group.title}</h3>
                {"bio" in group && group.bio && (
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{group.bio}</p>
                )}
                <ul className="mt-3 space-y-2">
                  {group.responsibilities.map((item) => (
                    <li key={item} className="text-sm text-charcoal-soft">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-xs leading-relaxed text-charcoal-soft">
          e-SIGRA is registered as a computer program copyright with
          Indonesia&rsquo;s copyright office (registration no. 000920504),
          listing Anggi Fitriyani and Erina Eka Hatini, S.S.T., M.P.H. as
          creators. Registration establishes authorship, not clinical
          validation.
        </p>
      </div>
    </section>
  );
}
