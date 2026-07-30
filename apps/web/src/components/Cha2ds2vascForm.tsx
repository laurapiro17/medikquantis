"use client";

import { cha2ds2vasc } from "@medcalc/calculators";
import { DynamicCalcForm } from "./DynamicCalcForm";

export function Cha2ds2vascForm() {
  return <DynamicCalcForm calculator={cha2ds2vasc.calculator} />;
}

