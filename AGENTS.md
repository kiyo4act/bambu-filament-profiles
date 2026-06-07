# Agent Operating Guide

This repository manages Bambu Studio filament profiles as reviewable JSON source files and generates `.bbsflmt` release assets.

## Goal

- Keep normalized Bambu Studio filament JSON in `vendors/<vendor>/profiles/`.
- Generate `.bbsflmt` files from JSON; never treat `.bbsflmt` as source of truth.
- Make future updates repeatable by agents without re-learning the TINMORRY context.
- Prefer PR + candidate prerelease workflows over direct `main` mutation for upstream updates.

## Standard Commands

- `npm run vendor:status -- --vendor tinmorry`
- `npm run vendor:update -- --vendor tinmorry`
- `npm run vendor:ingest -- --vendor <vendor> --from incoming`
- `npm run verify`
- `npm run build:bbsflmt`
- `npm run generate:readme`

Run `npm run verify` before reporting work complete. Run `npm run build:bbsflmt` when release artifacts or bundle validation matter.

## Repository Contract

- Source JSON lives under `vendors/<vendor>/profiles/<family>/<printer>/nozzle-<diameter>.json`.
- Vendor source definitions live in `vendors/<vendor>/sources.yml`.
- Vendor-specific normalization rules live in `vendors/<vendor>/normalization.yml`.
- Manual/user-supplied files enter through `incoming/<vendor>/`.
- Generated `.bbsflmt` files go under `dist/` and GitHub Release assets, not `main`.
- Reports under `vendors/<vendor>/reports/` are committed because they explain update decisions.

## TINMORRY Rules

- Prefer `TINMORRY/Tinmorry-Bambu_BambuStudio` `.bbsflmt` profiles.
- Use `TINMORRY/TINMORRY-filament-profile-for-Bambu-printers` JSON only to fill gaps.
- Normalize Unicode with NFKC and absorb whitespace, brackets, case, full-width punctuation, and stray symbols.
- Keep `PET` and `PETG` separate.
- Split `PET CF GF` sources into both `TINMORRY PET CF` and `TINMORRY PET GF`.
- Do not confuse `A1 mini` with `A1`, or `X1C` with `X1`.
- If classification, printer inference, bundle consistency, or same-key conflict cannot be resolved, fail the update.

## Human Gate

Automated checks validate structure, naming, and bundle integrity. They do not prove that Bambu Studio imports every bundle correctly or that the profile prints well. Candidate releases are for human import testing before merging into `main`.

