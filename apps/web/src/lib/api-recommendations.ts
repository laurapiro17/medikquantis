export type ApiLang = "en" | "es" | "ca";

export const SUPPORTED_LANGS: readonly ApiLang[] = ["en", "es", "ca"] as const;

export function parseLang(input: string | null | undefined): ApiLang {
  if (input === "es" || input === "ca") return input;
  return "en";
}

type Translations = Record<ApiLang, string>;

const recommendations: Record<string, Translations> = {
  // CHA2DS2-VASc
  CHA2DS2VASC_OAC_NOT_RECOMMENDED: {
    en: "Oral anticoagulation not recommended.",
    es: "No se recomienda anticoagulación oral.",
    ca: "No es recomana anticoagulació oral.",
  },
  CHA2DS2VASC_OAC_CONSIDERED_IIA: {
    en: "Oral anticoagulation should be considered (ESC Class IIa).",
    es: "Debe considerarse anticoagulación oral (ESC clase IIa).",
    ca: "Cal considerar l'anticoagulació oral (ESC classe IIa).",
  },
  CHA2DS2VASC_OAC_RECOMMENDED_I: {
    en: "Oral anticoagulation is recommended (ESC Class I).",
    es: "Se recomienda anticoagulación oral (ESC clase I).",
    ca: "Es recomana anticoagulació oral (ESC classe I).",
  },

  // HAS-BLED
  HASBLED_LOW_OAC_OK: {
    en: "Low bleeding risk; anticoagulation is not precluded.",
    es: "Riesgo hemorrágico bajo; la anticoagulación no está contraindicada.",
    ca: "Risc hemorràgic baix; l'anticoagulació no està contraindicada.",
  },
  HASBLED_ELEVATED_REVIEW: {
    en: "Elevated bleeding risk — review reversible factors, monitor closely.",
    es: "Riesgo hemorrágico elevado — revise los factores reversibles y monitorice estrechamente.",
    ca: "Risc hemorràgic elevat — reviseu els factors reversibles i monitoritzeu de prop.",
  },
  HASBLED_HIGH_CLOSE_FOLLOWUP: {
    en: "High bleeding risk — closer follow-up required; reassess reversible factors.",
    es: "Riesgo hemorrágico alto — se requiere seguimiento estrecho; reevalúe los factores reversibles.",
    ca: "Risc hemorràgic alt — cal seguiment estret; reavalueu els factors reversibles.",
  },

  // ORBIT
  ORBIT_LOW_OAC_OK: {
    en: "Low bleeding risk; anticoagulation is not precluded.",
    es: "Riesgo hemorrágico bajo; la anticoagulación no está contraindicada.",
    ca: "Risc hemorràgic baix; l'anticoagulació no està contraindicada.",
  },
  ORBIT_MEDIUM_REVIEW: {
    en: "Medium bleeding risk — review reversible factors and follow up closely.",
    es: "Riesgo hemorrágico medio — revise los factores reversibles y haga seguimiento estrecho.",
    ca: "Risc hemorràgic mitjà — reviseu els factors reversibles i feu seguiment estret.",
  },
  ORBIT_HIGH_CLOSE_FOLLOWUP: {
    en: "High bleeding risk — close follow-up required; address modifiable factors.",
    es: "Riesgo hemorrágico alto — se requiere seguimiento estrecho; aborde los factores modificables.",
    ca: "Risc hemorràgic alt — cal seguiment estret; aborda els factors modificables.",
  },

  // EHRA
  EHRA_I_NO_SYMPTOMS: {
    en: "No symptoms; symptom-directed therapy not required.",
    es: "Sin síntomas; no se requiere terapia dirigida a síntomas.",
    ca: "Sense símptomes; no cal teràpia dirigida a símptomes.",
  },
  EHRA_IIA_MILD: {
    en: "Mild symptoms; daily activity not affected. Symptom-directed therapy not generally required.",
    es: "Síntomas leves; sin afectación de la actividad diaria. En general no se requiere terapia dirigida a síntomas.",
    ca: "Símptomes lleus; sense afectació de l'activitat diària. En general no cal teràpia dirigida a símptomes.",
  },
  EHRA_IIB_MODERATE: {
    en: "Moderate symptoms causing patient distress; consider rate or rhythm control.",
    es: "Síntomas moderados que causan molestia al paciente; considere control de frecuencia o de ritmo.",
    ca: "Símptomes moderats que causen malestar al pacient; considereu control de freqüència o de ritme.",
  },
  EHRA_III_SEVERE: {
    en: "Severe symptoms affecting daily activity; rhythm control strongly recommended.",
    es: "Síntomas graves que afectan la actividad diaria; se recomienda firmemente el control del ritmo.",
    ca: "Símptomes greus que afecten l'activitat diària; es recomana fermament el control del ritme.",
  },
  EHRA_IV_DISABLING: {
    en: "Disabling symptoms; daily activity discontinued. Urgent rhythm-control intervention indicated.",
    es: "Síntomas incapacitantes; actividad diaria interrumpida. Está indicada una intervención urgente de control del ritmo.",
    ca: "Símptomes incapacitants; activitat diària interrompuda. Cal una intervenció urgent de control del ritme.",
  },

  // HEART
  HEART_LOW_DISCHARGE: {
    en: "Low 6-week MACE risk; discharge with outpatient follow-up is reasonable.",
    es: "Riesgo bajo de MACE a 6 semanas; el alta con seguimiento ambulatorio es razonable.",
    ca: "Risc baix de MACE a 6 setmanes; l'alta amb seguiment ambulatori és raonable.",
  },
  HEART_INTERMEDIATE_ADMIT: {
    en: "Intermediate risk; admit for observation and serial troponins.",
    es: "Riesgo intermedio; ingrese para observación y troponinas seriadas.",
    ca: "Risc intermedi; ingresseu per observació i troponines seriades.",
  },
  HEART_HIGH_INVASIVE: {
    en: "High risk; early invasive strategy and cardiology consult recommended.",
    es: "Riesgo alto; se recomienda estrategia invasiva precoz e interconsulta a cardiología.",
    ca: "Risc alt; es recomana estratègia invasiva precoç i interconsulta a cardiologia.",
  },

  // GRACE
  GRACE_LOW_SELECTIVE: {
    en: "Low in-hospital mortality risk; selective invasive strategy if symptoms recur.",
    es: "Riesgo bajo de mortalidad hospitalaria; estrategia invasiva selectiva si recurren los síntomas.",
    ca: "Risc baix de mortalitat hospitalària; estratègia invasiva selectiva si recurren els símptomes.",
  },
  GRACE_INTERMEDIATE_EARLY: {
    en: "Intermediate risk; early invasive strategy recommended (within 24h).",
    es: "Riesgo intermedio; se recomienda estrategia invasiva precoz (en menos de 24 h).",
    ca: "Risc intermedi; es recomana estratègia invasiva precoç (en menys de 24 h).",
  },
  GRACE_HIGH_URGENT: {
    en: "High risk; urgent invasive strategy (<2h) and cardiology referral.",
    es: "Riesgo alto; estrategia invasiva urgente (<2 h) y derivación a cardiología.",
    ca: "Risc alt; estratègia invasiva urgent (<2 h) i derivació a cardiologia.",
  },

  // TIMI
  TIMI_LOW_CONSERVATIVE: {
    en: "Low 14-day MACE risk; conservative strategy is reasonable.",
    es: "Riesgo bajo de MACE a 14 días; la estrategia conservadora es razonable.",
    ca: "Risc baix de MACE a 14 dies; l'estratègia conservadora és raonable.",
  },
  TIMI_INTERMEDIATE_EARLY: {
    en: "Intermediate risk; early invasive strategy should be considered.",
    es: "Riesgo intermedio; debe considerarse estrategia invasiva precoz.",
    ca: "Risc intermedi; cal considerar estratègia invasiva precoç.",
  },
  TIMI_HIGH_URGENT: {
    en: "High risk; urgent invasive strategy and cardiology referral.",
    es: "Riesgo alto; estrategia invasiva urgente y derivación a cardiología.",
    ca: "Risc alt; estratègia invasiva urgent i derivació a cardiologia.",
  },

  // NYHA
  NYHA_I_NO_SYMPTOMS: {
    en: "No symptoms with ordinary activity; continue guideline-directed medical therapy if HFrEF.",
    es: "Sin síntomas con la actividad ordinaria; continúe terapia médica óptima según guías si IC-FEr.",
    ca: "Sense símptomes amb l'activitat ordinària; continueu teràpia mèdica òptima segons guies si IC-FEr.",
  },
  NYHA_II_SLIGHT_LIMITATION: {
    en: "Slight limitation with ordinary activity; ensure quadruple therapy (ARNI/ACEi + BB + MRA + SGLT2i) if HFrEF.",
    es: "Ligera limitación con la actividad ordinaria; asegure cuádruple terapia (ARNI/IECA + BB + ARM + iSGLT2) si IC-FEr.",
    ca: "Lleugera limitació amb l'activitat ordinària; assegureu quàdruple teràpia (ARNI/IECA + BB + ARM + iSGLT2) si IC-FEr.",
  },
  NYHA_III_MARKED_LIMITATION: {
    en: "Marked limitation with less-than-ordinary activity; optimize therapy and consider CRT/ICD per LVEF and QRS.",
    es: "Limitación marcada con actividad menor de la ordinaria; optimice la terapia y considere TRC/DAI según FEVI y QRS.",
    ca: "Limitació marcada amb activitat menor de l'ordinària; optimitzeu la teràpia i considereu TRC/DAI segons FEVI i QRS.",
  },
  NYHA_IV_REST_SYMPTOMS: {
    en: "Symptoms at rest; refer for advanced HF therapies (LVAD, transplant evaluation) and palliative care discussion.",
    es: "Síntomas en reposo; derive para terapias avanzadas de IC (DAV, evaluación de trasplante) y valoración paliativa.",
    ca: "Símptomes en repòs; deriveu per a teràpies avançades d'IC (DAV, avaluació de trasplantament) i valoració pal·liativa.",
  },

  // CKD-EPI 2021
  CKDEPI_G1_NORMAL: {
    en: "Normal or high eGFR; investigate other CKD markers if persistent abnormalities.",
    es: "FGe normal o alto; investigue otros marcadores de ERC si hay alteraciones persistentes.",
    ca: "FGe normal o alt; investigueu altres marcadors d'ERC si hi ha alteracions persistents.",
  },
  CKDEPI_G2_MILD: {
    en: "Mildly decreased eGFR; monitor and address risk factors.",
    es: "FGe ligeramente disminuido; monitorice y aborde los factores de riesgo.",
    ca: "FGe lleugerament disminuït; monitoritzeu i aborda els factors de risc.",
  },
  CKDEPI_G3A_MILD_MODERATE: {
    en: "Mildly to moderately decreased eGFR; evaluate cause, complications and progression risk.",
    es: "FGe disminuido leve a moderadamente; evalúe causa, complicaciones y riesgo de progresión.",
    ca: "FGe disminuït lleu a moderadament; avalueu causa, complicacions i risc de progressió.",
  },
  CKDEPI_G3B_MODERATE_SEVERE: {
    en: "Moderately to severely decreased eGFR; nephrology referral and management of CKD complications.",
    es: "FGe disminuido moderada a gravemente; derivación a nefrología y manejo de complicaciones de ERC.",
    ca: "FGe disminuït moderada a greument; derivació a nefrologia i maneig de complicacions d'ERC.",
  },
  CKDEPI_G4_SEVERE: {
    en: "Severely decreased eGFR; nephrology follow-up, prepare for renal replacement therapy.",
    es: "FGe gravemente disminuido; seguimiento por nefrología, prepare terapia de reemplazo renal.",
    ca: "FGe greument disminuït; seguiment per nefrologia, prepareu teràpia de reemplaçament renal.",
  },
  CKDEPI_G5_FAILURE: {
    en: "Kidney failure; renal replacement therapy (dialysis or transplant) indicated.",
    es: "Insuficiencia renal; está indicada terapia de reemplazo renal (diálisis o trasplante).",
    ca: "Insuficiència renal; està indicada teràpia de reemplaçament renal (diàlisi o trasplantament).",
  },

  // Wells PE
  WELLSPE_UNLIKELY_DDIMER: {
    en: "PE unlikely; obtain D-dimer. If negative, pulmonary embolism is excluded.",
    es: "TEP improbable; solicite dímero D. Si es negativo, se excluye el tromboembolismo pulmonar.",
    ca: "TEP improbable; sol·liciteu dímer D. Si és negatiu, s'exclou el tromboembolisme pulmonar.",
  },
  WELLSPE_LIKELY_CTPA: {
    en: "PE likely; proceed directly to CT pulmonary angiography (no need for D-dimer).",
    es: "TEP probable; proceda directamente a angio-TC pulmonar (no es necesario dímero D).",
    ca: "TEP probable; procediu directament a angio-TC pulmonar (no cal dímer D).",
  },

  // MELD 3.0
  MELD3_LOW_OUTPATIENT: {
    en: "Low 3-month mortality; outpatient hepatology follow-up.",
    es: "Baja mortalidad a 3 meses; seguimiento ambulatorio por hepatología.",
    ca: "Baixa mortalitat a 3 mesos; seguiment ambulatori per hepatologia.",
  },
  MELD3_INTERMEDIATE_TRANSPLANT_EVAL: {
    en: "Intermediate 3-month mortality; intensify hepatology follow-up, evaluate transplant candidacy.",
    es: "Mortalidad intermedia a 3 meses; intensifique el seguimiento por hepatología y evalúe candidatura a trasplante.",
    ca: "Mortalitat intermèdia a 3 mesos; intensifiqueu el seguiment per hepatologia i avalueu candidatura a trasplantament.",
  },
  MELD3_HIGH_TRANSPLANT_PRIORITY: {
    en: "High 3-month mortality; prioritise transplant evaluation and address acute complications.",
    es: "Alta mortalidad a 3 meses; priorice la evaluación de trasplante y aborde las complicaciones agudas.",
    ca: "Alta mortalitat a 3 mesos; prioritzeu l'avaluació de trasplantament i aborda les complicacions agudes.",
  },

  // PERC
  PERC_NEGATIVE_RULEOUT: {
    en: "PERC-negative: in a low pre-test probability patient (<15%), PE can be ruled out without further testing.",
    es: "PERC negativo: en un paciente con baja probabilidad pretest (<15%), se puede descartar TEP sin pruebas adicionales.",
    ca: "PERC negatiu: en un pacient amb baixa probabilitat pretest (<15%), es pot descartar TEP sense proves addicionals.",
  },
  PERC_POSITIVE_FURTHER_WORKUP: {
    en: "PERC-positive: do NOT use PERC to rule out PE. Proceed with D-dimer or imaging depending on pre-test probability.",
    es: "PERC positivo: NO use PERC para descartar TEP. Proceda con dímero D o imagen según la probabilidad pretest.",
    ca: "PERC positiu: NO useu PERC per descartar TEP. Procediu amb dímer D o imatge segons la probabilitat pretest.",
  },

  // qSOFA
  QSOFA_HIGH_SEPSIS_SUSPECT: {
    en: "qSOFA ≥2: high suspicion of sepsis-related organ dysfunction. Escalate care, consider full SOFA, lactate, blood cultures, antibiotics.",
    es: "qSOFA ≥2: alta sospecha de disfunción orgánica relacionada con sepsis. Escale los cuidados, considere SOFA completo, lactato, hemocultivos y antibióticos.",
    ca: "qSOFA ≥2: alta sospita de disfunció orgànica relacionada amb sèpsia. Escaleu les cures, considereu SOFA complet, lactat, hemocultius i antibiòtics.",
  },
  QSOFA_MODERATE_VIGILANCE: {
    en: "Single criterion positive; reassess vital signs serially and remain alert for deterioration.",
    es: "Un único criterio positivo; reevalúe las constantes vitales de forma seriada y manténgase alerta ante un deterioro.",
    ca: "Un únic criteri positiu; reavalueu les constants vitals de manera seriada i mantingueu-vos alerta davant d'un deteriorament.",
  },
  QSOFA_LOW_ROUTINE: {
    en: "No qSOFA criteria; low immediate concern for organ dysfunction. Continue routine assessment.",
    es: "Sin criterios qSOFA; baja preocupación inmediata por disfunción orgánica. Continúe con la evaluación rutinaria.",
    ca: "Sense criteris qSOFA; baixa preocupació immediata per disfunció orgànica. Continueu amb l'avaluació rutinària.",
  },
};

/**
 * Translate a recommendation code into the requested language.
 * Falls back to the English string carried by interpret() if the code is
 * unknown (defensive — should never trigger if registry + codes stay in sync).
 */
export function translateRecommendation(
  code: string,
  lang: ApiLang,
  fallbackEn: string,
): string {
  const entry = recommendations[code];
  if (!entry) return fallbackEn;
  return entry[lang] ?? entry.en;
}

export function listRecommendationCodes(): string[] {
  return Object.keys(recommendations);
}
