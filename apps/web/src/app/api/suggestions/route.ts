import { z } from "zod";
import { corsJson, corsPreflight } from "@/lib/api-cors";
import { getStore } from "@/lib/suggestions-store";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "edge";

const SuggestionBody = z.object({
  calcName: z.string().trim().min(2).max(120),
  specialty: z.string().trim().max(60).optional(),
  context: z.string().trim().max(2000).optional(),
  contactEmail: z.string().trim().email().max(120).optional().or(z.literal("")),
  locale: z.enum(["en", "es", "ca"]).optional(),
  turnstileToken: z.string().max(2500).optional(),
  // Honeypot — humans never see it; bots fill it. Reject if non-empty.
  website: z.string().max(0).optional(),
});

// Cheap, deterministic IP hash so we can rate-limit per source without
// storing raw IPs. SHA-256 via Web Crypto (available in edge runtime).
async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip + ":medikquantis");
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function OPTIONS(): Response {
  return corsPreflight();
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return corsJson({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = SuggestionBody.safeParse(body);
  if (!parsed.success) {
    return corsJson(
      { error: "Validation failed", fields: parsed.error.issues },
      { status: 422 },
    );
  }

  // Honeypot trip — pretend success so the bot doesn't retry, but never
  // store the row.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return corsJson({ ok: true });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = await hashIp(ip);

  const turn = await verifyTurnstile(parsed.data.turnstileToken, ip);
  if (!turn.ok) {
    return corsJson(
      { error: "Captcha failed", reason: turn.reason },
      { status: 403 },
    );
  }

  const store = getStore();
  const saved = await store.add({
    calcName: parsed.data.calcName,
    specialty: parsed.data.specialty || undefined,
    context: parsed.data.context || undefined,
    contactEmail: parsed.data.contactEmail || undefined,
    locale: parsed.data.locale ?? "en",
    ipHash,
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  return corsJson({ ok: true, id: saved.id });
}
