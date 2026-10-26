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
 * Self-hosted Umami, on a subdomain of this site rather than a third-party
 * analytics host. That is not cosmetic: blocklists match by domain, and every
 * shared analytics host is on them, so a first-party subdomain is the
 * difference between counting visitors who browse with a blocker and not.
 */
export const UMAMI_SRC = "https://analytics.medikquantis.me/script.js";

/** Umami host, for the `<link rel="preconnect">` in the root layout. */
export const UMAMI_ORIGIN = new URL(UMAMI_SRC).origin;

/**
 * Public site id. Not a secret — it ships in the HTML of every page, and it
 * only identifies which dashboard receives the beacon.
 */
export const UMAMI_WEBSITE_ID = "7270e986-efce-4c33-a9f4-e5fc633ea6db";

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
 * Umami events sent before the script (loaded `afterInteractive`) has defined
 * `window.umami`. Load-time events — `calc_computed` from a shared `?p=` link,
 * fired during hydration — land in that window and used to be dropped.
 *
 * Capped because a blocked script never loads: the queue then just stops
 * growing. The earliest events are kept, since those are the load-time ones.
 */
const UMAMI_QUEUE_LIMIT = 20;
const umamiQueue: [string, EventData | undefined][] = [];

function sendToUmami(name: string, data?: EventData): void {
  try {
    window.umami?.track(name, data);
  } catch {
    // ignore — a failed beacon is never worth surfacing to the user
  }
}

/** Send the queued events. Called by the Umami `<Script onLoad>`. */
export function flushUmamiQueue(): void {
  if (!window.umami) return;
  for (const [name, data] of umamiQueue.splice(0)) sendToUmami(name, data);
}

/**
 * Send one custom event to every configured provider.
 *
 * Never throws: analytics must not be able to take down a calculator. Until
 * the Umami script has loaded, its leg is queued (see `umamiQueue`); if the
 * script is blocked (ad blockers catch some of them) it never loads and the
 * queued events are simply never sent.
 */
export function track(name: string, data?: EventData): void {
  vercelTrack(name, data);
  if (typeof window === "undefined") return;
  if (window.umami) sendToUmami(name, data);
  else if (umamiQueue.length < UMAMI_QUEUE_LIMIT) umamiQueue.push([name, data]);
}
