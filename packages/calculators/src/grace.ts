import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// GRACE in-hospital mortality risk per Granger CB et al. 2003
// (Arch Intern Med 163:2345, PMID 14581255), n=11,389 ACS patients.
// Non-linear point assignment per binned ranges of continuous variables.

export const KillipClass = z.enum(["I", "II", "III", "IV"]);
export type KillipClassValue = z.infer<typeof KillipClass>;

export const GraceInputs = z.object({
  age: z.number().int().min(18).max(120),
  heartRate: z.number().int().min(20).max(300),
  systolicBP: z.number().int().min(40).max(300),
  creatinine: z.number().min(0.1).max(20),
  killipClass: KillipClass,
  cardiacArrestAtAdmission: z.boolean(),
  stSegmentDeviation: z.boolean(),
  elevatedCardiacEnzymes: z.boolean(),
});

export type GraceInput = z.infer<typeof GraceInputs>;

// Binner helpers — each maps a continuous value to its GRACE points.
// Boundaries are inclusive on the lower bound (Granger 2003 table).

function binAge(age: number): number {
  if (age < 30) return 0;
  if (age < 40) return 8;
  if (age < 50) return 25;
  if (age < 60) return 41;
  if (age < 70) return 58;
  if (age < 80) return 75;
  if (age < 90) return 91;
  return 100;
}

function binHeartRate(hr: number): number {
  if (hr < 50) return 0;
  if (hr < 70) return 3;
  if (hr < 90) return 9;
  if (hr < 110) return 15;
  if (hr < 150) return 24;
  if (hr < 200) return 38;
  return 46;
}

function binSystolicBP(sbp: number): number {
  // Inverse: low SBP = more points.
  if (sbp < 80) return 58;
  if (sbp < 100) return 53;
  if (sbp < 120) return 43;
  if (sbp < 140) return 34;
  if (sbp < 160) return 24;
  if (sbp < 200) return 10;
  return 0;
}

function binCreatinine(cr: number): number {
  if (cr < 0.4) return 1;
  if (cr < 0.8) return 4;
  if (cr < 1.2) return 7;
  if (cr < 1.6) return 10;
  if (cr < 2.0) return 13;
  if (cr < 4.0) return 21;
  return 28;
}

const killipPoints: Record<KillipClassValue, number> = {
  I: 0,
  II: 20,
  III: 39,
  IV: 59,
};

export function formula(inputs: GraceInput): number {
  return (
    binAge(inputs.age) +
    binHeartRate(inputs.heartRate) +
    binSystolicBP(inputs.systolicBP) +
    binCreatinine(inputs.creatinine) +
    killipPoints[inputs.killipClass] +
    (inputs.cardiacArrestAtAdmission ? 39 : 0) +
    (inputs.stSegmentDeviation ? 28 : 0) +
    (inputs.elevatedCardiacEnzymes ? 14 : 0)
  );
}

// In-hospital mortality (%) per Granger 2003, smoothed across score range.
// Values picked from the published nomogram at representative anchors.
function inHospitalMortality(score: number): number {
  // Below 60 the mortality is <0.5%; above 250 it's ≈50%.
  // The relationship is approximately exponential.
  if (score <= 60) return 0.2;
  if (score <= 70) return 0.4;
  if (score <= 80) return 0.7;
  if (score <= 90) return 0.9;
  if (score <= 100) return 1.4;
  if (score <= 110) return 2.0;
  if (score <= 120) return 3.0;
  if (score <= 130) return 4.0;
  if (score <= 140) return 5.5;
  if (score <= 150) return 7.5;
  if (score <= 160) return 10.0;
  if (score <= 170) return 13.0;
  if (score <= 180) return 16.0;
  if (score <= 190) return 20.0;
  if (score <= 200) return 25.0;
  if (score <= 210) return 30.0;
  if (score <= 220) return 35.0;
  if (score <= 230) return 40.0;
  if (score <= 240) return 44.0;
  return 50.0;
}

export function interpret(score: number): InterpretResult & { sixMonthBucket?: string } {
  const mortality = inHospitalMortality(score);

  // Risk tiers per ESC NSTEMI guidelines using GRACE in-hospital score:
  //   low ≤108 (~1%), intermediate 109-140 (1-3%), high >140 (>3%)
  if (score <= 108) {
    return {
      tier: "low",
      recommendation:
        "Low in-hospital mortality risk; selective invasive strategy if symptoms recur.",
      evidenceGrade: "A",
      annualRiskPercent: mortality,
    };
  }
  if (score <= 140) {
    return {
      tier: "moderate",
      recommendation:
        "Intermediate risk; early invasive strategy recommended (within 24h).",
      evidenceGrade: "A",
      annualRiskPercent: mortality,
    };
  }
  return {
    tier: "high",
    recommendation:
      "High risk; urgent invasive strategy (<2h) and cardiology referral.",
    evidenceGrade: "A",
    annualRiskPercent: mortality,
  };
}

export const calculator: CalcDefinition<typeof GraceInputs> = {
  id: "grace",
  inputs: GraceInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 372 },
  specialty: "cardiology",
  i18nKey: "grace",
  references: [
    {
      pmid: "14581255",
      citation:
        "Granger CB, Goldberg RJ, Dabbous O, et al. Predictors of hospital mortality in the global registry of acute coronary events. Arch Intern Med. 2003;163(19):2345-2353.",
    },
    {
      pmid: "17032691",
      citation:
        "Fox KAA, Dabbous OH, Goldberg RJ, et al. Prediction of risk of death and myocardial infarction in the six months after presentation with acute coronary syndrome: prospective multinational observational study (GRACE). BMJ. 2006;333(7578):1091.",
    },
  ],
};
