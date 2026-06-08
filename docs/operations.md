# Operations Runbook

This repository is an AI-led local update workflow, not an automatic upstream converter.

## Normal Upstream Update

1. Ask AI to update a vendor, for example TINMORRY.
2. AI starts from local `main` and checks upstream state:

   ```powershell
   npm ci
   npm run vendor:status -- --vendor tinmorry
   ```

3. AI collects and expands inputs into `.work/`, without touching committed profiles:

   ```powershell
   npm run vendor:collect -- --vendor tinmorry --from all
   npm run vendor:diff -- --vendor tinmorry
   npm run vendor:propose -- --vendor tinmorry
   ```

4. AI reviews `.work/extracted/<vendor>/reports/`, especially `diff.md`, `proposal-summary.md`, and `decision-requests.md`.
5. If a new material/printer/inherits decision is needed, AI asks you before changing normalized JSON.
6. After the decision is accepted, AI edits `vendors/<vendor>/profiles/`, expands inherited profiles, and records the reasoning in vendor reports or a decision log.
7. AI runs:

   ```powershell
   npm run profiles:expand-inherits -- --vendor tinmorry
   npm run vendor:lock-inputs -- --vendor tinmorry
   npm run verify
   npm run build:bbsflmt
   npm run verify
   npm run generate:readme
   ```

8. AI commits and pushes the normalized JSON state to `main`. GitHub Actions automatically creates a candidate prerelease with `all-bbsflmt.zip`, `all-json.zip`, and `manifest.json`.
9. Download `all-bbsflmt.zip` from the candidate prerelease, extract it locally, and import the contained `.bbsflmt` files in Bambu Studio.
10. Merge to `main` only after the candidate is acceptable.

## Manual Profile Addition

1. Put files under `incoming/<vendor>/`. JSON, `.bbsflmt`, and zip files are supported.
2. Ask AI to ingest the incoming files.
3. AI runs:

   ```powershell
   npm run vendor:collect -- --vendor <vendor> --from incoming
   npm run vendor:diff -- --vendor <vendor>
   npm run vendor:propose -- --vendor <vendor>
   ```

4. AI asks about any new decision requests, then updates committed JSON.
5. AI locks the accepted input hashes, verifies, and builds aggregate release artifacts locally.

## What Actions Do

Actions can:

- run `verify`
- build `.bbsflmt` bundles from committed JSON
- upload `all-bbsflmt.zip`, `all-json.zip`, and `manifest.json`
- create a candidate prerelease automatically on `main` push
- show expected import counts in release notes
- detect upstream HEAD changes and write a summary

Actions do not:

- fetch upstream profile contents for normalization
- decide material grouping
- rewrite JSON
- create update PRs automatically
- merge to `main`

## Human Gate

Automation can validate JSON shape and bundle structure. It cannot prove that every Bambu Studio version shows every vendor/material in the printer UI, or that a profile prints well. Candidate releases exist so you can import-test before accepting the update.
