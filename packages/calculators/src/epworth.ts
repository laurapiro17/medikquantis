import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Epworth Sleepiness Scale (Johns MW, 1991, PMID 1798888). Eight everyday
// situations, each rated 0-3 for the chance of dozing off. Maximum 24.

const DOZING_OPTIONS = [
  { value: "0", labelKey: "epworth.options.0" },
  { value: "1", labelKey: "epworth.options.1" },
  { value: "2", labelKey: "epworth.options.2" },
  { value: "3", labelKey: "epworth.options.3" },
] as const;

export const EpworthInputs = z.object({
  sittingReading: z.enum(["0", "1", "2", "3"]),
  watchingTv: z.enum(["0", "1", "2", "3"]),
  sittingInactivePublic: z.enum(["0", "1", "2", "3"]),
  passengerInCar: z.enum(["0", "1", "2", "3"]),
  lyingDownAfternoon: z.enum(["0", "1", "2", "3"]),
  sittingTalking: z.enum(["0", "1", "2", "3"]),
  sittingAfterLunch: z.enum(["0", "1", "2", "3"]),
  inCarStoppedInTraffic: z.enum(["0", "1", "2", "3"]),
});

export type EpworthInput = z.infer<typeof EpworthInputs>;

export function formula(inputs: EpworthInput): number {
  return (
    parseInt(inputs.sittingReading, 10) +
    parseInt(inputs.watchingTv, 10) +
    parseInt(inputs.sittingInactivePublic, 10) +
    parseInt(inputs.passengerInCar, 10) +
    parseInt(inputs.lyingDownAfternoon, 10) +
    parseInt(inputs.sittingTalking, 10) +
    parseInt(inputs.sittingAfterLunch, 10) +
    parseInt(inputs.inCarStoppedInTraffic, 10)
  );
}

export function interpret(score: number): InterpretResult {
  if (score >= 18) {
    return {
      tier: "high",
      recommendation:
        "Severe excessive daytime sleepiness (18-24). Prompt evaluation for an underlying sleep disorder is warranted, along with counselling about driving safety.",
      recommendationCode: "EPWORTH_SEVERE",
      evidenceGrade: "A",
    };
  }
  if (score >= 15) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate excessive daytime sleepiness (15-17). Evaluate for an underlying sleep disorder.",
      recommendationCode: "EPWORTH_MODERATE",
      evidenceGrade: "A",
    };
  }
  if (score >= 11) {
    return {
      tier: "moderate",
      recommendation:
        "Mild excessive daytime sleepiness (11-14). Consider further evaluation if symptoms are persistent or impair daily function.",
      recommendationCode: "EPWORTH_MILD",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Normal daytime sleepiness (0-10). No excessive daytime sleepiness on this basis alone.",
    recommendationCode: "EPWORTH_NORMAL",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof EpworthInputs> = {
  id: "epworth",
  inputs: EpworthInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 24 },
  specialty: "otorhinolaryngology",
  i18nKey: "epworth",
  fieldsMetadata: {
    sittingReading: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: DOZING_OPTIONS,
    },
    watchingTv: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: DOZING_OPTIONS,
    },
    sittingInactivePublic: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: DOZING_OPTIONS,
    },
    passengerInCar: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: DOZING_OPTIONS,
    },
    lyingDownAfternoon: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: DOZING_OPTIONS,
    },
    sittingTalking: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: DOZING_OPTIONS,
    },
    sittingAfterLunch: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: DOZING_OPTIONS,
    },
    inCarStoppedInTraffic: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: DOZING_OPTIONS,
    },
  },
  references: [
    {
      pmid: "1798888",
      citation:
        "Johns MW. A new method for measuring daytime sleepiness: the Epworth sleepiness scale. Sleep. 1991;14(6):540-545.",
    },
  ],
};
