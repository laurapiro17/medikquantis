import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// PSA density (Benson MC et al. 1992, J Urol 147:817, PMID 1371554).
// Total serum PSA divided by prostate volume (measured by transrectal
// ultrasound). Used to refine the interpretation of borderline PSA values
// (the 4–10 ng/mL "grey zone") in screening for prostate cancer.

export const PsaDensityInputs = z.object({
  psaNgMl: z.number().min(0).max(200),
  prostateVolumeMl: z.number().min(1).max(500),
});

export type PsaDensityInput = z.infer<typeof PsaDensityInputs>;

export function formula(inputs: PsaDensityInput): number {
  const density = inputs.psaNgMl / inputs.prostateVolumeMl;
  return Math.round(density * 1000) / 1000;
}

export function interpret(score: number): InterpretResult {
  // Benson 1992 threshold: PSA density > 0.15 ng/mL/cc raises concern
  // for prostate cancer and supports a recommendation for biopsy in the
  // grey-zone (PSA 4-10 ng/mL).
  if (score >= 0.15) {
    return {
      tier: "high",
      recommendation:
        "PSA density above the 0.15 ng/mL/cc threshold; biopsy is more strongly supported, especially in the 4-10 ng/mL grey zone.",
      recommendationCode: "PSA_DENS_ELEVATED",
      evidenceGrade: "B",
    };
  }
  return {
    tier: "low",
    recommendation:
      "PSA density at or below 0.15 ng/mL/cc; PSA elevation more likely explained by benign prostatic enlargement.",
    recommendationCode: "PSA_DENS_LOW",
    evidenceGrade: "B",
  };
}

export const calculator: CalcDefinition<typeof PsaDensityInputs> = {
  id: "psa-density",
  inputs: PsaDensityInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 10 },
  specialty: "urology",
  i18nKey: "psaDensity",
  references: [
    {
      pmid: "1371554",
      citation:
        "Benson MC, Whang IS, Pantuck A, et al. Prostate specific antigen density: a means of distinguishing benign prostatic hypertrophy and prostate cancer. J Urol. 1992;147(3 Pt 2):815-816.",
    },
  ],
};
