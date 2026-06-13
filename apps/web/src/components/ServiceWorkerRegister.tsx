"use client";

import { useEffect } from "react";

// Registers the service worker (public/sw.js) for offline support + install.
// Skips local dev hosts so HMR/dev chunks are never served from cache; the SW
// only runs on real deploys (Vercel preview + production, both HTTPS).
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const host = window.location.hostname;
    const isLocalDev = host === "localhost" || host === "127.0.0.1";
    if (isLocalDev) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration is best-effort; failure must never break the page.
      });
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });

    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
