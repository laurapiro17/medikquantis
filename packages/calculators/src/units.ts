/**
 * Clinical unit conversion utilities.
 * Bi-directional conversions between US conventional and SI metric units.
 */

/** Convert Glucose from mg/dL to mmol/L */
export function glucoseMgDlToMmolL(mgDl: number): number {
  return Math.round((mgDl / 18.018) * 100) / 100;
}

/** Convert Glucose from mmol/L to mg/dL */
export function glucoseMmolLToMgDl(mmolL: number): number {
  return Math.round(mmolL * 18.018 * 10) / 10;
}

/** Convert Creatinine from mg/dL to µmol/L */
export function creatinineMgDlToUmolL(mgDl: number): number {
  return Math.round(mgDl * 88.4 * 10) / 10;
}

/** Convert Creatinine from µmol/L to mg/dL */
export function creatinineUmolLToMgDl(umolL: number): number {
  return Math.round((umolL / 88.4) * 100) / 100;
}

/** Convert Calcium from mg/dL to mmol/L */
export function calciumMgDlToMmolL(mgDl: number): number {
  return Math.round((mgDl / 4) * 100) / 100;
}

/** Convert Calcium from mmol/L to mg/dL */
export function calciumMmolLToMgDl(mmolL: number): number {
  return Math.round(mmolL * 4 * 100) / 100;
}

/** Convert Bilirubin from mg/dL to µmol/L */
export function bilirubinMgDlToUmolL(mgDl: number): number {
  return Math.round(mgDl * 17.1 * 10) / 10;
}

/** Convert Bilirubin from µmol/L to mg/dL */
export function bilirubinUmolLToMgDl(umolL: number): number {
  return Math.round((umolL / 17.1) * 100) / 100;
}

/** Convert Albumin from g/dL to g/L */
export function albuminGDlToGL(gDl: number): number {
  return Math.round(gDl * 10 * 10) / 10;
}

/** Convert Albumin from g/L to g/dL */
export function albuminGLToGDl(gL: number): number {
  return Math.round((gL / 10) * 10) / 10;
}

/** Convert BUN (mg/dL) to Urea (mmol/L) */
export function bunMgDlToUreaMmolL(mgDl: number): number {
  return Math.round((mgDl / 2.8) * 100) / 100;
}

/** Convert Urea (mmol/L) to BUN (mg/dL) */
export function ureaMmolLToBunMgDl(mmolL: number): number {
  return Math.round(mmolL * 2.8 * 10) / 10;
}

/** Convert Weight from lbs to kg */
export function lbsToKg(lbs: number): number {
  return Math.round((lbs / 2.20462) * 10) / 10;
}

/** Convert Weight from kg to lbs */
export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

/** Convert Height from inches to cm */
export function inchesToCm(inches: number): number {
  return Math.round(inches * 2.54 * 10) / 10;
}

/** Convert Height from cm to inches */
export function cmToInches(cm: number): number {
  return Math.round((cm / 2.54) * 10) / 10;
}
