import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Glasgow-Blatchford score for upper-GI bleeding (Blatchford O et al.
// Lancet 2000, PMID 11073021). Eight pre-endoscopy criteria selected
// to predict need for intervention (transfusion, endoscopic therapy,
// surgery). A score of 0 identifies very-low-risk patients who can be
// safely discharged for outpatient evaluation.

export const Sex = z.enum(["male", "female"]);

export const GlasgowBlatchfordInputs = z.object({
  sex: Sex,
  bunMgDl: z.number().min(0).max(500), // BUN in mg/dL
  hemoglobinGDl: z.number().min(3).max(25),
  systolicBpMmHg: z.number().int().min(40).max(300),
  heartRateOver100: z.boolean(),
  melaena: z.boolean(),
  syncope: z.boolean(),
  hepaticDisease: z.boolean(),
  cardiacFailure: z.boolean(),
});

export type GlasgowBlatchfordInput = z.infer<typeof GlasgowBlatchfordInputs>;

function bunPoints(bunMgDl: number): number {
  // Original cut-offs published in mmol/L; mg/dL equivalents:
  //   6.5 mmol/L = 18.2 mg/dL, 8 = 22.4, 10 = 28, 25 = 70
  if (bunMgDl >= 70) return 6;
  if (bunMgDl >= 28) return 4;
  if (bunMgDl >= 22.4) return 3;
  if (bunMgDl >= 18.2) return 2;
  return 0;
}

function hbPoints(sex: "male" | "female", hb: number): number {
  if (sex === "male") {
    if (hb < 10) return 6;
    if (hb < 12) return 3;
    if (hb < 13) return 1;
    return 0;
  }
  if (hb < 10) return 6;
  if (hb < 12) return 1;
  return 0;
}

function sbpPoints(sbp: number): number {
  if (sbp < 90) return 3;
  if (sbp < 100) return 2;
  if (sbp < 110) return 1;
  return 0;
}

export function formula(inputs: GlasgowBlatchfordInput): number {
  let s = 0;
  s += bunPoints(inputs.bunMgDl);
  s += hbPoints(inputs.sex, inputs.hemoglobinGDl);
  s += sbpPoints(inputs.systolicBpMmHg);
  if (inputs.heartRateOver100) s += 1;
  if (inputs.melaena) s += 1;
  if (inputs.syncope) s += 2;
  if (inputs.hepaticDisease) s += 2;
  if (inputs.cardiacFailure) s += 2;
  return s;
}

export function interpret(score: number): InterpretResult {
  // Score = 0 → safe outpatient evaluation (NICE and BSG recommend
  // outpatient management for GBS = 0 to 1). Higher scores carry
  // progressively higher need for in-hospital intervention.
  if (score === 0) {
    return {
      tier: "low",
      recommendation:
        "Glasgow-Blatchford = 0: very low risk. Outpatient management with early endoscopy is appropriate per NICE / BSG.",
      recommendationCode: "GBS_SAFE_DISCHARGE",
      evidenceGrade: "A",
    };
  }
  if (score <= 5) {
    return {
      tier: "moderate",
      recommendation:
        "Low-to-moderate risk. Admit for observation; endoscopy within 24 hours.",
      recommendationCode: "GBS_LOW_MOD",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation:
      "High risk for intervention (transfusion, endoscopic therapy or surgery). Resuscitate and arrange urgent endoscopy.",
    recommendationCode: "GBS_HIGH",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof GlasgowBlatchfordInputs> = {
  id: "glasgow-blatchford",
  inputs: GlasgowBlatchfordInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 23 },
  specialty: "gastroenterology",
  i18nKey: "glasgowBlatchford",
  references: [
    {
      pmid: "11073021",
      citation:
        "Blatchford O, Murray WR, Blatchford M. A risk score to predict need for treatment for upper-gastrointestinal haemorrhage. Lancet. 2000;356(9238):1318-1321.",
    },
  ],
};
