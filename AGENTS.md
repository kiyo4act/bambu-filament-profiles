# Agent Operating Guide

This repository manages Bambu Studio filament profiles as reviewable JSON source files. The working model is AI-led local maintenance plus GitHub Actions packaging.

## Goal

- Keep normalized Bambu Studio filament JSON in `vendors/<vendor>/profiles/`.
- Treat upstream repositories, `.bbsflmt`, zip files, and `incoming/<vendor>/` files as inputs only.
- Expand `.bbsflmt` to JSON before review. Do not treat `.bbsflmt` as source of truth.
- Let the local AI workflow collect inputs, inspect diffs, propose normalization decisions, ask the user when a new decision is needed, then commit normalized JSON.
- Let GitHub Actions validate and package committed JSON only.

## Standard Commands

- `npm run vendor:status -- --vendor tinmorry`
- `npm run vendor:collect -- --vendor tinmorry --from all`
- `npm run vendor:diff -- --vendor tinmorry`
- `npm run vendor:propose -- --vendor tinmorry`
- `npm run vendor:lock-inputs -- --vendor tinmorry`
- `npm run profiles:expand-inherits -- --vendor tinmorry`
- `npm run verify`
- `npm run build:bbsflmt`
- `npm run generate:readme`

Run `npm run verify` before reporting work complete. Run `npm run build:bbsflmt` when release artifacts or bundle validation matter.

## Repository Contract

- Source JSON lives under `vendors/<vendor>/profiles/<family>/<printer>/nozzle-<diameter>.json`.
- Vendor source definitions live in `vendors/<vendor>/sources.yml`.
- Do not add vendor-specific automatic normalization rule files for material spelling, printer spelling, or exception handling.
- Prior decisions belong in decision logs and reports as context for AI review, not as code that silently rewrites future inputs.
- Manual/user-supplied files enter through `incoming/<vendor>/`.
- `vendor:collect`, `vendor:diff`, and `vendor:propose` write to `.work/extracted/<vendor>/`; those reports are review material, not committed source by default.
- After AI/user acceptance and normalized JSON updates, `vendor:lock-inputs` may commit the accepted input hashes so unchanged inputs are not re-reviewed next time.
- Generated `.bbsflmt` files go under `dist/` and GitHub Release assets, not `main`.
- GitHub Releases upload aggregate archives and manifest only: `all-bbsflmt.zip`, `all-json.zip`, and `manifest.json`.
- Release notes must include expected Bambu Studio import count, vendor counts, printer counts, and bundle count.

## Normalization Principles

- Unknown spelling drift must be surfaced in `decision-requests.md`; do not silently encode it as a vendor-specific rule.
- Reuse prior decisions only when the source hash/text and target interpretation are effectively the same.
- Keep `PET` and `PETG` separate for every vendor.
- Treat `PET CF GF` style labels as split/decision candidates, not as one silently merged family.
- Detect printer names token-by-token; never infer `A1` from `A1 mini`, or `X1` from `X1C`/`X1 Carbon`.
- Normalized committed JSON must have visible `filament_vendor`, exactly one `compatible_printers` entry, matching `name` and `filament_settings_id[0]`, and `inherits: ""`.
- If a profile inherits from a Bambu Studio system preset, expand parent to child before commit. Use `profiles:expand-inherits` locally after the normalization decision is accepted.

## Automation Boundary

- Actions do not fetch upstreams, normalize, or create update PRs.
- `watch-upstreams` is detection-only and writes a summary.
- Candidate and release workflows only run `verify`, `build:bbsflmt`, and upload aggregate user-facing assets.
- Main merges remain human-gated because Bambu Studio UI visibility and print behavior cannot be fully proven by JSON validation.
