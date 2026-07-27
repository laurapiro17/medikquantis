# MedikQuantis — Awesome Lists PR Package & Submissions Guide

This document contains pre-formatted lines, section targets, and instructions for submitting Pull Requests to high-authority GitHub Awesome Lists. Adding MedikQuantis to these lists creates valuable, high-domain-authority backlinks to `https://medikquantis.me` and drives developer and clinical adoption.

---

## 1. `kakoni/awesome-healthcare` (GitHub Domain Authority > 80)
- **Target File**: `README.md`
- **Target Section**: `### Clinical Calculators / Decision Support`
- **PR Title**: `Add MedikQuantis clinical calculator engine`
- **Markdown Line to Insert** (maintain alphabetical order):
```markdown
- [MedikQuantis](https://medikquantis.me) - Open-source clinical calculators (49 scores across 16 specialties) in Catalan, Spanish, and English with client-side execution, REST API, SMART on FHIR, and MCP support. `MIT`
```
- **PR Body**:
```markdown
Hi! I'm submitting MedikQuantis, an open-source clinical calculator engine built as a multilingual, client-side alternative to MDCalc. It includes 49 validated scores (CHA2DS2-VASc, CKD-EPI 2021, SCORE2, NIHSS, MELD 3.0), embeds PubMed citations, and features SMART on FHIR and MCP AI agent interfaces. Licensed under MIT with a permanent Zenodo DOI.
```

---

## 2. `punkpeye/awesome-mcp-servers` & `wong2/awesome-mcp-servers`
- **Target File**: `README.md`
- **Target Section**: `### Healthcare & Science` or `### Medical / Tools`
- **PR Title**: `Add MedikQuantis MCP Server for clinical score execution`
- **Markdown Line to Insert**:
```markdown
- [MedikQuantis MCP Server](https://github.com/laurapiro17/medikquantis) - Model Context Protocol (MCP) server providing 49 clinical calculator tools (CHA2DS2-VASc, CKD-EPI, SCORE2, NIHSS) for LLM agents with 100% mathematical precision. `MIT`
```
- **PR Body**:
```markdown
Adds the MedikQuantis MCP Server. It enables AI agents and assistants (Claude Desktop, Cursor, Custom Agents) to execute validated clinical score calculations deterministically instead of hallucinating mathematical formulas.
```

---

## 3. `awesome-fhir` (Search GitHub topic: `topic:fhir awesome`)
- **Target File**: `README.md`
- **Target Section**: `### SMART on FHIR Apps / Clinical Decision Support`
- **PR Title**: `Add MedikQuantis - Multilingual SMART on FHIR Clinical Calculators`
- **Markdown Line to Insert**:
```markdown
- [MedikQuantis](https://medikquantis.me) - Trilingual (CA/ES/EN) SMART on FHIR clinical calculator suite with client-side execution and open REST API. `MIT`
```

---

## 4. `awesome-selfhosted/awesome-selfhosted`
- **Target File**: `README.md`
- **Target Section**: `Software Walkthroughs -> Human Biology & Health`
- **PR Title**: `Add MedikQuantis`
- **Markdown Line to Insert**:
```markdown
- [MedikQuantis](https://medikquantis.me) - Multilingual clinical score calculator engine with dual clinician/patient views, PubMed citations, and SMART on FHIR launch. ([Source Code](https://github.com/laurapiro17/medikquantis)) `MIT` `Nodejs`
```

---

## Step-by-Step Submission Instructions

1. **Fork** the target repository on GitHub.
2. **Edit `README.md`** on GitHub directly or via git, inserting the line into the correct section maintaining alphabetical order if required by the repo's `CONTRIBUTING.md`.
3. **Commit** with a clear commit message (e.g. `docs: add MedikQuantis`).
4. **Open Pull Request** using the pre-formatted PR Title and PR Body above.
