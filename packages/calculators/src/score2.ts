import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// SCORE2 + SCORE2-OP (Hageman SHJ et al. Eur Heart J. 2021, PMID
// 34272611 / 34120177). ESC 2021 risk algorithm for 10-year fatal +
// non-fatal cardiovascular event in apparently healthy people without
// pre-existing CVD or diabetes.
//
// Two age strata:
//   • SCORE2     for ages 40–69
//   • SCORE2-OP  for ages ≥ 70
//
// Region calibration: Spain is in the LOW-risk region per the 2021 ESC
// guidelines (and so are most northern/western European countries).
// Constants below are for low-risk region only — adapt the recalibration
// scales if you want to support other regions.

export const Score2Inputs = z.object({
  sex: z.enum(["male", "female"]),
  age: z.number().int().min(40).max(89),
  smoker: z.boolean(),
  systolicBpMmHg: z.number().int().min(80).max(220),
  totalCholesterolMmolL: z.number().min(2).max(15),
  hdlMmolL: z.number().min(0.4).max(3.5),
});

export type Score2Input = z.infer<typeof Score2Inputs>;

// Centering points used by Hageman 2021.
const CENTRE = { age: 60, sbp: 120, chol: 6, hdl: 1.3 };

// SCORE2 (40-69) beta coefficients, baseline survival and recalibration
// parameters for the low-risk region.
const SCORE2 = {
  male: {
    bAge: 0.3742, bSmoke: 0.6012, bSBP: 0.2777, bChol: 0.1458, bHDL: -0.2698,
    bAgeSmoke: -0.0755, bAgeSBP: -0.0255, bAgeChol: -0.0281, bAgeHDL: 0.0426,
    s0: 0.9605, scale1: -0.5699, scale2: 0.7476,
  },
  female: {
    bAge: 0.4648, bSmoke: 0.7744, bSBP: 0.3131, bChol: 0.1002, bHDL: -0.2606,
    bAgeSmoke: -0.1088, bAgeSBP: -0.0277, bAgeChol: -0.0226, bAgeHDL: 0.0613,
    s0: 0.9776, scale1: -0.7380, scale2: 0.7019,
  },
} as const;

// SCORE2-OP (≥ 70) parameters, low-risk region.
const SCORE2_OP = {
  male: {
    bAge: 0.0634, bSmoke: 0.3524, bSBP: 0.0094, bChol: 0.0851, bHDL: -0.3380,
    bDiabetes: 0,
    bAgeSmoke: -0.0247, bAgeSBP: -0.0005, bAgeChol: -0.0073, bAgeHDL: 0.0091,
    s0: 0.7576, scale1: -0.34, scale2: 1.19,
  },
  female: {
    bAge: 0.0789, bSmoke: 0.4921, bSBP: 0.0102, bChol: 0.0605, bHDL: -0.3040,
    bDiabetes: 0,
    bAgeSmoke: -0.0255, bAgeSBP: -0.0004, bAgeChol: -0.0009, bAgeHDL: 0.0154,
    s0: 0.8082, scale1: -0.52, scale2: 1.01,
  },
} as const;

function calibrate(uncalibrated: number, c: { scale1: number; scale2: number }): number {
  // Recalibration to region: log(-log(1-p_cal)) = scale1 + scale2 · log(-log(1-p_unc))
  const safe = Math.min(Math.max(uncalibrated, 1e-9), 1 - 1e-9);
  const cll = Math.log(-Math.log(1 - safe));
  return 1 - Math.exp(-Math.exp(c.scale1 + c.scale2 * cll));
}

export function formula(inputs: Score2Input): number {
  const sex = inputs.sex;
  const age = inputs.age;
  const isOp = age >= 70;
  const c = isOp ? SCORE2_OP[sex] : SCORE2[sex];

  // Centered inputs (units as the paper: age in years, SBP in mmHg,
  // chol/HDL in mmol/L). For SCORE2-OP `bAge` already encodes a per-year
  // step, no rescaling needed.
  const cAge = age - CENTRE.age;
  const cSBP = inputs.systolicBpMmHg - CENTRE.sbp;
  const cChol = inputs.totalCholesterolMmolL - CENTRE.chol;
  const cHDL = inputs.hdlMmolL - CENTRE.hdl;
  const smk = inputs.smoker ? 1 : 0;

  const lp =
    c.bAge * cAge +
    c.bSmoke * smk +
    c.bSBP * cSBP +
    c.bChol * cChol +
    c.bHDL * cHDL +
    c.bAgeSmoke * cAge * smk +
    c.bAgeSBP * cAge * cSBP +
    c.bAgeChol * cAge * cChol +
    c.bAgeHDL * cAge * cHDL;

  const uncal = 1 - Math.pow(c.s0, Math.exp(lp));
  const cal = calibrate(uncal, c);
  return Math.round(cal * 1000) / 10; // percentage to 1 decimal
}

export function interpret(score: number, inputs: Score2Input): InterpretResult {
  // ESC 2021 risk thresholds (apparently healthy):
  //  Age < 50: low < 2.5 %, moderate 2.5–7.5 %, high ≥ 7.5 %
  //  Age 50-69: low < 5 %, moderate 5–10 %, high ≥ 10 %
  //  Age ≥ 70: low < 7.5 %, moderate 7.5–15 %, high ≥ 15 %
  const age = inputs.age;
  const [lo, mod] =
    age < 50 ? [2.5, 7.5] : age < 70 ? [5, 10] : [7.5, 15];

  if (score < lo) {
    return {
      tier: "low", annualRiskPercent: score,
      recommendation:
        "Low 10-year CV risk. Reinforce healthy lifestyle and reassess periodically.",
      recommendationCode: "SCORE2_LOW", evidenceGrade: "A",
    };
  }
  if (score < mod) {
    return {
      tier: "moderate", annualRiskPercent: score,
      recommendation:
        "Moderate 10-year CV risk. Lifestyle intervention plus consideration of risk-factor treatment if risk modifiers present.",
      recommendationCode: "SCORE2_MODERATE", evidenceGrade: "A",
    };
  }
  return {
    tier: "high", annualRiskPercent: score,
    recommendation:
      "High to very high 10-year CV risk. Optimise blood pressure and lipid management; statin therapy generally indicated.",
    recommendationCode: "SCORE2_HIGH", evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof Score2Inputs> = {
  id: "score2",
  inputs: Score2Inputs,
  formula,
  interpret: (score, inputs) => interpret(score, inputs),
  scoreRange: { min: 0, max: 100 },
  specialty: "cardiology",
  i18nKey: "score2",
  references: [
    {
      pmid: "34120177",
      citation:
        "SCORE2 working group and ESC Cardiovascular risk collaboration. SCORE2 risk prediction algorithms: new models to estimate 10-year risk of cardiovascular disease in Europe. Eur Heart J. 2021;42(25):2439-2454.",
    },
    {
      pmid: "34120185",
      citation:
        "SCORE2-OP working group and ESC Cardiovascular risk collaboration. SCORE2-OP risk prediction algorithms: estimating incident cardiovascular event risk in older persons in four geographical risk regions. Eur Heart J. 2021;42(25):2455-2467.",
    },
  ],
};
