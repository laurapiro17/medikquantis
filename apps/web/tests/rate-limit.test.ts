import { afterEach, describe, expect, it, vi } from "vitest";

describe("rate-limit lib", () => {
  it("is a no-op (ok) when KV is not configured", async () => {
    const { limitSuggestions } = await import("@/lib/rate-limit");
    const r = await limitSuggestions("deadbeef");
    expect(r.ok).toBe(true);
  });
});

describe("POST /api/suggestions rate limiting", () => {
  afterEach(() => {
    vi.doUnmock("@/lib/rate-limit");
    vi.resetModules();
  });

  it("returns 429 with Retry-After when the limiter rejects", async () => {
    vi.doMock("@/lib/rate-limit", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/lib/rate-limit")>();
      return {
        ...actual,
        limitSuggestions: async () => ({
          ok: false,
          limit: 5,
          remaining: 0,
          reset: Date.now() + 60_000,
        }),
      };
    });
    const { POST } = await import("@/app/api/suggestions/route");
    const req = new Request("https://x.example/api/suggestions", {
      method: "POST",
      body: JSON.stringify({ calcName: "Some Score" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(429);
    expect(Number(res.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(res.headers.get("X-RateLimit-Limit")).toBe("5");
    const body = await res.json();
    expect(body.error).toBe("Rate limit exceeded");
  });

  it("passes through (200) when under the limit", async () => {
    // Real no-op limiter (KV unset) → ok; Turnstile + store also fall back.
    const { POST } = await import("@/app/api/suggestions/route");
    const req = new Request("https://x.example/api/suggestions", {
      method: "POST",
      body: JSON.stringify({ calcName: "Some Score" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});

describe("POST /api/v1 rate limiting", () => {
  afterEach(() => {
    vi.doUnmock("@/lib/rate-limit");
    vi.resetModules();
  });

  // Partial mock: only force limitApi to reject; clientId + tooManyRequests
  // stay real so the wiring (identifier derivation + 429 shape) is exercised.
  function mockApiLimited() {
    vi.doMock("@/lib/rate-limit", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/lib/rate-limit")>();
      return {
        ...actual,
        limitApi: async () => ({
          ok: false,
          limit: 60,
          remaining: 0,
          reset: Date.now() + 1000,
        }),
      };
    });
  }

  it("429s the calculator endpoint when limited", async () => {
    mockApiLimited();
    const { POST } = await import("@/app/api/v1/[calc]/route");
    const req = new Request("https://x.example/api/v1/cha2ds2vasc", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req, { params: Promise.resolve({ calc: "cha2ds2vasc" }) });
    expect(res.status).toBe(429);
    expect(Number(res.headers.get("Retry-After"))).toBeGreaterThan(0);
  });

  it("429s the batch endpoint when limited", async () => {
    mockApiLimited();
    const { POST } = await import("@/app/api/v1/batch/route");
    const req = new Request("https://x.example/api/v1/batch", {
      method: "POST",
      body: JSON.stringify({ calcs: [] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(429);
  });
});
