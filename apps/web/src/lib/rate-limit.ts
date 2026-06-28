// Per-IP rate limiting for the public endpoints, backed by the same Upstash
// Redis that powers Vercel KV (the KV_REST_API_* env vars). Sliding windows
// so a burst near a window edge cannot double the allowance.
//
// In environments without the KV credentials (local dev, CI, tests) the
// limiters are a no-op — they return ok=true so the flows stay exercisable
// end-to-end, mirroring the suggestions-store and turnstile fallbacks.
// Production sets the credentials and limiting then enforces.

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { corsJson } from "@/lib/api-cors";

export interface RateLimitResult {
  ok: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix ms when the window resets
}

const PASS: RateLimitResult = { ok: true, limit: 0, remaining: 0, reset: 0 };

function kvConfigured(): boolean {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
  );
}

// Built lazily so importing this module never opens a Redis connection at
// build time; the instances are reused across warm invocations.
let redis: Redis | undefined;
let suggestLimiter: Ratelimit | undefined;
let apiLimiter: Ratelimit | undefined;

function getRedis(): Redis | undefined {
  if (!kvConfigured()) return undefined;
  redis ??= new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
  return redis;
}

function toResult(r: {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}): RateLimitResult {
  return { ok: r.success, limit: r.limit, remaining: r.remaining, reset: r.reset };
}

// SHA-256 of the source IP so limits are keyed per source without handling
// raw IPs. Truncated like the suggestions store: collisions are harmless here.
export async function clientId(req: Request): Promise<string> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(ip + ":medikquantis"),
  );
  return Array.from(new Uint8Array(buf))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// 5 suggestions per IP per hour — generous for a human filling the form,
// tight enough to blunt a bot hammering KV behind Turnstile.
export async function limitSuggestions(
  identifier: string,
): Promise<RateLimitResult> {
  const r = getRedis();
  if (!r) return PASS;
  suggestLimiter ??= new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "medikquantis:rl:suggest",
  });
  return toResult(await suggestLimiter.limit(identifier));
}

// 60 calls per IP per minute on the public calculator API — room for a
// legitimate clinical app, a wall against scraping/abuse of the keyless API.
export async function limitApi(identifier: string): Promise<RateLimitResult> {
  const r = getRedis();
  if (!r) return PASS;
  apiLimiter ??= new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    prefix: "medikquantis:rl:api",
  });
  return toResult(await apiLimiter.limit(identifier));
}

// Standard 429 response with Retry-After + rate-limit headers.
export function tooManyRequests(rl: RateLimitResult): Response {
  const retryAfter = Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000));
  return corsJson(
    { error: "Rate limit exceeded", retryAfterSeconds: retryAfter },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(rl.limit),
        "X-RateLimit-Remaining": String(rl.remaining),
        "X-RateLimit-Reset": String(rl.reset),
      },
    },
  );
}
