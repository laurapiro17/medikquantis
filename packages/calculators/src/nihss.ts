import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// NIHSS — National Institutes of Health Stroke Scale (Brott T et al.
// 1989, PMID 2749846). The standardised neurological exam for acute
// ischaemic stroke. Fifteen items summed to a total 0-42, used for
// thrombolysis decisions, thrombectomy eligibility and stroke-unit
// admission triage.

const I02 = z.number().int().min(0).max(2);
const I03 = z.number().int().min(0).max(3);
const I04 = z.number().int().min(0).max(4);

export const NihssInputs = z.object({
  locResponsiveness: I03, // 1a — level of consciousness 0-3
  locQuestions: I02,      // 1b — month + age 0-2
  locCommands: I02,       // 1c — open/close eyes, grip 0-2
  bestGaze: I02,          // 2  — horizontal eye movements 0-2
  visualFields: I03,      // 3  — confrontation 0-3
  facialPalsy: I03,       // 4  — 0-3
  motorArmLeft: I04,      // 5a — 0-4 (untestable = 0)
  motorArmRight: I04,     // 5b — 0-4
  motorLegLeft: I04,      // 6a — 0-4
  motorLegRight: I04,     // 6b — 0-4
  limbAtaxia: I02,        // 7  — 0-2 (untestable = 0)
  sensory: I02,           // 8  — 0-2
  bestLanguage: I03,      // 9  — 0-3
  dysarthria: I02,        // 10 — 0-2 (untestable = 0)
  extinctionInattention: I02, // 11 — 0-2
});

export type NihssInput = z.infer<typeof NihssInputs>;

export function formula(inputs: NihssInput): number {
  return Object.values(inputs).reduce((s, v) => s + v, 0);
}

export function interpret(score: number): InterpretResult {
  // Stroke severity bands (AHA/ASA):
  //   0    : no stroke symptoms
  //   1-4  : minor stroke
  //   5-15 : moderate stroke
  //  16-20 : moderate to severe stroke
  //  21-42 : severe stroke
  if (score === 0) {
    return {
      tier: "low",
      recommendation: "No clinically detectable stroke symptoms.",
      recommendationCode: "NIHSS_NONE", evidenceGrade: "A",
    };
  }
  if (score <= 4) {
    return {
      tier: "low",
      recommendation: "Minor stroke (NIHSS 1-4). Discuss IV thrombolysis individually; benefit may not outweigh bleed risk for very mild deficits.",
      recommendationCode: "NIHSS_MINOR", evidenceGrade: "A",
    };
  }
  if (score <= 15) {
    return {
      tier: "moderate",
      recommendation: "Moderate stroke (NIHSS 5-15). IV thrombolysis if within window; consider endovascular therapy if large-vessel occlusion (LVO).",
      recommendationCode: "NIHSS_MODERATE", evidenceGrade: "A",
    };
  }
  if (score <= 20) {
    return {
      tier: "high",
      recommendation: "Moderate to severe stroke (NIHSS 16-20). LVO highly likely — image immediately for endovascular thrombectomy candidacy.",
      recommendationCode: "NIHSS_MODERATE_SEVERE", evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation: "Severe stroke (NIHSS ≥ 21). LVO almost certain; thrombectomy if anatomically eligible and within time window; consider NCC monitoring.",
    recommendationCode: "NIHSS_SEVERE", evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof NihssInputs> = {
  id: "nihss",
  inputs: NihssInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 42 },
  specialty: "neurology",
  i18nKey: "nihss",
  references: [
    {
      pmid: "2749846",
      citation:
        "Brott T, Adams HP Jr, Olinger CP, et al. Measurements of acute cerebral infarction: a clinical examination scale. Stroke. 1989;20(7):864-870.",
    },
  ],
};
