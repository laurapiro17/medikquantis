import { listCalcs } from "@medcalc/calculators";
import { corsJson, corsPreflight } from "@/lib/api-cors";

export const runtime = "edge";

export function OPTIONS(): Response {
  return corsPreflight();
}

export function GET(): Response {
  const calcs = listCalcs().map((c) => ({
    id: c.id,
    specialty: c.specialty,
    scoreRange: c.scoreRange,
    referenceCount: c.references.length,
    href: `/api/v1/${c.id}`,
  }));

  return corsJson({
    name: "MedikQuantis API",
    version: "1",
    docs: "/api/v1/docs",
    openapi: "/api/v1/openapi.json",
    health: "/api/v1/health",
    batch: "/api/v1/batch",
    license: "MIT",
    citation: "https://doi.org/10.5281/zenodo.20562617",
    calculatorCount: calcs.length,
    calculators: calcs,
  });
}
