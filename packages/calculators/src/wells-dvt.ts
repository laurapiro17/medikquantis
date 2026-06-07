import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Wells DVT score (Wells PS et al. NEJM 2003, PMID 14507948). Ten
// weighted items, score range −2 to ~9. Modified two-tier read-out
// commonly used today: < 2 DVT unlikely → D-dimer; ≥ 2 DVT likely →
// proceed directly to compression ultrasound.

export const WellsDvtInputs = z.object({
  activeCancer: z.boolean(),
  bedridden3DaysOrSurgery12Weeks: z.boolean(),
  paralysisOrPlasterImmobilisation: z.boolean(),
  localisedTendernessAlongVeins: z.boolean(),
  entireLegSwollen: z.boolean(),
  calfSwellingOver3cm: z.boolean(),
  pittingOedemaSymptomaticLeg: z.boolean(),
  collateralSuperficialVeins: z.boolean(),
  previouslyDocumentedDvt: z.boolean(),
  alternativeDiagnosisAtLeastAsLikely: z.boolean(),
});

export type WellsDvtInput = z.infer<typeof WellsDvtInputs>;

export function formula(inputs: WellsDvtInput): number {
  let s = 0;
  if (inputs.activeCancer) s += 1;
  if (inputs.bedridden3DaysOrSurgery12Weeks) s += 1;
  if (inputs.paralysisOrPlasterImmobilisation) s += 1;
  if (inputs.localisedTendernessAlongVeins) s += 1;
  if (inputs.entireLegSwollen) s += 1;
  if (inputs.calfSwellingOver3cm) s += 1;
  if (inputs.pittingOedemaSymptomaticLeg) s += 1;
  if (inputs.collateralSuperficialVeins) s += 1;
  if (inputs.previouslyDocumentedDvt) s += 1;
  if (inputs.alternativeDiagnosisAtLeastAsLikely) s -= 2;
  return s;
}

export function interpret(score: number): InterpretResult {
  // Modern two-tier read-out (used by NICE and most ED protocols):
  if (score < 2) {
    return {
      tier: "low",
      recommendation:
        "DVT unlikely. Obtain a high-sensitivity D-dimer; if negative, DVT can be excluded.",
      recommendationCode: "WELLSDVT_UNLIKELY",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation:
      "DVT likely. Proceed directly to proximal-leg compression ultrasound; treat empirically if imaging will be delayed.",
    recommendationCode: "WELLSDVT_LIKELY",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof WellsDvtInputs> = {
  id: "wells-dvt",
  inputs: WellsDvtInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: -2, max: 9 },
  specialty: "emergency",
  i18nKey: "wellsDvt",
  references: [
    {
      pmid: "14507948",
      citation:
        "Wells PS, Anderson DR, Rodger M, et al. Evaluation of D-dimer in the diagnosis of suspected deep-vein thrombosis. N Engl J Med. 2003;349(13):1227-1235.",
    },
  ],
};
