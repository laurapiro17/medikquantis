import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Child-Pugh score for cirrhosis severity (Pugh RN et al. Br J Surg
// 1973, PMID 4541913). Five items × 1-3 points each, total 5-15. Class
// A 5-6, B 7-9, C 10-15. Used as a gating tool for surgery, drug
// dosing, transplant timing and 1-year survival prognosis.

const Pt13 = z.enum(["1", "2", "3"]);

export const ChildPughInputs = z.object({
  bilirubin: Pt13, // 1 = <2 mg/dL, 2 = 2-3, 3 = >3
  albumin: Pt13, // 1 = >3.5 g/dL, 2 = 2.8-3.5, 3 = <2.8
  inr: Pt13, // 1 = <1.7, 2 = 1.7-2.3, 3 = >2.3
  ascites: Pt13, // 1 = none, 2 = mild/medically controlled, 3 = refractory
  encephalopathy: Pt13, // 1 = none, 2 = grade I-II / medically controlled, 3 = grade III-IV
});

export type ChildPughInput = z.infer<typeof ChildPughInputs>;

export function formula(inputs: ChildPughInput): number {
  const n = (v: "1" | "2" | "3") => parseInt(v, 10);
  return (
    n(inputs.bilirubin) +
    n(inputs.albumin) +
    n(inputs.inr) +
    n(inputs.ascites) +
    n(inputs.encephalopathy)
  );
}

interface ChildPughInterpretResult extends InterpretResult {
  classLabel: "A" | "B" | "C";
}

export function interpret(score: number): ChildPughInterpretResult {
  if (score <= 6) {
    return {
      classLabel: "A",
      tier: "low",
      recommendation:
        "Class A (well-compensated cirrhosis). ~100% 1-year survival; non-hepatic surgery generally safe.",
      recommendationCode: "CHILD_PUGH_A",
      evidenceGrade: "A",
    };
  }
  if (score <= 9) {
    return {
      classLabel: "B",
      tier: "moderate",
      recommendation:
        "Class B (significant functional compromise). ~80% 1-year survival; assess transplant candidacy; defer elective surgery if possible.",
      recommendationCode: "CHILD_PUGH_B",
      evidenceGrade: "A",
    };
  }
  return {
    classLabel: "C",
    tier: "high",
    recommendation:
      "Class C (decompensated cirrhosis). ~45% 1-year survival; transplant evaluation; avoid elective surgery — high peri-operative mortality.",
    recommendationCode: "CHILD_PUGH_C",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof ChildPughInputs> = {
  id: "child-pugh",
  inputs: ChildPughInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 5, max: 15 },
  specialty: "gastroenterology",
  i18nKey: "childPugh",
  references: [
    {
      pmid: "4541913",
      citation:
        "Pugh RN, Murray-Lyon IM, Dawson JL, Pietroni MC, Williams R. Transection of the oesophagus for bleeding oesophageal varices. Br J Surg. 1973;60(8):646-649.",
    },
  ],
};
