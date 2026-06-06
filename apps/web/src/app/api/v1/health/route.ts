import { listCalcs } from "@medcalc/calculators";
import { corsJson, corsPreflight } from "@/lib/api-cors";

export const runtime = "edge";

export function OPTIONS(): Response {
  return corsPreflight();
}

export function GET(): Response {
  return corsJson({
    status: "ok",
    version: "1.0.0",
    calculatorCount: listCalcs().length,
    timestamp: new Date().toISOString(),
  });
}
