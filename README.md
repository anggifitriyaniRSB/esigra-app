# e-SIGRA — Landing Page

Digital Preventive Health & Early Risk Detection Platform. "From Risk to Action."

A Next.js 14 (App Router) + TypeScript + Tailwind CSS landing page for e-SIGRA,
built around the FGC 2.0 pilot (Medan, North Sumatra).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To build for production:

```bash
npm run build
npm run start
```

## Project structure

```
app/
  layout.tsx        Root layout, fonts (Fraunces + Manrope), SEO/OG metadata
  page.tsx           Assembles all sections
  globals.css         Global styles, focus states, reduced-motion handling
components/
  Navbar.tsx          Sticky nav, mobile menu
  Hero.tsx             Hero + abstract Detect→Monitor workflow diagram
  Problem.tsx          "The gap is not only detection" section
  Platform.tsx         4-card platform overview
  Workflow.tsx          Interactive How-It-Works (desktop) / timeline (mobile)
  ProductShowcase.tsx    3 conceptual product screens (clearly labelled as such)
  Safety.tsx             Responsible digital health pillars
  Evidence.tsx            Development timeline + readiness evidence (tests/lint)
  Pilot.tsx                FGC 2.0 pilot targets + phases
  Metrics.tsx               Risk-to-Action Completion Rate + secondary metrics
  Ecosystem.tsx              Health system value / future evaluation chain
  Roadmap.tsx                 3-year roadmap + adoption ladder
  Team.tsx                     Role-based team structure
  CTA.tsx                       Final call to action
  Footer.tsx                     Footer + links
  Reveal.tsx                     Shared fade-up-on-scroll wrapper (IntersectionObserver)
  CountUp.tsx                    Count-up for static pilot target numbers
lib/
  data.ts               All section content as typed arrays — edit copy here,
                          not inside the components.
```

## Brand assets

Real assets are wired in (sourced from the official logo file and the
founder-supplied headshot/product screenshots):

- `public/images/logo-icon.png` — icon mark, used in the navbar
  (`components/Navbar.tsx`)
- `app/icon.png` / `app/apple-icon.png` — favicon and Apple touch icon,
  cropped from the same source logo
- `public/images/logo-full.png` — full lockup (icon + wordmark + tagline),
  not currently placed on the page but available if you add a use for it
- `public/founder-anggi.jpg` — founder headshot, used in the Team section
  (`lib/data.ts` → `teamGroups`)
- `public/screenshots/*.jpg` — real product screenshots, used in Product
  Experience (`lib/data.ts` → `productScreens`); browser chrome was cropped
  out, everything else is unedited

To swap any of these for updated versions, replace the file at the same
path and keep the same filename (or update the reference in `lib/data.ts`
/ `components/Navbar.tsx` if you rename it).

## Before launch

- Replace the placeholder domain in `lib/site-config.ts` (`SITE_URL`) with
  the real production domain. Canonical URL, Open Graph/Twitter URLs,
  `robots.txt`, `sitemap.xml`, and the JSON-LD structured data all read
  from that one constant.

## Content notes

- All copy in `lib/data.ts` follows the brief's guardrails: no claims of
  autonomous diagnosis, no predictive-AI claims, no claimed BPJS/JKN savings,
  and pilot numbers are explicitly labelled as targets, not results.
- Where the brief did not supply named team members (Community, Technology),
  role placeholders are used instead of invented names. The Founder role
  uses the real name/credential/photo supplied for this project.
- Product screens in `ProductShowcase.tsx` are real screenshots from the
  e-SIGRA prototype, labelled to make clear the on-screen names/figures are
  demo data, not real patients.

## Accessibility & performance

- Semantic headings, keyboard-navigable nav and interactive workflow steps,
  visible focus rings (`globals.css`).
- `prefers-reduced-motion` disables scroll-reveal and count-up animation.
- Fonts loaded via `next/font/google` (self-hosted, no layout shift).
- No large client-side libraries beyond `lucide-react` icons; motion is CSS
  + small custom hooks rather than a full animation library on the critical
  path.
