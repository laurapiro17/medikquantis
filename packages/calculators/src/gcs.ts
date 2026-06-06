import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Glasgow Coma Scale (Teasdale G, Jennett B 1974, PMID 4136544).
// Three components, score 3..15. Universally used to grade TBI severity
// and as a triage tool across emergency medicine and neurology.

export const GcsInputs = z.object({
  eye: z.enum(["1", "2", "3", "4"]),
  verbal: z.enum(["1", "2", "3", "4", "5"]),
  motor: z.enum(["1", "2", "3", "4", "5", "6"]),
});

export type GcsInput = z.infer<typeof GcsInputs>;

export function formula(inputs: GcsInput): number {
  return (
    parseInt(inputs.eye, 10) +
    parseInt(inputs.verbal, 10) +
    parseInt(inputs.motor, 10)
  );
}

export function interpret(score: number): InterpretResult {
  // Standard TBI severity bands (Teasdale 1974 + universally cited):
  // 3-8 severe, 9-12 moderate, 13-15 mild.
  if (score <= 8) {
    return {
      tier: "high",
      recommendation:
        "Severe TBI; secure the airway (intubation is generally indicated) and proceed to emergent imaging.",
      recommendationCode: "GCS_SEVERE_AIRWAY",
      evidenceGrade: "A",
    };
  }
  if (score <= 12) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate TBI; admit for observation and obtain head CT.",
      recommendationCode: "GCS_MODERATE_ADMIT",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Mild TBI; apply local rules (Canadian CT Head, NEXUS-II) to decide on imaging and disposition.",
    recommendationCode: "GCS_MILD_RULES",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof GcsInputs> = {
  id: "gcs",
  inputs: GcsInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 3, max: 15 },
  specialty: "neurology",
  i18nKey: "gcs",
  references: [
    {
      pmid: "4136544",
      citation:
        "Teasdale G, Jennett B. Assessment of coma and impaired consciousness. A practical scale. Lancet. 1974;2(7872):81-84.",
    },
  ],
};
