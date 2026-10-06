import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// PLASMIC score for the pretest probability of severe ADAMTS13 deficiency
// (activity ≤ 10%, i.e. TTP) in adults with thrombotic microangiopathy
// (Bendapudi PK et al., 2017, PMID 28259520). Each field is phrased as the
// criterion that scores, as in the original paper, so every tick adds 1.

export const PlasmicInputs = z.object({
  plateletsLow: z.boolean(),
  haemolysis: z.boolean(),
  noActiveCancer: z.boolean(),
  noTransplant: z.boolean(),
  mcvLow: z.boolean(),
  inrLow: z.boolean(),
  creatinineLow: z.boolean(),
});

export type PlasmicInput = z.infer<typeof PlasmicInputs>;

export function formula(inputs: PlasmicInput): number {
  return Object.values(inputs).filter(Boolean).length;
}

export function interpret(score: number): InterpretResult {
  if (score >= 6) {
    return {
      tier: "high",
      recommendation:
        "High probability of severe ADAMTS13 deficiency (PLASMIC 6-7). Send ADAMTS13 activity and start urgent plasma exchange without waiting for the result, under haematology guidance.",
      recommendationCode: "PLASMIC_HIGH",
      evidenceGrade: "B",
    };
  }
  if (score === 5) {
    return {
      tier: "moderate",
      recommendation:
        "Intermediate probability (PLASMIC 5). Send ADAMTS13 activity and decide on plasma exchange with haematology in light of the whole clinical picture.",
      recommendationCode: "PLASMIC_INTERMEDIATE",
      evidenceGrade: "B",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Low probability of severe ADAMTS13 deficiency (PLASMIC 0-4). TTP is unlikely; look for another cause of the thrombotic microangiopathy.",
    recommendationCode: "PLASMIC_LOW",
    evidenceGrade: "B",
  };
}

export const calculator: CalcDefinition<typeof PlasmicInputs> = {
  id: "plasmic",
  inputs: PlasmicInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 7 },
  specialty: "hematology",
  i18nKey: "plasmic",
  fieldsMetadata: {
    plateletsLow: { widget: "boolean", defaultValue: false },
    haemolysis: { widget: "boolean", defaultValue: false },
    noActiveCancer: { widget: "boolean", defaultValue: false },
    noTransplant: { widget: "boolean", defaultValue: false },
    mcvLow: { widget: "boolean", defaultValue: false },
    inrLow: { widget: "boolean", defaultValue: false },
    creatinineLow: { widget: "boolean", defaultValue: false },
  },
  references: [
    {
      pmid: "28259520",
      citation:
        "Bendapudi PK, Hurwitz S, Fry A, et al. Derivation and external validation of the PLASMIC score for rapid assessment of adults with thrombotic microangiopathies: a cohort study. Lancet Haematol. 2017;4(4):e157-e164.",
    },
  ],
};
