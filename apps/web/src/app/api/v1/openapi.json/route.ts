import { listCalcs, type AnyCalc } from "@medcalc/calculators";
import { corsJson, corsPreflight } from "@/lib/api-cors";
import { zodObjectToJsonSchema } from "@/lib/zod-to-jsonschema";

export const runtime = "edge";

export function OPTIONS(): Response {
  return corsPreflight();
}

export function GET(req: Request): Response {
  const url = new URL(req.url);
  const origin = `${url.protocol}//${url.host}`;

  return corsJson(buildSpec(origin));
}

function buildSpec(serverUrl: string) {
  const calcs = listCalcs();
  const paths: Record<string, unknown> = {};

  for (const calc of calcs) {
    paths[`/api/v1/${calc.id}`] = {
      get: getOperation(calc),
      post: postOperation(calc),
    };
  }

  paths["/api/v1"] = {
    get: {
      summary: "List all calculators",
      tags: ["Index"],
      responses: {
        "200": {
          description: "Registry of available calculators",
          content: { "application/json": { schema: { type: "object" } } },
        },
      },
    },
  };

  return {
    openapi: "3.1.0",
    info: {
      title: "MedikQuantis API",
      version: "1.0.0",
      description:
        "Open-source clinical calculators with peer-reviewed references. " +
        "Each endpoint computes a single score. Add `?lang=es` or `?lang=ca` " +
        "to localise the `recommendation` field; the `recommendationCode` " +
        "is language-agnostic and stable across versions.",
      license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
      contact: {
        name: "MedikQuantis",
        url: "https://github.com/laurapiro17/medikquantis",
      },
    },
    servers: [{ url: serverUrl }],
    paths,
    components: {
      schemas: {
        InterpretResult: {
          type: "object",
          properties: {
            tier: {
              type: "string",
              enum: ["low", "moderate", "high"],
            },
            recommendation: { type: "string" },
            evidenceGrade: { type: "string", enum: ["A", "B", "C"] },
            annualRiskPercent: { type: "number" },
          },
          required: ["tier", "recommendation", "evidenceGrade"],
        },
        ValidationError: {
          type: "object",
          properties: {
            error: { type: "string" },
            fields: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  path: { type: "string" },
                  message: { type: "string" },
                  code: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  };
}

function getOperation(calc: AnyCalc) {
  return {
    summary: `${calc.id} metadata`,
    description: `Returns input schema, references, and score range for ${calc.id}.`,
    tags: [calc.specialty],
    responses: {
      "200": {
        description: "Calculator metadata",
        content: { "application/json": { schema: { type: "object" } } },
      },
      "404": {
        description: "Unknown calculator",
        content: { "application/json": { schema: { type: "object" } } },
      },
    },
  };
}

function postOperation(calc: AnyCalc) {
  return {
    summary: `Compute ${calc.id}`,
    description: calc.references[0]?.citation
      ? `Primary reference: ${calc.references[0].citation}`
      : `Compute ${calc.id} score and interpretation.`,
    tags: [calc.specialty],
    parameters: [
      {
        name: "lang",
        in: "query",
        required: false,
        description:
          "Response language for the `recommendation` field. Defaults to `en`. The `recommendationCode` is language-agnostic and always emitted.",
        schema: { type: "string", enum: ["en", "es", "ca"], default: "en" },
      },
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": { schema: zodObjectToJsonSchema(calc.inputs) },
      },
    },
    responses: {
      "200": {
        description: "Computed score and interpretation",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                calc: { type: "string" },
                specialty: { type: "string" },
                score: { type: "number" },
                tier: { type: "string" },
                recommendation: { type: "string" },
                evidenceGrade: { type: "string" },
                annualRiskPercent: { type: "number" },
                scoreRange: { type: "object" },
                references: { type: "array" },
                computedAt: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
      "422": {
        description: "Validation failed",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ValidationError" },
          },
        },
      },
      "404": { description: "Unknown calculator" },
      "400": { description: "Malformed JSON body" },
    },
  };
}
