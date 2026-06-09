# Bambu Filament Profiles

Reviewable Bambu Studio filament profiles with generated `.bbsflmt` release bundles.

This repository is built for ongoing maintenance by a coding agent:

- JSON under `vendors/<vendor>/profiles/` is the source of truth.
- `.bbsflmt` files are generated as vendor/printer/material-scoped artifacts for GitHub Releases, with nozzle variants for the same printer and material bundled together.
- Upstream repositories can be monitored, collected, diffed, and reviewed locally by AI.
- User-made or third-party profiles can be dropped directly into `incoming/` and reviewed through the same diff/proposal workflow by passing `--vendor <vendor>`.
- GitHub Actions package committed JSON into user-facing archives; they do not decide normalization.
- Update branches under `agent/update/**` create candidate prereleases automatically; the agent then opens a PR for human import testing and merge review.

## Current Vendors

<!-- PROFILE_TABLE_START -->

| Vendor | Bundles | Materials | Printers | Profiles |
|---|---:|---:|---:|---:|
| eSUN | 507 | 66 | 11 | 572 |
| Polymaker | 503 | 66 | 12 | 503 |
| SUNLU | 18 | 9 | 2 | 63 |
| TINMORRY | 154 | 28 | 12 | 155 |

<details>
<summary>eSUN details: 507 bundles, 66 materials, 11 printers, 572 profiles</summary>

### Bambu Lab A1

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | eSUN PEBA-85A | TPU | 1 | dist/bbsflmt/esun/a1/eSUN PEBA-85A.bbsflmt |
| 0.4 | eSUN PEBA-90A | TPU | 1 | dist/bbsflmt/esun/a1/eSUN PEBA-90A.bbsflmt |
| 0.4 | eSUN PEBA-LW | TPU | 1 | dist/bbsflmt/esun/a1/eSUN PEBA-LW.bbsflmt |
| 0.4 | eSUN PETG | PETG | 1 | dist/bbsflmt/esun/a1/eSUN PETG.bbsflmt |
| 0.4 | eSUN PETG-Basic | PETG | 1 | dist/bbsflmt/esun/a1/eSUN PETG-Basic.bbsflmt |
| 0.4 | eSUN PETG-CF | PETG-CF | 1 | dist/bbsflmt/esun/a1/eSUN PETG-CF.bbsflmt |
| 0.4 | eSUN PETG-ESD | PETG | 1 | dist/bbsflmt/esun/a1/eSUN PETG-ESD.bbsflmt |
| 0.4 | eSUN PETG-Luminous | PETG | 1 | dist/bbsflmt/esun/a1/eSUN PETG-Luminous.bbsflmt |
| 0.4 | eSUN PETG-Matte | PETG | 1 | dist/bbsflmt/esun/a1/eSUN PETG-Matte.bbsflmt |
| 0.4 | eSUN PETG+HS | PETG | 1 | dist/bbsflmt/esun/a1/eSUN PETG+HS.bbsflmt |
| 0.4 | eSUN PLA-Basic | PLA | 1 | dist/bbsflmt/esun/a1/eSUN PLA-Basic.bbsflmt |
| 0.4 | eSUN PLA-CF | PLA-CF | 1 | dist/bbsflmt/esun/a1/eSUN PLA-CF.bbsflmt |
| 0.4 | eSUN PLA-Clear | PLA | 1 | dist/bbsflmt/esun/a1/eSUN PLA-Clear.bbsflmt |
| 0.4 | eSUN PLA-HS | PLA | 1 | dist/bbsflmt/esun/a1/eSUN PLA-HS.bbsflmt |
| 0.4 | eSUN PLA-Lite | PLA | 1 | dist/bbsflmt/esun/a1/eSUN PLA-Lite.bbsflmt |
| 0.4 | eSUN PLA-Luminous | PLA | 1 | dist/bbsflmt/esun/a1/eSUN PLA-Luminous.bbsflmt |
| 0.4 | eSUN PLA-LW | PLA | 1 | dist/bbsflmt/esun/a1/eSUN PLA-LW.bbsflmt |
| 0.4 | eSUN PLA-Magic | PLA | 1 | dist/bbsflmt/esun/a1/eSUN PLA-Magic.bbsflmt |
| 0.4 | eSUN PLA-Marble | PLA | 1 | dist/bbsflmt/esun/a1/eSUN PLA-Marble.bbsflmt |
| 0.4 | eSUN PLA-Matte | PLA | 1 | dist/bbsflmt/esun/a1/eSUN PLA-Matte.bbsflmt |
| 0.4 | eSUN PLA-Metal | PLA | 1 | dist/bbsflmt/esun/a1/eSUN PLA-Metal.bbsflmt |
| 0.4 | eSUN PLA-Silk | PLA | 1 | dist/bbsflmt/esun/a1/eSUN PLA-Silk.bbsflmt |
| 0.4 | eSUN PLA-ST | PLA | 1 | dist/bbsflmt/esun/a1/eSUN PLA-ST.bbsflmt |
| 0.4 | eSUN PLA-Twinkle | PLA | 1 | dist/bbsflmt/esun/a1/eSUN PLA-Twinkle.bbsflmt |
| 0.4 | eSUN PLA-Wood | PLA | 1 | dist/bbsflmt/esun/a1/eSUN PLA-Wood.bbsflmt |
| 0.4 | eSUN PLA+ | PLA | 1 | dist/bbsflmt/esun/a1/eSUN PLA+.bbsflmt |
| 0.4 | eSUN PLA+HS | PLA | 1 | dist/bbsflmt/esun/a1/eSUN PLA+HS.bbsflmt |
| 0.4 | eSUN TPE-83A | TPU | 1 | dist/bbsflmt/esun/a1/eSUN TPE-83A.bbsflmt |
| 0.4 | eSUN TPU-64D | TPU | 1 | dist/bbsflmt/esun/a1/eSUN TPU-64D.bbsflmt |
| 0.4 | eSUN TPU-90A | TPU | 1 | dist/bbsflmt/esun/a1/eSUN TPU-90A.bbsflmt |
| 0.4 | eSUN TPU-95A | TPU | 1 | dist/bbsflmt/esun/a1/eSUN TPU-95A.bbsflmt |
| 0.4 | eSUN TPU-LW | TPU | 1 | dist/bbsflmt/esun/a1/eSUN TPU-LW.bbsflmt |
| 0.4 | eSUN UV Rock PLA | PLA | 1 | dist/bbsflmt/esun/a1/eSUN UV Rock PLA.bbsflmt |

### Bambu Lab A1 mini

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | eSUN PEBA-85A | TPU | 1 | dist/bbsflmt/esun/a1-mini/eSUN PEBA-85A.bbsflmt |
| 0.4 | eSUN PEBA-90A | TPU | 1 | dist/bbsflmt/esun/a1-mini/eSUN PEBA-90A.bbsflmt |
| 0.4 | eSUN PEBA-LW | TPU | 1 | dist/bbsflmt/esun/a1-mini/eSUN PEBA-LW.bbsflmt |
| 0.4 | eSUN PETG | PETG | 1 | dist/bbsflmt/esun/a1-mini/eSUN PETG.bbsflmt |
| 0.4 | eSUN PETG-Basic | PETG | 1 | dist/bbsflmt/esun/a1-mini/eSUN PETG-Basic.bbsflmt |
| 0.4 | eSUN PETG-CF | PETG-CF | 1 | dist/bbsflmt/esun/a1-mini/eSUN PETG-CF.bbsflmt |
| 0.4 | eSUN PETG-ESD | PETG | 1 | dist/bbsflmt/esun/a1-mini/eSUN PETG-ESD.bbsflmt |
| 0.4 | eSUN PETG-Luminous | PETG | 1 | dist/bbsflmt/esun/a1-mini/eSUN PETG-Luminous.bbsflmt |
| 0.4 | eSUN PETG+HS | PETG | 1 | dist/bbsflmt/esun/a1-mini/eSUN PETG+HS.bbsflmt |
| 0.4 | eSUN PLA-Basic | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA-Basic.bbsflmt |
| 0.4 | eSUN PLA-CF | PLA-CF | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA-CF.bbsflmt |
| 0.4 | eSUN PLA-Clear | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA-Clear.bbsflmt |
| 0.4 | eSUN PLA-HS | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA-HS.bbsflmt |
| 0.4 | eSUN PLA-Lite | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA-Lite.bbsflmt |
| 0.4 | eSUN PLA-Luminous | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA-Luminous.bbsflmt |
| 0.4 | eSUN PLA-LW | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA-LW.bbsflmt |
| 0.4 | eSUN PLA-Magic | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA-Magic.bbsflmt |
| 0.4 | eSUN PLA-Marble | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA-Marble.bbsflmt |
| 0.4 | eSUN PLA-Matte | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA-Matte.bbsflmt |
| 0.4 | eSUN PLA-Metal | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA-Metal.bbsflmt |
| 0.4 | eSUN PLA-Silk | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA-Silk.bbsflmt |
| 0.4 | eSUN PLA-ST | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA-ST.bbsflmt |
| 0.4 | eSUN PLA-Twinkling | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA-Twinkling.bbsflmt |
| 0.4 | eSUN PLA-Wood | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA-Wood.bbsflmt |
| 0.4 | eSUN PLA+ | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA+.bbsflmt |
| 0.4 | eSUN PLA+HS | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN PLA+HS.bbsflmt |
| 0.4 | eSUN TPE-83A | TPU | 1 | dist/bbsflmt/esun/a1-mini/eSUN TPE-83A.bbsflmt |
| 0.4 | eSUN TPU-64D | TPU | 1 | dist/bbsflmt/esun/a1-mini/eSUN TPU-64D.bbsflmt |
| 0.4 | eSUN TPU-90A | TPU | 1 | dist/bbsflmt/esun/a1-mini/eSUN TPU-90A.bbsflmt |
| 0.4 | eSUN TPU-95A | TPU | 1 | dist/bbsflmt/esun/a1-mini/eSUN TPU-95A.bbsflmt |
| 0.4 | eSUN TPU-LW | TPU | 1 | dist/bbsflmt/esun/a1-mini/eSUN TPU-LW.bbsflmt |
| 0.4 | eSUN UV Rock PLA | PLA | 1 | dist/bbsflmt/esun/a1-mini/eSUN UV Rock PLA.bbsflmt |

### Bambu Lab H2C

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | eSUN ABS | ABS | 1 | dist/bbsflmt/esun/h2c/eSUN ABS.bbsflmt |
| 0.4 | eSUN ABS-CF | ABS-GF | 1 | dist/bbsflmt/esun/h2c/eSUN ABS-CF.bbsflmt |
| 0.4 | eSUN ABS-ESD | ABS | 1 | dist/bbsflmt/esun/h2c/eSUN ABS-ESD.bbsflmt |
| 0.4 | eSUN ABS-FR | ABS | 1 | dist/bbsflmt/esun/h2c/eSUN ABS-FR.bbsflmt |
| 0.4 | eSUN ABS-GF | ABS | 1 | dist/bbsflmt/esun/h2c/eSUN ABS-GF.bbsflmt |
| 0.4 | eSUN ABS+ | ABS | 1 | dist/bbsflmt/esun/h2c/eSUN ABS+.bbsflmt |
| 0.4 | eSUN ABS+HS | ABS | 1 | dist/bbsflmt/esun/h2c/eSUN ABS+HS.bbsflmt |
| 0.4 | eSUN ASA-LW | ASA | 1 | dist/bbsflmt/esun/h2c/eSUN ASA-LW.bbsflmt |
| 0.4 | eSUN ASA+ | ASA | 1 | dist/bbsflmt/esun/h2c/eSUN ASA+.bbsflmt |
| 0.4 | eSUN PA | PA | 1 | dist/bbsflmt/esun/h2c/eSUN PA.bbsflmt |
| 0.4 | eSUN PA-CF | PA-CF | 1 | dist/bbsflmt/esun/h2c/eSUN PA-CF.bbsflmt |
| 0.4 | eSUN PA12-CF | PA-CF | 1 | dist/bbsflmt/esun/h2c/eSUN PA12-CF.bbsflmt |
| 0.4 | eSUN PA6-CF | PA-CF | 1 | dist/bbsflmt/esun/h2c/eSUN PA6-CF.bbsflmt |
| 0.4 | eSUN PC-ESD | PC | 1 | dist/bbsflmt/esun/h2c/eSUN PC-ESD.bbsflmt |
| 0.4 | eSUN PC-HT | PC | 1 | dist/bbsflmt/esun/h2c/eSUN PC-HT.bbsflmt |
| 0.4 | eSUN PEBA-85A | TPU | 1 | dist/bbsflmt/esun/h2c/eSUN PEBA-85A.bbsflmt |
| 0.4 | eSUN PEBA-90A | TPU | 1 | dist/bbsflmt/esun/h2c/eSUN PEBA-90A.bbsflmt |
| 0.4 | eSUN PEBA-LW | TPU | 1 | dist/bbsflmt/esun/h2c/eSUN PEBA-LW.bbsflmt |
| 0.4 | eSUN PET-CF | PET-CF | 1 | dist/bbsflmt/esun/h2c/eSUN PET-CF.bbsflmt |
| 0.4 | eSUN PETG | PETG | 1 | dist/bbsflmt/esun/h2c/eSUN PETG.bbsflmt |
| 0.4 | eSUN PETG-Basic | PETG | 1 | dist/bbsflmt/esun/h2c/eSUN PETG-Basic.bbsflmt |
| 0.4 | eSUN PETG-CF | PETG-CF | 1 | dist/bbsflmt/esun/h2c/eSUN PETG-CF.bbsflmt |
| 0.4 | eSUN PETG-ESD | PETG | 1 | dist/bbsflmt/esun/h2c/eSUN PETG-ESD.bbsflmt |
| 0.4 | eSUN PETG-Matte | PETG | 1 | dist/bbsflmt/esun/h2c/eSUN PETG-Matte.bbsflmt |
| 0.4 | eSUN PETG+HS | PETG | 1 | dist/bbsflmt/esun/h2c/eSUN PETG+HS.bbsflmt |
| 0.4 | eSUN PLA-Basic | PLA | 1 | dist/bbsflmt/esun/h2c/eSUN PLA-Basic.bbsflmt |
| 0.4 | eSUN PLA-CF | PLA-CF | 1 | dist/bbsflmt/esun/h2c/eSUN PLA-CF.bbsflmt |
| 0.4 | eSUN PLA-Clear | PLA | 1 | dist/bbsflmt/esun/h2c/eSUN PLA-Clear.bbsflmt |
| 0.4 | eSUN PLA-HS | PLA | 1 | dist/bbsflmt/esun/h2c/eSUN PLA-HS.bbsflmt |
| 0.4 | eSUN PLA-Lite | PLA | 1 | dist/bbsflmt/esun/h2c/eSUN PLA-Lite.bbsflmt |
| 0.4 | eSUN PLA-LW | PLA | 1 | dist/bbsflmt/esun/h2c/eSUN PLA-LW.bbsflmt |
| 0.4 | eSUN PLA-Magic | PLA | 1 | dist/bbsflmt/esun/h2c/eSUN PLA-Magic.bbsflmt |
| 0.4 | eSUN PLA-Marble | PLA | 1 | dist/bbsflmt/esun/h2c/eSUN PLA-Marble.bbsflmt |
| 0.4 | eSUN PLA-Matte | PLA | 1 | dist/bbsflmt/esun/h2c/eSUN PLA-Matte.bbsflmt |
| 0.4 | eSUN PLA-Metal | PLA | 1 | dist/bbsflmt/esun/h2c/eSUN PLA-Metal.bbsflmt |
| 0.4 | eSUN PLA-Silk | PLA | 1 | dist/bbsflmt/esun/h2c/eSUN PLA-Silk.bbsflmt |
| 0.4 | eSUN PLA-Twinking | PLA | 1 | dist/bbsflmt/esun/h2c/eSUN PLA-Twinking.bbsflmt |
| 0.4 | eSUN PLA-UV Rock | PLA | 1 | dist/bbsflmt/esun/h2c/eSUN PLA-UV Rock.bbsflmt |
| 0.4 | eSUN PLA-Wood | PLA | 1 | dist/bbsflmt/esun/h2c/eSUN PLA-Wood.bbsflmt |
| 0.4 | eSUN PLA+ | PLA | 1 | dist/bbsflmt/esun/h2c/eSUN PLA+.bbsflmt |
| 0.4 | eSUN PLA+HS | PLA | 1 | dist/bbsflmt/esun/h2c/eSUN PLA+HS.bbsflmt |
| 0.4 | eSUN TPE-83A | TPU | 1 | dist/bbsflmt/esun/h2c/eSUN TPE-83A.bbsflmt |
| 0.4 | eSUN TPU-64D | TPU | 1 | dist/bbsflmt/esun/h2c/eSUN TPU-64D.bbsflmt |
| 0.4 | eSUN TPU-85A | TPU | 1 | dist/bbsflmt/esun/h2c/eSUN TPU-85A.bbsflmt |
| 0.4 | eSUN TPU-90A | TPU | 1 | dist/bbsflmt/esun/h2c/eSUN TPU-90A.bbsflmt |
| 0.4 | eSUN TPU-95A | TPU | 1 | dist/bbsflmt/esun/h2c/eSUN TPU-95A.bbsflmt |
| 0.4 | eSUN TPU-LW | TPU | 1 | dist/bbsflmt/esun/h2c/eSUN TPU-LW.bbsflmt |

