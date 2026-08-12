import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// STOP-BANG questionnaire for obstructive sleep apnoea (Chung F et al., 2008,
// PMID 18431116). Eight yes/no items, one point each. Designed as a screening
// tool: a low score has a high negative predictive value for moderate-to-severe
// OSA, so its value is in ruling out rather than diagnosing.

export const StopBangInputs = z.object({
  snoring: z.boolean(),
  tired: z.boolean(),
  observedApnoea: z.boolean(),
  highBloodPressure: z.boolean(),
  bmiOver35: z.boolean(),
  ageOver50: z.boolean(),
  neckOver40cm: z.boolean(),
  male: z.boolean(),
});

export type StopBangInput = z.infer<typeof StopBangInputs>;

export function formula(inputs: StopBangInput): number {
  return Object.values(inputs).filter(Boolean).length;
}

export function interpret(score: number): InterpretResult {
  if (score >= 5) {
    return {
      tier: "high",
      recommendation:
        "High risk of obstructive sleep apnoea (5-8). Refer for sleep study; consider perioperative precautions if surgery is planned.",
      recommendationCode: "STOPBANG_HIGH",
      evidenceGrade: "A",
    };
  }
  if (score >= 3) {
    return {
      tier: "moderate",
      recommendation:
        "Intermediate risk of obstructive sleep apnoea (3-4). Consider further evaluation, weighted by symptoms and comorbidity.",
      recommendationCode: "STOPBANG_INTERMEDIATE",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Low risk of obstructive sleep apnoea (0-2). Moderate-to-severe OSA is unlikely; no sleep study indicated on this basis alone.",
    recommendationCode: "STOPBANG_LOW",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof StopBangInputs> = {
  id: "stop-bang",
  inputs: StopBangInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 8 },
  specialty: "otorhinolaryngology",
  i18nKey: "stopBang",
  fieldsMetadata: {
    snoring: { widget: "boolean", defaultValue: false },
    tired: { widget: "boolean", defaultValue: false },
    observedApnoea: { widget: "boolean", defaultValue: false },
    highBloodPressure: { widget: "boolean", defaultValue: false },
    bmiOver35: { widget: "boolean", defaultValue: false },
    ageOver50: { widget: "boolean", defaultValue: false },
    neckOver40cm: { widget: "boolean", defaultValue: false },
    male: { widget: "boolean", defaultValue: false },
  },
  references: [
    {
      pmid: "18431116",
      citation:
        "Chung F, Yegneswaran B, Liao P, et al. STOP questionnaire: a tool to screen patients for obstructive sleep apnea. Anesthesiology. 2008;108(5):812-821.",
    },
  ],
};
