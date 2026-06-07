import { corsJson, corsPreflight } from "@/lib/api-cors";
import { getStore } from "@/lib/suggestions-store";

export const runtime = "edge";

// Tiny shared-secret check. ADMIN_KEY is set in Vercel project env vars.
// Without it set, the admin endpoints reject every request — fail-safe
// rather than fail-open.
function isAdmin(req: Request): boolean {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return false;
  const provided = req.headers.get("x-admin-key");
  if (!provided) return false;
  // Constant-time-ish compare to avoid trivial timing leak.
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < provided.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export function OPTIONS(): Response {
  return corsPreflight();
}

export async function GET(req: Request): Promise<Response> {
  if (!isAdmin(req)) {
    return corsJson({ error: "Unauthorised" }, { status: 401 });
  }
  const store = getStore();
  const rows = await store.list(500);
  return corsJson({
    count: rows.length,
    suggestions: rows,
  });
}

export async function DELETE(req: Request): Promise<Response> {
  if (!isAdmin(req)) {
    return corsJson({ error: "Unauthorised" }, { status: 401 });
  }
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return corsJson({ error: "Missing id" }, { status: 400 });
  const store = getStore();
  const removed = await store.remove(id);
  return corsJson({ ok: removed });
}
