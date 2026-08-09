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
 * Set in Vercel project settings (Production + Preview). When unset — local
 * dev, forks, CI — the script is not injected and `track()` degrades to
 * Vercel-only, so nothing here can break a build or a contributor's setup.
 */
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

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
