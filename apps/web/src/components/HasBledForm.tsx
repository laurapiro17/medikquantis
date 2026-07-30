"use client";

import { hasbled } from "@medcalc/calculators";
import { DynamicCalcForm } from "./DynamicCalcForm";

export function HasBledForm() {
  return (
    <DynamicCalcForm
      calculator={hasbled.calculator}
      riskLabelKey="common.annual_bleeding_risk"
    />
  );
}

