# Contributing to MedikQuantis

Thanks for your interest in MedikQuantis. Contributions — bug reports, new
calculators, translations, and fixes — are welcome.

## Reporting issues and seeking support

- **Bugs and clinical inaccuracies:** open an issue on
  [GitHub](https://github.com/laurapiro17/medikquantis/issues) describing the
  calculator, the input, the result you got, and the result you expected (with a
  reference where relevant). Clinical-accuracy reports are especially valued —
  please cite the source.
- **Questions / support:** open a GitHub issue with the `question` label.

## Proposing a new calculator

Open an issue first describing the score, its original publication (with PMID),
the formula, the decision thresholds, and the guideline that recommends it. A
calculator is only added when its formula, cut-offs and references can be
attributed to the primary literature.

## Development

```bash
pnpm install
pnpm dev            # run the app locally
pnpm -r typecheck   # type-check all packages
pnpm -r test        # run the unit tests
pnpm lint:i18n      # verify translation parity across ca/es/en
```

Each calculator lives in `packages/calculators` with deterministic unit tests
for its formula and interpretation; UI lives in `apps/web`. Please add or update
tests for any change to calculation logic, and keep the three locales in parity.

## Pull requests

Open a PR against `main` with a clear description. CI runs type-checking, the
i18n parity check and a production build. By contributing you agree that your
contributions are licensed under the project's MIT License.

## Code of conduct

Participation in this project is governed by the
[Code of Conduct](CODE_OF_CONDUCT.md).
