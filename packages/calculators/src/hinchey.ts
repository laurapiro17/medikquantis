import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Hinchey classification of acute complicated diverticulitis
// (Hinchey EJ, Schaal PG, Richards GK 1978, PMID 735943). Anatomical
// classification based on imaging or operative findings, scored I–IV.
// Drives the choice between conservative management, percutaneous
// drainage and emergency surgery.

export const HincheyClass = z.enum(["I", "II", "III", "IV"]);
export type HincheyClassValue = z.infer<typeof HincheyClass>;

export const HincheyInputs = z.object({
  hincheyClass: HincheyClass,
});

export type HincheyInput = z.infer<typeof HincheyInputs>;

const ordinalByClass: Record<HincheyClassValue, number> = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
};

export function formula(inputs: HincheyInput): number {
  return ordinalByClass[inputs.hincheyClass];
}

interface HincheyInterpretResult extends InterpretResult {
  classLabel: HincheyClassValue;
}

export function interpret(
  _score: number,
  inputs: HincheyInput,
): HincheyInterpretResult {
  const cls = inputs.hincheyClass;
  if (cls === "I") {
    return {
      classLabel: cls,
      tier: "low",
      recommendation:
        "Hinchey I: pericolic abscess. Intravenous antibiotics; percutaneous drainage if abscess >4 cm.",
      recommendationCode: "HINCHEY_I",
      evidenceGrade: "A",
    };
  }
  if (cls === "II") {
    return {
      classLabel: cls,
      tier: "moderate",
      recommendation:
        "Hinchey II: pelvic, retroperitoneal or distant abscess. Image-guided drainage plus antibiotics; surgical option if drainage fails.",
      recommendationCode: "HINCHEY_II",
      evidenceGrade: "A",
    };
  }
  if (cls === "III") {
    return {
      classLabel: cls,
      tier: "high",
      recommendation:
        "Hinchey III: generalised purulent peritonitis. Emergency surgery (laparoscopic lavage or resection); ICU input.",
      recommendationCode: "HINCHEY_III",
      evidenceGrade: "A",
    };
  }
  return {
    classLabel: cls,
    tier: "high",
    recommendation:
      "Hinchey IV: generalised faecal peritonitis. Emergency Hartmann's procedure with broad-spectrum antibiotics and resuscitation.",
    recommendationCode: "HINCHEY_IV",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof HincheyInputs> = {
  id: "hinchey",
  inputs: HincheyInputs,
  formula,
  interpret: (score, inputs) => interpret(score, inputs),
  scoreRange: { min: 1, max: 4 },
  specialty: "surgery",
  i18nKey: "hinchey",
  references: [
    {
      pmid: "735943",
      citation:
        "Hinchey EJ, Schaal PG, Richards GK. Treatment of perforated diverticular disease of the colon. Adv Surg. 1978;12:85-109.",
    },
  ],
};
