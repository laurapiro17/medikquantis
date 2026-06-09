/**
 * Canonical production origin for the site.
 *
 * IMPORTANT: this MUST be the public domain, not the Vercel deploy URL.
 * Every page's `<link rel="canonical">`, the sitemap, robots.txt and the
 * OpenGraph URLs are derived from this value. If it points at
 * `*.vercel.app`, Google consolidates ranking signals on the deploy domain
 * and treats the public domain's pages as duplicates.
 *
 * Override per-environment via `NEXT_PUBLIC_SITE_URL` (e.g. preview deploys).
 * In production this env var should either be unset or set to the value below.
 */
export const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://medikquantis.me"
).replace(/\/+$/, "");
