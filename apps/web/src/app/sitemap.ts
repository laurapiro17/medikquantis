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

  const POPULAR_CALCS = new Set([
    "cha2ds2vasc",
    "ckd-epi-2021",
    "score2",
    "nihss",
    "meld-3",
    "gcs",
    "has-bled",
    "grace",
    "curb-65",
    "wells-pe",
    "qsofa",
  ]);

  for (const locale of routing.locales) {
    for (const path of localePaths) {
      const url = path
        ? `${BASE_URL}/${locale}/${path}`
        : `${BASE_URL}/${locale}`;
      
      let priority = 0.7;
      if (path === "") {
        priority = 1.0;
      } else if (POPULAR_CALCS.has(path)) {
        priority = 0.9;
      } else if (path === "privacy" || path === "terms") {
        priority = 0.3;
      } else if (path === "about" || path === "methodology" || path === "changelog") {
        priority = 0.5;
      }

      entries.push({
        url,
        lastModified: path === "" ? now : calcIds.has(path) ? reviewed : now,
        changeFrequency:
          path === ""
            ? "weekly"
            : path === "about" || path === "privacy" || path === "terms"
              ? "yearly"
              : "monthly",
        priority,
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
