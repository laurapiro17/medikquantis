---
title: "MedikQuantis: An open, multilingual and machine-accessible platform of verifiable clinical calculators"
tags:
  - clinical decision support
  - medical informatics
  - clinical calculators
  - risk scores
  - SMART on FHIR
  - large language models
  - TypeScript
authors:
  - name: Laura Piñero Roig
    orcid: 0009-0008-3390-4029
    affiliation: 1
affiliations:
  - name: School of Medicine, University of Barcelona, Barcelona, Spain
    index: 1
date: 13 June 2026
bibliography: paper.bib
---

# Summary

`MedikQuantis` is an open-source platform that implements 49 validated clinical
calculators and risk scores across 16 specialties, each localised to Catalan,
Spanish and English. Every calculator reproduces the formula and decision
thresholds exactly as published by the score's original authors, and links the
primary literature through its PubMed identifier (PMID), so that any result is
traceable to its source. The same calculation logic is exposed three ways: an
interactive web application ([medikquantis.me](https://medikquantis.me)), an
open and documented HTTP API (with an OpenAPI specification), and a Model
Context Protocol (MCP) server through which large-language-model agents can
compute scores as tool calls. A SMART on FHIR launch lets the application read a
patient's demographics and problem list directly from an electronic health
record (EHR) to pre-populate a score. The implementation is written in
TypeScript, runs entirely client-side (no patient data is collected or
transmitted), is covered by deterministic unit tests, and is released under the
MIT licence.

# Statement of need

Clinical scores such as CHA2DS2-VASc [@lip2010] are part of routine,
guideline-directed care [@vangelder2024], and
clinicians compute dozens of them daily. The widely used tools for this task are
proprietary, English-centric, login-walled, and — critically — not
machine-accessible: their calculation logic cannot be called by other software.
Two gaps follow.

First, **language and openness**. Hundreds of millions of clinicians and
students work in languages other than English and cannot easily reuse, audit or
build on closed calculators. `MedikQuantis` provides open, MIT-licensed,
multilingual implementations whose source, formulas and citations can be
inspected and reused.

Second, and more urgently, **machine access for medical AI**. LLM-based clinical
assistants are increasingly asked to compute scores, but performing the
arithmetic inside the model is error-prone and unverifiable — wrong cut-offs and
fabricated thresholds are a known failure mode. What such systems need is a
deterministic, openly auditable, citation-bearing calculation back-end they can
call. `MedikQuantis` is, to our knowledge, the first clinical-calculator
collection to publish its logic simultaneously as a human web application, an
open REST API, and an MCP server [@anthropic2024mcp], returning the score, the
risk interpretation, and the primary references for every computation. The
SMART on FHIR [@mandel2016] launch closes the loop to the EHR, demonstrating
zero-entry scoring from real patient data.

The intended audience is therefore twofold: clinicians and medical students who
need fast, multilingual, verifiable scoring at the point of care; and
developers and researchers building decision-support or LLM-based clinical tools
who need an open, reproducible calculation layer rather than a closed product.

# Functionality

- **Calculators.** 49 scores across cardiology, nephrology, emergency medicine,
  intensive care, and other specialties, each with a clinician and a
  patient-facing view, computed live in the browser.
- **Open API.** `GET /api/v1` lists calculators; `GET /api/v1/{id}` returns the
  input JSON Schema and references; `POST /api/v1/{id}` (and `/batch`) computes
  results with localised interpretations and PMID-linked citations.
- **MCP server.** A stateless Model Context Protocol server exposes the API as
  agent tools (`list_calculators`, `describe_calculator`, `calculate`,
  `calculate_batch`), so an AI assistant can discover and compute scores with
  traceable evidence.
- **SMART on FHIR.** A standards-based EHR launch fetches `Patient` and
  `Condition` resources and maps them to a calculator's inputs, verified against
  the public SMART Health IT sandbox.
- **Engineering.** Installable progressive web app with offline support,
  schema.org structured data, and deterministic unit tests for every
  calculator's formula and interpretation.

# Quality control

Each calculator's formula and interpretation are covered by deterministic unit
tests. Localisation parity across the three languages is enforced by an
automated check. The FHIR-to-score mapping is unit-tested independently of the
network layer.

# Acknowledgements

The author thanks the SMART Health IT project for the public FHIR sandbox used
to develop and verify the EHR launch.

# References
