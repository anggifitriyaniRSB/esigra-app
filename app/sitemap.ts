import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

// SITE_URL is a placeholder (see lib/site-config.ts) — replace it there
// before launch. This is a single-page site, so the sitemap has one
// entry; the in-page anchors (#platform, #pilot, etc.) aren't separate
// crawlable URLs and don't belong in a sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1
    }
  ];
}
