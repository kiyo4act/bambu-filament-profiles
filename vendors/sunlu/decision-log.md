# SUNLU Decision Log

This file records prior AI/user decisions. It is not an automatic normalization rule file.

## Confirmed Prior Decisions

- Make the visible Bambu Studio vendor `SUNLU` for normalized profiles.
- Treat files dropped directly under `incoming/` as manual SUNLU inputs when the workflow is run with `--vendor sunlu`.
- Keep the source-provided SUNLU product family names visible in Bambu Studio instead of collapsing them to generic material names.
- Do not synthesize missing printer/nozzle combinations. Commit only combinations present in accepted inputs.

## Confirmed Family Mapping

| Input family | Normalized family | filament_type | Path family key |
|---|---|---|---|
| ASA BASIC | SUNLU ASA BASIC | ASA | asa-basic |
| PETG BASIC | SUNLU PETG BASIC | PETG | petg-basic |
| PETG HS Matte | SUNLU PETG HS Matte | PETG | petg-hs-matte |
| PLA + | SUNLU PLA + | PLA | pla-plus |
| PLA + 2.0 | SUNLU PLA + 2.0 | PLA | pla-plus-2-0 |
| PLA + Silk | SUNLU PLA + Silk | PLA | pla-plus-silk |
| PLA Marble | SUNLU PLA Marble | PLA | pla-marble |
| PLA Matte | SUNLU PLA Matte | PLA | pla-matte |
| PLA Wood | SUNLU PLA Wood | PLA | pla-wood |

## How To Use This Log

When a future incoming update contains the same observed SUNLU family names, AI can reuse these decisions as context. When source text, affected files, family names, printer names, or nozzle coverage changes, AI should produce a fresh `decision-requests.md` item and ask before committing normalized JSON.
