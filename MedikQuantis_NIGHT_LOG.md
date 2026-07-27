# MedikQuantis — trabajo nocturno 15→16 jun 2026

Resumen de lo que hice mientras dormías. Orden: lo más importante arriba.

## ✅ HECHO (aplicado en producción / tu repo)

### 1. GitHub repo metadata (descubrimiento + backlink correcto)
- **Bug corregido:** la "homepage" del repo apuntaba a `medcalc-cardio.vercel.app` (dominio viejo) → ahora `https://medikquantis.me`.
- **20 topics añadidos** (medical-calculator, clinical-scores, fhir, smart-on-fhir, mdcalc-alternative, multilingual...) → GitHub te indexa en esas categorías.
- **Descripción** actualizada: 48 calcs, CA/ES/EN, REST API, FHIR, DOI, "alternativa open-source a MDCalc".

### 2. README refrescado — MERGED ✅ (PR #21)
Solo afecta al repo (no a la web). Ahora el README tiene: link a la web + badge "live", badge DOI de Zenodo, catálogo real de 48 calcs/13 especialidades, y quitada la copy obsoleta "starting with cardiology". Ya está en `main`.

---

## ⏸️ LISTO Y ESPERÁNDOTE (1 clic para activarlo)

### 3. SEO: títulos localizados — PR #22 ABIERTO, CI VERDE, sin mergear
**Qué hace:** el `<title>` de cada calculadora ahora lleva el término que la gente busca:
- ES/CA: `Calculadora CHA₂DS₂-VASc — …`
- EN: `CHA₂DS₂-VASc Calculator — …`

Es la señal SEO on-page más fuerte y antes NO contenía "calculadora". Aplica a las 48 calcs. Typecheck local ✅ + CI ✅ (Typecheck·Test·Build pass, Vercel preview pass).

**Por qué no lo he desplegado:** el clasificador de seguridad bloqueó el merge a producción (un deploy de código en producción necesita tu OK explícito, no basta el "haz todo"). **Acción tuya (10 seg):** abre https://github.com/laurapiro17/medikquantis/pull/22 y dale a **Merge** → se despliega solo.

---

## 📝 BORRADORES PARA QUE PUBLIQUES TÚ
Ver `MedikQuantis_posts_drafts.md` (Show HN, Reddit ES/EN, LinkedIn, awesome-lists). No he publicado nada de cara al público en tu nombre.

---

## 🔎 Search Console — indexación (HECHO)

**Solicitada indexación** (cola prioritaria) de:
- `/es/cha2ds2vasc` ✅
- `/es` (home español) ✅
- `/es/ckd-epi-2021` ✅

**Ya estaban indexadas** (buena señal, la indexación va arrancando):
- `/ca/cha2ds2vasc` ✅
- `/es/ascvd` ✅

**Pendiente (error transitorio de Google, reintenta tú):**
- `/ca` (home catalán) — dio "Vuelve a intentarlo más tarde". Reintenta: GSC → barra superior → pega la URL → "Solicitar indexación".

Dato bueno: en las últimas inspecciones Google YA detecta el sitemap y los enlaces internos (`Página de referencia` con varias URLs) — antes no. La indexación está progresando, solo es lenta (normal en dominio nuevo).

---

## ☀️ QUÉ HACER TÚ POR LA MAÑANA (orden de impacto)

1. **Merge del PR #22** (10 seg) → https://github.com/laurapiro17/medikquantis/pull/22 → despliega los títulos SEO en CA/ES. *(Lo dejé verde, solo me faltó permiso para desplegar a producción.)*
2. **Enviar el paper JOSS** — el backlink/autoridad más potente. Solo puedes tú.
3. **Publicar 1-2 posts** de `MedikQuantis_posts_drafts.md` (Show HN y/o Reddit r/medicina).
4. Reintentar indexación de `/ca` y pedir las que falten (`/en`, `/es/gcs`, `/es/score2`…).
5. (Cuando estemos juntas) escribir el **contenido clínico long-tail en ES** de las 5-10 calcs top — NO lo hice solo porque dijiste que la precisión médica la revisas tú.

Plan completo: `MedikQuantis_SEO_plan.md`. Borradores: `MedikQuantis_posts_drafts.md`.
