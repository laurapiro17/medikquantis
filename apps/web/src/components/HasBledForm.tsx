"use client";

import { DynamicCalcForm } from "./DynamicCalcForm";

export function HasBledForm() {
  return (
    <DynamicCalcForm
      calcId="hasbled"
      riskLabelKey="common.annual_bleeding_risk"
    />
  );
}

