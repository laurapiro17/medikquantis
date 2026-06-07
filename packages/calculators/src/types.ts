import type { ZodTypeAny, z } from "zod";

export type RiskTier = "low" | "moderate" | "high";

export type EvidenceGrade = "A" | "B" | "C";

export interface InterpretResult {
  tier: RiskTier;
  recommendation: string;
  recommendationCode: string;
  evidenceGrade: EvidenceGrade;
  annualRiskPercent?: number;
}

export interface CalcReference {
  pmid: string;
  citation: string;
}

/**
 * Open string union — well-known specialties are typed for autocomplete, but
 * any string is accepted so that adding "nephrology" to a new calc never
 * requires touching this file. The i18n parity check enforces that every
 * referenced specialty has a translation.
 */
export type Specialty =
  | "cardiology"
  | "nephrology"
  | "hematology"
  | "pulmonology"
  | "gastroenterology"
  | "endocrinology"
  | "neurology"
  | "emergency"
  | "internal_medicine"
  | "pediatrics"
  | "obstetrics"
  | "surgery"
  | "psychiatry"
  | "rheumatology"
  | "dermatology"
  | "oncology"
  | "infectious_diseases"
  | "intensive_care"
  | "pharmacology"
  | "urology"
  | "geriatrics"
  | "anesthesiology"
  | (string & {});

export interface CalcDefinition<Schema extends ZodTypeAny> {
  id: string;
  inputs: Schema;
  formula: (inputs: z.infer<Schema>) => number;
  interpret: (score: number, inputs: z.infer<Schema>) => InterpretResult;
  references: CalcReference[];
  scoreRange: { min: number; max: number };
  i18nKey: string;
  specialty: Specialty;
}
