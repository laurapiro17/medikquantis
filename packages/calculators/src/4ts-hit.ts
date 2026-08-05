import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// 4Ts score for heparin-induced thrombocytopenia (Lo GK et al., 2006,
// PMID 16634744). Four items scored 0-2, maximum 8. A low score has a high
// negative predictive value and argues against stopping heparin.

export const FourTsInputs = z.object({
  thrombocytopenia: z.enum(["0", "1", "2"]),
  timing: z.enum(["0", "1", "2"]),
  thrombosis: z.enum(["0", "1", "2"]),
  otherCauses: z.enum(["0", "1", "2"]),
});

export type FourTsInput = z.infer<typeof FourTsInputs>;

export function formula(inputs: FourTsInput): number {
  return (
    parseInt(inputs.thrombocytopenia, 10) +
    parseInt(inputs.timing, 10) +
    parseInt(inputs.thrombosis, 10) +
    parseInt(inputs.otherCauses, 10)
  );
}

export function interpret(score: number): InterpretResult {
  if (score >= 6) {
    return {
      tier: "high",
      recommendation:
        "High probability of HIT (6-8). Stop all heparin, start a non-heparin anticoagulant and send immunoassay plus functional testing.",
      recommendationCode: "FOURTS_HIGH",
      evidenceGrade: "A",
    };
  }
  if (score >= 4) {
    return {
      tier: "moderate",
      recommendation:
        "Intermediate probability of HIT (4-5). Consider stopping heparin and testing; clinical context decides.",
      recommendationCode: "FOURTS_INTERMEDIATE",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Low probability of HIT (0-3). HIT is unlikely; look for another cause of thrombocytopenia and continue heparin if otherwise indicated.",
    recommendationCode: "FOURTS_LOW",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof FourTsInputs> = {
  id: "4ts-hit",
  inputs: FourTsInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 8 },
  specialty: "hematology",
  i18nKey: "fourTsHit",
  fieldsMetadata: {
    thrombocytopenia: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "1" }, { value: "2" }],
    },
    timing: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "1" }, { value: "2" }],
    },
    thrombosis: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "1" }, { value: "2" }],
    },
    otherCauses: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "1" }, { value: "2" }],
    },
  },
  references: [
    {
      pmid: "16634744",
      citation:
        "Lo GK, Juhl D, Warkentin TE, Sigouin CS, Eichler P, Greinacher A. Evaluation of pretest clinical score (4 T's) for the diagnosis of heparin-induced thrombocytopenia in two clinical settings. J Thromb Haemost. 2006;4(4):759-765.",
    },
  ],
};
