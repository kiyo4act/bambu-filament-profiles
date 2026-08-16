# TINMORRY Decision Log

This file records prior AI/user decisions. It is not an automatic normalization rule file.

## Confirmed Prior Decisions

- Keep `PET` and `PETG` as separate material families.
- Treat `PET CF GF` style source labels as a split candidate, not as a single merged family.
- Do not infer `A1` from `A1 mini`, or `X1` from `X1C`/`X1 Carbon`.
- Make the visible Bambu Studio vendor `TINMORRY` for normalized profiles.
- Commit only normalized JSON. Generate `.bbsflmt` bundles from committed JSON in release workflows.

## 2026-08-16 Update Decisions

- Treat the 125 supported-format profiles collected from the two repositories in `sources.yml` as configured upstream inputs, not as manually supplied `incoming/` files.
- Accept the BambuStudio upstream update at `59dd16f4a7b5530257d585228674a033ff1ceb80`, including the H2S PETG-CF replacement values.
- Promote `X2D/0.4mm/TINMORRY GALAXY PETG.zip` (profile hash `66447752ba202b52d991104fc8cc0078b5771bd8`) into the existing `galaxy-petg/x2d` family.
- Keep the calibrated `petg-matte/h2c/nozzle-0.4.json` from commit `d9a2d41` while no equivalent H2C profile exists in the configured upstream inputs. If an upstream profile later targets the same normalized output, compare it explicitly instead of silently preferring either version.

## How To Use This Log

When a future upstream or incoming update contains the same observed source labels and hashes, AI can reuse the prior decision without asking again. When the source text, affected files, or target family/printer/nozzle changes, AI should produce a fresh `decision-requests.md` item and ask before committing normalized JSON.
