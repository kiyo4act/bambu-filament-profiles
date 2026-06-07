# Bambu Filament Profiles

Reviewable Bambu Studio filament profiles with generated `.bbsflmt` release bundles.

This repository is built for ongoing maintenance by a coding agent:

- JSON under `vendors/<vendor>/profiles/` is the source of truth.
- `.bbsflmt` files are generated artifacts for GitHub Releases.
- Upstream repositories can be monitored and converted into PRs.
- User-made or third-party profiles can be dropped into `incoming/<vendor>/` and normalized.

## Current Vendors

<!-- PROFILE_TABLE_START -->

| Vendor | Material | Type | Profiles | Release artifact |
|---|---|---:|---:|---|
| TINMORRY | TINMORRY ABS Pro | ABS | 8 | dist/bbsflmt/tinmorry/TINMORRY ABS Pro.bbsflmt |
| TINMORRY | TINMORRY ASA | ASA | 5 | dist/bbsflmt/tinmorry/TINMORRY ASA.bbsflmt |
| TINMORRY | TINMORRY ASA Basic | ASA | 1 | dist/bbsflmt/tinmorry/TINMORRY ASA Basic.bbsflmt |
| TINMORRY | TINMORRY ASA CF | ASA-CF | 2 | dist/bbsflmt/tinmorry/TINMORRY ASA CF.bbsflmt |
| TINMORRY | TINMORRY Galaxy PETG | PETG | 1 | dist/bbsflmt/tinmorry/TINMORRY Galaxy PETG.bbsflmt |
| TINMORRY | TINMORRY Galaxy PLA | PLA | 2 | dist/bbsflmt/tinmorry/TINMORRY Galaxy PLA.bbsflmt |
| TINMORRY | TINMORRY PA CF | PA-CF | 2 | dist/bbsflmt/tinmorry/TINMORRY PA CF.bbsflmt |
| TINMORRY | TINMORRY PAHT CF | PAHT-CF | 2 | dist/bbsflmt/tinmorry/TINMORRY PAHT CF.bbsflmt |
| TINMORRY | TINMORRY PC GF | PC-GF | 4 | dist/bbsflmt/tinmorry/TINMORRY PC GF.bbsflmt |
| TINMORRY | TINMORRY PET CF | PET-CF | 5 | dist/bbsflmt/tinmorry/TINMORRY PET CF.bbsflmt |
| TINMORRY | TINMORRY PET GF | PET-GF | 5 | dist/bbsflmt/tinmorry/TINMORRY PET GF.bbsflmt |
| TINMORRY | TINMORRY PETG CF | PETG-CF | 12 | dist/bbsflmt/tinmorry/TINMORRY PETG CF.bbsflmt |
| TINMORRY | TINMORRY PETG ECO | PETG | 11 | dist/bbsflmt/tinmorry/TINMORRY PETG ECO.bbsflmt |
| TINMORRY | TINMORRY PETG GF | PETG-GF | 12 | dist/bbsflmt/tinmorry/TINMORRY PETG GF.bbsflmt |
| TINMORRY | TINMORRY PETG HS | PETG | 5 | dist/bbsflmt/tinmorry/TINMORRY PETG HS.bbsflmt |
| TINMORRY | TINMORRY PETG Marble | PETG | 11 | dist/bbsflmt/tinmorry/TINMORRY PETG Marble.bbsflmt |
| TINMORRY | TINMORRY PETG Matte | PETG | 1 | dist/bbsflmt/tinmorry/TINMORRY PETG Matte.bbsflmt |
| TINMORRY | TINMORRY PETG Metallic | PETG | 10 | dist/bbsflmt/tinmorry/TINMORRY PETG Metallic.bbsflmt |
| TINMORRY | TINMORRY PLA | PLA | 6 | dist/bbsflmt/tinmorry/TINMORRY PLA.bbsflmt |
| TINMORRY | TINMORRY PLA CF | PLA-CF | 7 | dist/bbsflmt/tinmorry/TINMORRY PLA CF.bbsflmt |
| TINMORRY | TINMORRY PLA Matte | PLA | 10 | dist/bbsflmt/tinmorry/TINMORRY PLA Matte.bbsflmt |
| TINMORRY | TINMORRY PLA Rapid | PLA | 2 | dist/bbsflmt/tinmorry/TINMORRY PLA Rapid.bbsflmt |
| TINMORRY | TINMORRY PLA Silk | PLA | 8 | dist/bbsflmt/tinmorry/TINMORRY PLA Silk.bbsflmt |
| TINMORRY | TINMORRY PP CF | PP-CF | 5 | dist/bbsflmt/tinmorry/TINMORRY PP CF.bbsflmt |
| TINMORRY | TINMORRY Sparkly PETG | PETG | 2 | dist/bbsflmt/tinmorry/TINMORRY Sparkly PETG.bbsflmt |
| TINMORRY | TINMORRY TPU | TPU | 6 | dist/bbsflmt/tinmorry/TINMORRY TPU.bbsflmt |
| TINMORRY | TINMORRY TPU 95A | TPU | 5 | dist/bbsflmt/tinmorry/TINMORRY TPU 95A.bbsflmt |
| TINMORRY | TINMORRY TPU GF | TPU-GF | 4 | dist/bbsflmt/tinmorry/TINMORRY TPU GF.bbsflmt |

<!-- PROFILE_TABLE_END -->

## Basic Workflow

```powershell
npm ci
npm run vendor:status -- --vendor tinmorry
npm run vendor:update -- --vendor tinmorry
npm run verify
npm run build:bbsflmt
```

See [operations](docs/operations.md) and [vendor onboarding](docs/vendor-onboarding.md) for the agent workflow.