### Bambu Lab H2D

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | eSUN ABS | ABS | 1 | dist/bbsflmt/esun/h2d/eSUN ABS.bbsflmt |
| 0.4 | eSUN ABS-CF | ABS-GF | 1 | dist/bbsflmt/esun/h2d/eSUN ABS-CF.bbsflmt |
| 0.4 | eSUN ABS-ESD | ABS | 1 | dist/bbsflmt/esun/h2d/eSUN ABS-ESD.bbsflmt |
| 0.4 | eSUN ABS-FR | ABS | 1 | dist/bbsflmt/esun/h2d/eSUN ABS-FR.bbsflmt |
| 0.4 | eSUN ABS-GF | ABS | 1 | dist/bbsflmt/esun/h2d/eSUN ABS-GF.bbsflmt |
| 0.4 | eSUN ABS+ | ABS | 1 | dist/bbsflmt/esun/h2d/eSUN ABS+.bbsflmt |
| 0.4 | eSUN ABS+HS | ABS | 1 | dist/bbsflmt/esun/h2d/eSUN ABS+HS.bbsflmt |
| 0.4 | eSUN ASA-LW | ASA | 1 | dist/bbsflmt/esun/h2d/eSUN ASA-LW.bbsflmt |
| 0.4 | eSUN ASA+ | ASA | 1 | dist/bbsflmt/esun/h2d/eSUN ASA+.bbsflmt |
| 0.4 | eSUN PA | PA | 1 | dist/bbsflmt/esun/h2d/eSUN PA.bbsflmt |
| 0.4 | eSUN PA-CF | PA-CF | 1 | dist/bbsflmt/esun/h2d/eSUN PA-CF.bbsflmt |
| 0.4 | eSUN PA12+CF | PA-CF | 1 | dist/bbsflmt/esun/h2d/eSUN PA12+CF.bbsflmt |
| 0.4 | eSUN PA6-CF | PA-CF | 1 | dist/bbsflmt/esun/h2d/eSUN PA6-CF.bbsflmt |
| 0.4 | eSUN PC | PC | 1 | dist/bbsflmt/esun/h2d/eSUN PC.bbsflmt |
| 0.4 | eSUN PC-ESD | PC | 1 | dist/bbsflmt/esun/h2d/eSUN PC-ESD.bbsflmt |
| 0.4 | eSUN PEBA-85A | TPU | 1 | dist/bbsflmt/esun/h2d/eSUN PEBA-85A.bbsflmt |
| 0.4 | eSUN PEBA-90A | TPU | 1 | dist/bbsflmt/esun/h2d/eSUN PEBA-90A.bbsflmt |
| 0.4 | eSUN PEBA-LW | TPU | 1 | dist/bbsflmt/esun/h2d/eSUN PEBA-LW.bbsflmt |
| 0.4 | eSUN PET-CF | PET-CF | 1 | dist/bbsflmt/esun/h2d/eSUN PET-CF.bbsflmt |
| 0.4 | eSUN PETG | PETG | 1 | dist/bbsflmt/esun/h2d/eSUN PETG.bbsflmt |
| 0.4 | eSUN PETG Luminous | PETG | 1 | dist/bbsflmt/esun/h2d/eSUN PETG Luminous.bbsflmt |
| 0.4 | eSUN PETG-Basic | PETG | 1 | dist/bbsflmt/esun/h2d/eSUN PETG-Basic.bbsflmt |
| 0.4 | eSUN PETG-CF | PETG-CF | 1 | dist/bbsflmt/esun/h2d/eSUN PETG-CF.bbsflmt |
| 0.4 | eSUN PETG-ESD | PETG | 1 | dist/bbsflmt/esun/h2d/eSUN PETG-ESD.bbsflmt |
| 0.4 | eSUN PETG-Matte | PETG | 1 | dist/bbsflmt/esun/h2d/eSUN PETG-Matte.bbsflmt |
| 0.4 | eSUN PETG+HS | PETG | 1 | dist/bbsflmt/esun/h2d/eSUN PETG+HS.bbsflmt |
| 0.4 | eSUN PLA-Basic | PLA | 1 | dist/bbsflmt/esun/h2d/eSUN PLA-Basic.bbsflmt |
| 0.4 | eSUN PLA-CF | PLA-CF | 1 | dist/bbsflmt/esun/h2d/eSUN PLA-CF.bbsflmt |
| 0.4 | eSUN PLA-Clear | PLA | 1 | dist/bbsflmt/esun/h2d/eSUN PLA-Clear.bbsflmt |
| 0.4 | eSUN PLA-HS | PLA | 1 | dist/bbsflmt/esun/h2d/eSUN PLA-HS.bbsflmt |
| 0.4 | eSUN PLA-Lite | PLA | 1 | dist/bbsflmt/esun/h2d/eSUN PLA-Lite.bbsflmt |
| 0.4 | eSUN PLA-Luminous | PLA | 1 | dist/bbsflmt/esun/h2d/eSUN PLA-Luminous.bbsflmt |
| 0.4 | eSUN PLA-LW | PLA | 1 | dist/bbsflmt/esun/h2d/eSUN PLA-LW.bbsflmt |
| 0.4 | eSUN PLA-Magic | PLA | 1 | dist/bbsflmt/esun/h2d/eSUN PLA-Magic.bbsflmt |
| 0.4 | eSUN PLA-Marble | PLA | 1 | dist/bbsflmt/esun/h2d/eSUN PLA-Marble.bbsflmt |
| 0.4 | eSUN PLA-Matte | PLA | 1 | dist/bbsflmt/esun/h2d/eSUN PLA-Matte.bbsflmt |
| 0.4 | eSUN PLA-Metal | PLA | 1 | dist/bbsflmt/esun/h2d/eSUN PLA-Metal.bbsflmt |
| 0.4 | eSUN PLA-Silk | PLA | 1 | dist/bbsflmt/esun/h2d/eSUN PLA-Silk.bbsflmt |
| 0.4 | eSUN PLA-Twinkle | PLA | 1 | dist/bbsflmt/esun/h2d/eSUN PLA-Twinkle.bbsflmt |
| 0.4 | eSUN PLA-UV Rock | PLA | 1 | dist/bbsflmt/esun/h2d/eSUN PLA-UV Rock.bbsflmt |
| 0.4 | eSUN PLA-Wood | PLA | 1 | dist/bbsflmt/esun/h2d/eSUN PLA-Wood.bbsflmt |
| 0.4 | eSUN PLA+ | PLA | 1 | dist/bbsflmt/esun/h2d/eSUN PLA+.bbsflmt |
| 0.4 | eSUN PLA+HS | PLA | 1 | dist/bbsflmt/esun/h2d/eSUN PLA+HS.bbsflmt |
| 0.4 | eSUN TPE-83A | TPU | 1 | dist/bbsflmt/esun/h2d/eSUN TPE-83A.bbsflmt |
| 0.4 | eSUN TPU-64D | TPU | 1 | dist/bbsflmt/esun/h2d/eSUN TPU-64D.bbsflmt |
| 0.4 | eSUN TPU-85A | TPU | 1 | dist/bbsflmt/esun/h2d/eSUN TPU-85A.bbsflmt |
| 0.4 | eSUN TPU-90A | TPU | 1 | dist/bbsflmt/esun/h2d/eSUN TPU-90A.bbsflmt |
| 0.4 | eSUN TPU-95A | TPU | 1 | dist/bbsflmt/esun/h2d/eSUN TPU-95A.bbsflmt |
| 0.4 | eSUN TPU-LW | TPU | 1 | dist/bbsflmt/esun/h2d/eSUN TPU-LW.bbsflmt |

### Bambu Lab H2S

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | eSUN ABS | ABS | 1 | dist/bbsflmt/esun/h2s/eSUN ABS.bbsflmt |
| 0.4 | eSUN ABS-CF | ABS-GF | 1 | dist/bbsflmt/esun/h2s/eSUN ABS-CF.bbsflmt |
| 0.4 | eSUN ABS-ESD | ABS | 1 | dist/bbsflmt/esun/h2s/eSUN ABS-ESD.bbsflmt |
| 0.4 | eSUN ABS-FR | ABS | 1 | dist/bbsflmt/esun/h2s/eSUN ABS-FR.bbsflmt |
| 0.4 | eSUN ABS-GF | ABS | 1 | dist/bbsflmt/esun/h2s/eSUN ABS-GF.bbsflmt |
| 0.4 | eSUN ABS+ | ABS | 1 | dist/bbsflmt/esun/h2s/eSUN ABS+.bbsflmt |
| 0.4 | eSUN ABS+HS | ABS | 1 | dist/bbsflmt/esun/h2s/eSUN ABS+HS.bbsflmt |
| 0.4 | eSUN ASA-LW | ASA | 1 | dist/bbsflmt/esun/h2s/eSUN ASA-LW.bbsflmt |
| 0.4 | eSUN ASA+ | ASA | 1 | dist/bbsflmt/esun/h2s/eSUN ASA+.bbsflmt |
| 0.4 | eSUN PA | PA | 1 | dist/bbsflmt/esun/h2s/eSUN PA.bbsflmt |
| 0.4 | eSUN PA-CF | PA-CF | 1 | dist/bbsflmt/esun/h2s/eSUN PA-CF.bbsflmt |
| 0.4 | eSUN PA12+CF | PA-CF | 1 | dist/bbsflmt/esun/h2s/eSUN PA12+CF.bbsflmt |
| 0.4 | eSUN PA6-CF | PA-CF | 1 | dist/bbsflmt/esun/h2s/eSUN PA6-CF.bbsflmt |
| 0.4 | eSUN PC-ESD | PC | 1 | dist/bbsflmt/esun/h2s/eSUN PC-ESD.bbsflmt |
| 0.4 | eSUN PC-HT | PC | 1 | dist/bbsflmt/esun/h2s/eSUN PC-HT.bbsflmt |
| 0.4 | eSUN PEBA | TPU | 1 | dist/bbsflmt/esun/h2s/eSUN PEBA.bbsflmt |
| 0.4 | eSUN PEBA-85A | TPU | 1 | dist/bbsflmt/esun/h2s/eSUN PEBA-85A.bbsflmt |
| 0.4 | eSUN PEBA-90A | TPU | 1 | dist/bbsflmt/esun/h2s/eSUN PEBA-90A.bbsflmt |
| 0.4 | eSUN PEBA-LW | TPU | 1 | dist/bbsflmt/esun/h2s/eSUN PEBA-LW.bbsflmt |
| 0.4 | eSUN PET-CF | PET-CF | 1 | dist/bbsflmt/esun/h2s/eSUN PET-CF.bbsflmt |
| 0.4 | eSUN PETG | PETG | 1 | dist/bbsflmt/esun/h2s/eSUN PETG.bbsflmt |
| 0.4 | eSUN PETG-Basic | PETG | 1 | dist/bbsflmt/esun/h2s/eSUN PETG-Basic.bbsflmt |
| 0.4 | eSUN PETG-CF | PETG-CF | 1 | dist/bbsflmt/esun/h2s/eSUN PETG-CF.bbsflmt |
| 0.4 | eSUN PETG-ESD | PETG | 1 | dist/bbsflmt/esun/h2s/eSUN PETG-ESD.bbsflmt |
| 0.4 | eSUN PETG-Luminous | PETG | 1 | dist/bbsflmt/esun/h2s/eSUN PETG-Luminous.bbsflmt |
| 0.4 | eSUN PETG-Matte | PETG | 1 | dist/bbsflmt/esun/h2s/eSUN PETG-Matte.bbsflmt |
| 0.4 | eSUN PETG+HS | PETG | 1 | dist/bbsflmt/esun/h2s/eSUN PETG+HS.bbsflmt |
| 0.4 | eSUN PLA-Basic | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA-Basic.bbsflmt |
| 0.4 | eSUN PLA-CF | PLA-CF | 1 | dist/bbsflmt/esun/h2s/eSUN PLA-CF.bbsflmt |
| 0.4 | eSUN PLA-Clear | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA-Clear.bbsflmt |
| 0.4 | eSUN PLA-HS | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA-HS.bbsflmt |
| 0.4 | eSUN PLA-Lite | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA-Lite.bbsflmt |
| 0.4 | eSUN PLA-Luminous | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA-Luminous.bbsflmt |
| 0.4 | eSUN PLA-LW | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA-LW.bbsflmt |
| 0.4 | eSUN PLA-Magic | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA-Magic.bbsflmt |
| 0.4 | eSUN PLA-Marble | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA-Marble.bbsflmt |
| 0.4 | eSUN PLA-Matte | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA-Matte.bbsflmt |
| 0.4 | eSUN PLA-Metal | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA-Metal.bbsflmt |
| 0.4 | eSUN PLA-Silk | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA-Silk.bbsflmt |
| 0.4 | eSUN PLA-ST | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA-ST.bbsflmt |
| 0.4 | eSUN PLA-Twinkle | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA-Twinkle.bbsflmt |
| 0.4 | eSUN PLA-UV Rock | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA-UV Rock.bbsflmt |
| 0.4 | eSUN PLA-Wood | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA-Wood.bbsflmt |
| 0.4 | eSUN PLA+ | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA+.bbsflmt |
| 0.4 | eSUN PLA+HS | PLA | 1 | dist/bbsflmt/esun/h2s/eSUN PLA+HS.bbsflmt |
| 0.4 | eSUN TPE-83A | TPU | 1 | dist/bbsflmt/esun/h2s/eSUN TPE-83A.bbsflmt |
| 0.4 | eSUN TPU-64D | TPU | 1 | dist/bbsflmt/esun/h2s/eSUN TPU-64D.bbsflmt |
| 0.4 | eSUN TPU-85A | TPU | 1 | dist/bbsflmt/esun/h2s/eSUN TPU-85A.bbsflmt |
| 0.4 | eSUN TPU-90A | TPU | 1 | dist/bbsflmt/esun/h2s/eSUN TPU-90A.bbsflmt |
| 0.4 | eSUN TPU-95A | TPU | 1 | dist/bbsflmt/esun/h2s/eSUN TPU-95A.bbsflmt |
| 0.4 | eSUN TPU-LW | TPU | 1 | dist/bbsflmt/esun/h2s/eSUN TPU-LW.bbsflmt |

### Bambu Lab P1P

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | eSUN ABS | ABS | 1 | dist/bbsflmt/esun/p1p/eSUN ABS.bbsflmt |
| 0.4 | eSUN ABS-CF | ABS-GF | 1 | dist/bbsflmt/esun/p1p/eSUN ABS-CF.bbsflmt |
| 0.4 | eSUN ABS-ESD | ABS | 1 | dist/bbsflmt/esun/p1p/eSUN ABS-ESD.bbsflmt |
| 0.4 | eSUN ABS-FR | ABS | 1 | dist/bbsflmt/esun/p1p/eSUN ABS-FR.bbsflmt |
| 0.4 | eSUN ABS-GF | ABS | 1 | dist/bbsflmt/esun/p1p/eSUN ABS-GF.bbsflmt |
| 0.4 | eSUN ABS+ | ABS | 1 | dist/bbsflmt/esun/p1p/eSUN ABS+.bbsflmt |
| 0.4 | eSUN ABS+HS | ABS | 1 | dist/bbsflmt/esun/p1p/eSUN ABS+HS.bbsflmt |
| 0.4 | eSUN ASA-LW | ASA | 1 | dist/bbsflmt/esun/p1p/eSUN ASA-LW.bbsflmt |
| 0.4 | eSUN ASA+ | ASA | 1 | dist/bbsflmt/esun/p1p/eSUN ASA+.bbsflmt |
| 0.4 | eSUN PA | PA | 1 | dist/bbsflmt/esun/p1p/eSUN PA.bbsflmt |
| 0.4 | eSUN PA-CF | PA-CF | 1 | dist/bbsflmt/esun/p1p/eSUN PA-CF.bbsflmt |
| 0.4 | eSUN PA12+CF | PA-CF | 1 | dist/bbsflmt/esun/p1p/eSUN PA12+CF.bbsflmt |
| 0.4 | eSUN PA6-CF | PA-CF | 1 | dist/bbsflmt/esun/p1p/eSUN PA6-CF.bbsflmt |
| 0.4 | eSUN PC | PC | 1 | dist/bbsflmt/esun/p1p/eSUN PC.bbsflmt |
| 0.4 | eSUN PC-ESD | PC | 1 | dist/bbsflmt/esun/p1p/eSUN PC-ESD.bbsflmt |
| 0.4 | eSUN PEBA-85A | TPU | 1 | dist/bbsflmt/esun/p1p/eSUN PEBA-85A.bbsflmt |
| 0.4 | eSUN PEBA-90A | TPU | 1 | dist/bbsflmt/esun/p1p/eSUN PEBA-90A.bbsflmt |
| 0.4 | eSUN PEBA-LW | TPU | 1 | dist/bbsflmt/esun/p1p/eSUN PEBA-LW.bbsflmt |
| 0.4 | eSUN PET-CF | PET-CF | 1 | dist/bbsflmt/esun/p1p/eSUN PET-CF.bbsflmt |
| 0.4 | eSUN PETG | PETG | 1 | dist/bbsflmt/esun/p1p/eSUN PETG.bbsflmt |
| 0.4 | eSUN PETG-Basic | PETG | 1 | dist/bbsflmt/esun/p1p/eSUN PETG-Basic.bbsflmt |
| 0.4 | eSUN PETG-CF | PETG-CF | 1 | dist/bbsflmt/esun/p1p/eSUN PETG-CF.bbsflmt |
| 0.4 | eSUN PETG-ESD | PETG | 1 | dist/bbsflmt/esun/p1p/eSUN PETG-ESD.bbsflmt |
| 0.4 | eSUN PETG-Luminous | PETG | 1 | dist/bbsflmt/esun/p1p/eSUN PETG-Luminous.bbsflmt |
| 0.4 | eSUN PETG-Matte | PETG | 1 | dist/bbsflmt/esun/p1p/eSUN PETG-Matte.bbsflmt |
| 0.4 | eSUN PETG+HS | PETG | 1 | dist/bbsflmt/esun/p1p/eSUN PETG+HS.bbsflmt |
| 0.4 | eSUN PLA-Basic | PLA | 1 | dist/bbsflmt/esun/p1p/eSUN PLA-Basic.bbsflmt |
| 0.4 | eSUN PLA-CF | PLA-CF | 1 | dist/bbsflmt/esun/p1p/eSUN PLA-CF.bbsflmt |
| 0.4 | eSUN PLA-Clear | PLA | 1 | dist/bbsflmt/esun/p1p/eSUN PLA-Clear.bbsflmt |
| 0.4 | eSUN PLA-HS | PLA | 1 | dist/bbsflmt/esun/p1p/eSUN PLA-HS.bbsflmt |
| 0.4 | eSUN PLA-Lite | PLA | 1 | dist/bbsflmt/esun/p1p/eSUN PLA-Lite.bbsflmt |
| 0.4 | eSUN PLA-Luminous | PLA | 1 | dist/bbsflmt/esun/p1p/eSUN PLA-Luminous.bbsflmt |
| 0.4 | eSUN PLA-LW | PLA | 1 | dist/bbsflmt/esun/p1p/eSUN PLA-LW.bbsflmt |
| 0.4 | eSUN PLA-Magic | PLA | 1 | dist/bbsflmt/esun/p1p/eSUN PLA-Magic.bbsflmt |
| 0.4 | eSUN PLA-Marble | PLA | 1 | dist/bbsflmt/esun/p1p/eSUN PLA-Marble.bbsflmt |
| 0.4 | eSUN PLA-Matte | PLA | 1 | dist/bbsflmt/esun/p1p/eSUN PLA-Matte.bbsflmt |
| 0.4 | eSUN PLA-Metal | PLA | 1 | dist/bbsflmt/esun/p1p/eSUN PLA-Metal.bbsflmt |
| 0.4 | eSUN PLA-Silk | PLA | 1 | dist/bbsflmt/esun/p1p/eSUN PLA-Silk.bbsflmt |
| 0.4 | eSUN PLA-Twinkle | PLA | 1 | dist/bbsflmt/esun/p1p/eSUN PLA-Twinkle.bbsflmt |
| 0.4 | eSUN PLA-Wood | PLA | 1 | dist/bbsflmt/esun/p1p/eSUN PLA-Wood.bbsflmt |
| 0.4 | eSUN PLA+ | PLA | 1 | dist/bbsflmt/esun/p1p/eSUN PLA+.bbsflmt |
| 0.4 | eSUN PLA+HS | PLA | 1 | dist/bbsflmt/esun/p1p/eSUN PLA+HS.bbsflmt |
| 0.4 | eSUN TPE-83A | TPU | 1 | dist/bbsflmt/esun/p1p/eSUN TPE-83A.bbsflmt |
| 0.4 | eSUN TPU-64D | TPU | 1 | dist/bbsflmt/esun/p1p/eSUN TPU-64D.bbsflmt |
| 0.4 | eSUN TPU-85A | TPU | 1 | dist/bbsflmt/esun/p1p/eSUN TPU-85A.bbsflmt |
| 0.4 | eSUN TPU-90A | TPU | 1 | dist/bbsflmt/esun/p1p/eSUN TPU-90A.bbsflmt |
| 0.4 | eSUN TPU-95A | TPU | 1 | dist/bbsflmt/esun/p1p/eSUN TPU-95A.bbsflmt |
| 0.4 | eSUN TPU-LW | TPU | 1 | dist/bbsflmt/esun/p1p/eSUN TPU-LW.bbsflmt |
| 0.4 | eSUN UV Rock PLA | PLA | 1 | dist/bbsflmt/esun/p1p/eSUN UV Rock PLA.bbsflmt |

