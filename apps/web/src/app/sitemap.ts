import type { MetadataRoute } from "next";
import { listCalcIds } from "@medcalc/calculators";
import { routing } from "@/i18n/routing";
import { BASE_URL } from "@/lib/site";
import { REVIEWER } from "@/lib/reviewer";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const reviewed = new Date(REVIEWER.lastReviewedIso);
  const calcIds = new Set(listCalcIds());
  const localePaths = [
    "",
    "about",
    "privacy",
    "terms",
    "compare",
    "changelog",
    "methodology",
    ...listCalcIds(),
  ];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of localePaths) {
      const url = path
        ? `${BASE_URL}/${locale}/${path}`
        : `${BASE_URL}/${locale}`;
      entries.push({
        url,
        lastModified: path === "" ? now : calcIds.has(path) ? reviewed : now,
        changeFrequency:
          path === ""
            ? "weekly"
            : path === "about" || path === "privacy" || path === "terms"
              ? "yearly"
              : "monthly",
        priority: path === "" ? 1.0 : 0.7,
      });
    }
  }

  entries.push({
    url: `${BASE_URL}/api/v1/docs`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  });

  return entries;
}
