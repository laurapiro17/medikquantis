import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Clinical Opiate Withdrawal Scale (COWS) (Wesson DR & Ling W, 2003, PMID 12924748).
// Evaluates 11 signs and symptoms of opioid withdrawal (max score 48).

export const CowsInputs = z.object({
  hr: z.enum(["0", "1", "2", "4"]), // Resting Pulse Rate
  sweat: z.enum(["0", "1", "2", "3", "4"]), // Sweating
  restless: z.enum(["0", "1", "3", "5"]), // Restlessness
  pupils: z.enum(["0", "1", "2", "5"]), // Pupil Size
  aches: z.enum(["0", "1", "2", "4"]), // Bone or Joint Aches
  rhinorrhea: z.enum(["0", "1", "2", "4"]), // Runny Nose or Tearing
  gi: z.enum(["0", "1", "2", "3", "5"]), // GI Upset
  tremor: z.enum(["0", "1", "2", "4"]), // Tremor
  yawn: z.enum(["0", "1", "2", "4"]), // Yawning
  anxiety: z.enum(["0", "1", "2", "4"]), // Anxiety or Irritability
  gooseflesh: z.enum(["0", "3", "5"]), // Gooseflesh Skin
});

export type CowsInput = z.infer<typeof CowsInputs>;

export function formula(inputs: CowsInput): number {
  return (
    parseInt(inputs.hr, 10) +
    parseInt(inputs.sweat, 10) +
    parseInt(inputs.restless, 10) +
    parseInt(inputs.pupils, 10) +
    parseInt(inputs.aches, 10) +
    parseInt(inputs.rhinorrhea, 10) +
    parseInt(inputs.gi, 10) +
    parseInt(inputs.tremor, 10) +
    parseInt(inputs.yawn, 10) +
    parseInt(inputs.anxiety, 10) +
    parseInt(inputs.gooseflesh, 10)
  );
}

export function interpret(score: number): InterpretResult {
  if (score > 36) {
    return {
      tier: "high",
      recommendation:
        "Severe opioid withdrawal (score > 36). Medical intervention indicated; safe for buprenorphine induction if protocol criteria are met.",
      recommendationCode: "COWS_SEVERE",
      evidenceGrade: "A",
    };
  }
  if (score >= 25) {
    return {
      tier: "high",
      recommendation:
        "Moderately severe opioid withdrawal (score 25–36). Target for buprenorphine induction and symptom management.",
      recommendationCode: "COWS_MODERATELY_SEVERE",
      evidenceGrade: "A",
    };
  }
  if (score >= 13) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate opioid withdrawal (score 13–24). Ideal range to initiate buprenorphine/sublingual buprenorphine-naloxone.",
      recommendationCode: "COWS_MODERATE",
      evidenceGrade: "A",
    };
  }
  if (score >= 5) {
    return {
      tier: "low",
      recommendation:
        "Mild opioid withdrawal (score 5–12). Monitor patient; buprenorphine induction should generally be delayed until score reaches ≥ 12–13 to avoid precipitated withdrawal.",
      recommendationCode: "COWS_MILD",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Minimal or no withdrawal (score 0–4). Buprenorphine induction is not indicated.",
    recommendationCode: "COWS_MINIMAL",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof CowsInputs> = {
  id: "cows",
  inputs: CowsInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 48 },
  specialty: "psychiatry",
  i18nKey: "cows",
  references: [
    {
      pmid: "12924748",
      citation:
        "Wesson DR, Ling W. The Clinical Opiate Withdrawal Scale (COWS). J Psychoactive Drugs. 2003;35(2):253-259.",
    },
  ],
};