### Bambu Lab P1S

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | eSUN ABS | ABS | 1 | dist/bbsflmt/esun/p1s/eSUN ABS.bbsflmt |
| 0.4 | eSUN ABS-ESD | ABS | 1 | dist/bbsflmt/esun/p1s/eSUN ABS-ESD.bbsflmt |
| 0.4 | eSUN ABS-FR | ABS | 1 | dist/bbsflmt/esun/p1s/eSUN ABS-FR.bbsflmt |
| 0.4 | eSUN ABS-HT | ABS | 1 | dist/bbsflmt/esun/p1s/eSUN ABS-HT.bbsflmt |
| 0.4 | eSUN ABS+ | ABS | 1 | dist/bbsflmt/esun/p1s/eSUN ABS+.bbsflmt |
| 0.4 | eSUN ABS+CF | ABS | 1 | dist/bbsflmt/esun/p1s/eSUN ABS+CF.bbsflmt |
| 0.4 | eSUN ABS+GF | ABS | 1 | dist/bbsflmt/esun/p1s/eSUN ABS+GF.bbsflmt |
| 0.4 | eSUN ABS+HS | ABS | 1 | dist/bbsflmt/esun/p1s/eSUN ABS+HS.bbsflmt |
| 0.4 | eSUN ASA-LW | ASA | 1 | dist/bbsflmt/esun/p1s/eSUN ASA-LW.bbsflmt |
| 0.4 | eSUN ASA+ | ASA | 1 | dist/bbsflmt/esun/p1s/eSUN ASA+.bbsflmt |
| 0.4 | eSUN PA | PA | 1 | dist/bbsflmt/esun/p1s/eSUN PA.bbsflmt |
| 0.4 | eSUN PA-CF | PA-CF | 1 | dist/bbsflmt/esun/p1s/eSUN PA-CF.bbsflmt |
| 0.4 | eSUN PA12+CF | PA-CF | 1 | dist/bbsflmt/esun/p1s/eSUN PA12+CF.bbsflmt |
| 0.4 | eSUN PA6-CF | PA-CF | 1 | dist/bbsflmt/esun/p1s/eSUN PA6-CF.bbsflmt |
| 0.4 | eSUN PC | PC | 1 | dist/bbsflmt/esun/p1s/eSUN PC.bbsflmt |
| 0.4 | eSUN PC-ESD | PC | 1 | dist/bbsflmt/esun/p1s/eSUN PC-ESD.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN PEBA-85A | TPU | 3 | dist/bbsflmt/esun/p1s/eSUN PEBA-85A.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN PEBA-90A | TPU | 3 | dist/bbsflmt/esun/p1s/eSUN PEBA-90A.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN PEBA-LW | TPU | 3 | dist/bbsflmt/esun/p1s/eSUN PEBA-LW.bbsflmt |
| 0.4 | eSUN PETG | PETG | 1 | dist/bbsflmt/esun/p1s/eSUN PETG.bbsflmt |
| 0.4 | eSUN PETG-Basic | PETG | 1 | dist/bbsflmt/esun/p1s/eSUN PETG-Basic.bbsflmt |
| 0.4 | eSUN PETG-CF | PETG-CF | 1 | dist/bbsflmt/esun/p1s/eSUN PETG-CF.bbsflmt |
| 0.4 | eSUN PETG-ESD | PETG | 1 | dist/bbsflmt/esun/p1s/eSUN PETG-ESD.bbsflmt |
| 0.4 | eSUN PETG-Matte | PETG | 1 | dist/bbsflmt/esun/p1s/eSUN PETG-Matte.bbsflmt |
| 0.4 | eSUN PETG+HS | PETG | 1 | dist/bbsflmt/esun/p1s/eSUN PETG+HS.bbsflmt |
| 0.4 | eSUN PLA-Basic | PLA | 1 | dist/bbsflmt/esun/p1s/eSUN PLA-Basic.bbsflmt |
| 0.4 | eSUN PLA-CF | PLA-CF | 1 | dist/bbsflmt/esun/p1s/eSUN PLA-CF.bbsflmt |
| 0.4 | eSUN PLA-Clear | PLA | 1 | dist/bbsflmt/esun/p1s/eSUN PLA-Clear.bbsflmt |
| 0.4 | eSUN PLA-HS | PLA | 1 | dist/bbsflmt/esun/p1s/eSUN PLA-HS.bbsflmt |
| 0.4 | eSUN PLA-Lite | PLA | 1 | dist/bbsflmt/esun/p1s/eSUN PLA-Lite.bbsflmt |
| 0.4 | eSUN PLA-Luminous | PLA | 1 | dist/bbsflmt/esun/p1s/eSUN PLA-Luminous.bbsflmt |
| 0.4 | eSUN PLA-LW | PLA | 1 | dist/bbsflmt/esun/p1s/eSUN PLA-LW.bbsflmt |
| 0.4 | eSUN PLA-Magic | PLA | 1 | dist/bbsflmt/esun/p1s/eSUN PLA-Magic.bbsflmt |
| 0.4 | eSUN PLA-Marble | PLA | 1 | dist/bbsflmt/esun/p1s/eSUN PLA-Marble.bbsflmt |
| 0.4 | eSUN PLA-Matte | PLA | 1 | dist/bbsflmt/esun/p1s/eSUN PLA-Matte.bbsflmt |
| 0.4 | eSUN PLA-Metal | PLA | 1 | dist/bbsflmt/esun/p1s/eSUN PLA-Metal.bbsflmt |
| 0.4 | eSUN PLA-Silk | PLA | 1 | dist/bbsflmt/esun/p1s/eSUN PLA-Silk.bbsflmt |
| 0.4 | eSUN PLA-Wood | PLA | 1 | dist/bbsflmt/esun/p1s/eSUN PLA-Wood.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN PLA+ | PLA | 3 | dist/bbsflmt/esun/p1s/eSUN PLA+.bbsflmt |
| 0.4 | eSUN PLA+HS | PLA | 1 | dist/bbsflmt/esun/p1s/eSUN PLA+HS.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN TPE-83A | TPU | 3 | dist/bbsflmt/esun/p1s/eSUN TPE-83A.bbsflmt |
| 0.4 | eSUN TPU-64D | TPU | 1 | dist/bbsflmt/esun/p1s/eSUN TPU-64D.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN TPU-85A | TPU | 3 | dist/bbsflmt/esun/p1s/eSUN TPU-85A.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN TPU-90A | TPU | 3 | dist/bbsflmt/esun/p1s/eSUN TPU-90A.bbsflmt |
| 0.4 | eSUN TPU-95A | TPU | 1 | dist/bbsflmt/esun/p1s/eSUN TPU-95A.bbsflmt |
| 0.4 | eSUN TPU-LW | TPU | 1 | dist/bbsflmt/esun/p1s/eSUN TPU-LW.bbsflmt |
| 0.4 | eSUN UV Rock PLA | PLA | 1 | dist/bbsflmt/esun/p1s/eSUN UV Rock PLA.bbsflmt |

### Bambu Lab P2S

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | eSUN ABS | ABS | 1 | dist/bbsflmt/esun/p2s/eSUN ABS.bbsflmt |
| 0.4 | eSUN ABS-CF | ABS-GF | 1 | dist/bbsflmt/esun/p2s/eSUN ABS-CF.bbsflmt |
| 0.4 | eSUN ABS-ESD | ABS | 1 | dist/bbsflmt/esun/p2s/eSUN ABS-ESD.bbsflmt |
| 0.4 | eSUN ABS-FR | ABS | 1 | dist/bbsflmt/esun/p2s/eSUN ABS-FR.bbsflmt |
| 0.4 | eSUN ABS-GF | ABS | 1 | dist/bbsflmt/esun/p2s/eSUN ABS-GF.bbsflmt |
| 0.4 | eSUN ABS+ | ABS | 1 | dist/bbsflmt/esun/p2s/eSUN ABS+.bbsflmt |
| 0.4 | eSUN ABS+HS | ABS | 1 | dist/bbsflmt/esun/p2s/eSUN ABS+HS.bbsflmt |
| 0.4 | eSUN ASA-LW | ASA | 1 | dist/bbsflmt/esun/p2s/eSUN ASA-LW.bbsflmt |
| 0.4 | eSUN ASA+ | ASA | 1 | dist/bbsflmt/esun/p2s/eSUN ASA+.bbsflmt |
| 0.4 | eSUN PA | PA | 1 | dist/bbsflmt/esun/p2s/eSUN PA.bbsflmt |
| 0.4 | eSUN PA-CF | PA-CF | 1 | dist/bbsflmt/esun/p2s/eSUN PA-CF.bbsflmt |
| 0.4 | eSUN PA12+CF | PA-CF | 1 | dist/bbsflmt/esun/p2s/eSUN PA12+CF.bbsflmt |
| 0.4 | eSUN PA6-CF | PA-CF | 1 | dist/bbsflmt/esun/p2s/eSUN PA6-CF.bbsflmt |
| 0.4 | eSUN PC | PC | 1 | dist/bbsflmt/esun/p2s/eSUN PC.bbsflmt |
| 0.4 | eSUN PC-ESD | PC | 1 | dist/bbsflmt/esun/p2s/eSUN PC-ESD.bbsflmt |
| 0.4 | eSUN PEBA-85A | TPU | 1 | dist/bbsflmt/esun/p2s/eSUN PEBA-85A.bbsflmt |
| 0.4 | eSUN PEBA-90A | TPU | 1 | dist/bbsflmt/esun/p2s/eSUN PEBA-90A.bbsflmt |
| 0.4 | eSUN PEBA-LW | TPU | 1 | dist/bbsflmt/esun/p2s/eSUN PEBA-LW.bbsflmt |
| 0.4 | eSUN PET-CF | PET-CF | 1 | dist/bbsflmt/esun/p2s/eSUN PET-CF.bbsflmt |
| 0.4 | eSUN PETG | PETG | 1 | dist/bbsflmt/esun/p2s/eSUN PETG.bbsflmt |
| 0.4 | eSUN PETG-Basic | PETG | 1 | dist/bbsflmt/esun/p2s/eSUN PETG-Basic.bbsflmt |
| 0.4 | eSUN PETG-CF | PETG-CF | 1 | dist/bbsflmt/esun/p2s/eSUN PETG-CF.bbsflmt |
| 0.4 | eSUN PETG-ESD | PETG | 1 | dist/bbsflmt/esun/p2s/eSUN PETG-ESD.bbsflmt |
| 0.4 | eSUN PETG-Luminous | PETG | 1 | dist/bbsflmt/esun/p2s/eSUN PETG-Luminous.bbsflmt |
| 0.4 | eSUN PETG-Matte | PETG | 1 | dist/bbsflmt/esun/p2s/eSUN PETG-Matte.bbsflmt |
| 0.4 | eSUN PETG+HS | PETG | 1 | dist/bbsflmt/esun/p2s/eSUN PETG+HS.bbsflmt |
| 0.4 | eSUN PLA-Basic | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA-Basic.bbsflmt |
| 0.4 | eSUN PLA-CF | PLA-CF | 1 | dist/bbsflmt/esun/p2s/eSUN PLA-CF.bbsflmt |
| 0.4 | eSUN PLA-Clear | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA-Clear.bbsflmt |
| 0.4 | eSUN PLA-HS | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA-HS.bbsflmt |
| 0.4 | eSUN PLA-Lite | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA-Lite.bbsflmt |
| 0.4 | eSUN PLA-Luminous | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA-Luminous.bbsflmt |
| 0.4 | eSUN PLA-LW | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA-LW.bbsflmt |
| 0.4 | eSUN PLA-Magic | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA-Magic.bbsflmt |
| 0.4 | eSUN PLA-Marble | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA-Marble.bbsflmt |
| 0.4 | eSUN PLA-Matte | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA-Matte.bbsflmt |
| 0.4 | eSUN PLA-Metal | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA-Metal.bbsflmt |
| 0.4 | eSUN PLA-Silk | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA-Silk.bbsflmt |
| 0.4 | eSUN PLA-ST | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA-ST.bbsflmt |
| 0.4 | eSUN PLA-Twinkling | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA-Twinkling.bbsflmt |
| 0.4 | eSUN PLA-UV Rock | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA-UV Rock.bbsflmt |
| 0.4 | eSUN PLA-Wood | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA-Wood.bbsflmt |
| 0.4 | eSUN PLA+ | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA+.bbsflmt |
| 0.4 | eSUN PLA+HS | PLA | 1 | dist/bbsflmt/esun/p2s/eSUN PLA+HS.bbsflmt |
| 0.4 | eSUN TPE-83A | TPU | 1 | dist/bbsflmt/esun/p2s/eSUN TPE-83A.bbsflmt |
| 0.4 | eSUN TPU-64D | TPU | 1 | dist/bbsflmt/esun/p2s/eSUN TPU-64D.bbsflmt |
| 0.4 | eSUN TPU-85A | TPU | 1 | dist/bbsflmt/esun/p2s/eSUN TPU-85A.bbsflmt |
| 0.4 | eSUN TPU-90A | TPU | 1 | dist/bbsflmt/esun/p2s/eSUN TPU-90A.bbsflmt |
| 0.4 | eSUN TPU-95A | TPU | 1 | dist/bbsflmt/esun/p2s/eSUN TPU-95A.bbsflmt |
| 0.4 | eSUN TPU-LW | TPU | 1 | dist/bbsflmt/esun/p2s/eSUN TPU-LW.bbsflmt |

