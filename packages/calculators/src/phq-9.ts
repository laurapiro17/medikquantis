import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Patient Health Questionnaire-9 (PHQ-9) (Kroenke K et al., 2001, PMID 11556941).
// Evaluates 9 symptoms of depression over the past 2 weeks (0-3 points each, max 27).

export const Phq9Inputs = z.object({
  q1: z.enum(["0", "1", "2", "3"]), // Little interest or pleasure in doing things
  q2: z.enum(["0", "1", "2", "3"]), // Feeling down, depressed, or hopeless
  q3: z.enum(["0", "1", "2", "3"]), // Trouble falling/staying asleep, or sleeping too much
  q4: z.enum(["0", "1", "2", "3"]), // Feeling tired or having little energy
  q5: z.enum(["0", "1", "2", "3"]), // Poor appetite or overeating
  q6: z.enum(["0", "1", "2", "3"]), // Feeling bad about yourself
  q7: z.enum(["0", "1", "2", "3"]), // Trouble concentrating
  q8: z.enum(["0", "1", "2", "3"]), // Moving or speaking slowly / fidgety
  q9: z.enum(["0", "1", "2", "3"]), // Thoughts of suicide / self-harm
});

export type Phq9Input = z.infer<typeof Phq9Inputs>;

export function formula(inputs: Phq9Input): number {
  return (
    parseInt(inputs.q1, 10) +
    parseInt(inputs.q2, 10) +
    parseInt(inputs.q3, 10) +
    parseInt(inputs.q4, 10) +
    parseInt(inputs.q5, 10) +
    parseInt(inputs.q6, 10) +
    parseInt(inputs.q7, 10) +
    parseInt(inputs.q8, 10) +
    parseInt(inputs.q9, 10)
  );
}

export function interpret(score: number): InterpretResult {
  if (score >= 20) {
    return {
      tier: "high",
      recommendation:
        "Severe depression (20–27). Immediate clinical evaluation, treatment initiation (pharmacotherapy/psychotherapy), and psychiatric referral recommended.",
      recommendationCode: "PHQ9_SEVERE",
      evidenceGrade: "A",
    };
  }
  if (score >= 15) {
    return {
      tier: "high",
      recommendation:
        "Moderately severe depression (15–19). Active treatment recommended with pharmacotherapy and/or psychotherapy.",
      recommendationCode: "PHQ9_MODERATELY_SEVERE",
      evidenceGrade: "A",
    };
  }
  if (score >= 10) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate depression (10–14). Treatment plan recommended; consider counseling, follow-up, or pharmacotherapy.",
      recommendationCode: "PHQ9_MODERATE",
      evidenceGrade: "A",
    };
  }
  if (score >= 5) {
    return {
      tier: "low",
      recommendation:
        "Mild depression (5–9). Clinical judgment regarding treatment; watchful waiting and repeat assessment.",
      recommendationCode: "PHQ9_MILD",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Minimal or no depression (0–4). Typically does not require formal treatment.",
    recommendationCode: "PHQ9_MINIMAL",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof Phq9Inputs> = {
  id: "phq-9",
  inputs: Phq9Inputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 27 },
  specialty: "psychiatry",
  i18nKey: "phq9",
  references: [
    {
      pmid: "11556941",
      citation:
        "Kroenke K, Spitzer RL, Williams JB. The PHQ-9: validity of a brief depression severity measure. J Gen Intern Med. 2001;16(9):606-613.",
    },
  ],
};
