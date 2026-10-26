export type ApiLang = "en" | "es" | "ca";

export const SUPPORTED_LANGS: readonly ApiLang[] = ["en", "es", "ca"] as const;

export function parseLang(input: string | null | undefined): ApiLang {
  if (input === "es" || input === "ca") return input;
  return "en";
}

type Translations = Record<ApiLang, string>;

const recommendations: Record<string, Translations> = {
  YBOCS_SUBCLINICAL: {
    en: "Subclinical obsessive-compulsive symptom severity (0-7). This score alone does not exclude OCD.",
    es: "Síntomas obsesivo-compulsivos de gravedad subclínica (0-7). La puntuación por sí sola no descarta el TOC.",
    ca: "Símptomes obsessivocompulsius de gravetat subclínica (0-7). La puntuació per si sola no descarta el TOC.",
  },
  YBOCS_MILD: {
    en: "Mild obsessive-compulsive symptom severity (8-15). Interpret within a full clinical assessment.",
    es: "Síntomas obsesivo-compulsivos de gravedad leve (8-15). Interpretar en una valoración clínica completa.",
    ca: "Símptomes obsessivocompulsius de gravetat lleu (8-15). Cal interpretar-los en una valoració clínica completa.",
  },
  YBOCS_MODERATE: {
    en: "Moderate obsessive-compulsive symptom severity (16-23). Interpret within a full clinical assessment.",
    es: "Síntomas obsesivo-compulsivos de gravedad moderada (16-23). Interpretar en una valoración clínica completa.",
    ca: "Símptomes obsessivocompulsius de gravetat moderada (16-23). Cal interpretar-los en una valoració clínica completa.",
  },
  YBOCS_SEVERE: {
    en: "Severe obsessive-compulsive symptom severity (24-31). Interpret within a full clinical assessment.",
    es: "Síntomas obsesivo-compulsivos graves (24-31). Interpretar en una valoración clínica completa.",
    ca: "Símptomes obsessivocompulsius greus (24-31). Cal interpretar-los en una valoració clínica completa.",
  },
  YBOCS_EXTREME: {
    en: "Extreme obsessive-compulsive symptom severity (32-40). Interpret within a full clinical assessment.",
    es: "Síntomas obsesivo-compulsivos de gravedad extrema (32-40). Interpretar en una valoración clínica completa.",
    ca: "Símptomes obsessivocompulsius de gravetat extrema (32-40). Cal interpretar-los en una valoració clínica completa.",
  },
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

  // CURB-65
  CURB65_LOW_OUTPATIENT: {
    en: "Low 30-day mortality; outpatient treatment is usually appropriate.",
    es: "Mortalidad baja a 30 días; el tratamiento ambulatorio suele ser adecuado.",
    ca: "Mortalitat baixa a 30 dies; el tractament ambulatori sol ser adequat.",
  },
  CURB65_INTERMEDIATE_WARD: {
    en: "Intermediate risk; consider hospital admission for short observation.",
    es: "Riesgo intermedio; considere el ingreso hospitalario para una observación breve.",
    ca: "Risc intermedi; considereu l'ingrés hospitalari per a una observació breu.",
  },
  CURB65_SEVERE_ICU: {
    en: "Severe pneumonia; admit and consider intensive care evaluation.",
    es: "Neumonía grave; ingrese al paciente y valore el ingreso en cuidados intensivos.",
    ca: "Pneumònia greu; ingresseu el pacient i valoreu l'ingrés a cures intensives.",
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

  // Calcium corrected (Payne)
  CA_CORR_HYPO: {
    en: "Corrected calcium below normal range; evaluate symptoms (Chvostek, Trousseau, tetany) and consider replacement.",
    es: "Calcio corregido por debajo del rango normal; evalúe síntomas (Chvostek, Trousseau, tetania) y considere la reposición.",
    ca: "Calci corregit per sota del rang normal; avalueu símptomes (Chvostek, Trousseau, tetània) i considereu la reposició.",
  },
  CA_CORR_NORMAL: {
    en: "Corrected calcium within reference range (8.5–10.5 mg/dL).",
    es: "Calcio corregido dentro del rango de referencia (8,5–10,5 mg/dL).",
    ca: "Calci corregit dins del rang de referència (8,5–10,5 mg/dL).",
  },
  CA_CORR_HYPER: {
    en: "Corrected calcium above normal range; investigate causes (PTH, malignancy, vitamin D) and severity.",
    es: "Calcio corregido por encima del rango normal; investigue causas (PTH, malignidad, vitamina D) y gravedad.",
    ca: "Calci corregit per sobre del rang normal; investigueu causes (PTH, malignitat, vitamina D) i gravetat.",
  },

  // Sodium corrected (Katz)
  NA_CORR_HYPO: {
    en: "Corrected sodium suggests true hyponatraemia; classify by tonicity and volume status before treating.",
    es: "El sodio corregido sugiere hiponatremia verdadera; clasifíquela por tonicidad y estado de volumen antes de tratar.",
    ca: "El sodi corregit suggereix hiponatrèmia veritable; classifiqueu-la per tonicitat i estat de volum abans de tractar.",
  },
  NA_CORR_NORMAL: {
    en: "Corrected sodium within reference range; observed hyponatraemia is fully explained by hyperglycaemia.",
    es: "Sodio corregido dentro del rango de referencia; la hiponatremia observada se explica completamente por la hiperglucemia.",
    ca: "Sodi corregit dins del rang de referència; la hiponatrèmia observada s'explica completament per la hiperglucèmia.",
  },
  NA_CORR_HYPER: {
    en: "Corrected sodium suggests hypernatraemia; assess water deficit and free-water replacement plan.",
    es: "El sodio corregido sugiere hipernatremia; evalúe el déficit de agua y el plan de reposición de agua libre.",
    ca: "El sodi corregit suggereix hipernatrèmia; avalueu el dèficit d'aigua i el pla de reposició d'aigua lliure.",
  },

  // Harris-Benedict
  HB_TDEE_INFO: {
    en: "Estimated basal metabolic rate and total daily energy expenditure at the chosen activity level.",
    es: "Tasa metabólica basal estimada y gasto energético diario total al nivel de actividad elegido.",
    ca: "Taxa metabòlica basal estimada i despesa energètica diària total al nivell d'activitat triat.",
  },

  // PSA density (Benson)
  PSA_DENS_ELEVATED: {
    en: "PSA density above the 0.15 ng/mL/cc threshold; biopsy is more strongly supported, especially in the 4-10 ng/mL grey zone.",
    es: "Densidad de PSA por encima del umbral de 0,15 ng/mL/cc; la biopsia se apoya con más fuerza, sobre todo en la zona gris de 4–10 ng/mL.",
    ca: "Densitat de PSA per sobre del llindar de 0,15 ng/mL/cc; la biòpsia es recolza amb més força, sobretot a la zona grisa de 4–10 ng/mL.",
  },
  PSA_DENS_LOW: {
    en: "PSA density at or below 0.15 ng/mL/cc; PSA elevation more likely explained by benign prostatic enlargement.",
    es: "Densidad de PSA igual o inferior a 0,15 ng/mL/cc; la elevación del PSA se explica más probablemente por hiperplasia benigna.",
    ca: "Densitat de PSA igual o inferior a 0,15 ng/mL/cc; l'elevació del PSA s'explica més probablement per hiperplàsia benigna.",
  },


  // Charlson
  CHARLSON_LOW: {
    en: "Low comorbidity burden; expected 10-year survival above 90%.",
    es: "Carga de comorbilidad baja; supervivencia esperada a 10 años superior al 90%.",
    ca: "Càrrega de comorbiditat baixa; supervivència esperada a 10 anys superior al 90%.",
  },
  CHARLSON_MODERATE: {
    en: "Moderate comorbidity burden; meaningful impact on 10-year survival.",
    es: "Carga de comorbilidad moderada; impacto significativo en la supervivencia a 10 años.",
    ca: "Càrrega de comorbiditat moderada; impacte significatiu en la supervivència a 10 anys.",
  },
  CHARLSON_HIGH: {
    en: "High comorbidity burden; substantially reduced 10-year survival — weigh aggressive treatments against expected life years.",
    es: "Carga de comorbilidad alta; supervivencia a 10 años sustancialmente reducida — pondere tratamientos agresivos frente a los años esperados.",
    ca: "Càrrega de comorbiditat alta; supervivència a 10 anys substancialment reduïda — pondereu tractaments agressius enfront dels anys esperats.",
  },

  // Alvarado
  ALVARADO_LOW: {
    en: "Appendicitis unlikely; consider discharge with safety-net advice and alternative diagnoses.",
    es: "Apendicitis improbable; considere el alta con instrucciones de seguridad y diagnósticos alternativos.",
    ca: "Apendicitis improbable; considereu l'alta amb instruccions de seguretat i diagnòstics alternatius.",
  },
  ALVARADO_POSSIBLE: {
    en: "Possible appendicitis; admit for observation, serial exams and consider cross-sectional imaging.",
    es: "Apendicitis posible; ingrese para observación, exploraciones seriadas y considere imagen.",
    ca: "Apendicitis possible; ingresseu per observació, exploracions seriades i considereu imatge.",
  },
  ALVARADO_PROBABLE: {
    en: "Probable to very probable appendicitis; surgical consultation and definitive management indicated.",
    es: "Apendicitis probable o muy probable; está indicada interconsulta quirúrgica y manejo definitivo.",
    ca: "Apendicitis probable o molt probable; cal interconsulta quirúrgica i maneig definitiu.",
  },

  // LRINEC
  LRINEC_LOW: {
    en: "Low LRINEC; necrotising fasciitis less likely but NOT ruled out. Clinical assessment overrides the score — proceed to surgical exploration if suspicion is high.",
    es: "LRINEC bajo; la fascitis necrotizante es menos probable pero NO se descarta. El juicio clínico prevalece sobre la puntuación — proceda a exploración quirúrgica si la sospecha es alta.",
    ca: "LRINEC baix; la fascitis necrotitzant és menys probable però NO es descarta. El judici clínic preval sobre la puntuació — procediu a exploració quirúrgica si la sospita és alta.",
  },
  LRINEC_INTERMEDIATE: {
    en: "Intermediate LRINEC; high suspicion for necrotising fasciitis. Urgent surgical consultation and imaging consideration.",
    es: "LRINEC intermedio; alta sospecha de fascitis necrotizante. Interconsulta quirúrgica urgente y considerar imagen.",
    ca: "LRINEC intermedi; alta sospita de fascitis necrotitzant. Interconsulta quirúrgica urgent i considerar imatge.",
  },
  LRINEC_HIGH: {
    en: "High LRINEC; strong suspicion for necrotising fasciitis. Immediate broad-spectrum antibiotics and surgical exploration without delay.",
    es: "LRINEC alto; fuerte sospecha de fascitis necrotizante. Antibióticos de amplio espectro inmediatos y exploración quirúrgica sin demora.",
    ca: "LRINEC alt; forta sospita de fascitis necrotitzant. Antibiòtics d'ampli espectre immediats i exploració quirúrgica sense demora.",
  },

  // Pitt Bacteraemia
  PITT_LOW: {
    en: "Low Pitt score; mortality risk close to baseline. Standard empirical antibiotic therapy is usually appropriate.",
    es: "Pitt bajo; riesgo de mortalidad cercano al basal. La pauta antibiótica empírica estándar suele ser apropiada.",
    ca: "Pitt baix; risc de mortalitat proper al basal. La pauta antibiòtica empírica estàndard sol ser apropiada.",
  },
  PITT_INTERMEDIATE: {
    en: "Intermediate Pitt score; moderately elevated mortality. Consider infectious-disease consultation and prompt source control.",
    es: "Pitt intermedio; mortalidad moderadamente elevada. Considere interconsulta a infecciosos y control precoz del foco.",
    ca: "Pitt intermedi; mortalitat moderadament elevada. Considereu interconsulta a infecciosos i control precoç del focus.",
  },
  PITT_HIGH: {
    en: "High Pitt score (≥4); markedly elevated 30-day mortality. Urgent escalation: broad-spectrum coverage, source control and ID/ICU input.",
    es: "Pitt alto (≥4); mortalidad a 30 días marcadamente elevada. Escalada urgente: cobertura amplia, control del foco y participación de infecciosos/UCI.",
    ca: "Pitt alt (≥4); mortalitat a 30 dies marcadament elevada. Escalada urgent: cobertura àmplia, control del focus i participació d'infecciosos/UCI.",
  },

  // RCRI
  RCRI_VERY_LOW: {
    en: "Very low cardiac risk (~0.4%); no further cardiac testing usually needed before surgery.",
    es: "Riesgo cardíaco muy bajo (~0,4%); normalmente no se necesitan más pruebas cardíacas antes de la cirugía.",
    ca: "Risc cardíac molt baix (~0,4%); normalment no calen més proves cardíaques abans de la cirurgia.",
  },
  RCRI_LOW: {
    en: "Low cardiac risk (~0.9%); further testing rarely changes management.",
    es: "Riesgo cardíaco bajo (~0,9%); pruebas adicionales rara vez cambian el manejo.",
    ca: "Risc cardíac baix (~0,9%); proves addicionals rarament canvien el maneig.",
  },
  RCRI_INTERMEDIATE: {
    en: "Intermediate cardiac risk (~6.6%); consider functional capacity assessment and selective non-invasive testing if it will change management.",
    es: "Riesgo cardíaco intermedio (~6,6%); considere valorar la capacidad funcional y pruebas no invasivas selectivas si pueden cambiar el manejo.",
    ca: "Risc cardíac intermedi (~6,6%); considereu valorar la capacitat funcional i proves no invasives selectives si poden canviar el maneig.",
  },
  RCRI_HIGH: {
    en: "High cardiac risk (≥11%); structured perioperative optimisation, cardiology input and balanced anaesthesia plan indicated.",
    es: "Riesgo cardíaco alto (≥11%); optimización perioperatoria estructurada, participación de cardiología y plan anestésico equilibrado.",
    ca: "Risc cardíac alt (≥11%); optimització perioperatòria estructurada, participació de cardiologia i pla anestèsic equilibrat.",
  },

  // Norton
  NORTON_LOW: {
    en: "Norton ≥18: low pressure ulcer risk. Standard skin care and reassessment with clinical changes.",
    es: "Norton ≥18: riesgo bajo de úlceras por presión. Cuidados estándar de la piel y reevaluación ante cambios clínicos.",
    ca: "Norton ≥18: risc baix d'úlceres per pressió. Cures estàndard de la pell i reavaluació davant de canvis clínics.",
  },
  NORTON_MODERATE: {
    en: "Norton 14–17: moderate risk. Implement repositioning schedule, support surface and nutrition review.",
    es: "Norton 14–17: riesgo moderado. Implemente un plan de cambios posturales, superficie de apoyo y revisión nutricional.",
    ca: "Norton 14–17: risc moderat. Implementeu un pla de canvis posturals, superfície de suport i revisió nutricional.",
  },
  NORTON_HIGH: {
    en: "Norton ≤13: high risk. Pressure-redistribution mattress, ≤2-hour repositioning and daily skin inspection.",
    es: "Norton ≤13: riesgo alto. Colchón de redistribución de presión, cambios posturales cada ≤2 h e inspección cutánea diaria.",
    ca: "Norton ≤13: risc alt. Matalàs de redistribució de pressió, canvis posturals cada ≤2 h i inspecció cutània diària.",
  },

  // Braden
  BRADEN_NO_RISK: {
    en: "Braden ≥19: no specific pressure-ulcer prevention needed beyond standard care.",
    es: "Braden ≥19: no se necesita prevención específica de úlceras por presión más allá de los cuidados estándar.",
    ca: "Braden ≥19: no cal prevenció específica d'úlceres per pressió més enllà de les cures estàndard.",
  },
  BRADEN_MILD: {
    en: "Braden 15–18: mild risk. Regular repositioning and skin assessment, address moisture and nutrition.",
    es: "Braden 15–18: riesgo leve. Cambios posturales regulares y valoración cutánea; controle humedad y nutrición.",
    ca: "Braden 15–18: risc lleu. Canvis posturals regulars i valoració cutània; controleu humitat i nutrició.",
  },
  BRADEN_MODERATE: {
    en: "Braden 13–14: moderate risk. Add pressure-redistribution surface; 30° lateral position rotation.",
    es: "Braden 13–14: riesgo moderado. Añada superficie de redistribución de presión; rotación lateral 30°.",
    ca: "Braden 13–14: risc moderat. Afegiu superfície de redistribució de pressió; rotació lateral 30°.",
  },
  BRADEN_HIGH: {
    en: "Braden 10–12: high risk. Specialist mattress, dietetics input, intensify repositioning to ≤2 hours.",
    es: "Braden 10–12: riesgo alto. Colchón especializado, participación de dietética, intensificar cambios posturales a cada ≤2 h.",
    ca: "Braden 10–12: risc alt. Matalàs especialitzat, participació de dietètica, intensificar canvis posturals a cada ≤2 h.",
  },
  BRADEN_VERY_HIGH: {
    en: "Braden ≤9: very high risk. Maximum prevention bundle; tissue viability nurse referral.",
    es: "Braden ≤9: riesgo muy alto. Paquete máximo de prevención; derivación a enfermería de heridas crónicas.",
    ca: "Braden ≤9: risc molt alt. Paquet màxim de prevenció; derivació a infermeria de ferides cròniques.",
  },


  // Barthel
  BARTHEL_INDEPENDENT: {
    en: "Independent in activities of daily living. No specific support required.",
    es: "Independiente en las actividades de la vida diaria. No requiere apoyo específico.",
    ca: "Independent en les activitats de la vida diària. No requereix suport específic.",
  },
  BARTHEL_MILD: {
    en: "Mild dependence; usually able to live alone with minor help.",
    es: "Dependencia leve; habitualmente puede vivir solo con ayuda menor.",
    ca: "Dependència lleu; habitualment pot viure sol amb ajuda menor.",
  },
  BARTHEL_MODERATE: {
    en: "Moderate dependence; benefits from daily personal assistance and rehabilitation.",
    es: "Dependencia moderada; se beneficia de asistencia diaria y rehabilitación.",
    ca: "Dependència moderada; es beneficia d'assistència diària i rehabilitació.",
  },
  BARTHEL_SEVERE: {
    en: "Severe dependence; structured caregiver support and adapted environment required.",
    es: "Dependencia grave; requiere apoyo estructurado de cuidadores y entorno adaptado.",
    ca: "Dependència greu; requereix suport estructurat de cuidadors i entorn adaptat.",
  },
  BARTHEL_TOTAL: {
    en: "Total dependence; full-time care plan and continuing-care planning indicated.",
    es: "Dependencia total; está indicado un plan de cuidados a tiempo completo y planificación de cuidados continuados.",
    ca: "Dependència total; cal un pla de cures a temps complet i planificació de cures continuades.",
  },

  // FINDRISC
  FINDRISC_LOW: {
    en: "Low 10-year diabetes risk. Maintain a healthy lifestyle and reassess in a few years.",
    es: "Riesgo bajo de diabetes a 10 años. Mantenga un estilo de vida saludable y reevalúe en unos años.",
    ca: "Risc baix de diabetis a 10 anys. Mantingueu un estil de vida saludable i reavalueu d'aquí uns anys.",
  },
  FINDRISC_SLIGHTLY_ELEVATED: {
    en: "Slightly elevated 10-year diabetes risk. Reinforce diet, physical activity and weight control.",
    es: "Riesgo de diabetes a 10 años ligeramente elevado. Refuerce dieta, actividad física y control del peso.",
    ca: "Risc de diabetis a 10 anys lleugerament elevat. Reforceu dieta, activitat física i control del pes.",
  },
  FINDRISC_MODERATE: {
    en: "Moderate 10-year diabetes risk. Consider fasting glucose or HbA1c testing and lifestyle counselling.",
    es: "Riesgo moderado de diabetes a 10 años. Considere glucosa en ayunas o HbA1c y consejo sobre estilo de vida.",
    ca: "Risc moderat de diabetis a 10 anys. Considereu glucosa en dejú o HbA1c i consell sobre estil de vida.",
  },
  FINDRISC_HIGH: {
    en: "High 10-year diabetes risk. Order glucose / HbA1c, consider an oral glucose tolerance test and structured lifestyle intervention.",
    es: "Riesgo alto de diabetes a 10 años. Solicite glucosa / HbA1c, considere un test de tolerancia oral a la glucosa e intervención estructurada del estilo de vida.",
    ca: "Risc alt de diabetis a 10 anys. Sol·liciteu glucosa / HbA1c, considereu un test de tolerància oral a la glucosa i intervenció estructurada de l'estil de vida.",
  },
  FINDRISC_VERY_HIGH: {
    en: "Very high 10-year diabetes risk (about 1 in 2). Diagnostic testing and intensive lifestyle / pharmacological intervention are warranted.",
    es: "Riesgo muy alto de diabetes a 10 años (aprox. 1 de cada 2). Están justificadas pruebas diagnósticas e intervención intensiva en estilo de vida o farmacológica.",
    ca: "Risc molt alt de diabetis a 10 anys (aprox. 1 de cada 2). Estan justificades proves diagnòstiques i intervenció intensiva en estil de vida o farmacològica.",
  },

  // IPSS
  IPSS_MILD: {
    en: "Mild lower urinary tract symptoms. Watchful waiting and behavioural advice are usually appropriate.",
    es: "Síntomas urinarios bajos leves. Suelen ser apropiadas la observación y los consejos de comportamiento.",
    ca: "Símptomes urinaris baixos lleus. Solen ser apropiades l'observació i els consells de comportament.",
  },
  IPSS_MODERATE: {
    en: "Moderate symptoms. Consider medical therapy (alpha-blockers, 5-ARI) and shared decision-making about further evaluation.",
    es: "Síntomas moderados. Considere tratamiento médico (alfabloqueantes, 5-ARI) y decisión compartida sobre estudios adicionales.",
    ca: "Símptomes moderats. Considereu tractament mèdic (alfabloquejants, 5-ARI) i decisió compartida sobre estudis addicionals.",
  },
  IPSS_SEVERE: {
    en: "Severe symptoms. Refer to urology; consider surgical options if medical therapy fails or complications develop.",
    es: "Síntomas graves. Derive a urología; considere opciones quirúrgicas si el tratamiento médico falla o aparecen complicaciones.",
    ca: "Símptomes greus. Deriveu a urologia; considereu opcions quirúrgiques si el tractament mèdic falla o apareixen complicacions.",
  },

  // BASDAI
  BASDAI_LOW: {
    en: "BASDAI <4: low disease activity. Continue current therapy and monitor for changes.",
    es: "BASDAI <4: actividad baja de la enfermedad. Continúe el tratamiento actual y vigile cambios.",
    ca: "BASDAI <4: activitat baixa de la malaltia. Continueu el tractament actual i vigileu canvis.",
  },
  BASDAI_ACTIVE: {
    en: "BASDAI ≥4: active disease. Reassess therapy — typical threshold for advancing to a biologic if NSAID response is inadequate.",
    es: "BASDAI ≥4: enfermedad activa. Reevalúe la terapia — umbral típico para avanzar a un biológico si la respuesta a AINE es insuficiente.",
    ca: "BASDAI ≥4: malaltia activa. Reavalueu la teràpia — llindar típic per avançar a un biològic si la resposta a AINE és insuficient.",
  },
  BASDAI_VERY_HIGH: {
    en: "BASDAI ≥7: very high disease activity. Escalate therapy promptly and check for extra-articular complications.",
    es: "BASDAI ≥7: actividad muy alta. Escale el tratamiento con rapidez y revise complicaciones extraarticulares.",
    ca: "BASDAI ≥7: activitat molt alta. Escaleu el tractament amb rapidesa i reviseu complicacions extraarticulars.",
  },


  // DAS28
  DAS28_REMISSION: {
    en: "DAS28 <2.6: remission. Maintain current therapy and reassess in 3–6 months.",
    es: "DAS28 <2.6: remisión. Mantenga el tratamiento actual y reevalúe en 3–6 meses.",
    ca: "DAS28 <2.6: remissió. Mantingueu el tractament actual i reavalueu en 3–6 mesos.",
  },
  DAS28_LOW: {
    en: "DAS28 2.6–3.2: low disease activity. Continue current therapy; consider treat-to-target adjustments if a remission goal is set.",
    es: "DAS28 2.6–3.2: actividad baja. Continúe la terapia actual; considere ajustes de tratar-por-objetivo si se busca remisión.",
    ca: "DAS28 2.6–3.2: activitat baixa. Continueu la teràpia actual; considereu ajustos de tractar-per-objectiu si es busca remissió.",
  },
  DAS28_MODERATE: {
    en: "DAS28 3.2–5.1: moderate disease activity. Reassess current DMARDs and consider escalation per treat-to-target.",
    es: "DAS28 3.2–5.1: actividad moderada. Reevalúe los FAME actuales y considere escalada según tratar-por-objetivo.",
    ca: "DAS28 3.2–5.1: activitat moderada. Reavalueu els FAME actuals i considereu escalada segons tractar-per-objectiu.",
  },
  DAS28_HIGH: {
    en: "DAS28 >5.1: high disease activity. Escalate therapy promptly; biologic or targeted-synthetic DMARDs typically indicated.",
    es: "DAS28 >5.1: actividad alta. Escale la terapia con rapidez; FAME biológicos o sintéticos dirigidos suelen estar indicados.",
    ca: "DAS28 >5.1: activitat alta. Escaleu la teràpia amb rapidesa; FAME biològics o sintètics dirigits solen estar indicats.",
  },

  // PASI
  PASI_MILD: {
    en: "Mild psoriasis (PASI <5). Topical therapy with vitamin-D analogues + corticosteroids usually suffices.",
    es: "Psoriasis leve (PASI <5). Suele bastar la terapia tópica con análogos de vitamina D y corticoides.",
    ca: "Psoriasi lleu (PASI <5). Sol bastar la teràpia tòpica amb anàlegs de vitamina D i corticoides.",
  },
  PASI_MODERATE: {
    en: "Moderate psoriasis (PASI 5–10). Consider phototherapy or conventional systemics if topical therapy is insufficient.",
    es: "Psoriasis moderada (PASI 5–10). Considere fototerapia o sistémicos convencionales si la terapia tópica es insuficiente.",
    ca: "Psoriasi moderada (PASI 5–10). Considereu fototeràpia o sistèmics convencionals si la teràpia tòpica és insuficient.",
  },
  PASI_SEVERE: {
    en: "Severe psoriasis (PASI ≥10). Systemic therapy is generally indicated; biologics qualify per EMA criteria.",
    es: "Psoriasis grave (PASI ≥10). La terapia sistémica suele estar indicada; los biológicos cumplen criterios EMA.",
    ca: "Psoriasi greu (PASI ≥10). La teràpia sistèmica sol estar indicada; els biològics compleixen criteris EMA.",
  },

  // SCORAD
  SCORAD_MILD: {
    en: "Mild atopic dermatitis. Emollients plus low-potency topical steroids during flares usually suffice.",
    es: "Dermatitis atópica leve. Suelen bastar emolientes y corticoides tópicos de baja potencia durante los brotes.",
    ca: "Dermatitis atòpica lleu. Solen bastar emol·lients i corticoides tòpics de baixa potència durant els brots.",
  },
  SCORAD_MODERATE: {
    en: "Moderate atopic dermatitis. Use mid- to high-potency topical steroids or calcineurin inhibitors; consider proactive maintenance.",
    es: "Dermatitis atópica moderada. Use corticoides tópicos de potencia media a alta o inhibidores de la calcineurina; considere mantenimiento proactivo.",
    ca: "Dermatitis atòpica moderada. Useu corticoides tòpics de potència mitjana a alta o inhibidors de la calcineurina; considereu manteniment proactiu.",
  },
  SCORAD_SEVERE: {
    en: "Severe atopic dermatitis. Consider systemic therapy (phototherapy, ciclosporin) or biologics (dupilumab, JAK inhibitors).",
    es: "Dermatitis atópica grave. Considere terapia sistémica (fototerapia, ciclosporina) o biológicos (dupilumab, inhibidores JAK).",
    ca: "Dermatitis atòpica greu. Considereu teràpia sistèmica (fototeràpia, ciclosporina) o biològics (dupilumab, inhibidors JAK).",
  },

  // Duke
  DUKE_DEFINITE: {
    en: "Definite endocarditis: admit, obtain repeat blood cultures, transoesophageal echo if not yet done, and start empirical antibiotics per local protocol.",
    es: "Endocarditis definida: ingrese, obtenga hemocultivos seriados, ecocardiograma transesofágico si aún no se ha hecho y comience antibióticos empíricos según protocolo local.",
    ca: "Endocarditis definida: ingresseu, obteniu hemocultius seriats, ecocardiograma transesofàgic si encara no s'ha fet i comenceu antibiòtics empírics segons protocol local.",
  },
  DUKE_POSSIBLE: {
    en: "Possible endocarditis: do not rule out — continue work-up with serial blood cultures, transoesophageal echo and ID input.",
    es: "Endocarditis posible: no la descarte — continúe el estudio con hemocultivos seriados, ecocardiograma transesofágico e interconsulta a infecciosos.",
    ca: "Endocarditis possible: no la descarteu — continueu l'estudi amb hemocultius seriats, ecocardiograma transesofàgic i interconsulta a infecciosos.",
  },
  DUKE_REJECTED: {
    en: "Endocarditis rejected by criteria: pursue alternative diagnoses; re-evaluate if clinical course evolves.",
    es: "Endocarditis rechazada por criterios: explore diagnósticos alternativos; reevalúe si el curso clínico evoluciona.",
    ca: "Endocarditis rebutjada per criteris: exploreu diagnòstics alternatius; reavalueu si el curs clínic evoluciona.",
  },

  // Hinchey
  HINCHEY_I: {
    en: "Hinchey I: pericolic abscess. Intravenous antibiotics; percutaneous drainage if abscess >4 cm.",
    es: "Hinchey I: absceso pericólico. Antibióticos intravenosos; drenaje percutáneo si el absceso es > 4 cm.",
    ca: "Hinchey I: abscés pericòlic. Antibiòtics intravenosos; drenatge percutani si l'abscés és > 4 cm.",
  },
  HINCHEY_II: {
    en: "Hinchey II: pelvic, retroperitoneal or distant abscess. Image-guided drainage plus antibiotics; surgical option if drainage fails.",
    es: "Hinchey II: absceso pélvico, retroperitoneal o a distancia. Drenaje guiado por imagen y antibióticos; opción quirúrgica si el drenaje falla.",
    ca: "Hinchey II: abscés pèlvic, retroperitoneal o a distància. Drenatge guiat per imatge i antibiòtics; opció quirúrgica si el drenatge falla.",
  },
  HINCHEY_III: {
    en: "Hinchey III: generalised purulent peritonitis. Emergency surgery (laparoscopic lavage or resection); ICU input.",
    es: "Hinchey III: peritonitis purulenta generalizada. Cirugía urgente (lavado laparoscópico o resección); participación de UCI.",
    ca: "Hinchey III: peritonitis purulenta generalitzada. Cirurgia urgent (rentat laparoscòpic o resecció); participació d'UCI.",
  },
  HINCHEY_IV: {
    en: "Hinchey IV: generalised faecal peritonitis. Emergency Hartmann's procedure with broad-spectrum antibiotics and resuscitation.",
    es: "Hinchey IV: peritonitis fecal generalizada. Procedimiento de Hartmann urgente con antibióticos de amplio espectro y reanimación.",
    ca: "Hinchey IV: peritonitis fecal generalitzada. Procediment de Hartmann urgent amb antibiòtics d'ampli espectre i reanimació.",
  },


  // Anion gap
  AG_LOW: {
    en: "Low anion gap. Most often artifactual or due to hypoalbuminaemia; rarely lithium, bromide, multiple myeloma.",
    es: "Brecha aniónica baja. Suele ser artefactual o por hipoalbuminemia; raramente litio, bromuro, mieloma múltiple.",
    ca: "Bretxa aniònica baixa. Sol ser artefactual o per hipoalbuminèmia; rarament liti, bromur, mieloma múltiple.",
  },
  AG_NORMAL: {
    en: "Normal anion gap (6–12 mEq/L).",
    es: "Brecha aniónica normal (6–12 mEq/L).",
    ca: "Bretxa aniònica normal (6–12 mEq/L).",
  },
  AG_ELEVATED: {
    en: "Elevated anion gap. Work up high-AG metabolic acidosis (MUDPILES: methanol, uraemia, DKA, paraldehyde, INH, lactate, ethylene glycol, salicylates).",
    es: "Brecha aniónica elevada. Estudie acidosis metabólica con brecha aniónica elevada (MUDPILES: metanol, uremia, cetoacidosis diabética, paraldehído, isoniazida, lactato, etilenglicol, salicilatos).",
    ca: "Bretxa aniònica elevada. Estudieu acidosi metabòlica amb bretxa aniònica elevada (MUDPILES: metanol, urèmia, cetoacidosi diabètica, paraldehid, isoniazida, lactat, etilenglicol, salicilats).",
  },

  // FENa
  FENA_PRERENAL: {
    en: "FENa < 1 % suggests prerenal AKI. Restore effective circulating volume; reassess after fluid challenge. NOTE: also < 1 % in contrast nephropathy, glomerulonephritis and hepatorenal syndrome.",
    es: "FENa < 1 % sugiere FRA prerrenal. Restablezca el volumen circulante efectivo; reevalúe tras prueba de fluidos. NOTA: también < 1 % en nefropatía por contraste, glomerulonefritis y síndrome hepatorrenal.",
    ca: "FENa < 1 % suggereix IRA prerenal. Restabliu el volum circulant efectiu; reavalueu després de prova de fluids. NOTA: també < 1 % en nefropatia per contrast, glomerulonefritis i síndrome hepatorenal.",
  },
  FENA_INDETERMINATE: {
    en: "FENa 1–2 % is indeterminate. On diuretics, FENa is unreliable — use FEUrea (< 35 % supports prerenal).",
    es: "FENa 1–2 % es indeterminado. Con diuréticos, FENa es poco fiable — use FEUrea (< 35 % apoya prerrenal).",
    ca: "FENa 1–2 % és indeterminat. Amb diürètics, FENa és poc fiable — useu FEUrea (< 35 % suport prerenal).",
  },
  FENA_INTRINSIC: {
    en: "FENa > 2 % suggests intrinsic AKI (most commonly acute tubular necrosis). Search for ischaemic or nephrotoxic insult; nephrology input.",
    es: "FENa > 2 % sugiere FRA intrínseco (lo más habitual NTA). Busque insulto isquémico o nefrotóxico; valoración por nefrología.",
    ca: "FENa > 2 % suggereix IRA intrínseca (el més habitual NTA). Cerqueu insult isquèmic o nefrotòxic; valoració per nefrologia.",
  },


  // ASA Physical Status
  ASA_I: {
    en: "ASA I: healthy patient. Routine anaesthetic risk; standard preoperative work-up.",
    es: "ASA I: paciente sano. Riesgo anestésico habitual; estudio preoperatorio estándar.",
    ca: "ASA I: pacient sa. Risc anestèsic habitual; estudi preoperatori estàndard.",
  },
  ASA_II: {
    en: "ASA II: mild systemic disease without substantive functional limitation.",
    es: "ASA II: enfermedad sistémica leve sin limitación funcional importante.",
    ca: "ASA II: malaltia sistèmica lleu sense limitació funcional important.",
  },
  ASA_III: {
    en: "ASA III: severe systemic disease with substantive functional limitation. Optimise comorbidities; consider specialist input pre-op.",
    es: "ASA III: enfermedad sistémica grave con limitación funcional importante. Optimice las comorbilidades; considere interconsulta especializada antes de la cirugía.",
    ca: "ASA III: malaltia sistèmica greu amb limitació funcional important. Optimitzeu les comorbiditats; considereu interconsulta especialitzada abans de la cirurgia.",
  },
  ASA_IV: {
    en: "ASA IV: severe systemic disease that is a constant threat to life. Multidisciplinary anaesthetic planning.",
    es: "ASA IV: enfermedad sistémica grave que constituye una amenaza constante para la vida. Planificación anestésica multidisciplinar.",
    ca: "ASA IV: malaltia sistèmica greu que constitueix una amenaça constant per a la vida. Planificació anestèsica multidisciplinar.",
  },
  ASA_V: {
    en: "ASA V: moribund patient not expected to survive without the operation. Discuss goals of care; ICU bed required.",
    es: "ASA V: paciente moribundo que no se espera que sobreviva sin la operación. Discuta los objetivos de cuidado; se requiere cama de UCI.",
    ca: "ASA V: pacient moribund que no s'espera que sobrevisqui sense la operació. Discutiu els objectius d'atenció; cal llit d'UCI.",
  },
  ASA_VI: {
    en: "ASA VI: declared brain-dead patient whose organs are being removed for donor purposes.",
    es: "ASA VI: paciente con muerte cerebral declarada cuyos órganos se extraen para donación.",
    ca: "ASA VI: pacient amb mort cerebral declarada del qual s'extreuen els òrgans per a donació.",
  },

  // Caprini
  CAPRINI_VERY_LOW: {
    en: "Very low VTE risk. Early ambulation alone is usually sufficient.",
    es: "Riesgo de TVP/TEP muy bajo. La deambulación precoz suele ser suficiente.",
    ca: "Risc de TVP/TEP molt baix. La deambulació precoç sol ser suficient.",
  },
  CAPRINI_LOW: {
    en: "Low VTE risk. Mechanical prophylaxis (intermittent pneumatic compression) is usually sufficient.",
    es: "Riesgo bajo. La profilaxis mecánica (compresión neumática intermitente) suele ser suficiente.",
    ca: "Risc baix. La profilaxi mecànica (compressió pneumàtica intermitent) sol ser suficient.",
  },
  CAPRINI_MODERATE: {
    en: "Moderate VTE risk. Pharmacological prophylaxis (LMWH or low-dose UFH) is recommended unless bleeding risk is prohibitive.",
    es: "Riesgo moderado. Se recomienda profilaxis farmacológica (HBPM o HNF a dosis baja) salvo riesgo hemorrágico prohibitivo.",
    ca: "Risc moderat. Es recomana profilaxi farmacològica (HBPM o HNF a dosi baixa) excepte risc hemorràgic prohibitiu.",
  },
  CAPRINI_HIGH: {
    en: "High VTE risk. Pharmacological prophylaxis plus mechanical prophylaxis; consider extended-duration prophylaxis in selected surgical patients.",
    es: "Riesgo alto. Profilaxis farmacológica + mecánica; considere profilaxis prolongada en pacientes quirúrgicos seleccionados.",
    ca: "Risc alt. Profilaxi farmacològica + mecànica; considereu profilaxi prolongada en pacients quirúrgics seleccionats.",
  },

  // Wells DVT
  WELLSDVT_UNLIKELY: {
    en: "DVT unlikely. Obtain a high-sensitivity D-dimer; if negative, DVT can be excluded.",
    es: "TVP improbable. Solicite dímero D de alta sensibilidad; si es negativo, se descarta TVP.",
    ca: "TVP improbable. Sol·liciteu dímer D d'alta sensibilitat; si és negatiu, es descarta TVP.",
  },
  WELLSDVT_LIKELY: {
    en: "DVT likely. Proceed directly to proximal-leg compression ultrasound; treat empirically if imaging will be delayed.",
    es: "TVP probable. Realice directamente ecografía de compresión de la pierna proximal; trate empíricamente si la imagen se retrasa.",
    ca: "TVP probable. Realitzeu directament ecografia de compressió de la cama proximal; tracteu empíricament si la imatge es retarda.",
  },

  // Child-Pugh
  CHILD_PUGH_A: {
    en: "Class A (well-compensated cirrhosis). ~100% 1-year survival; non-hepatic surgery generally safe.",
    es: "Clase A (cirrosis bien compensada). ~100% de supervivencia a 1 año; la cirugía no hepática suele ser segura.",
    ca: "Classe A (cirrosi ben compensada). ~100% de supervivència a 1 any; la cirurgia no hepàtica sol ser segura.",
  },
  CHILD_PUGH_B: {
    en: "Class B (significant functional compromise). ~80% 1-year survival; assess transplant candidacy; defer elective surgery if possible.",
    es: "Clase B (compromiso funcional significativo). ~80% de supervivencia a 1 año; valore candidatura a trasplante; difiera la cirugía electiva si es posible.",
    ca: "Classe B (compromís funcional significatiu). ~80% de supervivència a 1 any; valoreu candidatura a trasplantament; difereixiu la cirurgia electiva si és possible.",
  },
  CHILD_PUGH_C: {
    en: "Class C (decompensated cirrhosis). ~45% 1-year survival; transplant evaluation; avoid elective surgery — high peri-operative mortality.",
    es: "Clase C (cirrosis descompensada). ~45% de supervivencia a 1 año; evaluación para trasplante; evite cirugía electiva — mortalidad perioperatoria alta.",
    ca: "Classe C (cirrosi descompensada). ~45% de supervivència a 1 any; avaluació per a trasplantament; eviteu cirurgia electiva — mortalitat perioperatòria alta.",
  },

  // Glasgow-Blatchford
  GBS_SAFE_DISCHARGE: {
    en: "Glasgow-Blatchford = 0: very low risk. Outpatient management with early endoscopy is appropriate per NICE / BSG.",
    es: "Glasgow-Blatchford = 0: riesgo muy bajo. El manejo ambulatorio con endoscopia precoz es apropiado según NICE / BSG.",
    ca: "Glasgow-Blatchford = 0: risc molt baix. El maneig ambulatori amb endoscòpia precoç és apropiat segons NICE / BSG.",
  },
  GBS_LOW_MOD: {
    en: "Low-to-moderate risk. Admit for observation; endoscopy within 24 hours.",
    es: "Riesgo bajo-moderado. Ingrese para observación; endoscopia en 24 horas.",
    ca: "Risc baix-moderat. Ingresseu per observació; endoscòpia en 24 hores.",
  },
  GBS_HIGH: {
    en: "High risk for intervention (transfusion, endoscopic therapy or surgery). Resuscitate and arrange urgent endoscopy.",
    es: "Riesgo alto de intervención (transfusión, tratamiento endoscópico o cirugía). Reanime y solicite endoscopia urgente.",
    ca: "Risc alt d'intervenció (transfusió, tractament endoscòpic o cirurgia). Reanimeu i sol·liciteu endoscòpia urgent.",
  },


  // SCORE2 / SCORE2-OP
  SCORE2_LOW: {
    en: "Low 10-year CV risk. Reinforce healthy lifestyle and reassess periodically.",
    es: "Riesgo CV a 10 años bajo. Refuerce hábitos saludables y reevalúe periódicamente.",
    ca: "Risc CV a 10 anys baix. Reforceu hàbits saludables i reavalueu periòdicament.",
  },
  SCORE2_MODERATE: {
    en: "Moderate 10-year CV risk. Lifestyle intervention plus consideration of risk-factor treatment if risk modifiers present.",
    es: "Riesgo CV a 10 años moderado. Intervención de estilo de vida y considerar tratamiento de factores de riesgo si hay modificadores.",
    ca: "Risc CV a 10 anys moderat. Intervenció d'estil de vida i considerar tractament de factors de risc si hi ha modificadors.",
  },
  SCORE2_HIGH: {
    en: "High to very high 10-year CV risk. Optimise blood pressure and lipid management; statin therapy generally indicated.",
    es: "Riesgo CV a 10 años alto o muy alto. Optimice tensión y lípidos; la estatina suele estar indicada.",
    ca: "Risc CV a 10 anys alt o molt alt. Optimitzeu tensió i lípids; l'estatina sol estar indicada.",
  },

  // ASCVD
  ASCVD_LOW: {
    en: "Low 10-year ASCVD risk. Lifestyle counselling; statin not routinely indicated.",
    es: "Riesgo ASCVD a 10 años bajo. Consejo de estilo de vida; la estatina no se indica de rutina.",
    ca: "Risc ASCVD a 10 anys baix. Consell d'estil de vida; l'estatina no s'indica de rutina.",
  },
  ASCVD_BORDERLINE: {
    en: "Borderline risk (5–7.4%). Discuss risk-enhancing factors; consider moderate-intensity statin in selected patients.",
    es: "Riesgo limítrofe (5-7,4 %). Comente factores potenciadores; considere estatina de intensidad moderada en pacientes seleccionados.",
    ca: "Risc límit (5-7,4 %). Comenteu factors potenciadors; considereu estatina d'intensitat moderada en pacients seleccionats.",
  },
  ASCVD_INTERMEDIATE: {
    en: "Intermediate risk (7.5–19.9%). Moderate- to high-intensity statin generally indicated alongside lifestyle changes.",
    es: "Riesgo intermedio (7,5-19,9 %). Estatina de intensidad moderada-alta suele estar indicada junto a cambios de estilo de vida.",
    ca: "Risc intermedi (7,5-19,9 %). Estatina d'intensitat moderada-alta sol estar indicada juntament amb canvis d'estil de vida.",
  },
  ASCVD_HIGH: {
    en: "High risk (≥ 20%). High-intensity statin indicated; consider non-statin add-ons to reach LDL-C goal.",
    es: "Riesgo alto (≥ 20 %). Estatina de alta intensidad indicada; considere asociar otros hipolipemiantes para alcanzar el objetivo de LDL-C.",
    ca: "Risc alt (≥ 20 %). Estatina d'alta intensitat indicada; considereu associar altres hipolipidemiants per assolir l'objectiu de LDL-C.",
  },


  // SOFA
  SOFA_LOW: {
    en: "Low organ dysfunction (SOFA ≤ 6). Continue supportive care; reassess every 24-48 h.",
    es: "Disfunción orgánica baja (SOFA ≤ 6). Continúe cuidados de soporte; reevalúe cada 24-48 h.",
    ca: "Disfunció orgànica baixa (SOFA ≤ 6). Continueu cures de suport; reavalueu cada 24-48 h.",
  },
  SOFA_MODERATE: {
    en: "Moderate organ dysfunction (SOFA 7-9). Intensive monitoring; trend serial SOFAs and consider escalation of organ support.",
    es: "Disfunción orgánica moderada (SOFA 7-9). Monitorización intensiva; siga SOFA seriado y considere escalar el soporte orgánico.",
    ca: "Disfunció orgànica moderada (SOFA 7-9). Monitorització intensiva; seguiu SOFA seriat i considereu escalar el suport orgànic.",
  },
  SOFA_SEVERE: {
    en: "Severe organ dysfunction (SOFA 10-12). High mortality; multidisciplinary ICU input and goals-of-care conversation.",
    es: "Disfunción orgánica grave (SOFA 10-12). Mortalidad alta; participación multidisciplinar de UCI y discusión de objetivos de cuidados.",
    ca: "Disfunció orgànica greu (SOFA 10-12). Mortalitat alta; participació multidisciplinar d'UCI i discussió d'objectius de cures.",
  },
  SOFA_VERY_HIGH: {
    en: "Very high organ dysfunction (SOFA ≥ 13). Mortality ≥ 80 %; consider limitation of life-sustaining treatment in shared decision-making.",
    es: "Disfunción orgánica muy alta (SOFA ≥ 13). Mortalidad ≥ 80%; considere limitación del tratamiento de soporte vital en decisión compartida.",
    ca: "Disfunció orgànica molt alta (SOFA ≥ 13). Mortalitat ≥ 80%; considereu limitació del tractament de suport vital en decisió compartida.",
  },

  // APACHE II
  APACHE2_LOW: {
    en: "Low APACHE II (≤ 9). Routine ICU monitoring; reassess every 24 h.",
    es: "APACHE II bajo (≤ 9). Monitorización rutinaria en UCI; reevalúe cada 24 h.",
    ca: "APACHE II baix (≤ 9). Monitorització rutinària a UCI; reavalueu cada 24 h.",
  },
  APACHE2_MODERATE: {
    en: "Moderate APACHE II (10-19). Hospital mortality ~15-25 %; full ICU support and serial APACHE trend.",
    es: "APACHE II moderado (10-19). Mortalidad hospitalaria ~15-25%; soporte completo de UCI y seguimiento seriado.",
    ca: "APACHE II moderat (10-19). Mortalitat hospitalària ~15-25%; suport complet d'UCI i seguiment seriat.",
  },
  APACHE2_HIGH: {
    en: "High APACHE II (20-29). Mortality 40-55 %; multidisciplinary input and goals-of-care discussion.",
    es: "APACHE II alto (20-29). Mortalidad 40-55%; participación multidisciplinar y discusión de objetivos de cuidados.",
    ca: "APACHE II alt (20-29). Mortalitat 40-55%; participació multidisciplinar i discussió d'objectius de cures.",
  },
  APACHE2_VERY_HIGH: {
    en: "Very high APACHE II (≥ 30). Mortality ≥ 75 %; consider limitation of life-sustaining treatment within a shared decision-making process.",
    es: "APACHE II muy alto (≥ 30). Mortalidad ≥ 75%; considere limitación de tratamiento de soporte vital en decisión compartida.",
    ca: "APACHE II molt alt (≥ 30). Mortalitat ≥ 75%; considereu limitació del tractament de suport vital en decisió compartida.",
  },

  // NIHSS
  NIHSS_NONE: {
    en: "No clinically detectable stroke symptoms.",
    es: "Sin síntomas de ictus clínicamente detectables.",
    ca: "Sense símptomes d'ictus clínicament detectables.",
  },
  NIHSS_MINOR: {
    en: "Minor stroke (NIHSS 1-4). Discuss IV thrombolysis individually; benefit may not outweigh bleed risk for very mild deficits.",
    es: "Ictus leve (NIHSS 1-4). Discuta trombólisis IV individualmente; el beneficio puede no superar el riesgo de sangrado en déficit muy leves.",
    ca: "Ictus lleu (NIHSS 1-4). Discutiu tromboèlisi IV individualment; el benefici pot no superar el risc de sagnat en dèficits molt lleus.",
  },
  NIHSS_MODERATE: {
    en: "Moderate stroke (NIHSS 5-15). IV thrombolysis if within window; consider endovascular therapy if large-vessel occlusion (LVO).",
    es: "Ictus moderado (NIHSS 5-15). Trombólisis IV si está en ventana; considere terapia endovascular si hay oclusión de vaso grande (LVO).",
    ca: "Ictus moderat (NIHSS 5-15). Tromboèlisi IV si està en finestra; considereu teràpia endovascular si hi ha oclusió de vas gran (LVO).",
  },
  NIHSS_MODERATE_SEVERE: {
    en: "Moderate to severe stroke (NIHSS 16-20). LVO highly likely — image immediately for endovascular thrombectomy candidacy.",
    es: "Ictus moderado a grave (NIHSS 16-20). LVO muy probable — solicite imagen inmediata para valorar trombectomía endovascular.",
    ca: "Ictus moderat a greu (NIHSS 16-20). LVO molt probable — sol·liciteu imatge immediata per valorar trombectomia endovascular.",
  },
  NIHSS_SEVERE: {
    en: "Severe stroke (NIHSS ≥ 21). LVO almost certain; thrombectomy if anatomically eligible and within time window; consider NCC monitoring.",
    es: "Ictus grave (NIHSS ≥ 21). LVO casi seguro; trombectomía si es anatómicamente elegible y dentro de ventana; considere monitorización neurocrítica.",
    ca: "Ictus greu (NIHSS ≥ 21). LVO gairebé segur; trombectomia si és anatòmicament elegible i dins de finestra; considereu monitoratge neurocrític.",
  },

  // 4Ts (heparin-induced thrombocytopenia)
  FOURTS_LOW: {
    en: "Low probability of HIT (0-3). HIT is unlikely; look for another cause of thrombocytopenia and continue heparin if otherwise indicated.",
    es: "Probabilidad baja de TIH (0-3). La TIH es improbable; busque otra causa de la trombocitopenia y mantenga la heparina si está indicada por otro motivo.",
    ca: "Probabilitat baixa de TIH (0-3). La TIH és improbable; busqueu una altra causa de la trombocitopènia i mantingueu l'heparina si està indicada per un altre motiu.",
  },
  FOURTS_INTERMEDIATE: {
    en: "Intermediate probability of HIT (4-5). Consider stopping heparin and testing; clinical context decides.",
    es: "Probabilidad intermedia de TIH (4-5). Valore suspender la heparina y solicitar pruebas; decide el contexto clínico.",
    ca: "Probabilitat intermèdia de TIH (4-5). Valoreu suspendre l'heparina i sol·licitar proves; decideix el context clínic.",
  },
  FOURTS_HIGH: {
    en: "High probability of HIT (6-8). Stop all heparin, start a non-heparin anticoagulant and send immunoassay plus functional testing.",
    es: "Probabilidad alta de TIH (6-8). Suspenda toda la heparina, inicie un anticoagulante no heparínico y solicite inmunoensayo y prueba funcional.",
    ca: "Probabilitat alta de TIH (6-8). Suspeneu tota l'heparina, inicieu un anticoagulant no heparínic i sol·liciteu immunoassaig i prova funcional.",
  },

  // Binet
  BINET_A: {
    en: "Binet stage A: fewer than three involved lymphoid areas, no anaemia or thrombocytopenia. Watch and wait is standard.",
    es: "Estadio A de Binet: menos de tres áreas linfoides afectadas, sin anemia ni trombocitopenia. La conducta estándar es observar y esperar.",
    ca: "Estadi A de Binet: menys de tres àrees limfoides afectades, sense anèmia ni trombocitopènia. La conducta estàndard és observar i esperar.",
  },
  BINET_B: {
    en: "Binet stage B: three or more involved lymphoid areas without anaemia or thrombocytopenia. Treat if there are active-disease criteria.",
    es: "Estadio B de Binet: tres o más áreas linfoides afectadas, sin anemia ni trombocitopenia. Trate si hay criterios de enfermedad activa.",
    ca: "Estadi B de Binet: tres o més àrees limfoides afectades, sense anèmia ni trombocitopènia. Tracteu si hi ha criteris de malaltia activa.",
  },
  BINET_C: {
    en: "Binet stage C: anaemia (Hb < 10 g/dL) and/or thrombocytopenia (platelets < 100 ×10⁹/L). Treatment is generally indicated.",
    es: "Estadio C de Binet: anemia (Hb < 10 g/dL) y/o trombocitopenia (plaquetas < 100 ×10⁹/L). Por lo general está indicado tratar.",
    ca: "Estadi C de Binet: anèmia (Hb < 10 g/dL) i/o trombocitopènia (plaquetes < 100 ×10⁹/L). En general cal tractar.",
  },

  // BMI / BSA / IBW
  BMI_BSA_IBW_UNDERWEIGHT: {
    en: "Underweight (BMI < 18.5 kg/m²). Evaluate for malnutrition, eating disorders, or underlying chronic disease.",
    es: "Bajo peso (IMC < 18,5 kg/m²). Descarte desnutrición, trastornos de la conducta alimentaria o una enfermedad crónica subyacente.",
    ca: "Pes baix (IMC < 18,5 kg/m²). Descarteu desnutrició, trastorns de la conducta alimentària o una malaltia crònica subjacent.",
  },
  BMI_BSA_IBW_NORMAL: {
    en: "Normal body weight (BMI 18.5–24.9 kg/m²). Encourage healthy lifestyle and balanced nutrition.",
    es: "Normopeso (IMC 18,5–24,9 kg/m²). Fomente hábitos de vida saludables y una alimentación equilibrada.",
    ca: "Normopès (IMC 18,5–24,9 kg/m²). Fomenteu hàbits de vida saludables i una alimentació equilibrada.",
  },
  BMI_BSA_IBW_OVERWEIGHT: {
    en: "Overweight (BMI 25.0–29.9 kg/m²). Recommend dietary modification, regular physical activity, and cardiovascular risk assessment.",
    es: "Sobrepeso (IMC 25,0–29,9 kg/m²). Recomiende cambios en la dieta, actividad física regular y evaluación del riesgo cardiovascular.",
    ca: "Sobrepès (IMC 25,0–29,9 kg/m²). Recomaneu canvis en la dieta, activitat física regular i avaluació del risc cardiovascular.",
  },
  BMI_OBESE_1: {
    en: "Class I Obesity (BMI 30.0–34.9 kg/m²). Intensive lifestyle intervention recommended; evaluate metabolic comorbidities.",
    es: "Obesidad grado I (IMC 30,0–34,9 kg/m²). Se recomienda una intervención intensiva sobre el estilo de vida; evalúe las comorbilidades metabólicas.",
    ca: "Obesitat de grau I (IMC 30,0–34,9 kg/m²). Es recomana una intervenció intensiva sobre l'estil de vida; avalueu les comorbiditats metabòliques.",
  },
  BMI_OBESE_2: {
    en: "Class II Obesity (BMI 35.0–39.9 kg/m²). Comprehensive weight management including pharmacotherapy evaluation.",
    es: "Obesidad grado II (IMC 35,0–39,9 kg/m²). Abordaje integral del peso, incluida la valoración de tratamiento farmacológico.",
    ca: "Obesitat de grau II (IMC 35,0–39,9 kg/m²). Abordatge integral del pes, inclosa la valoració de tractament farmacològic.",
  },
  BMI_OBESE_3: {
    en: "Class III Severe Obesity (BMI ≥ 40.0 kg/m²). High metabolic/cardiovascular risk; consider bariatric multidisciplinary evaluation.",
    es: "Obesidad grave, grado III (IMC ≥ 40,0 kg/m²). Riesgo metabólico/cardiovascular alto; considere una valoración multidisciplinar para cirugía bariátrica.",
    ca: "Obesitat greu, grau III (IMC ≥ 40,0 kg/m²). Risc metabòlic/cardiovascular alt; considereu una valoració multidisciplinària per a cirurgia bariàtrica.",
  },

  // Epworth
  EPWORTH_NORMAL: {
    en: "Normal daytime sleepiness (0-10). No excessive daytime sleepiness on this basis alone.",
    es: "Somnolencia diurna normal (0-10). Sin somnolencia diurna excesiva según esta escala por sí sola.",
    ca: "Somnolència diürna normal (0-10). Sense somnolència diürna excessiva segons aquesta escala per si sola.",
  },
  EPWORTH_MILD: {
    en: "Mild excessive daytime sleepiness (11-14). Consider further evaluation if symptoms are persistent or impair daily function.",
    es: "Somnolencia diurna excesiva leve (11-14). Valore ampliar el estudio si los síntomas persisten o afectan a la actividad diaria.",
    ca: "Somnolència diürna excessiva lleu (11-14). Valoreu ampliar l'estudi si els símptomes persisteixen o afecten l'activitat diària.",
  },
  EPWORTH_MODERATE: {
    en: "Moderate excessive daytime sleepiness (15-17). Evaluate for an underlying sleep disorder.",
    es: "Somnolencia diurna excesiva moderada (15-17). Estudie un posible trastorno del sueño subyacente.",
    ca: "Somnolència diürna excessiva moderada (15-17). Estudieu un possible trastorn del son subjacent.",
  },
  EPWORTH_SEVERE: {
    en: "Severe excessive daytime sleepiness (18-24). Prompt evaluation for an underlying sleep disorder is warranted, along with counselling about driving safety.",
    es: "Somnolencia diurna excesiva grave (18-24). Está indicado estudiar sin demora un trastorno del sueño subyacente y aconsejar sobre la seguridad al conducir.",
    ca: "Somnolència diürna excessiva greu (18-24). Cal estudiar sense demora un trastorn del son subjacent i aconsellar sobre la seguretat en la conducció.",
  },

  // Free water deficit — {score} is the deficit in litres
  FWD_NONE: {
    en: "No free water deficit calculated (serum sodium is at or below target).",
    es: "Sin déficit de agua libre (el sodio sérico está en el objetivo o por debajo).",
    ca: "Sense dèficit d'aigua lliure (el sodi sèric és a l'objectiu o per sota).",
  },
  FWD_DEFICIT_CALCULATED: {
    en: "Free water deficit is {score} L. Correct slowly: decrease serum Na⁺ by NO MORE than 8–10 mEq/L per 24 hours (approx. 0.5 mEq/L/hour) to avoid severe cerebral edema. Include ongoing obligate fluid losses in total fluid replacement volume.",
    es: "Déficit de agua libre: {score} L. Corrija lentamente: NO reduzca el Na⁺ sérico más de 8–10 mEq/L en 24 horas (aprox. 0,5 mEq/L/hora) para evitar un edema cerebral grave. Sume las pérdidas obligadas de líquidos en curso al volumen total de reposición.",
    ca: "Dèficit d'aigua lliure: {score} L. Corregiu lentament: NO reduïu el Na⁺ sèric més de 8–10 mEq/L en 24 hores (aprox. 0,5 mEq/L/hora) per evitar un edema cerebral greu. Sumeu les pèrdues obligades de líquids en curs al volum total de reposició.",
  },

  // HOMA-IR
  HOMA_OPTIMAL: {
    en: "Optimal insulin sensitivity (HOMA-IR < 1.0). Low risk of insulin resistance.",
    es: "Sensibilidad a la insulina óptima (HOMA-IR < 1,0). Riesgo bajo de resistencia a la insulina.",
    ca: "Sensibilitat a la insulina òptima (HOMA-IR < 1,0). Risc baix de resistència a la insulina.",
  },
  HOMA_MILD: {
    en: "Early or mild insulin resistance (HOMA-IR 1.0–1.9). Recommend physical activity, dietary counseling, and periodic metabolic monitoring.",
    es: "Resistencia a la insulina incipiente o leve (HOMA-IR 1,0–1,9). Recomiende actividad física, consejo dietético y control metabólico periódico.",
    ca: "Resistència a la insulina incipient o lleu (HOMA-IR 1,0–1,9). Recomaneu activitat física, consell dietètic i control metabòlic periòdic.",
  },
  HOMA_ELEVATED: {
    en: "Significant insulin resistance (HOMA-IR ≥ 2.0). Elevated risk for metabolic syndrome, type 2 diabetes mellitus, and cardiovascular disease.",
    es: "Resistencia a la insulina significativa (HOMA-IR ≥ 2,0). Riesgo elevado de síndrome metabólico, diabetes mellitus tipo 2 y enfermedad cardiovascular.",
    ca: "Resistència a la insulina significativa (HOMA-IR ≥ 2,0). Risc elevat de síndrome metabòlica, diabetis mellitus tipus 2 i malaltia cardiovascular.",
  },

  // IPI
  IPI_LOW: {
    en: "Low risk (IPI 0-1). Five-year overall survival was 73% in the original pre-rituximab cohort.",
    es: "Riesgo bajo (IPI 0-1). La supervivencia global a cinco años fue del 73% en la cohorte original, previa al rituximab.",
    ca: "Risc baix (IPI 0-1). La supervivència global a cinc anys va ser del 73% en la cohort original, prèvia al rituximab.",
  },
  IPI_LOW_INTERMEDIATE: {
    en: "Low-intermediate risk (IPI 2). Five-year overall survival was 51% in the original pre-rituximab cohort.",
    es: "Riesgo intermedio-bajo (IPI 2). La supervivencia global a cinco años fue del 51% en la cohorte original, previa al rituximab.",
    ca: "Risc intermedi-baix (IPI 2). La supervivència global a cinc anys va ser del 51% en la cohort original, prèvia al rituximab.",
  },
  IPI_HIGH_INTERMEDIATE: {
    en: "High-intermediate risk (IPI 3). Five-year overall survival was 43% in the original pre-rituximab cohort.",
    es: "Riesgo intermedio-alto (IPI 3). La supervivencia global a cinco años fue del 43% en la cohorte original, previa al rituximab.",
    ca: "Risc intermedi-alt (IPI 3). La supervivència global a cinc anys va ser del 43% en la cohort original, prèvia al rituximab.",
  },
  IPI_HIGH: {
    en: "High risk (IPI 4-5). Five-year overall survival was 26% in the original pre-rituximab cohort.",
    es: "Riesgo alto (IPI 4-5). La supervivencia global a cinco años fue del 26% en la cohorte original, previa al rituximab.",
    ca: "Risc alt (IPI 4-5). La supervivència global a cinc anys va ser del 26% en la cohort original, prèvia al rituximab.",
  },

  // ISS
  ISS_I: {
    en: "ISS stage I: β2-microglobulin < 3.5 mg/L and albumin ≥ 3.5 g/dL. Median survival was 62 months in the original cohort.",
    es: "Estadio ISS I: β2-microglobulina < 3,5 mg/L y albúmina ≥ 3,5 g/dL. La mediana de supervivencia fue de 62 meses en la cohorte original.",
    ca: "Estadi ISS I: β2-microglobulina < 3,5 mg/L i albúmina ≥ 3,5 g/dL. La mediana de supervivència va ser de 62 mesos en la cohort original.",
  },
  ISS_II: {
    en: "ISS stage II: neither stage I nor stage III. Median survival was 44 months in the original cohort.",
    es: "Estadio ISS II: ni estadio I ni estadio III. La mediana de supervivencia fue de 44 meses en la cohorte original.",
    ca: "Estadi ISS II: ni estadi I ni estadi III. La mediana de supervivència va ser de 44 mesos en la cohort original.",
  },
  ISS_III: {
    en: "ISS stage III: β2-microglobulin ≥ 5.5 mg/L. Median survival was 29 months in the original cohort; renal impairment also raises β2-microglobulin.",
    es: "Estadio ISS III: β2-microglobulina ≥ 5,5 mg/L. La mediana de supervivencia fue de 29 meses en la cohorte original; la insuficiencia renal también eleva la β2-microglobulina.",
    ca: "Estadi ISS III: β2-microglobulina ≥ 5,5 mg/L. La mediana de supervivència va ser de 29 mesos en la cohort original; la insuficiència renal també eleva la β2-microglobulina.",
  },

  // ISTH DIC
  ISTH_DIC_NONE: {
    en: "No laboratory evidence of DIC. Repeat the score if the underlying disorder persists or the clinical picture changes.",
    es: "Sin datos analíticos de CID. Repita la puntuación si persiste la enfermedad de base o cambia el cuadro clínico.",
    ca: "Sense dades analítiques de CID. Repetiu la puntuació si persisteix la malaltia de base o canvia el quadre clínic.",
  },
  ISTH_DIC_NON_OVERT: {
    en: "Not compatible with overt DIC (score < 5). Suggestive of non-overt DIC; repeat in 1-2 days if clinical suspicion persists.",
    es: "No compatible con CID manifiesta (puntuación < 5). Sugiere CID no manifiesta; repita en 1-2 días si persiste la sospecha clínica.",
    ca: "No compatible amb CID manifesta (puntuació < 5). Suggereix CID no manifesta; repetiu en 1-2 dies si persisteix la sospita clínica.",
  },
  ISTH_DIC_OVERT: {
    en: "Compatible with overt DIC (score >= 5). Treat the underlying disorder and repeat the score daily.",
    es: "Compatible con CID manifiesta (puntuación >= 5). Trate la enfermedad de base y repita la puntuación a diario.",
    ca: "Compatible amb CID manifesta (puntuació >= 5). Tracteu la malaltia de base i repetiu la puntuació cada dia.",
  },

  // Khorana
  KHORANA_LOW: {
    en: "Low risk (score 0). Thromboprophylaxis is not indicated; educate on the symptoms of thrombosis.",
    es: "Riesgo bajo (puntuación 0). No está indicada la tromboprofilaxis; informe sobre los síntomas de trombosis.",
    ca: "Risc baix (puntuació 0). No està indicada la tromboprofilaxi; informeu sobre els símptomes de trombosi.",
  },
  KHORANA_INTERMEDIATE: {
    en: "Intermediate risk (score 1-2). Routine thromboprophylaxis is not recommended; reassess if the clinical situation changes.",
    es: "Riesgo intermedio (puntuación 1-2). No se recomienda tromboprofilaxis sistemática; reevalúe si cambia la situación clínica.",
    ca: "Risc intermedi (puntuació 1-2). No es recomana tromboprofilaxi sistemàtica; reavalueu si canvia la situació clínica.",
  },
  KHORANA_HIGH: {
    en: "High risk of chemotherapy-associated VTE (score >= 3). Thromboprophylaxis is recommended by guideline in the absence of bleeding risk.",
    es: "Riesgo alto de TEV asociado a quimioterapia (puntuación >= 3). Las guías recomiendan tromboprofilaxis si no hay riesgo hemorrágico.",
    ca: "Risc alt de TEV associat a quimioteràpia (puntuació >= 3). Les guies recomanen tromboprofilaxi si no hi ha risc hemorràgic.",
  },

  // PLASMIC
  PLASMIC_LOW: {
    en: "Low probability of severe ADAMTS13 deficiency (PLASMIC 0-4). TTP is unlikely; look for another cause of the thrombotic microangiopathy.",
    es: "Probabilidad baja de déficit grave de ADAMTS13 (PLASMIC 0-4). La PTT es improbable; busque otra causa de la microangiopatía trombótica.",
    ca: "Probabilitat baixa de dèficit greu d'ADAMTS13 (PLASMIC 0-4). La PTT és improbable; busqueu una altra causa de la microangiopatia trombòtica.",
  },
  PLASMIC_INTERMEDIATE: {
    en: "Intermediate probability (PLASMIC 5). Send ADAMTS13 activity and decide on plasma exchange with haematology in light of the whole clinical picture.",
    es: "Probabilidad intermedia (PLASMIC 5). Solicite la actividad de ADAMTS13 y decida el recambio plasmático con hematología según el cuadro clínico global.",
    ca: "Probabilitat intermèdia (PLASMIC 5). Sol·liciteu l'activitat d'ADAMTS13 i decidiu el recanvi plasmàtic amb hematologia segons el quadre clínic global.",
  },
  PLASMIC_HIGH: {
    en: "High probability of severe ADAMTS13 deficiency (PLASMIC 6-7). Send ADAMTS13 activity and start urgent plasma exchange without waiting for the result, under haematology guidance.",
    es: "Probabilidad alta de déficit grave de ADAMTS13 (PLASMIC 6-7). Solicite la actividad de ADAMTS13 e inicie recambio plasmático urgente sin esperar el resultado, con la orientación de hematología.",
    ca: "Probabilitat alta de dèficit greu d'ADAMTS13 (PLASMIC 6-7). Sol·liciteu l'activitat d'ADAMTS13 i inicieu recanvi plasmàtic urgent sense esperar el resultat, amb l'orientació d'hematologia.",
  },

  // R-ISS
  RISS_I: {
    en: "R-ISS stage I: ISS I with standard-risk cytogenetics and normal LDH. Five-year overall survival was 82% in the IMWG cohort.",
    es: "Estadio R-ISS I: ISS I con citogenética de riesgo estándar y LDH normal. La supervivencia global a cinco años fue del 82% en la cohorte del IMWG.",
    ca: "Estadi R-ISS I: ISS I amb citogenètica de risc estàndard i LDH normal. La supervivència global a cinc anys va ser del 82% en la cohort de l'IMWG.",
  },
  RISS_II: {
    en: "R-ISS stage II: neither stage I nor stage III. Five-year overall survival was 62% in the IMWG cohort.",
    es: "Estadio R-ISS II: ni estadio I ni estadio III. La supervivencia global a cinco años fue del 62% en la cohorte del IMWG.",
    ca: "Estadi R-ISS II: ni estadi I ni estadi III. La supervivència global a cinc anys va ser del 62% en la cohort de l'IMWG.",
  },
  RISS_III: {
    en: "R-ISS stage III: ISS III with high-risk cytogenetics or high LDH. Five-year overall survival was 40% in the IMWG cohort.",
    es: "Estadio R-ISS III: ISS III con citogenética de alto riesgo o LDH elevada. La supervivencia global a cinco años fue del 40% en la cohorte del IMWG.",
    ca: "Estadi R-ISS III: ISS III amb citogenètica d'alt risc o LDH elevada. La supervivència global a cinc anys va ser del 40% en la cohort de l'IMWG.",
  },

  // Rai
  RAI_0: {
    en: "Rai stage 0 (low risk): blood and marrow lymphocytosis only. Watch and wait is standard.",
    es: "Estadio 0 de Rai (riesgo bajo): solo linfocitosis en sangre y médula ósea. La conducta estándar es observar y esperar.",
    ca: "Estadi 0 de Rai (risc baix): només limfocitosi en sang i medul·la òssia. La conducta estàndard és observar i esperar.",
  },
  RAI_I: {
    en: "Rai stage I (intermediate risk): lymphocytosis with enlarged lymph nodes. Treat only if iwCLL active-disease criteria are met.",
    es: "Estadio I de Rai (riesgo intermedio): linfocitosis con adenopatías. Trate solo si se cumplen los criterios iwCLL de enfermedad activa.",
    ca: "Estadi I de Rai (risc intermedi): limfocitosi amb adenopaties. Tracteu només si es compleixen els criteris iwCLL de malaltia activa.",
  },
  RAI_II: {
    en: "Rai stage II (intermediate risk): lymphocytosis with splenomegaly and/or hepatomegaly. Treat only if iwCLL active-disease criteria are met.",
    es: "Estadio II de Rai (riesgo intermedio): linfocitosis con esplenomegalia y/o hepatomegalia. Trate solo si se cumplen los criterios iwCLL de enfermedad activa.",
    ca: "Estadi II de Rai (risc intermedi): limfocitosi amb esplenomegàlia i/o hepatomegàlia. Tracteu només si es compleixen els criteris iwCLL de malaltia activa.",
  },
  RAI_III: {
    en: "Rai stage III (high risk): lymphocytosis with anaemia (Hb < 11 g/dL). Treatment is generally indicated once a marrow-related cause is confirmed.",
    es: "Estadio III de Rai (riesgo alto): linfocitosis con anemia (Hb < 11 g/dL). Por lo general está indicado tratar una vez confirmado el origen medular.",
    ca: "Estadi III de Rai (risc alt): limfocitosi amb anèmia (Hb < 11 g/dL). En general cal tractar un cop confirmat l'origen medul·lar.",
  },
  RAI_IV: {
    en: "Rai stage IV (high risk): lymphocytosis with thrombocytopenia (platelets < 100 ×10⁹/L). Treatment is generally indicated once a marrow-related cause is confirmed.",
    es: "Estadio IV de Rai (riesgo alto): linfocitosis con trombocitopenia (plaquetas < 100 ×10⁹/L). Por lo general está indicado tratar una vez confirmado el origen medular.",
    ca: "Estadi IV de Rai (risc alt): limfocitosi amb trombocitopènia (plaquetes < 100 ×10⁹/L). En general cal tractar un cop confirmat l'origen medul·lar.",
  },

  // SNOT-22
  SNOT22_MILD: {
    en: "Mild sinonasal symptom burden (0-20). Limited impact on daily life on this basis alone.",
    es: "Carga leve de síntomas sinonasales (0-20). Impacto limitado en la vida diaria según esta escala por sí sola.",
    ca: "Càrrega lleu de símptomes sinonasals (0-20). Impacte limitat en la vida diària segons aquesta escala per si sola.",
  },
  SNOT22_MODERATE: {
    en: "Moderate sinonasal symptom burden (21-50). Clinically meaningful impact on quality of life warranting evaluation and treatment.",
    es: "Carga moderada de síntomas sinonasales (21-50). Impacto clínicamente relevante en la calidad de vida que justifica evaluación y tratamiento.",
    ca: "Càrrega moderada de símptomes sinonasals (21-50). Impacte clínicament rellevant en la qualitat de vida que justifica avaluació i tractament.",
  },
  SNOT22_SEVERE: {
    en: "Severe sinonasal symptom burden (51-110). Substantial impact on daily life; specialist rhinology review is warranted.",
    es: "Carga grave de síntomas sinonasales (51-110). Impacto importante en la vida diaria; está indicada la valoración por rinología.",
    ca: "Càrrega greu de símptomes sinonasals (51-110). Impacte important en la vida diària; cal valoració per rinologia.",
  },

  // STOP-BANG
  STOPBANG_LOW: {
    en: "Low risk of obstructive sleep apnoea (0-2). Moderate-to-severe OSA is unlikely; no sleep study indicated on this basis alone.",
    es: "Riesgo bajo de apnea obstructiva del sueño (0-2). Una AOS moderada-grave es improbable; esta escala por sí sola no indica estudio del sueño.",
    ca: "Risc baix d'apnea obstructiva del son (0-2). Una AOS moderada-greu és improbable; aquesta escala per si sola no indica estudi del son.",
  },
  STOPBANG_INTERMEDIATE: {
    en: "Intermediate risk of obstructive sleep apnoea (3-4). Consider further evaluation, weighted by symptoms and comorbidity.",
    es: "Riesgo intermedio de apnea obstructiva del sueño (3-4). Valore ampliar el estudio según los síntomas y la comorbilidad.",
    ca: "Risc intermedi d'apnea obstructiva del son (3-4). Valoreu ampliar l'estudi segons els símptomes i la comorbiditat.",
  },
  STOPBANG_HIGH: {
    en: "High risk of obstructive sleep apnoea (5-8). Refer for sleep study; consider perioperative precautions if surgery is planned.",
    es: "Riesgo alto de apnea obstructiva del sueño (5-8). Derive para estudio del sueño; considere precauciones perioperatorias si hay cirugía programada.",
    ca: "Risc alt d'apnea obstructiva del son (5-8). Deriveu per a estudi del son; considereu precaucions perioperatòries si hi ha cirurgia programada.",
  },

  // Apgar
  APGAR_NORMAL: {
    en: "Normal score (7–10). Routine post-natal care, drying, warming, and ongoing monitoring.",
    es: "Puntuación normal (7–10). Cuidados posnatales habituales: secado, calor y vigilancia continuada.",
    ca: "Puntuació normal (7–10). Cures postnatals habituals: assecat, escalfor i vigilància continuada.",
  },
  APGAR_MODERATE: {
    en: "Moderately depressed (4–6). Provide airway clearing, tactile stimulation, and supplemental oxygen as indicated.",
    es: "Depresión moderada (4–6). Despeje la vía aérea, aplique estimulación táctil y administre oxígeno suplementario si está indicado.",
    ca: "Depressió moderada (4–6). Desobstruïu la via aèria, apliqueu estimulació tàctil i administreu oxigen suplementari si està indicat.",
  },
  APGAR_SEVERE: {
    en: "Severely depressed (0–3). Immediate resuscitation required according to NRP guidelines (airway, ventilation, compressions).",
    es: "Depresión grave (0–3). Requiere reanimación inmediata según las guías NRP de reanimación neonatal (vía aérea, ventilación, compresiones).",
    ca: "Depressió greu (0–3). Cal reanimació immediata segons les guies NRP de reanimació neonatal (via aèria, ventilació, compressions).",
  },

  // BMI
  BMI_UNDERWEIGHT: {
    en: "Underweight (< 18.5 kg/m²). Evaluate for nutritional deficiencies, eating disorders, or underlying chronic illness.",
    es: "Bajo peso (< 18,5 kg/m²). Descarte déficits nutricionales, trastornos de la conducta alimentaria o una enfermedad crónica subyacente.",
    ca: "Pes baix (< 18,5 kg/m²). Descarteu dèficits nutricionals, trastorns de la conducta alimentària o una malaltia crònica subjacent.",
  },
  BMI_NORMAL: {
    en: "Normal weight (18.5–24.9 kg/m²). Lowest overall cardiometabolic risk; maintain healthy diet and regular exercise.",
    es: "Normopeso (18,5–24,9 kg/m²). Menor riesgo cardiometabólico global; mantenga una dieta saludable y ejercicio regular.",
    ca: "Normopès (18,5–24,9 kg/m²). Menor risc cardiometabòlic global; mantingueu una dieta saludable i exercici regular.",
  },
  BMI_OVERWEIGHT: {
    en: "Overweight (25.0–29.9 kg/m²). Increased cardiometabolic risk; counsel on lifestyle modifications, exercise, and dietary intervention.",
    es: "Sobrepeso (25,0–29,9 kg/m²). Riesgo cardiometabólico aumentado; aconseje cambios en el estilo de vida, ejercicio e intervención dietética.",
    ca: "Sobrepès (25,0–29,9 kg/m²). Risc cardiometabòlic augmentat; aconselleu canvis en l'estil de vida, exercici i intervenció dietètica.",
  },
  BMI_OBESITY_1: {
    en: "Obesity Class I (30.0–34.9 kg/m²). High cardiometabolic risk; initiate structured weight management program.",
    es: "Obesidad grado I (30,0–34,9 kg/m²). Riesgo cardiometabólico alto; inicie un programa estructurado de control del peso.",
    ca: "Obesitat de grau I (30,0–34,9 kg/m²). Risc cardiometabòlic alt; inicieu un programa estructurat de control del pes.",
  },
  BMI_OBESITY_2: {
    en: "Obesity Class II (35.0–39.9 kg/m²). Very high cardiometabolic risk; evaluate for pharmacotherapy or metabolic surgery.",
    es: "Obesidad grado II (35,0–39,9 kg/m²). Riesgo cardiometabólico muy alto; valore tratamiento farmacológico o cirugía metabólica.",
    ca: "Obesitat de grau II (35,0–39,9 kg/m²). Risc cardiometabòlic molt alt; valoreu tractament farmacològic o cirurgia metabòlica.",
  },
  BMI_OBESITY_3: {
    en: "Obesity Class III (≥ 40.0 kg/m²). Extremely high risk of complications; comprehensive bariatric/multidisciplinary care recommended.",
    es: "Obesidad grado III (≥ 40,0 kg/m²). Riesgo de complicaciones extremadamente alto; se recomienda un abordaje bariátrico/multidisciplinar integral.",
    ca: "Obesitat de grau III (≥ 40,0 kg/m²). Risc de complicacions extremadament alt; es recomana un abordatge bariàtric/multidisciplinari integral.",
  },

  // BSA (Mosteller)
  BSA_LOW: {
    en: "BSA is below average adult range (< 1.4 m²). Common in pediatric patients or small adults; adjust chemotherapy and fluid dosing accordingly.",
    es: "ASC por debajo del rango adulto habitual (< 1,4 m²). Frecuente en pacientes pediátricos o adultos de baja talla; ajuste en consecuencia la dosis de quimioterapia y de fluidos.",
    ca: "ASC per sota del rang adult habitual (< 1,4 m²). Freqüent en pacients pediàtrics o adults de talla baixa; ajusteu en conseqüència la dosi de quimioteràpia i de fluids.",
  },
  BSA_NORMAL: {
    en: "BSA is within standard adult range (1.4–2.2 m²). Use for indexing GFR, cardiac output, and drug dosing.",
    es: "ASC dentro del rango adulto estándar (1,4–2,2 m²). Útil para indexar el filtrado glomerular, el gasto cardíaco y la dosificación de fármacos.",
    ca: "ASC dins del rang adult estàndard (1,4–2,2 m²). Útil per indexar el filtrat glomerular, la despesa cardíaca i la dosificació de fàrmacs.",
  },
  BSA_HIGH: {
    en: "BSA is above average adult range (> 2.2 m²). Consider ideal body weight capping if recommended for chemotherapy dosing.",
    es: "ASC por encima del rango adulto habitual (> 2,2 m²). Valore limitar la dosis según el peso ideal si así se recomienda para la quimioterapia.",
    ca: "ASC per sobre del rang adult habitual (> 2,2 m²). Valoreu limitar la dosi segons el pes ideal si així es recomana per a la quimioteràpia.",
  },

  // Centor
  CENTOR_LOW_NO_TEST: {
    en: "Low probability of strep; neither testing nor empirical antibiotics are needed.",
    es: "Probabilidad baja de estreptococo; no se necesitan pruebas ni antibióticos empíricos.",
    ca: "Probabilitat baixa d'estreptococ; no calen proves ni antibiòtics empírics.",
  },
  CENTOR_MODERATE_RADT: {
    en: "Moderate probability; perform a rapid antigen detection test and treat only if positive.",
    es: "Probabilidad moderada; realice una prueba rápida de detección de antígeno y trate solo si es positiva.",
    ca: "Probabilitat moderada; feu una prova ràpida de detecció d'antigen i tracteu només si és positiva.",
  },
  CENTOR_HIGH_TREAT: {
    en: "High probability; consider empirical antibiotics or confirm with a rapid antigen test before treating.",
    es: "Probabilidad alta; considere antibióticos empíricos o confirme con una prueba rápida de antígeno antes de tratar.",
    ca: "Probabilitat alta; considereu antibiòtics empírics o confirmeu-ho amb una prova ràpida d'antigen abans de tractar.",
  },

  // CHA2DS2-VA (same advice as CHA2DS2-VASc)
  CHA2DS2VA_OAC_NOT_RECOMMENDED: {
    en: "Oral anticoagulation not recommended.",
    es: "No se recomienda anticoagulación oral.",
    ca: "No es recomana anticoagulació oral.",
  },
  CHA2DS2VA_OAC_CONSIDERED_IIA: {
    en: "Oral anticoagulation should be considered (ESC Class IIa).",
    es: "Debe considerarse anticoagulación oral (ESC clase IIa).",
    ca: "Cal considerar l'anticoagulació oral (ESC classe IIa).",
  },
  CHA2DS2VA_OAC_RECOMMENDED_I: {
    en: "Oral anticoagulation is recommended (ESC Class I).",
    es: "Se recomienda anticoagulación oral (ESC clase I).",
    ca: "Es recomana anticoagulació oral (ESC classe I).",
  },

  // CIWA-Ar
  CIWA_SEVERE: {
    en: "Severe alcohol withdrawal (score > 15). High risk for DTs and seizures. Immediate aggressive benzodiazepine treatment, close monitoring, and inpatient admission.",
    es: "Abstinencia alcohólica grave (puntuación > 15). Riesgo alto de delirium tremens y convulsiones. Tratamiento inmediato e intensivo con benzodiacepinas, monitorización estrecha e ingreso hospitalario.",
    ca: "Abstinència alcohòlica greu (puntuació > 15). Risc alt de deliri trèmens i convulsions. Tractament immediat i intensiu amb benzodiazepines, monitoratge estret i ingrés hospitalari.",
  },
  CIWA_MODERATE: {
    en: "Moderate alcohol withdrawal (score 10–15). Symptom-triggered benzodiazepine regimen indicated with frequent reassessment every 1–2 hours.",
    es: "Abstinencia alcohólica moderada (puntuación 10–15). Indicada pauta de benzodiacepinas guiada por síntomas, con reevaluación frecuente cada 1–2 horas.",
    ca: "Abstinència alcohòlica moderada (puntuació 10–15). Indicada pauta de benzodiazepines guiada per símptomes, amb reavaluació freqüent cada 1–2 hores.",
  },
  CIWA_MILD: {
    en: "Mild alcohol withdrawal (score < 10). Generally does not require pharmacological treatment unless patient has prior history of seizures or DTs.",
    es: "Abstinencia alcohólica leve (puntuación < 10). En general no requiere tratamiento farmacológico, salvo antecedentes de convulsiones o delirium tremens.",
    ca: "Abstinència alcohòlica lleu (puntuació < 10). En general no requereix tractament farmacològic, llevat d'antecedents de convulsions o deliri trèmens.",
  },

  // Cockcroft-Gault
  CG_NORMAL: {
    en: "Normal creatinine clearance (≥ 90 mL/min). Standard drug dosing suitable unless patient has other risk factors.",
    es: "Aclaramiento de creatinina normal (≥ 90 mL/min). Dosificación estándar adecuada salvo otros factores de riesgo.",
    ca: "Aclariment de creatinina normal (≥ 90 mL/min). Dosificació estàndard adequada llevat d'altres factors de risc.",
  },
  CG_MILD: {
    en: "Mild renal impairment (60–89 mL/min). Monitor kidney function and check package inserts for narrow therapeutic index drugs.",
    es: "Insuficiencia renal leve (60–89 mL/min). Vigile la función renal y consulte la ficha técnica de los fármacos de margen terapéutico estrecho.",
    ca: "Insuficiència renal lleu (60–89 mL/min). Vigileu la funció renal i consulteu la fitxa tècnica dels fàrmacs de marge terapèutic estret.",
  },
  CG_MODERATE: {
    en: "Moderate renal impairment (30–59 mL/min). Dose reduction or extended interval required for renally excreted medications.",
    es: "Insuficiencia renal moderada (30–59 mL/min). Los fármacos de eliminación renal requieren reducir la dosis o ampliar el intervalo.",
    ca: "Insuficiència renal moderada (30–59 mL/min). Els fàrmacs d'eliminació renal requereixen reduir la dosi o allargar l'interval.",
  },
  CG_SEVERE: {
    en: "Severe renal impairment (15–29 mL/min). Significant dose adjustment required; avoid nephrotoxic agents.",
    es: "Insuficiencia renal grave (15–29 mL/min). Requiere un ajuste de dosis importante; evite fármacos nefrotóxicos.",
    ca: "Insuficiència renal greu (15–29 mL/min). Cal un ajust de dosi important; eviteu fàrmacs nefrotòxics.",
  },
  CG_FAILURE: {
    en: "Renal failure / End-stage (< 15 mL/min). Specialized dosing for ESRD/dialysis required; nephrology consultation indicated.",
    es: "Fallo renal / enfermedad renal terminal (< 15 mL/min). Requiere dosificación específica para enfermedad renal terminal o diálisis; indicada consulta con nefrología.",
    ca: "Fallida renal / malaltia renal terminal (< 15 mL/min). Cal dosificació específica per a malaltia renal terminal o diàlisi; indicada consulta amb nefrologia.",
  },

  // COWS
  COWS_MINIMAL: {
    en: "Minimal or no withdrawal (score 0–4). Buprenorphine induction is not indicated.",
    es: "Abstinencia mínima o ausente (puntuación 0–4). No está indicada la inducción con buprenorfina.",
    ca: "Abstinència mínima o absent (puntuació 0–4). No està indicada la inducció amb buprenorfina.",
  },
  COWS_MILD: {
    en: "Mild opioid withdrawal (score 5–12). Monitor patient; buprenorphine induction should generally be delayed until score reaches ≥ 12–13 to avoid precipitated withdrawal.",
    es: "Abstinencia de opioides leve (puntuación 5–12). Vigile al paciente; en general conviene retrasar la inducción con buprenorfina hasta una puntuación ≥ 12–13 para evitar una abstinencia precipitada.",
    ca: "Abstinència d'opioides lleu (puntuació 5–12). Vigileu el pacient; en general convé endarrerir la inducció amb buprenorfina fins a una puntuació ≥ 12–13 per evitar una abstinència precipitada.",
  },
  COWS_MODERATE: {
    en: "Moderate opioid withdrawal (score 13–24). Ideal range to initiate buprenorphine/sublingual buprenorphine-naloxone.",
    es: "Abstinencia de opioides moderada (puntuación 13–24). Rango ideal para iniciar buprenorfina o buprenorfina-naloxona sublingual.",
    ca: "Abstinència d'opioides moderada (puntuació 13–24). Rang ideal per iniciar buprenorfina o buprenorfina-naloxona sublingual.",
  },
  COWS_MODERATELY_SEVERE: {
    en: "Moderately severe opioid withdrawal (score 25–36). Target for buprenorphine induction and symptom management.",
    es: "Abstinencia de opioides moderadamente grave (puntuación 25–36). Rango adecuado para la inducción con buprenorfina y el control de síntomas.",
    ca: "Abstinència d'opioides moderadament greu (puntuació 25–36). Rang adequat per a la inducció amb buprenorfina i el control de símptomes.",
  },
  COWS_SEVERE: {
    en: "Severe opioid withdrawal (score > 36). Medical intervention indicated; safe for buprenorphine induction if protocol criteria are met.",
    es: "Abstinencia de opioides grave (puntuación > 36). Indicada intervención médica; la inducción con buprenorfina es segura si se cumplen los criterios del protocolo.",
    ca: "Abstinència d'opioides greu (puntuació > 36). Indicada intervenció mèdica; la inducció amb buprenorfina és segura si es compleixen els criteris del protocol.",
  },

  // GAD-7
  GAD7_MINIMAL: {
    en: "Minimal anxiety (0–4). Typically does not require formal intervention.",
    es: "Ansiedad mínima (0–4). Habitualmente no requiere intervención formal.",
    ca: "Ansietat mínima (0–4). Habitualment no requereix intervenció formal.",
  },
  GAD7_MILD: {
    en: "Mild anxiety (5–9). Monitor patient; consider counseling and stress management strategies.",
    es: "Ansiedad leve (5–9). Haga seguimiento; considere asesoramiento psicológico y estrategias de manejo del estrés.",
    ca: "Ansietat lleu (5–9). Feu seguiment; considereu assessorament psicològic i estratègies de gestió de l'estrès.",
  },
  GAD7_MODERATE: {
    en: "Moderate anxiety (10–14). Further evaluation required; consider psychotherapy or medical management.",
    es: "Ansiedad moderada (10–14). Requiere más evaluación; considere psicoterapia o tratamiento médico.",
    ca: "Ansietat moderada (10–14). Cal més avaluació; considereu psicoteràpia o tractament mèdic.",
  },
  GAD7_SEVERE: {
    en: "Severe anxiety (15–21). Active treatment recommended with pharmacotherapy and/or psychotherapy; psychiatric evaluation advised.",
    es: "Ansiedad grave (15–21). Se recomienda tratamiento activo con farmacoterapia y/o psicoterapia; se aconseja valoración psiquiátrica.",
    ca: "Ansietat greu (15–21). Es recomana tractament actiu amb farmacoteràpia i/o psicoteràpia; s'aconsella valoració psiquiàtrica.",
  },

  // Glasgow Coma Scale
  GCS_MILD_RULES: {
    en: "Mild TBI; apply local rules (Canadian CT Head, NEXUS-II) to decide on imaging and disposition.",
    es: "TCE leve; aplique las reglas locales (Canadian CT Head, NEXUS-II) para decidir la neuroimagen y el destino del paciente.",
    ca: "TCE lleu; apliqueu les regles locals (Canadian CT Head, NEXUS-II) per decidir la neuroimatge i la destinació del pacient.",
  },
  GCS_MODERATE_ADMIT: {
    en: "Moderate TBI; admit for observation and obtain head CT.",
    es: "TCE moderado; ingrese para observación y solicite TC craneal.",
    ca: "TCE moderat; ingresseu per a observació i sol·liciteu TC cranial.",
  },
  GCS_SEVERE_AIRWAY: {
    en: "Severe TBI; secure the airway (intubation is generally indicated) and proceed to emergent imaging.",
    es: "TCE grave; asegure la vía aérea (en general está indicada la intubación) y realice neuroimagen urgente.",
    ca: "TCE greu; assegureu la via aèria (en general està indicada la intubació) i feu neuroimatge urgent.",
  },

  // SAD PERSONS
  SAD_PERSONS_LOW: {
    en: "Low suicide risk (0–2). Discharge with outpatient psychiatric evaluation and crisis hotline safety planning.",
    es: "Riesgo de suicidio bajo (0–2). Alta con valoración psiquiátrica ambulatoria y plan de seguridad que incluya una línea de crisis.",
    ca: "Risc de suïcidi baix (0–2). Alta amb valoració psiquiàtrica ambulatòria i pla de seguretat que inclogui una línia de crisi.",
  },
  SAD_PERSONS_MODERATE: {
    en: "Moderate suicide risk (3–4). Close outpatient psychiatric follow-up required; consider hospitalization if support system is lacking.",
    es: "Riesgo de suicidio moderado (3–4). Requiere seguimiento psiquiátrico ambulatorio estrecho; considere el ingreso si falta red de apoyo.",
    ca: "Risc de suïcidi moderat (3–4). Cal seguiment psiquiàtric ambulatori estret; considereu l'ingrés si manca xarxa de suport.",
  },
  SAD_PERSONS_HIGH: {
    en: "High suicide risk (5–6). Strongly recommend psychiatric hospitalization or emergency psychiatric evaluation.",
    es: "Riesgo de suicidio alto (5–6). Se recomienda firmemente el ingreso psiquiátrico o una valoración psiquiátrica urgente.",
    ca: "Risc de suïcidi alt (5–6). Es recomana fermament l'ingrés psiquiàtric o una valoració psiquiàtrica urgent.",
  },
  SAD_PERSONS_VERY_HIGH: {
    en: "Very high suicide risk (7–10). Immediate psychiatric hospitalization and 1:1 safety precautions mandatory.",
    es: "Riesgo de suicidio muy alto (7–10). Ingreso psiquiátrico inmediato y vigilancia 1:1 obligatorios.",
    ca: "Risc de suïcidi molt alt (7–10). Ingrés psiquiàtric immediat i vigilància 1:1 obligatoris.",
  },

};

/**
 * Translate a recommendation code into the requested language.
 * Falls back to the English string carried by interpret() if the code is
 * unknown (defensive — should never trigger if registry + codes stay in sync).
 * `{score}` in an entry is replaced by `score`, for advice that quotes it.
 */
export function translateRecommendation(
  code: string,
  lang: ApiLang,
  fallbackEn: string,
  score?: number,
): string {
  const entry = recommendations[code];
  if (!entry) return fallbackEn;
  const text = entry[lang] ?? entry.en;
  return score === undefined ? text : text.replace("{score}", String(score));
}

export function listRecommendationCodes(): string[] {
  return Object.keys(recommendations);
}