### Bambu Lab X1

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4, 0.6 | eSUN ABS | ABS | 2 | dist/bbsflmt/esun/x1/eSUN ABS.bbsflmt |
| 0.4, 0.6 | eSUN ABS-CF | ABS-GF | 2 | dist/bbsflmt/esun/x1/eSUN ABS-CF.bbsflmt |
| 0.4, 0.6 | eSUN ABS-ESD | ABS | 2 | dist/bbsflmt/esun/x1/eSUN ABS-ESD.bbsflmt |
| 0.4, 0.6 | eSUN ABS-FR | ABS | 2 | dist/bbsflmt/esun/x1/eSUN ABS-FR.bbsflmt |
| 0.4, 0.6 | eSUN ABS-GF | ABS | 2 | dist/bbsflmt/esun/x1/eSUN ABS-GF.bbsflmt |
| 0.4, 0.6 | eSUN ABS+ | ABS | 2 | dist/bbsflmt/esun/x1/eSUN ABS+.bbsflmt |
| 0.4, 0.6 | eSUN ABS+HS | ABS | 2 | dist/bbsflmt/esun/x1/eSUN ABS+HS.bbsflmt |
| 0.4 | eSUN ASA-LW | ASA | 1 | dist/bbsflmt/esun/x1/eSUN ASA-LW.bbsflmt |
| 0.4 | eSUN ASA+ | ASA | 1 | dist/bbsflmt/esun/x1/eSUN ASA+.bbsflmt |
| 0.4 | eSUN PA | PA | 1 | dist/bbsflmt/esun/x1/eSUN PA.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN PA-CF | PA-CF | 3 | dist/bbsflmt/esun/x1/eSUN PA-CF.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN PA12+CF | PA-CF | 3 | dist/bbsflmt/esun/x1/eSUN PA12+CF.bbsflmt |
| 0.4 | eSUN PA6-CF | PA-CF | 1 | dist/bbsflmt/esun/x1/eSUN PA6-CF.bbsflmt |
| 0.4 | eSUN PC | PC | 1 | dist/bbsflmt/esun/x1/eSUN PC.bbsflmt |
| 0.4 | eSUN PC-ESD | PC | 1 | dist/bbsflmt/esun/x1/eSUN PC-ESD.bbsflmt |
| 0.4 | eSUN PEBA-85A | TPU | 1 | dist/bbsflmt/esun/x1/eSUN PEBA-85A.bbsflmt |
| 0.4 | eSUN PEBA-90A | TPU | 1 | dist/bbsflmt/esun/x1/eSUN PEBA-90A.bbsflmt |
| 0.4 | eSUN PEBA-LW | TPU | 1 | dist/bbsflmt/esun/x1/eSUN PEBA-LW.bbsflmt |
| 0.4 | eSUN PET-CF | PET-CF | 1 | dist/bbsflmt/esun/x1/eSUN PET-CF.bbsflmt |
| 0.4 | eSUN PETG | PETG | 1 | dist/bbsflmt/esun/x1/eSUN PETG.bbsflmt |
| 0.4 | eSUN PETG Basic | PETG | 1 | dist/bbsflmt/esun/x1/eSUN PETG Basic.bbsflmt |
| 0.4 | eSUN PETG-CF | PETG-CF | 1 | dist/bbsflmt/esun/x1/eSUN PETG-CF.bbsflmt |
| 0.4 | eSUN PETG-ESD | PETG | 1 | dist/bbsflmt/esun/x1/eSUN PETG-ESD.bbsflmt |
| 0.4 | eSUN PETG-Luminous | PETG | 1 | dist/bbsflmt/esun/x1/eSUN PETG-Luminous.bbsflmt |
| 0.4 | eSUN PETG-Matte | PETG | 1 | dist/bbsflmt/esun/x1/eSUN PETG-Matte.bbsflmt |
| 0.4 | eSUN PETG+HS | PETG | 1 | dist/bbsflmt/esun/x1/eSUN PETG+HS.bbsflmt |
| 0.4 | eSUN PLA Magic | PLA | 1 | dist/bbsflmt/esun/x1/eSUN PLA Magic.bbsflmt |
| 0.4 | eSUN PLA-Basic | PLA | 1 | dist/bbsflmt/esun/x1/eSUN PLA-Basic.bbsflmt |
| 0.4 | eSUN PLA-CF | PLA-CF | 1 | dist/bbsflmt/esun/x1/eSUN PLA-CF.bbsflmt |
| 0.4 | eSUN PLA-Clear | PLA | 1 | dist/bbsflmt/esun/x1/eSUN PLA-Clear.bbsflmt |
| 0.4 | eSUN PLA-HS | PLA | 1 | dist/bbsflmt/esun/x1/eSUN PLA-HS.bbsflmt |
| 0.4 | eSUN PLA-Lite | PLA | 1 | dist/bbsflmt/esun/x1/eSUN PLA-Lite.bbsflmt |
| 0.4 | eSUN PLA-Luminous | PLA | 1 | dist/bbsflmt/esun/x1/eSUN PLA-Luminous.bbsflmt |
| 0.4 | eSUN PLA-LW | PLA | 1 | dist/bbsflmt/esun/x1/eSUN PLA-LW.bbsflmt |
| 0.4 | eSUN PLA-Marble | PLA | 1 | dist/bbsflmt/esun/x1/eSUN PLA-Marble.bbsflmt |
| 0.4 | eSUN PLA-Matte | PLA | 1 | dist/bbsflmt/esun/x1/eSUN PLA-Matte.bbsflmt |
| 0.4 | eSUN PLA-Metal | PLA | 1 | dist/bbsflmt/esun/x1/eSUN PLA-Metal.bbsflmt |
| 0.4 | eSUN PLA-Silk | PLA | 1 | dist/bbsflmt/esun/x1/eSUN PLA-Silk.bbsflmt |
| 0.4 | eSUN PLA-ST | PLA | 1 | dist/bbsflmt/esun/x1/eSUN PLA-ST.bbsflmt |
| 0.4 | eSUN PLA-Twinkling | PLA | 1 | dist/bbsflmt/esun/x1/eSUN PLA-Twinkling.bbsflmt |
| 0.4 | eSUN PLA-Wood | PLA | 1 | dist/bbsflmt/esun/x1/eSUN PLA-Wood.bbsflmt |
| 0.4 | eSUN PLA+ | PLA | 1 | dist/bbsflmt/esun/x1/eSUN PLA+.bbsflmt |
| 0.4 | eSUN TPE-83A | TPU | 1 | dist/bbsflmt/esun/x1/eSUN TPE-83A.bbsflmt |
| 0.4 | eSUN TPU-64D | TPU | 1 | dist/bbsflmt/esun/x1/eSUN TPU-64D.bbsflmt |
| 0.4 | eSUN TPU-85A | TPU | 1 | dist/bbsflmt/esun/x1/eSUN TPU-85A.bbsflmt |
| 0.4 | eSUN TPU-90A | TPU | 1 | dist/bbsflmt/esun/x1/eSUN TPU-90A.bbsflmt |
| 0.4 | eSUN TPU-95A | TPU | 1 | dist/bbsflmt/esun/x1/eSUN TPU-95A.bbsflmt |
| 0.4 | eSUN TPU-LW | TPU | 1 | dist/bbsflmt/esun/x1/eSUN TPU-LW.bbsflmt |
| 0.4 | eSUN UV Rock PLA | PLA | 1 | dist/bbsflmt/esun/x1/eSUN UV Rock PLA.bbsflmt |

### Bambu Lab X1 Carbon

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4, 0.6 | eSUN ABS | ABS | 2 | dist/bbsflmt/esun/x1-carbon/eSUN ABS.bbsflmt |
| 0.4, 0.6 | eSUN ABS-CF | ABS-GF | 2 | dist/bbsflmt/esun/x1-carbon/eSUN ABS-CF.bbsflmt |
| 0.4, 0.6 | eSUN ABS-ESD | ABS | 2 | dist/bbsflmt/esun/x1-carbon/eSUN ABS-ESD.bbsflmt |
| 0.4, 0.6 | eSUN ABS-FR | ABS | 2 | dist/bbsflmt/esun/x1-carbon/eSUN ABS-FR.bbsflmt |
| 0.4, 0.6 | eSUN ABS-GF | ABS | 2 | dist/bbsflmt/esun/x1-carbon/eSUN ABS-GF.bbsflmt |
| 0.4, 0.6 | eSUN ABS+ | ABS | 2 | dist/bbsflmt/esun/x1-carbon/eSUN ABS+.bbsflmt |
| 0.4, 0.6 | eSUN ABS+HS | ABS | 2 | dist/bbsflmt/esun/x1-carbon/eSUN ABS+HS.bbsflmt |
| 0.4 | eSUN ASA-LW | ASA | 1 | dist/bbsflmt/esun/x1-carbon/eSUN ASA-LW.bbsflmt |
| 0.4 | eSUN ASA+ | ASA | 1 | dist/bbsflmt/esun/x1-carbon/eSUN ASA+.bbsflmt |
| 0.4 | eSUN Marble PLA | PLA | 1 | dist/bbsflmt/esun/x1-carbon/eSUN Marble PLA.bbsflmt |
| 0.4 | eSUN PA | PA | 1 | dist/bbsflmt/esun/x1-carbon/eSUN PA.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN PA-CF | PA-CF | 3 | dist/bbsflmt/esun/x1-carbon/eSUN PA-CF.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN PA12+CF | PA-CF | 3 | dist/bbsflmt/esun/x1-carbon/eSUN PA12+CF.bbsflmt |
| 0.4 | eSUN PA6-CF | PA-CF | 1 | dist/bbsflmt/esun/x1-carbon/eSUN PA6-CF.bbsflmt |
| 0.4 | eSUN PC | PC | 1 | dist/bbsflmt/esun/x1-carbon/eSUN PC.bbsflmt |
| 0.4 | eSUN PC-ESD | PC | 1 | dist/bbsflmt/esun/x1-carbon/eSUN PC-ESD.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN PEBA-85A | TPU | 3 | dist/bbsflmt/esun/x1-carbon/eSUN PEBA-85A.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN PEBA-90A | TPU | 3 | dist/bbsflmt/esun/x1-carbon/eSUN PEBA-90A.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN PEBA-LW | TPU | 3 | dist/bbsflmt/esun/x1-carbon/eSUN PEBA-LW.bbsflmt |
| 0.4 | eSUN PET-CF | PET-CF | 1 | dist/bbsflmt/esun/x1-carbon/eSUN PET-CF.bbsflmt |
| 0.4 | eSUN PETG | PETG | 1 | dist/bbsflmt/esun/x1-carbon/eSUN PETG.bbsflmt |
| 0.4 | eSUN PETG-Basic | PETG | 1 | dist/bbsflmt/esun/x1-carbon/eSUN PETG-Basic.bbsflmt |
| 0.4 | eSUN PETG-CF | PETG-CF | 1 | dist/bbsflmt/esun/x1-carbon/eSUN PETG-CF.bbsflmt |
| 0.4 | eSUN PETG-ESD | PETG | 1 | dist/bbsflmt/esun/x1-carbon/eSUN PETG-ESD.bbsflmt |
| 0.4 | eSUN PETG-Luminous | PETG | 1 | dist/bbsflmt/esun/x1-carbon/eSUN PETG-Luminous.bbsflmt |
| 0.4 | eSUN PETG-Matte | PETG | 1 | dist/bbsflmt/esun/x1-carbon/eSUN PETG-Matte.bbsflmt |
| 0.4 | eSUN PETG+HS | PETG | 1 | dist/bbsflmt/esun/x1-carbon/eSUN PETG+HS.bbsflmt |
| 0.4 | eSUN PLA Magic | PLA | 1 | dist/bbsflmt/esun/x1-carbon/eSUN PLA Magic.bbsflmt |
| 0.4 | eSUN PLA Metal | PLA | 1 | dist/bbsflmt/esun/x1-carbon/eSUN PLA Metal.bbsflmt |
| 0.4 | eSUN PLA-Basic | PLA | 1 | dist/bbsflmt/esun/x1-carbon/eSUN PLA-Basic.bbsflmt |
| 0.4, 0.6 | eSUN PLA-CF | PLA-CF | 2 | dist/bbsflmt/esun/x1-carbon/eSUN PLA-CF.bbsflmt |
| 0.4 | eSUN PLA-Clear | PLA | 1 | dist/bbsflmt/esun/x1-carbon/eSUN PLA-Clear.bbsflmt |
| 0.4, 0.6 | eSUN PLA-HS | PLA | 2 | dist/bbsflmt/esun/x1-carbon/eSUN PLA-HS.bbsflmt |
| 0.4, 0.6 | eSUN PLA-Lite | PLA | 2 | dist/bbsflmt/esun/x1-carbon/eSUN PLA-Lite.bbsflmt |
| 0.4, 0.6 | eSUN PLA-Luminous | PLA | 2 | dist/bbsflmt/esun/x1-carbon/eSUN PLA-Luminous.bbsflmt |
| 0.4, 0.6 | eSUN PLA-LW | PLA | 2 | dist/bbsflmt/esun/x1-carbon/eSUN PLA-LW.bbsflmt |
| 0.4, 0.6 | eSUN PLA-Matte | PLA | 2 | dist/bbsflmt/esun/x1-carbon/eSUN PLA-Matte.bbsflmt |
| 0.4, 0.6 | eSUN PLA-Silk | PLA | 2 | dist/bbsflmt/esun/x1-carbon/eSUN PLA-Silk.bbsflmt |
| 0.4, 0.6 | eSUN PLA-ST | PLA | 2 | dist/bbsflmt/esun/x1-carbon/eSUN PLA-ST.bbsflmt |
| 0.4, 0.6 | eSUN PLA-Twinkle | PLA | 2 | dist/bbsflmt/esun/x1-carbon/eSUN PLA-Twinkle.bbsflmt |
| 0.4, 0.6 | eSUN PLA-Wood | PLA | 2 | dist/bbsflmt/esun/x1-carbon/eSUN PLA-Wood.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN PLA+ | PLA | 3 | dist/bbsflmt/esun/x1-carbon/eSUN PLA+.bbsflmt |
| 0.4, 0.6 | eSUN PLA+HS | PLA | 2 | dist/bbsflmt/esun/x1-carbon/eSUN PLA+HS.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN TPE-83A | TPU | 3 | dist/bbsflmt/esun/x1-carbon/eSUN TPE-83A.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN TPU-64D | TPU | 3 | dist/bbsflmt/esun/x1-carbon/eSUN TPU-64D.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN TPU-85A | TPU | 3 | dist/bbsflmt/esun/x1-carbon/eSUN TPU-85A.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN TPU-90A | TPU | 3 | dist/bbsflmt/esun/x1-carbon/eSUN TPU-90A.bbsflmt |
| 0.4, 0.6, 0.8 | eSUN TPU-95A | TPU | 3 | dist/bbsflmt/esun/x1-carbon/eSUN TPU-95A.bbsflmt |
| 0.4 | eSUN TPU-LW | TPU | 1 | dist/bbsflmt/esun/x1-carbon/eSUN TPU-LW.bbsflmt |
| 0.4 | eSUN UV Rock PLA | PLA | 1 | dist/bbsflmt/esun/x1-carbon/eSUN UV Rock PLA.bbsflmt |

### Bambu Lab X2D

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | eSUN ABS | ABS | 1 | dist/bbsflmt/esun/x2d/eSUN ABS.bbsflmt |
| 0.4 | eSUN ABS-ESD | ABS | 1 | dist/bbsflmt/esun/x2d/eSUN ABS-ESD.bbsflmt |
| 0.4 | eSUN ABS-FR | ABS | 1 | dist/bbsflmt/esun/x2d/eSUN ABS-FR.bbsflmt |
| 0.4 | eSUN ABS+ | ABS | 1 | dist/bbsflmt/esun/x2d/eSUN ABS+.bbsflmt |
| 0.4 | eSUN ABS+CF | ABS | 1 | dist/bbsflmt/esun/x2d/eSUN ABS+CF.bbsflmt |
| 0.4 | eSUN ABS+GF | ABS | 1 | dist/bbsflmt/esun/x2d/eSUN ABS+GF.bbsflmt |
| 0.4 | eSUN ABS+HS | ABS | 1 | dist/bbsflmt/esun/x2d/eSUN ABS+HS.bbsflmt |
| 0.4 | eSUN ASA-LW | ASA | 1 | dist/bbsflmt/esun/x2d/eSUN ASA-LW.bbsflmt |
| 0.4 | eSUN ASA+ | ASA | 1 | dist/bbsflmt/esun/x2d/eSUN ASA+.bbsflmt |
| 0.4 | eSUN PA-CF | PA-CF | 1 | dist/bbsflmt/esun/x2d/eSUN PA-CF.bbsflmt |
| 0.4 | eSUN PA12+CF | PA-CF | 1 | dist/bbsflmt/esun/x2d/eSUN PA12+CF.bbsflmt |
| 0.4 | eSUN PA6-CF | PA-CF | 1 | dist/bbsflmt/esun/x2d/eSUN PA6-CF.bbsflmt |
| 0.4 | eSUN PC | PC | 1 | dist/bbsflmt/esun/x2d/eSUN PC.bbsflmt |
| 0.4 | eSUN PC-ESD | PC | 1 | dist/bbsflmt/esun/x2d/eSUN PC-ESD.bbsflmt |
| 0.4 | eSUN PEBA-85A | TPU | 1 | dist/bbsflmt/esun/x2d/eSUN PEBA-85A.bbsflmt |
| 0.4 | eSUN PEBA-90A | TPU | 1 | dist/bbsflmt/esun/x2d/eSUN PEBA-90A.bbsflmt |
| 0.4 | eSUN PEBA-LW | TPU | 1 | dist/bbsflmt/esun/x2d/eSUN PEBA-LW.bbsflmt |
| 0.4 | eSUN PETG | PETG | 1 | dist/bbsflmt/esun/x2d/eSUN PETG.bbsflmt |
| 0.4 | eSUN PETG-Basic | PETG | 1 | dist/bbsflmt/esun/x2d/eSUN PETG-Basic.bbsflmt |
| 0.4 | eSUN PETG-CF | PETG-CF | 1 | dist/bbsflmt/esun/x2d/eSUN PETG-CF.bbsflmt |
| 0.4 | eSUN PETG-ESD | PETG | 1 | dist/bbsflmt/esun/x2d/eSUN PETG-ESD.bbsflmt |
| 0.4 | eSUN PETG-Luminous | PETG | 1 | dist/bbsflmt/esun/x2d/eSUN PETG-Luminous.bbsflmt |
| 0.4 | eSUN PETG-Matte | PETG | 1 | dist/bbsflmt/esun/x2d/eSUN PETG-Matte.bbsflmt |
| 0.4 | eSUN PETG+HS | PETG | 1 | dist/bbsflmt/esun/x2d/eSUN PETG+HS.bbsflmt |
| 0.4 | eSUN PLA-Basic | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA-Basic.bbsflmt |
| 0.4 | eSUN PLA-CF | PLA-CF | 1 | dist/bbsflmt/esun/x2d/eSUN PLA-CF.bbsflmt |
| 0.4 | eSUN PLA-Clear | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA-Clear.bbsflmt |
| 0.4 | eSUN PLA-HS | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA-HS.bbsflmt |
| 0.4 | eSUN PLA-Lite | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA-Lite.bbsflmt |
| 0.4 | eSUN PLA-Luminous | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA-Luminous.bbsflmt |
| 0.4 | eSUN PLA-LW | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA-LW.bbsflmt |
| 0.4 | eSUN PLA-Magic | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA-Magic.bbsflmt |
| 0.4 | eSUN PLA-Marble | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA-Marble.bbsflmt |
| 0.4 | eSUN PLA-Matte | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA-Matte.bbsflmt |
| 0.4 | eSUN PLA-Metal | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA-Metal.bbsflmt |
| 0.4 | eSUN PLA-Silk | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA-Silk.bbsflmt |
| 0.4 | eSUN PLA-ST | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA-ST.bbsflmt |
| 0.4 | eSUN PLA-Twinkling | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA-Twinkling.bbsflmt |
| 0.4 | eSUN PLA-UV Rock | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA-UV Rock.bbsflmt |
| 0.4 | eSUN PLA-Wood | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA-Wood.bbsflmt |
| 0.4 | eSUN PLA+ | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA+.bbsflmt |
| 0.4 | eSUN PLA+HS | PLA | 1 | dist/bbsflmt/esun/x2d/eSUN PLA+HS.bbsflmt |
| 0.4 | eSUN TPE-83A | TPU | 1 | dist/bbsflmt/esun/x2d/eSUN TPE-83A.bbsflmt |
| 0.4 | eSUN TPU | TPU | 1 | dist/bbsflmt/esun/x2d/eSUN TPU.bbsflmt |
| 0.4 | eSUN TPU-64D | TPU | 1 | dist/bbsflmt/esun/x2d/eSUN TPU-64D.bbsflmt |
| 0.4 | eSUN TPU-80A | TPU | 1 | dist/bbsflmt/esun/x2d/eSUN TPU-80A.bbsflmt |
| 0.4 | eSUN TPU-85A | TPU | 1 | dist/bbsflmt/esun/x2d/eSUN TPU-85A.bbsflmt |
| 0.4 | eSUN TPU-90A | TPU | 1 | dist/bbsflmt/esun/x2d/eSUN TPU-90A.bbsflmt |
| 0.4 | eSUN TPU-95A | TPU | 1 | dist/bbsflmt/esun/x2d/eSUN TPU-95A.bbsflmt |
| 0.4 | eSUN TPU-LW | TPU | 1 | dist/bbsflmt/esun/x2d/eSUN TPU-LW.bbsflmt |

