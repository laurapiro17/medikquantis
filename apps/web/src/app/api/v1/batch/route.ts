import { getCalc, type AnyCalc } from "@medcalc/calculators";
import { ZodError } from "zod";
import { corsJson, corsPreflight } from "@/lib/api-cors";
import { clientId, limitApi, tooManyRequests } from "@/lib/rate-limit";
import {
  parseLang,
  translateRecommendation,
  type ApiLang,
} from "@/lib/api-recommendations";

export const runtime = "edge";

// Generous limit to avoid abuse while leaving room for legitimate
// dashboards that need to score the full catalog in one request.
const MAX_BATCH_SIZE = 50;

interface BatchItem {
  id?: unknown;
  inputs?: unknown;
  lang?: unknown;
}

export function OPTIONS(): Response {
  return corsPreflight();
}

export async function POST(req: Request): Promise<Response> {
  const rl = await limitApi(await clientId(req));
  if (!rl.ok) return tooManyRequests(rl);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return corsJson({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return corsJson(
      { error: "Body must be an object with a `calcs` array" },
      { status: 400 },
    );
  }
  const calcs = (body as { calcs?: unknown }).calcs;
  if (!Array.isArray(calcs)) {
    return corsJson(
      { error: "`calcs` must be an array" },
      { status: 400 },
    );
  }
  if (calcs.length === 0) {
    return corsJson(
      { error: "`calcs` must contain at least one item" },
      { status: 400 },
    );
  }
  if (calcs.length > MAX_BATCH_SIZE) {
    return corsJson(
      {
        error: `Batch size exceeds limit (${MAX_BATCH_SIZE})`,
        received: calcs.length,
      },
      { status: 413 },
    );
  }

  const results = (calcs as BatchItem[]).map((item, index) =>
    computeOne(item, index),
  );

  return corsJson({
    count: results.length,
    results,
    computedAt: new Date().toISOString(),
  });
}

function computeOne(item: BatchItem, index: number) {
  if (typeof item.id !== "string") {
    return { index, error: "Missing or non-string `id`" };
  }
  const calc = getCalc(item.id);
  if (!calc) {
    return { index, error: "Unknown calculator", requestedId: item.id };
  }

  const lang: ApiLang = parseLang(
    typeof item.lang === "string" ? item.lang : null,
  );

  const parsed = calc.inputs.safeParse(item.inputs ?? {});
  if (!parsed.success) {
    return {
      index,
      calc: calc.id,
      error: "Validation failed",
      fields: flattenZodError(parsed.error),
    };
  }

  return compute(calc, parsed.data, lang, index);
}

function compute(
  calc: AnyCalc,
  inputs: unknown,
  lang: ApiLang,
  index: number,
) {
  const score = calc.formula(inputs);
  const result = calc.interpret(score, inputs);
  const recommendation = translateRecommendation(
    result.recommendationCode,
    lang,
    result.recommendation,
  );
  return {
    index,
    calc: calc.id,
    specialty: calc.specialty,
    score,
    ...result,
    recommendation,
    responseLanguage: lang,
  };
}

function flattenZodError(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
}
