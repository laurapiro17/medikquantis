# MedikQuantis — Launch assets (20 jun 2026)

Copy lista para publicar. Objetivo: conseguir los **primeros backlinks + tráfico** que rompan el muro de "0 páginas indexadas". Orden recomendado: Show HN → awesome-lists → Product Hunt (un día con tiempo para responder comentarios).

Hechos verificados (úsalos tal cual, son ciertos): 49 calculadoras · 16 especialidades · CA/ES/EN localizado por una clínica · modo clínico + modo paciente · API REST libre (OpenAPI) · SMART on FHIR · servidor MCP · MIT · DOI Zenodo 10.5281/zenodo.20562617.

---

## 1) Show HN (news.ycombinator.com/submit)

**Title** (≤80 chars, sin emojis, así lo quiere HN):
```
Show HN: Open-source clinical calculators in Catalan, Spanish and English
```

**URL:** `https://medikquantis.me`

**Text (primer comentario, lo pones tú nada más publicar):**
```
I'm a medical student in Barcelona. Clinicians here use English-only calculator
tools (MDCalc, MedCalc) with no patient-facing mode and no visible path from
input to recommendation. I built MedikQuantis to fix that for my own languages.

What it is:
- 49 clinical scores across 16 specialties (CHA2DS2-VASc, CKD-EPI 2021, SCORE2,
  MELD-3, NIHSS, GRACE, qSOFA...), localised in Catalan/Spanish/English by a
  clinician rather than machine-translated.
- Dual mode: a compact clinician view and a plain-language patient view on every
  calculator.
- Each score embeds its PubMed reference and surfaces the evidence grade.
- Calculations run client-side, no tracking, no cookies. MIT, with a permanent
  Zenodo DOI.
- Free REST API (OpenAPI/Swagger) and a SMART on FHIR launch, plus an MCP server
  so agents can call the calculators as tools.

It is explicitly NOT a diagnostic tool and not validated in local populations —
the scores are the originals from the authors.

Stack: Next.js monorepo, TypeScript calculators with a 1:1 test per calculator.
Source: https://github.com/laurapiro17/medikquantis

Happy to hear what's missing — especially which scores clinicians want next and
how the patient-mode wording reads to non-native speakers.
```

Notas HN: publica martes–jueves ~09:00 ET (15:00 CET). Responde TODOS los comentarios las primeras 2 h. No pidas upvotes (te penalizan).

---

## 2) Product Hunt

**Name:** MedikQuantis
**Tagline (≤60 chars):**
```
Open-source clinical calculators in 3 languages
```
**Topics:** Health & Fitness, Open Source, Developer Tools, API

**Description:**
```
MedikQuantis is an open, multilingual alternative to MDCalc: 49 clinical
calculators across 16 specialties, localised in Catalan, Spanish and English by
a clinician. Every score has a clinician view and a patient view, embeds its
PubMed reference, and runs client-side with no tracking. Free REST API, SMART on
FHIR, an MCP server for AI agents, MIT-licensed with a Zenodo DOI.
```

**First comment (maker):**
```
Hi PH 👋 I'm a med student in Barcelona. I was tired of sending patients
English-only score tools with no plain-language explanation, so I built the
calculator site I wanted: same maths, two readings (clinician + patient), cited
from the original papers, in my own languages. It's fully open source and free,
including the API. Would love feedback on which calculators to add next.
```

---

## 3) awesome-lists — backlinks de alta autoridad (PRs)

Cada lista es un repo GitHub con muchísima autoridad de dominio; un PR aceptado = backlink fuerte + descubrimiento. Añade una línea, abre PR. Formato típico de línea:

```
- [MedikQuantis](https://medikquantis.me) - Open-source clinical calculators (49 scores, 16 specialties) in Catalan/Spanish/English, with a free REST API, SMART on FHIR and MCP server. `MIT`
```

Targets (orden por encaje):
1. **kakoni/awesome-healthcare** — sección "Medical Calculators / Clinical". Encaje altísimo.
2. **vinta/awesome-python** ❌ (no aplica). En su lugar → **awesome-fhir** (búscalo: `topic:fhir awesome`) por el SMART on FHIR.
3. **punkpeye/awesome-mcp-servers** y **wong2/awesome-mcp-servers** — tienes servidor MCP, encaje directo. Línea enfocada al MCP server.
4. **awesome-selfhosted/awesome-selfhosted** — sí corre self-hosted (es OSS desplegable). Sección Medical/Health.
5. **agarrharr/awesome-cli-apps** ❌. En su lugar busca **awesome-open-source-healthcare** / **awesome-digital-health**.
6. Listas "MDCalc alternatives" / directorios de herramientas médicas open source (busca en GitHub `medical calculators awesome`).

Método por PR: fork → edita el README en la sección correcta (orden alfabético si la lista lo pide) → PR con título "Add MedikQuantis" y 1 frase de por qué encaja. Lee CONTRIBUTING de cada lista (algunas exigen que el proyecto tenga X estrellas / licencia / no esté abandonado — cumples MIT + activo).

---

## 4) Otros backlinks gratis (rápidos)
- **JOSS** (Journal of Open Source Software): el paper ya está en `paper/`. Submission = revisión abierta en GitHub + DOI citable + backlink académico. El de mayor valor a largo plazo.
- **r/medicine**, **r/medicalschool**, **r/cardiology** (post honesto "I built…", no spam), foros médicos ES/CAT.
- **Zenodo** record → enlaza a medikquantis.me y al repo (refuerza).
- **OpenAlex / Papers with Code** si encaja vía el paper.
- Wikipedia (con cuidado, sin autopromo): en artículos de scores concretos, sección "External links", solo donde aporte (p. ej. ca.wikipedia).

---

## 5) Paso cero — indexación (necesita tu navegador, lo hacemos juntos)
Google Search Console → propiedad medikquantis.me → Sitemaps → enviar `https://medikquantis.me/sitemap.xml` → Inspección de URL → "Solicitar indexación" para las 10 páginas top (home /ca /es /en + cha2ds2vasc, ckd-epi-2021, score2, meld-3, nihss, grace). Sin esto, nada de lo anterior aparece en Google.
