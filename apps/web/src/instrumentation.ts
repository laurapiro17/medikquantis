// Sentry server/edge error capture, initialised through Next.js's
// instrumentation hook. Errors-only: tracesSampleRate is 0 so we stay well
// inside the free tier (no performance transactions billed).
//
// Without SENTRY_DSN — local dev, CI, preview — register() is a no-op and the
// app runs untouched, mirroring the KV / Turnstile fallbacks elsewhere.
// Production sets SENTRY_DSN and errors then flow to Sentry.

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN;

export async function register() {
  if (!dsn) return;

  const runtime = process.env.NEXT_RUNTIME;
  if (runtime === "nodejs" || runtime === "edge") {
    Sentry.init({
      dsn,
      environment: process.env.VERCEL_ENV ?? "development",
      tracesSampleRate: 0,
    });
  }
}

// Surfaces errors thrown in Server Components, route handlers and middleware.
export const onRequestError = Sentry.captureRequestError;