</details>

<details>
<summary>Polymaker details: 503 bundles, 66 materials, 12 printers, 503 profiles</summary>

### Bambu Lab A1

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | Polymaker Panchroma CoPE | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker Panchroma CoPE.bbsflmt |
| 0.4 | Polymaker Panchroma PLA | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker Panchroma PLA.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Celestial | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker Panchroma PLA Celestial.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker Panchroma PLA Galaxy.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker Panchroma PLA Glow.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker Panchroma PLA Luminous.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker Panchroma PLA Marble.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Matte | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker Panchroma PLA Matte.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Metallic | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker Panchroma PLA Metallic.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker Panchroma PLA Neon.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Satin | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker Panchroma PLA Satin.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Silk | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker Panchroma PLA Silk.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker Panchroma PLA Starlight.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker Panchroma PLA Translucent.bbsflmt |
| 0.4 | Polymaker Panchroma PLA UV Shift | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker Panchroma PLA UV Shift.bbsflmt |
| 0.4 | Polymaker PETG | PETG | 1 | dist/bbsflmt/polymaker/a1/Polymaker PETG.bbsflmt |
| 0.4 | Polymaker PETG Galaxy | PETG | 1 | dist/bbsflmt/polymaker/a1/Polymaker PETG Galaxy.bbsflmt |
| 0.4 | Polymaker PLA Pro | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker PLA Pro.bbsflmt |
| 0.4 | Polymaker PLA Pro Metallic | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker PLA Pro Metallic.bbsflmt |
| 0.4 | Polymaker PolyLite CosPLA | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker PolyLite CosPLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker PolyLite PLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker PolyLite PLA Galaxy.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker PolyLite PLA Glow.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker PolyLite PLA Luminous.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker PolyLite PLA Neon.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker PolyLite PLA Starlight.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker PolyLite PLA Translucent.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker PolyTerra PLA.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker PolyTerra PLA Marble.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA+ | PLA | 1 | dist/bbsflmt/polymaker/a1/Polymaker PolyTerra PLA+.bbsflmt |

### Bambu Lab A1 mini

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | Polymaker Panchroma CoPE | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker Panchroma CoPE.bbsflmt |
| 0.4 | Polymaker Panchroma PLA | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker Panchroma PLA.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Celestial | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker Panchroma PLA Celestial.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker Panchroma PLA Galaxy.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker Panchroma PLA Glow.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker Panchroma PLA Luminous.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker Panchroma PLA Marble.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Matte | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker Panchroma PLA Matte.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Metallic | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker Panchroma PLA Metallic.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker Panchroma PLA Neon.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Satin | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker Panchroma PLA Satin.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Silk | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker Panchroma PLA Silk.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker Panchroma PLA Starlight.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker Panchroma PLA Translucent.bbsflmt |
| 0.4 | Polymaker Panchroma PLA UV Shift | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker Panchroma PLA UV Shift.bbsflmt |
| 0.4 | Polymaker PETG | PETG | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker PETG.bbsflmt |
| 0.4 | Polymaker PETG Galaxy | PETG | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker PETG Galaxy.bbsflmt |
| 0.4 | Polymaker PLA Pro | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker PLA Pro.bbsflmt |
| 0.4 | Polymaker PLA Pro Metallic | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker PLA Pro Metallic.bbsflmt |
| 0.4 | Polymaker PolyLite CosPLA | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker PolyLite CosPLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker PolyLite PLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker PolyLite PLA Galaxy.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker PolyLite PLA Glow.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker PolyLite PLA Luminous.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker PolyLite PLA Neon.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker PolyLite PLA Starlight.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker PolyLite PLA Translucent.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker PolyTerra PLA.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker PolyTerra PLA Marble.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA+ | PLA | 1 | dist/bbsflmt/polymaker/a1-mini/Polymaker PolyTerra PLA+.bbsflmt |

### Bambu Lab H2C

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | Polymaker ABS Pro | ABS | 1 | dist/bbsflmt/polymaker/h2c/Polymaker ABS Pro.bbsflmt |
| 0.4 | Polymaker ABS Pro Galaxy | ABS | 1 | dist/bbsflmt/polymaker/h2c/Polymaker ABS Pro Galaxy.bbsflmt |
| 0.4 | Polymaker Fiberon ASA-CF08 | ASA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Fiberon ASA-CF08.bbsflmt |
| 0.4 | Polymaker Fiberon PA12-CF10 | PA-CF | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Fiberon PA12-CF10.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-CF20 | PA6-CF | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Fiberon PA6-CF20.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-GF25 | PA-GF | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Fiberon PA6-GF25.bbsflmt |
| 0.4 | Polymaker Fiberon PA612-CF15 | PA-CF | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Fiberon PA612-CF15.bbsflmt |
| 0.4 | Polymaker Fiberon PA612-ESD | PA-CF | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Fiberon PA612-ESD.bbsflmt |
| 0.4 | Polymaker Fiberon PET-CF17 | PET-CF | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Fiberon PET-CF17.bbsflmt |
| 0.4 | Polymaker Fiberon PET-GF15 | PET-CF | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Fiberon PET-GF15.bbsflmt |
| 0.4 | Polymaker Fiberon PETG-ESD | PETG | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Fiberon PETG-ESD.bbsflmt |
| 0.4 | Polymaker Fiberon PETG-rCF08 | PETG-CF | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Fiberon PETG-rCF08.bbsflmt |
| 0.4 | Polymaker Fiberon PPS-CF10 | PPS-CF | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Fiberon PPS-CF10.bbsflmt |
| 0.4 | Polymaker Fiberon PPS-GF20 | PPS-CF | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Fiberon PPS-GF20.bbsflmt |
| 0.4 | Polymaker HT-PLA | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker HT-PLA.bbsflmt |
| 0.4 | Polymaker HT-PLA-GF | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker HT-PLA-GF.bbsflmt |
| 0.4 | Polymaker Panchroma CoPE | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Panchroma CoPE.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Celestial | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Panchroma PLA Celestial.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Panchroma PLA Galaxy.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Panchroma PLA Glow.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Panchroma PLA Luminous.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Panchroma PLA Marble.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Matte | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Panchroma PLA Matte.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Metallic | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Panchroma PLA Metallic.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Panchroma PLA Neon.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Satin | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Panchroma PLA Satin.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Silk | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Panchroma PLA Silk.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Panchroma PLA Starlight.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Panchroma PLA Translucent.bbsflmt |
| 0.4 | Polymaker Panchroma PLA UV Shift | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker Panchroma PLA UV Shift.bbsflmt |
| 0.4 | Polymaker PETG | PETG | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PETG.bbsflmt |
| 0.4 | Polymaker PETG Galaxy | PETG | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PETG Galaxy.bbsflmt |
| 0.4 | Polymaker PLA | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PLA.bbsflmt |
| 0.4 | Polymaker PLA Pro | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PLA Pro.bbsflmt |
| 0.4 | Polymaker PLA Pro Metallic | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PLA Pro Metallic.bbsflmt |
| 0.4 | Polymaker PolyLite CosPLA | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PolyLite CosPLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PolyLite PLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PolyLite PLA Galaxy.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PolyLite PLA Glow.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PolyLite PLA Luminous.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PolyLite PLA Neon.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Pro | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PolyLite PLA Pro.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Pro Metallic | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PolyLite PLA Pro Metallic.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PolyLite PLA Starlight.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PolyLite PLA Translucent.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PolyTerra PLA.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PolyTerra PLA Marble.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA+ | PLA | 1 | dist/bbsflmt/polymaker/h2c/Polymaker PolyTerra PLA+.bbsflmt |

### Bambu Lab H2D

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | Polymaker ABS Max | ABS | 1 | dist/bbsflmt/polymaker/h2d/Polymaker ABS Max.bbsflmt |
| 0.4 | Polymaker ABS Pro | ABS | 1 | dist/bbsflmt/polymaker/h2d/Polymaker ABS Pro.bbsflmt |
| 0.4 | Polymaker ABS Pro Galaxy | ABS | 1 | dist/bbsflmt/polymaker/h2d/Polymaker ABS Pro Galaxy.bbsflmt |
| 0.4 | Polymaker ASA | ASA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker ASA.bbsflmt |
| 0.4 | Polymaker Fiberon ASA-CF08 | ASA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Fiberon ASA-CF08.bbsflmt |
| 0.4 | Polymaker Fiberon PA12-CF10 | PA-CF | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Fiberon PA12-CF10.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-CF20 | PA6-CF | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Fiberon PA6-CF20.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-GF25 | PA-GF | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Fiberon PA6-GF25.bbsflmt |
| 0.4 | Polymaker Fiberon PA612-CF15 | PA-CF | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Fiberon PA612-CF15.bbsflmt |
| 0.4 | Polymaker Fiberon PA612-ESD | PA-CF | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Fiberon PA612-ESD.bbsflmt |
| 0.4 | Polymaker Fiberon PET-CF17 | PET-CF | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Fiberon PET-CF17.bbsflmt |
| 0.4 | Polymaker Fiberon PET-GF15 | PET-CF | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Fiberon PET-GF15.bbsflmt |
| 0.4 | Polymaker Fiberon PETG-ESD | PETG | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Fiberon PETG-ESD.bbsflmt |
| 0.4 | Polymaker Fiberon PETG-rCF08 | PETG-CF | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Fiberon PETG-rCF08.bbsflmt |
| 0.4 | Polymaker Fiberon PPS-GF20 | PPS-CF | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Fiberon PPS-GF20.bbsflmt |
| 0.4 | Polymaker HT-PLA | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker HT-PLA.bbsflmt |
| 0.4 | Polymaker HT-PLA-GF | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker HT-PLA-GF.bbsflmt |
| 0.4 | Polymaker Panchroma CoPE | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Panchroma CoPE.bbsflmt |
| 0.4 | Polymaker Panchroma PLA | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Panchroma PLA.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Celestial | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Panchroma PLA Celestial.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Panchroma PLA Galaxy.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Panchroma PLA Glow.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Panchroma PLA Luminous.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Metallic | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Panchroma PLA Metallic.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Panchroma PLA Neon.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Silk | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Panchroma PLA Silk.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Panchroma PLA Starlight.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Panchroma PLA Translucent.bbsflmt |
| 0.4 | Polymaker Panchroma PLA UV Shift | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker Panchroma PLA UV Shift.bbsflmt |
| 0.4 | Polymaker PETG | PETG | 1 | dist/bbsflmt/polymaker/h2d/Polymaker PETG.bbsflmt |
| 0.4 | Polymaker PETG Galaxy | PETG | 1 | dist/bbsflmt/polymaker/h2d/Polymaker PETG Galaxy.bbsflmt |
| 0.4 | Polymaker PLA | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker PLA.bbsflmt |
| 0.4 | Polymaker PLA Pro | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker PLA Pro.bbsflmt |
| 0.4 | Polymaker PLA Pro Metallic | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker PLA Pro Metallic.bbsflmt |
| 0.4 | Polymaker PolyFlex TPU95-HF | TPU | 1 | dist/bbsflmt/polymaker/h2d/Polymaker PolyFlex TPU95-HF.bbsflmt |
| 0.4 | Polymaker PolyLite PLA | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker PolyLite PLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker PolyLite PLA Galaxy.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker PolyLite PLA Glow.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker PolyLite PLA Luminous.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker PolyLite PLA Neon.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Pro | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker PolyLite PLA Pro.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Pro Metallic | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker PolyLite PLA Pro Metallic.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker PolyLite PLA Starlight.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker PolyLite PLA Translucent.bbsflmt |
| 0.4 | Polymaker PolyMax PLA | PLA | 1 | dist/bbsflmt/polymaker/h2d/Polymaker PolyMax PLA.bbsflmt |

### Bambu Lab H2S

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | Polymaker ABS Max | ABS | 1 | dist/bbsflmt/polymaker/h2s/Polymaker ABS Max.bbsflmt |
| 0.4 | Polymaker Fiberon ASA-CF08 | ASA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Fiberon ASA-CF08.bbsflmt |
| 0.4 | Polymaker Fiberon PA12-CF10 | PA-CF | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Fiberon PA12-CF10.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-CF20 | PA6-CF | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Fiberon PA6-CF20.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-GF25 | PA-GF | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Fiberon PA6-GF25.bbsflmt |
| 0.4 | Polymaker Fiberon PA612-CF15 | PA-CF | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Fiberon PA612-CF15.bbsflmt |
| 0.4 | Polymaker Fiberon PA612-ESD | PA-CF | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Fiberon PA612-ESD.bbsflmt |
| 0.4 | Polymaker Fiberon PET-CF17 | PET-CF | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Fiberon PET-CF17.bbsflmt |
| 0.4 | Polymaker Fiberon PET-GF15 | PET-CF | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Fiberon PET-GF15.bbsflmt |
| 0.4 | Polymaker Fiberon PETG-rCF08 | PETG-CF | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Fiberon PETG-rCF08.bbsflmt |
| 0.4 | Polymaker Fiberon PPS-CF10 | PPS-CF | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Fiberon PPS-CF10.bbsflmt |
| 0.4 | Polymaker Fiberon PPS-GF20 | PPS-CF | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Fiberon PPS-GF20.bbsflmt |
| 0.4 | Polymaker HT-PLA | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker HT-PLA.bbsflmt |
| 0.4 | Polymaker HT-PLA-GF | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker HT-PLA-GF.bbsflmt |
| 0.4 | Polymaker Panchroma CoPE | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Panchroma CoPE.bbsflmt |
| 0.4 | Polymaker Panchroma PLA | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Panchroma PLA.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Celestial | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Panchroma PLA Celestial.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Panchroma PLA Galaxy.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Panchroma PLA Glow.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Panchroma PLA Luminous.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Metallic | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Panchroma PLA Metallic.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Panchroma PLA Neon.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Satin | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Panchroma PLA Satin.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Panchroma PLA Starlight.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Panchroma PLA Translucent.bbsflmt |
| 0.4 | Polymaker Panchroma PLA UV Shift | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker Panchroma PLA UV Shift.bbsflmt |
| 0.4 | Polymaker PETG | PETG | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PETG.bbsflmt |
| 0.4 | Polymaker PETG Galaxy | PETG | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PETG Galaxy.bbsflmt |
| 0.4 | Polymaker PLA | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PLA.bbsflmt |
| 0.4 | Polymaker PLA Pro | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PLA Pro.bbsflmt |
| 0.4 | Polymaker PLA Pro Metallic | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PLA Pro Metallic.bbsflmt |
| 0.4 | Polymaker PolyLite CosPLA | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PolyLite CosPLA.bbsflmt |
| 0.4 | Polymaker PolyLite LW-PLA | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PolyLite LW-PLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PolyLite PLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PolyLite PLA Galaxy.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PolyLite PLA Glow.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PolyLite PLA Luminous.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PolyLite PLA Neon.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Pro | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PolyLite PLA Pro.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Pro Metallic | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PolyLite PLA Pro Metallic.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PolyLite PLA Starlight.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PolyLite PLA Translucent.bbsflmt |
| 0.4 | Polymaker PolyMax PLA | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PolyMax PLA.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA+ | PLA | 1 | dist/bbsflmt/polymaker/h2s/Polymaker PolyTerra PLA+.bbsflmt |

