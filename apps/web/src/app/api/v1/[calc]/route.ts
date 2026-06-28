import { getCalc, type AnyCalc } from "@medcalc/calculators";
import { ZodError } from "zod";
import { corsJson, corsPreflight } from "@/lib/api-cors";
import { clientId, limitApi, tooManyRequests } from "@/lib/rate-limit";
import { zodObjectToJsonSchema } from "@/lib/zod-to-jsonschema";
import {
  SUPPORTED_LANGS,
  parseLang,
  translateRecommendation,
} from "@/lib/api-recommendations";

export const runtime = "edge";

interface RouteContext {
  params: Promise<{ calc: string }>;
}

export function OPTIONS(): Response {
  return corsPreflight();
}

export async function GET(_req: Request, { params }: RouteContext) {
  const { calc: calcId } = await params;
  const calc = getCalc(calcId);
  if (!calc) return notFound(calcId);

  return corsJson(describe(calc));
}

export async function POST(req: Request, { params }: RouteContext) {
  const rl = await limitApi(await clientId(req));
  if (!rl.ok) return tooManyRequests(rl);

  const { calc: calcId } = await params;
  const calc = getCalc(calcId);
  if (!calc) return notFound(calcId);

  const url = new URL(req.url);
  const lang = parseLang(url.searchParams.get("lang"));

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return corsJson(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = calc.inputs.safeParse(body);
  if (!parsed.success) {
    return corsJson(
      {
        error: "Validation failed",
        fields: flattenZodError(parsed.error),
      },
      { status: 422 },
    );
  }

  const score = calc.formula(parsed.data);
  const result = calc.interpret(score, parsed.data);
  const recommendation = translateRecommendation(
    result.recommendationCode,
    lang,
    result.recommendation,
  );

  return corsJson({
    calc: calc.id,
    specialty: calc.specialty,
    score,
    ...result,
    recommendation,
    responseLanguage: lang,
    supportedLanguages: SUPPORTED_LANGS,
    scoreRange: calc.scoreRange,
    references: calc.references,
    computedAt: new Date().toISOString(),
  });
}

function notFound(calcId: string): Response {
  return corsJson(
    {
      error: "Calculator not found",
      requestedId: calcId,
    },
    { status: 404 },
  );
}

function describe(calc: AnyCalc) {
  return {
    id: calc.id,
    specialty: calc.specialty,
    scoreRange: calc.scoreRange,
    inputs: zodObjectToJsonSchema(calc.inputs),
    references: calc.references,
  };
}

function flattenZodError(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
}
