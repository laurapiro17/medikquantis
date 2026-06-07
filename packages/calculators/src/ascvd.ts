import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// ASCVD Pooled Cohort Equations (Goff DC Jr et al. 2014, PMID
// 24222018). 2013 ACC/AHA Guideline on the assessment of cardiovascular
// risk. Estimates 10-year risk of a first ASCVD event (non-fatal MI,
// CHD death, fatal or non-fatal stroke) in adults 40-79 without
// pre-existing ASCVD.

export const AscvdInputs = z.object({
  sex: z.enum(["male", "female"]),
  race: z.enum(["white_or_other", "african_american"]),
  age: z.number().int().min(40).max(79),
  totalCholesterolMgDl: z.number().min(50).max(500),
  hdlMgDl: z.number().min(10).max(150),
  systolicBpMmHg: z.number().int().min(80).max(220),
  treatedForHypertension: z.boolean(),
  diabetes: z.boolean(),
  smoker: z.boolean(),
});

export type AscvdInput = z.infer<typeof AscvdInputs>;

// Sex × race coefficients from Goff 2014, Appendix Tables A. Constants
// not listed in a row are taken as 0.
//
// Variables (raw): age, total chol, HDL, SBP, smoker, diabetes.
// Many enter the equation as ln(value) or ln(age) × ln(value).
interface Coef {
  bLnAge: number;
  bLnAgeSq: number;
  bLnChol: number;
  bLnAgeLnChol: number;
  bLnHdl: number;
  bLnAgeLnHdl: number;
  bLnSbpTreated: number;
  bLnAgeLnSbpTreated: number;
  bLnSbpUntreated: number;
  bLnAgeLnSbpUntreated: number;
  bSmoker: number;
  bLnAgeSmoker: number;
  bDiabetes: number;
  mean: number;
  baselineSurvival: number;
}

const COEFS: Record<"male" | "female", Record<"white_or_other" | "african_american", Coef>> = {
  female: {
    white_or_other: {
      bLnAge: -29.799, bLnAgeSq: 4.884,
      bLnChol: 13.540, bLnAgeLnChol: -3.114,
      bLnHdl: -13.578, bLnAgeLnHdl: 3.149,
      bLnSbpTreated: 2.019, bLnAgeLnSbpTreated: 0,
      bLnSbpUntreated: 1.957, bLnAgeLnSbpUntreated: 0,
      bSmoker: 7.574, bLnAgeSmoker: -1.665,
      bDiabetes: 0.661,
      mean: -29.18, baselineSurvival: 0.9665,
    },
    african_american: {
      bLnAge: 17.114, bLnAgeSq: 0,
      bLnChol: 0.940, bLnAgeLnChol: 0,
      bLnHdl: -18.920, bLnAgeLnHdl: 4.475,
      bLnSbpTreated: 29.291, bLnAgeLnSbpTreated: -6.432,
      bLnSbpUntreated: 27.820, bLnAgeLnSbpUntreated: -6.087,
      bSmoker: 0.691, bLnAgeSmoker: 0,
      bDiabetes: 0.874,
      mean: 86.61, baselineSurvival: 0.9533,
    },
  },
  male: {
    white_or_other: {
      bLnAge: 12.344, bLnAgeSq: 0,
      bLnChol: 11.853, bLnAgeLnChol: -2.664,
      bLnHdl: -7.990, bLnAgeLnHdl: 1.769,
      bLnSbpTreated: 1.797, bLnAgeLnSbpTreated: 0,
      bLnSbpUntreated: 1.764, bLnAgeLnSbpUntreated: 0,
      bSmoker: 7.837, bLnAgeSmoker: -1.795,
      bDiabetes: 0.658,
      mean: 61.18, baselineSurvival: 0.9144,
    },
    african_american: {
      bLnAge: 2.469, bLnAgeSq: 0,
      bLnChol: 0.302, bLnAgeLnChol: 0,
      bLnHdl: -0.307, bLnAgeLnHdl: 0,
      bLnSbpTreated: 1.916, bLnAgeLnSbpTreated: 0,
      bLnSbpUntreated: 1.809, bLnAgeLnSbpUntreated: 0,
      bSmoker: 0.549, bLnAgeSmoker: 0,
      bDiabetes: 0.645,
      mean: 19.54, baselineSurvival: 0.8954,
    },
  },
};

export function formula(inputs: AscvdInput): number {
  const c = COEFS[inputs.sex][inputs.race];
  const lnAge = Math.log(inputs.age);
  const lnChol = Math.log(inputs.totalCholesterolMgDl);
  const lnHdl = Math.log(inputs.hdlMgDl);
  const lnSbp = Math.log(inputs.systolicBpMmHg);

  const sbpTerm = inputs.treatedForHypertension
    ? c.bLnSbpTreated * lnSbp + c.bLnAgeLnSbpTreated * lnAge * lnSbp
    : c.bLnSbpUntreated * lnSbp + c.bLnAgeLnSbpUntreated * lnAge * lnSbp;

  const individualSum =
    c.bLnAge * lnAge +
    c.bLnAgeSq * lnAge * lnAge +
    c.bLnChol * lnChol +
    c.bLnAgeLnChol * lnAge * lnChol +
    c.bLnHdl * lnHdl +
    c.bLnAgeLnHdl * lnAge * lnHdl +
    sbpTerm +
    (inputs.smoker
      ? c.bSmoker + c.bLnAgeSmoker * lnAge
      : 0) +
    (inputs.diabetes ? c.bDiabetes : 0);

  const risk =
    1 - Math.pow(c.baselineSurvival, Math.exp(individualSum - c.mean));
  return Math.round(risk * 1000) / 10; // percentage to 1 decimal
}

export function interpret(score: number): InterpretResult {
  // 2018 AHA/ACC Cholesterol Guideline thresholds:
  //   low < 5 %, borderline 5–7.4 %, intermediate 7.5–19.9 %, high ≥ 20 %
  if (score < 5) {
    return {
      tier: "low", annualRiskPercent: score,
      recommendation: "Low 10-year ASCVD risk. Lifestyle counselling; statin not routinely indicated.",
      recommendationCode: "ASCVD_LOW", evidenceGrade: "A",
    };
  }
  if (score < 7.5) {
    return {
      tier: "low", annualRiskPercent: score,
      recommendation: "Borderline risk (5–7.4%). Discuss risk-enhancing factors; consider moderate-intensity statin in selected patients.",
      recommendationCode: "ASCVD_BORDERLINE", evidenceGrade: "A",
    };
  }
  if (score < 20) {
    return {
      tier: "moderate", annualRiskPercent: score,
      recommendation: "Intermediate risk (7.5–19.9%). Moderate- to high-intensity statin generally indicated alongside lifestyle changes.",
      recommendationCode: "ASCVD_INTERMEDIATE", evidenceGrade: "A",
    };
  }
  return {
    tier: "high", annualRiskPercent: score,
    recommendation: "High risk (≥ 20%). High-intensity statin indicated; consider non-statin add-ons to reach LDL-C goal.",
    recommendationCode: "ASCVD_HIGH", evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof AscvdInputs> = {
  id: "ascvd",
  inputs: AscvdInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 100 },
  specialty: "cardiology",
  i18nKey: "ascvd",
  references: [
    {
      pmid: "24222018",
      citation:
        "Goff DC Jr, Lloyd-Jones DM, Bennett G, et al. 2013 ACC/AHA guideline on the assessment of cardiovascular risk. Circulation. 2014;129(25 Suppl 2):S49-S73.",
    },
  ],
};