### Bambu Lab P1P

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | Polymaker Panchroma CoPE | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker Panchroma CoPE.bbsflmt |
| 0.4 | Polymaker Panchroma PLA | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker Panchroma PLA.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Celestial | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker Panchroma PLA Celestial.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker Panchroma PLA Galaxy.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker Panchroma PLA Glow.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker Panchroma PLA Luminous.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker Panchroma PLA Marble.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Matte | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker Panchroma PLA Matte.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Metallic | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker Panchroma PLA Metallic.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker Panchroma PLA Neon.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Satin | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker Panchroma PLA Satin.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Silk | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker Panchroma PLA Silk.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker Panchroma PLA Starlight.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker Panchroma PLA Translucent.bbsflmt |
| 0.4 | Polymaker Panchroma PLA UV Shift | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker Panchroma PLA UV Shift.bbsflmt |
| 0.4 | Polymaker PolyLite CosPLA | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker PolyLite CosPLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker PolyLite PLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker PolyLite PLA Galaxy.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker PolyLite PLA Glow.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker PolyLite PLA Luminous.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker PolyLite PLA Neon.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker PolyLite PLA Starlight.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker PolyLite PLA Translucent.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker PolyTerra PLA.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker PolyTerra PLA Marble.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA+ | PLA | 1 | dist/bbsflmt/polymaker/p1p/Polymaker PolyTerra PLA+.bbsflmt |

### Bambu Lab P1S

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | Polymaker ABS Max | ABS | 1 | dist/bbsflmt/polymaker/p1s/Polymaker ABS Max.bbsflmt |
| 0.4 | Polymaker ABS Pro | ABS | 1 | dist/bbsflmt/polymaker/p1s/Polymaker ABS Pro.bbsflmt |
| 0.4 | Polymaker ABS Pro Galaxy | ABS | 1 | dist/bbsflmt/polymaker/p1s/Polymaker ABS Pro Galaxy.bbsflmt |
| 0.4 | Polymaker Fiberon PA12-CF10 | PA-CF | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Fiberon PA12-CF10.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-CF20 | PA6-CF | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Fiberon PA6-CF20.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-GF25 | PA-GF | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Fiberon PA6-GF25.bbsflmt |
| 0.4 | Polymaker Fiberon PA612-CF15 | PA-CF | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Fiberon PA612-CF15.bbsflmt |
| 0.4 | Polymaker Fiberon PET-CF17 | PET-CF | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Fiberon PET-CF17.bbsflmt |
| 0.4 | Polymaker Fiberon PETG-ESD | PETG | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Fiberon PETG-ESD.bbsflmt |
| 0.4 | Polymaker Fiberon PETG-rCF08 | PETG-CF | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Fiberon PETG-rCF08.bbsflmt |
| 0.4 | Polymaker HT-PLA | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker HT-PLA.bbsflmt |
| 0.4 | Polymaker Panchroma CoPE | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Panchroma CoPE.bbsflmt |
| 0.4 | Polymaker Panchroma PLA | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Panchroma PLA.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Celestial | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Panchroma PLA Celestial.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Panchroma PLA Galaxy.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Panchroma PLA Glow.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Panchroma PLA Luminous.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Panchroma PLA Marble.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Matte | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Panchroma PLA Matte.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Metallic | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Panchroma PLA Metallic.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Panchroma PLA Neon.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Satin | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Panchroma PLA Satin.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Silk | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Panchroma PLA Silk.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Panchroma PLA Starlight.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Panchroma PLA Translucent.bbsflmt |
| 0.4 | Polymaker Panchroma PLA UV Shift | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker Panchroma PLA UV Shift.bbsflmt |
| 0.4 | Polymaker PETG | PETG | 1 | dist/bbsflmt/polymaker/p1s/Polymaker PETG.bbsflmt |
| 0.4 | Polymaker PETG Galaxy | PETG | 1 | dist/bbsflmt/polymaker/p1s/Polymaker PETG Galaxy.bbsflmt |
| 0.4 | Polymaker PLA Pro | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker PLA Pro.bbsflmt |
| 0.4 | Polymaker PLA Pro Metallic | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker PLA Pro Metallic.bbsflmt |
| 0.4 | Polymaker PolyFlex TPU95 | TPU | 1 | dist/bbsflmt/polymaker/p1s/Polymaker PolyFlex TPU95.bbsflmt |
| 0.4 | Polymaker PolyLite CosPLA | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker PolyLite CosPLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker PolyLite PLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker PolyLite PLA Galaxy.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker PolyLite PLA Glow.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker PolyLite PLA Luminous.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker PolyLite PLA Neon.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker PolyLite PLA Starlight.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker PolyLite PLA Translucent.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker PolyTerra PLA.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker PolyTerra PLA Marble.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA+ | PLA | 1 | dist/bbsflmt/polymaker/p1s/Polymaker PolyTerra PLA+.bbsflmt |

### Bambu Lab P2S

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | Polymaker ABS Pro | ABS | 1 | dist/bbsflmt/polymaker/p2s/Polymaker ABS Pro.bbsflmt |
| 0.4 | Polymaker ABS Pro Galaxy | ABS | 1 | dist/bbsflmt/polymaker/p2s/Polymaker ABS Pro Galaxy.bbsflmt |
| 0.4 | Polymaker ASA | ASA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker ASA.bbsflmt |
| 0.4 | Polymaker Fiberon ASA-CF08 | ASA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Fiberon ASA-CF08.bbsflmt |
| 0.4 | Polymaker Fiberon PA12-CF10 | PA-CF | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Fiberon PA12-CF10.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-CF20 | PA6-CF | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Fiberon PA6-CF20.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-GF25 | PA-GF | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Fiberon PA6-GF25.bbsflmt |
| 0.4 | Polymaker Fiberon PA612-CF15 | PA-CF | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Fiberon PA612-CF15.bbsflmt |
| 0.4 | Polymaker Fiberon PA612-ESD | PA-CF | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Fiberon PA612-ESD.bbsflmt |
| 0.4 | Polymaker Fiberon PET-CF17 | PET-CF | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Fiberon PET-CF17.bbsflmt |
| 0.4 | Polymaker Fiberon PET-GF15 | PET-CF | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Fiberon PET-GF15.bbsflmt |
| 0.4 | Polymaker Fiberon PETG-ESD | PETG | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Fiberon PETG-ESD.bbsflmt |
| 0.4 | Polymaker HT-PLA | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker HT-PLA.bbsflmt |
| 0.4 | Polymaker HT-PLA-GF | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker HT-PLA-GF.bbsflmt |
| 0.4 | Polymaker Panchroma CoPE | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Panchroma CoPE.bbsflmt |
| 0.4 | Polymaker Panchroma PLA | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Panchroma PLA.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Celestial | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Panchroma PLA Celestial.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Panchroma PLA Galaxy.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Panchroma PLA Glow.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Panchroma PLA Luminous.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Panchroma PLA Marble.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Matte | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Panchroma PLA Matte.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Metallic | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Panchroma PLA Metallic.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Panchroma PLA Neon.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Satin | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Panchroma PLA Satin.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Silk | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Panchroma PLA Silk.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Panchroma PLA Starlight.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Panchroma PLA Translucent.bbsflmt |
| 0.4 | Polymaker Panchroma PLA UV Shift | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker Panchroma PLA UV Shift.bbsflmt |
| 0.4 | Polymaker PETG | PETG | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PETG.bbsflmt |
| 0.4 | Polymaker PETG Galaxy | PETG | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PETG Galaxy.bbsflmt |
| 0.4 | Polymaker PLA | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PLA.bbsflmt |
| 0.4 | Polymaker PLA Pro | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PLA Pro.bbsflmt |
| 0.4 | Polymaker PLA Pro Metallic | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PLA Pro Metallic.bbsflmt |
| 0.4 | Polymaker PolyLite ABS | ABS | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PolyLite ABS.bbsflmt |
| 0.4 | Polymaker PolyLite CosPLA | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PolyLite CosPLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PolyLite PLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PolyLite PLA Galaxy.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PolyLite PLA Glow.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PolyLite PLA Luminous.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PolyLite PLA Neon.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Pro | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PolyLite PLA Pro.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Pro Metallic | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PolyLite PLA Pro Metallic.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PolyLite PLA Starlight.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PolyLite PLA Translucent.bbsflmt |
| 0.4 | Polymaker PolyMax PLA | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PolyMax PLA.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PolyTerra PLA.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PolyTerra PLA Marble.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA+ | PLA | 1 | dist/bbsflmt/polymaker/p2s/Polymaker PolyTerra PLA+.bbsflmt |

### Bambu Lab X1

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | Polymaker ABS Max | ABS | 1 | dist/bbsflmt/polymaker/x1/Polymaker ABS Max.bbsflmt |
| 0.4 | Polymaker ABS Pro | ABS | 1 | dist/bbsflmt/polymaker/x1/Polymaker ABS Pro.bbsflmt |
| 0.4 | Polymaker ABS Pro Galaxy | ABS | 1 | dist/bbsflmt/polymaker/x1/Polymaker ABS Pro Galaxy.bbsflmt |
| 0.4 | Polymaker Fiberon PA12-CF10 | PA-CF | 1 | dist/bbsflmt/polymaker/x1/Polymaker Fiberon PA12-CF10.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-CF20 | PA6-CF | 1 | dist/bbsflmt/polymaker/x1/Polymaker Fiberon PA6-CF20.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-GF25 | PA-GF | 1 | dist/bbsflmt/polymaker/x1/Polymaker Fiberon PA6-GF25.bbsflmt |
| 0.4 | Polymaker Fiberon PA612-CF15 | PA-CF | 1 | dist/bbsflmt/polymaker/x1/Polymaker Fiberon PA612-CF15.bbsflmt |
| 0.4 | Polymaker Fiberon PET-CF17 | PET-CF | 1 | dist/bbsflmt/polymaker/x1/Polymaker Fiberon PET-CF17.bbsflmt |
| 0.4 | Polymaker Fiberon PETG-ESD | PETG | 1 | dist/bbsflmt/polymaker/x1/Polymaker Fiberon PETG-ESD.bbsflmt |
| 0.4 | Polymaker Fiberon PETG-rCF08 | PETG-CF | 1 | dist/bbsflmt/polymaker/x1/Polymaker Fiberon PETG-rCF08.bbsflmt |
| 0.4 | Polymaker HT-PLA | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker HT-PLA.bbsflmt |
| 0.4 | Polymaker Panchroma CoPE | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker Panchroma CoPE.bbsflmt |
| 0.4 | Polymaker Panchroma PLA | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker Panchroma PLA.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Celestial | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker Panchroma PLA Celestial.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker Panchroma PLA Galaxy.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker Panchroma PLA Glow.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker Panchroma PLA Luminous.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker Panchroma PLA Marble.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Matte | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker Panchroma PLA Matte.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Metallic | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker Panchroma PLA Metallic.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker Panchroma PLA Neon.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Satin | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker Panchroma PLA Satin.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Silk | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker Panchroma PLA Silk.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker Panchroma PLA Starlight.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker Panchroma PLA Translucent.bbsflmt |
| 0.4 | Polymaker Panchroma PLA UV Shift | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker Panchroma PLA UV Shift.bbsflmt |
| 0.4 | Polymaker PETG | PETG | 1 | dist/bbsflmt/polymaker/x1/Polymaker PETG.bbsflmt |
| 0.4 | Polymaker PETG Galaxy | PETG | 1 | dist/bbsflmt/polymaker/x1/Polymaker PETG Galaxy.bbsflmt |
| 0.4 | Polymaker PLA Pro | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker PLA Pro.bbsflmt |
| 0.4 | Polymaker PLA Pro Metallic | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker PLA Pro Metallic.bbsflmt |
| 0.4 | Polymaker PolyFlex TPU95 | TPU | 1 | dist/bbsflmt/polymaker/x1/Polymaker PolyFlex TPU95.bbsflmt |
| 0.4 | Polymaker PolyLite CosPLA | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker PolyLite CosPLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker PolyLite PLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker PolyLite PLA Galaxy.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker PolyLite PLA Glow.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker PolyLite PLA Luminous.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker PolyLite PLA Neon.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker PolyLite PLA Starlight.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker PolyLite PLA Translucent.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker PolyTerra PLA.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker PolyTerra PLA Marble.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA+ | PLA | 1 | dist/bbsflmt/polymaker/x1/Polymaker PolyTerra PLA+.bbsflmt |

### Bambu Lab X1 Carbon

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | Polymaker ABS Max | ABS | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker ABS Max.bbsflmt |
| 0.4 | Polymaker ABS Pro | ABS | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker ABS Pro.bbsflmt |
| 0.4 | Polymaker ABS Pro Galaxy | ABS | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker ABS Pro Galaxy.bbsflmt |
| 0.4 | Polymaker Fiberon PA12-CF10 | PA-CF | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Fiberon PA12-CF10.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-CF20 | PA6-CF | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Fiberon PA6-CF20.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-GF25 | PA-GF | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Fiberon PA6-GF25.bbsflmt |
| 0.4 | Polymaker Fiberon PA612-CF15 | PA-CF | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Fiberon PA612-CF15.bbsflmt |
| 0.4 | Polymaker Fiberon PET-CF17 | PET-CF | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Fiberon PET-CF17.bbsflmt |
| 0.4 | Polymaker Fiberon PETG-ESD | PETG | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Fiberon PETG-ESD.bbsflmt |
| 0.4 | Polymaker Fiberon PETG-rCF08 | PETG-CF | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Fiberon PETG-rCF08.bbsflmt |
| 0.4 | Polymaker HT-PLA | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker HT-PLA.bbsflmt |
| 0.4 | Polymaker Panchroma CoPE | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Panchroma CoPE.bbsflmt |
| 0.4 | Polymaker Panchroma PLA | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Panchroma PLA.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Celestial | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Panchroma PLA Celestial.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Panchroma PLA Galaxy.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Panchroma PLA Glow.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Panchroma PLA Luminous.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Panchroma PLA Marble.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Matte | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Panchroma PLA Matte.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Metallic | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Panchroma PLA Metallic.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Panchroma PLA Neon.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Satin | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Panchroma PLA Satin.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Silk | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Panchroma PLA Silk.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Panchroma PLA Starlight.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Panchroma PLA Translucent.bbsflmt |
| 0.4 | Polymaker Panchroma PLA UV Shift | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker Panchroma PLA UV Shift.bbsflmt |
| 0.4 | Polymaker PETG | PETG | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker PETG.bbsflmt |
| 0.4 | Polymaker PETG Galaxy | PETG | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker PETG Galaxy.bbsflmt |
| 0.4 | Polymaker PLA Pro | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker PLA Pro.bbsflmt |
| 0.4 | Polymaker PLA Pro Metallic | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker PLA Pro Metallic.bbsflmt |
| 0.4 | Polymaker PolyFlex TPU95 | TPU | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker PolyFlex TPU95.bbsflmt |
| 0.4 | Polymaker PolyLite CosPLA | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker PolyLite CosPLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker PolyLite PLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker PolyLite PLA Galaxy.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker PolyLite PLA Glow.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker PolyLite PLA Luminous.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker PolyLite PLA Neon.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker PolyLite PLA Starlight.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker PolyLite PLA Translucent.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker PolyTerra PLA.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker PolyTerra PLA Marble.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA+ | PLA | 1 | dist/bbsflmt/polymaker/x1-carbon/Polymaker PolyTerra PLA+.bbsflmt |

### Bambu Lab X1E

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | Polymaker ABS Max | ABS | 1 | dist/bbsflmt/polymaker/x1e/Polymaker ABS Max.bbsflmt |
| 0.4 | Polymaker ABS Pro | ABS | 1 | dist/bbsflmt/polymaker/x1e/Polymaker ABS Pro.bbsflmt |
| 0.4 | Polymaker ABS Pro Galaxy | ABS | 1 | dist/bbsflmt/polymaker/x1e/Polymaker ABS Pro Galaxy.bbsflmt |
| 0.4 | Polymaker Fiberon PA12-CF10 | PA-CF | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Fiberon PA12-CF10.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-CF20 | PA6-CF | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Fiberon PA6-CF20.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-GF25 | PA-GF | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Fiberon PA6-GF25.bbsflmt |
| 0.4 | Polymaker Fiberon PA612-CF15 | PA-CF | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Fiberon PA612-CF15.bbsflmt |
| 0.4 | Polymaker Fiberon PET-CF17 | PET-CF | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Fiberon PET-CF17.bbsflmt |
| 0.4 | Polymaker Fiberon PETG-ESD | PETG | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Fiberon PETG-ESD.bbsflmt |
| 0.4 | Polymaker Fiberon PETG-rCF08 | PETG-CF | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Fiberon PETG-rCF08.bbsflmt |
| 0.4 | Polymaker HT-PLA | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker HT-PLA.bbsflmt |
| 0.4 | Polymaker Panchroma CoPE | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Panchroma CoPE.bbsflmt |
| 0.4 | Polymaker Panchroma PLA | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Panchroma PLA.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Celestial | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Panchroma PLA Celestial.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Panchroma PLA Galaxy.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Panchroma PLA Glow.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Panchroma PLA Luminous.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Panchroma PLA Marble.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Matte | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Panchroma PLA Matte.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Metallic | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Panchroma PLA Metallic.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Panchroma PLA Neon.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Satin | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Panchroma PLA Satin.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Silk | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Panchroma PLA Silk.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Panchroma PLA Starlight.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Panchroma PLA Translucent.bbsflmt |
| 0.4 | Polymaker Panchroma PLA UV Shift | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker Panchroma PLA UV Shift.bbsflmt |
| 0.4 | Polymaker PETG | PETG | 1 | dist/bbsflmt/polymaker/x1e/Polymaker PETG.bbsflmt |
| 0.4 | Polymaker PETG Galaxy | PETG | 1 | dist/bbsflmt/polymaker/x1e/Polymaker PETG Galaxy.bbsflmt |
| 0.4 | Polymaker PLA Pro | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker PLA Pro.bbsflmt |
| 0.4 | Polymaker PLA Pro Metallic | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker PLA Pro Metallic.bbsflmt |
| 0.4 | Polymaker PolyFlex TPU95 | TPU | 1 | dist/bbsflmt/polymaker/x1e/Polymaker PolyFlex TPU95.bbsflmt |
| 0.4 | Polymaker PolyLite CosPLA | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker PolyLite CosPLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker PolyLite PLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker PolyLite PLA Galaxy.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker PolyLite PLA Glow.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker PolyLite PLA Luminous.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker PolyLite PLA Neon.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker PolyLite PLA Starlight.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker PolyLite PLA Translucent.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker PolyTerra PLA.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker PolyTerra PLA Marble.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA+ | PLA | 1 | dist/bbsflmt/polymaker/x1e/Polymaker PolyTerra PLA+.bbsflmt |

