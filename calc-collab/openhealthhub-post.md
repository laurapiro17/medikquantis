Title: MedikQuantis - an open, multilingual set of clinical calculators

Hi everyone,

I wanted to introduce a project I've been building, MedikQuantis (https://medikquantis.me): a free, open-source collection of validated clinical calculators. It currently covers around fifty scores, including CHA₂DS₂-VASc, CKD-EPI, SCORE2, MELD and NIHSS.

It started because I wanted validated scores that were actually usable at the bedside, and it grew from there. A few things that make it a bit different from the usual calculator sites:

- Every score is cited from the original paper, not from a secondary source.
- It's trilingual (Catalan, Spanish and English). Most open calculators are English-only, and that gap matters more than it sounds.
- There's a free REST API and SMART on FHIR support, so it can be embedded rather than just visited.
- The whole thing is MIT-licensed and has a permanent Zenodo DOI.

If you work on clinical decision tools, terminology, or anything in this space, I'd genuinely like to hear how you handle the boring-but-important parts: keeping scores in sync with guideline updates, citing sources properly, and validating across languages. And if any of the calculators would be useful to you, they're all open.

Laura
