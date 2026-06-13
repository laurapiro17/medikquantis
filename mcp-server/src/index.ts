#!/usr/bin/env node
/**
 * MedikQuantis MCP server.
 *
 * Exposes the open, free MedikQuantis clinical-calculator API
 * (https://medikquantis.me/api/v1) as Model Context Protocol tools, so an AI
 * agent / copilot can compute medical scores with traceable, PMID-cited
 * results instead of doing the arithmetic itself (and hallucinating cut-offs).
 *
 * The agent workflow is: list_calculators -> describe_calculator (to learn the
 * exact input fields) -> calculate. Everything is a thin, stateless proxy over
 * the public HTTP API; no patient data is stored.
 *
 * Configure the upstream with MEDIKQUANTIS_API_BASE (defaults to production).
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = (
  process.env.MEDIKQUANTIS_API_BASE ?? "https://medikquantis.me/api/v1"
).replace(/\/+$/, "");

const USER_AGENT = "medikquantis-mcp/0.1.0";

type ToolResult = {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
};

function ok(data: unknown, summary?: string): ToolResult {
  const json = JSON.stringify(data, null, 2);
  const text = summary ? `${summary}\n\n${json}` : json;
  return { content: [{ type: "text", text }] };
}

function fail(message: string, detail?: unknown): ToolResult {
  const text = detail
    ? `${message}\n\n${JSON.stringify(detail, null, 2)}`
    : message;
  return { content: [{ type: "text", text }], isError: true };
}

async function apiGet(path: string): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    headers: { accept: "application/json", "user-agent": USER_AGENT },
  });
}

async function apiPost(path: string, body: unknown): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": USER_AGENT,
    },
    body: JSON.stringify(body),
  });
}

// Build a short, human-readable, citable line from a calculate response so the
// agent has something quotable without re-parsing the JSON.
function summarize(r: Record<string, unknown>): string {
  const parts = [`${String(r.calc)} = ${String(r.score)}`];
  if (typeof r.tier === "string") parts.push(`tier: ${r.tier}`);
  if (typeof r.annualRiskPercent === "number")
    parts.push(`annual risk: ${r.annualRiskPercent}%`);
  if (typeof r.recommendation === "string") parts.push(String(r.recommendation));
  if (typeof r.evidenceGrade === "string")
    parts.push(`evidence ${r.evidenceGrade}`);
  return parts.join(" — ");
}

const server = new McpServer(
  { name: "medikquantis", version: "0.1.0" },
  {
    instructions:
      "Tools to compute clinical scores via the open MedikQuantis API. " +
      "Always call describe_calculator first to learn a calculator's exact " +
      "input fields and types before calling calculate. Results include the " +
      "primary-literature references (with PMIDs) — cite them. These tools " +
      "are decision support, not a substitute for clinical judgement.",
  },
);

server.tool(
  "list_calculators",
  "List every available clinical calculator (id, specialty, score range, " +
    "reference count). Optionally filter by specialty substring. Start here to " +
    "discover what can be computed.",
  { specialty: z.string().optional().describe("Case-insensitive specialty filter, e.g. 'cardio'") },
  async ({ specialty }) => {
    try {
      const res = await apiGet("");
      if (!res.ok) return fail(`API returned ${res.status}`, await res.text());
      const data = (await res.json()) as {
        calculators?: Array<{ specialty?: string }>;
      };
      let calcs = data.calculators ?? [];
      if (specialty) {
        const needle = specialty.toLowerCase();
        calcs = calcs.filter((c) =>
          String(c.specialty ?? "").toLowerCase().includes(needle),
        );
      }
      return ok(
        { count: calcs.length, calculators: calcs },
        `${calcs.length} calculator(s)${specialty ? ` matching "${specialty}"` : ""}.`,
      );
    } catch (e) {
      return fail("Failed to reach the MedikQuantis API.", String(e));
    }
  },
);

server.tool(
  "describe_calculator",
  "Get a calculator's input schema (JSON Schema of required fields/types) and " +
    "its primary-literature references. Call this before `calculate` so you " +
    "send exactly the fields it expects.",
  { id: z.string().describe("Calculator id, e.g. 'cha2ds2vasc' (from list_calculators)") },
  async ({ id }) => {
    try {
      const res = await apiGet(`/${encodeURIComponent(id)}`);
      if (res.status === 404) return fail(`Unknown calculator id: ${id}`);
      if (!res.ok) return fail(`API returned ${res.status}`, await res.text());
      return ok(await res.json());
    } catch (e) {
      return fail("Failed to reach the MedikQuantis API.", String(e));
    }
  },
);

server.tool(
  "calculate",
  "Compute a single clinical score. Returns the score, risk tier, " +
    "recommendation, evidence grade and the cited references. Use the field " +
    "names from describe_calculator.",
  {
    id: z.string().describe("Calculator id, e.g. 'cha2ds2vasc'"),
    inputs: z
      .record(z.any())
      .describe("Object of the calculator's input fields (see describe_calculator)"),
    lang: z
      .string()
      .optional()
      .describe("Response language for the recommendation, e.g. 'en', 'es', 'ca'"),
  },
  async ({ id, inputs, lang }) => {
    try {
      const qs = lang ? `?lang=${encodeURIComponent(lang)}` : "";
      const res = await apiPost(`/${encodeURIComponent(id)}${qs}`, inputs);
      if (res.status === 404) return fail(`Unknown calculator id: ${id}`);
      const data = (await res.json()) as Record<string, unknown>;
      if (res.status === 422)
        return fail(
          "Input validation failed — check the fields against describe_calculator.",
          data,
        );
      if (!res.ok) return fail(`API returned ${res.status}`, data);
      return ok(data, summarize(data));
    } catch (e) {
      return fail("Failed to reach the MedikQuantis API.", String(e));
    }
  },
);

server.tool(
  "calculate_batch",
  "Compute several scores in one call (max 50). Each item is { id, inputs, " +
    "lang? }. Useful for scoring a patient across multiple instruments at once.",
  {
    items: z
      .array(
        z.object({
          id: z.string(),
          inputs: z.record(z.any()),
          lang: z.string().optional(),
        }),
      )
      .min(1)
      .max(50)
      .describe("List of calculations to run"),
  },
  async ({ items }) => {
    try {
      const res = await apiPost("/batch", { calcs: items });
      if (!res.ok) return fail(`API returned ${res.status}`, await res.text());
      return ok(await res.json());
    } catch (e) {
      return fail("Failed to reach the MedikQuantis API.", String(e));
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stderr so we never corrupt the stdio JSON-RPC channel.
  console.error(`medikquantis-mcp ready — upstream ${API_BASE}`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
