"use client";

import { useEffect, useState } from "react";

/**
 * Read the ?p= URL parameter (base64url-encoded JSON) at mount and return its
 * decoded payload. Runs as a post-mount effect (not in the initial render)
 * so that SSR markup never disagrees with the first client render — the same
 * default form state is rendered on both sides, then this hook fires and
 * the form opts to hydrate from the URL.
 *
 * Returns null when the URL has no `?p=`, or when decoding fails. Forms
 * should observe the returned value with their own effect and update their
 * state + submitted flag accordingly.
 */
export function useUrlInputs(): Record<string, unknown> | null {
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");
    if (!p) return;
    try {
      const padded = p.replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(padded);
      const parsed = JSON.parse(json);
      if (parsed && typeof parsed === "object") {
        setData(parsed as Record<string, unknown>);
      }
    } catch {
      // Malformed payload — ignore, form stays at defaults.
    }
  }, []);

  return data;
}
