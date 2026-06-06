import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// DAS28 — Disease Activity Score 28 (Prevoo ML et al. 1995, PMID 7818570).
// Composite score for rheumatoid arthritis activity using:
//   • 28-joint tender joint count (TJC28)
//   • 28-joint swollen joint count (SJC28)
//   • One acute-phase reactant (ESR mm/h OR CRP mg/L)
//   • Patient Global Assessment on a 100-mm VAS (PGA)
// The 28 standard joints are: PIPs ×10, MCPs ×10, wrists ×2, elbows ×2,
// shoulders ×2, knees ×2.

export const Das28Inputs = z.object({
  markerType: z.enum(["ESR", "CRP"]),
  // For ESR: mm/h; for CRP: mg/L. Validation across the union.
  markerValue: z.number().min(0).max(150),
  tenderJointCount28: z.number().int().min(0).max(28),
  swollenJointCount28: z.number().int().min(0).max(28),
  patientGlobalAssessment: z.number().min(0).max(100), // 0–100 mm VAS
});

export type Das28Input = z.infer<typeof Das28Inputs>;

// DAS28-ESR: 0.56√TJC + 0.28√SJC + 0.70·ln(ESR) + 0.014·PGA
// DAS28-CRP: 0.56√TJC + 0.28√SJC + 0.36·ln(CRP+1) + 0.014·PGA + 0.96
//
// Per Inoue 2007 (PMID 17576779), DAS28-CRP runs ~0.3 lower than
// DAS28-ESR; the constants in the CRP formula partially correct this,
// but identical thresholds are still used by EULAR/ACR.
export function formula(inputs: Das28Input): number {
  const sqrtTjc = Math.sqrt(inputs.tenderJointCount28);
  const sqrtSjc = Math.sqrt(inputs.swollenJointCount28);
  const base =
    0.56 * sqrtTjc + 0.28 * sqrtSjc + 0.014 * inputs.patientGlobalAssessment;

  const marker =
    inputs.markerType === "ESR"
      ? 0.70 * Math.log(Math.max(inputs.markerValue, 1))
      : 0.36 * Math.log(inputs.markerValue + 1) + 0.96;

  const das28 = base + marker;
  return Math.round(das28 * 100) / 100;
}

interface Das28InterpretResult extends InterpretResult {
  category: "remission" | "low" | "moderate" | "high";
}

export function interpret(score: number): Das28InterpretResult {
  // EULAR-2014 disease-activity thresholds (identical for ESR/CRP variants).
  if (score < 2.6) {
    return {
      category: "remission",
      tier: "low",
      recommendation:
        "DAS28 <2.6: remission. Maintain current therapy and reassess in 3–6 months.",
      recommendationCode: "DAS28_REMISSION",
      evidenceGrade: "A",
    };
  }
  if (score <= 3.2) {
    return {
      category: "low",
      tier: "low",
      recommendation:
        "DAS28 2.6–3.2: low disease activity. Continue current therapy; consider treat-to-target adjustments if a remission goal is set.",
      recommendationCode: "DAS28_LOW",
      evidenceGrade: "A",
    };
  }
  if (score <= 5.1) {
    return {
      category: "moderate",
      tier: "moderate",
      recommendation:
        "DAS28 3.2–5.1: moderate disease activity. Reassess current DMARDs and consider escalation per treat-to-target.",
      recommendationCode: "DAS28_MODERATE",
      evidenceGrade: "A",
    };
  }
  return {
    category: "high",
    tier: "high",
    recommendation:
      "DAS28 >5.1: high disease activity. Escalate therapy promptly; biologic or targeted-synthetic DMARDs typically indicated.",
    recommendationCode: "DAS28_HIGH",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof Das28Inputs> = {
  id: "das28",
  inputs: Das28Inputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 10 },
  specialty: "rheumatology",
  i18nKey: "das28",
  references: [
    {
      pmid: "7818570",
      citation:
        "Prevoo ML, van 't Hof MA, Kuper HH, van Leeuwen MA, van de Putte LB, van Riel PL. Modified disease activity scores that include twenty-eight-joint counts. Development and validation in a prospective longitudinal study of patients with rheumatoid arthritis. Arthritis Rheum. 1995;38(1):44-48.",
    },
    {
      pmid: "17576779",
      citation:
        "Inoue E, Yamanaka H, Hara M, Tomatsu T, Kamatani N. Comparison of Disease Activity Score (DAS)28-erythrocyte sedimentation rate and DAS28-C-reactive protein threshold values. Ann Rheum Dis. 2007;66(3):407-409.",
    },
  ],
};
