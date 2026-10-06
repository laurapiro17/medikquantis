import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// 22-item Sinonasal Outcome Test (SNOT-22; Hopkins C et al., 2009,
// PMID 19793277). Twenty-two symptom and quality-of-life items, each rated
// 0-5. Maximum 110. The largest form in the catalogue.

const SEVERITY_OPTIONS = [
  { value: "0", labelKey: "snot22.options.0" },
  { value: "1", labelKey: "snot22.options.1" },
  { value: "2", labelKey: "snot22.options.2" },
  { value: "3", labelKey: "snot22.options.3" },
  { value: "4", labelKey: "snot22.options.4" },
  { value: "5", labelKey: "snot22.options.5" },
] as const;

export const Snot22Inputs = z.object({
  needToBlowNose: z.enum(["0", "1", "2", "3", "4", "5"]),
  nasalObstruction: z.enum(["0", "1", "2", "3", "4", "5"]),
  sneezing: z.enum(["0", "1", "2", "3", "4", "5"]),
  runnyNose: z.enum(["0", "1", "2", "3", "4", "5"]),
  cough: z.enum(["0", "1", "2", "3", "4", "5"]),
  postNasalDischarge: z.enum(["0", "1", "2", "3", "4", "5"]),
  thickNasalDischarge: z.enum(["0", "1", "2", "3", "4", "5"]),
  earFullness: z.enum(["0", "1", "2", "3", "4", "5"]),
  dizziness: z.enum(["0", "1", "2", "3", "4", "5"]),
  earPain: z.enum(["0", "1", "2", "3", "4", "5"]),
  facialPainOrPressure: z.enum(["0", "1", "2", "3", "4", "5"]),
  lossOfSmellOrTaste: z.enum(["0", "1", "2", "3", "4", "5"]),
  difficultyFallingAsleep: z.enum(["0", "1", "2", "3", "4", "5"]),
  wakingUpAtNight: z.enum(["0", "1", "2", "3", "4", "5"]),
  lackOfGoodNightsSleep: z.enum(["0", "1", "2", "3", "4", "5"]),
  wakingUpTired: z.enum(["0", "1", "2", "3", "4", "5"]),
  fatigueDuringTheDay: z.enum(["0", "1", "2", "3", "4", "5"]),
  reducedProductivity: z.enum(["0", "1", "2", "3", "4", "5"]),
  reducedConcentration: z.enum(["0", "1", "2", "3", "4", "5"]),
  frustratedRestlessOrIrritable: z.enum(["0", "1", "2", "3", "4", "5"]),
  sad: z.enum(["0", "1", "2", "3", "4", "5"]),
  embarrassed: z.enum(["0", "1", "2", "3", "4", "5"]),
});

export type Snot22Input = z.infer<typeof Snot22Inputs>;

export function formula(inputs: Snot22Input): number {
  return (
    parseInt(inputs.needToBlowNose, 10) +
    parseInt(inputs.nasalObstruction, 10) +
    parseInt(inputs.sneezing, 10) +
    parseInt(inputs.runnyNose, 10) +
    parseInt(inputs.cough, 10) +
    parseInt(inputs.postNasalDischarge, 10) +
    parseInt(inputs.thickNasalDischarge, 10) +
    parseInt(inputs.earFullness, 10) +
    parseInt(inputs.dizziness, 10) +
    parseInt(inputs.earPain, 10) +
    parseInt(inputs.facialPainOrPressure, 10) +
    parseInt(inputs.lossOfSmellOrTaste, 10) +
    parseInt(inputs.difficultyFallingAsleep, 10) +
    parseInt(inputs.wakingUpAtNight, 10) +
    parseInt(inputs.lackOfGoodNightsSleep, 10) +
    parseInt(inputs.wakingUpTired, 10) +
    parseInt(inputs.fatigueDuringTheDay, 10) +
    parseInt(inputs.reducedProductivity, 10) +
    parseInt(inputs.reducedConcentration, 10) +
    parseInt(inputs.frustratedRestlessOrIrritable, 10) +
    parseInt(inputs.sad, 10) +
    parseInt(inputs.embarrassed, 10)
  );
}

export function interpret(score: number): InterpretResult {
  if (score >= 51) {
    return {
      tier: "high",
      recommendation:
        "Severe sinonasal symptom burden (51-110). Substantial impact on daily life; specialist rhinology review is warranted.",
      recommendationCode: "SNOT22_SEVERE",
      evidenceGrade: "B",
    };
  }
  if (score >= 21) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate sinonasal symptom burden (21-50). Clinically meaningful impact on quality of life warranting evaluation and treatment.",
      recommendationCode: "SNOT22_MODERATE",
      evidenceGrade: "B",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Mild sinonasal symptom burden (0-20). Limited impact on daily life on this basis alone.",
    recommendationCode: "SNOT22_MILD",
    evidenceGrade: "B",
  };
}

export const calculator: CalcDefinition<typeof Snot22Inputs> = {
  id: "snot-22",
  inputs: Snot22Inputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 110 },
  specialty: "otorhinolaryngology",
  i18nKey: "snot22",
  fieldsMetadata: {
    needToBlowNose: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    nasalObstruction: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    sneezing: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    runnyNose: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    cough: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    postNasalDischarge: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    thickNasalDischarge: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    earFullness: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    dizziness: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    earPain: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    facialPainOrPressure: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    lossOfSmellOrTaste: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    difficultyFallingAsleep: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    wakingUpAtNight: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    lackOfGoodNightsSleep: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    wakingUpTired: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    fatigueDuringTheDay: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    reducedProductivity: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    reducedConcentration: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    frustratedRestlessOrIrritable: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    sad: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
    embarrassed: {
      widget: "radio",
      layout: "inline",
      defaultValue: "0",
      options: SEVERITY_OPTIONS,
    },
  },
  references: [
    {
      pmid: "19793277",
      citation:
        "Hopkins C, Gillett S, Slack R, Lund VJ, Browne JP. Psychometric validity of the 22-item Sinonasal Outcome Test. Clin Otolaryngol. 2009;34(5):447-454.",
    },
    {
      pmid: "27017484",
      citation:
        "Toma S, Hopkins C. Stratification of SNOT-22 scores into mild, moderate or severe and relationship with other subjective instruments. Rhinology. 2016;54(2):129-133.",
    },
  ],
};
