import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// APGAR Score (Apgar V, 1953, PMID 13083014).
// Evaluates 5 signs of newborn physiological status (0-2 points each, max 10):
// Appearance, Pulse, Grimace, Activity, Respiration.

export const ApgarInputs = z.object({
  appearance: z.enum(["0", "1", "2"]),
  pulse: z.enum(["0", "1", "2"]),
  grimace: z.enum(["0", "1", "2"]),
  activity: z.enum(["0", "1", "2"]),
  respiration: z.enum(["0", "1", "2"]),
});

export type ApgarInput = z.infer<typeof ApgarInputs>;

export function formula(inputs: ApgarInput): number {
  return (
    parseInt(inputs.appearance, 10) +
    parseInt(inputs.pulse, 10) +
    parseInt(inputs.grimace, 10) +
    parseInt(inputs.activity, 10) +
    parseInt(inputs.respiration, 10)
  );
}

export function interpret(score: number): InterpretResult {
  if (score >= 7) {
    return {
      tier: "low",
      recommendation:
        "Normal score (7–10). Routine post-natal care, drying, warming, and ongoing monitoring.",
      recommendationCode: "APGAR_NORMAL",
      evidenceGrade: "A",
    };
  }
  if (score >= 4) {
    return {
      tier: "moderate",
      recommendation:
        "Moderately depressed (4–6). Provide airway clearing, tactile stimulation, and supplemental oxygen as indicated.",
      recommendationCode: "APGAR_MODERATE",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation:
      "Severely depressed (0–3). Immediate resuscitation required according to NRP guidelines (airway, ventilation, compressions).",
    recommendationCode: "APGAR_SEVERE",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof ApgarInputs> = {
  id: "apgar",
  inputs: ApgarInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 10 },
  specialty: "pediatrics",
  i18nKey: "apgar",
  references: [
    {
      pmid: "13083014",
      citation:
        "Apgar V. A proposal for a new method of evaluation of the newborn infant. Curr Res Anesth Analg. 1953;32(4):260-267.",
    },
  ],
};
