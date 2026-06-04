import type { ZodTypeAny, z } from "zod";

export type RiskTier = "low" | "moderate" | "high";

export type EvidenceGrade = "A" | "B" | "C";

export interface InterpretResult {
  tier: RiskTier;
  recommendation: string;
  evidenceGrade: EvidenceGrade;
  annualRiskPercent?: number;
}

export interface CalcReference {
  pmid: string;
  citation: string;
}

export interface CalcDefinition<Schema extends ZodTypeAny> {
  id: string;
  inputs: Schema;
  formula: (inputs: z.infer<Schema>) => number;
  interpret: (score: number, inputs: z.infer<Schema>) => InterpretResult;
  references: CalcReference[];
  scoreRange: { min: number; max: number };
  i18nKey: string;
}
