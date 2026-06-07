import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// ASA Physical Status (Saklad 1941, updated by the ASA House of
// Delegates most recently in 2014/2020; example set published Hurwitz
// EE et al. Anesthesiology 2017 PMID 28212203). A 1-of-6 ordinal grade
// of preoperative systemic health, with an optional "E" emergency
// suffix.

export const AsaClass = z.enum(["I", "II", "III", "IV", "V", "VI"]);
export type AsaClassValue = z.infer<typeof AsaClass>;

export const AsaPsInputs = z.object({
  asaClass: AsaClass,
  emergency: z.boolean(),
});

export type AsaPsInput = z.infer<typeof AsaPsInputs>;

const ordinalByClass: Record<AsaClassValue, number> = {
  I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6,
};

export function formula(inputs: AsaPsInput): number {
  // Score = ordinal of the class. The emergency flag is surfaced in
  // interpret() rather than added to the numeric score so the canonical
  // "ASA III-E" representation stays unambiguous.
  return ordinalByClass[inputs.asaClass];
}

interface AsaInterpretResult extends InterpretResult {
  classLabel: AsaClassValue;
  emergency: boolean;
}

export function interpret(
  _score: number,
  inputs: AsaPsInput,
): AsaInterpretResult {
  const cls = inputs.asaClass;
  const suffix = inputs.emergency ? "E" : "";
  if (cls === "I") {
    return {
      classLabel: cls, emergency: inputs.emergency,
      tier: "low",
      recommendation: `ASA I${suffix}: healthy patient. Routine anaesthetic risk; standard preoperative work-up.`,
      recommendationCode: "ASA_I", evidenceGrade: "A",
    };
  }
  if (cls === "II") {
    return {
      classLabel: cls, emergency: inputs.emergency,
      tier: "low",
      recommendation: `ASA II${suffix}: mild systemic disease (e.g. controlled hypertension, current smoker, BMI 30-40). No substantive functional limitation.`,
      recommendationCode: "ASA_II", evidenceGrade: "A",
    };
  }
  if (cls === "III") {
    return {
      classLabel: cls, emergency: inputs.emergency,
      tier: "moderate",
      recommendation: `ASA III${suffix}: severe systemic disease with substantive functional limitation. Optimise comorbidities; consider specialist input pre-op.`,
      recommendationCode: "ASA_III", evidenceGrade: "A",
    };
  }
  if (cls === "IV") {
    return {
      classLabel: cls, emergency: inputs.emergency,
      tier: "high",
      recommendation: `ASA IV${suffix}: severe systemic disease that is a constant threat to life. Multidisciplinary anaesthetic planning; consider awake or invasive monitoring.`,
      recommendationCode: "ASA_IV", evidenceGrade: "A",
    };
  }
  if (cls === "V") {
    return {
      classLabel: cls, emergency: inputs.emergency,
      tier: "high",
      recommendation: `ASA V${suffix}: moribund patient not expected to survive without the operation. Discuss goals of care; ICU bed required post-operatively.`,
      recommendationCode: "ASA_V", evidenceGrade: "A",
    };
  }
  return {
    classLabel: cls, emergency: inputs.emergency,
    tier: "high",
    recommendation: `ASA VI${suffix}: declared brain-dead patient whose organs are being removed for donor purposes.`,
    recommendationCode: "ASA_VI", evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof AsaPsInputs> = {
  id: "asa-ps",
  inputs: AsaPsInputs,
  formula,
  interpret: (score, inputs) => interpret(score, inputs),
  scoreRange: { min: 1, max: 6 },
  specialty: "anesthesiology",
  i18nKey: "asaPs",
  references: [
    {
      pmid: "28212203",
      citation:
        "Hurwitz EE, Simon M, Vinta SR, et al. Adding examples to the ASA-Physical Status classification improves correct assignment to patients. Anesthesiology. 2017;126(4):614-622.",
    },
  ],
};
