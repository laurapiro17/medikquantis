import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// SOFA — Sequential Organ Failure Assessment (Vincent JL et al. 1996,
// PMID 8844239; updated as the operational definition of organ
// dysfunction in Sepsis-3). Six organ subscores 0-4; total 0-24. An
// acute change in total ≥ 2 from baseline is the Sepsis-3 cut-off for
// suspected sepsis.

const Sub04 = z.number().int().min(0).max(4);

export const SofaInputs = z.object({
  // Each subscore is entered directly so the bedside chart can be
  // transcribed without re-interpreting cut-offs. The widget surfaces
  // the canonical thresholds for each axis.
  respiration: Sub04,
  coagulation: Sub04,
  liver: Sub04,
  cardiovascular: Sub04,
  cns: Sub04,
  renal: Sub04,
});

export type SofaInput = z.infer<typeof SofaInputs>;

export function formula(inputs: SofaInput): number {
  return (
    inputs.respiration +
    inputs.coagulation +
    inputs.liver +
    inputs.cardiovascular +
    inputs.cns +
    inputs.renal
  );
}

export function interpret(score: number): InterpretResult {
  // Vincent 1998 mortality bands (PMID 9824069):
  //   0-6  : ~10 %     7-9  : ~22 %    10-12 : ~50 %    13+ : ~80 %
  if (score <= 6) {
    return {
      tier: "low", annualRiskPercent: 10,
      recommendation: "Low organ dysfunction (SOFA ≤ 6). Continue supportive care; reassess every 24-48 h.",
      recommendationCode: "SOFA_LOW", evidenceGrade: "A",
    };
  }
  if (score <= 9) {
    return {
      tier: "moderate", annualRiskPercent: 22,
      recommendation: "Moderate organ dysfunction (SOFA 7-9). Intensive monitoring; trend serial SOFAs and consider escalation of organ support.",
      recommendationCode: "SOFA_MODERATE", evidenceGrade: "A",
    };
  }
  if (score <= 12) {
    return {
      tier: "high", annualRiskPercent: 50,
      recommendation: "Severe organ dysfunction (SOFA 10-12). High mortality; multidisciplinary ICU input and goals-of-care conversation.",
      recommendationCode: "SOFA_SEVERE", evidenceGrade: "A",
    };
  }
  return {
    tier: "high", annualRiskPercent: 80,
    recommendation: "Very high organ dysfunction (SOFA ≥ 13). Mortality ≥ 80 %; consider limitation of life-sustaining treatment in shared decision-making.",
    recommendationCode: "SOFA_VERY_HIGH", evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof SofaInputs> = {
  id: "sofa",
  inputs: SofaInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 24 },
  specialty: "intensive_care",
  i18nKey: "sofa",
  references: [
    {
      pmid: "8844239",
      citation:
        "Vincent JL, Moreno R, Takala J, et al. The SOFA (Sepsis-related Organ Failure Assessment) score to describe organ dysfunction/failure. Intensive Care Med. 1996;22(7):707-710.",
    },
  ],
};
