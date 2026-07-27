# MedikQuantis — borradores para publicar TÚ (no he publicado nada)

Revisa, ajusta el tono y publica desde tus cuentas. Regla de oro anti-spam: participa primero un poco en cada comunidad, no solo dropees el link. Mejor publicar 1-2 por semana que todos de golpe.

---

## 1. Show HN (Hacker News) — el de mayor potencial de backlinks + tráfico

**Título** (≤80 car, sin "I made"):
`Show HN: MedikQuantis – open-source clinical calculators in Catalan/Spanish/English`

**Texto del primer comentario** (HN espera que el autor comente el contexto):
> I'm a medical student in Barcelona. During hospital rotations the clinical-score calculators I needed were English-only, on dated interfaces, and never showed how the score maps to a recommendation — so I built MedikQuantis.
>
> - 48 calculators (CHA₂DS₂-VASc, CKD-EPI, SCORE2, MELD, NIHSS, APACHE II…) across 13 specialties
> - Trilingual (Catalan / Spanish / English), localized by a clinician, not machine-translated
> - Each score cites the original paper (PubMed), runs client-side, no tracking/cookies
> - Free REST API (OpenAPI/Swagger), a SMART on FHIR prototype, MIT-licensed, permanent Zenodo DOI
>
> Live: https://medikquantis.me · Code: https://github.com/laurapiro17/medikquantis
>
> Happy to hear feedback on the calculation logic, the FHIR mapping, or the multilingual approach.

**Cuándo:** entre semana, ~15:00-17:00 hora España (mañana en EEUU). Responde rápido a los comentarios las primeras 2h.

---

## 2. Reddit

> Lee las reglas de cada sub (algunos prohíben self-promo o exigen flair). Aporta valor, no solo el link.

### r/medicalschool o r/medicine (inglés)
**Título:** `I built a free, open-source, multilingual clinical calculator site (CHA2DS2-VASc, CKD-EPI, SCORE2… 48 scores) during med school`
**Cuerpo:**
> Got tired of English-only calculator tools with no patient-facing explanation, so I built an open-source one. 48 scores across 13 specialties, in Catalan/Spanish/English, each citing its source paper, with a clinician view and a plain-language patient view. Free REST API too. It's a student side project — would love feedback on accuracy and what scores to add next.
> https://medikquantis.me (code: github.com/laurapiro17/medikquantis, MIT)

### r/medicina / r/MedicinaEsp (español) — TU NICHO
**Título:** `He hecho una web gratuita de calculadoras clínicas en español y catalán (CHA2DS2-VASc, CKD-EPI, SCORE2… 48 escalas)`
**Cuerpo:**
> Soy estudiante de medicina en Barcelona. Me cansé de que MDCalc y demás solo estén en inglés, así que hice MedikQuantis: 48 calculadoras clínicas en español, catalán e inglés, cada una con su referencia (PubMed), modo clínico y modo paciente, gratis y de código abierto. Sin cookies ni rastreo. Acepto feedback y sugerencias de qué escalas añadir.
> https://medikquantis.me

---

## 3. LinkedIn (tu perfil)

**Versión ES:**
> 🩺 He publicado **MedikQuantis**: 48 calculadoras clínicas gratuitas y de código abierto, en **catalán, español e inglés**.
>
> Lo construí durante la carrera, en las rotaciones, porque las herramientas que usaba estaban solo en inglés y nunca explicaban el porqué del resultado. Cada escala cita su artículo original (PubMed), tiene modo clínico y modo paciente, corre en el navegador sin rastreo, y hay una API REST gratuita + un prototipo SMART on FHIR. MIT + DOI permanente en Zenodo.
>
> 👉 https://medikquantis.me · 💻 https://github.com/laurapiro17/medikquantis
>
> Feedback bienvenido — ¿qué escala añadirías?
> #medicina #opensource #saluddigital #FHIR

**Tip:** pon el link en el PRIMER comentario en vez de en el post si quieres más alcance (LinkedIn penaliza enlaces externos en el cuerpo); o déjalo en el post, tú decides.

---

## 4. Directorios / awesome-lists (backlinks de autoridad)

PRs/envíos que puedes hacer (yo te dejo los textos; el envío hazlo tú):
- **AlternativeTo.net** → añadir MedikQuantis como alternativa open-source a *MDCalc* y *MedCalc*.
- **awesome-fhir**, **awesome-healthcare**, **awesome-digital-health** (GitHub) → PR añadiendo una línea en la sección de herramientas/calculadoras:
  `- [MedikQuantis](https://medikquantis.me) — Open-source multilingual (CA/ES/EN) clinical score calculators with a free REST API and SMART on FHIR support. [MIT]`
- **Product Hunt** → lanzamiento (elige un martes-jueves; prepara 3-4 imágenes).
- **libhunt / openalternative.co** → se nutren de GitHub topics (ya añadidos), pueden recogerla solos.

---

## 5. Académico (lo más potente a largo plazo)
- **Terminar y enviar el paper JOSS** (paper.md ya está en el repo). Al publicarse: backlink de altísima autoridad + citabilidad. Esto solo lo puedes enviar tú.
- Asegúrate de que tu **ORCID** liste MedikQuantis como output con el DOI.
