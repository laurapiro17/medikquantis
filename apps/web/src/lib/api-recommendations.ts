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
