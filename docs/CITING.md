# Citing MedikQuantis

If you use MedikQuantis in academic work, please cite the software in your
**Methods** section. This page gives you ready-to-paste paragraphs and a
BibTeX entry.

GitHub renders the [`CITATION.cff`](../CITATION.cff) file natively (look for
the "Cite this repository" button on the repo page), and reference managers
like Zotero and EndNote import it automatically.

## Methods boilerplate (paste into your paper)

Replace `vX.Y.Z` with the exact version you used, and the DOI with the one
issued by Zenodo for that release (see https://zenodo.org/record/<id>).

### English

> Score calculations were performed using MedikQuantis v1.0.0
> (https://github.com/laurapiro17/medikquantis, MIT license,
> DOI: 10.5281/zenodo.<RECORD_ID>), an open-source TypeScript
> implementation of clinical risk scores with deterministic unit
> tests against the original derivation cohorts.

### Català

> Els càlculs de puntuacions es van fer amb MedikQuantis v1.0.0
> (https://github.com/laurapiro17/medikquantis, llicència MIT,
> DOI: 10.5281/zenodo.<ID_REGISTRE>), una implementació open-source
> en TypeScript de puntuacions clíniques amb tests unitaris
> deterministes contra les cohorts originals de derivació.

### Castellano

> Los cálculos de puntuaciones se realizaron con MedikQuantis v1.0.0
> (https://github.com/laurapiro17/medikquantis, licencia MIT,
> DOI: 10.5281/zenodo.<ID_REGISTRO>), una implementación open-source
> en TypeScript de puntuaciones clínicas con tests unitarios
> deterministas contra las cohortes originales de derivación.

## BibTeX

```bibtex
@software{pineroroig_medikquantis_2026,
  author       = {Piñero Roig, Laura},
  title        = {{MedikQuantis: Multilingual clinical calculators
                   with patient-mode explanations}},
  year         = {2026},
  publisher    = {Zenodo},
  version      = {v1.0.0},
  doi          = {10.5281/zenodo.<RECORD_ID>},
  url          = {https://github.com/laurapiro17/medikquantis}
}
```

## When the version matters

Always cite the **specific version** you used. Versions are immutable in
Zenodo, but the latest version of the codebase may differ. This protects
the reproducibility of your paper if MedikQuantis later changes a tier
threshold or a recommendation text after a guideline update.
