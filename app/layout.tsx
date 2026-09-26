import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site-config";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap"
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600"],
  display: "swap"
});

// SITE_URL is a placeholder domain — see lib/site-config.ts for the one
// place to update it before launch. Everything below (canonical URL,
// Open Graph/Twitter URLs, robots.txt, sitemap.xml, JSON-LD) is derived
// from that single constant.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  openGraph: {
    title: "e-SIGRA — From Risk to Action.",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "id_ID"
    // Share-card image is supplied by app/opengraph-image.tsx (Next.js
    // file convention) — no need to list it here.
  },
  twitter: {
    card: "summary_large_image",
    title: "e-SIGRA — From Risk to Action.",
    description: SITE_DESCRIPTION
    // Card image is supplied by app/twitter-image.tsx.
  }
};

// Structured data (schema.org JSON-LD). Deliberately limited to
// Organization + WebSite — the two things we can state factually from
// the brief. No sameAs (no real social profiles to link), no founder,
// no address, no aggregateRating/review data: none of that is
// supplied, and inventing it would violate the "no unsupported claims"
// requirement. Extend this only with facts that are actually true.
function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/icon.svg`
        }
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#organization` }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="font-sans antialiased">
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
