import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

export const EhraClass = z.enum(["I", "IIa", "IIb", "III", "IV"]);
export type EhraClassValue = z.infer<typeof EhraClass>;

export const EhraInputs = z.object({
  ehraClass: EhraClass,
});

export type EhraInput = z.infer<typeof EhraInputs>;

// Ordinal mapping for sorting/comparison only.
// The class label (I/IIa/IIb/III/IV) is the canonical user-facing output.
const ordinalByClass: Record<EhraClassValue, number> = {
  I: 1,
  IIa: 2,
  IIb: 3,
  III: 4,
  IV: 5,
};

export function formula(inputs: EhraInput): number {
  return ordinalByClass[inputs.ehraClass];
}

interface EhraInterpretResult extends InterpretResult {
  classLabel: EhraClassValue;
}

export function interpret(
  _score: number,
  inputs: EhraInput,
): EhraInterpretResult {
  const cls = inputs.ehraClass;

  // Tier mapping per ESC AFiB guidelines: rhythm-control is escalated
  // with symptom burden. Class I/IIa = low burden, IIb = moderate
  // (patient bothered → consider rhythm control), III/IV = high (rhythm
  // control strongly recommended / mandatory).
  if (cls === "I" || cls === "IIa") {
    return {
      classLabel: cls,
      tier: "low",
      recommendation:
        cls === "I"
          ? "No symptoms; symptom-directed therapy not required."
          : "Mild symptoms; daily activity not affected. Symptom-directed therapy not generally required.",
      recommendationCode: cls === "I" ? "EHRA_I_NO_SYMPTOMS" : "EHRA_IIA_MILD",
      evidenceGrade: "B",
    };
  }

  if (cls === "IIb") {
    return {
      classLabel: cls,
      tier: "moderate",
      recommendation:
        "Moderate symptoms causing patient distress; consider rate or rhythm control.",
      recommendationCode: "EHRA_IIB_MODERATE",
      evidenceGrade: "B",
    };
  }

  if (cls === "III") {
    return {
      classLabel: cls,
      tier: "high",
      recommendation:
        "Severe symptoms affecting daily activity; rhythm control strongly recommended.",
      recommendationCode: "EHRA_III_SEVERE",
      evidenceGrade: "A",
    };
  }

  return {
    classLabel: cls,
    tier: "high",
    recommendation:
      "Disabling symptoms; daily activity discontinued. Urgent rhythm-control intervention indicated.",
    recommendationCode: "EHRA_IV_DISABLING",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof EhraInputs> = {
  id: "ehra",
  inputs: EhraInputs,
  formula,
  interpret: (score, inputs) => interpret(score, inputs),
  scoreRange: { min: 1, max: 5 },
  specialty: "cardiology",
  i18nKey: "ehra",
  references: [
    {
      pmid: "24534264",
      citation:
        "Wynn GJ, Todd DM, Webber M, et al. The European Heart Rhythm Association symptom classification for atrial fibrillation: validation and improvement through a simple modification. Europace. 2014;16(7):965-972.",
    },
    {
      pmid: "39210723",
      citation:
        "Van Gelder IC, Rienstra M, Bunting KV, et al. 2024 ESC Guidelines for the management of atrial fibrillation. Eur Heart J. 2024;45(36):3314-3414.",
    },
  ],
};
