import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// ISTH overt DIC score (Taylor FB Jr et al., 2001, PMID 11816725).
// Applied only when an underlying disorder known to be associated with DIC is
// present. Four laboratory items, maximum 8 points; >= 5 is compatible with
// overt DIC.

export const IsthDicInputs = z.object({
  platelets: z.enum(["0", "1", "2"]),
  fibrinMarker: z.enum(["0", "2", "3"]),
  ptProlongation: z.enum(["0", "1", "2"]),
  fibrinogen: z.enum(["0", "1"]),
});

export type IsthDicInput = z.infer<typeof IsthDicInputs>;

export function formula(inputs: IsthDicInput): number {
  return (
    parseInt(inputs.platelets, 10) +
    parseInt(inputs.fibrinMarker, 10) +
    parseInt(inputs.ptProlongation, 10) +
    parseInt(inputs.fibrinogen, 10)
  );
}

export function interpret(score: number): InterpretResult {
  if (score >= 5) {
    return {
      tier: "high",
      recommendation:
        "Compatible with overt DIC (score >= 5). Treat the underlying disorder and repeat the score daily.",
      recommendationCode: "ISTH_DIC_OVERT",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "moderate",
    recommendation:
      "Not compatible with overt DIC (score < 5). Suggestive of non-overt DIC; repeat in 1-2 days if clinical suspicion persists.",
    recommendationCode: "ISTH_DIC_NON_OVERT",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof IsthDicInputs> = {
  id: "isth-dic",
  inputs: IsthDicInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 8 },
  specialty: "hematology",
  i18nKey: "isthDic",
  fieldsMetadata: {
    platelets: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "1" }, { value: "2" }],
    },
    fibrinMarker: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "2" }, { value: "3" }],
    },
    ptProlongation: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "1" }, { value: "2" }],
    },
    fibrinogen: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "1" }],
    },
  },
  references: [
    {
      pmid: "11816725",
      citation:
        "Taylor FB Jr, Toh CH, Hoots WK, Wada H, Levi M. Towards definition, clinical and laboratory criteria, and a scoring system for disseminated intravascular coagulation. Thromb Haemost. 2001;86(5):1327-1330.",
    },
  ],
};
