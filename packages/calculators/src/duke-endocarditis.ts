import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Modified Duke criteria for infective endocarditis (Li JS et al. 2000,
// PMID 10770721 — modification of the original Durack 1994 criteria).
// Diagnosis is classified as definite, possible or rejected based on the
// combination of two MAJOR and five MINOR criteria.

export const DukeEndocarditisInputs = z.object({
  // Two MAJOR criteria
  majorBloodCultures: z.boolean(),
  majorEndocardialInvolvement: z.boolean(),
  // Five MINOR criteria
  minorPredisposition: z.boolean(),
  minorFever: z.boolean(),
  minorVascularPhenomena: z.boolean(),
  minorImmunologicPhenomena: z.boolean(),
  minorMicrobiologicEvidence: z.boolean(),
});

export type DukeEndocarditisInput = z.infer<typeof DukeEndocarditisInputs>;

// The "score" field carries 10·majorCount + minorCount so the standard
// numeric `score` channel of the registry still encodes the result
// uniquely. Consumers should prefer `category` from the interpret result.
export function formula(inputs: DukeEndocarditisInput): number {
  const major = [
    inputs.majorBloodCultures,
    inputs.majorEndocardialInvolvement,
  ].filter(Boolean).length;
  const minor = [
    inputs.minorPredisposition,
    inputs.minorFever,
    inputs.minorVascularPhenomena,
    inputs.minorImmunologicPhenomena,
    inputs.minorMicrobiologicEvidence,
  ].filter(Boolean).length;
  return major * 10 + minor;
}

interface DukeInterpretResult extends InterpretResult {
  category: "definite" | "possible" | "rejected";
  majorCount: number;
  minorCount: number;
}

export function interpret(score: number): DukeInterpretResult {
  const major = Math.floor(score / 10);
  const minor = score % 10;

  // Definite: 2 major OR 1 major + 3 minor OR 5 minor
  const definite =
    major >= 2 || (major === 1 && minor >= 3) || (major === 0 && minor >= 5);
  // Possible: 1 major + 1 minor OR 3 minor
  const possible =
    !definite &&
    ((major === 1 && minor >= 1) || (major === 0 && minor >= 3));

  if (definite) {
    return {
      category: "definite",
      majorCount: major,
      minorCount: minor,
      tier: "high",
      recommendation:
        "Definite endocarditis: admit, obtain repeat blood cultures, transoesophageal echo if not yet done, and start empirical antibiotics per local protocol.",
      recommendationCode: "DUKE_DEFINITE",
      evidenceGrade: "A",
    };
  }
  if (possible) {
    return {
      category: "possible",
      majorCount: major,
      minorCount: minor,
      tier: "moderate",
      recommendation:
        "Possible endocarditis: do not rule out — continue work-up with serial blood cultures, transoesophageal echo and ID input.",
      recommendationCode: "DUKE_POSSIBLE",
      evidenceGrade: "A",
    };
  }
  return {
    category: "rejected",
    majorCount: major,
    minorCount: minor,
    tier: "low",
    recommendation:
      "Endocarditis rejected by criteria: pursue alternative diagnoses; re-evaluate if clinical course evolves.",
    recommendationCode: "DUKE_REJECTED",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof DukeEndocarditisInputs> = {
  id: "duke-endocarditis",
  inputs: DukeEndocarditisInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 25 },
  specialty: "infectious_diseases",
  i18nKey: "dukeEndocarditis",
  references: [
    {
      pmid: "10770721",
      citation:
        "Li JS, Sexton DJ, Mick N, et al. Proposed modifications to the Duke criteria for the diagnosis of infective endocarditis. Clin Infect Dis. 2000;30(4):633-638.",
    },
  ],
};
