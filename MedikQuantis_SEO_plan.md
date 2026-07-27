# MedikQuantis — Plan para salir en las búsquedas

**Diagnóstico (15 jun 2026):** el SEO técnico está perfecto (canonical, hreflang, JSON-LD, sitemap, sin `noindex`). El problema NO es la web ni la posición — es que Google apenas ha **indexado** el sitio. Dominio de ~6 días + **cero autoridad** → Google rastrea pero retrasa la indexación ("Rastreada: actualmente sin indexar"). `/ca/cha2ds2vasc` ya está dentro; la mayoría no. Esto se arregla con **autoridad (backlinks) + tiempo + distribución**, no con más ajustes de SEO.

**Ventaja clave:** MDCalc/QxMD NO existen en catalán ni español. Ese es el hueco real a conquistar.

---

## 1. Pedir indexación (quick win — repetir cada pocas semanas)

GSC → barra superior "Inspeccionar URL" → escribir URL → "Solicitar indexación".

- [x] `/es/cha2ds2vasc` (solicitada 15 jun)
- [x] `/es` home (solicitada 15 jun)
- [x] `/ca/cha2ds2vasc` (ya indexada)
- [ ] `/es/ckd-epi-2021`, `/es/ascvd`, `/es/score2` (los que ya reciben impresiones)
- [ ] `/`, `/ca`, `/en` (las 3 homes)
- [ ] Las 3-4 calculadoras más buscadas en CA

Límite Google ~10-12/día. Es un empujón menor; lo que de verdad mueve es lo de abajo.

## 2. Backlinks (LA palanca de fondo — por orden de facilidad/valor)

Cada enlace desde un dominio con autoridad le dice a Google "indexa esto, importa".

| Fuente | Acción | Valor |
|---|---|---|
| **Paper JOSS** | Terminar y enviar la submission (ya está el paper.md). Al publicarse → backlink de altísima autoridad + DOI + citabilidad | ⭐⭐⭐⭐⭐ |
| **Zenodo** | El registro ya existe (DOI 10.5281/zenodo.20562617). Asegurar que el README/landing enlaza a medikquantis.me y viceversa | ⭐⭐⭐⭐ |
| **GitHub** | README con link a la web + badges; añadir `topics` (medical-calculator, clinical-scores, fhir, healthcare); pedir inclusión en awesome-lists (awesome-fhir, awesome-healthcare, awesome-digital-health) | ⭐⭐⭐⭐ |
| **ORCID** | Añadir MedikQuantis como "work"/research output con la URL | ⭐⭐⭐ |
| **Perfil UB / departamento** | Si puedes, que aparezca en una página de la facultad o de un grupo | ⭐⭐⭐⭐ (los .edu pesan mucho) |
| **Directorios** | Product Hunt, AlternativeTo (como alternativa a MDCalc), directorios de herramientas médicas open-source | ⭐⭐⭐ |
| **LinkedIn / web personal** | Tu portfolio (portfolio-laura) y LinkedIn enlazando a la web | ⭐⭐ |

## 3. Enfoque multilingüe CA/ES (donde puedes ser #1)

- Los `<title>` y el contenido long-tail de cada calc deben llevar el término que la gente busca en ES/CA: p.ej. "Calculadora CHA₂DS₂-VASc en español", "Calculadora CKD-EPI 2021", "Escala de Glasgow calculadora".
- Auditar con qué términos exactos se busca cada score en ES/CA (Google autocomplete, "búsquedas relacionadas").
- El bloque de contenido long-tail ya existe para CHA₂DS₂-VASc → priorizar escribir el de las 5-10 calcs más buscadas EN ESPAÑOL primero (no en inglés, donde MDCalc gana siempre).
- Páginas tipo "X vs Y" en español (ya hay /compare CHA2DS2-VASc vs HAS-BLED) → replicar para otros pares.

## 4. Distribución directa (tráfico sin depender de Google + genera backlinks naturales)

- **Reddit**: r/medicina (español), r/MedicinaEsp, r/medicalschool, r/medicine — compartir como herramienta gratis/open-source (sin spamear; aportar en hilos donde encaje).
- **Comunidades de estudiantes de medicina** España/LatAm (Telegram, foros, grupos de la UB).
- **Twitter/X médico** y LinkedIn: post "he construido X calculadoras clínicas multilingües, gratis y open-source".
- **Hacker News** (Show HN): encaja por ser open-source + API + DOI + SMART on FHIR. Un buen hilo = pico de tráfico + backlinks.
- Cada vez que alguien la comparte/enlaza = señal de autoridad → acelera la indexación.

---

## Expectativa realista

- **Semanas 1-4:** Google va indexando poco a poco. Tráfico casi nulo. Normal.
- **Mes 2-3:** con 3-5 backlinks buenos + paper JOSS, la indexación se acelera y empiezas a rankear en CA/ES long-tail.
- **No esperar** ganar a MDCalc en inglés a corto/medio plazo. El objetivo es ser EL recurso de calculadoras clínicas en catalán/español.

**Métrica a vigilar:** GSC → Indexación → "Páginas indexadas" subiendo, y Vercel Analytics (ya activado) para visitas reales.
