"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Why this exists: every analytics tool (Umami included) derives "time on
 * page" from the gap between two page views. A visit that loads one
 * calculator, computes a score and leaves has no second page view, so it is
 * reported as a 0-second bounce — which is precisely the visit we care about
 * most. This fires one explicit `page_engagement` event on the way out so
 * single-page visits get a real duration.
 *
 * Only time with the tab actually VISIBLE is counted: a page left open in a
 * background tab for an hour is not engagement.
 */

/**
 * Upper bounds, in seconds, of the buckets reported to analytics.
 * A visit longer than the last bound is reported as `>{last}s`.
 *
 * Buckets rather than raw seconds because Umami lists every distinct property
 * value in its report — raw seconds would produce hundreds of one-hit rows
 * instead of a readable histogram.
 *
 * The bounds mark what a visit to a calculator actually means: under 15s there
 * was no time to fill the form, under 45s is the score-and-leave visit (a
 * success here, even though every tool counts it as a bounce), under 120s the
 * interpretation was read, and beyond that the notes and references were.
 * Changing them once data exists splits the series, so they are deliberate.
 */
const BUCKET_BOUNDS_S = [15, 45, 120, 300];

function bucket(seconds: number): string {
  const hit = BUCKET_BOUNDS_S.find((bound) => seconds < bound);
  return hit !== undefined
    ? `<${hit}s`
    : `>${BUCKET_BOUNDS_S[BUCKET_BOUNDS_S.length - 1]}s`;
}

export function EngagementTracker() {
  useEffect(() => {
    let visibleMs = 0;
    let since = document.visibilityState === "visible" ? performance.now() : 0;
    let sent = false;

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        since = performance.now();
      } else if (since) {
        visibleMs += performance.now() - since;
        since = 0;
      }
    };

    // `pagehide` rather than `beforeunload`: it also fires on mobile Safari
    // and on bfcache navigations, where `beforeunload` does not.
    const onPageHide = () => {
      if (sent) return;
      sent = true;
      if (since) visibleMs += performance.now() - since;
      const seconds = Math.round(visibleMs / 1000);
      track("page_engagement", { duration: bucket(seconds), seconds });
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

  return null;
}
