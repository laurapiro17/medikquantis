import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Pitt Bacteraemia Score (Hilf M et al. 1989, PMID 2929727; widely cited
// via Paterson DL 2004). Five clinical criteria scored 0–14 at the time of
// blood culture positivity. Predicts mortality in Gram-negative
// bacteraemia and gates many infectious-disease decision rules
// (carbapenem stewardship, infectious disease consultation, etc.).

export const TemperatureBand = z.enum([
  "normal",
  "mild",
  "severe",
]);
export type TemperatureBandValue = z.infer<typeof TemperatureBand>;

export const MentalStatus = z.enum([
  "alert",
  "disoriented",
  "stuporous",
  "comatose",
]);
export type MentalStatusValue = z.infer<typeof MentalStatus>;

export const PittBacteremiaInputs = z.object({
  temperatureBand: TemperatureBand,
  hypotension: z.boolean(),
  mechanicalVentilation: z.boolean(),
  cardiacArrestWithin24h: z.boolean(),
  mentalStatus: MentalStatus,
});

export type PittBacteremiaInput = z.infer<typeof PittBacteremiaInputs>;

const tempPoints: Record<TemperatureBandValue, number> = {
  normal: 0, // 36.1 – 38.9 °C
  mild: 1, // 35.1–36.0 or 39.0–39.9 °C
  severe: 2, // ≤35.0 or ≥40.0 °C
};

const mentalPoints: Record<MentalStatusValue, number> = {
  alert: 0,
  disoriented: 1,
  stuporous: 2,
  comatose: 4,
};

export function formula(inputs: PittBacteremiaInput): number {
  let score = 0;
  score += tempPoints[inputs.temperatureBand];
  if (inputs.hypotension) score += 2;
  if (inputs.mechanicalVentilation) score += 2;
  if (inputs.cardiacArrestWithin24h) score += 4;
  score += mentalPoints[inputs.mentalStatus];
  return score;
}

export function interpret(score: number): InterpretResult {
  // Paterson 2004 threshold: ≥4 strongly associated with mortality and
  // commonly used as a "critically ill" cut-off in stewardship trials.
  if (score <= 1) {
    return {
      tier: "low",
      recommendation:
        "Low Pitt score; mortality risk close to baseline. Standard empirical antibiotic therapy is usually appropriate.",
      recommendationCode: "PITT_LOW",
      evidenceGrade: "B",
    };
  }
  if (score <= 3) {
    return {
      tier: "moderate",
      recommendation:
        "Intermediate Pitt score; moderately elevated mortality. Consider infectious-disease consultation and prompt source control.",
      recommendationCode: "PITT_INTERMEDIATE",
      evidenceGrade: "B",
    };
  }
  return {
    tier: "high",
    recommendation:
      "High Pitt score (≥4); markedly elevated 30-day mortality. Urgent escalation: broad-spectrum coverage, source control and ID/ICU input.",
    recommendationCode: "PITT_HIGH",
    evidenceGrade: "B",
  };
}

export const calculator: CalcDefinition<typeof PittBacteremiaInputs> = {
  id: "pitt-bacteremia",
  inputs: PittBacteremiaInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 14 },
  specialty: "infectious_diseases",
  i18nKey: "pittBacteremia",
  references: [
    {
      pmid: "2929727",
      citation:
        "Hilf M, Yu VL, Sharp J, Zuravleff JJ, Korvick JA, Muder RR. Antibiotic therapy for Pseudomonas aeruginosa bacteremia: outcome correlations in a prospective study of 200 patients. Am J Med. 1989;87(5):540-546.",
    },
    {
      pmid: "15356812",
      citation:
        "Paterson DL, Ko WC, Von Gottberg A, et al. International prospective study of Klebsiella pneumoniae bacteremia: implications of extended-spectrum β-lactamase production in nosocomial infections. Ann Intern Med. 2004;140(1):26-32.",
    },
  ],
};
