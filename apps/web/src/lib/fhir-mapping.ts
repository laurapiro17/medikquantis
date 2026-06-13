// Pure mapping from FHIR R4 resources → CHA₂DS₂-VASc inputs. Kept dependency-
// free and side-effect-free so it can be unit-tested without a FHIR client or a
// browser. Best-effort (prototype): condition matching uses ICD-10 code
// prefixes + SNOMED codes + display/text keywords. A clinician must always
// review the detected factors — coded problem lists are incomplete and noisy.

export interface FhirCoding {
  system?: string;
  code?: string;
  display?: string;
}
export interface FhirCodeableConcept {
  coding?: FhirCoding[];
  text?: string;
}
export interface FhirPatient {
  birthDate?: string;
  gender?: string;
}
export interface FhirCondition {
  code?: FhirCodeableConcept;
}

export interface Cha2ds2vascInputs {
  age: number;
  sex: "male" | "female";
  chf: boolean;
  hypertension: boolean;
  diabetes: boolean;
  strokeOrTia: boolean;
  vascularDisease: boolean;
}

export interface MappingResult {
  inputs: Cha2ds2vascInputs;
  // Human-readable evidence per detected risk factor (the condition text that
  // triggered it), so the clinician can verify the mapping.
  matched: Partial<Record<keyof Cha2ds2vascInputs, string[]>>;
}

type Flag =
  | "chf"
  | "hypertension"
  | "diabetes"
  | "strokeOrTia"
  | "vascularDisease";

interface Rule {
  flag: Flag;
  // Lowercased substrings matched against the condition display/text.
  keywords: string[];
  // ICD-10 code prefixes (case-insensitive).
  icd10: string[];
  // Exact SNOMED CT codes.
  snomed: string[];
}

const RULES: Rule[] = [
  {
    flag: "chf",
    keywords: ["heart failure", "cardiac failure", "insuficiencia cardiaca"],
    icd10: ["I50"],
    snomed: ["84114007", "42343007"],
  },
  {
    flag: "hypertension",
    keywords: ["hypertension", "hypertensive", "high blood pressure"],
    icd10: ["I10", "I11", "I12", "I13", "I15"],
    snomed: ["38341003", "59621000"],
  },
  {
    flag: "diabetes",
    keywords: ["diabetes", "diabetic"],
    icd10: ["E08", "E09", "E10", "E11", "E13"],
    snomed: ["73211009", "44054006", "46635009"],
  },
  {
    flag: "strokeOrTia",
    keywords: [
      "stroke",
      "cerebral infarction",
      "cerebrovascular accident",
      "transient ischemic",
      "transient ischaemic",
      "tia",
      "thromboembolism",
    ],
    icd10: ["I63", "I64", "G45"],
    snomed: ["230690007", "266257000", "422504002"],
  },
  {
    flag: "vascularDisease",
    keywords: [
      "myocardial infarction",
      "coronary artery disease",
      "peripheral arterial",
      "peripheral vascular",
      "aortic plaque",
      "atherosclerosis",
    ],
    icd10: ["I21", "I22", "I25", "I70", "I73"],
    snomed: ["22298006", "399957001", "400047006"],
  },
];

const ICD10_SYSTEM = "icd-10";
const SNOMED_SYSTEM = "snomed";

/** Whole years between birthDate and `asOf` (defaults required — pass it in). */
export function ageFromBirthDate(birthDate: string, asOf: Date): number {
  const dob = new Date(birthDate);
  let age = asOf.getFullYear() - dob.getFullYear();
  const m = asOf.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && asOf.getDate() < dob.getDate())) age -= 1;
  return age;
}

// Word-boundary match, NOT substring: short keywords like "tia" must not match
// inside "essential" (which would falsely flag a prior stroke/TIA). Keywords
// contain only letters/spaces, so escaping is minimal but kept for safety.
function keywordHit(haystack: string, kw: string): boolean {
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`).test(haystack);
}

function conditionMatchesRule(c: FhirCondition, rule: Rule): string | null {
  const text = (c.code?.text ?? "").toLowerCase();
  const codings = c.code?.coding ?? [];

  for (const kw of rule.keywords) {
    if (keywordHit(text, kw)) return c.code?.text ?? kw;
    for (const coding of codings) {
      if (keywordHit((coding.display ?? "").toLowerCase(), kw)) {
        return coding.display ?? kw;
      }
    }
  }
  for (const coding of codings) {
    const sys = (coding.system ?? "").toLowerCase();
    const code = (coding.code ?? "").toUpperCase();
    if (sys.includes(ICD10_SYSTEM)) {
      if (rule.icd10.some((p) => code.startsWith(p))) {
        return coding.display ?? `${coding.code}`;
      }
    }
    if (sys.includes(SNOMED_SYSTEM)) {
      if (rule.snomed.includes(coding.code ?? "")) {
        return coding.display ?? `${coding.code}`;
      }
    }
  }
  return null;
}

export function mapToCha2ds2vasc(
  patient: FhirPatient,
  conditions: FhirCondition[],
  asOf: Date,
): MappingResult {
  const age = patient.birthDate
    ? ageFromBirthDate(patient.birthDate, asOf)
    : 0;
  const sex: "male" | "female" =
    (patient.gender ?? "").toLowerCase() === "female" ? "female" : "male";

  const inputs: Cha2ds2vascInputs = {
    age,
    sex,
    chf: false,
    hypertension: false,
    diabetes: false,
    strokeOrTia: false,
    vascularDisease: false,
  };
  const matched: MappingResult["matched"] = {};

  for (const c of conditions) {
    for (const rule of RULES) {
      const hit = conditionMatchesRule(c, rule);
      if (hit) {
        inputs[rule.flag] = true;
        (matched[rule.flag] ??= []).push(hit);
      }
    }
  }

  return { inputs, matched };
}

// Same base64url encoding the share permalink uses, so we can hand the mapped
// inputs to the calculator via its existing ?p= round-trip.
export function encodeInputsParam(inputs: Cha2ds2vascInputs): string {
  const json = JSON.stringify(inputs);
  const b64 =
    typeof btoa === "function"
      ? btoa(json)
      : Buffer.from(json, "utf8").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
