import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { BASE_URL } from "@/lib/site";

/**
 * SEO metadata for a static localized page (e.g. /compare, /about) — the
 * non-calculator counterpart to buildCalcMetadata. Produces a keyword-bearing
 * title, a self-referential canonical, and hreflang alternates for every
 * locale + x-default. Without it these pages inherit the layout's generic
 * "MedikQuantis" title and homepage canonical.
 *
 * `title` is returned WITHOUT a site-name suffix; the layout's title.template
 * ("%s · MedikQuantis") appends it.
 */
export function buildPageMetadata({
  pathSegment,
  locale,
  title,
  description,
}: {
  pathSegment: string;
  locale: string;
  title: string;
  description: string;
}): Metadata {
  const path = (l: string) => `${BASE_URL}/${l}/${pathSegment}`;

  return {
    title,
    description,
    alternates: {
      canonical: path(locale),
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, path(l)])),
        "x-default": path(routing.defaultLocale),
      },
    },
    openGraph: {
      title,
      description,
      url: path(locale),
      siteName: "MedikQuantis",
      type: "article",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
