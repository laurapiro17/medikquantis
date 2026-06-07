import { kv } from "@vercel/kv";

// One stored suggestion. `id` is a Unix-ms timestamp + random suffix so
// the same `(timestamp, ip-hash, locale)` combination cannot collide.
export interface Suggestion {
  id: string;
  createdAt: number; // Unix ms
  calcName: string;
  specialty?: string;
  context?: string;
  contactEmail?: string;
  locale: string;
  ipHash: string;
  userAgent?: string;
}

// Storage abstraction. The Vercel KV implementation is used at runtime
// when env vars are present; tests / `pnpm dev` without Vercel link use
// the in-memory fallback so the suggest flow remains exercisable.
export interface SuggestionsStore {
  add(s: Omit<Suggestion, "id" | "createdAt">): Promise<Suggestion>;
  list(limit?: number): Promise<Suggestion[]>;
  remove(id: string): Promise<boolean>;
  count(): Promise<number>;
}

const LIST_KEY = "medikquantis:suggestions";

function kvAvailable(): boolean {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
  );
}

class VercelKvStore implements SuggestionsStore {
  async add(input: Omit<Suggestion, "id" | "createdAt">): Promise<Suggestion> {
    const createdAt = Date.now();
    const id = `${createdAt}-${Math.random().toString(36).slice(2, 8)}`;
    const suggestion: Suggestion = { id, createdAt, ...input };
    // LPUSH puts newest at the head; consumers list with LRANGE 0..N.
    await kv.lpush(LIST_KEY, JSON.stringify(suggestion));
    return suggestion;
  }

  async list(limit = 200): Promise<Suggestion[]> {
    const raw = await kv.lrange<string>(LIST_KEY, 0, Math.max(limit - 1, 0));
    return raw.flatMap((row) => {
      try {
        // Some Vercel KV writes round-trip as objects already; both shapes
        // are normalised here.
        const parsed = typeof row === "string" ? JSON.parse(row) : row;
        return [parsed as Suggestion];
      } catch {
        return [];
      }
    });
  }

  async remove(id: string): Promise<boolean> {
    const all = await this.list(10_000);
    const next = all.filter((s) => s.id !== id);
    if (next.length === all.length) return false;
    await kv.del(LIST_KEY);
    if (next.length > 0) {
      // Re-push in reverse order so the newest stays at the head.
      const ordered = [...next].reverse();
      await kv.rpush(
        LIST_KEY,
        ...ordered.map((s) => JSON.stringify(s)),
      );
    }
    return true;
  }

  async count(): Promise<number> {
    return await kv.llen(LIST_KEY);
  }
}

class MemoryStore implements SuggestionsStore {
  private rows: Suggestion[] = [];

  async add(input: Omit<Suggestion, "id" | "createdAt">): Promise<Suggestion> {
    const createdAt = Date.now();
    const id = `${createdAt}-${Math.random().toString(36).slice(2, 8)}`;
    const s: Suggestion = { id, createdAt, ...input };
    this.rows.unshift(s);
    return s;
  }
  async list(limit = 200): Promise<Suggestion[]> {
    return this.rows.slice(0, limit);
  }
  async remove(id: string): Promise<boolean> {
    const before = this.rows.length;
    this.rows = this.rows.filter((s) => s.id !== id);
    return this.rows.length !== before;
  }
  async count(): Promise<number> {
    return this.rows.length;
  }
}

// Single shared in-memory instance keeps `pnpm dev` round-trippable
// across hot reloads; serverless cold starts wipe it but that is fine
// for local debugging.
declare global {
  var __medikquantis_mem_store__: MemoryStore | undefined;
}
const memoryFallback =
  globalThis.__medikquantis_mem_store__ ??
  (globalThis.__medikquantis_mem_store__ = new MemoryStore());

export function getStore(): SuggestionsStore {
  return kvAvailable() ? new VercelKvStore() : memoryFallback;
}
