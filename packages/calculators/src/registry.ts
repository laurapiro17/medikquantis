import type { CalcDefinition } from "./types";

import { calculator as cha2ds2vasc } from "./cha2ds2vasc";
import { calculator as hasbled } from "./hasbled";
import { calculator as orbit } from "./orbit";
import { calculator as ehra } from "./ehra";
import { calculator as heart } from "./heart";
import { calculator as grace } from "./grace";
import { calculator as timi } from "./timi";
import { calculator as nyha } from "./nyha";
import { calculator as ckdEpi2021 } from "./ckd-epi-2021";
import { calculator as wellsPe } from "./wells-pe";
import { calculator as meld3 } from "./meld-3";
import { calculator as perc } from "./perc";
import { calculator as qsofa } from "./qsofa";

// `any` here is intentional: CalcDefinition is contravariant in its Schema
// generic (the formula/interpret functions accept inputs typed by Schema),
// so the precise per-calc schemas are not assignable to a narrower base
// type. Runtime safety is preserved by Zod's safeParse at the API boundary.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyCalc = CalcDefinition<any>;

const registry: Record<string, AnyCalc> = {
  cha2ds2vasc,
  hasbled,
  orbit,
  ehra,
  heart,
  grace,
  timi,
  nyha,
  "ckd-epi-2021": ckdEpi2021,
  "wells-pe": wellsPe,
  "meld-3": meld3,
  perc,
  qsofa,
};

export function getCalc(id: string): AnyCalc | undefined {
  return registry[id];
}

export function listCalcs(): AnyCalc[] {
  return Object.values(registry);
}

export function listCalcIds(): string[] {
  return Object.keys(registry);
}
