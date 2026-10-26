import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const vercelTrack = vi.fn();
vi.mock("@vercel/analytics", () => ({ track: vercelTrack }));

/**
 * `track()` only needs a `window` to hang `umami` on, so a plain object
 * stands in for it; the Umami script itself is replaced by assigning
 * `window.umami` and calling the hook the layout's `<Script onLoad>` calls.
 */
describe("track() before the Umami script has loaded", () => {
  beforeEach(() => {
    vi.resetModules();
    vercelTrack.mockClear();
    vi.stubGlobal("window", {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("delivers early events once Umami loads, in order and exactly once", async () => {
    const { track, flushUmamiQueue } = await import("@/lib/analytics");

    track("calc_computed", { calc: "curb-65" });
    track("share_link_opened");
    // Vercel's leg does not wait for Umami.
    expect(vercelTrack).toHaveBeenCalledTimes(2);

    const umamiTrack = vi.fn();
    window.umami = { track: umamiTrack };
    flushUmamiQueue();
    flushUmamiQueue();
    track("page_engagement");

    expect(umamiTrack.mock.calls).toEqual([
      ["calc_computed", { calc: "curb-65" }],
      ["share_link_opened", undefined],
      ["page_engagement", undefined],
    ]);
  });

  it("holds a bounded number of events when Umami never loads", async () => {
    const { track, flushUmamiQueue } = await import("@/lib/analytics");

    for (let i = 0; i < 1000; i++) track("calc_computed", { i });
    expect(vercelTrack).toHaveBeenCalledTimes(1000);

    const umamiTrack = vi.fn();
    window.umami = { track: umamiTrack };
    flushUmamiQueue();

    expect(umamiTrack.mock.calls.length).toBeGreaterThan(0);
    expect(umamiTrack.mock.calls.length).toBeLessThanOrEqual(50);
    // The earliest events — the load-time ones — are the ones kept.
    expect(umamiTrack.mock.calls[0]).toEqual(["calc_computed", { i: 0 }]);
  });
});
