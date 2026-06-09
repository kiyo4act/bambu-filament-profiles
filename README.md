# Bambu Filament Profiles

Reviewable Bambu Studio filament profiles with generated `.bbsflmt` release bundles.

This repository is built for ongoing maintenance by a coding agent:

- JSON under `vendors/<vendor>/profiles/` is the source of truth.
- `.bbsflmt` files are generated artifacts for GitHub Releases.
- Upstream repositories can be monitored, collected, diffed, and reviewed locally by AI.
- User-made or third-party profiles can be dropped directly into `incoming/` and reviewed through the same diff/proposal workflow by passing `--vendor <vendor>`.
- GitHub Actions package committed JSON into user-facing archives; they do not decide normalization.
- Update branches under `agent/update/**` create candidate prereleases automatically; the agent then opens a PR for human import testing and merge review.

## Current Vendors

<!-- PROFILE_TABLE_START -->

| Vendor | Material | Type | Profiles | Release artifact |
|---|---|---:|---:|---|
| eSUN | eSUN ABS | ABS | 11 | dist/bbsflmt/esun/eSUN ABS.bbsflmt |
| eSUN | eSUN ABS-CF | ABS-GF | 9 | dist/bbsflmt/esun/eSUN ABS-CF.bbsflmt |
| eSUN | eSUN ABS-ESD | ABS | 11 | dist/bbsflmt/esun/eSUN ABS-ESD.bbsflmt |
| eSUN | eSUN ABS-FR | ABS | 11 | dist/bbsflmt/esun/eSUN ABS-FR.bbsflmt |
| eSUN | eSUN ABS-GF | ABS | 9 | dist/bbsflmt/esun/eSUN ABS-GF.bbsflmt |
| eSUN | eSUN ABS-HT | ABS | 1 | dist/bbsflmt/esun/eSUN ABS-HT.bbsflmt |
| eSUN | eSUN ABS+ | ABS | 11 | dist/bbsflmt/esun/eSUN ABS+.bbsflmt |
| eSUN | eSUN ABS+CF | ABS | 2 | dist/bbsflmt/esun/eSUN ABS+CF.bbsflmt |
| eSUN | eSUN ABS+GF | ABS | 2 | dist/bbsflmt/esun/eSUN ABS+GF.bbsflmt |
| eSUN | eSUN ABS+HS | ABS | 11 | dist/bbsflmt/esun/eSUN ABS+HS.bbsflmt |
| eSUN | eSUN ASA-LW | ASA | 9 | dist/bbsflmt/esun/eSUN ASA-LW.bbsflmt |
| eSUN | eSUN ASA+ | ASA | 9 | dist/bbsflmt/esun/eSUN ASA+.bbsflmt |
| eSUN | eSUN Marble PLA | PLA | 1 | dist/bbsflmt/esun/eSUN Marble PLA.bbsflmt |
| eSUN | eSUN PA | PA | 8 | dist/bbsflmt/esun/eSUN PA.bbsflmt |
| eSUN | eSUN PA-CF | PA-CF | 13 | dist/bbsflmt/esun/eSUN PA-CF.bbsflmt |
| eSUN | eSUN PA12-CF | PA-CF | 1 | dist/bbsflmt/esun/eSUN PA12-CF.bbsflmt |
| eSUN | eSUN PA12+CF | PA-CF | 12 | dist/bbsflmt/esun/eSUN PA12+CF.bbsflmt |
| eSUN | eSUN PA6-CF | PA-CF | 9 | dist/bbsflmt/esun/eSUN PA6-CF.bbsflmt |
| eSUN | eSUN PC | PC | 7 | dist/bbsflmt/esun/eSUN PC.bbsflmt |
| eSUN | eSUN PC-ESD | PC | 9 | dist/bbsflmt/esun/eSUN PC-ESD.bbsflmt |
| eSUN | eSUN PC-HT | PC | 2 | dist/bbsflmt/esun/eSUN PC-HT.bbsflmt |
| eSUN | eSUN PEBA | TPU | 1 | dist/bbsflmt/esun/eSUN PEBA.bbsflmt |
| eSUN | eSUN PEBA-85A | TPU | 15 | dist/bbsflmt/esun/eSUN PEBA-85A.bbsflmt |
| eSUN | eSUN PEBA-90A | TPU | 15 | dist/bbsflmt/esun/eSUN PEBA-90A.bbsflmt |
| eSUN | eSUN PEBA-LW | TPU | 15 | dist/bbsflmt/esun/eSUN PEBA-LW.bbsflmt |
| eSUN | eSUN PET-CF | PET-CF | 7 | dist/bbsflmt/esun/eSUN PET-CF.bbsflmt |
| eSUN | eSUN PETG | PETG | 11 | dist/bbsflmt/esun/eSUN PETG.bbsflmt |
| eSUN | eSUN PETG Basic | PETG | 1 | dist/bbsflmt/esun/eSUN PETG Basic.bbsflmt |
| eSUN | eSUN PETG Luminous | PETG | 1 | dist/bbsflmt/esun/eSUN PETG Luminous.bbsflmt |
| eSUN | eSUN PETG-Basic | PETG | 10 | dist/bbsflmt/esun/eSUN PETG-Basic.bbsflmt |
| eSUN | eSUN PETG-CF | PETG-CF | 11 | dist/bbsflmt/esun/eSUN PETG-CF.bbsflmt |
| eSUN | eSUN PETG-ESD | PETG | 11 | dist/bbsflmt/esun/eSUN PETG-ESD.bbsflmt |
| eSUN | eSUN PETG-Luminous | PETG | 8 | dist/bbsflmt/esun/eSUN PETG-Luminous.bbsflmt |
| eSUN | eSUN PETG-Matte | PETG | 10 | dist/bbsflmt/esun/eSUN PETG-Matte.bbsflmt |
| eSUN | eSUN PETG+HS | PETG | 11 | dist/bbsflmt/esun/eSUN PETG+HS.bbsflmt |
| eSUN | eSUN PLA Magic | PLA | 2 | dist/bbsflmt/esun/eSUN PLA Magic.bbsflmt |
| eSUN | eSUN PLA Metal | PLA | 1 | dist/bbsflmt/esun/eSUN PLA Metal.bbsflmt |
| eSUN | eSUN PLA-Basic | PLA | 11 | dist/bbsflmt/esun/eSUN PLA-Basic.bbsflmt |
| eSUN | eSUN PLA-CF | PLA-CF | 12 | dist/bbsflmt/esun/eSUN PLA-CF.bbsflmt |
| eSUN | eSUN PLA-Clear | PLA | 11 | dist/bbsflmt/esun/eSUN PLA-Clear.bbsflmt |
| eSUN | eSUN PLA-HS | PLA | 12 | dist/bbsflmt/esun/eSUN PLA-HS.bbsflmt |
| eSUN | eSUN PLA-Lite | PLA | 12 | dist/bbsflmt/esun/eSUN PLA-Lite.bbsflmt |
| eSUN | eSUN PLA-Luminous | PLA | 11 | dist/bbsflmt/esun/eSUN PLA-Luminous.bbsflmt |
| eSUN | eSUN PLA-LW | PLA | 12 | dist/bbsflmt/esun/eSUN PLA-LW.bbsflmt |
| eSUN | eSUN PLA-Magic | PLA | 9 | dist/bbsflmt/esun/eSUN PLA-Magic.bbsflmt |
| eSUN | eSUN PLA-Marble | PLA | 10 | dist/bbsflmt/esun/eSUN PLA-Marble.bbsflmt |
| eSUN | eSUN PLA-Matte | PLA | 12 | dist/bbsflmt/esun/eSUN PLA-Matte.bbsflmt |
| eSUN | eSUN PLA-Metal | PLA | 10 | dist/bbsflmt/esun/eSUN PLA-Metal.bbsflmt |
| eSUN | eSUN PLA-Silk | PLA | 12 | dist/bbsflmt/esun/eSUN PLA-Silk.bbsflmt |
| eSUN | eSUN PLA-ST | PLA | 8 | dist/bbsflmt/esun/eSUN PLA-ST.bbsflmt |
| eSUN | eSUN PLA-Twinking | PLA | 1 | dist/bbsflmt/esun/eSUN PLA-Twinking.bbsflmt |
| eSUN | eSUN PLA-Twinkle | PLA | 6 | dist/bbsflmt/esun/eSUN PLA-Twinkle.bbsflmt |
| eSUN | eSUN PLA-Twinkling | PLA | 4 | dist/bbsflmt/esun/eSUN PLA-Twinkling.bbsflmt |
| eSUN | eSUN PLA-UV Rock | PLA | 5 | dist/bbsflmt/esun/eSUN PLA-UV Rock.bbsflmt |
| eSUN | eSUN PLA-Wood | PLA | 12 | dist/bbsflmt/esun/eSUN PLA-Wood.bbsflmt |
| eSUN | eSUN PLA+ | PLA | 15 | dist/bbsflmt/esun/eSUN PLA+.bbsflmt |
| eSUN | eSUN PLA+HS | PLA | 11 | dist/bbsflmt/esun/eSUN PLA+HS.bbsflmt |
| eSUN | eSUN TPE-83A | TPU | 15 | dist/bbsflmt/esun/eSUN TPE-83A.bbsflmt |
| eSUN | eSUN TPU | TPU | 1 | dist/bbsflmt/esun/eSUN TPU.bbsflmt |
| eSUN | eSUN TPU-64D | TPU | 13 | dist/bbsflmt/esun/eSUN TPU-64D.bbsflmt |
| eSUN | eSUN TPU-80A | TPU | 1 | dist/bbsflmt/esun/eSUN TPU-80A.bbsflmt |
| eSUN | eSUN TPU-85A | TPU | 13 | dist/bbsflmt/esun/eSUN TPU-85A.bbsflmt |
| eSUN | eSUN TPU-90A | TPU | 15 | dist/bbsflmt/esun/eSUN TPU-90A.bbsflmt |
| eSUN | eSUN TPU-95A | TPU | 13 | dist/bbsflmt/esun/eSUN TPU-95A.bbsflmt |
| eSUN | eSUN TPU-LW | TPU | 11 | dist/bbsflmt/esun/eSUN TPU-LW.bbsflmt |
| eSUN | eSUN UV Rock PLA | PLA | 6 | dist/bbsflmt/esun/eSUN UV Rock PLA.bbsflmt |
| Polymaker | Polymaker ABS Max | ABS | 6 | dist/bbsflmt/polymaker/Polymaker ABS Max.bbsflmt |
| Polymaker | Polymaker ABS Pro | ABS | 8 | dist/bbsflmt/polymaker/Polymaker ABS Pro.bbsflmt |
| Polymaker | Polymaker ABS Pro Galaxy | ABS | 8 | dist/bbsflmt/polymaker/Polymaker ABS Pro Galaxy.bbsflmt |
| Polymaker | Polymaker ASA | ASA | 3 | dist/bbsflmt/polymaker/Polymaker ASA.bbsflmt |
| Polymaker | Polymaker Fiberon ASA-CF08 | ASA | 5 | dist/bbsflmt/polymaker/Polymaker Fiberon ASA-CF08.bbsflmt |
| Polymaker | Polymaker Fiberon PA12-CF10 | PA-CF | 9 | dist/bbsflmt/polymaker/Polymaker Fiberon PA12-CF10.bbsflmt |
| Polymaker | Polymaker Fiberon PA6-CF20 | PA6-CF | 9 | dist/bbsflmt/polymaker/Polymaker Fiberon PA6-CF20.bbsflmt |
| Polymaker | Polymaker Fiberon PA6-GF25 | PA-GF | 9 | dist/bbsflmt/polymaker/Polymaker Fiberon PA6-GF25.bbsflmt |
| Polymaker | Polymaker Fiberon PA612-CF15 | PA-CF | 9 | dist/bbsflmt/polymaker/Polymaker Fiberon PA612-CF15.bbsflmt |
| Polymaker | Polymaker Fiberon PA612-ESD | PA-CF | 5 | dist/bbsflmt/polymaker/Polymaker Fiberon PA612-ESD.bbsflmt |
| Polymaker | Polymaker Fiberon PET-CF17 | PET-CF | 9 | dist/bbsflmt/polymaker/Polymaker Fiberon PET-CF17.bbsflmt |
| Polymaker | Polymaker Fiberon PET-GF15 | PET-CF | 5 | dist/bbsflmt/polymaker/Polymaker Fiberon PET-GF15.bbsflmt |
| Polymaker | Polymaker Fiberon PETG-ESD | PETG | 8 | dist/bbsflmt/polymaker/Polymaker Fiberon PETG-ESD.bbsflmt |
| Polymaker | Polymaker Fiberon PETG-rCF08 | PETG-CF | 8 | dist/bbsflmt/polymaker/Polymaker Fiberon PETG-rCF08.bbsflmt |
| Polymaker | Polymaker Fiberon PPS-CF10 | PPS-CF | 2 | dist/bbsflmt/polymaker/Polymaker Fiberon PPS-CF10.bbsflmt |
| Polymaker | Polymaker Fiberon PPS-GF20 | PPS-CF | 3 | dist/bbsflmt/polymaker/Polymaker Fiberon PPS-GF20.bbsflmt |
| Polymaker | Polymaker HT-PLA | PLA | 9 | dist/bbsflmt/polymaker/Polymaker HT-PLA.bbsflmt |
| Polymaker | Polymaker HT-PLA-GF | PLA | 5 | dist/bbsflmt/polymaker/Polymaker HT-PLA-GF.bbsflmt |
| Polymaker | Polymaker Panchroma CoPE | PLA | 12 | dist/bbsflmt/polymaker/Polymaker Panchroma CoPE.bbsflmt |
| Polymaker | Polymaker Panchroma PLA | PLA | 11 | dist/bbsflmt/polymaker/Polymaker Panchroma PLA.bbsflmt |
| Polymaker | Polymaker Panchroma PLA Celestial | PLA | 12 | dist/bbsflmt/polymaker/Polymaker Panchroma PLA Celestial.bbsflmt |
| Polymaker | Polymaker Panchroma PLA Galaxy | PLA | 12 | dist/bbsflmt/polymaker/Polymaker Panchroma PLA Galaxy.bbsflmt |
| Polymaker | Polymaker Panchroma PLA Glow | PLA | 12 | dist/bbsflmt/polymaker/Polymaker Panchroma PLA Glow.bbsflmt |
| Polymaker | Polymaker Panchroma PLA Luminous | PLA | 12 | dist/bbsflmt/polymaker/Polymaker Panchroma PLA Luminous.bbsflmt |
| Polymaker | Polymaker Panchroma PLA Marble | PLA | 10 | dist/bbsflmt/polymaker/Polymaker Panchroma PLA Marble.bbsflmt |
| Polymaker | Polymaker Panchroma PLA Matte | PLA | 10 | dist/bbsflmt/polymaker/Polymaker Panchroma PLA Matte.bbsflmt |
| Polymaker | Polymaker Panchroma PLA Metallic | PLA | 12 | dist/bbsflmt/polymaker/Polymaker Panchroma PLA Metallic.bbsflmt |
| Polymaker | Polymaker Panchroma PLA Neon | PLA | 12 | dist/bbsflmt/polymaker/Polymaker Panchroma PLA Neon.bbsflmt |
| Polymaker | Polymaker Panchroma PLA Satin | PLA | 11 | dist/bbsflmt/polymaker/Polymaker Panchroma PLA Satin.bbsflmt |
| Polymaker | Polymaker Panchroma PLA Silk | PLA | 11 | dist/bbsflmt/polymaker/Polymaker Panchroma PLA Silk.bbsflmt |
| Polymaker | Polymaker Panchroma PLA Starlight | PLA | 12 | dist/bbsflmt/polymaker/Polymaker Panchroma PLA Starlight.bbsflmt |
| Polymaker | Polymaker Panchroma PLA Translucent | PLA | 12 | dist/bbsflmt/polymaker/Polymaker Panchroma PLA Translucent.bbsflmt |
| Polymaker | Polymaker Panchroma PLA UV Shift | PLA | 12 | dist/bbsflmt/polymaker/Polymaker Panchroma PLA UV Shift.bbsflmt |
| Polymaker | Polymaker PETG | PETG | 11 | dist/bbsflmt/polymaker/Polymaker PETG.bbsflmt |
| Polymaker | Polymaker PETG Galaxy | PETG | 11 | dist/bbsflmt/polymaker/Polymaker PETG Galaxy.bbsflmt |
| Polymaker | Polymaker PLA | PLA | 5 | dist/bbsflmt/polymaker/Polymaker PLA.bbsflmt |
| Polymaker | Polymaker PLA Pro | PLA | 11 | dist/bbsflmt/polymaker/Polymaker PLA Pro.bbsflmt |
| Polymaker | Polymaker PLA Pro Metallic | PLA | 11 | dist/bbsflmt/polymaker/Polymaker PLA Pro Metallic.bbsflmt |
| Polymaker | Polymaker PolyCast | PLA | 1 | dist/bbsflmt/polymaker/Polymaker PolyCast.bbsflmt |
| Polymaker | Polymaker PolyFlex TPU95 | TPU | 5 | dist/bbsflmt/polymaker/Polymaker PolyFlex TPU95.bbsflmt |
| Polymaker | Polymaker PolyFlex TPU95-HF | TPU | 2 | dist/bbsflmt/polymaker/Polymaker PolyFlex TPU95-HF.bbsflmt |
| Polymaker | Polymaker PolyLite ABS | ABS | 2 | dist/bbsflmt/polymaker/Polymaker PolyLite ABS.bbsflmt |
| Polymaker | Polymaker PolyLite CosPLA | PLA | 11 | dist/bbsflmt/polymaker/Polymaker PolyLite CosPLA.bbsflmt |
| Polymaker | Polymaker PolyLite LW-PLA | PLA | 2 | dist/bbsflmt/polymaker/Polymaker PolyLite LW-PLA.bbsflmt |
| Polymaker | Polymaker PolyLite PC | PC | 1 | dist/bbsflmt/polymaker/Polymaker PolyLite PC.bbsflmt |
| Polymaker | Polymaker PolyLite PETG | PETG | 1 | dist/bbsflmt/polymaker/Polymaker PolyLite PETG.bbsflmt |
| Polymaker | Polymaker PolyLite PETG Translucent | PETG | 1 | dist/bbsflmt/polymaker/Polymaker PolyLite PETG Translucent.bbsflmt |
| Polymaker | Polymaker PolyLite PLA | PLA | 12 | dist/bbsflmt/polymaker/Polymaker PolyLite PLA.bbsflmt |
| Polymaker | Polymaker PolyLite PLA Galaxy | PLA | 12 | dist/bbsflmt/polymaker/Polymaker PolyLite PLA Galaxy.bbsflmt |
| Polymaker | Polymaker PolyLite PLA Glow | PLA | 12 | dist/bbsflmt/polymaker/Polymaker PolyLite PLA Glow.bbsflmt |
| Polymaker | Polymaker PolyLite PLA Luminous | PLA | 12 | dist/bbsflmt/polymaker/Polymaker PolyLite PLA Luminous.bbsflmt |
| Polymaker | Polymaker PolyLite PLA Neon | PLA | 12 | dist/bbsflmt/polymaker/Polymaker PolyLite PLA Neon.bbsflmt |
| Polymaker | Polymaker PolyLite PLA Pro | PLA | 5 | dist/bbsflmt/polymaker/Polymaker PolyLite PLA Pro.bbsflmt |
| Polymaker | Polymaker PolyLite PLA Pro Metallic | PLA | 5 | dist/bbsflmt/polymaker/Polymaker PolyLite PLA Pro Metallic.bbsflmt |
| Polymaker | Polymaker PolyLite PLA Starlight | PLA | 12 | dist/bbsflmt/polymaker/Polymaker PolyLite PLA Starlight.bbsflmt |
| Polymaker | Polymaker PolyLite PLA Translucent | PLA | 12 | dist/bbsflmt/polymaker/Polymaker PolyLite PLA Translucent.bbsflmt |
| Polymaker | Polymaker PolyLite PLA-CF | PLA-CF | 1 | dist/bbsflmt/polymaker/Polymaker PolyLite PLA-CF.bbsflmt |
| Polymaker | Polymaker PolyMax PC | PC | 1 | dist/bbsflmt/polymaker/Polymaker PolyMax PC.bbsflmt |
| Polymaker | Polymaker PolyMax PETG | PETG | 1 | dist/bbsflmt/polymaker/Polymaker PolyMax PETG.bbsflmt |
| Polymaker | Polymaker PolyMax PLA | PLA | 4 | dist/bbsflmt/polymaker/Polymaker PolyMax PLA.bbsflmt |
| Polymaker | Polymaker PolySmooth | PVB | 1 | dist/bbsflmt/polymaker/Polymaker PolySmooth.bbsflmt |
| Polymaker | Polymaker PolySupport | PLA | 1 | dist/bbsflmt/polymaker/Polymaker PolySupport.bbsflmt |
| Polymaker | Polymaker PolySupport for PA12 | PA | 1 | dist/bbsflmt/polymaker/Polymaker PolySupport for PA12.bbsflmt |
| Polymaker | Polymaker PolyTerra PLA | PLA | 10 | dist/bbsflmt/polymaker/Polymaker PolyTerra PLA.bbsflmt |
| Polymaker | Polymaker PolyTerra PLA Marble | PLA | 10 | dist/bbsflmt/polymaker/Polymaker PolyTerra PLA Marble.bbsflmt |
| Polymaker | Polymaker PolyTerra PLA+ | PLA | 11 | dist/bbsflmt/polymaker/Polymaker PolyTerra PLA+.bbsflmt |
| SUNLU | SUNLU ASA BASIC | ASA | 7 | dist/bbsflmt/sunlu/SUNLU ASA BASIC.bbsflmt |
| SUNLU | SUNLU PETG BASIC | PETG | 8 | dist/bbsflmt/sunlu/SUNLU PETG BASIC.bbsflmt |
| SUNLU | SUNLU PETG HS Matte | PETG | 6 | dist/bbsflmt/sunlu/SUNLU PETG HS Matte.bbsflmt |
| SUNLU | SUNLU PLA + | PLA | 6 | dist/bbsflmt/sunlu/SUNLU PLA +.bbsflmt |
| SUNLU | SUNLU PLA + 2.0 | PLA | 8 | dist/bbsflmt/sunlu/SUNLU PLA + 2.0.bbsflmt |
| SUNLU | SUNLU PLA + Silk | PLA | 8 | dist/bbsflmt/sunlu/SUNLU PLA + Silk.bbsflmt |
| SUNLU | SUNLU PLA Marble | PLA | 6 | dist/bbsflmt/sunlu/SUNLU PLA Marble.bbsflmt |
| SUNLU | SUNLU PLA Matte | PLA | 8 | dist/bbsflmt/sunlu/SUNLU PLA Matte.bbsflmt |
| SUNLU | SUNLU PLA Wood | PLA | 6 | dist/bbsflmt/sunlu/SUNLU PLA Wood.bbsflmt |
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
| TINMORRY | TINMORRY PETG Matte | PETG | 2 | dist/bbsflmt/tinmorry/TINMORRY PETG Matte.bbsflmt |
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

For Bambu Studio import testing, download `all-bbsflmt.zip` from the latest prerelease or release, extract it locally, then import the contained `.bbsflmt` files. Pushing an update branch creates a candidate prerelease named `candidate-YYYYMMDD-HHMM-<short_sha>`. After the candidate is accepted and merged to `main`, a profile-changing `main` push creates a stable release named `vYYYYMMDD-HHMM-<short_sha>`. Release notes show the expected Bambu Studio import count before the material list.

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
