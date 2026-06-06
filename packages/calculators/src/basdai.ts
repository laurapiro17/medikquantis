import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Bath Ankylosing Spondylitis Disease Activity Index (Garrett S et al.
// 1994, PMID 7699630). Six VAS questions, scored 0 (none) to 10 (very
// severe). Final score = mean of [Q1, Q2, Q3, Q4, mean(Q5, Q6)] — the
// two morning-stiffness items are averaged before being combined with
// the others.

const Vas = z.number().min(0).max(10);

export const BasdaiInputs = z.object({
  fatigue: Vas, // Q1 — overall fatigue
  spineNeckHipPain: Vas, // Q2 — neck/back/hip pain
  jointPainSwelling: Vas, // Q3 — other peripheral joints
  tendernessOnTouch: Vas, // Q4 — areas tender to touch
  morningStiffnessSeverity: Vas, // Q5
  morningStiffnessDuration: Vas, // Q6 — duration 0=none, 5≈1h, 10≥2h
});

export type BasdaiInput = z.infer<typeof BasdaiInputs>;

export function formula(inputs: BasdaiInput): number {
  const morningMean =
    (inputs.morningStiffnessSeverity + inputs.morningStiffnessDuration) / 2;
  const total =
    inputs.fatigue +
    inputs.spineNeckHipPain +
    inputs.jointPainSwelling +
    inputs.tendernessOnTouch +
    morningMean;
  // Round to one decimal place — clinical reports show BASDAI as N.N.
  return Math.round((total / 5) * 10) / 10;
}

export function interpret(score: number): InterpretResult {
  // BASDAI ≥4 is the canonical cut-off for "active disease" used in
  // ASAS-EULAR biologic eligibility criteria.
  if (score < 4) {
    return {
      tier: "low",
      recommendation:
        "BASDAI <4: low disease activity. Continue current therapy and monitor for changes.",
      recommendationCode: "BASDAI_LOW",
      evidenceGrade: "A",
    };
  }
  if (score < 7) {
    return {
      tier: "moderate",
      recommendation:
        "BASDAI ≥4: active disease. Reassess therapy — typical threshold for advancing to a biologic if NSAID response is inadequate.",
      recommendationCode: "BASDAI_ACTIVE",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation:
      "BASDAI ≥7: very high disease activity. Escalate therapy promptly and check for extra-articular complications.",
    recommendationCode: "BASDAI_VERY_HIGH",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof BasdaiInputs> = {
  id: "basdai",
  inputs: BasdaiInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 10 },
  specialty: "rheumatology",
  i18nKey: "basdai",
  references: [
    {
      pmid: "7699630",
      citation:
        "Garrett S, Jenkinson T, Kennedy LG, Whitelock H, Gaisford P, Calin A. A new approach to defining disease status in ankylosing spondylitis: the Bath Ankylosing Spondylitis Disease Activity Index. J Rheumatol. 1994;21(12):2286-2291.",
    },
  ],
};
