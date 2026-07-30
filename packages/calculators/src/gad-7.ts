import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Generalized Anxiety Disorder 7-Item Scale (GAD-7) (Spitzer RL et al., 2006, PMID 16717171).
// Evaluates 7 symptoms of anxiety over the past 2 weeks (0-3 points each, max 21).

export const Gad7Inputs = z.object({
  q1: z.enum(["0", "1", "2", "3"]), // Feeling nervous, anxious, or on edge
  q2: z.enum(["0", "1", "2", "3"]), // Not being able to stop or control worrying
  q3: z.enum(["0", "1", "2", "3"]), // Worrying too much about different things
  q4: z.enum(["0", "1", "2", "3"]), // Trouble relaxing
  q5: z.enum(["0", "1", "2", "3"]), // Being so restless that it's hard to sit still
  q6: z.enum(["0", "1", "2", "3"]), // Becoming easily annoyed or irritable
  q7: z.enum(["0", "1", "2", "3"]), // Feeling afraid as if something awful might happen
});

export type Gad7Input = z.infer<typeof Gad7Inputs>;

export function formula(inputs: Gad7Input): number {
  return (
    parseInt(inputs.q1, 10) +
    parseInt(inputs.q2, 10) +
    parseInt(inputs.q3, 10) +
    parseInt(inputs.q4, 10) +
    parseInt(inputs.q5, 10) +
    parseInt(inputs.q6, 10) +
    parseInt(inputs.q7, 10)
  );
}

export function interpret(score: number): InterpretResult {
  if (score >= 15) {
    return {
      tier: "high",
      recommendation:
        "Severe anxiety (15–21). Active treatment recommended with pharmacotherapy and/or psychotherapy; psychiatric evaluation advised.",
      recommendationCode: "GAD7_SEVERE",
      evidenceGrade: "A",
    };
  }
  if (score >= 10) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate anxiety (10–14). Further evaluation required; consider psychotherapy or medical management.",
      recommendationCode: "GAD7_MODERATE",
      evidenceGrade: "A",
    };
  }
  if (score >= 5) {
    return {
      tier: "low",
      recommendation:
        "Mild anxiety (5–9). Monitor patient; consider counseling and stress management strategies.",
      recommendationCode: "GAD7_MILD",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Minimal anxiety (0–4). Typically does not require formal intervention.",
    recommendationCode: "GAD7_MINIMAL",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof Gad7Inputs> = {
  id: "gad-7",
  inputs: Gad7Inputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 21 },
  specialty: "psychiatry",
  i18nKey: "gad7",
  references: [
    {
      pmid: "16717171",
      citation:
        "Spitzer RL, Kroenke K, Williams JB, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med. 2006;166(10):1092-1097.",
    },
  ],
};
