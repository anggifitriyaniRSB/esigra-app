import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

// SITE_URL is a placeholder (see lib/site-config.ts) — replace it there
// before launch and this file (and the generated /robots.txt) updates
// automatically.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
