/**
 * Analytics fan-out.
 *
 * Two providers run side by side, on purpose:
 *   - Vercel Web Analytics  — page views, visitors, referrers. On the Hobby
 *     plan it SILENTLY DROPS custom events, so the `track()` calls below were
 *     effectively going nowhere until Umami was added.
 *   - Umami Cloud — custom events + visit duration, cookie-free (no consent
 *     banner needed under GDPR, which matters for EU clinical traffic).
 *
 * Call sites import `track` from here, never from `@vercel/analytics`
 * directly, so a provider can be swapped in one place.
 */
import { track as vercelTrack } from "@vercel/analytics";

/**
 * Umami Cloud script host. Accounts created in the EU region are served from
 * `eu.umami.is` instead — change this constant if the dashboard URL differs.
 */
export const UMAMI_SRC = "https://cloud.umami.is/script.js";

/** Umami host, for the `<link rel="preconnect">` in the root layout. */
export const UMAMI_ORIGIN = new URL(UMAMI_SRC).origin;

/**
 * Public site id. Not a secret — it ships in the HTML of every page, and it
 * only identifies which dashboard receives the beacon.
 */
export const UMAMI_WEBSITE_ID = "98319327-932c-43fa-8482-3152b3b77194";

/**
 * Umami only sends beacons from these hostnames. This is what keeps localhost,
 * CI, forks and Vercel preview deploys out of the production numbers, so no
 * env var (and no "did you redeploy after setting it?" failure mode) is needed.
 *
 * Both hosts are listed because `www.` serves the site directly rather than
 * redirecting to the apex.
 */
export const UMAMI_DOMAINS = "medikquantis.me,www.medikquantis.me";

type EventData = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    umami?: { track: (name: string, data?: EventData) => void };
  }
}

/**
 * Send one custom event to every configured provider.
 *
 * Never throws: analytics must not be able to take down a calculator. If the
 * Umami script is blocked (ad blockers catch some of them) `window.umami` is
 * simply absent and that leg is skipped.
 */
export function track(name: string, data?: EventData): void {
  vercelTrack(name, data);
  if (typeof window !== "undefined") {
    try {
      window.umami?.track(name, data);
    } catch {
      // ignore — a failed beacon is never worth surfacing to the user
    }
  }
}
