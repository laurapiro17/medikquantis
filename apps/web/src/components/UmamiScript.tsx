"use client";

import Script from "next/script";
import {
  flushUmamiQueue,
  UMAMI_DOMAINS,
  UMAMI_SRC,
  UMAMI_WEBSITE_ID,
} from "@/lib/analytics";

// The Umami <Script>, in a client component so it can take `onLoad` (the root
// layout is a server component, and handlers can't cross that boundary).
// `onLoad` sends the events `track()` queued before the script had loaded.
export function UmamiScript() {
  return (
    <Script
      src={UMAMI_SRC}
      data-website-id={UMAMI_WEBSITE_ID}
      data-domains={UMAMI_DOMAINS}
      strategy="afterInteractive"
      onLoad={flushUmamiQueue}
    />
  );
}
