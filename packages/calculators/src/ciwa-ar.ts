import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Clinical Institute Withdrawal Assessment for Alcohol, Revised (CIWA-Ar) (Sullivan JT et al., 1989, PMID 2596802).
// Evaluates 10 alcohol withdrawal symptoms (max score 67).

export const CiwaArInputs = z.object({
  nausea: z.enum(["0", "1", "2", "3", "4", "5", "6", "7"]),
  tremor: z.enum(["0", "1", "2", "3", "4", "5", "6", "7"]),
  sweats: z.enum(["0", "1", "2", "3", "4", "5", "6", "7"]),
  anxiety: z.enum(["0", "1", "2", "3", "4", "5", "6", "7"]),
  agitation: z.enum(["0", "1", "2", "3", "4", "5", "6", "7"]),
  tactile: z.enum(["0", "1", "2", "3", "4", "5", "6", "7"]),
  auditory: z.enum(["0", "1", "2", "3", "4", "5", "6", "7"]),
  visual: z.enum(["0", "1", "2", "3", "4", "5", "6", "7"]),
  headache: z.enum(["0", "1", "2", "3", "4", "5", "6", "7"]),
  orientation: z.enum(["0", "1", "2", "3", "4"]),
});

export type CiwaArInput = z.infer<typeof CiwaArInputs>;

export function formula(inputs: CiwaArInput): number {
  return (
    parseInt(inputs.nausea, 10) +
    parseInt(inputs.tremor, 10) +
    parseInt(inputs.sweats, 10) +
    parseInt(inputs.anxiety, 10) +
    parseInt(inputs.agitation, 10) +
    parseInt(inputs.tactile, 10) +
    parseInt(inputs.auditory, 10) +
    parseInt(inputs.visual, 10) +
    parseInt(inputs.headache, 10) +
    parseInt(inputs.orientation, 10)
  );
}

export function interpret(score: number): InterpretResult {
  if (score > 15) {
    return {
      tier: "high",
      recommendation:
        "Severe alcohol withdrawal (score > 15). High risk for DTs and seizures. Immediate aggressive benzodiazepine treatment, close monitoring, and inpatient admission.",
      recommendationCode: "CIWA_SEVERE",
      evidenceGrade: "A",
    };
  }
  if (score >= 10) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate alcohol withdrawal (score 10–15). Symptom-triggered benzodiazepine regimen indicated with frequent reassessment every 1–2 hours.",
      recommendationCode: "CIWA_MODERATE",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Mild alcohol withdrawal (score < 10). Generally does not require pharmacological treatment unless patient has prior history of seizures or DTs.",
    recommendationCode: "CIWA_MILD",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof CiwaArInputs> = {
  id: "ciwa-ar",
  inputs: CiwaArInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 67 },
  specialty: "psychiatry",
  i18nKey: "ciwaAr",
  references: [
    {
      pmid: "2597811",
      citation:
        "Sullivan JT, Sykora K, Schneiderman J, Naranjo CA, Sellers EM. Assessment of alcohol withdrawal: the revised Clinical Institute Withdrawal Assessment for Alcohol scale (CIWA-Ar). Br J Addict. 1989;84(11):1353-1357.",
    },
  ],
};
