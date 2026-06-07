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
import { calculator as curb65 } from "./curb65";
import { calculator as gcs } from "./gcs";
import { calculator as centor } from "./centor";
import { calculator as calciumCorrected } from "./calcium-corrected";
import { calculator as sodiumCorrected } from "./sodium-corrected";
import { calculator as harrisBenedict } from "./harris-benedict";
import { calculator as psaDensity } from "./psa-density";
import { calculator as charlson } from "./charlson";
import { calculator as alvarado } from "./alvarado";
import { calculator as lrinec } from "./lrinec";
import { calculator as pittBacteremia } from "./pitt-bacteremia";
import { calculator as rcri } from "./rcri";
import { calculator as norton } from "./norton";
import { calculator as braden } from "./braden";
import { calculator as barthel } from "./barthel";
import { calculator as findrisc } from "./findrisc";
import { calculator as ipss } from "./ipss";
import { calculator as basdai } from "./basdai";
import { calculator as das28 } from "./das28";
import { calculator as pasi } from "./pasi";
import { calculator as scorad } from "./scorad";
import { calculator as dukeEndocarditis } from "./duke-endocarditis";
import { calculator as hinchey } from "./hinchey";
import { calculator as anionGap } from "./anion-gap";
import { calculator as fena } from "./fena";
import { calculator as asaPs } from "./asa-ps";
import { calculator as caprini } from "./caprini";
import { calculator as wellsDvt } from "./wells-dvt";
import { calculator as childPugh } from "./child-pugh";
import { calculator as glasgowBlatchford } from "./glasgow-blatchford";
import { calculator as score2 } from "./score2";
import { calculator as ascvd } from "./ascvd";
import { calculator as sofa } from "./sofa";
import { calculator as apache2 } from "./apache2";
import { calculator as nihss } from "./nihss";

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
  "curb-65": curb65,
  gcs,
  centor,
  "calcium-corrected": calciumCorrected,
  "sodium-corrected": sodiumCorrected,
  "harris-benedict": harrisBenedict,
  "psa-density": psaDensity,
  charlson,
  alvarado,
  lrinec,
  "pitt-bacteremia": pittBacteremia,
  rcri,
  norton,
  braden,
  barthel,
  findrisc,
  ipss,
  basdai,
  das28,
  pasi,
  scorad,
  "duke-endocarditis": dukeEndocarditis,
  hinchey,
  "anion-gap": anionGap,
  fena,
  "asa-ps": asaPs,
  caprini,
  "wells-dvt": wellsDvt,
  "child-pugh": childPugh,
  "glasgow-blatchford": glasgowBlatchford,
  score2,
  ascvd,
  sofa,
  "apache-2": apache2,
  nihss,
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
