import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// PERC (Pulmonary Embolism Rule-out Criteria) — Kline JA et al. 2004
// (PMID 15304025). Eight criteria; if ALL are negative AND clinical
// pre-test probability is low (<15%), pulmonary embolism can be
// excluded without further testing (no d-dimer, no imaging).

export const PercInputs = z.object({
  ageOver50: z.boolean(),
  heartRateOver100: z.boolean(),
  oxygenSaturationBelow95: z.boolean(),
  hemoptysis: z.boolean(),
  estrogenUse: z.boolean(),
  previousDvtOrPe: z.boolean(),
  unilateralLegSwelling: z.boolean(),
  recentSurgeryOrTrauma: z.boolean(),
});

export type PercInput = z.infer<typeof PercInputs>;

// Score = number of POSITIVE criteria (i.e. risk factors present).
// PERC-negative means score = 0.
export function formula(inputs: PercInput): number {
  let positives = 0;
  if (inputs.ageOver50) positives += 1;
  if (inputs.heartRateOver100) positives += 1;
  if (inputs.oxygenSaturationBelow95) positives += 1;
  if (inputs.hemoptysis) positives += 1;
  if (inputs.estrogenUse) positives += 1;
  if (inputs.previousDvtOrPe) positives += 1;
  if (inputs.unilateralLegSwelling) positives += 1;
  if (inputs.recentSurgeryOrTrauma) positives += 1;
  return positives;
}

export function interpret(score: number): InterpretResult {
  if (score === 0) {
    return {
      tier: "low",
      recommendation:
        "PERC-negative: in a low pre-test probability patient (<15%), PE can be ruled out without further testing.",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation:
      "PERC-positive: do NOT use PERC to rule out PE. Proceed with D-dimer or imaging depending on pre-test probability.",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof PercInputs> = {
  id: "perc",
  inputs: PercInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 8 },
  specialty: "emergency",
  i18nKey: "perc",
  references: [
    {
      pmid: "15304025",
      citation:
        "Kline JA, Mitchell AM, Kabrhel C, Richman PB, Courtney DM. Clinical criteria to prevent unnecessary diagnostic testing in emergency department patients with suspected pulmonary embolism. J Thromb Haemost. 2004;2(8):1247-1255.",
    },
    {
      pmid: "31504429",
      citation:
        "Konstantinides SV, Meyer G, Becattini C, et al. 2019 ESC Guidelines for the diagnosis and management of acute pulmonary embolism. Eur Heart J. 2020;41(4):543-603.",
    },
  ],
};
