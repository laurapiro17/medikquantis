import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// PASI — Psoriasis Area and Severity Index (Fredriksson T, Pettersson U
// 1978, PMID 4426953). Sums across four body regions with fixed weights:
// head 0.1, upper limbs 0.2, trunk 0.3, lower limbs 0.4. For each region:
//   PASI_region = (erythema + induration + desquamation) × area × weight
// where each intensity item is 0–4 and area is graded 0 (0%) to 6 (90–100%).
// Maximum PASI = 72.

const Sev04 = z.number().int().min(0).max(4);
const Area06 = z.number().int().min(0).max(6);

const Region = z.object({
  area: Area06,
  erythema: Sev04,
  induration: Sev04,
  desquamation: Sev04,
});

export const PasiInputs = z.object({
  head: Region,
  upperLimbs: Region,
  trunk: Region,
  lowerLimbs: Region,
});

export type PasiInput = z.infer<typeof PasiInputs>;
type RegionInput = z.infer<typeof Region>;

const regionWeights = {
  head: 0.1,
  upperLimbs: 0.2,
  trunk: 0.3,
  lowerLimbs: 0.4,
} as const;

function regionScore(r: RegionInput, weight: number): number {
  return (r.erythema + r.induration + r.desquamation) * r.area * weight;
}

export function formula(inputs: PasiInput): number {
  const total =
    regionScore(inputs.head, regionWeights.head) +
    regionScore(inputs.upperLimbs, regionWeights.upperLimbs) +
    regionScore(inputs.trunk, regionWeights.trunk) +
    regionScore(inputs.lowerLimbs, regionWeights.lowerLimbs);
  return Math.round(total * 10) / 10;
}

export function interpret(score: number): InterpretResult {
  // EMA biologic-eligibility convention: PASI ≥10 (or ≥20 in some
  // national authorities) defines severe psoriasis. EuroGuiDerm tiers:
  if (score < 5) {
    return {
      tier: "low",
      recommendation:
        "Mild psoriasis (PASI <5). Topical therapy with vitamin-D analogues + corticosteroids usually suffices.",
      recommendationCode: "PASI_MILD",
      evidenceGrade: "A",
    };
  }
  if (score < 10) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate psoriasis (PASI 5–10). Consider phototherapy or conventional systemics if topical therapy is insufficient.",
      recommendationCode: "PASI_MODERATE",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation:
      "Severe psoriasis (PASI ≥10). Systemic therapy is generally indicated; biologics qualify per EMA criteria.",
    recommendationCode: "PASI_SEVERE",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof PasiInputs> = {
  id: "pasi",
  inputs: PasiInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 72 },
  specialty: "dermatology",
  i18nKey: "pasi",
  references: [
    {
      pmid: "4426953",
      citation:
        "Fredriksson T, Pettersson U. Severe psoriasis—oral therapy with a new retinoid. Dermatologica. 1978;157(4):238-244.",
    },
  ],
};
