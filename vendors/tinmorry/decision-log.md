# TINMORRY Decision Log

This file records prior AI/user decisions. It is not an automatic normalization rule file.

## Confirmed Prior Decisions

- Keep `PET` and `PETG` as separate material families.
- Treat `PET CF GF` style source labels as a split candidate, not as a single merged family.
- Do not infer `A1` from `A1 mini`, or `X1` from `X1C`/`X1 Carbon`.
- Make the visible Bambu Studio vendor `TINMORRY` for normalized profiles.
- Commit only normalized JSON. Generate `.bbsflmt` bundles from committed JSON in release workflows.

## How To Use This Log

When a future upstream or incoming update contains the same observed source labels and hashes, AI can reuse the prior decision without asking again. When the source text, affected files, or target family/printer/nozzle changes, AI should produce a fresh `decision-requests.md` item and ask before committing normalized JSON.