### Bambu Lab X2D

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | Polymaker ABS Pro | ABS | 1 | dist/bbsflmt/polymaker/x2d/Polymaker ABS Pro.bbsflmt |
| 0.4 | Polymaker ABS Pro Galaxy | ABS | 1 | dist/bbsflmt/polymaker/x2d/Polymaker ABS Pro Galaxy.bbsflmt |
| 0.4 | Polymaker ASA | ASA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker ASA.bbsflmt |
| 0.4 | Polymaker Fiberon ASA-CF08 | ASA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Fiberon ASA-CF08.bbsflmt |
| 0.4 | Polymaker Fiberon PA12-CF10 | PA-CF | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Fiberon PA12-CF10.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-CF20 | PA6-CF | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Fiberon PA6-CF20.bbsflmt |
| 0.4 | Polymaker Fiberon PA6-GF25 | PA-GF | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Fiberon PA6-GF25.bbsflmt |
| 0.4 | Polymaker Fiberon PA612-CF15 | PA-CF | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Fiberon PA612-CF15.bbsflmt |
| 0.4 | Polymaker Fiberon PA612-ESD | PA-CF | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Fiberon PA612-ESD.bbsflmt |
| 0.4 | Polymaker Fiberon PET-CF17 | PET-CF | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Fiberon PET-CF17.bbsflmt |
| 0.4 | Polymaker Fiberon PET-GF15 | PET-CF | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Fiberon PET-GF15.bbsflmt |
| 0.4 | Polymaker Fiberon PETG-ESD | PETG | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Fiberon PETG-ESD.bbsflmt |
| 0.4 | Polymaker Fiberon PETG-rCF08 | PETG-CF | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Fiberon PETG-rCF08.bbsflmt |
| 0.4 | Polymaker HT-PLA | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker HT-PLA.bbsflmt |
| 0.4 | Polymaker HT-PLA-GF | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker HT-PLA-GF.bbsflmt |
| 0.4 | Polymaker Panchroma CoPE | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Panchroma CoPE.bbsflmt |
| 0.4 | Polymaker Panchroma PLA | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Panchroma PLA.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Celestial | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Panchroma PLA Celestial.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Panchroma PLA Galaxy.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Panchroma PLA Glow.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Panchroma PLA Luminous.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Panchroma PLA Marble.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Matte | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Panchroma PLA Matte.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Metallic | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Panchroma PLA Metallic.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Panchroma PLA Neon.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Satin | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Panchroma PLA Satin.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Silk | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Panchroma PLA Silk.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Panchroma PLA Starlight.bbsflmt |
| 0.4 | Polymaker Panchroma PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Panchroma PLA Translucent.bbsflmt |
| 0.4 | Polymaker Panchroma PLA UV Shift | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker Panchroma PLA UV Shift.bbsflmt |
| 0.4 | Polymaker PETG | PETG | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PETG.bbsflmt |
| 0.4 | Polymaker PETG Galaxy | PETG | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PETG Galaxy.bbsflmt |
| 0.4 | Polymaker PLA | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PLA.bbsflmt |
| 0.4 | Polymaker PLA Pro | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PLA Pro.bbsflmt |
| 0.4 | Polymaker PLA Pro Metallic | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PLA Pro Metallic.bbsflmt |
| 0.4 | Polymaker PolyCast | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyCast.bbsflmt |
| 0.4 | Polymaker PolyFlex TPU95 | TPU | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyFlex TPU95.bbsflmt |
| 0.4 | Polymaker PolyFlex TPU95-HF | TPU | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyFlex TPU95-HF.bbsflmt |
| 0.4 | Polymaker PolyLite ABS | ABS | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyLite ABS.bbsflmt |
| 0.4 | Polymaker PolyLite CosPLA | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyLite CosPLA.bbsflmt |
| 0.4 | Polymaker PolyLite LW-PLA | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyLite LW-PLA.bbsflmt |
| 0.4 | Polymaker PolyLite PC | PC | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyLite PC.bbsflmt |
| 0.4 | Polymaker PolyLite PETG | PETG | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyLite PETG.bbsflmt |
| 0.4 | Polymaker PolyLite PETG Translucent | PETG | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyLite PETG Translucent.bbsflmt |
| 0.4 | Polymaker PolyLite PLA | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyLite PLA.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Galaxy | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyLite PLA Galaxy.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Glow | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyLite PLA Glow.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Luminous | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyLite PLA Luminous.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Neon | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyLite PLA Neon.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Pro | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyLite PLA Pro.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Pro Metallic | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyLite PLA Pro Metallic.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Starlight | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyLite PLA Starlight.bbsflmt |
| 0.4 | Polymaker PolyLite PLA Translucent | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyLite PLA Translucent.bbsflmt |
| 0.4 | Polymaker PolyLite PLA-CF | PLA-CF | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyLite PLA-CF.bbsflmt |
| 0.4 | Polymaker PolyMax PC | PC | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyMax PC.bbsflmt |
| 0.4 | Polymaker PolyMax PETG | PETG | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyMax PETG.bbsflmt |
| 0.4 | Polymaker PolyMax PLA | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyMax PLA.bbsflmt |
| 0.4 | Polymaker PolySmooth | PVB | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolySmooth.bbsflmt |
| 0.4 | Polymaker PolySupport | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolySupport.bbsflmt |
| 0.4 | Polymaker PolySupport for PA12 | PA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolySupport for PA12.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyTerra PLA.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA Marble | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyTerra PLA Marble.bbsflmt |
| 0.4 | Polymaker PolyTerra PLA+ | PLA | 1 | dist/bbsflmt/polymaker/x2d/Polymaker PolyTerra PLA+.bbsflmt |

</details>

<details>
<summary>SUNLU details: 18 bundles, 9 materials, 2 printers, 63 profiles</summary>

### Bambu Lab H2C

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.2, 0.6, 0.8 | SUNLU ASA BASIC | ASA | 3 | dist/bbsflmt/sunlu/h2c/SUNLU ASA BASIC.bbsflmt |
| 0.2, 0.4, 0.6, 0.8 | SUNLU PETG BASIC | PETG | 4 | dist/bbsflmt/sunlu/h2c/SUNLU PETG BASIC.bbsflmt |
| 0.4, 0.6, 0.8 | SUNLU PETG HS Matte | PETG | 3 | dist/bbsflmt/sunlu/h2c/SUNLU PETG HS Matte.bbsflmt |
| 0.2, 0.4, 0.6 | SUNLU PLA + | PLA | 3 | dist/bbsflmt/sunlu/h2c/SUNLU PLA +.bbsflmt |
| 0.2, 0.4, 0.6, 0.8 | SUNLU PLA + 2.0 | PLA | 4 | dist/bbsflmt/sunlu/h2c/SUNLU PLA + 2.0.bbsflmt |
| 0.2, 0.4, 0.6, 0.8 | SUNLU PLA + Silk | PLA | 4 | dist/bbsflmt/sunlu/h2c/SUNLU PLA + Silk.bbsflmt |
| 0.4, 0.6, 0.8 | SUNLU PLA Marble | PLA | 3 | dist/bbsflmt/sunlu/h2c/SUNLU PLA Marble.bbsflmt |
| 0.2, 0.4, 0.6, 0.8 | SUNLU PLA Matte | PLA | 4 | dist/bbsflmt/sunlu/h2c/SUNLU PLA Matte.bbsflmt |
| 0.4, 0.6, 0.8 | SUNLU PLA Wood | PLA | 3 | dist/bbsflmt/sunlu/h2c/SUNLU PLA Wood.bbsflmt |

### Bambu Lab P2S

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.2, 0.4, 0.6, 0.8 | SUNLU ASA BASIC | ASA | 4 | dist/bbsflmt/sunlu/p2s/SUNLU ASA BASIC.bbsflmt |
| 0.2, 0.4, 0.6, 0.8 | SUNLU PETG BASIC | PETG | 4 | dist/bbsflmt/sunlu/p2s/SUNLU PETG BASIC.bbsflmt |
| 0.4, 0.6, 0.8 | SUNLU PETG HS Matte | PETG | 3 | dist/bbsflmt/sunlu/p2s/SUNLU PETG HS Matte.bbsflmt |
| 0.2, 0.4, 0.6 | SUNLU PLA + | PLA | 3 | dist/bbsflmt/sunlu/p2s/SUNLU PLA +.bbsflmt |
| 0.2, 0.4, 0.6, 0.8 | SUNLU PLA + 2.0 | PLA | 4 | dist/bbsflmt/sunlu/p2s/SUNLU PLA + 2.0.bbsflmt |
| 0.2, 0.4, 0.6, 0.8 | SUNLU PLA + Silk | PLA | 4 | dist/bbsflmt/sunlu/p2s/SUNLU PLA + Silk.bbsflmt |
| 0.4, 0.6, 0.8 | SUNLU PLA Marble | PLA | 3 | dist/bbsflmt/sunlu/p2s/SUNLU PLA Marble.bbsflmt |
| 0.2, 0.4, 0.6, 0.8 | SUNLU PLA Matte | PLA | 4 | dist/bbsflmt/sunlu/p2s/SUNLU PLA Matte.bbsflmt |
| 0.4, 0.6, 0.8 | SUNLU PLA Wood | PLA | 3 | dist/bbsflmt/sunlu/p2s/SUNLU PLA Wood.bbsflmt |

</details>

<details>
<summary>TINMORRY details: 154 bundles, 28 materials, 12 printers, 155 profiles</summary>

### Bambu Lab A1

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | TINMORRY Galaxy PLA | PLA | 1 | dist/bbsflmt/tinmorry/a1/TINMORRY Galaxy PLA.bbsflmt |
| 0.4 | TINMORRY PC GF | PC-GF | 1 | dist/bbsflmt/tinmorry/a1/TINMORRY PC GF.bbsflmt |
| 0.4 | TINMORRY PET GF | PET-GF | 1 | dist/bbsflmt/tinmorry/a1/TINMORRY PET GF.bbsflmt |
| 0.4 | TINMORRY PETG CF | PETG-CF | 1 | dist/bbsflmt/tinmorry/a1/TINMORRY PETG CF.bbsflmt |
| 0.4 | TINMORRY PETG ECO | PETG | 1 | dist/bbsflmt/tinmorry/a1/TINMORRY PETG ECO.bbsflmt |
| 0.4 | TINMORRY PETG GF | PETG-GF | 1 | dist/bbsflmt/tinmorry/a1/TINMORRY PETG GF.bbsflmt |
| 0.4 | TINMORRY PETG HS | PETG | 1 | dist/bbsflmt/tinmorry/a1/TINMORRY PETG HS.bbsflmt |
| 0.4 | TINMORRY PETG Marble | PETG | 1 | dist/bbsflmt/tinmorry/a1/TINMORRY PETG Marble.bbsflmt |
| 0.4 | TINMORRY PETG Metallic | PETG | 1 | dist/bbsflmt/tinmorry/a1/TINMORRY PETG Metallic.bbsflmt |
| 0.4 | TINMORRY PLA | PLA | 1 | dist/bbsflmt/tinmorry/a1/TINMORRY PLA.bbsflmt |
| 0.4 | TINMORRY PLA CF | PLA-CF | 1 | dist/bbsflmt/tinmorry/a1/TINMORRY PLA CF.bbsflmt |
| 0.4 | TINMORRY PLA Matte | PLA | 1 | dist/bbsflmt/tinmorry/a1/TINMORRY PLA Matte.bbsflmt |
| 0.4 | TINMORRY PLA Silk | PLA | 1 | dist/bbsflmt/tinmorry/a1/TINMORRY PLA Silk.bbsflmt |
| 0.4 | TINMORRY TPU | TPU | 1 | dist/bbsflmt/tinmorry/a1/TINMORRY TPU.bbsflmt |

### Bambu Lab A1 mini

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | TINMORRY PETG CF | PETG-CF | 1 | dist/bbsflmt/tinmorry/a1-mini/TINMORRY PETG CF.bbsflmt |
| 0.4 | TINMORRY PETG ECO | PETG | 1 | dist/bbsflmt/tinmorry/a1-mini/TINMORRY PETG ECO.bbsflmt |
| 0.4 | TINMORRY PETG GF | PETG-GF | 1 | dist/bbsflmt/tinmorry/a1-mini/TINMORRY PETG GF.bbsflmt |
| 0.4 | TINMORRY PETG Marble | PETG | 1 | dist/bbsflmt/tinmorry/a1-mini/TINMORRY PETG Marble.bbsflmt |
| 0.4 | TINMORRY PETG Matte | PETG | 1 | dist/bbsflmt/tinmorry/a1-mini/TINMORRY PETG Matte.bbsflmt |
| 0.4 | TINMORRY PETG Metallic | PETG | 1 | dist/bbsflmt/tinmorry/a1-mini/TINMORRY PETG Metallic.bbsflmt |
| 0.4 | TINMORRY PLA | PLA | 1 | dist/bbsflmt/tinmorry/a1-mini/TINMORRY PLA.bbsflmt |
| 0.4 | TINMORRY PLA CF | PLA-CF | 1 | dist/bbsflmt/tinmorry/a1-mini/TINMORRY PLA CF.bbsflmt |
| 0.4 | TINMORRY PLA Matte | PLA | 1 | dist/bbsflmt/tinmorry/a1-mini/TINMORRY PLA Matte.bbsflmt |
| 0.4 | TINMORRY PLA Silk | PLA | 1 | dist/bbsflmt/tinmorry/a1-mini/TINMORRY PLA Silk.bbsflmt |
| 0.4 | TINMORRY TPU | TPU | 1 | dist/bbsflmt/tinmorry/a1-mini/TINMORRY TPU.bbsflmt |

### Bambu Lab H2C

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | TINMORRY ABS Pro | ABS | 1 | dist/bbsflmt/tinmorry/h2c/TINMORRY ABS Pro.bbsflmt |
| 0.4 | TINMORRY PETG CF | PETG-CF | 1 | dist/bbsflmt/tinmorry/h2c/TINMORRY PETG CF.bbsflmt |
| 0.4 | TINMORRY PETG ECO | PETG | 1 | dist/bbsflmt/tinmorry/h2c/TINMORRY PETG ECO.bbsflmt |
| 0.4 | TINMORRY PETG GF | PETG-GF | 1 | dist/bbsflmt/tinmorry/h2c/TINMORRY PETG GF.bbsflmt |
| 0.4 | TINMORRY PETG Marble | PETG | 1 | dist/bbsflmt/tinmorry/h2c/TINMORRY PETG Marble.bbsflmt |
| 0.4 | TINMORRY PETG Metallic | PETG | 1 | dist/bbsflmt/tinmorry/h2c/TINMORRY PETG Metallic.bbsflmt |
| 0.4 | TINMORRY PLA Rapid | PLA | 1 | dist/bbsflmt/tinmorry/h2c/TINMORRY PLA Rapid.bbsflmt |
| 0.4 | TINMORRY PLA Silk | PLA | 1 | dist/bbsflmt/tinmorry/h2c/TINMORRY PLA Silk.bbsflmt |
| 0.4 | TINMORRY TPU 95A | TPU | 1 | dist/bbsflmt/tinmorry/h2c/TINMORRY TPU 95A.bbsflmt |

### Bambu Lab H2D

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | TINMORRY ABS Pro | ABS | 1 | dist/bbsflmt/tinmorry/h2d/TINMORRY ABS Pro.bbsflmt |
| 0.4 | TINMORRY ASA | ASA | 1 | dist/bbsflmt/tinmorry/h2d/TINMORRY ASA.bbsflmt |
| 0.4 | TINMORRY ASA CF | ASA-CF | 1 | dist/bbsflmt/tinmorry/h2d/TINMORRY ASA CF.bbsflmt |
| 0.4 | TINMORRY PETG CF | PETG-CF | 1 | dist/bbsflmt/tinmorry/h2d/TINMORRY PETG CF.bbsflmt |
| 0.4 | TINMORRY PETG ECO | PETG | 1 | dist/bbsflmt/tinmorry/h2d/TINMORRY PETG ECO.bbsflmt |
| 0.4 | TINMORRY PETG GF | PETG-GF | 1 | dist/bbsflmt/tinmorry/h2d/TINMORRY PETG GF.bbsflmt |
| 0.4 | TINMORRY PETG Marble | PETG | 1 | dist/bbsflmt/tinmorry/h2d/TINMORRY PETG Marble.bbsflmt |
| 0.4 | TINMORRY PLA CF | PLA-CF | 1 | dist/bbsflmt/tinmorry/h2d/TINMORRY PLA CF.bbsflmt |
| 0.4 | TINMORRY PLA Matte | PLA | 1 | dist/bbsflmt/tinmorry/h2d/TINMORRY PLA Matte.bbsflmt |
| 0.4 | TINMORRY TPU 95A | TPU | 1 | dist/bbsflmt/tinmorry/h2d/TINMORRY TPU 95A.bbsflmt |

