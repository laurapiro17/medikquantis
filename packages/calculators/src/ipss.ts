import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// International Prostate Symptom Score (Barry MJ et al. 1992,
// PMID 1379630). Seven AUA symptom questions scored 0–5, total 0–35.
// A separate quality-of-life question (0–6) is shown alongside the score
// but does not contribute to it. The IPSS gates BPH treatment decisions.

const Score05 = z.enum(["0", "1", "2", "3", "4", "5"]);

export const IpssInputs = z.object({
  incompleteEmptying: Score05,
  frequency: Score05,
  intermittency: Score05,
  urgency: Score05,
  weakStream: Score05,
  straining: Score05,
  nocturia: Score05,
});

export type IpssInput = z.infer<typeof IpssInputs>;

export function formula(inputs: IpssInput): number {
  return Object.values(inputs).reduce((sum, v) => sum + parseInt(v, 10), 0);
}

export function interpret(score: number): InterpretResult {
  // EAU / AUA tiers: 0–7 mild, 8–19 moderate, 20–35 severe.
  if (score <= 7) {
    return {
      tier: "low",
      recommendation:
        "Mild lower urinary tract symptoms. Watchful waiting and behavioural advice are usually appropriate.",
      recommendationCode: "IPSS_MILD",
      evidenceGrade: "A",
    };
  }
  if (score <= 19) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate symptoms. Consider medical therapy (alpha-blockers, 5-ARI) and shared decision-making about further evaluation.",
      recommendationCode: "IPSS_MODERATE",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation:
      "Severe symptoms. Refer to urology; consider surgical options if medical therapy fails or complications develop.",
    recommendationCode: "IPSS_SEVERE",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof IpssInputs> = {
  id: "ipss",
  inputs: IpssInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 35 },
  specialty: "urology",
  i18nKey: "ipss",
  references: [
    {
      pmid: "1379630",
      citation:
        "Barry MJ, Fowler FJ Jr, O'Leary MP, et al. The American Urological Association symptom index for benign prostatic hyperplasia. J Urol. 1992;148(5):1549-1557.",
    },
  ],
};
