"use client";

import { useEffect, useState } from "react";

export function CountUp({
  value,
  durationMs = 1000,
  decimals = 0,
  className,
}: {
  value: number;
  durationMs?: number;
  decimals?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      const e = 1 - Math.pow(1 - p, 3);
      const cur = value * e;
      setDisplay(
        decimals ? Math.round(cur * 10 ** decimals) / 10 ** decimals : Math.round(cur),
      );
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [value, durationMs, decimals]);

  return <span className={className}>{decimals ? display.toFixed(decimals) : display}</span>;
}