### Bambu Lab H2S

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | TINMORRY ASA | ASA | 1 | dist/bbsflmt/tinmorry/h2s/TINMORRY ASA.bbsflmt |
| 0.4 | TINMORRY ASA CF | ASA-CF | 1 | dist/bbsflmt/tinmorry/h2s/TINMORRY ASA CF.bbsflmt |
| 0.4 | TINMORRY PET CF | PET-CF | 1 | dist/bbsflmt/tinmorry/h2s/TINMORRY PET CF.bbsflmt |
| 0.4 | TINMORRY PET GF | PET-GF | 1 | dist/bbsflmt/tinmorry/h2s/TINMORRY PET GF.bbsflmt |
| 0.4 | TINMORRY PETG CF | PETG-CF | 1 | dist/bbsflmt/tinmorry/h2s/TINMORRY PETG CF.bbsflmt |
| 0.4 | TINMORRY PETG ECO | PETG | 1 | dist/bbsflmt/tinmorry/h2s/TINMORRY PETG ECO.bbsflmt |
| 0.4 | TINMORRY PETG GF | PETG-GF | 1 | dist/bbsflmt/tinmorry/h2s/TINMORRY PETG GF.bbsflmt |
| 0.4 | TINMORRY PETG Marble | PETG | 1 | dist/bbsflmt/tinmorry/h2s/TINMORRY PETG Marble.bbsflmt |
| 0.4 | TINMORRY PETG Metallic | PETG | 1 | dist/bbsflmt/tinmorry/h2s/TINMORRY PETG Metallic.bbsflmt |
| 0.4 | TINMORRY PLA Matte | PLA | 1 | dist/bbsflmt/tinmorry/h2s/TINMORRY PLA Matte.bbsflmt |
| 0.4 | TINMORRY PLA Rapid | PLA | 1 | dist/bbsflmt/tinmorry/h2s/TINMORRY PLA Rapid.bbsflmt |
| 0.4 | TINMORRY PLA Silk | PLA | 1 | dist/bbsflmt/tinmorry/h2s/TINMORRY PLA Silk.bbsflmt |
| 0.4 | TINMORRY TPU 95A | TPU | 1 | dist/bbsflmt/tinmorry/h2s/TINMORRY TPU 95A.bbsflmt |

### Bambu Lab P1P

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | TINMORRY ABS Pro | ABS | 1 | dist/bbsflmt/tinmorry/p1p/TINMORRY ABS Pro.bbsflmt |
| 0.4 | TINMORRY PC GF | PC-GF | 1 | dist/bbsflmt/tinmorry/p1p/TINMORRY PC GF.bbsflmt |
| 0.4 | TINMORRY PET CF | PET-CF | 1 | dist/bbsflmt/tinmorry/p1p/TINMORRY PET CF.bbsflmt |
| 0.4 | TINMORRY PET GF | PET-GF | 1 | dist/bbsflmt/tinmorry/p1p/TINMORRY PET GF.bbsflmt |
| 0.4 | TINMORRY PETG CF | PETG-CF | 1 | dist/bbsflmt/tinmorry/p1p/TINMORRY PETG CF.bbsflmt |
| 0.4 | TINMORRY PETG ECO | PETG | 1 | dist/bbsflmt/tinmorry/p1p/TINMORRY PETG ECO.bbsflmt |
| 0.4 | TINMORRY PETG GF | PETG-GF | 1 | dist/bbsflmt/tinmorry/p1p/TINMORRY PETG GF.bbsflmt |
| 0.4 | TINMORRY PETG HS | PETG | 1 | dist/bbsflmt/tinmorry/p1p/TINMORRY PETG HS.bbsflmt |
| 0.4 | TINMORRY PETG Marble | PETG | 1 | dist/bbsflmt/tinmorry/p1p/TINMORRY PETG Marble.bbsflmt |
| 0.4 | TINMORRY PETG Metallic | PETG | 1 | dist/bbsflmt/tinmorry/p1p/TINMORRY PETG Metallic.bbsflmt |
| 0.4 | TINMORRY PLA | PLA | 1 | dist/bbsflmt/tinmorry/p1p/TINMORRY PLA.bbsflmt |
| 0.4 | TINMORRY PLA CF | PLA-CF | 1 | dist/bbsflmt/tinmorry/p1p/TINMORRY PLA CF.bbsflmt |
| 0.4 | TINMORRY PLA Matte | PLA | 1 | dist/bbsflmt/tinmorry/p1p/TINMORRY PLA Matte.bbsflmt |
| 0.4 | TINMORRY PLA Silk | PLA | 1 | dist/bbsflmt/tinmorry/p1p/TINMORRY PLA Silk.bbsflmt |
| 0.4 | TINMORRY PP CF | PP-CF | 1 | dist/bbsflmt/tinmorry/p1p/TINMORRY PP CF.bbsflmt |
| 0.4 | TINMORRY TPU | TPU | 1 | dist/bbsflmt/tinmorry/p1p/TINMORRY TPU.bbsflmt |

### Bambu Lab P1S

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | TINMORRY ABS Pro | ABS | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY ABS Pro.bbsflmt |
| 0.4 | TINMORRY ASA | ASA | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY ASA.bbsflmt |
| 0.4 | TINMORRY PA CF | PA-CF | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY PA CF.bbsflmt |
| 0.4 | TINMORRY PAHT CF | PAHT-CF | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY PAHT CF.bbsflmt |
| 0.4 | TINMORRY PC GF | PC-GF | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY PC GF.bbsflmt |
| 0.4 | TINMORRY PET CF | PET-CF | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY PET CF.bbsflmt |
| 0.4 | TINMORRY PET GF | PET-GF | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY PET GF.bbsflmt |
| 0.4 | TINMORRY PETG CF | PETG-CF | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY PETG CF.bbsflmt |
| 0.4 | TINMORRY PETG ECO | PETG | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY PETG ECO.bbsflmt |
| 0.4, 0.6 | TINMORRY PETG GF | PETG-GF | 2 | dist/bbsflmt/tinmorry/p1s/TINMORRY PETG GF.bbsflmt |
| 0.4 | TINMORRY PETG HS | PETG | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY PETG HS.bbsflmt |
| 0.4 | TINMORRY PETG Marble | PETG | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY PETG Marble.bbsflmt |
| 0.4 | TINMORRY PETG Metallic | PETG | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY PETG Metallic.bbsflmt |
| 0.4 | TINMORRY PLA | PLA | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY PLA.bbsflmt |
| 0.4 | TINMORRY PLA CF | PLA-CF | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY PLA CF.bbsflmt |
| 0.4 | TINMORRY PLA Matte | PLA | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY PLA Matte.bbsflmt |
| 0.4 | TINMORRY PLA Silk | PLA | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY PLA Silk.bbsflmt |
| 0.4 | TINMORRY PP CF | PP-CF | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY PP CF.bbsflmt |
| 0.4 | TINMORRY TPU | TPU | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY TPU.bbsflmt |
| 0.4 | TINMORRY TPU GF | TPU-GF | 1 | dist/bbsflmt/tinmorry/p1s/TINMORRY TPU GF.bbsflmt |

### Bambu Lab P2S

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | TINMORRY ABS Pro | ABS | 1 | dist/bbsflmt/tinmorry/p2s/TINMORRY ABS Pro.bbsflmt |
| 0.4 | TINMORRY ASA | ASA | 1 | dist/bbsflmt/tinmorry/p2s/TINMORRY ASA.bbsflmt |
| 0.4 | TINMORRY Galaxy PETG | PETG | 1 | dist/bbsflmt/tinmorry/p2s/TINMORRY Galaxy PETG.bbsflmt |
| 0.4 | TINMORRY Galaxy PLA | PLA | 1 | dist/bbsflmt/tinmorry/p2s/TINMORRY Galaxy PLA.bbsflmt |
| 0.4 | TINMORRY PETG CF | PETG-CF | 1 | dist/bbsflmt/tinmorry/p2s/TINMORRY PETG CF.bbsflmt |
| 0.4 | TINMORRY PETG ECO | PETG | 1 | dist/bbsflmt/tinmorry/p2s/TINMORRY PETG ECO.bbsflmt |
| 0.4 | TINMORRY PETG GF | PETG-GF | 1 | dist/bbsflmt/tinmorry/p2s/TINMORRY PETG GF.bbsflmt |
| 0.4 | TINMORRY PETG Marble | PETG | 1 | dist/bbsflmt/tinmorry/p2s/TINMORRY PETG Marble.bbsflmt |
| 0.4 | TINMORRY PETG Matte | PETG | 1 | dist/bbsflmt/tinmorry/p2s/TINMORRY PETG Matte.bbsflmt |
| 0.4 | TINMORRY PETG Metallic | PETG | 1 | dist/bbsflmt/tinmorry/p2s/TINMORRY PETG Metallic.bbsflmt |
| 0.4 | TINMORRY PLA Matte | PLA | 1 | dist/bbsflmt/tinmorry/p2s/TINMORRY PLA Matte.bbsflmt |
| 0.4 | TINMORRY PP CF | PP-CF | 1 | dist/bbsflmt/tinmorry/p2s/TINMORRY PP CF.bbsflmt |
| 0.4 | TINMORRY Sparkly PETG | PETG | 1 | dist/bbsflmt/tinmorry/p2s/TINMORRY Sparkly PETG.bbsflmt |
| 0.4 | TINMORRY TPU 95A | TPU | 1 | dist/bbsflmt/tinmorry/p2s/TINMORRY TPU 95A.bbsflmt |
| 0.4 | TINMORRY TPU GF | TPU-GF | 1 | dist/bbsflmt/tinmorry/p2s/TINMORRY TPU GF.bbsflmt |

### Bambu Lab X1

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | TINMORRY ABS Pro | ABS | 1 | dist/bbsflmt/tinmorry/x1/TINMORRY ABS Pro.bbsflmt |
| 0.4 | TINMORRY PET CF | PET-CF | 1 | dist/bbsflmt/tinmorry/x1/TINMORRY PET CF.bbsflmt |
| 0.4 | TINMORRY PETG CF | PETG-CF | 1 | dist/bbsflmt/tinmorry/x1/TINMORRY PETG CF.bbsflmt |
| 0.4 | TINMORRY PETG ECO | PETG | 1 | dist/bbsflmt/tinmorry/x1/TINMORRY PETG ECO.bbsflmt |
| 0.4 | TINMORRY PETG GF | PETG-GF | 1 | dist/bbsflmt/tinmorry/x1/TINMORRY PETG GF.bbsflmt |
| 0.4 | TINMORRY PETG HS | PETG | 1 | dist/bbsflmt/tinmorry/x1/TINMORRY PETG HS.bbsflmt |
| 0.4 | TINMORRY PETG Marble | PETG | 1 | dist/bbsflmt/tinmorry/x1/TINMORRY PETG Marble.bbsflmt |
| 0.4 | TINMORRY PETG Metallic | PETG | 1 | dist/bbsflmt/tinmorry/x1/TINMORRY PETG Metallic.bbsflmt |
| 0.4 | TINMORRY PLA | PLA | 1 | dist/bbsflmt/tinmorry/x1/TINMORRY PLA.bbsflmt |
| 0.4 | TINMORRY PLA CF | PLA-CF | 1 | dist/bbsflmt/tinmorry/x1/TINMORRY PLA CF.bbsflmt |
| 0.4 | TINMORRY PLA Matte | PLA | 1 | dist/bbsflmt/tinmorry/x1/TINMORRY PLA Matte.bbsflmt |
| 0.4 | TINMORRY PLA Silk | PLA | 1 | dist/bbsflmt/tinmorry/x1/TINMORRY PLA Silk.bbsflmt |
| 0.4 | TINMORRY PP CF | PP-CF | 1 | dist/bbsflmt/tinmorry/x1/TINMORRY PP CF.bbsflmt |
| 0.4 | TINMORRY TPU | TPU | 1 | dist/bbsflmt/tinmorry/x1/TINMORRY TPU.bbsflmt |

### Bambu Lab X1 Carbon

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | TINMORRY ABS Pro | ABS | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY ABS Pro.bbsflmt |
| 0.4 | TINMORRY ASA | ASA | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY ASA.bbsflmt |
| 0.4 | TINMORRY PA CF | PA-CF | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY PA CF.bbsflmt |
| 0.4 | TINMORRY PAHT CF | PAHT-CF | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY PAHT CF.bbsflmt |
| 0.4 | TINMORRY PC GF | PC-GF | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY PC GF.bbsflmt |
| 0.4 | TINMORRY PET CF | PET-CF | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY PET CF.bbsflmt |
| 0.4 | TINMORRY PET GF | PET-GF | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY PET GF.bbsflmt |
| 0.4 | TINMORRY PETG CF | PETG-CF | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY PETG CF.bbsflmt |
| 0.4 | TINMORRY PETG ECO | PETG | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY PETG ECO.bbsflmt |
| 0.4 | TINMORRY PETG GF | PETG-GF | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY PETG GF.bbsflmt |
| 0.4 | TINMORRY PETG HS | PETG | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY PETG HS.bbsflmt |
| 0.4 | TINMORRY PETG Marble | PETG | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY PETG Marble.bbsflmt |
| 0.4 | TINMORRY PETG Metallic | PETG | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY PETG Metallic.bbsflmt |
| 0.4 | TINMORRY PLA | PLA | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY PLA.bbsflmt |
| 0.4 | TINMORRY PLA CF | PLA-CF | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY PLA CF.bbsflmt |
| 0.4 | TINMORRY PLA Matte | PLA | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY PLA Matte.bbsflmt |
| 0.4 | TINMORRY PLA Silk | PLA | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY PLA Silk.bbsflmt |
| 0.4 | TINMORRY PP CF | PP-CF | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY PP CF.bbsflmt |
| 0.4 | TINMORRY TPU | TPU | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY TPU.bbsflmt |
| 0.4 | TINMORRY TPU GF | TPU-GF | 1 | dist/bbsflmt/tinmorry/x1-carbon/TINMORRY TPU GF.bbsflmt |

### Bambu Lab X1E

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | TINMORRY PETG CF | PETG-CF | 1 | dist/bbsflmt/tinmorry/x1e/TINMORRY PETG CF.bbsflmt |
| 0.4 | TINMORRY TPU GF | TPU-GF | 1 | dist/bbsflmt/tinmorry/x1e/TINMORRY TPU GF.bbsflmt |

### Bambu Lab X2D

| Nozzles | Material | Type | Profiles | Release artifact |
|---|---|---|---:|---|
| 0.4 | TINMORRY ABS Pro | ABS | 1 | dist/bbsflmt/tinmorry/x2d/TINMORRY ABS Pro.bbsflmt |
| 0.4 | TINMORRY ASA Basic | ASA | 1 | dist/bbsflmt/tinmorry/x2d/TINMORRY ASA Basic.bbsflmt |
| 0.4 | TINMORRY PETG CF | PETG-CF | 1 | dist/bbsflmt/tinmorry/x2d/TINMORRY PETG CF.bbsflmt |
| 0.4 | TINMORRY PETG ECO | PETG | 1 | dist/bbsflmt/tinmorry/x2d/TINMORRY PETG ECO.bbsflmt |
| 0.4 | TINMORRY PETG GF | PETG-GF | 1 | dist/bbsflmt/tinmorry/x2d/TINMORRY PETG GF.bbsflmt |
| 0.4 | TINMORRY PETG Marble | PETG | 1 | dist/bbsflmt/tinmorry/x2d/TINMORRY PETG Marble.bbsflmt |
| 0.4 | TINMORRY PETG Metallic | PETG | 1 | dist/bbsflmt/tinmorry/x2d/TINMORRY PETG Metallic.bbsflmt |
| 0.4 | TINMORRY PLA Matte | PLA | 1 | dist/bbsflmt/tinmorry/x2d/TINMORRY PLA Matte.bbsflmt |
| 0.4 | TINMORRY Sparkly PETG | PETG | 1 | dist/bbsflmt/tinmorry/x2d/TINMORRY Sparkly PETG.bbsflmt |
| 0.4 | TINMORRY TPU 95A | TPU | 1 | dist/bbsflmt/tinmorry/x2d/TINMORRY TPU 95A.bbsflmt |

</details>

<!-- PROFILE_TABLE_END -->

## Basic Workflow

For Bambu Studio import testing, download `all-bbsflmt.zip` from the latest prerelease or release, extract it locally, then import only the `vendor/printer` folders needed for your machines. Pushing an update branch creates a candidate prerelease named `candidate-YYYYMMDD-HHMM-<short_sha>`. After the candidate is accepted and merged to `main`, a profile-changing `main` push creates a stable release named `vYYYYMMDD-HHMM-<short_sha>`. Release notes show the expected Bambu Studio import count, printer counts, and machine-scoped bundle count.

```powershell
npm ci
npm run vendor:status -- --vendor tinmorry
npm run vendor:collect -- --vendor tinmorry --from all
npm run vendor:diff -- --vendor tinmorry
npm run vendor:propose -- --vendor tinmorry
npm run vendor:lock-inputs -- --vendor tinmorry
npm run verify
npm run build:bbsflmt
npm run verify
npm run generate:readme
```

For manual files dropped into `incoming/`, run the same collect/diff/propose review with `--from incoming`, then write accepted profiles with:

```powershell
npm run vendor:ingest -- --vendor <vendor> --from incoming
```

See [operations](docs/operations.md) and [vendor onboarding](docs/vendor-onboarding.md) for the agent workflow.
